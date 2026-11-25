/**
 * Museum Virtual Undip — Device Profile & Capability Detection
 * Menentukan profil performa secara cerdas berdasarkan kapabilitas WebGL,
 * hardware concurrency, memory, DPR, dan koneksi Save-Data.
 */

import { PERF_CONFIG, type DeviceTier, type TierSettings } from '../config/performance'

export interface TextureFormatSupport {
  astc: boolean
  etc2: boolean
  bc7: boolean
  s3tc: boolean
  ktx2: boolean
}

export interface ComputedProfile extends TierSettings {
  tier: DeviceTier
  isMobile: boolean
  isSaveDataActive: boolean
  effectiveType: string
  webgl2Supported: boolean
  formats: TextureFormatSupport
  manualOverride: DeviceTier | 'auto'
}

const STORAGE_KEY = 'undip_museum_perf_profile'
const OVERRIDE_KEY = 'undip_museum_tier_override'

/**
 * Uji komprehensif kapabilitas WebGL & format kompresi hardware
 */
function probeWebGLCapabilities(): {
  webgl2: boolean
  rendererString: string
  formats: TextureFormatSupport
} {
  const formats: TextureFormatSupport = {
    astc: false,
    etc2: false,
    bc7: false,
    s3tc: false,
    ktx2: false,
  }

  if (typeof document === 'undefined') {
    return { webgl2: false, rendererString: 'server', formats }
  }

  const canvas = document.createElement('canvas')
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null =
    canvas.getContext('webgl2')

  const webgl2 = gl !== null

  if (!gl) {
    gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as any)
  }

  if (!gl) {
    return { webgl2: false, rendererString: 'unsupported', formats }
  }

  // Periksa ekstensi tekstur terkompresi GPU hardware
  formats.astc = !!gl.getExtension('WEBGL_compressed_texture_astc')
  formats.etc2 = !!(gl.getExtension('WEBGL_compressed_texture_etc') || gl.getExtension('WEBGL_compressed_texture_etc1'))
  formats.s3tc = !!gl.getExtension('WEBGL_compressed_texture_s3tc')
  formats.bc7 = !!gl.getExtension('EXT_texture_compression_bptc')
  formats.ktx2 = formats.astc || formats.etc2 || formats.bc7 || formats.s3tc

  // Dapatkan unmasked renderer GPU jika diizinkan
  let rendererString = 'unknown'
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  if (debugInfo) {
    rendererString = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ''
  }

  return { webgl2, rendererString, formats }
}

/**
 * Heuristik penentuan Tier (Lite / Standard / High)
 */
function evaluateHardwareTier(
  webgl2: boolean,
  rendererStr: string,
  isMobile: boolean,
  isSaveData: boolean,
): DeviceTier {
  if (isSaveData) return 'lite'

  const nav = typeof navigator !== 'undefined' ? (navigator as any) : {}
  const memoryGB = nav.deviceMemory || (isMobile ? 3 : 8)
  const cores = nav.hardwareConcurrency || 4
  const lowerRenderer = rendererStr.toLowerCase()

  // 1. Indikasi Low-End / Thermal-Prone Device
  const isBudgetGPU =
    lowerRenderer.includes('mali-4') ||
    lowerRenderer.includes('mali-t') ||
    lowerRenderer.includes('adreno 3') ||
    lowerRenderer.includes('adreno 505') ||
    lowerRenderer.includes('adreno 506') ||
    lowerRenderer.includes('intel hd graphics') ||
    lowerRenderer.includes('powervr')

  if (!webgl2 || memoryGB <= 3 || cores <= 4 || isBudgetGPU) {
    return 'lite'
  }

  // 2. Indikasi Flagship / Dedicated Desktop GPU
  const isDedicatedDesktopGPU =
    lowerRenderer.includes('nvidia') ||
    lowerRenderer.includes('geforce') ||
    lowerRenderer.includes('rtx') ||
    lowerRenderer.includes('radeon rx') ||
    lowerRenderer.includes('apple m1') ||
    lowerRenderer.includes('apple m2') ||
    lowerRenderer.includes('apple m3')

  if (!isMobile && isDedicatedDesktopGPU && memoryGB >= 8 && cores >= 6) {
    return 'high'
  }

  // 3. iPhone / Android Flagship modern
  if (isMobile && (lowerRenderer.includes('apple gpu') || lowerRenderer.includes('mali-g7') || lowerRenderer.includes('adreno 7'))) {
    return 'standard'
  }

  return 'standard'
}

class DeviceProfileManager {
  private currentProfile: ComputedProfile | null = null

  public getProfile(): ComputedProfile {
    if (this.currentProfile) return this.currentProfile

    // Cek cache localStorage
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    const manualOverride = (typeof localStorage !== 'undefined'
      ? (localStorage.getItem(OVERRIDE_KEY) as DeviceTier | 'auto')
      : null) || 'auto'

    if (saved && manualOverride === 'auto') {
      try {
        const parsed = JSON.parse(saved) as ComputedProfile
        this.currentProfile = parsed
        return this.currentProfile
      } catch {
        // Fallback compute ulang bila corrupted
      }
    }

    return this.detectAndCache(manualOverride)
  }

  public setManualOverride(tier: DeviceTier | 'auto'): ComputedProfile {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(OVERRIDE_KEY, tier)
    }
    return this.detectAndCache(tier)
  }

  public selectAssetVariant(basePath: string): string {
    const profile = this.getProfile()
    const quality = profile.textureQuality // '1k' | '2k' | '4k'
    
    // Pola format: misal basePath = "/textures/marble.png" -> "/textures/1k/marble.webp"
    const lastSlash = basePath.lastIndexOf('/')
    if (lastSlash === -1) return basePath

    const dir = basePath.substring(0, lastSlash)
    const file = basePath.substring(lastSlash + 1)
    return `${dir}/${quality}/${file}`
  }

  private detectAndCache(manualOverride: DeviceTier | 'auto'): ComputedProfile {
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth <= 820 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches))

    const nav = typeof navigator !== 'undefined' ? (navigator as any) : {}
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection || {}
    const isSaveDataActive = !!conn.saveData
    const effectiveType = conn.effectiveType || '4g'

    const { webgl2, rendererString, formats } = probeWebGLCapabilities()
    const autoTier = evaluateHardwareTier(webgl2, rendererString, isMobile, isSaveDataActive)
    const effectiveTier = manualOverride !== 'auto' ? manualOverride : autoTier

    const tierSettings = PERF_CONFIG.tiers[effectiveTier]

    const profile: ComputedProfile = {
      ...tierSettings,
      tier: effectiveTier,
      isMobile,
      isSaveDataActive,
      effectiveType,
      webgl2Supported: webgl2,
      formats,
      manualOverride,
    }

    this.currentProfile = profile

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
      } catch {
        // Abaikan jika localStorage diblokir/private mode
      }
    }

    return profile
  }
}

export const deviceProfile = new DeviceProfileManager()
