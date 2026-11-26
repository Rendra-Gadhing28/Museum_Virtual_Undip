import * as THREE from 'three'

export const QUALITY = {
  current: {
    pixelRatioMax: 1.5,
    physicalMaterials: true,
    sheen: true,
    microDetailBump: false,
    particles: 1.0,
    shadows: false,
  },
}

export function CulledObject({ children }: { children?: any; [key: string]: any }) {
  return children ?? null
}

export function LightingRig(_props: any) {
  return null
}

export function DetailPass(_props: any) {
  return null
}

export function PostFX(_props: any) {
  return null
}

// Global texture & material caches
const textureCache = new Map<string, THREE.Texture>()
const materialCache = new Map<string, THREE.Material>()

function pseudoNoise(x: number, y: number, seed: number = 1337): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453123
  return n - Math.floor(n)
}

function smoothNoise(x: number, y: number, seed: number = 1337): number {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)

  const s00 = pseudoNoise(i, j, seed)
  const s10 = pseudoNoise(i + 1, j, seed)
  const s01 = pseudoNoise(i, j + 1, seed)
  const s11 = pseudoNoise(i + 1, j + 1, seed)

  return s00 * (1 - u) * (1 - v) + s10 * u * (1 - v) + s01 * (1 - u) * v + s11 * u * v
}

function fbm(x: number, y: number, octaves: number = 4, seed: number = 42): number {
  let val = 0
  let amp = 0.5
  let freq = 1.0
  for (let o = 0; o < octaves; o++) {
    val += amp * smoothNoise(x * freq, y * freq, seed + o * 100)
    freq *= 2.0
    amp *= 0.5
  }
  return val
}

export function createProceduralNormalMap(
  type: 'stone' | 'wood' | 'metal' | 'fabric' | 'water' | 'paper' | 'bark',
  width: number = 256,
  height: number = 256,
): THREE.CanvasTexture {
  const key = `norm-${type}-${width}x${height}`
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const imgData = ctx.createImageData(width, height)

  const heightField = new Float32Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const u = x / width
      const v = y / height

      let h = 0.5
      if (type === 'stone') {
        h = fbm(u * 12, v * 12, 5, 101) * 0.7 + fbm(u * 40, v * 40, 3, 202) * 0.3
      } else if (type === 'wood') {
        const grain = Math.sin(u * 48 + fbm(u * 6, v * 6, 3, 303) * 8.0) * 0.5 + 0.5
        h = grain * 0.65 + fbm(u * 30, v * 30, 2, 404) * 0.35
      } else if (type === 'metal') {
        const hairline = pseudoNoise(Math.floor(x * 0.2), y * 0.05, 505)
        h = hairline * 0.3 + fbm(u * 8, v * 8, 2, 606) * 0.7
      } else if (type === 'fabric') {
        const wx = Math.sin(u * 160 * Math.PI) * 0.5 + 0.5
        const wy = Math.sin(v * 160 * Math.PI) * 0.5 + 0.5
        h = (wx + wy) * 0.5
      } else {
        h = fbm(u * 16, v * 16, 4, 707)
      }
      heightField[idx] = h
    }
  }

  const strength = type === 'stone' ? 2.5 : type === 'wood' ? 1.8 : 1.2
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const x0 = (x - 1 + width) % width
      const x1 = (x + 1) % width
      const y0 = (y - 1 + height) % height
      const y1 = (y + 1) % height

      const dx = (heightField[y * width + x1] - heightField[y * width + x0]) * strength
      const dy = (heightField[y1 * width + x] - heightField[y0 * width + x]) * strength
      const dz = 1.0

      const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const nx = ((-dx / len) * 0.5 + 0.5) * 255
      const ny = ((-dy / len) * 0.5 + 0.5) * 255
      const nz = ((dz / len) * 0.5 + 0.5) * 255

      const i = (y * width + x) * 4
      imgData.data[i] = nx
      imgData.data[i + 1] = ny
      imgData.data[i + 2] = nz
      imgData.data[i + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.NoColorSpace
  textureCache.set(key, tex)
  return tex
}

export function createProceduralRoughnessMap(baseRoughness: number, variation: number): THREE.CanvasTexture {
  const key = `rough-${baseRoughness.toFixed(2)}-${variation.toFixed(2)}`
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture

  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const imgData = ctx.createImageData(size, size)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = pseudoNoise(x, y, 999) * variation
      const r = Math.min(1, Math.max(0, baseRoughness + n - variation * 0.5))
      const val = Math.round(r * 255)
      const idx = (y * size + x) * 4
      imgData.data[idx] = val
      imgData.data[idx + 1] = val
      imgData.data[idx + 2] = val
      imgData.data[idx + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.NoColorSpace
  textureCache.set(key, tex)
  return tex
}

export const MaterialLibrary = {
  statuaryMarble(color: string = '#f8fafc', roughness: number = 0.22): THREE.MeshStandardMaterial {
    const key = `statuary-marble-${color}-${roughness}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0.05,
    })
    materialCache.set(key, mat)
    return mat
  },

  antiqueBrass(isBright: boolean = false): THREE.MeshStandardMaterial {
    const key = `antique-brass-${isBright}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial
    const mat = new THREE.MeshStandardMaterial({
      color: isBright ? '#e0b85a' : '#b38d38',
      roughness: isBright ? 0.25 : 0.38,
      metalness: 0.88,
    })
    materialCache.set(key, mat)
    return mat
  },

  cremaMarfilMarble(options: { roughness?: number; clearcoat?: number } = {}): THREE.MeshStandardMaterial {
    const r = options.roughness ?? 0.26
    const key = `crema-marfil-${r}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial
    const mat = new THREE.MeshStandardMaterial({
      color: '#f0ece1',
      roughness: r,
      metalness: 0.03,
      normalMap: createProceduralNormalMap('stone', 256, 256),
      roughnessMap: createProceduralRoughnessMap(r, 0.1),
    })
    materialCache.set(key, mat)
    return mat
  },

  royalVelvet(color: string = '#7f1d1d'): THREE.MeshStandardMaterial {
    const key = `royal-velvet-${color}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.9,
      metalness: 0.1,
    })
    materialCache.set(key, mat)
    return mat
  },

  parchmentPaper(color: string = '#f4ecd8'): THREE.MeshStandardMaterial {
    const key = `parchment-${color}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.85,
      metalness: 0.0,
    })
    materialCache.set(key, mat)
    return mat
  },

  museumVitrineGlass(): THREE.MeshPhysicalMaterial {
    const key = 'vitrine-glass'
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshPhysicalMaterial
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      transmission: 0.95,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
    })
    materialCache.set(key, mat)
    return mat
  },

  marineWater(): THREE.MeshPhysicalMaterial {
    const key = 'marine-water'
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshPhysicalMaterial
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#0d5c75',
      transmission: 0.85,
      transparent: true,
      roughness: 0.1,
      ior: 1.33,
    })
    materialCache.set(key, mat)
    return mat
  },

  treeBark(color: string = '#4a3728'): THREE.MeshStandardMaterial {
    const key = `tree-bark-${color}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.9,
      metalness: 0.02,
    })
    materialCache.set(key, mat)
    return mat
  },

  volcanicAndesite(): THREE.MeshStandardMaterial {
    const key = 'volcanic-andesite'
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial
    const mat = new THREE.MeshStandardMaterial({
      color: '#383a3d',
      roughness: 0.85,
      metalness: 0.05,
    })
    materialCache.set(key, mat)
    return mat
  },

  polishedTeakwood(roughness: number = 0.35): THREE.MeshStandardMaterial {
    const key = `teakwood-${roughness}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial
    const mat = new THREE.MeshStandardMaterial({
      color: '#3d2011',
      roughness,
      metalness: 0.05,
    })
    materialCache.set(key, mat)
    return mat
  },

  leafFoliageMaterial(color: string = '#2d5a27'): THREE.MeshStandardMaterial {
    const key = `foliage-${color}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.7,
      metalness: 0.05,
    })
    materialCache.set(key, mat)
    return mat
  },

  carvedStoneMaps() {
    return {
      normalMap: createProceduralNormalMap('stone', 256, 256),
      displacementMap: createProceduralRoughnessMap(0.5, 0.2),
      roughnessMap: createProceduralRoughnessMap(0.65, 0.16),
    }
  },
}
