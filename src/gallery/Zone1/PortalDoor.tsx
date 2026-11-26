import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

interface PortalDoorProps {
  id: string
  doorNumber: string
  title: string
  subtitle?: string
  position: [number, number, number]
  rotationY: number
  isHovered: boolean
  onSelect: () => void
  onHover: (id: string | null) => void
  variant?: 'portal' | 'exit'
}

/**
 * Membuat tekstur papan palang penunjuk arah dua sisi:
 * - arrowSide = 'left': tab Heritage Brown di kiri dengan panah (←) mengarah ke pintu/dinding
 * - arrowSide = 'right': tab Heritage Brown di kanan dengan panah (→) mengarah ke pintu/dinding
 */
function createDirectionalSignTexture(
  doorNumber: string,
  title: string,
  isHovered: boolean,
  arrowSide: 'left' | 'right',
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 768
  canvas.height = 240
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const w = canvas.width
  const h = canvas.height
  const radius = 36
  const tabWidth = 175
  const bottomLip = 16

  // 1. Latar dasar Heritage Brown (tab pangkal & lis bawah)
  ctx.fillStyle = isHovered ? '#8b5e34' : '#734b28'
  ctx.beginPath()
  if (arrowSide === 'left') {
    ctx.moveTo(0, 0)
    ctx.lineTo(w - radius, 0)
    ctx.quadraticCurveTo(w, 0, w, radius)
    ctx.lineTo(w, h - radius)
    ctx.quadraticCurveTo(w, h, w - radius, h)
    ctx.lineTo(0, h)
  } else {
    ctx.moveTo(w, 0)
    ctx.lineTo(radius, 0)
    ctx.quadraticCurveTo(0, 0, 0, radius)
    ctx.lineTo(0, h - radius)
    ctx.quadraticCurveTo(0, h, radius, h)
    ctx.lineTo(w, h)
  }
  ctx.closePath()
  ctx.fill()

  // 2. Badan utama gelap (Dark Slate / Navy) dengan sudut membulat di ujung luar
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, isHovered ? '#1e2c3d' : '#182230')
  grad.addColorStop(1, isHovered ? '#2a384a' : '#252b34')

  ctx.fillStyle = grad
  ctx.beginPath()
  if (arrowSide === 'left') {
    ctx.moveTo(tabWidth - 28, 0)
    ctx.lineTo(w - radius, 0)
    ctx.quadraticCurveTo(w, 0, w, radius)
    ctx.lineTo(w, h - bottomLip - radius * 0.6)
    ctx.quadraticCurveTo(w, h - bottomLip, w - radius * 0.8, h - bottomLip)
    ctx.lineTo(tabWidth + 14, h - bottomLip)
    ctx.quadraticCurveTo(tabWidth - 6, h - bottomLip, tabWidth - 14, h - bottomLip - 22)
  } else {
    const rightTabStart = w - tabWidth
    ctx.moveTo(rightTabStart + 28, 0)
    ctx.lineTo(radius, 0)
    ctx.quadraticCurveTo(0, 0, 0, radius)
    ctx.lineTo(0, h - bottomLip - radius * 0.6)
    ctx.quadraticCurveTo(0, h - bottomLip, radius * 0.8, h - bottomLip)
    ctx.lineTo(rightTabStart - 14, h - bottomLip)
    ctx.quadraticCurveTo(rightTabStart + 6, h - bottomLip, rightTabStart + 14, h - bottomLip - 22)
  }
  ctx.closePath()
  ctx.fill()

  // 3. Panah Putih Tebal mengarah ke pangkal pintu/dinding
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 14
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const arrowCenterY = h / 2
  ctx.beginPath()
  if (arrowSide === 'left') {
    const arrowLeftX = 48
    const arrowRightX = 122
    ctx.moveTo(arrowRightX, arrowCenterY)
    ctx.lineTo(arrowLeftX, arrowCenterY)
    ctx.moveTo(arrowLeftX + 28, arrowCenterY - 26)
    ctx.lineTo(arrowLeftX, arrowCenterY)
    ctx.lineTo(arrowLeftX + 28, arrowCenterY + 26)
  } else {
    const arrowLeftX = w - 122
    const arrowRightX = w - 48
    ctx.moveTo(arrowLeftX, arrowCenterY)
    ctx.lineTo(arrowRightX, arrowCenterY)
    ctx.moveTo(arrowRightX - 28, arrowCenterY - 26)
    ctx.lineTo(arrowRightX, arrowCenterY)
    ctx.lineTo(arrowRightX - 28, arrowCenterY + 26)
  }
  ctx.stroke()

  // 4. Teks Putih Kapital Tebal (2 baris)
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const textCenterX =
    arrowSide === 'left'
      ? tabWidth + (w - tabWidth - 16) / 2
      : (w - tabWidth - 16) / 2 + 16

  ctx.font = '800 32px "Segoe UI", Arial, sans-serif'
  ctx.fillText(doorNumber.toUpperCase(), textCenterX, h / 2 - 26, w - tabWidth - 48)

  ctx.font = '800 34px "Segoe UI", Arial, sans-serif'
  ctx.fillText(title.toUpperCase(), textCenterX, h / 2 + 24, w - tabWidth - 48)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

/**
 * Pintu Portal Klasik Museum Virtual Undip:
 * Menggunakan palet seragam Base Zone (Dark Walnut Teak, Royal Navy, dan Undip Gold)
 * dengan papan judul di atas kusen serta palang penunjuk horizontal menonjol ke ruangan.
 */
export function PortalDoor({
  id,
  doorNumber,
  title,
  subtitle,
  position,
  rotationY,
  isHovered,
  onSelect,
  onHover,
  variant = 'portal',
}: PortalDoorProps) {
  const headerBg = variant === 'exit' ? '#2c1a0e' : '#142e56'
  const trimColor = isHovered ? '#ffd700' : '#d4af37'

  const signTextureFront = useMemo(
    () => createDirectionalSignTexture(doorNumber, title, isHovered, 'left'),
    [doorNumber, title, isHovered],
  )
  const signTextureBack = useMemo(
    () => createDirectionalSignTexture(doorNumber, title, isHovered, 'right'),
    [doorNumber, title, isHovered],
  )

  // Geometri 3D palang melayang bersudut membulat di ujung luar (+X)
  const signBodyGeo = useMemo(() => {
    const w = 1.44
    const h = 0.44
    const r = 0.068
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2, -h / 2)
    shape.lineTo(w / 2 - r, -h / 2)
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
    shape.lineTo(w / 2, h / 2 - r)
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
    shape.lineTo(-w / 2, h / 2)
    shape.closePath()

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.04,
      bevelEnabled: false,
      curveSegments: 12,
    })
  }, [])

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(id)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onHover(null)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {/* Kusen Utama Pintu (Dark Teak) */}
      <mesh position={[0, 2.05, 0.04]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 4.1, 0.14]} />
        <meshStandardMaterial color="#2c1a0e" roughness={0.45} metalness={0.15} />
      </mesh>

      {/* Palang Penunjuk Arah Horizontal Menonjol di Pojok Kanan Atas Kusen Pintu (2 Sisi) */}
      <group position={[1.55, 3.86, 0.08 + 1.44 / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh geometry={signBodyGeo} position={[0, 0, -0.02]} castShadow>
          <meshStandardMaterial color="#5c3b1e" roughness={0.48} metalness={0.12} />
        </mesh>
        {/* Sisi A */}
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[1.44, 0.44]} />
          <meshStandardMaterial
            map={signTextureFront}
            transparent
            alphaTest={0.08}
            roughness={0.35}
            metalness={0.08}
          />
        </mesh>
        {/* Sisi B */}
        <mesh position={[0, 0, -0.022]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.44, 0.44]} />
          <meshStandardMaterial
            map={signTextureBack}
            transparent
            alphaTest={0.08}
            roughness={0.35}
            metalness={0.08}
          />
        </mesh>
      </group>

      {/* Papan Judul / Architrave di Atas Pintu */}
      <group position={[0, 4.78, 0.12]}>
        {/* Bingkai Emas Papan Judul */}
        <mesh castShadow>
          <boxGeometry args={[3.7, 1.08, 0.12]} />
          <meshStandardMaterial
            color={trimColor}
            roughness={0.26}
            metalness={0.86}
            emissive={isHovered ? '#b8860b' : '#000000'}
            emissiveIntensity={isHovered ? 0.3 : 0}
          />
        </mesh>

        {/* Bidang Latar Royal Navy Papan Judul */}
        <mesh position={[0, 0, 0.045]}>
          <boxGeometry args={[3.52, 0.92, 0.05]} />
          <meshStandardMaterial color={headerBg} roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Nomor / Label Ruang */}
        <Text
          position={[0, 0.28, 0.08]}
          fontSize={0.13}
          letterSpacing={0.14}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.2}
        >
          {doorNumber}
        </Text>

        {/* Judul Utama Pintu */}
        <Text
          position={[0, 0.01, 0.08]}
          fontSize={0.21}
          fontWeight={700}
          color="#fdfbf7"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.25}
          textAlign="center"
        >
          {title}
        </Text>

        {/* Subjudul Pintu */}
        {subtitle && (
          <Text
            position={[0, -0.27, 0.08]}
            fontSize={0.125}
            color="#d9e2ec"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.25}
            textAlign="center"
          >
            {subtitle}
          </Text>
        )}
      </group>

      {/* Garis Lis Emas Pemisah Kusen & Papan Judul */}
      <mesh position={[0, 4.12, 0.1]}>
        <boxGeometry args={[3.3, 0.06, 0.18]} />
        <meshStandardMaterial color={trimColor} roughness={0.25} metalness={0.88} />
      </mesh>

      {/* Dua Daun Pintu Simetris */}
      {[-0.72, 0.72].map((dx, di) => (
        <group key={di} position={[dx, 1.98, 0.08]}>
          {/* Badan Daun Pintu */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.38, 3.82, 0.08]} />
            <meshStandardMaterial color="#24150b" roughness={0.5} metalness={0.12} />
          </mesh>

          {/* Lis Emas Sekeliling Daun Pintu */}
          <mesh position={[0, 0, 0.042]}>
            <boxGeometry args={[1.22, 3.62, 0.01]} />
            <meshStandardMaterial
              color={trimColor}
              roughness={0.28}
              metalness={0.85}
              emissive={isHovered ? '#b8860b' : '#000000'}
              emissiveIntensity={isHovered ? 0.25 : 0}
            />
          </mesh>

          {/* Panel Atas Royal Navy */}
          <mesh position={[0, 0.65, 0.048]}>
            <boxGeometry args={[1.08, 1.85, 0.015]} />
            <meshStandardMaterial color="#142e56" roughness={0.4} metalness={0.2} />
          </mesh>

          {/* Panel Bawah Royal Navy */}
          <mesh position={[0, -0.88, 0.048]}>
            <boxGeometry args={[1.08, 1.3, 0.015]} />
            <meshStandardMaterial color="#142e56" roughness={0.4} metalness={0.2} />
          </mesh>

          {/* Gagang Pintu Kuningan */}
          <group position={[di === 0 ? 0.52 : -0.52, 0, 0.08]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
              <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.92} />
            </mesh>
            {[-0.24, 0.24].map((hy, hi) => (
              <mesh key={hi} position={[0, hy, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.014, 0.014, 0.06, 12]} />
                <meshStandardMaterial color={trimColor} roughness={0.25} metalness={0.88} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* Lampu Sorot Emas di Atas Pintu Saat Hover */}
      {isHovered && (
        <pointLight position={[0, 4.3, 1.2]} color="#ffd999" intensity={2.2} distance={5} />
      )}
    </group>
  )
}
