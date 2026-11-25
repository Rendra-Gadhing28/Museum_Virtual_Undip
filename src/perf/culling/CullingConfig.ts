/**
 * Museum Virtual Undip — Production Entity Culling Configuration
 * Centralized source of truth for spatial partitioning, render distance, fog, and hysteresis.
 */

export interface CullingConfigType {
  /** Maximum render distance where entities can be visible (meters) */
  renderDistance: number
  /** Distance where an entity becomes visible when approaching (meters) */
  showDistance: number
  /** Distance where an entity is hidden when moving away (meters, hysteresis > showDistance) */
  hideDistance: number
  /** Linear fog near distance (meters) */
  fogNear: number
  /** Linear fog far distance (meters, blends objects into fog before hideDistance) */
  fogFar: number
  /** Linear fog color matching scene background */
  fogColor: string
  /** Uniform grid cell dimension (meters) */
  chunkSize: number
  /** Frame throttle interval for culling check (evaluate every N frames) */
  updateInterval: number
  /** Camera movement threshold squared (m^2) to trigger immediate re-cull */
  cameraMoveThresholdSq: number
  /** Camera rotation angle threshold squared (rad^2) to trigger immediate re-cull */
  cameraRotThresholdSq: number
  /** Target FPS for adaptive quality adjustment */
  targetFPS: number
  /** Minimum tolerable FPS before aggressive culling triggers */
  minFPS: number
  /** Device pixel ratio limits */
  dprDesktop: [number, number]
  dprMobile: [number, number]
}

export const CULLING_CONFIG: CullingConfigType = {
  renderDistance: 45.0,
  showDistance: 38.0,
  hideDistance: 44.0, // Hysteresis buffer prevents edge flickering
  fogNear: 22.0,
  fogFar: 44.0,       // Matches hideDistance so objects fade naturally before culling
  fogColor: '#0e1724', // Undip gallery background dark navy
  chunkSize: 8.0,      // 8x8m grid cells for the 50x30m gallery space
  updateInterval: 3,   // Check every 3 frames (~50ms at 60fps)
  cameraMoveThresholdSq: 0.04, // 0.2m movement
  cameraRotThresholdSq: 0.005, // ~4 degrees rotation
  targetFPS: 55,
  minFPS: 28,
  dprDesktop: [1.0, 1.5],
  dprMobile: [1.0, 1.0],
}
