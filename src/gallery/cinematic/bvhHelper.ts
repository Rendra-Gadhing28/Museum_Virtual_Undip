/**
 * Real BVH (three-mesh-bvh) Adapter & Raycast Benchmark Utility
 *
 * Builds an actual MeshBVH bounds tree on a gallery geometry and provides
 * a MeshBVHHelper (depth 2-4) on Layer 1 plus real performance.now() raycast timing.
 * Completely disposes all BVH structures when the cinematic finishes or is skipped.
 */

import * as THREE from 'three'
import { MeshBVH, MeshBVHHelper, acceleratedRaycast } from 'three-mesh-bvh'
import { CINEMATIC_PALETTE } from './config'

export interface BVHRuntimeBundle {
  mesh: THREE.Mesh
  bvh: MeshBVH
  helper: MeshBVHHelper
  raycaster: THREE.Raycaster
  dispose: () => void
}

/**
 * Creates a real MeshBVH on an architectural target geometry (matching the
 * podium / monument volume) and returns the helper + accelerated raycaster.
 */
export function createGalleryBVHBundle(
  position: [number, number, number],
  layerIndex = 1,
): BVHRuntimeBundle {
  // Complex geometry to make BVH tree depth 2-4 visually meaningful & measurable
  const geometry = new THREE.TorusKnotGeometry(0.95, 0.28, 96, 16)
  // Build actual BVH tree
  const bvh = new MeshBVH(geometry)
  ;(geometry as THREE.BufferGeometry & { boundsTree?: MeshBVH }).boundsTree = bvh

  const material = new THREE.MeshStandardMaterial({
    color: CINEMATIC_PALETTE.accent,
    roughness: 0.35,
    metalness: 0.75,
    transparent: true,
    opacity: 0.28,
    wireframe: false,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(position[0], position[1] + 1.5, position[2])
  mesh.raycast = acceleratedRaycast
  mesh.layers.set(layerIndex)
  mesh.updateMatrixWorld(true)

  // MeshBVHHelper at depth 3 (within requested 2-4 depth range)
  const helper = new MeshBVHHelper(mesh, 3)
  helper.color.set(CINEMATIC_PALETTE.technical)
  helper.opacity = 0.75
  helper.layers.set(layerIndex)
  helper.traverse((child) => {
    child.layers.set(layerIndex)
  })
  helper.update()

  const raycaster = new THREE.Raycaster()
  raycaster.firstHitOnly = true

  const dispose = () => {
    ;(geometry as THREE.BufferGeometry & { boundsTree?: MeshBVH }).boundsTree = undefined
    geometry.dispose()
    material.dispose()
    helper.traverse((child) => {
      const line = child as THREE.LineSegments
      if (line.geometry) line.geometry.dispose()
      if (line.material) {
        if (Array.isArray(line.material)) line.material.forEach((m) => m.dispose())
        else line.material.dispose()
      }
    })
  }

  return { mesh, bvh, helper, raycaster, dispose }
}

/**
 * Measures real raycast execution time in milliseconds across N probe rays.
 */
export function measureBVHRaycasts(
  bundle: BVHRuntimeBundle,
  origins: THREE.Vector3[],
  directions: THREE.Vector3[],
  hitPointsOut: THREE.Vector3[],
): { durationMs: number; hitsCount: number } {
  const start = performance.now()
  let hitsCount = 0

  for (let i = 0; i < origins.length; i++) {
    bundle.raycaster.set(origins[i], directions[i])
    const intersects = bundle.raycaster.intersectObject(bundle.mesh, false)
    if (intersects.length > 0) {
      hitPointsOut[i].copy(intersects[0].point)
      hitsCount++
    } else {
      hitPointsOut[i].copy(origins[i]).addScaledVector(directions[i], 4.0)
    }
  }

  const durationMs = performance.now() - start
  return { durationMs, hitsCount }
}
