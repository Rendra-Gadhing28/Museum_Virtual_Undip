    import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CULLING_CONFIG } from './CullingConfig'
import { ChunkGrid, type CulledEntity } from './ChunkGrid'
import { AdaptiveQuality } from './AdaptiveQuality'
import { LODController } from './LODController'

export interface CullingStats {
  fps: number
  avgFps: number
  drawCalls: number
  triangles: number
  geometries: number
  textures: number
  totalChunks: number
  activeChunks: number
  totalEntities: number
  visibleEntities: number
  dprScale: number
  isThrottled: boolean
}

export interface CullingContextType {
  grid: ChunkGrid
  lod: LODController
  stats: CullingStats
  registerEntity: (id: string, object: THREE.Object3D, isDynamic?: boolean, radius?: number) => CulledEntity
  unregisterEntity: (id: string) => void
}

const CullingContext = createContext<CullingContextType | null>(null)

export function useCulling() {
  const ctx = useContext(CullingContext)
  if (!ctx) {
    throw new Error('useCulling must be used within a <CullingManager> provider')
  }
  return ctx
}

interface CullingManagerProps {
  children?: ReactNode
  enabled?: boolean
  onStatsUpdate?: (stats: CullingStats) => void
}

/**
 * Production-Grade Entity Culling Manager
 * High-performance orchestrator implementing:
 * 1. Uniform Grid Spatial Partitioning (ChunkGrid)
 * 2. POV Frustum Culling with preallocated math objects (0 GC in render loop)
 * 3. Distance Culling with Hysteresis (showDistanceSq vs hideDistanceSq)
 * 4. Staggered & Motion-Thresholded Updates
 * 5. Raycast Disabling for culled entities
 */
export function CullingManager({
  children,
  enabled = true,
  onStatsUpdate,
}: CullingManagerProps) {
  const { gl, camera } = useThree()

  const grid = useMemo(() => new ChunkGrid(CULLING_CONFIG.chunkSize), [])
  const lod = useMemo(() => new LODController(), [])
  const adaptive = useMemo(() => new AdaptiveQuality(), [])

  // Preallocated math objects — STRICTLY ZERO ALLOCATION IN RENDER LOOP
  const frustum = useMemo(() => new THREE.Frustum(), [])
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), [])
  const testSphere = useMemo(() => new THREE.Sphere(), [])
  const lastCamPos = useMemo(() => new THREE.Vector3(), [])
  const lastCamRot = useMemo(() => new THREE.Euler(), [])

  const frameCountRef = useRef(0)
  const isInitializedRef = useRef(false)

  const [stats, setStats] = useState<CullingStats>({
    fps: 60,
    avgFps: 60,
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    totalChunks: 0,
    activeChunks: 0,
    totalEntities: 0,
    visibleEntities: 0,
    dprScale: 1.0,
    isThrottled: false,
  })

  // Dummy raycast that returns early for culled objects
  const dummyRaycast = useRef(() => {})

  useFrame(() => {
    if (!enabled) return

    frameCountRef.current++
    const metrics = adaptive.update()

    // Motion threshold calculation
    const camPos = camera.position
    const dx = camPos.x - lastCamPos.x
    const dy = camPos.y - lastCamPos.y
    const dz = camPos.z - lastCamPos.z
    const moveDistSq = dx * dx + dy * dy + dz * dz

    const dPitch = camera.rotation.x - lastCamRot.x
    const dYaw = camera.rotation.y - lastCamRot.y
    const rotDistSq = dPitch * dPitch + dYaw * dYaw

    const shouldUpdateCulling =
      !isInitializedRef.current ||
      moveDistSq >= CULLING_CONFIG.cameraMoveThresholdSq ||
      rotDistSq >= CULLING_CONFIG.cameraRotThresholdSq ||
      frameCountRef.current % CULLING_CONFIG.updateInterval === 0

    if (shouldUpdateCulling) {
      isInitializedRef.current = true
      lastCamPos.copy(camPos)
      lastCamRot.copy(camera.rotation)

      // Update dynamic entity grid cells
      grid.updateDynamicEntities()

      // Calculate camera frustum
      camera.updateMatrixWorld()
      projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      frustum.setFromProjectionMatrix(projScreenMatrix)

      const { showDistanceSq, hideDistanceSq } = adaptive.getEffectiveDistances()

      // Traverse chunks
      for (const chunk of grid.getAllChunks()) {
        const chunkCenter = chunk.boundingSphere.center
        const cdx = camPos.x - chunkCenter.x
        const cdy = camPos.y - chunkCenter.y
        const cdz = camPos.z - chunkCenter.z
        const chunkDistSq = cdx * cdx + cdy * cdy + cdz * cdz

        // Test chunk against distance + radius
        const maxDist = Math.sqrt(hideDistanceSq) + chunk.boundingSphere.radius
        const isWithinRange = chunkDistSq <= maxDist * maxDist
        const inFrustum = isWithinRange && frustum.intersectsSphere(chunk.boundingSphere)

        chunk.isVisible = inFrustum

        if (!chunk.isVisible) {
          // Coarse cull: chunk is out of view, hide all entities inside instantly
          for (let i = 0; i < chunk.entities.length; i++) {
            const entity = chunk.entities[i]
            if (entity.visible) {
              entity.visible = false
              entity.object.visible = false
              entity.object.raycast = dummyRaycast.current
            }
          }
          continue
        }

        // Fine cull: evaluate entities inside visible chunk
        for (let i = 0; i < chunk.entities.length; i++) {
          const entity = chunk.entities[i]
          const pos = entity.worldPosition
          const edx = camPos.x - pos.x
          const edy = camPos.y - pos.y
          const edz = camPos.z - pos.z
          const entDistSq = edx * edx + edy * edy + edz * edz

          // Hysteresis distance check
          let inDistance = entity.visible
            ? entDistSq <= hideDistanceSq // currently visible, use hideDistance
            : entDistSq <= showDistanceSq // currently hidden, use showDistance

          let isVisible = inDistance
          if (isVisible) {
            // Test frustum against entity bounding sphere
            testSphere.center.copy(pos)
            testSphere.radius = entity.radius
            isVisible = frustum.intersectsSphere(testSphere)
          }

          if (entity.visible !== isVisible) {
            entity.visible = isVisible
            entity.object.visible = isVisible
            if (isVisible) {
              entity.object.raycast = entity.originalRaycast || THREE.Object3D.prototype.raycast
            } else {
              entity.object.raycast = dummyRaycast.current
            }
          }
        }
      }
    }

    // Update debug stats periodically (every 15 frames ~250ms)
    if (frameCountRef.current % 15 === 0) {
      const gridStats = grid.getStats()
      const renderInfo = gl.info.render
      const memoryInfo = gl.info.memory

      const newStats: CullingStats = {
        fps: metrics.currentFPS,
        avgFps: metrics.avgFPS,
        drawCalls: renderInfo.calls,
        triangles: renderInfo.triangles,
        geometries: memoryInfo.geometries,
        textures: memoryInfo.textures,
        totalChunks: gridStats.totalChunks,
        activeChunks: gridStats.activeChunks,
        totalEntities: gridStats.totalEntities,
        visibleEntities: gridStats.visibleEntities,
        dprScale: metrics.dprScale,
        isThrottled: metrics.isThrottled,
      }

      setStats(newStats)
      onStatsUpdate?.(newStats)
    }
  })

  const contextValue = useMemo<CullingContextType>(
    () => ({
      grid,
      lod,
      stats,
      registerEntity: (id, object, isDynamic = false, radius = 2.0) =>
        grid.registerEntity(id, object, isDynamic, radius),
      unregisterEntity: (id) => grid.unregisterEntity(id),
    }),
    [grid, lod, stats],
  )

  return (
    <CullingContext.Provider value={contextValue}>
      {children}
    </CullingContext.Provider>
  )
}

/**
 * Declarative component to register any group or mesh into the CullingManager
 */
export function CulledObject({
  id,
  children,
  radius = 2.0,
  isDynamic = false,
}: {
  id: string
  children: ReactNode
  radius?: number
  isDynamic?: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const ctx = useContext(CullingContext)

  useEffect(() => {
    if (!ctx || !groupRef.current) return
    ctx.registerEntity(id, groupRef.current, isDynamic, radius)
    return () => {
      ctx.unregisterEntity(id)
    }
  }, [ctx, id, isDynamic, radius])

  return <group ref={groupRef}>{children}</group>
}
