/**
 * Museum Virtual Undip — Ultra HD Graphics Quality Configuration
 * Single Source of Truth & Feature Flag for All Visual Enhancements.
 *
 * Allows real-time toggling, A/B comparison (Before vs After / Ultra vs Vanilla),
 * and fine-grained visual tuning without changing scene graph architecture.
 */

export type QualityPreset = 'Ultra' | 'High' | 'Medium' | 'Vanilla'

export interface QualitySettings {
  /** Master toggle: when false, museum reverts to original baseline graphics */
  enabled: boolean
  preset: QualityPreset

  /** Rendering & Resolution */
  pixelRatioMax: number
  textureSize: 1024 | 2048 | 4096
  anisotropyMax: boolean

  /** PBR Materials & Shading */
  physicalMaterials: boolean
  clearcoat: boolean
  transmission: boolean
  sheen: boolean
  macroVariation: boolean
  microDetailBump: boolean

  /** Lighting & Atmosphere */
  hdrEnvironment: boolean
  envIntensity: number
  contactShadows: boolean
  volumetricShafts: boolean
  softShadows: boolean // Experimental high-spec PCFSoftShadowMap

  /** Post-Processing */
  postProcessing: boolean
  smaa: boolean
  bloom: boolean
  bloomIntensity: number
  bloomThreshold: number
  vignette: boolean
  colorGrading: boolean
  filmGrain: boolean

  /** Geometry & Diorama Details */
  detailProps: boolean // Architectural bevels, corner brackets, screws, stanchions, diorama greenery
  bevelRadius: number
  dioramaGreenery: boolean
}

export const PRESET_CONFIGS: Record<QualityPreset, QualitySettings> = {
  Ultra: {
    enabled: true,
    preset: 'Ultra',
    pixelRatioMax: 2,
    textureSize: 4096,
    anisotropyMax: true,
    physicalMaterials: true,
    clearcoat: true,
    transmission: true,
    sheen: true,
    macroVariation: true,
    microDetailBump: true,
    hdrEnvironment: true,
    envIntensity: 0.15,
    contactShadows: true,
    volumetricShafts: false,
    softShadows: false, // Default off per museum spec, toggleable
    postProcessing: true,
    smaa: true,
    bloom: true,
    bloomIntensity: 0.35,
    bloomThreshold: 0.85,
    vignette: true,
    colorGrading: true,
    filmGrain: false,
    detailProps: true,
    bevelRadius: 0.02,
    dioramaGreenery: true,
  },
  High: {
    enabled: true,
    preset: 'High',
    pixelRatioMax: 1.75,
    textureSize: 2048,
    anisotropyMax: true,
    physicalMaterials: true,
    clearcoat: true,
    transmission: true,
    sheen: false,
    macroVariation: true,
    microDetailBump: false,
    hdrEnvironment: true,
    envIntensity: 0.35,
    contactShadows: true,
    volumetricShafts: false,
    softShadows: false,
    postProcessing: true,
    smaa: true,
    bloom: true,
    bloomIntensity: 0.22,
    bloomThreshold: 0.85,
    vignette: true,
    colorGrading: true,
    filmGrain: false,
    detailProps: true,
    bevelRadius: 0.015,
    dioramaGreenery: true,
  },
  Medium: {
    enabled: true,
    preset: 'Medium',
    pixelRatioMax: 1.25,
    textureSize: 1024,
    anisotropyMax: false,
    physicalMaterials: false,
    clearcoat: false,
    transmission: false,
    sheen: false,
    macroVariation: false,
    microDetailBump: false,
    hdrEnvironment: false,
    envIntensity: 0.6,
    contactShadows: true,
    volumetricShafts: false,
    softShadows: false,
    postProcessing: false,
    smaa: false,
    bloom: false,
    bloomIntensity: 0.0,
    bloomThreshold: 1.0,
    vignette: false,
    colorGrading: false,
    filmGrain: false,
    detailProps: false,
    bevelRadius: 0.0,
    dioramaGreenery: false,
  },
  Vanilla: {
    enabled: false,
    preset: 'Vanilla',
    pixelRatioMax: 1.0,
    textureSize: 1024,
    anisotropyMax: false,
    physicalMaterials: false,
    clearcoat: false,
    transmission: false,
    sheen: false,
    macroVariation: false,
    microDetailBump: false,
    hdrEnvironment: false,
    envIntensity: 0.0,
    contactShadows: false,
    volumetricShafts: false,
    softShadows: false,
    postProcessing: false,
    smaa: false,
    bloom: false,
    bloomIntensity: 0.0,
    bloomThreshold: 1.0,
    vignette: false,
    colorGrading: false,
    filmGrain: false,
    detailProps: false,
    bevelRadius: 0.0,
    dioramaGreenery: false,
  },
}

/**
 * Singleton state holder with subscriber event system
 */
type Listener = (settings: QualitySettings) => void
const listeners = new Set<Listener>()

let currentSettings: QualitySettings = { ...PRESET_CONFIGS.Ultra }

export const QUALITY = {
  get current(): QualitySettings {
    return currentSettings
  },

  setPreset(preset: QualityPreset) {
    currentSettings = { ...PRESET_CONFIGS[preset] }
    this.notify()
  },

  update(partial: Partial<QualitySettings>) {
    currentSettings = { ...currentSettings, ...partial }
    this.notify()
  },

  toggleMaster(enabled?: boolean) {
    const next = enabled !== undefined ? enabled : !currentSettings.enabled
    if (!next) {
      this.setPreset('Vanilla')
    } else {
      this.setPreset('Ultra')
    }
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    listener(currentSettings)
    return () => listeners.delete(listener)
  },

  notify() {
    listeners.forEach((l) => l(currentSettings))
  },
}
