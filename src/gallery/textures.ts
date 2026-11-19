import * as THREE from 'three'
import type { Founder, HistoryExhibit } from './data/exhibits'
import { assetCache } from './cache'

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

function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  weight: string,
  style: string,
  maxWidth: number,
  startSize: number,
  minSize: number,
): number {
  let size = startSize
  while (size > minSize) {
    ctx.font = `${style} ${weight} ${size}px ${family}`
    if (ctx.measureText(text).width <= maxWidth) break
    size -= 2
  }
  ctx.font = `${style} ${weight} ${size}px ${family}`
  return size
}

/** Polished museum floor: Warm Italian Crema Marfil / Ivory marble with subtle veins */
export function createFloorTexture(): THREE.CanvasTexture {
  return assetCache.getTexture('floor-texture', () => {
    const [canvas, ctx] = makeCanvas(1024, 1024)
    
    // Base warm marble tone
    ctx.fillStyle = '#f2ede4'
    ctx.fillRect(0, 0, 1024, 1024)

    // Large tiles 512x512
    const tileSize = 256
    for (let x = 0; x < 1024; x += tileSize) {
      for (let y = 0; y < 1024; y += tileSize) {
        const tileHue = ((x + y) % 512 === 0) ? '#ede6da' : '#f5f0e7'
        ctx.fillStyle = tileHue
        ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4)

        // Fine marble veins
        ctx.strokeStyle = 'rgba(168, 148, 126, 0.22)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(x + 10, y + 20)
        ctx.bezierCurveTo(x + 60, y + 80, x + 180, y + 140, x + tileSize - 20, y + tileSize - 10)
        ctx.stroke()

        // Subtle diagonal veins
        ctx.strokeStyle = 'rgba(195, 178, 158, 0.15)'
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(x + tileSize - 30, y + 10)
        ctx.bezierCurveTo(x + 180, y + 100, x + 90, y + 190, x + 15, y + tileSize - 30)
        ctx.stroke()

        // Tile joint line
        ctx.strokeStyle = 'rgba(120, 105, 90, 0.45)'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, tileSize, tileSize)
      }
    }

    // Specular sheen
    const sheen = ctx.createRadialGradient(512, 512, 100, 512, 512, 600)
    sheen.addColorStop(0, 'rgba(255, 255, 255, 0.12)')
    sheen.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = sheen
    ctx.fillRect(0, 0, 1024, 1024)

    return toTexture(canvas)
  })
}

/** Ceremonial Red Carpet Runner with Ornate Gold Geometric Border */
export function createRedCarpetTexture(): THREE.CanvasTexture {
  return assetCache.getTexture('carpet-texture', () => {
    const [canvas, ctx] = makeCanvas(512, 1024)

    // Velvet deep crimson red
    const redGrad = ctx.createLinearGradient(0, 0, 512, 0)
    redGrad.addColorStop(0, '#580c14')
    redGrad.addColorStop(0.12, '#821622')
    redGrad.addColorStop(0.5, '#9e1b28')
    redGrad.addColorStop(0.88, '#821622')
    redGrad.addColorStop(1, '#580c14')
    ctx.fillStyle = redGrad
    ctx.fillRect(0, 0, 512, 1024)

    // Subtle velvet noise / fabric grain
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
    for (let y = 0; y < 1024; y += 4) {
      ctx.fillRect(0, y, 512, 1.5)
    }

    // Gold outer piping
    ctx.fillStyle = '#d4af37'
    ctx.fillRect(12, 0, 8, 1024)
    ctx.fillRect(512 - 20, 0, 8, 1024)

    // Gold patterned inner borders
    ctx.fillStyle = '#f3cf65'
    ctx.fillRect(28, 0, 4, 1024)
    ctx.fillRect(512 - 32, 0, 4, 1024)

    // Repeating geometric gold diamond motifs along borders
    ctx.fillStyle = '#e6be44'
    for (let y = 16; y < 1024; y += 32) {
      // Left border motifs
      ctx.beginPath()
      ctx.moveTo(22, y)
      ctx.lineTo(26, y + 8)
      ctx.lineTo(22, y + 16)
      ctx.lineTo(18, y + 8)
      ctx.closePath()
      ctx.fill()

      // Right border motifs
      ctx.beginPath()
      ctx.moveTo(512 - 22, y)
      ctx.lineTo(512 - 18, y + 8)
      ctx.lineTo(512 - 22, y + 16)
      ctx.lineTo(512 - 26, y + 8)
      ctx.closePath()
      ctx.fill()
    }

    return toTexture(canvas)
  })
}

/** Portrait Canvas Texture for the 13 UNDIP Founders */
export function createFounderPortraitCanvas(founder: Founder, index: number): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(600, 750)

  // Rich studio backdrop with heritage deep navy & sepia vignette
  const bg = ctx.createRadialGradient(300, 260, 50, 300, 375, 450)
  bg.addColorStop(0, '#2d3b4e')
  bg.addColorStop(0.6, '#182435')
  bg.addColorStop(1, '#0e1724')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 600, 750)

  // Decorative inner gold filigree frame line
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)'
  ctx.lineWidth = 2
  ctx.strokeRect(20, 20, 560, 710)

  // Dignified Sepia Silhouette & Historic Attire
  // Coat / suit shoulders
  ctx.fillStyle = '#1c1b18'
  ctx.beginPath()
  ctx.ellipse(300, 680, 210, 180, 0, 0, Math.PI * 2)
  ctx.fill()

  // White collared shirt & tie
  ctx.fillStyle = '#ebe6dc'
  ctx.beginPath()
  ctx.moveTo(300, 390)
  ctx.lineTo(265, 480)
  ctx.lineTo(335, 480)
  ctx.closePath()
  ctx.fill()

  // Tie (Navy / Burgundy)
  ctx.fillStyle = index % 2 === 0 ? '#102238' : '#4a151b'
  ctx.beginPath()
  ctx.moveTo(295, 430)
  ctx.lineTo(305, 430)
  ctx.lineTo(312, 540)
  ctx.lineTo(300, 570)
  ctx.lineTo(288, 540)
  ctx.closePath()
  ctx.fill()

  // Head and face silhouette with warm lighting
  const faceGrad = ctx.createRadialGradient(285, 275, 20, 300, 290, 100)
  faceGrad.addColorStop(0, '#e8cbb0')
  faceGrad.addColorStop(0.7, '#c99f7a')
  faceGrad.addColorStop(1, '#8b6443')
  ctx.fillStyle = faceGrad
  ctx.beginPath()
  ctx.ellipse(300, 290, 85, 110, 0, 0, Math.PI * 2)
  ctx.fill()

  // Hair style variation
  ctx.fillStyle = '#261b12'
  ctx.beginPath()
  ctx.arc(300, 240, 90, Math.PI * 0.9, Math.PI * 2.1)
  ctx.fill()

  // Intellectual spectacles or distinctive feature
  if (index % 3 === 0 || founder.id.includes('soedarto') || founder.id.includes('sunario')) {
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(265, 285, 22, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(335, 285, 22, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(287, 285)
    ctx.lineTo(313, 285)
    ctx.stroke()
  }

  // Historic Seal Stamp of Yayasan Universitas Semarang 1956
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(490, 100, 48, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(490, 100, 42, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = 'rgba(212, 175, 55, 0.65)'
  ctx.font = 'bold 9px serif'
  ctx.textAlign = 'center'
  ctx.fillText('YAYASAN UNDIP', 490, 95)
  ctx.fillText('EST. 1956', 490, 110)

  // Vignette overlay
  const vig = ctx.createRadialGradient(300, 375, 200, 300, 375, 480)
  vig.addColorStop(0, 'rgba(0,0,0,0)')
  vig.addColorStop(1, 'rgba(0,0,0,0.65)')
  ctx.fillStyle = vig
  ctx.fillRect(0, 0, 600, 750)

  // Bottom Nameplate integrated on the canvas
  ctx.fillStyle = 'rgba(11, 29, 58, 0.92)'
  ctx.fillRect(30, 610, 540, 105)
  ctx.strokeStyle = '#d4af37'
  ctx.lineWidth = 2
  ctx.strokeRect(34, 614, 532, 97)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#f8f4eb'
  fitFont(ctx, founder.name, 'Georgia, serif', 'bold', 'normal', 500, 28, 18)
  ctx.fillText(founder.name, 300, 650)

  ctx.fillStyle = '#d4af37'
  fitFont(ctx, founder.title, 'Georgia, serif', 'normal', 'italic', 500, 17, 12)
  ctx.fillText(founder.title, 300, 678)

  ctx.fillStyle = '#baa788'
  ctx.font = '13px sans-serif'
  ctx.fillText(founder.years, 300, 700)

  return canvas
}

export function createFounderPortraitTexture(founder: Founder, index: number): THREE.CanvasTexture {
  return assetCache.getTexture(`founder-portrait-${founder.id}`, () => {
    return toTexture(createFounderPortraitCanvas(founder, index))
  })
}

export function createFounderDataURL(founder: Founder, index: number): string {
  return createFounderPortraitCanvas(founder, index).toDataURL('image/jpeg', 0.88)
}

/** History & Archives Museum Exhibition Panel Texture */
export function createHistoryPanelCanvas(exhibit: HistoryExhibit): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(800, 1000)

  // Elegant archival background: aged warm parchment with deep navy header
  ctx.fillStyle = '#fcf8ee'
  ctx.fillRect(0, 0, 800, 1000)

  // Subtle paper grain & vintage aging
  ctx.fillStyle = 'rgba(180, 150, 110, 0.1)'
  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * 800
    const ry = Math.random() * 1000
    const rw = 40 + Math.random() * 120
    ctx.fillRect(rx, ry, rw, 2)
  }

  // Top Grand Header: Deep Navy Blue
  const headGrad = ctx.createLinearGradient(0, 0, 800, 0)
  headGrad.addColorStop(0, '#0a1a33')
  headGrad.addColorStop(0.5, '#122b52')
  headGrad.addColorStop(1, '#0a1a33')
  ctx.fillStyle = headGrad
  ctx.fillRect(0, 0, 800, 160)

  // Gold separator line
  ctx.fillStyle = '#d4af37'
  ctx.fillRect(0, 156, 800, 4)

  // Header Text
  ctx.textAlign = 'center'
  ctx.fillStyle = '#d4af37'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText(`ARSIP SEJARAH UNIVERSITAS DIPONEGORO • ${exhibit.period.toUpperCase()}`, 400, 52)

  ctx.fillStyle = '#ffffff'
  fitFont(ctx, exhibit.title, 'Georgia, serif', 'bold', 'normal', 740, 32, 20)
  ctx.fillText(exhibit.title, 400, 104)

  ctx.fillStyle = '#dcd6c8'
  ctx.font = 'italic 16px Georgia, serif'
  ctx.fillText(exhibit.shortLabel, 400, 138)

  // Central Visual Document Box (Represents historic document/decree/photo)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(60, 190, 680, 420)
  ctx.strokeStyle = '#c5a059'
  ctx.lineWidth = 3
  ctx.strokeRect(60, 190, 680, 420)

  // Visual content inside document box based on category
  if (exhibit.category === 'decree' || exhibit.category === 'archive') {
    // Official Government / Notary Document Layout
    ctx.fillStyle = '#222'
    ctx.font = 'bold 22px "Times New Roman", serif'
    ctx.fillText('LEMBARAN NEGARA REPUBLIK INDONESIA', 400, 240)
    ctx.font = '16px "Times New Roman", serif'
    ctx.fillText('SALINAN RESMI ARSIP NEGARA & STATUTA YAYASAN', 400, 268)

    ctx.strokeStyle = '#888'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(100, 285)
    ctx.lineTo(700, 285)
    ctx.stroke()

    // Document lines simulation
    ctx.textAlign = 'left'
    ctx.fillStyle = '#444'
    ctx.font = '15px "Courier New", monospace'
    const docLines = [
      'Menimbang  : Bahwa perlu didirikan perguruan tinggi di Semarang',
      'Mengingat  : Aspirasi masjarakat Djawa Tengah dan para tjendekiawan',
      'MEMUTUSKAN : Mengesahkan berdirinja Universitas Diponegoro',
      'Pasal 1    : Terhitung sedjak 15 Oktober 1957 diresmikan sebagai PTN',
      'Pasal 2    : Membina insan akademis berkarakter patriotik & mandiri',
      'Ditetapkan : Djakarta, ditandatangani oleh Presiden Republik Indonesia',
    ]
    docLines.forEach((line, idx) => {
      ctx.fillText(line, 90, 330 + idx * 34)
    })

    // Red Official Wax Seal
    ctx.fillStyle = '#a61c1c'
    ctx.beginPath()
    ctx.arc(630, 510, 48, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ffd700'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = '#ffd700'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('SEGEL RESMI', 630, 506)
    ctx.fillText('REPUBLIK INDONESIA', 630, 520)

  } else {
    // Vintage Campus Photo Layout
    const photoGrad = ctx.createLinearGradient(60, 190, 740, 610)
    photoGrad.addColorStop(0, '#534538')
    photoGrad.addColorStop(0.5, '#7d6954')
    photoGrad.addColorStop(1, '#44372c')
    ctx.fillStyle = photoGrad
    ctx.fillRect(65, 195, 670, 410)

    // Sepia architectural silhouette of early campus buildings (Pleburan / Panti Budaya)
    ctx.fillStyle = '#2d241c'
    // Building columns and roof
    ctx.fillRect(100, 360, 590, 200)
    for (let c = 120; c < 680; c += 55) {
      ctx.fillStyle = '#c5b49d'
      ctx.fillRect(c, 380, 24, 180)
    }
    // Classical pediment triangle roof
    ctx.fillStyle = '#3a2e24'
    ctx.beginPath()
    ctx.moveTo(80, 360)
    ctx.lineTo(395, 250)
    ctx.lineTo(710, 360)
    ctx.closePath()
    ctx.fill()

    // Photo caption
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(65, 565, 670, 40)
    ctx.fillStyle = '#f5eedb'
    ctx.font = 'italic 16px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('Dokumentasi Sejarah Kampus Pleburan & Bodjong Semarang (Koleksi Arsip)', 400, 590)
  }

  // Summary Text Section below the document box
  ctx.textAlign = 'left'
  ctx.fillStyle = '#1a1815'
  ctx.font = 'bold 22px Georgia, serif'
  ctx.fillText('Keterangan Dokumen & Catatan Sejarah:', 65, 660)

  ctx.fillStyle = '#3d372e'
  ctx.font = '17px system-ui, sans-serif'
  const descWords = exhibit.description.split(' ')
  let line = ''
  let curY = 695
  for (let w of descWords) {
    const testLine = line + w + ' '
    if (ctx.measureText(testLine).width > 670) {
      ctx.fillText(line, 65, curY)
      line = w + ' '
      curY += 26
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, 65, curY)

  // Bullet highlights
  if (exhibit.highlights) {
    curY += 20
    ctx.fillStyle = '#0b1d3a'
    ctx.font = 'bold 18px Georgia, serif'
    ctx.fillText('Poin Penting Sejarah:', 65, curY)
    curY += 28

    ctx.fillStyle = '#2d251d'
    ctx.font = '15px system-ui, sans-serif'
    exhibit.highlights.forEach((hl) => {
      ctx.fillStyle = '#d4af37'
      ctx.fillText('✦', 65, curY)
      ctx.fillStyle = '#2d251d'
      ctx.fillText(hl, 85, curY)
      curY += 26
    })
  }

  // Bottom Footer Gold Bar
  ctx.fillStyle = '#d4af37'
  ctx.fillRect(60, 930, 680, 2)
  ctx.fillStyle = '#8c7d67'
  ctx.font = 'italic 14px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('Koleksi Arsip & Dokumentasi Sejarah Universitas Diponegoro', 400, 960)

  return canvas
}

export function createHistoryPanelTexture(exhibit: HistoryExhibit): THREE.CanvasTexture {
  return assetCache.getTexture(`history-panel-${exhibit.id}`, () => {
    return toTexture(createHistoryPanelCanvas(exhibit))
  })
}

export function createHistoryDataURL(exhibit: HistoryExhibit): string {
  return createHistoryPanelCanvas(exhibit).toDataURL('image/jpeg', 0.88)
}

/** Universitas Diponegoro Emblem / Seal Texture for the Ceremonial Podium */
export function createPodiumSealTexture(): THREE.CanvasTexture {
  return assetCache.getTexture('podium-seal', () => {
    const [canvas, ctx] = makeCanvas(512, 512)

    // Transparent / circular gold brass medallion
    ctx.clearRect(0, 0, 512, 512)

    // Outer medallion ring
    ctx.fillStyle = '#d4af37'
    ctx.beginPath()
    ctx.arc(256, 256, 240, 0, Math.PI * 2)
    ctx.fill()

    // Inner navy blue inlay
    ctx.fillStyle = '#0b1d3a'
    ctx.beginPath()
    ctx.arc(256, 256, 215, 0, Math.PI * 2)
    ctx.fill()

    // Fine gold trim
    ctx.strokeStyle = '#f5da77'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(256, 256, 200, 0, Math.PI * 2)
    ctx.stroke()

    // Iconic Diponegoro Silhouette on Horseback / Crest
    ctx.fillStyle = '#d4af37'
    ctx.beginPath()
    // Rearing steed and hero figure
    ctx.arc(256, 230, 70, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.font = 'bold 24px "Times New Roman", Georgia, serif'
    ctx.fillText('UNIVERSITAS DIPONEGORO', 256, 120)

    ctx.fillStyle = '#d4af37'
    ctx.font = 'bold 18px "Times New Roman", Georgia, serif'
    ctx.fillText('SEMARANG • 1957', 256, 390)

    ctx.fillStyle = '#f8f4eb'
    ctx.font = 'italic 16px Georgia, serif'
    ctx.fillText('"Tetap Jaya, Makin Jaya"', 256, 420)

    return toTexture(canvas)
  })
}

/** 3D Miniature Campus Map Layout Texture for Undip Tembalang */
export function createCampusMiniatureTexture(): THREE.CanvasTexture {
  return assetCache.getTexture('campus-miniature', () => {
    const [canvas, ctx] = makeCanvas(1024, 1024)

    // Lush green campus lawns & topography
    const terrain = ctx.createLinearGradient(0, 0, 1024, 1024)
    terrain.addColorStop(0, '#2c4728')
    terrain.addColorStop(0.5, '#355330')
    terrain.addColorStop(1, '#273f24')
    ctx.fillStyle = terrain
    ctx.fillRect(0, 0, 1024, 1024)

    // Campus Reservoir / Lake (Waduk Undip)
    ctx.fillStyle = '#1f4863'
    ctx.beginPath()
    ctx.ellipse(340, 480, 130, 85, 0.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#32719c'
    ctx.lineWidth = 3
    ctx.stroke()

    // Ring Roads & Boulevard (Jl. Prof. Soedarto)
    ctx.strokeStyle = '#4a4843'
    ctx.lineWidth = 24
    ctx.beginPath()
    ctx.arc(512, 512, 360, 0, Math.PI * 2)
    ctx.stroke()

    // Cross boulevard
    ctx.beginPath()
    ctx.moveTo(512, 80)
    ctx.lineTo(512, 944)
    ctx.moveTo(80, 512)
    ctx.lineTo(944, 512)
    ctx.stroke()

    // Road lane markings
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 8])
    ctx.beginPath()
    ctx.arc(512, 512, 360, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Iconic Central Landmark: Widya Puraya Quadrangle
    ctx.fillStyle = '#9e8971'
    ctx.fillRect(440, 440, 144, 144)
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 4
    ctx.strokeRect(440, 440, 144, 144)

    // Miniature Building Plots (Faculties)
    const faculties = [
      { name: 'Teknik', x: 200, y: 220, w: 120, h: 90, color: '#0d2d52' },
      { name: 'Hukum', x: 700, y: 220, w: 110, h: 80, color: '#4a151b' },
      { name: 'FEB', x: 220, y: 720, w: 110, h: 80, color: '#3d311d' },
      { name: 'Kedokteran', x: 680, y: 700, w: 130, h: 90, color: '#164d36' },
      { name: 'FSM', x: 150, y: 460, w: 90, h: 70, color: '#1b3b5a' },
      { name: 'FISIP', x: 770, y: 460, w: 90, h: 70, color: '#542918' },
      { name: 'Stadium', x: 512, y: 790, w: 160, h: 80, color: '#526649' },
    ]

    faculties.forEach((f) => {
      ctx.fillStyle = f.color
      ctx.fillRect(f.x, f.y, f.w, f.h)
      ctx.strokeStyle = '#d4af37'
      ctx.lineWidth = 2
      ctx.strokeRect(f.x, f.y, f.w, f.h)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 15px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(f.name, f.x + f.w / 2, f.y + f.h / 2 + 5)
    })

    // Center Widya Puraya Label
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('WIDYA PURAYA', 512, 520)

    // Compass Rose
    ctx.fillStyle = '#d4af37'
    ctx.font = 'bold 20px serif'
    ctx.fillText('U', 920, 120)
    ctx.beginPath()
    ctx.moveTo(920, 130)
    ctx.lineTo(928, 160)
    ctx.lineTo(920, 150)
    ctx.lineTo(912, 160)
    ctx.closePath()
    ctx.fill()

    // Title on Map Corner
    ctx.fillStyle = 'rgba(11, 29, 58, 0.9)'
    ctx.fillRect(50, 50, 360, 65)
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 2
    ctx.strokeRect(50, 50, 360, 65)

    ctx.fillStyle = '#f8f4eb'
    ctx.font = 'bold 16px Georgia, serif'
    ctx.textAlign = 'left'
    ctx.fillText('MAKET KAWASAN KAMPUS UNDIP', 65, 80)
    ctx.fillStyle = '#d4af37'
    ctx.font = '13px sans-serif'
    ctx.fillText('Tembalang & Pleburan • Skala Model Arsitektural', 65, 100)

    return toTexture(canvas)
  })
}

/** Grand Back-Wall Plaque Texture with Golden Inscription */
export function createGrandPlaqueTexture(): THREE.CanvasTexture {
  return assetCache.getTexture('grand-plaque', () => {
    const [canvas, ctx] = makeCanvas(1200, 700)

    // Heritage dark teak background
    ctx.fillStyle = '#1f130b'
    ctx.fillRect(0, 0, 1200, 700)

    // Ornate double gold borders
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 8
    ctx.strokeRect(24, 24, 1152, 652)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)'
    ctx.lineWidth = 2
    ctx.strokeRect(40, 40, 1120, 620)

    // Corner decorative flourishes
    const corners = [
      [40, 40],
      [1160, 40],
      [40, 660],
      [1160, 660],
    ]
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#d4af37'
      ctx.beginPath()
      ctx.arc(cx, cy, 14, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.textAlign = 'center'
    ctx.fillStyle = '#d4af37'
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText('MEMORIAL HALL & ARCHIVES', 600, 160)

    ctx.fillStyle = '#f8f4eb'
    fitFont(ctx, 'MUSEUM VIRTUAL UNIVERSITAS DIPONEGORO', 'Georgia, serif', 'bold', 'normal', 1050, 52, 30)
    ctx.fillText('MUSEUM VIRTUAL UNIVERSITAS DIPONEGORO', 600, 240)

    ctx.fillStyle = '#d4af37'
    ctx.font = 'italic 28px Georgia, serif'
    ctx.fillText('Sayap Tokoh Pendiri • Sayap Sejarah & Arsip Resmi', 600, 310)

    ctx.fillStyle = '#dcd4c3'
    ctx.font = '18px system-ui, sans-serif'
    ctx.fillText('Diresmikan sebagai bentuk penghormatan atas dedikasi para pendiri sejak 1956', 600, 400)
    ctx.fillText('serta pelestarian warisan nilai patriotik Pangeran Diponegoro.', 600, 435)

    ctx.fillStyle = '#d4af37'
    ctx.font = 'bold 22px Georgia, serif'
    ctx.fillText('"Pernah Jaya, Tetap Jaya, Makin Jaya"', 600, 520)

    ctx.fillStyle = '#a6906d'
    ctx.font = '15px sans-serif'
    ctx.fillText('Semarang, Jawa Tengah • Dies Natalis 15 Oktober 1957', 600, 570)

    return toTexture(canvas)
  })
}

/** Official Portrait Canvas for President of the Republic of Indonesia */
export function createPresidentTexture(): THREE.CanvasTexture {
  return assetCache.getTexture('pres-texture', () => {
    const [canvas, ctx] = makeCanvas(500, 650)
    ctx.fillStyle = '#b71c1c'
    ctx.fillRect(0, 0, 250, 650)
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(250, 0, 250, 650)

    const vig = ctx.createRadialGradient(250, 325, 100, 250, 325, 420)
    vig.addColorStop(0, 'rgba(0,0,0,0.15)')
    vig.addColorStop(1, 'rgba(0,0,0,0.65)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, 500, 650)

    ctx.fillStyle = '#111111'
    ctx.beginPath()
    ctx.ellipse(250, 600, 180, 160, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(250, 330)
    ctx.lineTo(215, 430)
    ctx.lineTo(285, 430)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#c62828'
    ctx.beginPath()
    ctx.moveTo(242, 380)
    ctx.lineTo(258, 380)
    ctx.lineTo(265, 520)
    ctx.lineTo(250, 550)
    ctx.lineTo(235, 520)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = '#ffd700'
    ctx.lineWidth = 14
    ctx.beginPath()
    ctx.moveTo(140, 620)
    ctx.lineTo(340, 360)
    ctx.stroke()

    ctx.fillStyle = '#d7a77d'
    ctx.beginPath()
    ctx.ellipse(250, 240, 75, 95, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#111111'
    ctx.fillRect(175, 130, 150, 65)

    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 6
    ctx.strokeRect(16, 16, 468, 618)

    ctx.fillStyle = 'rgba(11, 29, 58, 0.92)'
    ctx.fillRect(30, 550, 440, 70)
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 2
    ctx.strokeRect(32, 552, 436, 66)

    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px Georgia, serif'
    ctx.fillText('PRESIDEN', 250, 580)
    ctx.fillStyle = '#ffd700'
    ctx.font = '14px sans-serif'
    ctx.fillText('REPUBLIK INDONESIA', 250, 604)

    return toTexture(canvas)
  })
}

/** Official Portrait Canvas for Vice-President of the Republic of Indonesia */
export function createVicePresidentTexture(): THREE.CanvasTexture {
  return assetCache.getTexture('vp-texture', () => {
    const [canvas, ctx] = makeCanvas(500, 650)
    ctx.fillStyle = '#b71c1c'
    ctx.fillRect(0, 0, 250, 650)
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(250, 0, 250, 650)

    const vig = ctx.createRadialGradient(250, 325, 100, 250, 325, 420)
    vig.addColorStop(0, 'rgba(0,0,0,0.15)')
    vig.addColorStop(1, 'rgba(0,0,0,0.65)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, 500, 650)

    ctx.fillStyle = '#111111'
    ctx.beginPath()
    ctx.ellipse(250, 600, 180, 160, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(250, 330)
    ctx.lineTo(215, 430)
    ctx.lineTo(285, 430)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#1565c0'
    ctx.beginPath()
    ctx.moveTo(242, 380)
    ctx.lineTo(258, 380)
    ctx.lineTo(265, 520)
    ctx.lineTo(250, 550)
    ctx.lineTo(235, 520)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#d7a77d'
    ctx.beginPath()
    ctx.ellipse(250, 240, 75, 95, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#111111'
    ctx.fillRect(175, 130, 150, 65)

    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 6
    ctx.strokeRect(16, 16, 468, 618)

    ctx.fillStyle = 'rgba(11, 29, 58, 0.92)'
    ctx.fillRect(30, 550, 440, 70)
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 2
    ctx.strokeRect(32, 552, 436, 66)

    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px Georgia, serif'
    ctx.fillText('WAKIL PRESIDEN', 250, 580)
    ctx.fillStyle = '#ffd700'
    ctx.font = '14px sans-serif'
    ctx.fillText('REPUBLIK INDONESIA', 250, 604)

    return toTexture(canvas)
  })
}

/** Quilted PVC Diamond Lattice Texture for the Coffered Ceiling */
export function createPvcDiamondLatticeTexture(): THREE.CanvasTexture {
  return assetCache.getTexture('pvc-diamond-lattice', () => {
    const [canvas, ctx] = makeCanvas(1024, 1024)

    ctx.fillStyle = '#faf8f2'
    ctx.fillRect(0, 0, 1024, 1024)

    const gridStep = 64
    ctx.strokeStyle = '#e2dac8'
    ctx.lineWidth = 3

    for (let d = -1024; d <= 2048; d += gridStep) {
      ctx.beginPath()
      ctx.moveTo(d, 0)
      ctx.lineTo(d + 1024, 1024)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(d, 1024)
      ctx.lineTo(d + 1024, 0)
      ctx.stroke()
    }

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)'
    ctx.lineWidth = 1.5
    for (let d = -1024; d <= 2048; d += gridStep) {
      ctx.beginPath()
      ctx.moveTo(d, 0)
      ctx.lineTo(d + 1024, 1024)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(d, 1024)
      ctx.lineTo(d + 1024, 0)
      ctx.stroke()
    }

    const sheen = ctx.createRadialGradient(512, 512, 120, 512, 512, 600)
    sheen.addColorStop(0, 'rgba(255, 245, 220, 0.22)')
    sheen.addColorStop(1, 'rgba(230, 220, 200, 0)')
    ctx.fillStyle = sheen
    ctx.fillRect(0, 0, 1024, 1024)

    return toTexture(canvas)
  })
}

/** Legacy Compatibility helpers */
export function createPortraitTexture(portrait: { id: string; name: string; years: string }): THREE.CanvasTexture {
  return createFounderPortraitTexture({
    id: portrait.id,
    name: portrait.name,
    title: 'Tokoh Universitas Diponegoro',
    years: portrait.years,
    role: '',
    description: '',
  }, 0)
}

export function createPortraitDataURL(portrait: { id: string; name: string; years: string }): string {
  return createFounderDataURL({
    id: portrait.id,
    name: portrait.name,
    title: 'Tokoh Universitas Diponegoro',
    years: portrait.years,
    role: '',
    description: '',
  }, 0)
}

export function createLabelTexture(portrait: { name: string; years: string }): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(640, 220)
  ctx.fillStyle = '#efe6d5'
  ctx.fillRect(0, 0, 640, 220)
  ctx.strokeStyle = '#a9803f'
  ctx.lineWidth = 5
  ctx.strokeRect(10, 10, 620, 200)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#2a2018'
  fitFont(ctx, portrait.name, 'Georgia, serif', 'bold', 'normal', 560, 48, 26)
  ctx.fillText(portrait.name, 320, 95)
  ctx.fillStyle = '#7c5c2c'
  fitFont(ctx, portrait.years, 'Georgia, serif', 'normal', 'italic', 560, 32, 20)
  ctx.fillText(portrait.years, 320, 158)
  return toTexture(canvas)
}
