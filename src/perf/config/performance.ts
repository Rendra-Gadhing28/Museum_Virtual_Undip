/**
 * Museum Virtual Undip — Master Performance & Caching Configuration
 * Single Source of Truth untuk seluruh batasan perangkat, anggaran memori,
 * toleransi FPS adaptif, kuota cache, dan konfigurasi Service Worker PWA.
 */

export type DeviceTier = 'lite' | 'standard' | 'high'
export type TextureQuality = '1k' | '2k' | '4k'

export interface TierSettings {
  maxPixelRatio: number
  maxTextureSize: number
  textureQuality: TextureQuality
  shadows: boolean
  shadowMapSize: number
  postProcessing: boolean
  enableBloom: boolean
  enableDOF: boolean
  enableVignette: boolean
  particleMultiplier: number
  antialias: boolean
  useBakedLightingOnly: boolean
  maxDrawCalls: number
  targetFPS: number
  maxParallelDownloads: number
}

export const PERF_CONFIG = {
  // 1. Profil Spesifikasi Perangkat
  tiers: {
    lite: {
      maxPixelRatio: 1.0,
      maxTextureSize: 1024,
      textureQuality: '1k',
      shadows: false,
      shadowMapSize: 512,
      postProcessing: false,
      enableBloom: false,
      enableDOF: false,
      enableVignette: true,
      particleMultiplier: 0.35,
      antialias: false,
      useBakedLightingOnly: true,
      maxDrawCalls: 65,
      targetFPS: 30,
      maxParallelDownloads: 3,
    } as TierSettings,

    standard: {
      maxPixelRatio: 1.5,
      maxTextureSize: 2048,
      textureQuality: '2k',
      shadows: true,
      shadowMapSize: 1024,
      postProcessing: true,
      enableBloom: true,
      enableDOF: false,
      enableVignette: true,
      particleMultiplier: 0.7,
      antialias: true,
      useBakedLightingOnly: false,
      maxDrawCalls: 130,
      targetFPS: 45,
      maxParallelDownloads: 6,
    } as TierSettings,

    high: {
      maxPixelRatio: 2.0,
      maxTextureSize: 4096,
      textureQuality: '4k',
      shadows: true,
      shadowMapSize: 2048,
      postProcessing: true,
      enableBloom: true,
      enableDOF: true,
      enableVignette: true,
      particleMultiplier: 1.0,
      antialias: true,
      useBakedLightingOnly: false,
      maxDrawCalls: 220,
      targetFPS: 60,
      maxParallelDownloads: 8,
    } as TierSettings,
  },

  // 2. Batas Memori & Manajemen Siklus Hidup Zona (LRU)
  zones: {
    maxZonesInMemory: {
      mobile: 1,      // Di HP hanya boleh 1 zona di RAM/VRAM
      tablet: 2,
      desktop: 2,
    },
    // Ambang batas jarak kamera (dalam meter konseptual) untuk lazy load sub-area
    subAreaDistanceThreshold: 38.0,
    // Trigger prefetch zona berikutnya bila pengunjung telah menjelajahi X persen
    prefetchProgressThreshold: 0.60,
  },

  // 3. Render On-Demand & Hemat Baterai
  renderLoop: {
    idleFPS: 15,                 // Turunkan FPS saat kamera dan animasi statis
    idleTimeoutMs: 3500,         // Menit ke idle setelah 3.5 detik tanpa interaksi
    resizeDebounceMs: 180,
    maxDeltaTimeSec: 0.1,        // Mencegah physics/animation spike saat tab kembali fokus
  },

  // 4. Adaptif Quality Scaler (Dynamic Throttling)
  qualityScaler: {
    sampleWindowSeconds: 3.5,    // Window kalkulasi rata-rata bergerak FPS
    dropThresholdFPS: 24,        // Ambang batas turun kualitas
    raiseThresholdFPS: 54,       // Ambang batas naik kualitas
    cooldownPeriodSeconds: 10.0, // Jeda waktu sebelum boleh mengubah tier lagi
  },

  // 5. Anggaran Memori VRAM & Perlindungan Crash (Memory Guard)
  memory: {
    maxGPUMemoryMB: {
      lite: 280,      // Maksimal 280 MB VRAM untuk HP budget
      standard: 620,  // 620 MB untuk laptop standar / iPhone
      high: 1200,     // 1.2 GB untuk PC gaming
    },
    warningThresholdPercent: 0.85,
  },

  // 6. Level of Detail (LOD) & Frustum Culling
  lod: {
    distances: {
      near: 14.0,     // Detail penuh (LOD 0)
      medium: 32.0,   // Detail sedang (LOD 1)
      far: 65.0,      // Low-poly / billboard impostor (LOD 2)
    },
    hysteresisMargin: 2.5, // Mencegah kedipan bolak-balik di batas jarak
    updateIntervalFrames: 6, // Hitung LOD tiap 6 frame
  },

  // 7. Penyimpanan & PWA Service Worker Cache
  storage: {
    cachePrefix: 'undip-museum',
    version: 'v1.4.0',
    maxAssetCacheEntries: 180,
    assetTTLSeconds: 30 * 24 * 60 * 60, // 30 Hari
    quotaWarningThresholdRatio: 0.85,    // Peringatan saat storage browser terpakai 85%
  },

  // 8. Anggaran Transfer Jaringan per Zona (CI/CD Budget Check)
  budgetsKB: {
    zone3: 4500,  // Maks 4.5 MB transfer total
    zone4: 5500,  // Maks 5.5 MB transfer total
    zone5: 6000,  // Maks 6.0 MB transfer total
  },
} as const
