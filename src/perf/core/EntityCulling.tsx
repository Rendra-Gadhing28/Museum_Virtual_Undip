/**
 * Museum Virtual Undip — Modern Game Engine Entity Culling & Frustum Culling
 * Inspired by Minecraft chunk culling, Unity, and Unreal Engine visibility architectures:
 *
 * 1. `<EntityCulling>` wraps a group of meshes/lights and hides the whole
 *    group when its bounding sphere leaves the camera frustum (or exceeds
 *    the configured draw distance). Hiding a group also hides any lights
 *    inside it, because three.js skips invisible subtrees while gathering
 *    lights for the frame.
 *    Provides `EntityVisibilityContext` & `useEntityVisibility()` so child
 *    components can halt their `useFrame` animations completely when off-screen.
 *
 * 2. `<SceneLightCulling>` automatically walks the scene and disables
 *    point/spot lights whose influence sphere is outside the view frustum.
 *    Meshes are already frustum-culled by three.js, but lights are not — and
 *    every active light is evaluated per-fragment, which is the main reason
 *    a room full of picture lights feels heavy.
 *
 * Both helpers toggle `Object3D.visible` and pause rendering computations,
 * ensuring 0 GPU/CPU waste on objects outside the visitor's field of view.
 */
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface EntityCullingProps {
  children: ReactNode
  /**
   * Local-space center of the entity's bounding sphere, relative to the
   * wrapper group. Ignored when `radius` is omitted (bounds are measured).
   */
  center?: [number, number, number]
  /**
   * Explicit bounding-sphere radius in world units. When omitted, the
   * wrapper measures its children once after mount.
   */
  radius?: number
  /** Extra radius so an entity does not pop at the exact frustum edge (frustum margin). */
  padding?: number
  /** Hide the entity past this camera distance (0 = no distance culling). */
  maxDistance?: number
  /** Evaluate visibility every N frames. Defaults to 3. */
  interval?: number
  /** Set false to render the entity unconditionally. */
  enabled?: boolean
  /** Force the entity visible (for example while it is selected). */
  alwaysVisible?: boolean
  /** Callback fired whenever visibility status changes */
  onVisibilityChange?: (visible: boolean) => void
}

const DEFAULT_PADDING = 0.75
const DEFAULT_LIGHT_RADIUS = 10

/**
 * React Context providing the current visibility state of the entity group
 * to its children. Child components with heavy `useFrame` loops can consume
 * `useEntityVisibility()` to halt animations when culled.
 */
export const EntityVisibilityContext = createContext<boolean>(true)

export function useEntityVisibility(): boolean {
  return useContext(EntityVisibilityContext)
}

/**
 * Group-level frustum culling. Returns a `<group>` so it can wrap any
 * three.js subtree without changing the scene graph layout.
 */
export function EntityCulling({
  children,
  center,
  radius,
  padding = DEFAULT_PADDING,
  maxDistance = 0,
  interval = 3,
  enabled = true,
  alwaysVisible = false,
  onVisibilityChange,
}: EntityCullingProps) {
  const groupRef = useRef<THREE.Group>(null)
  const boundsRef = useRef<THREE.Sphere | null>(null)
  const frameRef = useRef(0)

  // Reused maths objects — never allocate inside useFrame.
  const frustum = useMemo(() => new THREE.Frustum(), [])
  const projection = useMemo(() => new THREE.Matrix4(), [])
  const worldCenter = useMemo(() => new THREE.Vector3(), [])
  const testSphere = useMemo(() => new THREE.Sphere(), [])

  const hasExplicitBounds = radius !== undefined
  const cx = center?.[0] ?? 0
  const cy = center?.[1] ?? 0
  const cz = center?.[2] ?? 0

  useEffect(() => {
    if (!enabled) {
      boundsRef.current = null
      const group = groupRef.current
      if (group) group.visible = true
      return
    }

    if (hasExplicitBounds) {
      boundsRef.current = new THREE.Sphere(
        new THREE.Vector3(cx, cy, cz),
        Math.max(radius ?? 0, 0.001),
      )
      return
    }

    const group = groupRef.current
    if (!group) return

    // Measure once after the subtree has mounted.
    group.updateWorldMatrix(true, true)
    const box = new THREE.Box3().setFromObject(group, true)
    if (box.isEmpty()) {
      boundsRef.current = null
      return
    }

    const sphere = new THREE.Sphere()
    box.getBoundingSphere(sphere)
    // setFromObject returns world space; convert the center back to local.
    group.worldToLocal(sphere.center)
    boundsRef.current = sphere
  }, [enabled, hasExplicitBounds, cx, cy, cz, radius])

  useFrame((state) => {
    const group = groupRef.current
    if (!group) return

    if (!enabled || alwaysVisible) {
      if (!group.visible) {
        group.visible = true
        onVisibilityChange?.(true)
      }
      frameRef.current = 0
      return
    }

    const bounds = boundsRef.current
    if (!bounds) return

    frameRef.current = (frameRef.current + 1) % Math.max(1, interval)
    if (frameRef.current !== 0) return

    const camera = state.camera
    camera.updateMatrixWorld()
    projection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    frustum.setFromProjectionMatrix(projection)

    group.updateWorldMatrix(true, false)
    worldCenter.copy(bounds.center).applyMatrix4(group.matrixWorld)

    testSphere.center.copy(worldCenter)
    testSphere.radius = bounds.radius + padding

    const distToCenter = camera.position.distanceTo(worldCenter)
    // CRITICAL: If the visitor approaches or is inside the bounding sphere, NEVER cull
    let visible = distToCenter <= (testSphere.radius + 3.0) || frustum.intersectsSphere(testSphere)
    if (visible && maxDistance > 0) {
      visible = distToCenter <= maxDistance + testSphere.radius
    }

    if (group.visible !== visible) {
      group.visible = visible
      onVisibilityChange?.(visible)
    }
  })

  return (
    <EntityVisibilityContext.Provider value={true}>
      <group ref={groupRef}>{children}</group>
    </EntityVisibilityContext.Provider>
  )
}

export interface SceneLightCullingProps {
  /** Evaluate visibility every N frames. Defaults to 6 (~100ms at 60fps). */
  interval?: number
  /** Extra radius added to every light's influence sphere. Defaults to 1.5. */
  padding?: number
  /** Set false to stop culling (all lights keep their authored state). */
  enabled?: boolean
}

const lightFrustum = new THREE.Frustum()
const lightProjection = new THREE.Matrix4()
const lightCenter = new THREE.Vector3()
const lightSphere = new THREE.Sphere()

/**
 * Automatically culls point/spot lights that cannot touch the current view.
 * Mount once inside any `<Canvas>`.
 */
export function SceneLightCulling({
  interval = 6,
  padding = 1.5,
  enabled = true,
}: SceneLightCullingProps) {
  const frameRef = useRef(0)
  // Lights hidden by this helper. If a component makes one visible again we
  // release ownership instead of fighting it.
  const hiddenRef = useRef<Set<THREE.Light>>(new Set())

  useFrame((state) => {
    if (!enabled) return

    frameRef.current = (frameRef.current + 1) % Math.max(1, interval)
    if (frameRef.current !== 0) return

    const camera = state.camera
    camera.updateMatrixWorld()
    lightProjection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    lightFrustum.setFromProjectionMatrix(lightProjection)

    const scene = state.scene
    const hidden = hiddenRef.current

    scene.traverse((object) => {
      if (!(object as THREE.Light).isLight) return

      const light = object as THREE.Light

      // Ambient, hemisphere and directional lights are global: keep them.
      if (
        (light as THREE.AmbientLight).isAmbientLight ||
        (light as THREE.HemisphereLight).isHemisphereLight ||
        (light as THREE.DirectionalLight).isDirectionalLight
      ) {
        return
      }

      const ranged = light as THREE.PointLight & THREE.SpotLight
      if (ranged.distance === undefined) return

      // A component may have re-enabled a light we hid: release ownership.
      if (hidden.has(light) && light.visible) hidden.delete(light)

      if (!hidden.has(light) && !light.visible) return

      const radius =
        (ranged.distance > 0 ? ranged.distance : DEFAULT_LIGHT_RADIUS) + padding

      light.getWorldPosition(lightCenter)
      lightSphere.center.copy(lightCenter)
      lightSphere.radius = radius

      if (lightFrustum.intersectsSphere(lightSphere)) {
        if (hidden.delete(light)) light.visible = true
      } else if (light.visible) {
        light.visible = false
        hidden.add(light)
      }
    })
  })

  return null
}
