/**
 * Museum Virtual Undip — PWA Storage & IndexedDB Manager
 *
 * Lightweight, zero-dependency IndexedDB key-value store.
 * - Handles offline metadata caching and asset manifests.
 * - Supports navigator.storage.estimate() for quota tracking.
 * - Attempts navigator.storage.persist() to prevent Safari/iOS aggressive eviction.
 * - Fallbacks to localStorage / in-memory if IndexedDB is blocked (e.g. Safari Private Mode).
 */

import { PERF_CONFIG } from '../config/performance'

const DB_NAME = `${PERF_CONFIG.storage.cachePrefix}-idb`
const DB_VERSION = 1
const STORE_NAME = 'museum-kv'

interface StorageMetadata {
  key: string
  val: any
  timestamp: number
  ttl: number
}

class StorageManager {
  private dbPromise: Promise<IDBDatabase | null> | null = null
  private memoryFallback = new Map<string, StorageMetadata>()

  constructor() {
    this.initDB()
    this.requestPersistence()
  }

  private initDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise

    if (typeof window === 'undefined' || !window.indexedDB) {
      this.dbPromise = Promise.resolve(null)
      return this.dbPromise
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION)

        req.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'key' })
          }
        }

        req.onsuccess = () => resolve(req.result)
        req.onerror = () => {
          console.warn('[StorageManager] IndexedDB opening failed, using memory/localStorage fallback.')
          resolve(null)
        }
      } catch {
        resolve(null)
      }
    })

    return this.dbPromise
  }

  /**
   * Request persistent storage to prevent Safari / mobile browsers from wiping cache
   */
  public async requestPersistence(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persist()
        return isPersisted
      } catch {
        return false
      }
    }
    return false
  }

  /**
   * Get quota and usage estimate in MegaBytes
   */
  public async getStorageEstimate(): Promise<{ usageMB: number; quotaMB: number; percent: number }> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const est = await navigator.storage.estimate()
        const usageMB = Math.round(((est.usage || 0) / (1024 * 1024)) * 10) / 10
        const quotaMB = Math.round(((est.quota || 0) / (1024 * 1024)) * 10) / 10
        const percent = quotaMB > 0 ? Math.round((usageMB / quotaMB) * 100) : 0
        return { usageMB, quotaMB, percent }
      } catch {
        // Fallback
      }
    }
    return { usageMB: 0, quotaMB: 0, percent: 0 }
  }

  /**
   * Store a key-value pair with TTL (Time-To-Live in milliseconds)
   */
  public async set<T>(
    key: string,
    val: T,
    ttl: number = PERF_CONFIG.storage.assetTTLSeconds * 1000
  ): Promise<void> {
    const entry: StorageMetadata = {
      key,
      val,
      timestamp: Date.now(),
      ttl,
    }

    const db = await this.initDB()
    if (!db) {
      this.memoryFallback.set(key, entry)
      try {
        localStorage.setItem(key, JSON.stringify(entry))
      } catch {
        // LocalStorage quota exceeded
      }
      return
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.put(entry)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      } catch (err) {
        this.memoryFallback.set(key, entry)
        resolve()
      }
    })
  }

  /**
   * Retrieve a value by key. Returns null if expired or missing.
   */
  public async get<T>(key: string): Promise<T | null> {
    const db = await this.initDB()
    if (!db) {
      let entry = this.memoryFallback.get(key)
      if (!entry) {
        try {
          const raw = localStorage.getItem(key)
          if (raw) entry = JSON.parse(raw)
        } catch {
          // ignore
        }
      }
      if (!entry) return null
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.delete(key)
        return null
      }
      return entry.val as T
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const req = store.get(key)
        req.onsuccess = () => {
          const entry = req.result as StorageMetadata | undefined
          if (!entry) {
            resolve(null)
            return
          }
          if (Date.now() - entry.timestamp > entry.ttl) {
            this.delete(key)
            resolve(null)
            return
          }
          resolve(entry.val as T)
        }
        req.onerror = () => resolve(null)
      } catch {
        resolve(null)
      }
    })
  }

  /**
   * Delete an entry by key
   */
  public async delete(key: string): Promise<void> {
    this.memoryFallback.delete(key)
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }

    const db = await this.initDB()
    if (!db) return

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.delete(key)
        req.onsuccess = () => resolve()
        req.onerror = () => resolve()
      } catch {
        resolve()
      }
    })
  }

  /**
   * Purge all expired entries across store
   */
  public async purgeExpired(): Promise<number> {
    const db = await this.initDB()
    if (!db) return 0

    let purgedCount = 0
    const now = Date.now()

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.openCursor()

        req.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result
          if (cursor) {
            const entry = cursor.value as StorageMetadata
            if (entry && now - entry.timestamp > entry.ttl) {
              cursor.delete()
              purgedCount++
            }
            cursor.continue()
          } else {
            resolve(purgedCount)
          }
        }
        req.onerror = () => resolve(purgedCount)
      } catch {
        resolve(purgedCount)
      }
    })
  }
}

export const storageManager = new StorageManager()
