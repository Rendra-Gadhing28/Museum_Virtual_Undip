import * as THREE from 'three'
import { assetCache } from '../Zone1/cache'
import type { Zone2Exhibit } from './types'

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

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * Creates high-fidelity canvas texture for Faculty panels
 */
export function createFacultyTexture(exhibit: Zone2Exhibit): THREE.CanvasTexture {
  const key = `zone2-faculty-tex-navy-${exhibit.id}`
  return assetCache.getTexture(key, () => {
    const [canvas, ctx] = makeCanvas(1024, 768)

    // Elegant IVORY parchment background (warm, never cold white)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 768)
    bgGrad.addColorStop(0, '#fdfaf2')
    bgGrad.addColorStop(0.5, '#f7f1e3')
    bgGrad.addColorStop(1, '#efe6d2')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 1024, 768)

    // Outer Navy Border + Inner Navy Hairline
    ctx.strokeStyle = '#0f2d5c'
    ctx.lineWidth = 6
    ctx.strokeRect(20, 20, 984, 728)

    ctx.strokeStyle = 'rgba(15, 45, 92, 0.35)'
    ctx.lineWidth = 2
    ctx.strokeRect(32, 32, 960, 704)

    // Top Category & Period Badge — BLUE NAVY typography
    ctx.fillStyle = '#0f2d5c'
    ctx.font = 'bold 22px "Times New Roman", serif'
    ctx.textAlign = 'center'
    ctx.fillText('UNIVERSITAS DIPONEGORO • THE GROWTH OF KNOWLEDGE', 512, 70)

    // Navy ribbon for period
    roundRect(ctx, 380, 88, 264, 40, 8)
    ctx.fillStyle = '#e9eef8'
    ctx.fill()
    ctx.strokeStyle = '#1b3a66'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#123a6b'
    ctx.font = 'bold 22px system-ui, sans-serif'
    ctx.fillText(`DIDIRIKAN: ${exhibit.period}`, 512, 115)

    // Title — deep BLUE NAVY, auto-shrink for long faculty names
    const titleSize = exhibit.title.length > 42 ? 34 : exhibit.title.length > 34 ? 40 : 44
    ctx.fillStyle = '#0f2d5c'
    ctx.font = `bold ${titleSize}px "Times New Roman", Georgia, serif`
    ctx.fillText(exhibit.title, 512, 185)

    // Subtitle — softer navy
    ctx.fillStyle = '#2a5494'
    ctx.font = 'italic 24px Georgia, serif'
    ctx.fillText(exhibit.subtitle, 512, 230)

    // Navy Divider
    const divGrad = ctx.createLinearGradient(160, 0, 864, 0)
    divGrad.addColorStop(0, 'rgba(15, 45, 92, 0)')
    divGrad.addColorStop(0.5, 'rgba(15, 45, 92, 0.85)')
    divGrad.addColorStop(1, 'rgba(15, 45, 92, 0)')
    ctx.strokeStyle = divGrad
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(160, 260)
    ctx.lineTo(864, 260)
    ctx.stroke()

    // Decorative Emblem Box — navy fill with gold hairline
    roundRect(ctx, 80, 290, 240, 240, 16)
    ctx.fillStyle = '#12315c'
    ctx.fill()
    ctx.strokeStyle = '#c9a24b'
    ctx.lineWidth = 3
    ctx.stroke()

    // Emblem initials in ivory on navy
    const shortInitial = exhibit.title.includes('(')
      ? exhibit.title.split('(')[1].replace(')', '')
      : 'UNDIP'
    ctx.fillStyle = '#f7f1e3'
    ctx.font = `bold ${shortInitial.length > 4 ? 60 : 76}px system-ui, sans-serif`
    ctx.fillText(shortInitial, 200, 420)

    ctx.font = '16px system-ui, sans-serif'
    ctx.fillStyle = '#cbd8ee'
    ctx.fillText('FAKULTAS UNDIP', 200, 470)

    // Narrative Text — BLUE NAVY
    ctx.textAlign = 'left'
    ctx.fillStyle = '#1b3358'
    ctx.font = '22px system-ui, sans-serif'

    const words = exhibit.description.split(' ')
    let line = ''
    let y = 320
    const maxWidth = 580
    const startX = 360

    for (const w of words) {
      const testLine = line + w + ' '
      if (ctx.measureText(testLine).width > maxWidth) {
        ctx.fillText(line, startX, y)
        line = w + ' '
        y += 34
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, startX, y)

    // Highlights bullets
    if (exhibit.highlights && exhibit.highlights.length > 0) {
      y += 30
      ctx.fillStyle = '#0f2d5c'
      ctx.font = 'bold 20px system-ui, sans-serif'
      ctx.fillText('KEUNGGULAN UTAMA:', startX, y)
      y += 28

      ctx.fillStyle = '#24467c'
      ctx.font = '18px system-ui, sans-serif'
      for (const h of exhibit.highlights.slice(0, 2)) {
        ctx.fillText(`★  ${h}`, startX, y)
        y += 30
      }
    }

    // Bottom Stats Bar — navy cells on ivory
    if (exhibit.stats && exhibit.stats.length > 0) {
      const statW = 900 / exhibit.stats.length
      exhibit.stats.forEach((st, i) => {
        const sx = 62 + i * statW
        roundRect(ctx, sx, 610, statW - 16, 80, 8)
        ctx.fillStyle = '#e9eef8'
        ctx.fill()
        ctx.strokeStyle = 'rgba(15, 45, 92, 0.35)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.textAlign = 'center'
        ctx.fillStyle = '#0f2d5c'
        ctx.font = 'bold 22px system-ui, sans-serif'
        ctx.fillText(st.value, sx + (statW - 16) / 2, 645)

        ctx.fillStyle = '#41598a'
        ctx.font = '15px system-ui, sans-serif'
        ctx.fillText(st.label, sx + (statW - 16) / 2, 672)
      })
    }

    return toTexture(canvas)
  })
}

/**
 * Creates high-fidelity canvas texture for Research & Achievement panels
 */
export function createResearchTexture(exhibit: Zone2Exhibit): THREE.CanvasTexture {
  const key = `zone2-research-tex-${exhibit.id}`
  return assetCache.getTexture(key, () => {
    const [canvas, ctx] = makeCanvas(1024, 768)

    // Rich warm-tinged dark navy background
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 768)
    bgGrad.addColorStop(0, '#0a162b')
    bgGrad.addColorStop(0.5, '#07101f')
    bgGrad.addColorStop(1, '#050a14')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 1024, 768)

    // Double Gold Frame with corner brackets
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 5
    ctx.strokeRect(24, 24, 976, 720)

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(36, 36, 952, 696)

    // Top Header Banner
    ctx.fillStyle = '#ffd700'
    ctx.font = 'bold 20px system-ui, sans-serif'
    ctx.textAlign = 'center'
    const catLabel =
      exhibit.category === 'research'
        ? 'PERKEMBANGAN PENDIDIKAN & PENELITIAN'
        : 'PRESTASI AKADEMIK & KONTRIBUSI MASYARAKAT'
    ctx.fillText(catLabel, 512, 72)

    // Period Chip
    roundRect(ctx, 420, 88, 184, 34, 6)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.25)'
    ctx.fill()
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.fillStyle = '#fbbf24'
    ctx.font = 'bold 18px system-ui, sans-serif'
    ctx.fillText(exhibit.period, 512, 111)

    // Main Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 40px "Times New Roman", Georgia, serif'
    ctx.fillText(exhibit.title, 512, 175)

    // Subtitle
    ctx.fillStyle = '#ffd54f'
    ctx.font = 'italic 23px Georgia, serif'
    ctx.fillText(exhibit.subtitle, 512, 218)

    // Divider
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(140, 246)
    ctx.lineTo(884, 246)
    ctx.stroke()

    // Left Visual Illustration Box (e.g. Ship / Marine / KKN / World Badge)
    roundRect(ctx, 64, 276, 260, 290, 12)
    ctx.fillStyle = '#0f223f'
    ctx.fill()
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 2
    ctx.stroke()

    // Custom Icon drawing
    ctx.fillStyle = '#fbbf24'
    ctx.textAlign = 'center'
    if (exhibit.id.includes('kelautan')) {
      ctx.font = '70px system-ui, sans-serif'
      ctx.fillText('🌊', 194, 380)
      ctx.font = 'bold 20px system-ui, sans-serif'
      ctx.fillText('BINA KELAUTAN', 194, 440)
      ctx.font = '15px system-ui, sans-serif'
      ctx.fillStyle = '#cbd5e1'
      ctx.fillText('Pola Ilmiah Pokok Undip', 194, 470)
    } else if (exhibit.id.includes('kkn')) {
      ctx.font = '70px system-ui, sans-serif'
      ctx.fillText('🤝', 194, 380)
      ctx.font = 'bold 20px system-ui, sans-serif'
      ctx.fillText('KKN TEMATIK', 194, 440)
      ctx.font = '15px system-ui, sans-serif'
      ctx.fillStyle = '#cbd5e1'
      ctx.fillText('Pengabdian Nusantara', 194, 470)
    } else if (exhibit.id.includes('global')) {
      ctx.font = '70px system-ui, sans-serif'
      ctx.fillText('🏆', 194, 380)
      ctx.font = 'bold 20px system-ui, sans-serif'
      ctx.fillText('WORLD CLASS', 194, 440)
      ctx.font = '15px system-ui, sans-serif'
      ctx.fillStyle = '#cbd5e1'
      ctx.fillText('Top Global Ranking', 194, 470)
    } else {
      ctx.font = '70px system-ui, sans-serif'
      ctx.fillText('🔬', 194, 380)
      ctx.font = 'bold 20px system-ui, sans-serif'
      ctx.fillText('HILIRISASI RISET', 194, 440)
      ctx.font = '15px system-ui, sans-serif'
      ctx.fillStyle = '#cbd5e1'
      ctx.fillText('Paten & Inovasi Bangsa', 194, 470)
    }

    // Right Narrative Body
    ctx.textAlign = 'left'
    ctx.fillStyle = '#f8fafc'
    ctx.font = '22px system-ui, sans-serif'

    const words = exhibit.description.split(' ')
    let line = ''
    let y = 300
    const maxWidth = 550
    const startX = 360

    for (const w of words) {
      const testLine = line + w + ' '
      if (ctx.measureText(testLine).width > maxWidth) {
        ctx.fillText(line, startX, y)
        line = w + ' '
        y += 34
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, startX, y)

    // Highlights
    if (exhibit.highlights && exhibit.highlights.length > 0) {
      y += 24
      ctx.fillStyle = '#f59e0b'
      ctx.font = 'bold 20px system-ui, sans-serif'
      ctx.fillText('POIN KUNCI & DAMPAK:', startX, y)
      y += 28

      ctx.fillStyle = '#e2e8f0'
      ctx.font = '18px system-ui, sans-serif'
      for (const h of exhibit.highlights.slice(0, 2)) {
        ctx.fillText(`◆  ${h}`, startX, y)
        y += 30
      }
    }

    // Bottom Stats
    if (exhibit.stats && exhibit.stats.length > 0) {
      const statW = 900 / exhibit.stats.length
      exhibit.stats.forEach((st, i) => {
        const sx = 62 + i * statW
        roundRect(ctx, sx, 610, statW - 16, 80, 8)
        ctx.fillStyle = 'rgba(15, 34, 63, 0.75)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.textAlign = 'center'
        ctx.fillStyle = '#ffd700'
        ctx.font = 'bold 22px system-ui, sans-serif'
        ctx.fillText(st.value, sx + (statW - 16) / 2, 645)

        ctx.fillStyle = '#94a3b8'
        ctx.font = '15px system-ui, sans-serif'
        ctx.fillText(st.label, sx + (statW - 16) / 2, 672)
      })
    }

    return toTexture(canvas)
  })
}

/**
 * Creates texture for the Master Campus Transformation Diorama Plaque
 */
export function createDioramaPlaqueTexture(): THREE.CanvasTexture {
  return assetCache.getTexture('zone2-diorama-plaque-tex', () => {
    const [canvas, ctx] = makeCanvas(1024, 512)

    // Honed black obsidian / bronze metallic gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 512)
    grad.addColorStop(0, '#1c1710')
    grad.addColorStop(0.5, '#0f0c08')
    grad.addColorStop(1, '#1e1811')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1024, 512)

    // Brushed gold frame
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 8
    ctx.strokeRect(16, 16, 992, 480)

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)'
    ctx.lineWidth = 2
    ctx.strokeRect(28, 28, 968, 456)

    // Text Header
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffd54f'
    ctx.font = 'bold 22px system-ui, sans-serif'
    ctx.fillText('DIORAMA MASTER KAMPUS • UNIVERSITAS DIPONEGORO', 512, 70)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 42px "Times New Roman", Georgia, serif'
    ctx.fillText('TRANSFORMASI KAMPUS UNDIP', 512, 130)

    ctx.fillStyle = '#f59e0b'
    ctx.font = 'italic 24px Georgia, serif'
    ctx.fillText('Evolusi Spasial: Pleburan • Tembalang (180 Ha) • Teluk Awur Jepara', 512, 175)

    // Divider
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(120, 205)
    ctx.lineTo(904, 205)
    ctx.stroke()

    // 3 Campus Pillars
    const cols = [
      { name: 'PLEBURAN', era: '1956–1990an', desc: 'Kampus Heritage Kota Semarang' },
      { name: 'TEMBALANG', era: '1990an–Kini', desc: 'Kampus Utama Terpadu (180 Ha)' },
      { name: 'TELUK AWUR', era: '1988–Kini', desc: 'Sentra Riset Kelautan Jepara' },
    ]

    cols.forEach((col, i) => {
      const cx = 190 + i * 320
      roundRect(ctx, cx - 140, 235, 280, 200, 10)
      ctx.fillStyle = 'rgba(255, 215, 0, 0.08)'
      ctx.fill()
      ctx.strokeStyle = '#d4af37'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.fillStyle = '#ffd700'
      ctx.font = 'bold 26px system-ui, sans-serif'
      ctx.fillText(col.name, cx, 280)

      ctx.fillStyle = '#93c5fd'
      ctx.font = 'bold 18px system-ui, sans-serif'
      ctx.fillText(col.era, cx, 320)

      ctx.fillStyle = '#f1f5f9'
      ctx.font = '16px system-ui, sans-serif'
      ctx.fillText(col.desc, cx, 365)

      ctx.fillStyle = '#fbbf24'
      ctx.font = '14px system-ui, sans-serif'
      ctx.fillText('★ Klik untuk detail ★', cx, 405)
    })

    return toTexture(canvas)
  })
}

/**
 * Creates texture for the Grand Monument on the back wall
 */
export function createZone2MonumentTexture(): THREE.CanvasTexture {
  return assetCache.getTexture('zone2-monument-tex', () => {
    const [canvas, ctx] = makeCanvas(1536, 768)

    // Royal Blue & Gold Granite backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, 768)
    grad.addColorStop(0, '#0d1f3d')
    grad.addColorStop(0.5, '#081429')
    grad.addColorStop(1, '#050c18')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1536, 768)

    // Monument Gold Frame
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 10
    ctx.strokeRect(30, 30, 1476, 708)

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)'
    ctx.lineWidth = 3
    ctx.strokeRect(48, 48, 1440, 672)

    // Header
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffd54f'
    ctx.font = 'bold 28px "Times New Roman", serif'
    ctx.fillText('ZONA II • UNIVERSITAS DIPONEGORO', 768, 110)

    // Monument Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 64px "Times New Roman", Georgia, serif'
    ctx.fillText('THE GROWTH OF KNOWLEDGE', 768, 195)

    // Subtitle
    ctx.fillStyle = '#ffd700'
    ctx.font = 'italic 32px Georgia, serif'
    ctx.fillText('Mekarnya Fakultas, Riset Unggulan, dan Pengabdian Bangsa', 768, 255)

    // Ornate Divider
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(250, 290)
    ctx.lineTo(1286, 290)
    ctx.stroke()

    // Narrative Inscription
    ctx.fillStyle = '#f8fafc'
    ctx.font = '24px Georgia, serif'
    const quote =
      '"Dari benih cita-cita luhur di Kota Semarang, bertunas menjadi pohon pengetahuan agung yang menaungi 11 fakultas, ratusan riset bahari, dan puluhan ribu kader penerus kejayaan Indonesia."'
    ctx.fillText(quote, 768, 360)

    // 4 Key Pillars of Zone 2
    const pillars = [
      { num: 'I', title: 'Perkembangan Fakultas', sub: '11 Fakultas & Vokasi' },
      { num: 'II', title: 'Transformasi Kampus', sub: 'Pleburan ke Tembalang' },
      { num: 'III', title: 'Pendidikan & Riset', sub: 'PIP Bina Kelautan' },
      { num: 'IV', title: 'Prestasi & Pengabdian', sub: 'KKN & Reputasi Dunia' },
    ]

    const cardW = 310
    pillars.forEach((p, i) => {
      const cx = 160 + i * 330
      roundRect(ctx, cx, 430, cardW, 230, 12)
      ctx.fillStyle = 'rgba(15, 33, 64, 0.85)'
      ctx.fill()
      ctx.strokeStyle = '#d4af37'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = '#ffd700'
      ctx.font = 'bold 44px "Times New Roman", serif'
      ctx.fillText(p.num, cx + cardW / 2, 490)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 22px system-ui, sans-serif'
      ctx.fillText(p.title, cx + cardW / 2, 550)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '18px system-ui, sans-serif'
      ctx.fillText(p.sub, cx + cardW / 2, 595)
    })

    return toTexture(canvas)
  })
}

/**
 * Creates modal preview image data URL for Zone 2 exhibits
 */
export function createZone2ExhibitDataURL(exhibit: Zone2Exhibit): string {
  const [canvas, ctx] = makeCanvas(800, 600)

  // Rich gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 600)
  grad.addColorStop(0, '#0e1e38')
  grad.addColorStop(0.5, '#081224')
  grad.addColorStop(1, '#050a14')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 800, 600)

  // Border
  ctx.strokeStyle = '#d4af37'
  ctx.lineWidth = 5
  ctx.strokeRect(16, 16, 768, 568)

  // Text details
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffd700'
  ctx.font = 'bold 20px system-ui, sans-serif'
  ctx.fillText('DOKUMEN & ARSIP RESMI MUSEUM VIRTUAL UNDIP', 400, 60)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px "Times New Roman", Georgia, serif'
  ctx.fillText(exhibit.title, 400, 120)

  ctx.fillStyle = '#ffd54f'
  ctx.font = 'italic 20px Georgia, serif'
  ctx.fillText(exhibit.subtitle, 400, 160)

  // Icon / Graphic
  roundRect(ctx, 260, 200, 280, 200, 16)
  ctx.fillStyle = '#142a4f'
  ctx.fill()
  ctx.strokeStyle = '#d4af37'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#ffd700'
  ctx.font = 'bold 50px system-ui, sans-serif'
  ctx.fillText(exhibit.shortLabel || 'UNDIP', 400, 315)

  // Category & Period
  ctx.fillStyle = '#94a3b8'
  ctx.font = '18px system-ui, sans-serif'
  ctx.fillText(`Kategori: ${exhibit.category.toUpperCase()} • Era: ${exhibit.period}`, 400, 440)

  // Badge
  if (exhibit.badge) {
    roundRect(ctx, 300, 470, 200, 40, 8)
    ctx.fillStyle = 'rgba(212, 175, 55, 0.2)'
    ctx.fill()
    ctx.strokeStyle = '#ffd700'
    ctx.stroke()

    ctx.fillStyle = '#ffd700'
    ctx.font = 'bold 16px system-ui, sans-serif'
    ctx.fillText(exhibit.badge, 400, 496)
  }

  return canvas.toDataURL('image/png')
}
