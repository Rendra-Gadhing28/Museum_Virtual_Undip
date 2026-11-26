import * as THREE from 'three'
import type { MuladiDomeConfig } from './config'

export interface RoofTextureBundle {
  albedoMap: THREE.CanvasTexture
  normalMap: THREE.CanvasTexture
  roughnessMap: THREE.CanvasTexture
  aoMap: THREE.CanvasTexture
}

export interface LatticeTextureBundle {
  albedoMap: THREE.CanvasTexture
  alphaMap: THREE.CanvasTexture
  normalMap: THREE.CanvasTexture
  roughnessMap: THREE.CanvasTexture
}

export interface LandscapeTextureBundle {
  plazaMap: THREE.CanvasTexture
  plazaNormal: THREE.CanvasTexture
  grassMap: THREE.CanvasTexture
  grassNormal: THREE.CanvasTexture
  woodVeneerMap: THREE.CanvasTexture
  asphaltRoadMap: THREE.CanvasTexture
}

/**
 * Konversi ImageData height-map grayscale menjadi Tangent Space Normal Map
 * menggunakan filter gradien Sobel 3x3.
 */
function generateNormalMapFromHeight(
  heightData: Uint8ClampedArray,
  width: number,
  height: number,
  strength: number = 3.5
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const imgData = ctx.createImageData(width, height)
  const out = imgData.data

  const getH = (x: number, y: number) => {
    const cx = Math.max(0, Math.min(width - 1, x))
    const cy = Math.max(0, Math.min(height - 1, y))
    return heightData[(cy * width + cx) * 4] / 255.0
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Sobel kernel for dX and dY
      const tl = getH(x - 1, y - 1)
      const t  = getH(x,     y - 1)
      const tr = getH(x + 1, y - 1)
      const l  = getH(x - 1, y)
      const r  = getH(x + 1, y)
      const bl = getH(x - 1, y + 1)
      const b  = getH(x,     y + 1)
      const br = getH(x + 1, y + 1)

      const dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl)
      const dY = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr)

      let nx = -dX * strength
      let ny = -dY * strength
      let nz = 1.0

      const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
      nx /= len
      ny /= len
      nz /= len

      const idx = (y * width + x) * 4
      out[idx]     = Math.round((nx * 0.5 + 0.5) * 255)
      out[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255)
      out[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255)
      out[idx + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return canvas
}

/**
 * Parse hex string ke RGB array
 */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}

/**
 * Interpolasi linier RGB
 */
function lerpRgb(
  c1: [number, number, number],
  c2: [number, number, number],
  t: number
): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t))
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * clamped),
    Math.round(c1[1] + (c2[1] - c1[1]) * clamped),
    Math.round(c1[2] + (c2[2] - c1[2]) * clamped),
  ]
}

/**
 * Generator Tekstur Prosedural Atap Bantal (4096px PBR Bundle)
 * Mencakup albedo map, height-derived normal map, roughness map, dan AO map.
 */
export function createRoofTextureBundle(cfg: MuladiDomeConfig): RoofTextureBundle {
  const size = cfg.roof.textureResolution
  const tileCols = cfg.roof.tileCountX
  const tileRows = cfg.roof.tileCountY
  const tileW = size / tileCols
  const tileH = size / tileRows

  // 1. Kanvas Albedo
  const albedoCanvas = document.createElement('canvas')
  albedoCanvas.width = size
  albedoCanvas.height = size
  const actx = albedoCanvas.getContext('2d')!

  // 2. Kanvas Height (untuk derivasi Normal & Displacement)
  const heightCanvas = document.createElement('canvas')
  heightCanvas.width = size
  heightCanvas.height = size
  const hctx = heightCanvas.getContext('2d')!

  // 3. Kanvas Roughness
  const roughCanvas = document.createElement('canvas')
  roughCanvas.width = size
  roughCanvas.height = size
  const rctx = roughCanvas.getContext('2d')!

  // 4. Kanvas Ambient Occlusion
  const aoCanvas = document.createElement('canvas')
  aoCanvas.width = size
  aoCanvas.height = size
  const aoctx = aoCanvas.getContext('2d')!

  // Setup warna dasar
  const cWhite = hexToRgb(cfg.colors.whiteModelPaint)
  const cWhitePure = hexToRgb(cfg.colors.whitePure)
  const cGreyLight = hexToRgb(cfg.colors.greyLight)
  const cGreyMed = hexToRgb(cfg.colors.greyMedium)
  const cGreyDark = hexToRgb(cfg.colors.greyDark)
  const cGrout = hexToRgb(cfg.colors.groutLight)
  const cSkylightGlass = hexToRgb(cfg.colors.skylightGlass)

  // Inisialisasi latar belakang putih maket
  actx.fillStyle = cfg.colors.whiteModelPaint
  actx.fillRect(0, 0, size, size)

  hctx.fillStyle = '#E5E5E5'
  hctx.fillRect(0, 0, size, size)

  rctx.fillStyle = '#7C7C7C' // Roughness ~0.48
  rctx.fillRect(0, 0, size, size)

  aoctx.fillStyle = '#FFFFFF'
  aoctx.fillRect(0, 0, size, size)

  const cx = tileCols / 2
  const cy = tileRows / 2

  // Render Grid Ubin & Pola Chevron Prosedural (Tile by Tile)
  for (let j = 0; j < tileRows; j++) {
    for (let i = 0; i < tileCols; i++) {
      const px = i * tileW
      const py = j * tileH

      // Tentukan kuadran berdasarkan diagonal X-seam
      // Normalisasi koordinat ke -1..1
      const nx = (i - cx) / cx // -1 (kiri) s.d 1 (kanan)
      const ny = (j - cy) / cy // -1 (atas) s.d 1 (bawah)

      const absX = Math.abs(nx)
      const absY = Math.abs(ny)

      // Jarak sel dari tepi terluar (0 di tepi, 1 di pusat)
      const distFromEdge = 1.0 - Math.max(absX, absY)

      // Identifikasi kuadran:
      // Apakah berada di Kuadran Horizontal (Atas/Bawah) atau Vertikal (Kiri/Kanan)
      const isTopBottomQuadrant = absY >= absX

      let xTile = 0
      let yTile = 0

      if (isTopBottomQuadrant) {
        // Kuadran Depan (Bawah) atau Belakang (Atas)
        xTile = Math.abs(i - cx) // Jarak dari sumbu tengah horizontal
        yTile = ny > 0 ? tileRows - 1 - j : j // Jarak dari tepi terluar
      } else {
        // Kuadran Kiri atau Kanan
        xTile = Math.abs(j - cy) // Jarak dari sumbu tengah vertikal
        yTile = nx > 0 ? tileCols - 1 - i : i // Jarak dari tepi terluar
      }

      // Chevron coordinate: c = x + y (garis 45 derajat, apex di x = 0 mengarah ke dalam)
      const c = Math.floor(xTile + yTile)
      const patternCoord = c % cfg.roof.periodP

      // Hitung faktor kekuatan pola chevron (memudar dari tepi ke pusat)
      const fade = 1.0 - Math.min(
        1.0,
        Math.max(0.0, (distFromEdge - cfg.roof.fadeStart) / (cfg.roof.fadeEnd - cfg.roof.fadeStart))
      )

      let tileColor: [number, number, number] = cWhite
      let heightVal = 220
      let roughVal = 122 // ~0.48
      let aoVal = 255

      if (fade > 0.01) {
        if (patternCoord < cfg.roof.ribW) {
          // Rusuk putih menonjol (White diagonal rib)
          tileColor = lerpRgb(cWhite, cWhitePure, fade)
          heightVal = 245
          roughVal = 115
        } else {
          // Lajur abu-abu (Grey chevron lane)
          // Cek apakah ada aksen titik putih kecil berulang
          const isWhiteAccentDot = (c + Math.floor(xTile)) % cfg.roof.dotInterval === 0
          
          if (isWhiteAccentDot) {
            tileColor = lerpRgb(cWhite, cWhitePure, fade * 0.9)
            heightVal = 238
            roughVal = 118
          } else {
            // Undak abu-abu terang dan sedang
            const stepMod = (Math.floor(xTile) + Math.floor(yTile)) % 2
            const baseGrey = stepMod === 0 ? cGreyLight : cGreyMed
            // Berikan sedikit nada abu gelap resesif di dasar lembah rusuk
            const finalGrey = patternCoord === cfg.roof.periodP - 1 ? cGreyDark : baseGrey
            tileColor = lerpRgb(cWhite, finalGrey, fade)
            heightVal = 175
            roughVal = 135
            aoVal = Math.round(255 - 35 * fade)
          }
        }
      }

      // Render Ubin ke Kanvas Albedo
      actx.fillStyle = `rgb(${tileColor[0]},${tileColor[1]},${tileColor[2]})`
      actx.fillRect(px, py, tileW, tileH)

      // Garis Nat Ubin (Grout Line)
      actx.strokeStyle = `rgba(${cGrout[0]},${cGrout[1]},${cGrout[2]}, 0.85)`
      actx.lineWidth = cfg.roof.groutWidthPx
      actx.strokeRect(px + 0.5, py + 0.5, tileW - 1, tileH - 1)

      // Render ke Height
      hctx.fillStyle = `rgb(${heightVal},${heightVal},${heightVal})`
      hctx.fillRect(px, py, tileW, tileH)
      // Nat lebih rendah di height map
      hctx.strokeStyle = '#6E6E6E'
      hctx.lineWidth = cfg.roof.groutWidthPx
      hctx.strokeRect(px + 0.5, py + 0.5, tileW - 1, tileH - 1)

      // Render ke Roughness & AO
      rctx.fillStyle = `rgb(${roughVal},${roughVal},${roughVal})`
      rctx.fillRect(px, py, tileW, tileH)

      aoctx.fillStyle = `rgb(${aoVal},${aoVal},${aoVal})`
      aoctx.fillRect(px, py, tileW, tileH)
      // Oklusi nat
      aoctx.strokeStyle = '#B4B4B4'
      aoctx.lineWidth = cfg.roof.groutWidthPx
      aoctx.strokeRect(px + 0.5, py + 0.5, tileW - 1, tileH - 1)
    }
  }

  // Seam Diagonal X-Seam (Rusuk pertemuan 4 bidang atap dari sudut ke pusat)
  const drawXSeam = (ctx: CanvasRenderingContext2D, color: string, width: number) => {
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(size * 0.5, size * 0.5)
    ctx.moveTo(size, 0)
    ctx.lineTo(size * 0.5, size * 0.5)
    ctx.moveTo(0, size)
    ctx.lineTo(size * 0.5, size * 0.5)
    ctx.moveTo(size, size)
    ctx.lineTo(size * 0.5, size * 0.5)
    ctx.stroke()
    ctx.restore()
  }

  drawXSeam(actx, cfg.colors.groutLight, 3)
  drawXSeam(hctx, '#7A7A7A', 3)
  drawXSeam(aoctx, '#9E9E9E', 4)

  // 5. Render 12 BUKAAN ATAP (Skylights - Grid 4 Kolom x 3 Baris)
  const cols = cfg.roof.skylightGridCols // 4
  const rows = cfg.roof.skylightGridRows // 3

  // Luas area tengah tempat bukaan berada
  const skylightCenterW = size * 0.44
  const skylightCenterH = size * 0.52
  const startX = (size - skylightCenterW) / 2
  const startY = (size - skylightCenterH) / 2

  const stepX = skylightCenterW / (cols - 1)
  const stepY = skylightCenterH / (rows - 1)

  const sw = tileW * cfg.roof.skylightWidthRatio
  const sh = tileH * cfg.roof.skylightLengthRatio

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const bx = startX + c * stepX - sw / 2
      const by = startY + r * stepY - sh / 2

      // Lis Bingkai Putih Menonjol
      actx.fillStyle = cfg.colors.whitePure
      actx.fillRect(
        bx - cfg.roof.skylightFrameWidthPx,
        by - cfg.roof.skylightFrameWidthPx,
        sw + cfg.roof.skylightFrameWidthPx * 2,
        sh + cfg.roof.skylightFrameWidthPx * 2
      )

      // Kaca Asap Inset Gelap
      actx.fillStyle = `rgb(${cSkylightGlass[0]},${cSkylightGlass[1]},${cSkylightGlass[2]})`
      actx.fillRect(bx, by, sw, sh)

      // Gradasi pantulan lembut satin di permukaan kaca
      const grad = actx.createLinearGradient(bx, by, bx + sw, by + sh)
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.0)')
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.25)')
      actx.fillStyle = grad
      actx.fillRect(bx, by, sw, sh)

      // Height Map: Frame bukaan menonjol (255), kaca masuk ke dalam / inset (60)
      hctx.fillStyle = '#FFFFFF'
      hctx.fillRect(
        bx - cfg.roof.skylightFrameWidthPx,
        by - cfg.roof.skylightFrameWidthPx,
        sw + cfg.roof.skylightFrameWidthPx * 2,
        sh + cfg.roof.skylightFrameWidthPx * 2
      )
      hctx.fillStyle = '#3C3C3C'
      hctx.fillRect(bx, by, sw, sh)

      // Roughness Map: Frame satin (115), kaca sangat halus/glossy (35)
      rctx.fillStyle = '#737373'
      rctx.fillRect(
        bx - cfg.roof.skylightFrameWidthPx,
        by - cfg.roof.skylightFrameWidthPx,
        sw + cfg.roof.skylightFrameWidthPx * 2,
        sh + cfg.roof.skylightFrameWidthPx * 2
      )
      rctx.fillStyle = '#232323'
      rctx.fillRect(bx, by, sw, sh)

      // AO Map: Bayangan oklusi di tepi bingkai dalam bukaan
      aoctx.fillStyle = '#4A4A4A'
      aoctx.fillRect(bx, by, sw, sh)
      aoctx.fillStyle = '#888888'
      aoctx.fillRect(bx + 3, by + 3, sw - 6, sh - 6)
    }
  }

  // 6. Turunkan Normal Map dari Height Canvas
  const heightImageData = hctx.getImageData(0, 0, size, size)
  const normalCanvas = generateNormalMapFromHeight(
    heightImageData.data,
    size,
    size,
    4.0
  )

  // Buat Three.js Textures dengan konfigurasi PBR optimal
  const createTexture = (cv: HTMLCanvasElement, isLinear: boolean = false): THREE.CanvasTexture => {
    const tex = new THREE.CanvasTexture(cv)
    tex.colorSpace = isLinear ? THREE.NoColorSpace : THREE.SRGBColorSpace
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.anisotropy = 16
    tex.generateMipmaps = true
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.needsUpdate = true
    return tex
  }

  return {
    albedoMap: createTexture(albedoCanvas, false),
    normalMap: createTexture(normalCanvas, true),
    roughnessMap: createTexture(roughCanvas, true),
    aoMap: createTexture(aoCanvas, true),
  }
}

/**
 * Generator Tekstur Kisi Anyaman Gelombang Fasad (Woven Lattice Screen)
 * Menghasilkan Albedo, Alpha (lubang lensa/almond), Normal, dan Roughness.
 */
export function createLatticeTextureBundle(cfg: MuladiDomeConfig): LatticeTextureBundle {
  const w = cfg.facade.latticeTextureWidth
  const h = cfg.facade.latticeTextureHeight

  const albedoCanvas = document.createElement('canvas')
  albedoCanvas.width = w
  albedoCanvas.height = h
  const actx = albedoCanvas.getContext('2d')!

  const alphaCanvas = document.createElement('canvas')
  alphaCanvas.width = w
  alphaCanvas.height = h
  const apctx = alphaCanvas.getContext('2d')!

  const heightCanvas = document.createElement('canvas')
  heightCanvas.width = w
  heightCanvas.height = h
  const hctx = heightCanvas.getContext('2d')!

  const roughCanvas = document.createElement('canvas')
  roughCanvas.width = w
  roughCanvas.height = h
  const rctx = roughCanvas.getContext('2d')!

  // Latar belakang transparan pada alpha, gelap pada albedo
  actx.fillStyle = cfg.colors.steelBlueLattice
  actx.fillRect(0, 0, w, h)

  apctx.fillStyle = '#000000'
  apctx.fillRect(0, 0, w, h)

  hctx.fillStyle = '#000000'
  hctx.fillRect(0, 0, w, h)

  rctx.fillStyle = '#666666'
  rctx.fillRect(0, 0, w, h)

  // Gambar pita anyaman gelombang diagonal berlawanan arah
  const freq = cfg.facade.latticeWaveFreq
  const amp = h * cfg.facade.latticeWaveAmp * 0.22
  const strutW = w * 0.016

  const rows = 12
  const rowStep = h / rows

  for (let r = -2; r <= rows + 2; r++) {
    const baseY = r * rowStep

    // Pita gelombang kanan (+)
    actx.beginPath()
    apctx.beginPath()
    hctx.beginPath()

    for (let x = 0; x <= w; x += 4) {
      const y = baseY + Math.sin((x / w) * Math.PI * 2 * freq) * amp
      if (x === 0) {
        actx.moveTo(x, y)
        apctx.moveTo(x, y)
        hctx.moveTo(x, y)
      } else {
        actx.lineTo(x, y)
        apctx.lineTo(x, y)
        hctx.lineTo(x, y)
      }
    }

    actx.strokeStyle = cfg.colors.steelBlueLight
    actx.lineWidth = strutW * 1.2
    actx.stroke()

    actx.strokeStyle = cfg.colors.steelBlueLattice
    actx.lineWidth = strutW
    actx.stroke()

    apctx.strokeStyle = '#FFFFFF'
    apctx.lineWidth = strutW
    apctx.stroke()

    hctx.strokeStyle = '#DCDCDC'
    hctx.lineWidth = strutW
    hctx.stroke()

    // Pita gelombang kiri (-) fase terbalik untuk membentuk lubang lensa
    actx.beginPath()
    apctx.beginPath()
    hctx.beginPath()

    for (let x = 0; x <= w; x += 4) {
      const y = baseY - Math.sin((x / w) * Math.PI * 2 * freq) * amp
      if (x === 0) {
        actx.moveTo(x, y)
        apctx.moveTo(x, y)
        hctx.moveTo(x, y)
      } else {
        actx.lineTo(x, y)
        apctx.lineTo(x, y)
        hctx.lineTo(x, y)
      }
    }

    actx.strokeStyle = cfg.colors.steelBlueLight
    actx.lineWidth = strutW * 1.2
    actx.stroke()

    actx.strokeStyle = cfg.colors.steelBlueLattice
    actx.lineWidth = strutW
    actx.stroke()

    apctx.strokeStyle = '#FFFFFF'
    apctx.lineWidth = strutW
    apctx.stroke()

    hctx.strokeStyle = '#DCDCDC'
    hctx.lineWidth = strutW
    hctx.stroke()
  }

  const heightImg = hctx.getImageData(0, 0, w, h)
  const normalCanvas = generateNormalMapFromHeight(heightImg.data, w, h, 3.0)

  const toTex = (cv: HTMLCanvasElement, isLinear: boolean = false) => {
    const t = new THREE.CanvasTexture(cv)
    t.colorSpace = isLinear ? THREE.NoColorSpace : THREE.SRGBColorSpace
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.ClampToEdgeWrapping
    t.anisotropy = 8
    t.generateMipmaps = true
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.magFilter = THREE.LinearFilter
    t.needsUpdate = true
    return t
  }

  return {
    albedoMap: toTex(albedoCanvas, false),
    alphaMap: toTex(alphaCanvas, true),
    normalMap: toTex(normalCanvas, true),
    roughnessMap: toTex(roughCanvas, true),
  }
}

/**
 * Generator Tekstur Lingkungan Diorama (Plaza Paving, Flock Grass, Kayu Veneer, Aspal)
 */
export function createLandscapeTextureBundle(cfg: MuladiDomeConfig): LandscapeTextureBundle {
  // 1. Paving Plaza
  const pw = 1024
  const ph = 1024
  const pcanvas = document.createElement('canvas')
  pcanvas.width = pw
  pcanvas.height = ph
  const pctx = pcanvas.getContext('2d')!
  pctx.fillStyle = cfg.colors.plazaPavers
  pctx.fillRect(0, 0, pw, ph)

  const pgrid = 32
  pctx.strokeStyle = cfg.colors.plazaGrout
  pctx.lineWidth = 2
  for (let x = 0; x <= pw; x += pgrid) {
    pctx.beginPath()
    pctx.moveTo(x, 0)
    pctx.lineTo(x, ph)
    pctx.stroke()
  }
  for (let y = 0; y <= ph; y += pgrid) {
    pctx.beginPath()
    pctx.moveTo(0, y)
    pctx.lineTo(pw, y)
    pctx.stroke()
  }

  // Normal Paving
  const phImg = pctx.getImageData(0, 0, pw, ph)
  const pNormalCanvas = generateNormalMapFromHeight(phImg.data, pw, ph, 2.0)

  // 2. Rumput Maket (Flock Grass)
  const gw = 1024
  const gh = 1024
  const gcanvas = document.createElement('canvas')
  gcanvas.width = gw
  gcanvas.height = gh
  const gctx = gcanvas.getContext('2d')!
  gctx.fillStyle = cfg.colors.grassFlockBright
  gctx.fillRect(0, 0, gw, gh)

  // Noise serat spons flocking maket
  const gImg = gctx.getImageData(0, 0, gw, gh)
  const gdata = gImg.data
  const cDark = hexToRgb(cfg.colors.grassFlockDark)
  const cHi = hexToRgb(cfg.colors.grassFlockHighlight)

  for (let i = 0; i < gdata.length; i += 4) {
    const rnd = Math.random()
    if (rnd > 0.6) {
      gdata[i] = cHi[0]
      gdata[i + 1] = cHi[1]
      gdata[i + 2] = cHi[2]
    } else if (rnd < 0.25) {
      gdata[i] = cDark[0]
      gdata[i + 1] = cDark[1]
      gdata[i + 2] = cDark[2]
    }
  }
  gctx.putImageData(gImg, 0, 0)

  const gNormalCanvas = generateNormalMapFromHeight(gdata, gw, gh, 2.5)

  // 3. Meja Kayu Veneer
  const vw = 1024
  const vh = 1024
  const vcanvas = document.createElement('canvas')
  vcanvas.width = vw
  vcanvas.height = vh
  const vctx = vcanvas.getContext('2d')!
  vctx.fillStyle = cfg.colors.woodVeneer
  vctx.fillRect(0, 0, vw, vh)

  // Serat kayu lurus satin
  for (let y = 0; y < vh; y += 4) {
    const darkLine = Math.random() > 0.4
    vctx.fillStyle = darkLine ? 'rgba(70, 32, 16, 0.25)' : 'rgba(180, 110, 70, 0.18)'
    vctx.fillRect(0, y, vw, 2)
  }

  // 4. Jalan Aspal
  const aw = 1024
  const ah = 1024
  const acanvas = document.createElement('canvas')
  acanvas.width = aw
  acanvas.height = ah
  const actx = acanvas.getContext('2d')!
  actx.fillStyle = cfg.colors.roadAsphalt
  actx.fillRect(0, 0, aw, ah)

  // Marka jalan putih maket
  actx.fillStyle = cfg.colors.roadMarking
  for (let x = 40; x < aw; x += 120) {
    actx.fillRect(x, ah / 2 - 4, 70, 8)
  }

  const makeTex = (c: HTMLCanvasElement, repeat: number = 1) => {
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeat, repeat)
    t.anisotropy = 8
    t.needsUpdate = true
    return t
  }

  return {
    plazaMap: makeTex(pcanvas, 4),
    plazaNormal: makeTex(pNormalCanvas, 4),
    grassMap: makeTex(gcanvas, 6),
    grassNormal: makeTex(gNormalCanvas, 6),
    woodVeneerMap: makeTex(vcanvas, 2),
    asphaltRoadMap: makeTex(acanvas, 1),
  }
}
