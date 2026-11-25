/**
 * Museum Virtual Undip — Performance, Caching & Lifecycle Suite
 *
 * Comprehensive optimization layer:
 * - Adaptive GPU Tier detection & dynamic throttling
 * - LRU memory & zone management
 * - Static caching & asset loaders
 * - PWA Service Worker & IndexedDB persistent caching
 * - Real-time diagnostics HUD
 */

export * from './config/performance'
export * from './core/deviceProfile'
export * from './core/zoneManager'
export * from './core/memoryGuard'
export * from './core/renderLoop'
export * from './core/qualityScaler'
export * from './core/staticCache'
export * from './core/EntityCulling'
export * from './core/useDOMEntityCulling'
export * from './core/assetManager'
export * from './core/lodManager'
export * from './pwa/storageManager'
export * from './pwa/serviceWorkerRegister'
export * from './debug/PerfOverlay'
