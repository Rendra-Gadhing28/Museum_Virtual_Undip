import * as THREE from 'three'
import { assetCache } from '../Zone1/cache'
import { ZONE3_CONFIG } from './zone3Config'

function makeCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return [canvas, canvas.getContext('2d') as CanvasRenderingContext2D]
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

/**
 * 1. Tekstur Ukiran Prasasti Monumental 7.0m x 3.0m
 */
export function createSteleInscriptionTexture(inscription: any): THREE.CanvasTexture {
  const key = 'zone3-stele-inscription-monumental'
  return assetCache.getTexture(key, () => {
    const [canvas, ctx] = makeCanvas(1536, 3072)

    // Base Andesite Dark Warm Stone Texture (#2B2A28)
    ctx.fillStyle = '#262523'
    ctx.fillRect(0, 0, 1536, 3072)

    // Mineral stone grain simulation
    for (let i = 0; i < 15000; i++) {
      const rx = Math.random() * 1536
      const ry = Math.random() * 3072
      const gray = Math.floor(Math.random() * 50) + 30
      ctx.fillStyle = `rgba(${gray + 8}, ${gray + 6}, ${gray}, 0.2)`
      ctx.fillRect(rx, ry, Math.random() * 4 + 1, Math.random() * 4 + 1)
    }

    // Outer Beveled Stone Border
    ctx.strokeStyle = '#181715'
    ctx.lineWidth = 22
    ctx.strokeRect(36, 36, 1464, 3000)

    // Gold Filigree Inlay Border
    ctx.strokeStyle = ZONE3_CONFIG.palette.gold
    ctx.lineWidth = 10
    ctx.strokeRect(72, 72, 1392, 2928)

    ctx.strokeStyle = 'rgba(201, 162, 75, 0.4)'
    ctx.lineWidth = 3
    ctx.strokeRect(96, 96, 1344, 2880)

    // Top Emblem Circle
    ctx.fillStyle = 'rgba(201, 162, 75, 0.15)'
    ctx.beginPath()
    ctx.arc(768, 320, 150, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = ZONE3_CONFIG.palette.gold
    ctx.lineWidth = 6
    ctx.stroke()

    // Undip Diponegoro Emblem
    ctx.fillStyle = ZONE3_CONFIG.palette.goldBright
    ctx.font = 'bold 110px serif'
    ctx.textAlign = 'center'
    ctx.fillText('', 768, 360)

    ctx.font = 'bold 36px "Times New Roman", serif'
    ctx.fillStyle = '#d4af37'
    ctx.fillText('UNIVERSITAS DIPONEGORO', 768, 540)

    // Decorative Stepped Divider
    ctx.strokeStyle = ZONE3_CONFIG.palette.gold
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(250, 600)
    ctx.lineTo(1286, 600)
    ctx.stroke()

    // Stele Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 68px "Times New Roman", Georgia, serif'
    ctx.fillText('PRASASTI PERESMIAN', 768, 700)

    ctx.fillStyle = ZONE3_CONFIG.palette.gold
    ctx.font = 'bold 38px "Times New Roman", serif'
    ctx.fillText('UNIVERSITAS SEMARANG / DIPONEGORO', 768, 770)

    // Inscription Carved Text
    ctx.fillStyle = '#f5efe0'
    ctx.font = 'bold 38px "Times New Roman", serif'

    const fullText = inscription.text || ''
    const words = fullText.split(' ')
    let line = ''
    let y = 920
    const maxW = 1200

    for (const w of words) {
      const test = line + w + ' '
      if (ctx.measureText(test).width > maxW) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
        ctx.fillText(line, 770, y + 3)
        ctx.fillStyle = '#f5efe0'
        ctx.fillText(line, 768, y)
        line = w + ' '
        y += 72
      } else {
        line = test
      }
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
    ctx.fillText(line, 770, y + 3)
    ctx.fillStyle = '#f5efe0'
    ctx.fillText(line, 768, y)

    // Lower Inscription Divider
    y += 100
    ctx.strokeStyle = 'rgba(201, 162, 75, 0.8)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(300, y)
    ctx.lineTo(1236, y)
    ctx.stroke()

    // Date & Signing Official
    y += 90
    ctx.fillStyle = ZONE3_CONFIG.palette.gold
    ctx.font = 'italic 42px Georgia, serif'
    ctx.fillText('Diresmikan di Semarang, 9 Januari 1957', 768, y)

    y += 65
    ctx.fillText('& Dianugerahi Nama Resmi, 9 Januari 1960', 768, y)

    y += 110
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 44px "Times New Roman", serif'
    ctx.fillText('PRESIDEN REPUBLIK INDONESIA', 768, y)

    y += 130
    ctx.fillStyle = ZONE3_CONFIG.palette.goldBright
    ctx.font = 'italic bold 64px "Brush Script MT", cursive, serif'
    ctx.fillText('Ir. Soekarno', 768, y)

    y += 70
    ctx.font = 'bold 34px "Times New Roman", serif'
    ctx.fillStyle = '#cbd5e1'
    ctx.fillText('Disaksikan: Presidium Yayasan Universitas Semarang', 768, y)

    return toTexture(canvas)
  })
}

/**
 * 2. Tekstur Marmer Ivory Berpola dengan Inlay Emas untuk Platform 76 x 60 meter
 */
export function createIslandMarbleTexture(): THREE.CanvasTexture {
  const key = 'zone3-island-marble-tex-large'
  return assetCache.getTexture(key, () => {
    const [canvas, ctx] = makeCanvas(1024, 1024)

    // Ivory Crema Marfil Base
    ctx.fillStyle = '#f5efe0'
    ctx.fillRect(0, 0, 1024, 1024)

    // Subtle veins
    ctx.strokeStyle = 'rgba(180, 165, 145, 0.25)'
    ctx.lineWidth = 2
    for (let i = 0; i < 16; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * 1024, 0)
      ctx.bezierCurveTo(
        Math.random() * 1024, 300,
        Math.random() * 1024, 700,
        Math.random() * 1024, 1024
      )
      ctx.stroke()
    }

    // Outer Inlay Gold Grid
    ctx.strokeStyle = '#c9a24b'
    ctx.lineWidth = 6
    ctx.strokeRect(32, 32, 960, 960)

    ctx.strokeStyle = 'rgba(201, 162, 75, 0.4)'
    ctx.lineWidth = 2
    ctx.strokeRect(48, 48, 928, 928)

    return toTexture(canvas)
  })
}

/**
 * 3. Tekstur Kanvas Foto Bersejarah (Sepia / Salon Hang)
 */
export function createHistoricalPhotoTexture(photo: any): THREE.CanvasTexture {
  const key = `zone3-photo-${photo.id}`
  return assetCache.getTexture(key, () => {
    const [canvas, ctx] = makeCanvas(800, 560)

    // Sepia Tone Gradient
    const grad = ctx.createLinearGradient(0, 0, 800, 560)
    grad.addColorStop(0, '#2e261f')
    grad.addColorStop(0.5, '#1e1813')
    grad.addColorStop(1, '#14100c')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 800, 560)

    ctx.strokeStyle = '#d7c4a3'
    ctx.lineWidth = 4
    ctx.strokeRect(24, 24, 752, 512)

    // Header
    ctx.fillStyle = '#c9a24b'
    ctx.font = 'bold 18px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('ARSIP SEJARAH UNIVERSITAS DIPONEGORO', 400, 60)

    // Center Illustration Box
    ctx.fillStyle = '#3a3026'
    ctx.fillRect(50, 80, 700, 350)
    ctx.strokeStyle = '#504336'
    ctx.lineWidth = 2
    ctx.strokeRect(50, 80, 700, 350)

    ctx.fillStyle = '#e8dec8'
    ctx.font = 'bold 64px serif'
    ctx.fillText('', 400, 220)

    ctx.fillStyle = '#f5efe0'
    ctx.font = 'bold 26px "Times New Roman", serif'
    ctx.fillText(photo.title, 400, 290)

    ctx.fillStyle = '#c9a24b'
    ctx.font = 'italic 20px Georgia, serif'
    ctx.fillText(`Era: ${photo.year}`, 400, 330)

    ctx.fillStyle = '#b8a892'
    ctx.font = '15px system-ui, sans-serif'
    ctx.fillText(photo.source || 'Pusat Dokumentasi Sejarah Undip', 400, 480)

    return toTexture(canvas)
  })
}

/**
 * 4. Tekstur Dokumen Piagam Terbuka di Plinth Miring
 */
export function createDocumentTexture(doc: any): THREE.CanvasTexture {
  const key = `zone3-doc-${doc.id}`
  return assetCache.getTexture(key, () => {
    const [canvas, ctx] = makeCanvas(800, 1100)

    ctx.fillStyle = '#f4ecd8'
    ctx.fillRect(0, 0, 800, 1100)

    // Vignette
    const grad = ctx.createRadialGradient(400, 550, 250, 400, 550, 600)
    grad.addColorStop(0, 'rgba(0,0,0,0)')
    grad.addColorStop(1, 'rgba(120, 85, 45, 0.35)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 800, 1100)

    ctx.strokeStyle = '#8c6b38'
    ctx.lineWidth = 5
    ctx.strokeRect(30, 30, 740, 1040)
    ctx.strokeStyle = '#c9a24b'
    ctx.lineWidth = 1.5
    ctx.strokeRect(42, 42, 716, 1016)

    // Wax Seal
    ctx.fillStyle = '#991b1b'
    ctx.beginPath()
    ctx.arc(400, 160, 55, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ffd700'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#ffd700'
    ctx.font = 'bold 28px serif'
    ctx.textAlign = 'center'
    ctx.fillText('SEAL', 400, 170)

    ctx.fillStyle = '#1c150c'
    ctx.font = 'bold 28px "Times New Roman", Georgia, serif'
    ctx.fillText('REPUBLIK INDONESIA', 400, 260)

    ctx.font = 'bold 22px "Times New Roman", serif'
    ctx.fillStyle = '#6b4f24'
    ctx.fillText(doc.type || 'NASKAH RESMI KENEGARAAN', 400, 296)

    ctx.fillStyle = '#1c150c'
    ctx.font = 'bold 26px "Times New Roman", serif'
    ctx.fillText(doc.title, 400, 350)

    ctx.textAlign = 'left'
    ctx.fillStyle = '#2d2214'
    ctx.font = '19px "Times New Roman", serif'
    const paragraphs = [
      'Menimbang bahwa untuk memajukan ketjerdasan bangsa dan memupuk',
      'kader-kader sardjana jang berjiwa ksatria dan bertanggung djawab,',
      'maka dipandang perlu mendirikan dan meresmikan perguruan tinggi',
      'Universitas Diponegoro sebagai badan hukum pendidikan nasional.',
      '',
      'Memutuskan dan menetapkan status penegerian resmi dengan segala',
      'hak dan wewenang keilmuan berdasarkan peraturan perundangan',
      'jang berlaku di wilajah hukum Republik Indonesia.',
    ]

    let y = 430
    for (const p of paragraphs) {
      if (p) ctx.fillText(p, 90, y)
      y += 34
    }

    y += 120
    ctx.textAlign = 'center'
    ctx.fillStyle = '#1c150c'
    ctx.font = 'bold 20px "Times New Roman", serif'
    ctx.fillText('Ditetapkan di Djakarta / Semarang', 400, y)

    y += 60
    ctx.font = 'italic bold 34px cursive, serif'
    ctx.fillStyle = '#1e3a8a'
    ctx.fillText('Soekarno', 400, y)

    y += 35
    ctx.font = '16px "Times New Roman", serif'
    ctx.fillStyle = '#555'
    ctx.fillText('Presiden Republik Indonesia', 400, y)

    return toTexture(canvas)
  })
}

/**
 * 5. Dynamic 16mm Retro Film Texture
 */
export function createRetroFilmTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 384)

  const drawFrame = (time: number) => {
    const flicker = 0.88 + Math.sin(time * 0.02) * 0.12
    ctx.fillStyle = `rgb(${Math.floor(25 * flicker)}, ${Math.floor(35 * flicker)}, ${Math.floor(45 * flicker)})`
    ctx.fillRect(0, 0, 512, 384)

    ctx.fillStyle = '#080808'
    for (let x = 12; x < 512; x += 40) {
      ctx.fillRect(x, 6, 20, 16)
      ctx.fillRect(x, 362, 20, 16)
    }

    ctx.fillStyle = `rgb(${Math.floor(220 * flicker)}, ${Math.floor(200 * flicker)}, ${Math.floor(160 * flicker)})`
    ctx.fillRect(40, 32, 432, 320)

    ctx.strokeStyle = 'rgba(70, 50, 20, 0.4)'
    ctx.lineWidth = 1
    const scratchX = (time * 0.15) % 432 + 40
    ctx.beginPath()
    ctx.moveTo(scratchX, 32)
    ctx.lineTo(scratchX + Math.sin(time) * 4, 352)
    ctx.stroke()

    ctx.fillStyle = '#1a140a'
    ctx.font = 'bold 22px "Times New Roman", serif'
    ctx.textAlign = 'center'
    ctx.fillText('DOKUMENTASI DIES NATALIS 1960', 256, 170)

    ctx.font = 'bold 48px serif'
    ctx.fillText('', 256, 230)

    ctx.font = 'italic 16px Georgia, serif'
    ctx.fillText('"Undip Harus Menjadi Benteng Kebenaran Ilmiah"', 256, 280)
  }

  drawFrame(Date.now())
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
