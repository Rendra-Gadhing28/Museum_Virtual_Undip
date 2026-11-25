/**
 * Museum Virtual Undip — Level of Detail (LOD) & Entity Throttling Controller
 */

export const LODLevel = {
  HIGH: 0,   // Full detail, full animations, interactive
  MEDIUM: 1, // Simplified details, reduced animation rate
  LOW: 2,    // Basic geometry, no subtle lights/particles
  CULLED: 3, // Hidden completely, raycasting disabled
} as const

export type LODLevel = (typeof LODLevel)[keyof typeof LODLevel]

export interface LODThresholds {
  highDistance: number
  mediumDistance: number
  lowDistance: number
}

export const DEFAULT_LOD_THRESHOLDS: LODThresholds = {
  highDistance: 14.0,
  mediumDistance: 26.0,
  lowDistance: 40.0,
}

export class LODController {
  private thresholds: LODThresholds

  constructor(thresholds: LODThresholds = DEFAULT_LOD_THRESHOLDS) {
    this.thresholds = thresholds
  }

  public getLODLevel(distanceSq: number): LODLevel {
    const highSq = this.thresholds.highDistance * this.thresholds.highDistance
    const medSq = this.thresholds.mediumDistance * this.thresholds.mediumDistance
    const lowSq = this.thresholds.lowDistance * this.thresholds.lowDistance

    if (distanceSq <= highSq) return LODLevel.HIGH
    if (distanceSq <= medSq) return LODLevel.MEDIUM
    if (distanceSq <= lowSq) return LODLevel.LOW
    return LODLevel.CULLED
  }

  public setThresholds(thresholds: Partial<LODThresholds>) {
    this.thresholds = { ...this.thresholds, ...thresholds }
  }
}
