import * as THREE from 'three'
import { QUALITY } from './QualityConfig'

/**
 * Museum Virtual Undip — Ultra HD PBR Material Library
 * Provides physically-accurate materials with procedural multi-octave normal maps,
 * roughness maps, contact AO, and clearcoat/sheen/transmission properties.
 *
 * Implements strict memory caching and safe dispose to prevent memory leaks.
 */

// Global texture & material caches
const textureCache = new Map<string, THREE.Texture>()
const materialCache = new Map<string, THREE.Material>()

/**
 * Multi-octave 2D value noise for procedural maps
 */
function pseudoNoise(x: number, y: number, seed: number = 1337): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453123
  return n - Math.floor(n)
}

function smoothNoise(x: number, y: number, seed: number = 1337): number {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j

  // Cubic Hermite curve
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)

  const s00 = pseudoNoise(i, j, seed)
  const s10 = pseudoNoise(i + 1, j, seed)
  const s01 = pseudoNoise(i, j + 1, seed)
  const s11 = pseudoNoise(i + 1, j + 1, seed)

  return (
    s00 * (1 - u) * (1 - v) +
    s10 * u * (1 - v) +
    s01 * (1 - u) * v +
    s11 * u * v
  )
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

/**
 * Generate high-definition normal map from procedural heightmap
 */
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
  const data = imgData.data

  const heightField = new Float32Array(width * height)

  // 1. Generate height field based on material type
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const u = x / width
      const v = y / height

      let h = 0.5
      if (type === 'stone') {
        // Porous volcanic / marble micro-relief
        h = fbm(u * 12, v * 12, 5, 101) * 0.7 + fbm(u * 40, v * 40, 3, 202) * 0.3
      } else if (type === 'wood') {
        // Linear wood grain with subtle wavy fibers
        const grain = Math.sin(u * 48 + fbm(u * 6, v * 6, 3, 303) * 8.0) * 0.5 + 0.5
        h = grain * 0.65 + fbm(u * 30, v * 30, 2, 404) * 0.35
      } else if (type === 'metal') {
        // Brushed hairline texture along X
        const hairline = pseudoNoise(Math.floor(x * 0.2), y * 0.05, 505)
        h = hairline * 0.3 + fbm(u * 8, v * 8, 2, 606) * 0.7
      } else if (type === 'fabric') {
        // Cross-weave microfiber
        const wx = Math.sin(u * 160 * Math.PI) * 0.5 + 0.5
        const wy = Math.sin(v * 160 * Math.PI) * 0.5 + 0.5
        h = (wx + wy) * 0.5
      } else if (type === 'water') {
        // Soft caustics / ripples
        h =
          Math.sin(u * 14 + fbm(u * 4, v * 4, 3, 707) * 4) * 0.5 +
          Math.cos(v * 14 + fbm(u * 4, v * 4, 3, 808) * 4) * 0.5
      } else if (type === 'paper') {
        // Fine cotton/parchment paper fibers
        h = fbm(u * 36, v * 36, 4, 1111) * 0.65 + pseudoNoise(x * 0.7, y * 0.7, 1212) * 0.35
      } else if (type === 'bark') {
        // Deep vertical tree bark ridges
        const ridge = Math.sin(u * 26 + fbm(u * 5, v * 12, 4, 1313) * 6.0) * 0.5 + 0.5
        h = ridge * 0.75 + fbm(u * 16, v * 32, 3, 1414) * 0.25
      }
      heightField[idx] = h
    }
  }

  // 2. Compute tangent space normal using Sobel filter
  const strength =
    type === 'stone' ? 2.8 :
    type === 'bark' ? 3.2 :
    type === 'wood' ? 1.8 :
    type === 'fabric' ? 1.4 :
    type === 'paper' ? 1.1 :
    type === 'metal' ? 0.9 : 1.2

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const x0 = (x - 1 + width) % width
      const x1 = (x + 1) % width
      const y0 = (y - 1 + height) % height
      const y1 = (y + 1) % height

      const hL = heightField[y * width + x0]
      const hR = heightField[y * width + x1]
      const hD = heightField[y0 * width + x]
      const hU = heightField[y1 * width + x]

      // Finite difference gradient
      const dx = (hR - hL) * strength
      const dy = (hU - hD) * strength
      const dz = 1.0

      // Normalize normal vector
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const nx = dx / len
      const ny = dy / len
      const nz = dz / len

      const pIdx = (y * width + x) * 4
      data[pIdx] = Math.round((nx * 0.5 + 0.5) * 255)
      data[pIdx + 1] = Math.round((ny * 0.5 + 0.5) * 255)
      data[pIdx + 2] = Math.round((nz * 0.5 + 0.5) * 255)
      data[pIdx + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.NoColorSpace // Linear for normal map
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 8

  textureCache.set(key, texture)
  return texture
}

/**
 * Generate subtle roughness variation map with micro-scratches & natural patina
 */
export function createProceduralRoughnessMap(
  baseRoughness: number,
  variance: number = 0.15,
  width: number = 256,
  height: number = 256,
): THREE.CanvasTexture {
  const key = `rough-${baseRoughness.toFixed(2)}-${variance.toFixed(2)}-${width}`
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const imgData = ctx.createImageData(width, height)
  const data = imgData.data

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width
      const v = y / height
      const n = fbm(u * 10, v * 10, 4, 999) - 0.5
      const r = Math.max(0.04, Math.min(0.96, baseRoughness + n * variance))
      const val = Math.round(r * 255)

      const idx = (y * width + x) * 4
      data[idx] = val
      data[idx + 1] = val
      data[idx + 2] = val
      data[idx + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.NoColorSpace // Linear for data maps
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter

  textureCache.set(key, texture)
  return texture
}

/**
 * Contact Shadow Soft AO Map (Gaussian Radial Falloff)
 */
export function createContactShadowTexture(width: number = 512, height: number = 512): THREE.CanvasTexture {
  const key = `contact-shadow-${width}x${height}`
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  const cx = width / 2
  const cy = height / 2
  const radius = Math.min(cx, cy) * 0.95

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)')
  grad.addColorStop(0.35, 'rgba(10, 8, 6, 0.48)')
  grad.addColorStop(0.7, 'rgba(20, 16, 12, 0.16)')
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  textureCache.set(key, texture)
  return texture
}

/**
 * Master PBR Material Factory
 */
export const MaterialLibrary = {
  /**
   * 1. Polished Crema Marfil Marble (Floor & Monument Plinths)
   */
  cremaMarfilMarble(options: { roughness?: number; clearcoat?: number } = {}): THREE.MeshPhysicalMaterial {
    const key = `mat-crema-marfil-${options.roughness ?? 0.22}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshPhysicalMaterial

    const stoneNormal = createProceduralNormalMap('stone', 1024, 1024)
    stoneNormal.repeat.set(4, 4)
    const stoneRough = createProceduralRoughnessMap(options.roughness ?? 0.22, 0.12)
    stoneRough.repeat.set(4, 4)

    const mat = new THREE.MeshPhysicalMaterial({
      color: '#f4efe6',
      roughness: options.roughness ?? 0.22,
      metalness: 0.05,
      normalMap: QUALITY.current.physicalMaterials ? stoneNormal : null,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughnessMap: QUALITY.current.physicalMaterials ? stoneRough : null,
      clearcoat: QUALITY.current.clearcoat ? (options.clearcoat ?? 0.4) : 0,
      clearcoatRoughness: 0.15,
      reflectivity: 0.85,
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 2. Hand-Rubbed Polished Teakwood (Kayu Jati Klasik Perdana)
   */
  polishedTeakwood(): THREE.MeshPhysicalMaterial {
    const key = 'mat-polished-teakwood'
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshPhysicalMaterial

    const woodNormal = createProceduralNormalMap('wood', 1024, 1024)
    woodNormal.repeat.set(2, 6)
    const woodRough = createProceduralRoughnessMap(0.38, 0.16)
    woodRough.repeat.set(2, 6)

    const mat = new THREE.MeshPhysicalMaterial({
      color: '#3e2415',
      roughness: 0.38,
      metalness: 0.04,
      normalMap: QUALITY.current.physicalMaterials ? woodNormal : null,
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughnessMap: QUALITY.current.physicalMaterials ? woodRough : null,
      clearcoat: QUALITY.current.clearcoat ? 0.6 : 0,
      clearcoatRoughness: 0.2,
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 3. Antique Museum Brass (Kuningan Bersepuh Emas & Bevel Trim)
   */
  antiqueBrass(isBright: boolean = false): THREE.MeshStandardMaterial {
    const key = `mat-antique-brass-${isBright}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial

    const metalNormal = createProceduralNormalMap('metal', 512, 512)
    const metalRough = createProceduralRoughnessMap(isBright ? 0.18 : 0.28, 0.08)

    const mat = new THREE.MeshStandardMaterial({
      color: isBright ? '#ffd700' : '#d4af37',
      metalness: 0.92,
      roughness: isBright ? 0.18 : 0.28,
      normalMap: QUALITY.current.physicalMaterials ? metalNormal : null,
      normalScale: new THREE.Vector2(0.2, 0.2),
      roughnessMap: QUALITY.current.physicalMaterials ? metalRough : null,
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 4. Volcanic Andesite Stone (Prasasti Candi & Monumen Batu Alam)
   */
  volcanicAndesite(): THREE.MeshStandardMaterial {
    const key = 'mat-volcanic-andesite'
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial

    const stoneNormal = createProceduralNormalMap('stone', 1024, 1024)
    stoneNormal.repeat.set(3, 3)
    const stoneRough = createProceduralRoughnessMap(0.82, 0.14)
    stoneRough.repeat.set(3, 3)

    const mat = new THREE.MeshStandardMaterial({
      color: '#2a2e33',
      metalness: 0.1,
      roughness: 0.82,
      normalMap: QUALITY.current.physicalMaterials ? stoneNormal : null,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: QUALITY.current.physicalMaterials ? stoneRough : null,
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 5. Antique Cast Bronze with Subtle Patina (Patung & Lambang Undip)
   */
  antiqueBronze(): THREE.MeshStandardMaterial {
    const key = 'mat-antique-bronze'
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial

    const metalNormal = createProceduralNormalMap('metal', 512, 512)
    const mat = new THREE.MeshStandardMaterial({
      color: '#4a3824',
      metalness: 0.82,
      roughness: 0.42,
      normalMap: QUALITY.current.physicalMaterials ? metalNormal : null,
      normalScale: new THREE.Vector2(0.4, 0.4),
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 6. Ultra-Clear Museum Glass Vitrine (Kaca Display Etalase & Miniatur)
   */
  museumVitrineGlass(): THREE.MeshPhysicalMaterial {
    const key = 'mat-museum-vitrine-glass'
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshPhysicalMaterial

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.24,
      transmission: 0.0,
      ior: 1.5,
      thickness: 0.0,
      roughness: 0.06,
      metalness: 0.08,
      depthWrite: false,
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 7. Royal Velvet Aisle Runner (Sheen Microfiber Fabric)
   */
  royalVelvet(color: string = '#112d56'): THREE.MeshPhysicalMaterial {
    const key = `mat-royal-velvet-${color}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshPhysicalMaterial

    const fabricNormal = createProceduralNormalMap('fabric', 512, 512)
    fabricNormal.repeat.set(12, 24)

    const mat = new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.86,
      metalness: 0.05,
      normalMap: QUALITY.current.physicalMaterials ? fabricNormal : null,
      normalScale: new THREE.Vector2(0.4, 0.4),
      sheen: QUALITY.current.sheen ? 0.92 : 0,
      sheenColor: color === '#112d56' ? '#3b6cb5' : '#e04555',
      sheenRoughness: 0.35,
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 8. Marine Research Water (Teluk Awur Jepara Diorama)
   */
  marineWater(): THREE.MeshPhysicalMaterial {
    const key = 'mat-marine-water'
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshPhysicalMaterial

    const waterNormal = createProceduralNormalMap('water', 512, 512)
    waterNormal.repeat.set(3, 3)

    const mat = new THREE.MeshPhysicalMaterial({
      color: '#155e75',
      transparent: true,
      opacity: 0.85,
      transmission: QUALITY.current.transmission ? 0.8 : 0,
      ior: 1.333,
      thickness: 0.4,
      roughness: 0.08,
      metalness: 0.05,
      normalMap: waterNormal,
      normalScale: new THREE.Vector2(0.3, 0.3),
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 9. Future Aerogel & Crystalline Resin (Zone 5 AI Neural Core)
   */
  futureCrystallineResin(): THREE.MeshPhysicalMaterial {
    const key = 'mat-future-crystalline'
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshPhysicalMaterial

    const mat = new THREE.MeshPhysicalMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.9,
      transmission: QUALITY.current.transmission ? 0.88 : 0,
      ior: 1.62,
      thickness: 0.6,
      roughness: 0.1,
      metalness: 0.1,
      iridescence: QUALITY.current.transmission ? 0.7 : 0,
      iridescenceIOR: 1.35,
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 10. Anodized Modern Champagne Aluminium (Zone 4 Fasad Arsitektur)
   */
  anodizedChampagne(): THREE.MeshStandardMaterial {
    const key = 'mat-anodized-champagne'
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial

    const metalNormal = createProceduralNormalMap('metal', 512, 512)
    const mat = new THREE.MeshStandardMaterial({
      color: '#c5b59e',
      metalness: 0.82,
      roughness: 0.28,
      normalMap: QUALITY.current.physicalMaterials ? metalNormal : null,
      normalScale: new THREE.Vector2(0.15, 0.15),
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 11. Sculpted Statuary Marble (Patung Marmer dengan roughness rendah & sheen halus)
   */
  statuaryMarble(color: string = '#f8fafc', roughness: number = 0.24): THREE.MeshPhysicalMaterial {
    const key = `mat-statuary-marble-${color}-${roughness.toFixed(2)}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshPhysicalMaterial

    const stoneNormal = createProceduralNormalMap('stone', 512, 512)
    stoneNormal.repeat.set(2, 2)

    const mat = new THREE.MeshPhysicalMaterial({
      color,
      roughness,
      metalness: 0.04,
      normalMap: QUALITY.current.physicalMaterials ? stoneNormal : null,
      normalScale: new THREE.Vector2(0.18, 0.18),
      sheen: QUALITY.current.sheen ? 0.35 : 0,
      sheenColor: '#ffffff',
      sheenRoughness: 0.45,
      clearcoat: QUALITY.current.clearcoat ? 0.25 : 0,
      clearcoatRoughness: 0.22,
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 12. Archival Parchment / Certificate Paper (Piagam dengan serat kertas)
   */
  parchmentPaper(color: string = '#f4ecd8'): THREE.MeshStandardMaterial {
    const key = `mat-parchment-paper-${color}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial

    const paperNormal = createProceduralNormalMap('paper', 512, 512)
    const paperRough = createProceduralRoughnessMap(0.78, 0.12)

    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.78,
      metalness: 0.02,
      normalMap: QUALITY.current.physicalMaterials ? paperNormal : null,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughnessMap: QUALITY.current.physicalMaterials ? paperRough : null,
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 13. Tree Bark (Batang Pohon Diorama)
   */
  treeBark(color: string = '#4a3728'): THREE.MeshStandardMaterial {
    const key = `mat-tree-bark-${color}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial

    const barkNormal = createProceduralNormalMap('bark', 512, 512)
    barkNormal.repeat.set(2, 3)

    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.88,
      metalness: 0.02,
      normalMap: QUALITY.current.physicalMaterials ? barkNormal : null,
      normalScale: new THREE.Vector2(0.9, 0.9),
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 14. Hologram ShaderMaterial (Fresnel + Scanline + Flicker + AdditiveBlending)
   */
  createHologramMaterial(color: THREE.ColorRepresentation = 0x00ffff): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        varying vec3 vView;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vView = -mv.xyz;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vPos;
        varying vec3 vView;
        void main() {
          float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.5);
          float scan = sin(vPos.y * 80.0 - uTime * 3.0) * 0.5 + 0.5;
          float flicker = 0.9 + 0.1 * sin(uTime * 40.0);
          float a = (fresnel * 1.2 + scan * 0.25) * flicker;
          gl_FragColor = vec4(uColor, a);
        }
      `,
    })
  },

  /**
   * 15. Procedural Alpha-Tested Leaf Texture & Material for InstancedMesh Foliage
   */
  leafFoliageMaterial(color: string = '#2d5a27'): THREE.MeshStandardMaterial {
    const key = `mat-leaf-foliage-${color}`
    if (materialCache.has(key)) return materialCache.get(key) as THREE.MeshStandardMaterial

    const colorKey = 'tex-leaf-alpha-color'
    let leafColor = textureCache.get(colorKey) as THREE.CanvasTexture | undefined
    if (!leafColor) {
      const size = 256
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.clearRect(0, 0, size, size)

      // Draw a cluster of 3 overlapping botanical leaves with alpha cutout
      const drawLeaf = (cx: number, cy: number, rx: number, ry: number, angle: number, fill: string) => {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(angle)
        ctx.fillStyle = fill
        ctx.beginPath()
        ctx.moveTo(0, -ry)
        ctx.quadraticCurveTo(rx, -ry * 0.2, 0, ry)
        ctx.quadraticCurveTo(-rx, -ry * 0.2, 0, -ry)
        ctx.closePath()
        ctx.fill()

        // Midrib vein
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, -ry * 0.8)
        ctx.lineTo(0, ry * 0.85)
        ctx.stroke()
        ctx.restore()
      }

      drawLeaf(128, 118, 52, 86, 0, '#ffffff')
      drawLeaf(82, 146, 38, 64, -0.55, '#e2e8f0')
      drawLeaf(174, 146, 38, 64, 0.55, '#e2e8f0')

      leafColor = new THREE.CanvasTexture(canvas)
      leafColor.colorSpace = THREE.SRGBColorSpace
      leafColor.anisotropy = 4
      textureCache.set(colorKey, leafColor)
    }

    const leafNormal = createProceduralNormalMap('paper', 256, 256)
    const mat = new THREE.MeshStandardMaterial({
      color,
      map: leafColor,
      normalMap: QUALITY.current.physicalMaterials ? leafNormal : null,
      normalScale: new THREE.Vector2(0.4, 0.4),
      alphaTest: 0.5,
      side: THREE.DoubleSide,
      roughness: 0.68,
      metalness: 0.02,
    })

    materialCache.set(key, mat)
    return mat
  },

  /**
   * 16. Carved Stone Relief Normal & Displacement Maps (Prasasti)
   * Generates subtle stone chisel relief from a stone heightfield.
   */
  carvedStoneMaps(): { normalMap: THREE.CanvasTexture; displacementMap: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } {
    const dispKey = 'tex-carved-stone-disp'
    let displacementMap = textureCache.get(dispKey) as THREE.CanvasTexture | undefined
    if (!displacementMap) {
      const size = 512
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const imgData = ctx.createImageData(size, size)
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const u = x / size
          const v = y / size
          const edge = Math.min(u, 1 - u, v, 1 - v)
          // Raised carved border frame + chiseled stone grain
          const border = edge > 0.03 && edge < 0.06 ? 0.85 : 0.45
          const h = Math.max(0, Math.min(1, border + (fbm(u * 14, v * 14, 4, 777) - 0.5) * 0.35))
          const val = Math.round(h * 255)
          const idx = (y * size + x) * 4
          imgData.data[idx] = val
          imgData.data[idx + 1] = val
          imgData.data[idx + 2] = val
          imgData.data[idx + 3] = 255
        }
      }
      ctx.putImageData(imgData, 0, 0)
      displacementMap = new THREE.CanvasTexture(canvas)
      displacementMap.colorSpace = THREE.NoColorSpace
      textureCache.set(dispKey, displacementMap)
    }

    return {
      normalMap: createProceduralNormalMap('stone', 1024, 1024),
      displacementMap,
      roughnessMap: createProceduralRoughnessMap(0.65, 0.16),
    }
  },

  /**
   * Clean up all cached textures and materials to prevent memory leak
   */
  disposeAll() {
    textureCache.forEach((t) => t.dispose())
    textureCache.clear()
    materialCache.forEach((m) => m.dispose())
    materialCache.clear()
  },
}
