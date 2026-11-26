import * as THREE from 'three'

/**
 * Museum Virtual Undip - Master Memory Cache
 * Prevents redundant object/texture/geometry re-renders and GPU re-allocations.
 * Caches all canvas textures, shared geometries, and materials in memory.
 */

class AssetCache {
  private textures = new Map<string, THREE.CanvasTexture>()
  private externalTextures = new Map<string, THREE.Texture>()
  private geometries = new Map<string, THREE.BufferGeometry>()
  private materials = new Map<string, THREE.Material>()

  // Antrean loader bertahap (maks 3 unduhan paralel) agar tidak terjadi N+1 load sekaligus
  private loadQueue: Array<{ url: string; onLoaded?: (tex: THREE.Texture) => void }> = []
  private activeLoads = 0
  private readonly maxConcurrentLoads = 3
  private loader = new THREE.TextureLoader()

  /**
   * Get or create a cached CanvasTexture.
   * Ensures canvas drawing and GPU texture upload happen strictly once.
   */
  getTexture(key: string, factory: () => THREE.CanvasTexture): THREE.CanvasTexture {
    let tex = this.textures.get(key)
    if (!tex) {
      tex = factory()
      this.textures.set(key, tex)
    }
    return tex
  }

  private pumpQueue() {
    while (this.activeLoads < this.maxConcurrentLoads && this.loadQueue.length > 0) {
      const item = this.loadQueue.shift()!
      const cached = this.externalTextures.get(item.url)
      if (cached) {
        item.onLoaded?.(cached)
        continue
      }

      this.activeLoads++
      this.loader.load(
        item.url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          tex.anisotropy = 8
          this.externalTextures.set(item.url, tex)
          item.onLoaded?.(tex)
          this.activeLoads--
          this.pumpQueue()
        },
        undefined,
        () => {
          this.activeLoads--
          this.pumpQueue()
        },
      )
    }
  }

  /**
   * Asynchronously load and cache external image textures with bounded concurrency.
   * Prevents loading dozens of high-res textures simultaneously on mount.
   */
  loadExternalTexture(url: string, onLoaded?: (tex: THREE.Texture) => void): THREE.Texture | null {
    const cached = this.externalTextures.get(url)
    if (cached) {
      if (onLoaded) onLoaded(cached)
      return cached
    }

    this.loadQueue.push({ url, onLoaded })
    this.pumpQueue()
    return null
  }

  /**
   * Get or create a cached BufferGeometry.
   */
  getGeometry<T extends THREE.BufferGeometry>(key: string, factory: () => T): T {
    let geom = this.geometries.get(key) as T | undefined
    if (!geom) {
      geom = factory()
      this.geometries.set(key, geom)
    }
    return geom
  }

  /**
   * Get or create a cached Material.
   */
  getMaterial<T extends THREE.Material>(key: string, factory: () => T): T {
    let mat = this.materials.get(key) as T | undefined
    if (!mat) {
      mat = factory()
      this.materials.set(key, mat)
    }
    return mat
  }

  /**
   * Clear cache if explicitly needed (e.g. on full app reload).
   */
  clear() {
    this.textures.forEach((tex) => tex.dispose())
    this.externalTextures.forEach((tex) => tex.dispose())
    this.geometries.forEach((geom) => geom.dispose())
    this.materials.forEach((mat) => mat.dispose())
    this.textures.clear()
    this.externalTextures.clear()
    this.geometries.clear()
    this.materials.clear()
  }
}

export const assetCache = new AssetCache()
