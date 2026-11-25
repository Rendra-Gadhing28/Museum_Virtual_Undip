/**
 * Museum Virtual Undip — On-Demand Render Loop
 * Mengontrol rendering Three.js agar GPU idle saat tidak ada interaksi,
 * mendeteksi tab visibility change, debounced resize, dan menangani WebGL context loss.
 */

import * as THREE from 'three'
import { PERF_CONFIG } from '../config/performance'
import { deviceProfile } from './deviceProfile'

export type RenderCallback = (delta: number, timestamp: number) => void

class ManagedRenderLoop {
  private renderer: THREE.WebGLRenderer | null = null
  private scene: THREE.Scene | null = null
  private camera: THREE.Camera | null = null

  private isRunning = false
  private isTabVisible = true
  private isContextLost = false
  private isIdle = false

  private lastTime = 0
  private lastActivityTime = Date.now()
  private animationFrameId: number | null = null
  private callbacks = new Set<RenderCallback>()

  private demandRenderRequested = true
  private resizeTimeout: any = null

  /**
   * Inisialisasi loop dengan Three.js renderer dan event listeners
   */
  public init(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): void {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera

    this.setupEventListeners()
    this.applyProfileDPR()
  }

  public addCallback(cb: RenderCallback): void {
    this.callbacks.add(cb)
    this.requestFrame()
  }

  public removeCallback(cb: RenderCallback): void {
    this.callbacks.delete(cb)
  }

  /**
   * Memicu render 1 frame segera (demand render)
   */
  public requestFrame(): void {
    this.demandRenderRequested = true
    this.lastActivityTime = Date.now()
    this.isIdle = false
  }

  public start(): void {
    if (this.isRunning) return
    this.isRunning = true
    this.lastTime = performance.now()
    this.tick(this.lastTime)
  }

  public stop(): void {
    this.isRunning = false
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  private tick(timestamp: number): void {
    if (!this.isRunning) return

    // 1. Tab tersembunyi atau context lost -> Pause total, hemat baterai 100%
    if (!this.isTabVisible || this.isContextLost) {
      this.animationFrameId = requestAnimationFrame((t) => this.tick(t))
      return
    }

    // 2. Hitung delta time dengan clamp
    const rawDelta = (timestamp - this.lastTime) / 1000
    this.lastTime = timestamp
    const delta = Math.min(rawDelta, PERF_CONFIG.renderLoop.maxDeltaTimeSec)

    // 3. Deteksi Idle Status
    const idleDuration = Date.now() - this.lastActivityTime
    if (idleDuration > PERF_CONFIG.renderLoop.idleTimeoutMs) {
      this.isIdle = true
    }

    // 4. Render On-Demand / Throttled
    const shouldRender = this.demandRenderRequested || !this.isIdle

    if (shouldRender && this.renderer && this.scene && this.camera) {
      this.callbacks.forEach((cb) => cb(delta, timestamp))
      this.renderer.render(this.scene, this.camera)
      this.demandRenderRequested = false
    }

    // 5. Throttling saat Idle: Batasi ke idleFPS (15-20 FPS)
    if (this.isIdle) {
      const delay = 1000 / PERF_CONFIG.renderLoop.idleFPS
      setTimeout(() => {
        this.animationFrameId = requestAnimationFrame((t) => this.tick(t))
      }, delay)
    } else {
      this.animationFrameId = requestAnimationFrame((t) => this.tick(t))
    }
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    // Tab visibility change
    document.addEventListener('visibilitychange', () => {
      this.isTabVisible = !document.hidden
      if (this.isTabVisible) {
        this.lastTime = performance.now()
        this.requestFrame()
      }
    })

    // User interaction wake-up
    const wakeUp = () => this.requestFrame()
    window.addEventListener('pointermove', wakeUp, { passive: true })
    window.addEventListener('pointerdown', wakeUp, { passive: true })
    window.addEventListener('keydown', wakeUp, { passive: true })
    window.addEventListener('wheel', wakeUp, { passive: true })

    // Debounced Resize
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout)
      this.resizeTimeout = setTimeout(() => {
        this.handleResize()
      }, PERF_CONFIG.renderLoop.resizeDebounceMs)
    })

    // WebGL Context Lost & Restored
    if (this.renderer) {
      const canvas = this.renderer.domElement
      canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault()
        this.isContextLost = true
        console.warn('Museum Virtual Undip — WebGL Context Lost! Pausing render loop.')
      })

      canvas.addEventListener('webglcontextrestored', () => {
        this.isContextLost = false
        this.applyProfileDPR()
        this.requestFrame()
        console.info('Museum Virtual Undip — WebGL Context Restored successfully.')
      })
    }
  }

  private handleResize(): void {
    if (!this.renderer || !this.camera) return
    const width = window.innerWidth
    const height = window.innerHeight

    if ((this.camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const cam = this.camera as THREE.PerspectiveCamera
      cam.aspect = width / height
      cam.updateProjectionMatrix()
    }

    this.renderer.setSize(width, height)
    this.applyProfileDPR()
    this.requestFrame()
  }

  private applyProfileDPR(): void {
    if (!this.renderer) return
    const profile = deviceProfile.getProfile()
    const targetDPR = Math.min(window.devicePixelRatio || 1, profile.maxPixelRatio)
    this.renderer.setPixelRatio(targetDPR)
  }
}

export const renderLoop = new ManagedRenderLoop()
