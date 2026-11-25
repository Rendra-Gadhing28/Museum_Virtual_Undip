/**
 * Museum Virtual Undip — Distance LOD & Frustum Culling Manager
 * Mengelola Level of Detail (LOD) berbasis jarak kamera dengan margin histeresis
 * dan mematikan rendering/animasi objek yang berada di luar frustum kamera.
 */

import * as THREE from 'three'
import { PERF_CONFIG } from '../config/performance'

export interface LODItem {
  id: string
  center: THREE.Vector3
  radius: number
  currentLevel: 0 | 1 | 2
  levels: [THREE.Object3D, THREE.Object3D, THREE.Object3D] // Near, Medium, Far
  onLevelChange?: (level: 0 | 1 | 2) => void
}

class DistanceLODManager {
  private lodRegistry = new Map<string, LODItem>()
  private frameCount = 0
  private frustum = new THREE.Frustum()
  private projScreenMatrix = new THREE.Matrix4()

  public register(item: LODItem): void {
    this.lodRegistry.set(item.id, item)
    // Tampilkan hanya level awal
    item.levels.forEach((node, idx) => {
      node.visible = idx === item.currentLevel
    })
  }

  public unregister(id: string): void {
    this.lodRegistry.delete(id)
  }

  /**
   * Evaluasi LOD dan Frustum Culling secara berkala (tiap N frame)
   */
  public update(camera: THREE.Camera): void {
    this.frameCount += 1
    if (this.frameCount % PERF_CONFIG.lod.updateIntervalFrames !== 0) {
      return
    }

    // 1. Ekstrak Frustum Kamera
    this.projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix)

    const camPos = camera.position
    const { near, medium, far } = PERF_CONFIG.lod.distances
    const margin = PERF_CONFIG.lod.hysteresisMargin

    this.lodRegistry.forEach((item) => {
      // 2. Frustum Culling: Sembunyikan seluruh objek bila berada di luar pandangan
      const sphere = new THREE.Sphere(item.center, item.radius)
      const inFrustum = this.frustum.intersectsSphere(sphere)

      if (!inFrustum) {
        item.levels.forEach((l) => (l.visible = false))
        return
      }

      // 3. Hitung Jarak & Terapkan Histeresis
      const dist = camPos.distanceTo(item.center)
      let nextLevel: 0 | 1 | 2 = item.currentLevel

      if (item.currentLevel === 0) {
        if (dist > near + margin) nextLevel = 1
      } else if (item.currentLevel === 1) {
        if (dist < near - margin) nextLevel = 0
        else if (dist > medium + margin) nextLevel = 2
      } else if (item.currentLevel === 2) {
        if (dist < medium - margin) nextLevel = 1
      }

      if (dist > far + margin) {
        // Culling objek yang terlalu jauh
        item.levels.forEach((l) => (l.visible = false))
        return
      }

      if (nextLevel !== item.currentLevel) {
        item.currentLevel = nextLevel
        item.levels.forEach((node, idx) => {
          node.visible = idx === nextLevel
        })
        item.onLevelChange?.(nextLevel)
      } else {
        // Pastikan level aktif tetap visible jika sebelumnya ter-culled
        item.levels[item.currentLevel].visible = true
      }
    })
  }

  public clear(): void {
    this.lodRegistry.clear()
    this.frameCount = 0
  }
}

export const lodManager = new DistanceLODManager()
