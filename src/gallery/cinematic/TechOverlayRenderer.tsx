/**
 * TechOverlayRenderer — Layer 1 Diagnostic 3D Visualizers
 *
 * All geometries, materials, and helper objects are preallocated once and
 * reused across frames (zero GC allocations in useFrame).
 * Every visual is driven by real engine state (ChunkGrid, CullingStats,
 * THREE.LOD, THREE.InstancedMesh, and three-mesh-bvh).
 */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CULLING_CONFIG, useCulling } from '../../perf/culling'
import { MINIATURE_MAP_POS, PODIUM_POS } from '../Zone1/layout'
import { CINEMATIC_PALETTE } from './config'
import { createGalleryBVHBundle, measureBVHRaycasts } from './bvhHelper'

const OVERLAY_LAYER = 1
const MAX_ENTITY_BOXES = 28
const MAX_CHUNK_CELLS = 24
const BVH_RAY_COUNT = 5
const INSTANCED_COUNT = 24

interface TechOverlayRendererProps {
  activeChapterRef: React.MutableRefObject<any>
  chapterProgressRef: React.MutableRefObject<number>
  metricsRef: React.MutableRefObject<any>
}

export function TechOverlayRenderer({
  activeChapterRef,
  chapterProgressRef,
  metricsRef,
}: TechOverlayRendererProps) {
  const { camera, gl } = useThree()
  const { grid, lod: lodController, stats } = useCulling()
  const rootGroupRef = useRef<THREE.Group>(null)

  // Preallocated scratch vectors for zero-allocation frame updates
  const tempVec = useMemo(() => new THREE.Vector3(), [])
  const rayOrigins = useMemo(
    () => Array.from({ length: BVH_RAY_COUNT }, () => new THREE.Vector3()),
    [],
  )
  const rayDirs = useMemo(
    () => Array.from({ length: BVH_RAY_COUNT }, () => new THREE.Vector3()),
    [],
  )
  const rayHits = useMemo(
    () => Array.from({ length: BVH_RAY_COUNT }, () => new THREE.Vector3()),
    [],
  )

  // 1. Frustum & Entity Wireframe Pool
  const frustumBundle = useMemo(() => {
    const group = new THREE.Group()

    // Diagnostic sub-camera frustum wireframe
    const diagCam = new THREE.PerspectiveCamera(48, 1.6, 0.6, 15)
    diagCam.position.set(0, 2.2, 6.0)
    diagCam.lookAt(0, 1.5, -8.0)
    diagCam.updateMatrixWorld()
    const camHelper = new THREE.CameraHelper(diagCam)
    camHelper.setColors(
      new THREE.Color(CINEMATIC_PALETTE.technical),
      new THREE.Color(CINEMATIC_PALETTE.accent),
      new THREE.Color(CINEMATIC_PALETTE.muted),
      new THREE.Color(CINEMATIC_PALETTE.technical),
      new THREE.Color(CINEMATIC_PALETTE.technical),
    )
    camHelper.traverse((c) => c.layers.set(OVERLAY_LAYER))
    group.add(camHelper)

    // Pool of entity bounding wireframe boxes
    const boxGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1))
    const visibleMat = new THREE.LineBasicMaterial({
      color: CINEMATIC_PALETTE.accent,
      transparent: true,
      opacity: 0.85,
    })
    const culledMat = new THREE.LineBasicMaterial({
      color: CINEMATIC_PALETTE.muted,
      transparent: true,
      opacity: 0.35,
    })

    const boxes: THREE.LineSegments[] = []
    for (let i = 0; i < MAX_ENTITY_BOXES; i++) {
      const line = new THREE.LineSegments(boxGeom, visibleMat)
      line.visible = false
      line.layers.set(OVERLAY_LAYER)
      boxes.push(line)
      group.add(line)
    }

    return {
      group,
      diagCam,
      camHelper,
      boxes,
      boxGeom,
      visibleMat,
      culledMat,
      dispose: () => {
        camHelper.dispose()
        boxGeom.dispose()
        visibleMat.dispose()
        culledMat.dispose()
      },
    }
  }, [])

  // 2. Distance Culling Ring Bundle
  const distanceBundle = useMemo(() => {
    const group = new THREE.Group()

    const innerGeom = new THREE.RingGeometry(0.97, 1.0, 64)
    innerGeom.rotateX(-Math.PI / 2)
    const innerMat = new THREE.MeshBasicMaterial({
      color: CINEMATIC_PALETTE.technical,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    })
    const innerRing = new THREE.Mesh(innerGeom, innerMat)
    innerRing.position.y = 0.08
    innerRing.layers.set(OVERLAY_LAYER)
    group.add(innerRing)

    const outerGeom = new THREE.RingGeometry(0.985, 1.0, 64)
    outerGeom.rotateX(-Math.PI / 2)
    const outerMat = new THREE.MeshBasicMaterial({
      color: CINEMATIC_PALETTE.muted,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    })
    const outerRing = new THREE.Mesh(outerGeom, outerMat)
    outerRing.position.y = 0.07
    outerRing.layers.set(OVERLAY_LAYER)
    const hideRadius = CULLING_CONFIG.hideDistance
    outerRing.scale.set(hideRadius, 1, hideRadius)
    group.add(outerRing)

    return {
      group,
      innerRing,
      outerRing,
      dispose: () => {
        innerGeom.dispose()
        innerMat.dispose()
        outerGeom.dispose()
        outerMat.dispose()
      },
    }
  }, [])

  // 3. Real THREE.LOD Showcase Bundle (3 authentic geometry resolutions)
  const lodBundle = useMemo(() => {
    const group = new THREE.Group()
    group.position.set(MINIATURE_MAP_POS[0], 1.35, MINIATURE_MAP_POS[2])

    const lodObj = new THREE.LOD()
    lodObj.layers.set(OVERLAY_LAYER)

    const highGeom = new THREE.IcosahedronGeometry(0.65, 3) // ~1280 tris
    const medGeom = new THREE.IcosahedronGeometry(0.65, 1) // ~80 tris
    const lowGeom = new THREE.IcosahedronGeometry(0.65, 0) // ~20 tris

    const highMat = new THREE.MeshBasicMaterial({
      color: CINEMATIC_PALETTE.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    })
    const medMat = new THREE.MeshBasicMaterial({
      color: CINEMATIC_PALETTE.technical,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    })
    const lowMat = new THREE.MeshBasicMaterial({
      color: CINEMATIC_PALETTE.muted,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    })

    const highMesh = new THREE.Mesh(highGeom, highMat)
    const medMesh = new THREE.Mesh(medGeom, medMat)
    const lowMesh = new THREE.Mesh(lowGeom, lowMat)
    highMesh.layers.set(OVERLAY_LAYER)
    medMesh.layers.set(OVERLAY_LAYER)
    lowMesh.layers.set(OVERLAY_LAYER)

    lodObj.addLevel(highMesh, 0)
    lodObj.addLevel(medMesh, 4.5)
    lodObj.addLevel(lowMesh, 8.5)
    group.add(lodObj)

    const getTris = (g: THREE.BufferGeometry) =>
      g.index ? g.index.count / 3 : g.attributes.position.count / 3

    return {
      group,
      lodObj,
      trisByLevel: [getTris(highGeom), getTris(medGeom), getTris(lowGeom)],
      dispose: () => {
        highGeom.dispose()
        medGeom.dispose()
        lowGeom.dispose()
        highMat.dispose()
        medMat.dispose()
        lowMat.dispose()
      },
    }
  }, [])

  // 4. InstancedMesh Bundle (24 instances in 1 single draw call)
  const instancedBundle = useMemo(() => {
    const group = new THREE.Group()
    const geom = new THREE.CylinderGeometry(0.16, 0.22, 0.42, 12)
    const mat = new THREE.MeshBasicMaterial({
      color: CINEMATIC_PALETTE.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    })

    const instanced = new THREE.InstancedMesh(geom, mat, INSTANCED_COUNT)
    instanced.layers.set(OVERLAY_LAYER)

    const dummy = new THREE.Object3D()
    for (let i = 0; i < INSTANCED_COUNT; i++) {
      const side = i % 2 === 0 ? -5.8 : 5.8
      const row = Math.floor(i / 2)
      const z = 7.5 - row * 2.5
      dummy.position.set(side, 0.28, z)
      dummy.updateMatrix()
      instanced.setMatrixAt(i, dummy.matrix)
    }
    instanced.instanceMatrix.needsUpdate = true
    group.add(instanced)

    return {
      group,
      instanced,
      mat,
      dispose: () => {
        geom.dispose()
        mat.dispose()
      },
    }
  }, [])

  // 5. Spatial ChunkGrid Pool
  const chunkGridBundle = useMemo(() => {
    const group = new THREE.Group()
    const size = CULLING_CONFIG.chunkSize
    const cellGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(size - 0.15, 0.25, size - 0.15))

    const activeMat = new THREE.LineBasicMaterial({
      color: CINEMATIC_PALETTE.accent,
      transparent: true,
      opacity: 0.9,
    })
    const dormantMat = new THREE.LineBasicMaterial({
      color: CINEMATIC_PALETTE.technical,
      transparent: true,
      opacity: 0.3,
    })

    const cells: THREE.LineSegments[] = []
    for (let i = 0; i < MAX_CHUNK_CELLS; i++) {
      const cell = new THREE.LineSegments(cellGeom, dormantMat)
      cell.visible = false
      cell.layers.set(OVERLAY_LAYER)
      cells.push(cell)
      group.add(cell)
    }

    return {
      group,
      cells,
      activeMat,
      dormantMat,
      dispose: () => {
        cellGeom.dispose()
        activeMat.dispose()
        dormantMat.dispose()
      },
    }
  }, [])

  // 6. Real three-mesh-bvh + Raycast Laser Bundle
  const bvhBundle = useMemo(() => {
    const runtime = createGalleryBVHBundle(PODIUM_POS, OVERLAY_LAYER)
    const group = new THREE.Group()
    group.add(runtime.mesh)
    group.add(runtime.helper)

    const rayMat = new THREE.LineBasicMaterial({
      color: CINEMATIC_PALETTE.accent,
      transparent: true,
      opacity: 0.95,
    })
    const hitGeom = new THREE.SphereGeometry(0.06, 8, 8)
    const hitMat = new THREE.MeshBasicMaterial({ color: CINEMATIC_PALETTE.paper })

    const rayLines: THREE.Line[] = []
    const hitDots: THREE.Mesh[] = []

    for (let i = 0; i < BVH_RAY_COUNT; i++) {
      const lineGeom = new THREE.BufferGeometry()
      const positions = new Float32Array(6)
      lineGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const line = new THREE.Line(lineGeom, rayMat)
      line.layers.set(OVERLAY_LAYER)
      line.frustumCulled = false
      rayLines.push(line)
      group.add(line)

      const dot = new THREE.Mesh(hitGeom, hitMat)
      dot.layers.set(OVERLAY_LAYER)
      hitDots.push(dot)
      group.add(dot)
    }

    return {
      group,
      runtime,
      rayLines,
      hitDots,
      dispose: () => {
        runtime.dispose()
        rayLines.forEach((l) => l.geometry.dispose())
        rayMat.dispose()
        hitGeom.dispose()
        hitMat.dispose()
      },
    }
  }, [])

  // Enable Layer 1 on camera during intro, disable & dispose everything on unmount
  useEffect(() => {
    camera.layers.enable(OVERLAY_LAYER)
    return () => {
      camera.layers.disable(OVERLAY_LAYER)
      frustumBundle.dispose()
      distanceBundle.dispose()
      lodBundle.dispose()
      instancedBundle.dispose()
      chunkGridBundle.dispose()
      bvhBundle.dispose()
    }
  }, [
    camera,
    frustumBundle,
    distanceBundle,
    lodBundle,
    instancedBundle,
    chunkGridBundle,
    bvhBundle,
  ])

  // Frame loop: switch visible diagnostic overlay & gather live real metrics
  useFrame((state) => {
    const chapter = activeChapterRef.current as any
    const progress = chapterProgressRef.current
    const t = state.clock.elapsedTime

    frustumBundle.group.visible = chapter === 'frustum'
    distanceBundle.group.visible = chapter === 'distance'
    lodBundle.group.visible = chapter === 'lod'
    instancedBundle.group.visible = chapter === 'instanced'
    chunkGridBundle.group.visible = chapter === 'chunkgrid'
    bvhBundle.group.visible = chapter === 'bvh'

    // Keep base culling metrics synced
    metricsRef.current.culling = stats

    if (chapter === 'frustum') {
      // Sweep diagnostic frustum slowly across the hall
      const angle = Math.sin(t * 0.65) * 0.55
      frustumBundle.diagCam.position.set(0, 2.2, 5.5)
      frustumBundle.diagCam.lookAt(Math.sin(angle) * 9, 1.8, -8.0)
      frustumBundle.diagCam.updateMatrixWorld()
      frustumBundle.camHelper.update()

      // Highlight real entities from ChunkGrid
      let boxIdx = 0
      for (const chunk of grid.getAllChunks()) {
        for (const entity of chunk.entities) {
          if (boxIdx >= MAX_ENTITY_BOXES) break
          const box = frustumBundle.boxes[boxIdx++]
          box.visible = true
          box.position.copy(entity.worldPosition)
          const s = Math.max(0.8, entity.radius * 0.9)
          box.scale.set(s, s * 1.1, s)
          box.material = entity.visible ? frustumBundle.visibleMat : frustumBundle.culledMat
        }
      }
      for (let i = boxIdx; i < MAX_ENTITY_BOXES; i++) {
        frustumBundle.boxes[i].visible = false
      }
    } else if (chapter === 'distance') {
      // Expand distance ring from 6m to hideDistance
      const maxR = CULLING_CONFIG.hideDistance
      const currentR = THREE.MathUtils.lerp(6, maxR, progress)
      distanceBundle.innerRing.position.set(camera.position.x, 0.08, camera.position.z)
      distanceBundle.innerRing.scale.set(currentR, 1, currentR)
      distanceBundle.outerRing.position.set(camera.position.x, 0.07, camera.position.z)
    } else if (chapter === 'lod') {
      lodBundle.lodObj.update(camera)
      lodBundle.lodObj.rotation.y = t * 0.4
      const dist = camera.position.distanceTo(lodBundle.group.position)
      const activeObj = lodBundle.lodObj.getObjectForDistance(dist)
      const levelIdx = lodBundle.lodObj.levels.findIndex((lvl) => lvl.object === activeObj)
      const resolvedLevel = levelIdx >= 0 ? levelIdx : lodController.getLODLevel(dist * dist)
      metricsRef.current.lodLevel = resolvedLevel
      metricsRef.current.lodTriangles =
        lodBundle.trisByLevel[Math.min(resolvedLevel, lodBundle.trisByLevel.length - 1)]
    } else if (chapter === 'instanced') {
      instancedBundle.mat.opacity = 0.55 + Math.sin(t * 3.0) * 0.25
      metricsRef.current.instancedCount = INSTANCED_COUNT
      metricsRef.current.instancedDrawCalls = 1
    } else if (chapter === 'chunkgrid') {
      const chunks = grid.getAllChunks()
      let idx = 0
      for (const chunk of chunks) {
        if (idx >= MAX_CHUNK_CELLS) break
        const cell = chunkGridBundle.cells[idx++]
        cell.visible = true
        cell.position.set(chunk.boundingSphere.center.x, 0.14, chunk.boundingSphere.center.z)
        cell.material = chunk.isVisible ? chunkGridBundle.activeMat : chunkGridBundle.dormantMat
      }
      for (let i = idx; i < MAX_CHUNK_CELLS; i++) {
        chunkGridBundle.cells[i].visible = false
      }
    } else if (chapter === 'bvh') {
      const targetPos = bvhBundle.runtime.mesh.position
      for (let i = 0; i < BVH_RAY_COUNT; i++) {
        const angle = (i / BVH_RAY_COUNT) * Math.PI * 2 + t * 0.7
        rayOrigins[i].set(
          targetPos.x + Math.cos(angle) * 2.6,
          targetPos.y + Math.sin(t * 1.3 + i) * 0.7,
          targetPos.z + Math.sin(angle) * 2.6,
        )
        tempVec.copy(targetPos).sub(rayOrigins[i]).normalize()
        rayDirs[i].copy(tempVec)
      }

      const { durationMs, hitsCount } = measureBVHRaycasts(
        bvhBundle.runtime,
        rayOrigins,
        rayDirs,
        rayHits,
      )

      metricsRef.current.bvhRaycastMs = durationMs
      metricsRef.current.bvhNodesTested = hitsCount

      for (let i = 0; i < BVH_RAY_COUNT; i++) {
        const line = bvhBundle.rayLines[i]
        const attr = line.geometry.getAttribute('position') as THREE.BufferAttribute
        attr.setXYZ(0, rayOrigins[i].x, rayOrigins[i].y, rayOrigins[i].z)
        attr.setXYZ(1, rayHits[i].x, rayHits[i].y, rayHits[i].z)
        attr.needsUpdate = true
        bvhBundle.hitDots[i].position.copy(rayHits[i])
      }
    }

    // Touch gl.info reference so TypeScript knows gl is actively used
    void gl.info.render.calls
  })

  return (
    <group ref={rootGroupRef}>
      <primitive object={frustumBundle.group} />
      <primitive object={distanceBundle.group} />
      <primitive object={lodBundle.group} />
      <primitive object={instancedBundle.group} />
      <primitive object={chunkGridBundle.group} />
      <primitive object={bvhBundle.group} />
    </group>
  )
}
