import * as THREE from 'three'

export const DEFAULT_CAM_DISTANCE = 4.2
export const MIN_CAM_DISTANCE = 1.8
export const MAX_CAM_DISTANCE = 7.5
export const DEFAULT_CAM_PITCH = 0.28
export const MIN_CAM_PITCH = -0.22
export const MAX_CAM_PITCH = 1.15
export const CAM_PIVOT_HEIGHT = 1.35
export const JUMP_VELOCITY = 6.8
export const GRAVITY = 20.0

export interface HallBounds {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

const _pivot = new THREE.Vector3()

/**
 * Shortest-angle linear interpolation (radians).
 */
export function lerpAngle(current: number, target: number, alpha: number): number {
  let diff = target - current
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  return current + diff * alpha
}

/**
 * Positions the third-person camera behind the character with Roblox-style
 * wall-clamping (PopperCam) so the camera never clips outside the hall bounds.
 */
export function updateThirdPersonCamera(
  camera: THREE.Camera,
  charPos: readonly [number, number, number],
  yaw: number,
  pitch: number,
  distance: number,
  bounds: HallBounds,
): void {
  const px = charPos[0]
  const py = charPos[1] + CAM_PIVOT_HEIGHT
  const pz = charPos[2]
  _pivot.set(px, py, pz)

  const hDist = distance * Math.cos(pitch)
  const vDist = distance * Math.sin(pitch)

  const offsetX = hDist * Math.sin(yaw)
  const offsetZ = hDist * Math.cos(yaw)

  // Clamp along ray from pivot to desired camera position so it stays inside walls
  let t = 1
  const pad = 0.25
  const minX = bounds.minX - pad
  const maxX = bounds.maxX + pad
  const minZ = bounds.minZ - pad
  const maxZ = bounds.maxZ + pad

  if (offsetX > 0 && px + offsetX > maxX) {
    t = Math.min(t, Math.max(0.15, (maxX - px) / offsetX))
  } else if (offsetX < 0 && px + offsetX < minX) {
    t = Math.min(t, Math.max(0.15, (minX - px) / offsetX))
  }

  if (offsetZ > 0 && pz + offsetZ > maxZ) {
    t = Math.min(t, Math.max(0.15, (maxZ - pz) / offsetZ))
  } else if (offsetZ < 0 && pz + offsetZ < minZ) {
    t = Math.min(t, Math.max(0.15, (minZ - pz) / offsetZ))
  }

  const camX = px + offsetX * t
  const camZ = pz + offsetZ * t
  const camY = Math.max(0.25, py + vDist * t)

  camera.position.set(camX, camY, camZ)
  camera.lookAt(_pivot)
}
