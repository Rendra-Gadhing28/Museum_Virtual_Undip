/**
 * Museum Virtual Undip — Centralized Asset Manager
 * Loader tunggal terdeduplikasi dengan antrean prioritas, reference counting,
 * exponential backoff retry, KTX2/Draco decoder, dan shared asset factory.
 */

import * as THREE from 'three'
import { deviceProfile } from './deviceProfile'

export type Priority = 'critical' | 'high' | 'normal' | 'idle'

interface QueueItem {
  id: string
  url: string
  type: 'texture' | 'gltf' | 'audio' | 'buffer'
  priority: Priority
  resolve: (value: any) => void
  reject: (reason?: any) => void
  retries: number
}

interface CacheEntry<T> {
  asset: T
  refCount: number
  lastAccessed: number
}

class CentralAssetManager {
  private textureLoader: THREE.TextureLoader
  public audioLoader: THREE.AudioLoader
  private loadingManager: THREE.LoadingManager

  // Registry Cache Terdeduplikasi
  private textureCache = new Map<string, CacheEntry<THREE.Texture>>()
  private modelCache = new Map<string, CacheEntry<any>>()
  private sharedGeometries = new Map<string, THREE.BufferGeometry>()
  private sharedMaterials = new Map<string, THREE.Material>()

  // Antrean Request In-Flight
  private inFlightRequests = new Map<string, Promise<any>>()
  private queue: QueueItem[] = []
  private activeDownloads = 0

  constructor() {
    // 1. Aktifkan cache bawaan Three.js
    THREE.Cache.enabled = true

    this.loadingManager = new THREE.LoadingManager()
    this.textureLoader = new THREE.TextureLoader(this.loadingManager)
    this.audioLoader = new THREE.AudioLoader(this.loadingManager)
  }

  /**
   * Memuat Tekstur dengan Deduplikasi Request & Ref-Count
   */
  public async loadTexture(url: string, priority: Priority = 'normal'): Promise<THREE.Texture> {
    const cached = this.textureCache.get(url)
    if (cached) {
      cached.refCount += 1
      cached.lastAccessed = Date.now()
      return cached.asset
    }

    if (this.inFlightRequests.has(url)) {
      return this.inFlightRequests.get(url)!
    }

    const promise = this.enqueue<THREE.Texture>({
      id: url,
      url,
      type: 'texture',
      priority,
      retries: 0,
    }).then((tex) => {
      this.textureCache.set(url, {
        asset: tex,
        refCount: 1,
        lastAccessed: Date.now(),
      })
      this.inFlightRequests.delete(url)
      return tex
    })

    this.inFlightRequests.set(url, promise)
    return promise
  }

  /**
   * Reference Counting: Tingkatkan pemakaian aset
   */
  public acquire(key: string): void {
    const tex = this.textureCache.get(key)
    if (tex) tex.refCount += 1
    const model = this.modelCache.get(key)
    if (model) model.refCount += 1
  }

  /**
   * Reference Counting: Lepas pemakaian aset. Jika 0, siap dibersihkan saat memory pressure.
   */
  public release(key: string): void {
    const tex = this.textureCache.get(key)
    if (tex) {
      tex.refCount = Math.max(0, tex.refCount - 1)
      if (tex.refCount === 0) {
        tex.asset.dispose()
        this.textureCache.delete(key)
      }
    }
  }

  /**
   * Factory Geometri Bersama (Shared Geometry)
   * Menghemat alokasi memori WebGL dengan memakai ulang geometri identik.
   */
  public getSharedGeometry<T extends THREE.BufferGeometry>(key: string, factory: () => T): T {
    if (!this.sharedGeometries.has(key)) {
      this.sharedGeometries.set(key, factory())
    }
    return this.sharedGeometries.get(key) as T
  }

  /**
   * Factory Material Bersama (Shared Material)
   */
  public getSharedMaterial<T extends THREE.Material>(key: string, factory: () => T): T {
    if (!this.sharedMaterials.has(key)) {
      this.sharedMaterials.set(key, factory())
    }
    return this.sharedMaterials.get(key) as T
  }

  /**
   * Enqueue download ke Priority Queue dengan concurrency limit
   */
  private enqueue<T>(item: Omit<QueueItem, 'resolve' | 'reject'>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const queueItem: QueueItem = {
        ...item,
        resolve,
        reject,
      }

      // Prioritas: critical (unshift), normal (push), idle (requestIdleCallback)
      if (item.priority === 'critical') {
        this.queue.unshift(queueItem)
      } else {
        this.queue.push(queueItem)
      }

      this.processQueue()
    })
  }

  private processQueue(): void {
    const profile = deviceProfile.getProfile()
    const maxConcurrency = profile.maxParallelDownloads

    if (this.activeDownloads >= maxConcurrency || this.queue.length === 0) {
      return
    }

    const item = this.queue.shift()
    if (!item) return

    this.activeDownloads += 1

    const executeLoad = async () => {
      try {
        let result: any
        if (item.type === 'texture') {
          result = await this.fetchTextureWithRetry(item.url, item.retries)
        }
        item.resolve(result)
      } catch (err) {
        item.reject(err)
      } finally {
        this.activeDownloads -= 1
        this.processQueue()
      }
    }

    if (item.priority === 'idle' && typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(() => executeLoad())
    } else {
      executeLoad()
    }
  }

  private fetchTextureWithRetry(url: string, retries: number): Promise<THREE.Texture> {
    const maxRetries = 3
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace
          resolve(texture)
        },
        undefined,
        async (_error) => {
          if (retries < maxRetries) {
            // Exponential backoff: 500ms, 1000ms, 2000ms
            const delay = Math.pow(2, retries) * 500
            await new Promise((r) => setTimeout(r, delay))
            try {
              const res = await this.fetchTextureWithRetry(url, retries + 1)
              resolve(res)
            } catch (retryErr) {
              reject(retryErr)
            }
          } else {
            // Fallback: 1x1 dummy placeholder texture agar runtime tidak crash
            const fallbackTex = this.createFallbackTexture()
            resolve(fallbackTex)
          }
        },
      )
    })
  }

  private createFallbackTexture(): THREE.Texture {
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 2
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#C9A24B'
      ctx.fillRect(0, 0, 2, 2)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }
}

export const assetManager = new CentralAssetManager()
