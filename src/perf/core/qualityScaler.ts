/**
 * Museum Virtual Undip — Dynamic Quality Scaler
 * Memantau FPS moving average, frame time, dan draw calls. Menurunkan atau menaikkan
 * kualitas grafis (DPR, post-processing, partikel, bayangan) secara adaptif dan mulus.
 */

import * as THREE from 'three'
import { PERF_CONFIG, type DeviceTier } from '../config/performance'
import { deviceProfile } from './deviceProfile'

export interface QualityMetrics {
  fps: number
  frameTimeMs: number
  drawCalls: number
  triangles: number
  geometries: number
  textures: number
  currentTier: DeviceTier
  currentDPR: number
}

class AdaptiveQualityScaler {
  private fpsHistory: number[] = []
  private maxHistorySamples = 60
  private lastEvaluationTime = Date.now()
  private lastChangeTime = Date.now()

  private currentTier: DeviceTier = 'standard'
  private currentDPR = 1.5
  private callbacks = new Set<(metrics: QualityMetrics) => void>()

  constructor() {
    const profile = deviceProfile.getProfile()
    this.currentTier = profile.tier
    this.currentDPR = profile.maxPixelRatio
  }

  public onMetricsUpdate(cb: (metrics: QualityMetrics) => void): void {
    this.callbacks.add(cb)
  }

  public removeMetricsUpdate(cb: (metrics: QualityMetrics) => void): void {
    this.callbacks.delete(cb)
  }

  /**
   * Panggil setiap frame dengan delta time
   */
  public sampleFrame(delta: number, renderer?: THREE.WebGLRenderer): void {
    if (delta <= 0) return
    const instantFPS = 1 / delta
    this.fpsHistory.push(instantFPS)
    if (this.fpsHistory.length > this.maxHistorySamples) {
      this.fpsHistory.shift()
    }

    const now = Date.now()
    const elapsedSinceEval = (now - this.lastEvaluationTime) / 1000

    if (elapsedSinceEval >= PERF_CONFIG.qualityScaler.sampleWindowSeconds) {
      this.evaluateAndScale(renderer)
      this.lastEvaluationTime = now
    }

    // Broadcast metrics ke listener (mis. debug overlay)
    if (renderer && this.callbacks.size > 0) {
      const avgFPS = this.getAverageFPS()
      const metrics: QualityMetrics = {
        fps: Math.round(avgFPS),
        frameTimeMs: Math.round(delta * 1000),
        drawCalls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        currentTier: this.currentTier,
        currentDPR: this.currentDPR,
      }
      this.callbacks.forEach((cb) => cb(metrics))
    }
  }

  public getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0)
    return sum / this.fpsHistory.length
  }

  private evaluateAndScale(renderer?: THREE.WebGLRenderer): void {
    const avgFPS = this.getAverageFPS()
    const now = Date.now()
    const elapsedSinceLastChange = (now - this.lastChangeTime) / 1000

    // Tunggu cooldown selesai sebelum mengubah kualitas
    if (elapsedSinceLastChange < PERF_CONFIG.qualityScaler.cooldownPeriodSeconds) {
      return
    }

    // A) DOWNGRADE: FPS anjlok di bawah ambang batas (Lag / Thermal Throttling)
    if (avgFPS < PERF_CONFIG.qualityScaler.dropThresholdFPS) {
      if (this.currentTier === 'high') {
        this.applyTier('standard', renderer)
        this.lastChangeTime = now
      } else if (this.currentTier === 'standard') {
        this.applyTier('lite', renderer)
        this.lastChangeTime = now
      } else if (this.currentDPR > 0.85 && renderer) {
        // Terakhir: turunkan resolusi piksel internal ke 0.85x
        this.currentDPR = 0.85
        renderer.setPixelRatio(this.currentDPR)
        this.lastChangeTime = now
      }
    }
    // B) UPGRADE: FPS sangat stabil di atas batas naik
    else if (avgFPS > PERF_CONFIG.qualityScaler.raiseThresholdFPS) {
      const profile = deviceProfile.getProfile()
      // Hanya naik jika perangkat awalnya memang mendukung tier lebih tinggi
      if (this.currentTier === 'lite' && profile.manualOverride !== 'lite') {
        this.applyTier('standard', renderer)
        this.lastChangeTime = now
      } else if (this.currentTier === 'standard' && profile.manualOverride === 'high') {
        this.applyTier('high', renderer)
        this.lastChangeTime = now
      }
    }
  }

  private applyTier(tier: DeviceTier, renderer?: THREE.WebGLRenderer): void {
    this.currentTier = tier
    const settings = PERF_CONFIG.tiers[tier]
    this.currentDPR = settings.maxPixelRatio

    if (renderer) {
      renderer.setPixelRatio(this.currentDPR)
      renderer.shadowMap.enabled = settings.shadows
    }

    console.warn(`[QualityScaler] Adjusted graphics tier to: ${tier.toUpperCase()} (DPR: ${this.currentDPR})`)
  }
}

export const qualityScaler = new AdaptiveQualityScaler()
