import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { assetCache } from './cache'

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
  arrowSide: 'left' | 'right',
): THREE.CanvasTexture {
  const cacheKey = `portal-sign-${doorNumber}-${arrowSide}`
  return assetCache.getTexture(cacheKey, () => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 160
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const w = canvas.width
    const h = canvas.height
    const radius = 24
    const tabWidth = 116
    const bottomLip = 10

    // 1. Latar dasar Dark Walnut (tab pangkal & lis bawah)
    ctx.fillStyle = '#392D25'
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

    // 2. Badan utama Muted Navy (#23364F)
    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, '#23364F')
    grad.addColorStop(1, '#1C2B40')

    ctx.fillStyle = grad
    ctx.beginPath()
    if (arrowSide === 'left') {
      ctx.moveTo(tabWidth - 18, 0)
      ctx.lineTo(w - radius, 0)
      ctx.quadraticCurveTo(w, 0, w, radius)
      ctx.lineTo(w, h - bottomLip - radius * 0.6)
      ctx.quadraticCurveTo(w, h - bottomLip, w - radius * 0.8, h - bottomLip)
      ctx.lineTo(tabWidth + 10, h - bottomLip)
      ctx.quadraticCurveTo(tabWidth - 4, h - bottomLip, tabWidth - 10, h - bottomLip - 14)
    } else {
      const rightTabStart = w - tabWidth
      ctx.moveTo(rightTabStart + 18, 0)
      ctx.lineTo(radius, 0)
      ctx.quadraticCurveTo(0, 0, 0, radius)
      ctx.lineTo(0, h - bottomLip - radius * 0.6)
      ctx.quadraticCurveTo(0, h - bottomLip, radius * 0.8, h - bottomLip)
      ctx.lineTo(rightTabStart - 10, h - bottomLip)
      ctx.quadraticCurveTo(rightTabStart + 4, h - bottomLip, rightTabStart + 10, h - bottomLip - 14)
    }
    ctx.closePath()
    ctx.fill()

    // Antique Gold subtle border (#B2935D)
    ctx.strokeStyle = '#B2935D'
    ctx.lineWidth = 3
    ctx.stroke()

    // 3. Panah Warm Ivory (#E9E1D3) mengarah ke pangkal pintu/dinding
    ctx.strokeStyle = '#E9E1D3'
    ctx.lineWidth = 9
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const arrowCenterY = h / 2
    ctx.beginPath()
    if (arrowSide === 'left') {
      const arrowLeftX = 32
      const arrowRightX = 82
      ctx.moveTo(arrowRightX, arrowCenterY)
      ctx.lineTo(arrowLeftX, arrowCenterY)
      ctx.moveTo(arrowLeftX + 18, arrowCenterY - 17)
      ctx.lineTo(arrowLeftX, arrowCenterY)
      ctx.lineTo(arrowLeftX + 18, arrowCenterY + 17)
    } else {
      const arrowLeftX = w - 82
      const arrowRightX = w - 32
      ctx.moveTo(arrowLeftX, arrowCenterY)
      ctx.lineTo(arrowRightX, arrowCenterY)
      ctx.moveTo(arrowRightX - 18, arrowCenterY - 17)
      ctx.lineTo(arrowRightX, arrowCenterY)
      ctx.lineTo(arrowRightX - 18, arrowCenterY + 17)
    }
    ctx.stroke()

    // 4. Teks Warm Ivory (#E9E1D3) & Antique Gold (#B2935D)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const textCenterX =
      arrowSide === 'left'
        ? tabWidth + (w - tabWidth - 10) / 2
        : (w - tabWidth - 10) / 2 + 10

    ctx.fillStyle = '#B2935D'
    ctx.font = '800 20px "Segoe UI", Arial, sans-serif'
    ctx.fillText(doorNumber.toUpperCase(), textCenterX, h / 2 - 17, w - tabWidth - 32)

    ctx.fillStyle = '#E9E1D3'
    ctx.font = '800 23px "Segoe UI", Arial, sans-serif'
    ctx.fillText(title.toUpperCase(), textCenterX, h / 2 + 16, w - tabWidth - 32)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
  })
}

/**
 * Pintu Portal Klasik Museum Virtual Undip:
 * Menggunakan palet Dark Walnut (#392D25), Muted Navy (#23364F), dan Antique Gold (#B2935D)
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
  const headerBg = variant === 'exit' ? '#392D25' : '#23364F'
  const trimColor = isHovered ? '#C6A870' : '#B2935D'

  const signTextureFront = useMemo(
    () => createDirectionalSignTexture(doorNumber, title, 'left'),
    [doorNumber, title],
  )
  const signTextureBack = useMemo(
    () => createDirectionalSignTexture(doorNumber, title, 'right'),
    [doorNumber, title],
  )

  // Geometri 3D palang dicache di assetCache
  const signBodyGeo = useMemo(() => {
    return assetCache.getGeometry('portal-sign-body-geo', () => {
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
        curveSegments: 8,
      })
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
      {/* Kusen Utama Pintu (Dark Walnut #392D25) */}
      <mesh position={[0, 2.05, 0.04]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 4.1, 0.14]} />
        <meshStandardMaterial color="#392D25" roughness={0.48} metalness={0.12} />
      </mesh>

      {/* Palang Penunjuk Arah Horizontal Menonjol di Pojok Kanan Atas Kusen Pintu (2 Sisi) */}
      <group position={[1.55, 3.86, 0.08 + 1.44 / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh geometry={signBodyGeo} position={[0, 0, -0.02]} castShadow>
          <meshStandardMaterial color="#392D25" roughness={0.5} metalness={0.1} />
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
        {/* Bingkai Antique Gold (#B2935D) Papan Judul */}
        <mesh castShadow>
          <boxGeometry args={[3.7, 1.08, 0.12]} />
          <meshStandardMaterial
            color={trimColor}
            roughness={0.36}
            metalness={0.78}
            emissive={isHovered ? '#B2935D' : '#000000'}
            emissiveIntensity={isHovered ? 0.22 : 0}
          />
        </mesh>

        {/* Bidang Latar Muted Navy (#23364F) Papan Judul */}
        <mesh position={[0, 0, 0.045]}>
          <boxGeometry args={[3.52, 0.92, 0.05]} />
          <meshStandardMaterial color={headerBg} roughness={0.44} metalness={0.16} />
        </mesh>

        {/* Nomor / Label Ruang */}
        <Text
          position={[0, 0.28, 0.08]}
          fontSize={0.13}
          letterSpacing={0.14}
          color="#B2935D"
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
          color="#E9E1D3"
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
            color="#E9E1D3"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.25}
            textAlign="center"
          >
            {subtitle}
          </Text>
        )}
      </group>

      {/* Garis Lis Antique Gold Pemisah Kusen & Papan Judul */}
      <mesh position={[0, 4.12, 0.1]}>
        <boxGeometry args={[3.3, 0.06, 0.18]} />
        <meshStandardMaterial color={trimColor} roughness={0.36} metalness={0.78} />
      </mesh>

      {/* Dua Daun Pintu Simetris */}
      {[-0.72, 0.72].map((dx, di) => (
        <group key={di} position={[dx, 1.98, 0.08]}>
          {/* Badan Daun Pintu (Dark Walnut #392D25) */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.38, 3.82, 0.08]} />
            <meshStandardMaterial color="#392D25" roughness={0.5} metalness={0.1} />
          </mesh>

          {/* Lis Antique Gold Sekeliling Daun Pintu */}
          <mesh position={[0, 0, 0.042]}>
            <boxGeometry args={[1.22, 3.62, 0.01]} />
            <meshStandardMaterial
              color={trimColor}
              roughness={0.36}
              metalness={0.78}
              emissive={isHovered ? '#B2935D' : '#000000'}
              emissiveIntensity={isHovered ? 0.2 : 0}
            />
          </mesh>

          {/* Panel Atas Muted Navy (#23364F) */}
          <mesh position={[0, 0.65, 0.048]}>
            <boxGeometry args={[1.08, 1.85, 0.015]} />
            <meshStandardMaterial color="#23364F" roughness={0.44} metalness={0.16} />
          </mesh>

          {/* Panel Bawah Muted Navy (#23364F) */}
          <mesh position={[0, -0.88, 0.048]}>
            <boxGeometry args={[1.08, 1.3, 0.015]} />
            <meshStandardMaterial color="#23364F" roughness={0.44} metalness={0.16} />
          </mesh>

          {/* Gagang Pintu Antique Gold (#B2935D) */}
          <group position={[di === 0 ? 0.52 : -0.52, 0, 0.08]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
              <meshStandardMaterial color="#B2935D" roughness={0.32} metalness={0.82} />
            </mesh>
            {[-0.24, 0.24].map((hy, hi) => (
              <mesh key={hi} position={[0, hy, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.014, 0.014, 0.06, 12]} />
                <meshStandardMaterial color={trimColor} roughness={0.36} metalness={0.78} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* Lampu Sorot Warm White di Atas Pintu Saat Hover */}
      {isHovered && (
        <pointLight position={[0, 4.3, 1.2]} color="#fff6e8" intensity={2.0} distance={5} />
      )}
    </group>
  )
}
