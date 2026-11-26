import * as THREE from 'three'
import { PALETTE } from './palette'

export type GFXMode = 'ORIGINAL' | 'ULTRA' | 'EXAGGERATE'

export type ZoneId = 'zone1' | 'zone2' | 'zone3'

export interface ZoneGfxSettings {
  id: ZoneId
  name: string
  subtitle: string

  // Kamera & Rendering
  exposure: number
  toneMapping: THREE.ToneMapping
  pixelRatioMax: number

  // Pencahayaan Kunci
  ambientColor: string
  ambientIntensity: number
  keyLightColor: string
  keyLightIntensity: number
  keyLightPosition: [number, number, number]
  keyLightTarget: [number, number, number]

  // Frustum Shadow Box3 Presisi (Fit to Zone Bounds)
  shadowBounds: {
    minX: number
    maxX: number
    minY: number
    maxY: number
    minZ: number
    maxZ: number
  }
  shadowMapSize: number
  shadowBias: number
  shadowNormalBias: number
  shadowCameraNear: number
  shadowCameraFar: number

  // Environment & IBL Gradient (Fallback Generator jika HDR offline)
  envColors: {
    ceiling: string
    wallAmbient: string
    trimHighlight: string
    floorReflection: string
  }
  envIntensity: number

  // Rekomendasi Aset HDR CC0 Poly Haven Terverifikasi
  recommendedHdr: {
    name: string
    source: string
    colorTemp: string
    reason: string
  }

  // Parameter PostFX & Exaggerate
  vignetteIntensity: number
  bloomThreshold: number
  bloomIntensity: number
  colorTint: [number, number, number]
}

export const ZONE_GFX: Record<ZoneId, ZoneGfxSettings> = {
  zone1: {
    id: 'zone1',
    name: 'Zona 1: Pelopor & Sejarah Awal',
    subtitle: 'Warm Classical Founding Hall (2800K, Deep Mahogany, Golden Chandeliers)',
    exposure: 0.92,
    toneMapping: THREE.ACESFilmicToneMapping,
    pixelRatioMax: 2.5,
    ambientColor: '#251c14',
    ambientIntensity: 0.16,
    keyLightColor: '#fffaf0',
    keyLightIntensity: 0.22,
    keyLightPosition: [2.5, 14.5, -6.0],
    keyLightTarget: [0, 0, -6.0],
    shadowBounds: {
      minX: -11.0,
      maxX: 11.0,
      minY: 0.0,
      maxY: 10.0,
      minZ: -20.0,
      maxZ: 14.0,
    },
    shadowMapSize: 2048,
    shadowBias: -0.0004,
    shadowNormalBias: 0.038,
    shadowCameraNear: 1.0,
    shadowCameraFar: 36.0,
    envColors: {
      ceiling: '#1c1712',
      wallAmbient: '#3a2b1d',
      trimHighlight: PALETTE.royalGoldMonument,
      floorReflection: PALETTE.marbleFloorBase,
    },
    envIntensity: 0.32,
    recommendedHdr: {
      name: 'vintage_measuring_lab_2k',
      source: 'https://polyhaven.com/a/vintage_measuring_lab',
      colorTemp: '2800K',
      reason: 'Interior kayu antik gelap dengan pencahayaan chandelier hangat yang merefleksikan wainscoting jati Zona 1.',
    },
    vignetteIntensity: 0.42,
    bloomThreshold: 0.88,
    bloomIntensity: 0.18,
    colorTint: [1.03, 1.0, 0.96],
  },

  zone2: {
    id: 'zone2',
    name: 'Zona 2: Transformasi & Ekspansi',
    subtitle: 'Golden Academic Amber (3000K, Centerpiece Maket Kampus)',
    exposure: 1.10,
    toneMapping: THREE.ACESFilmicToneMapping,
    pixelRatioMax: 2.5,
    ambientColor: '#22180e',
    ambientIntensity: 0.20,
    keyLightColor: '#fff5e0',
    keyLightIntensity: 0.32,
    keyLightPosition: [3.2, 14.8, -8.0],
    keyLightTarget: [0, 0, -8.0],
    shadowBounds: {
      minX: -11.0,
      maxX: 11.0,
      minY: 0.0,
      maxY: 10.0,
      minZ: -28.0,
      maxZ: 14.0,
    },
    shadowMapSize: 2048,
    shadowBias: -0.00035,
    shadowNormalBias: 0.035,
    shadowCameraNear: 1.0,
    shadowCameraFar: 42.0,
    envColors: {
      ceiling: '#22190f',
      wallAmbient: '#45331e',
      trimHighlight: '#f59e0b',
      floorReflection: '#110d08',
    },
    envIntensity: 0.38,
    recommendedHdr: {
      name: 'solitude_interior_2k',
      source: 'https://polyhaven.com/a/solitude_interior',
      colorTemp: '3000K',
      reason: 'Plafon tinggi dengan cahaya aksen meja diorama arsitektural yang menonjolkan marmer ivory.',
    },
    vignetteIntensity: 0.36,
    bloomThreshold: 0.84,
    bloomIntensity: 0.28,
    colorTint: [1.04, 1.01, 0.95],
  },

  zone3: {
    id: 'zone3',
    name: 'Zona 3: Spirit & Warisan Diponegoro',
    subtitle: 'Sacred Heritage & Andesite Stone Sanctum (2700K Low-Key)',
    exposure: 1.04,
    toneMapping: THREE.ACESFilmicToneMapping,
    pixelRatioMax: 2.5,
    ambientColor: '#1e160e',
    ambientIntensity: 0.18,
    keyLightColor: '#ffe9cc',
    keyLightIntensity: 0.30,
    keyLightPosition: [0.0, 14.0, -12.0],
    keyLightTarget: [0, 1.2, -12.0],
    shadowBounds: {
      minX: -11.0,
      maxX: 11.0,
      minY: 0.0,
      maxY: 10.0,
      minZ: -32.0,
      maxZ: 14.0,
    },
    shadowMapSize: 2048,
    shadowBias: -0.0004,
    shadowNormalBias: 0.04,
    shadowCameraNear: 1.0,
    shadowCameraFar: 46.0,
    envColors: {
      ceiling: '#141210',
      wallAmbient: '#2e261a',
      trimHighlight: PALETTE.antiqueBrass,
      floorReflection: '#0a0907',
    },
    envIntensity: 0.35,
    recommendedHdr: {
      name: 'castle_zappe_interior_2k',
      source: 'https://polyhaven.com/a/castle_zappe_interior',
      colorTemp: '2700K',
      reason: 'Suasana aula pusaka berwibawa dengan kontras chiaroscuro tajam untuk artefak keris dan prasasti.',
    },
    vignetteIntensity: 0.44,
    bloomThreshold: 0.80,
    bloomIntensity: 0.32,
    colorTint: [1.02, 0.99, 0.95],
  },
}
