import * as THREE from 'three'
import {
  ZONE_GFX,
  type GFXMode,
  type ZoneId,
} from './zoneGfxConfig'

export interface GfxMetrics {
  activeZone: ZoneId
  mode: GFXMode
  lightCount: number
  shadowCastersCount: number
  shadowReceiversCount: number
  shadowMapSize: number
  shadowFilterType: string
  pbrMaterialsCount: number
  textureCount: number
  geometryCount: number
  drawCalls: number
  triangles: number
  fps: number
  exposure: number
  pixelRatio: number
}

type MetricsListener = (metrics: GfxMetrics) => void

/**
 * ZoneGraphicsManager — Single Source of Truth Pengendali Grafis Multi-Zona
 * Mengontrol renderer, shadow camera frustum Box3, PMREM environment per-zona,
 * alokasi/deallokasi lampu zona aktif, dan live telemetry untuk Debug HUD.
 */
class ZoneGraphicsManagerClass {
  private activeZoneId: ZoneId = 'zone1'
  private currentMode: GFXMode = 'ULTRA'
  private currentEnvTexture: THREE.WebGLRenderTarget | null = null
  private listeners: Set<MetricsListener> = new Set()

  private metrics: GfxMetrics = {
    activeZone: 'zone1',
    mode: 'ULTRA',
    lightCount: 0,
    shadowCastersCount: 0,
    shadowReceiversCount: 0,
    shadowMapSize: 2048,
    shadowFilterType: 'PCFSoft',
    pbrMaterialsCount: 0,
    textureCount: 0,
    geometryCount: 0,
    drawCalls: 0,
    triangles: 0,
    fps: 60,
    exposure: 1.15,
    pixelRatio: 1.0,
  }

  public getMode(): GFXMode {
    return this.currentMode
  }

  public getActiveZone(): ZoneId {
    return this.activeZoneId
  }

  public getMetrics(): GfxMetrics {
    return { ...this.metrics }
  }

  public subscribe(listener: MetricsListener): () => void {
    this.listeners.add(listener)
    listener(this.metrics)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach((l) => l({ ...this.metrics }))
  }

  /**
   * Setel mode grafis (ORIGINAL vs ULTRA vs EXAGGERATE)
   */
  public setMode(mode: GFXMode, gl?: THREE.WebGLRenderer, scene?: THREE.Scene, camera?: THREE.Camera) {
    this.currentMode = mode
    this.metrics.mode = mode
    if (gl && scene && camera) {
      this.applyZone(this.activeZoneId, gl, scene, camera, mode)
    } else {
      this.notify()
    }
  }

  /**
   * Menerapkan konfigurasi zona aktif pada WebGLRenderer dan Scene
   */
  public applyZone(
    zoneId: ZoneId,
    gl: THREE.WebGLRenderer,
    scene: THREE.Scene,
    _camera: THREE.Camera,
    overrideMode?: GFXMode
  ) {
    this.activeZoneId = zoneId
    const mode = overrideMode || this.currentMode
    this.currentMode = mode
    const cfg = ZONE_GFX[zoneId]

    // 1. Konfigurasi Renderer Utama (Ringan & Tanpa Re-kompilasi Shader / PMREM / ShadowMap)
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.toneMapping = cfg.toneMapping
    gl.toneMappingExposure = 1.0
    gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))

    // 2. Nonaktifkan ShadowMap berat agar CPU & GPU tetap ringan
    gl.shadowMap.enabled = false
    if (this.currentEnvTexture) {
      this.currentEnvTexture.dispose()
      this.currentEnvTexture = null
    }
    scene.environment = null

    // 3. Refresh Telemetry Metrik ringan (tanpa scene.traverse needsUpdate = true)
    this.metrics = {
      activeZone: zoneId,
      mode: mode,
      lightCount: this.countActiveLights(scene),
      shadowCastersCount: 0,
      shadowReceiversCount: 0,
      shadowMapSize: 0,
      shadowFilterType: 'None (Off)',
      pbrMaterialsCount: 0,
      textureCount: gl.info.memory.textures,
      geometryCount: gl.info.memory.geometries,
      drawCalls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      fps: 60,
      exposure: gl.toneMappingExposure,
      pixelRatio: gl.getPixelRatio(),
    }

    this.notify()
  }

  private countActiveLights(scene: THREE.Scene): number {
    let count = 0
    scene.traverse((obj) => {
      if (obj instanceof THREE.Light && obj.visible) count++
    })
    return count
  }

  /**
   * Release zona yang tidak aktif untuk membebaskan VRAM
   */
  public releaseZone(_zoneId: ZoneId) {
    if (this.currentEnvTexture) {
      this.currentEnvTexture.dispose()
      this.currentEnvTexture = null
    }
  }

  /**
   * Perbarui FPS dan metrik dinamis tiap frame
   */
  public sampleFrame(gl: THREE.WebGLRenderer, delta: number) {
    this.metrics.drawCalls = gl.info.render.calls
    this.metrics.triangles = gl.info.render.triangles
    this.metrics.textureCount = gl.info.memory.textures
    this.metrics.geometryCount = gl.info.memory.geometries
    if (delta > 0) {
      this.metrics.fps = Math.round(1 / delta)
    }
    this.notify()
  }

  /**
   * Meminta shadow map untuk di-update sekali (saat ada objek bergerak atau perpindahan zona)
   */
  public requestShadowUpdate(gl: THREE.WebGLRenderer) {
    if (this.currentMode !== 'ORIGINAL' && gl.shadowMap.enabled) {
      gl.shadowMap.needsUpdate = true
    }
  }
}

export const ZoneGraphicsManager = new ZoneGraphicsManagerClass()
