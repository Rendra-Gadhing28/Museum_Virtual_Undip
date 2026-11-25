import { CULLING_CONFIG } from './CullingConfig'

export interface QualityMetrics {
  currentFPS: number
  avgFPS: number
  dprScale: number
  cullingAggressiveness: number
  isThrottled: boolean
}

/**
 * Adaptive Performance & Quality Controller
 * Dynamically adjusts culling aggressiveness and resolution to prevent frame drops.
 */
export class AdaptiveQuality {
  private frameTimes: number[] = []
  private maxSamples = 60
  private lastTime = performance.now()
  private avgFPS = 60
  private currentFPS = 60
  private dprScale = 1.0
  private aggressiveness = 1.0 // Multiplier on show/hide distances
  private throttleCooldown = 0

  public update(now: number = performance.now()): QualityMetrics {
    const delta = now - this.lastTime
    this.lastTime = now

    if (delta > 0) {
      const instantFPS = 1000 / delta
      this.currentFPS = instantFPS
      this.frameTimes.push(instantFPS)
      if (this.frameTimes.length > this.maxSamples) {
        this.frameTimes.shift()
      }

      let sum = 0
      for (let i = 0; i < this.frameTimes.length; i++) {
        sum += this.frameTimes[i]
      }
      this.avgFPS = sum / this.frameTimes.length
    }

    // Dynamic adaptation check every 60 frames
    this.throttleCooldown++
    if (this.throttleCooldown >= 60) {
      this.throttleCooldown = 0

      if (this.avgFPS < CULLING_CONFIG.minFPS) {
        // Underperforming: tighten culling distance and lower resolution scale
        this.aggressiveness = Math.max(0.75, this.aggressiveness - 0.08)
        this.dprScale = Math.max(0.8, this.dprScale - 0.1)
      } else if (this.avgFPS > CULLING_CONFIG.targetFPS && this.aggressiveness < 1.0) {
        // Healthy performance: smoothly restore distance
        this.aggressiveness = Math.min(1.0, this.aggressiveness + 0.04)
        this.dprScale = Math.min(1.0, this.dprScale + 0.05)
      }
    }

    return {
      currentFPS: Math.round(this.currentFPS),
      avgFPS: Math.round(this.avgFPS),
      dprScale: this.dprScale,
      cullingAggressiveness: this.aggressiveness,
      isThrottled: this.aggressiveness < 1.0,
    }
  }

  public getEffectiveDistances() {
    return {
      showDistance: CULLING_CONFIG.showDistance * this.aggressiveness,
      hideDistance: CULLING_CONFIG.hideDistance * this.aggressiveness,
      showDistanceSq: (CULLING_CONFIG.showDistance * this.aggressiveness) ** 2,
      hideDistanceSq: (CULLING_CONFIG.hideDistance * this.aggressiveness) ** 2,
    }
  }
}
