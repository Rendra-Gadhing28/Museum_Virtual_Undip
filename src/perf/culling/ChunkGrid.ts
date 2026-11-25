import * as THREE from 'three'
import { CULLING_CONFIG } from './CullingConfig'

export interface CulledEntity {
  id: string
  object: THREE.Object3D
  isDynamic: boolean
  radius: number
  worldPosition: THREE.Vector3
  visible: boolean
  originalRaycast?: any
}

export class SpatialChunk {
  public key: string
  public minX: number
  public maxX: number
  public minZ: number
  public maxZ: number
  public boundingSphere: THREE.Sphere
  public boundingBox: THREE.Box3
  public entities: CulledEntity[] = []
  public isVisible = true

  constructor(cx: number, cz: number, chunkSize: number) {
    this.key = `${cx},${cz}`
    this.minX = cx * chunkSize
    this.maxX = this.minX + chunkSize
    this.minZ = cz * chunkSize
    this.maxZ = this.minZ + chunkSize

    const centerX = (this.minX + this.maxX) / 2
    const centerZ = (this.minZ + this.maxZ) / 2
    const radius = Math.hypot(chunkSize / 2, chunkSize / 2) + 4.0 // include Y height margin

    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(centerX, 2.5, centerZ), radius)
    this.boundingBox = new THREE.Box3(
      new THREE.Vector3(this.minX, -1, this.minZ),
      new THREE.Vector3(this.maxX, 8, this.maxZ),
    )
  }

  public addEntity(entity: CulledEntity) {
    this.entities.push(entity)
  }

  public removeEntity(entityId: string) {
    const idx = this.entities.findIndex((e) => e.id === entityId)
    if (idx !== -1) {
      this.entities.splice(idx, 1)
    }
  }
}

/**
 * Spatial Partitioning Uniform Grid for Three.js
 * Divides the gallery floor plan into discrete chunks.
 * Fast O(1) chunk indexing and coarse-to-fine frustum/distance culling.
 */
export class ChunkGrid {
  private chunkSize: number
  private chunks: Map<string, SpatialChunk> = new Map()
  private entityToChunk: Map<string, string> = new Map()
  private dynamicEntities: CulledEntity[] = []

  // Preallocated maths to guarantee ZERO GC in render tick
  private static tempPos = new THREE.Vector3()

  constructor(chunkSize: number = CULLING_CONFIG.chunkSize) {
    this.chunkSize = chunkSize
  }

  public getChunkKey(x: number, z: number): string {
    const cx = Math.floor(x / this.chunkSize)
    const cz = Math.floor(z / this.chunkSize)
    return `${cx},${cz}`
  }

  public getOrCreateChunk(x: number, z: number): SpatialChunk {
    const cx = Math.floor(x / this.chunkSize)
    const cz = Math.floor(z / this.chunkSize)
    const key = `${cx},${cz}`
    let chunk = this.chunks.get(key)
    if (!chunk) {
      chunk = new SpatialChunk(cx, cz, this.chunkSize)
      this.chunks.set(key, chunk)
    }
    return chunk
  }

  public registerEntity(
    id: string,
    object: THREE.Object3D,
    isDynamic = false,
    radius = 2.0,
  ): CulledEntity {
    // Unregister old if exists
    this.unregisterEntity(id)

    object.updateWorldMatrix(true, false)
    object.getWorldPosition(ChunkGrid.tempPos)

    const entity: CulledEntity = {
      id,
      object,
      isDynamic,
      radius,
      worldPosition: ChunkGrid.tempPos.clone(),
      visible: true,
      originalRaycast: object.raycast,
    }

    // Ensure frustumCulled is true on all child meshes
    object.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh) {
        mesh.frustumCulled = true
        if (mesh.geometry && !mesh.geometry.boundingSphere) {
          mesh.geometry.computeBoundingSphere()
        }
      }
    })

    const chunk = this.getOrCreateChunk(entity.worldPosition.x, entity.worldPosition.z)
    chunk.addEntity(entity)
    this.entityToChunk.set(id, chunk.key)

    if (isDynamic) {
      this.dynamicEntities.push(entity)
    }

    return entity
  }

  public unregisterEntity(id: string) {
    const chunkKey = this.entityToChunk.get(id)
    if (chunkKey) {
      const chunk = this.chunks.get(chunkKey)
      if (chunk) {
        chunk.removeEntity(id)
      }
      this.entityToChunk.delete(id)
    }

    const dynIdx = this.dynamicEntities.findIndex((e) => e.id === id)
    if (dynIdx !== -1) {
      this.dynamicEntities.splice(dynIdx, 1)
    }
  }

  public updateDynamicEntities() {
    for (let i = 0; i < this.dynamicEntities.length; i++) {
      const entity = this.dynamicEntities[i]
      entity.object.getWorldPosition(ChunkGrid.tempPos)

      const oldKey = this.entityToChunk.get(entity.id)
      const newKey = this.getChunkKey(ChunkGrid.tempPos.x, ChunkGrid.tempPos.z)

      if (oldKey !== newKey) {
        // Entity crossed chunk boundary
        if (oldKey) {
          const oldChunk = this.chunks.get(oldKey)
          oldChunk?.removeEntity(entity.id)
        }
        const newChunk = this.getOrCreateChunk(ChunkGrid.tempPos.x, ChunkGrid.tempPos.z)
        newChunk.addEntity(entity)
        this.entityToChunk.set(entity.id, newChunk.key)
      }

      entity.worldPosition.copy(ChunkGrid.tempPos)
    }
  }

  public getAllChunks(): IterableIterator<SpatialChunk> {
    return this.chunks.values()
  }

  public getStats() {
    let totalEntities = 0
    let visibleEntities = 0
    let activeChunks = 0

    for (const chunk of this.chunks.values()) {
      if (chunk.isVisible) activeChunks++
      for (const entity of chunk.entities) {
        totalEntities++
        if (entity.visible) visibleEntities++
      }
    }

    return {
      totalChunks: this.chunks.size,
      activeChunks,
      totalEntities,
      visibleEntities,
    }
  }

  public clear() {
    this.chunks.clear()
    this.entityToChunk.clear()
    this.dynamicEntities = []
  }
}
