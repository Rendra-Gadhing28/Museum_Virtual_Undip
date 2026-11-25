/**
 * Museum Virtual Undip — Zone Manager with LRU Cache & Sub-Area Lazy Loading
 * Membatasi jumlah zona yang hidup di RAM/VRAM sesuai batas perangkat (HP: 1, Laptop: 2).
 * Melakukan lazy-loading sub-area pameran berdasarkan jarak kamera dan prefetch cerdas.
 */

import * as THREE from 'three'
import { PERF_CONFIG } from '../config/performance'
import { deviceProfile } from './deviceProfile'
import { memoryGuard } from './memoryGuard'

export type ZoneId = 'zone1' | 'zone2' | 'zone3' | 'zone4' | 'zone5'
export type ZoneStatus = 'unloaded' | 'loading' | 'ready' | 'active'

export interface SubAreaConfig {
  id: string
  name: string
  center: [number, number, number]
  radius: number
  isLoaded: boolean
  mount: () => THREE.Object3D | Promise<THREE.Object3D>
  node?: THREE.Object3D
}

export interface ZoneRecord {
  id: ZoneId
  status: ZoneStatus
  rootGroup: THREE.Group | null
  subAreas: Map<string, SubAreaConfig>
  lastActivated: number
  explorationProgress: number
}

class ZoneLifecycleManager {
  private zones = new Map<ZoneId, ZoneRecord>()
  private activeZoneId: ZoneId | null = null
  private lruHistory: ZoneId[] = []
  private isPrefetching = false

  constructor() {
    const allZones: ZoneId[] = ['zone1', 'zone2', 'zone3', 'zone4', 'zone5']
    allZones.forEach((id) => {
      this.zones.set(id, {
        id,
        status: 'unloaded',
        rootGroup: null,
        subAreas: new Map(),
        lastActivated: 0,
        explorationProgress: 0,
      })
    })
  }

  /**
   * Daftarkan sub-area untuk lazy loading jarak
   */
  public registerSubArea(zoneId: ZoneId, area: SubAreaConfig): void {
    const zone = this.zones.get(zoneId)
    if (zone) {
      zone.subAreas.set(area.id, area)
    }
  }

  /**
   * Aktifkan zona dan buang zona lama jika melebihi batas LRU
   */
  public async activateZone(
    zoneId: ZoneId,
    scene: THREE.Scene,
    factory: () => Promise<THREE.Group>,
    onProgress?: (progress: number) => void,
  ): Promise<THREE.Group> {
    const profile = deviceProfile.getProfile()
    const maxZones = profile.isMobile
      ? PERF_CONFIG.zones.maxZonesInMemory.mobile
      : PERF_CONFIG.zones.maxZonesInMemory.desktop

    const targetZone = this.zones.get(zoneId)!

    // 1. Jika sudah ada di memori, aktifkan langsung
    if (targetZone.status === 'ready' && targetZone.rootGroup) {
      this.setZoneActive(zoneId, scene)
      return targetZone.rootGroup
    }

    // 2. Jika belum dimuat, panggil factory
    targetZone.status = 'loading'
    onProgress?.(0.2)

    const group = await factory()
    targetZone.rootGroup = group
    targetZone.status = 'ready'
    onProgress?.(1.0)

    // 3. Tambahkan ke LRU dan evict jika melebihi kuota
    this.lruHistory = this.lruHistory.filter((id) => id !== zoneId)
    this.lruHistory.push(zoneId)

    this.enforceLRUQuota(maxZones, scene)
    this.setZoneActive(zoneId, scene)

    return group
  }

  /**
   * Periksa jarak kamera ke sub-area dan muat/bongkar secara lazy
   */
  public updateSubAreas(cameraPosition: THREE.Vector3): void {
    if (!this.activeZoneId) return
    const activeZone = this.zones.get(this.activeZoneId)
    if (!activeZone || !activeZone.rootGroup) return

    const threshold = PERF_CONFIG.zones.subAreaDistanceThreshold

    activeZone.subAreas.forEach(async (area) => {
      const areaCenter = new THREE.Vector3(...area.center)
      const distance = cameraPosition.distanceTo(areaCenter)

      // Lazy Mount saat kamera mendekat
      if (distance <= threshold && !area.isLoaded) {
        area.isLoaded = true
        const obj = await area.mount()
        area.node = obj
        activeZone.rootGroup?.add(obj)
      }
      // Unmount saat kamera menjauh (hemat draw calls)
      else if (distance > threshold * 1.35 && area.isLoaded && area.node) {
        activeZone.rootGroup?.remove(area.node)
        memoryGuard.disposeHierarchy(area.node)
        area.node = undefined
        area.isLoaded = false
      }
    })
  }

  /**
   * Lacak progres eksplorasi pengunjung untuk trigger prefetch zona berikutnya
   */
  public reportProgress(zoneId: ZoneId, progressRatio: number): void {
    const zone = this.zones.get(zoneId)
    if (zone) {
      zone.explorationProgress = Math.max(zone.explorationProgress, progressRatio)
      if (
        zone.explorationProgress >= PERF_CONFIG.zones.prefetchProgressThreshold &&
        !this.isPrefetching
      ) {
        this.triggerPrefetchNextZone(zoneId)
      }
    }
  }

  public getActiveZoneId(): ZoneId | null {
    return this.activeZoneId
  }

  public getLoadedZones(): ZoneId[] {
    const loaded: ZoneId[] = []
    this.zones.forEach((z) => {
      if (z.status === 'ready' || z.status === 'active') loaded.push(z.id)
    })
    return loaded
  }

  private setZoneActive(zoneId: ZoneId, scene: THREE.Scene): void {
    // Sembunyikan zona aktif sebelumnya
    if (this.activeZoneId && this.activeZoneId !== zoneId) {
      const prev = this.zones.get(this.activeZoneId)
      if (prev && prev.rootGroup) {
        scene.remove(prev.rootGroup)
        prev.status = 'ready'
      }
    }

    const current = this.zones.get(zoneId)!
    if (current.rootGroup) {
      scene.add(current.rootGroup)
      current.status = 'active'
      current.lastActivated = Date.now()
    }
    this.activeZoneId = zoneId
  }

  private enforceLRUQuota(maxAllowed: number, scene: THREE.Scene): void {
    while (this.lruHistory.length > maxAllowed) {
      const oldestId = this.lruHistory.shift()
      if (oldestId && oldestId !== this.activeZoneId) {
        const zoneToDispose = this.zones.get(oldestId)
        if (zoneToDispose && zoneToDispose.rootGroup) {
          scene.remove(zoneToDispose.rootGroup)
          memoryGuard.disposeHierarchy(zoneToDispose.rootGroup)
          zoneToDispose.rootGroup = null
          zoneToDispose.status = 'unloaded'
          zoneToDispose.subAreas.clear()
        }
      }
    }
  }

  private async triggerPrefetchNextZone(currentZoneId: ZoneId): Promise<void> {
    const profile = deviceProfile.getProfile()
    if (profile.isSaveDataActive || profile.tier === 'lite') return

    // Cek status baterai jika didukung (hemat daya)
    const nav = typeof navigator !== 'undefined' ? (navigator as any) : {}
    if (nav.getBattery) {
      try {
        const battery = await nav.getBattery()
        if (battery.level < 0.25 && !battery.charging) return
      } catch {
        // Abaikan
      }
    }

    const flow: Record<ZoneId, ZoneId | null> = {
      zone1: 'zone2',
      zone2: 'zone3',
      zone3: 'zone4',
      zone4: 'zone5',
      zone5: null,
    }

    const nextZone = flow[currentZoneId]
    if (!nextZone) return

    this.isPrefetching = true
    // Aset zona berikutnya di-precache diam-diam lewat Service Worker / AssetManager
    setTimeout(() => {
      this.isPrefetching = false
    }, 15000)
  }
}

export const zoneManager = new ZoneLifecycleManager()
