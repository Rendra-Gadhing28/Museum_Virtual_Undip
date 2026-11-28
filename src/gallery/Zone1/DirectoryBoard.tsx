import { useMemo } from 'react'
import * as THREE from 'three'
import { createProceduralRoughnessMap, QUALITY } from '../graphics'

interface DirectoryBoardProps {
  position: [number, number, number]
  rotationY?: number
  isNear: boolean
}

function createDirectoryTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 1000
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  // Muted Navy Blue board (#23364F)
  ctx.fillStyle = '#23364F'
  ctx.fillRect(0, 0, 800, 1000)

  // Antique Gold Double Borders (#B2935D)
  ctx.strokeStyle = '#B2935D'
  ctx.lineWidth = 6
  ctx.strokeRect(20, 20, 760, 960)
  ctx.strokeStyle = 'rgba(178, 147, 93, 0.45)'
  ctx.lineWidth = 2
  ctx.strokeRect(32, 32, 736, 936)

  // Header Title
  ctx.textAlign = 'center'
  ctx.fillStyle = '#B2935D'
  ctx.font = 'bold 26px sans-serif'
  ctx.fillText('PANDUAN & DIREKTORI MUSEUM', 400, 90)

  ctx.fillStyle = '#E9E1D3'
  ctx.font = 'bold 36px Georgia, serif'
  ctx.fillText('UNIVERSITAS DIPONEGORO', 400, 145)

  ctx.fillStyle = '#E9E1D3'
  ctx.font = 'italic 18px Georgia, serif'
  ctx.fillText('Denah Tata Letak Base Zone 1 (Formasi 3 — 2)', 400, 185)

  // Antique Gold separator
  ctx.fillStyle = '#B2935D'
  ctx.fillRect(80, 215, 640, 3)

  // Illustrated Mini Floorplan of Base Zone 1 (5 Doors: 3 Left, 2 Right)
  ctx.fillStyle = '#1B2B40'
  ctx.fillRect(100, 245, 600, 330)
  ctx.strokeStyle = '#B2935D'
  ctx.lineWidth = 2
  ctx.strokeRect(100, 245, 600, 330)

  // Left Wall 3 Doors (top=R.03 back, mid=R.02, bottom=R.01 front)
  const leftRooms = [
    { label: 'RUANG 03', sub: 'Galeri Rektorat', y: 265 },
    { label: 'RUANG 02', sub: 'Penegerian 1960', y: 365 },
    { label: 'RUANG 01', sub: 'Pendiri & Yayasan', y: 465 },
  ]
  leftRooms.forEach((r) => {
    ctx.fillStyle = '#23364F'
    ctx.fillRect(118, r.y, 172, 82)
    ctx.strokeStyle = '#B2935D'
    ctx.lineWidth = 2
    ctx.strokeRect(118, r.y, 172, 82)
    ctx.fillStyle = '#B2935D'
    ctx.font = 'bold 15px sans-serif'
    ctx.fillText(r.label, 204, r.y + 34)
    ctx.fillStyle = '#E9E1D3'
    ctx.font = '13px sans-serif'
    ctx.fillText(r.sub, 204, r.y + 58)
  })

  // Right Wall 2 Doors (upper=R.05, lower=R.04)
  const rightRooms = [
    { label: 'RUANG 05', sub: 'Muladi Dome', y: 305 },
    { label: 'RUANG 04', sub: 'Kampus Fisik', y: 425 },
  ]
  rightRooms.forEach((r) => {
    ctx.fillStyle = '#23364F'
    ctx.fillRect(510, r.y, 172, 92)
    ctx.strokeStyle = '#B2935D'
    ctx.lineWidth = 2
    ctx.strokeRect(510, r.y, 172, 92)
    ctx.fillStyle = '#B2935D'
    ctx.font = 'bold 15px sans-serif'
    ctx.fillText(r.label, 596, r.y + 38)
    ctx.fillStyle = '#E9E1D3'
    ctx.font = '13px sans-serif'
    ctx.fillText(r.sub, 596, r.y + 64)
  })

  // Floorplan Deep Burgundy Carpet (#672C35) & Center
  ctx.fillStyle = '#672C35'
  ctx.fillRect(365, 265, 70, 290)
  ctx.strokeStyle = '#B2935D'
  ctx.lineWidth = 1.5
  ctx.strokeRect(365, 265, 70, 290)
  ctx.fillStyle = '#E9E1D3'
  ctx.font = 'bold 12px sans-serif'
  ctx.fillText('Karpet', 400, 445)
  ctx.fillText('Burgundy', 400, 463)

  // Podium & Prasasti box at back
  ctx.fillStyle = '#B2935D'
  ctx.fillRect(352, 272, 96, 44)
  ctx.fillStyle = '#23364F'
  ctx.font = 'bold 11px sans-serif'
  ctx.fillText('Podium &', 400, 290)
  ctx.fillText('Prasasti', 400, 305)

  // Visitor Spawn marker
  ctx.fillStyle = '#B2935D'
  ctx.beginPath()
  ctx.arc(400, 528, 12, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#23364F'
  ctx.font = 'bold 10px sans-serif'
  ctx.fillText('ANDA', 400, 532)

  // Directory List
  ctx.textAlign = 'left'
  ctx.fillStyle = '#B2935D'
  ctx.font = 'bold 21px Georgia, serif'
  ctx.fillText('Daftar Ruangan Pameran Zona 1:', 95, 615)

  const items = [
    '✦ Ruang 01 (Kiri): Arsip Pendiri & Yayasan (Pancamitra 1956)',
    '✦ Ruang 02 (Kiri): Penegerian & Pidato Presiden Soekarno (1960)',
    '✦ Ruang 03 (Kiri): Galeri Rektorat & 13 Pimpinan Undip',
    '✦ Ruang 04 (Kanan): Transformasi Kampus Pleburan – Tembalang',
    '✦ Ruang 05 (Kanan): Cetak Biru & Linimasa Gedung Muladi Dome',
  ]

  ctx.fillStyle = '#E9E1D3'
  ctx.font = '15.5px system-ui, sans-serif'
  items.forEach((item, idx) => {
    ctx.fillText(item, 95, 654 + idx * 38)
  })

  // Bottom prompt callout
  ctx.fillStyle = 'rgba(178, 147, 93, 0.14)'
  ctx.fillRect(80, 868, 640, 74)
  ctx.strokeStyle = '#B2935D'
  ctx.lineWidth = 1.5
  ctx.strokeRect(80, 868, 640, 74)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#E9E1D3'
  ctx.font = 'bold 18px sans-serif'
  ctx.fillText('Klik pintu ruangan di dinding kiri atau kanan untuk masuk', 400, 912)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * 3D Standing Directory Board (Papan Petunjuk Arah)
 * Triggers the "Mau kemana??" navigation tab popup when the visitor walks close to it.
 */
export function DirectoryBoard({
  position,
  rotationY = 0,
  isNear,
}: DirectoryBoardProps) {
  const texture = useMemo(() => createDirectoryTexture(), [])

  const materials = useMemo(() => {
    const boardRough = createProceduralRoughnessMap(0.45, 0.18)
    return {
      heritageWood: new THREE.MeshStandardMaterial({
        color: '#392D25',
        roughness: 0.5,
        metalness: 0.1,
      }),
      goldTrim: new THREE.MeshStandardMaterial({
        color: isNear ? '#C6A870' : '#B2935D',
        emissive: isNear ? '#B2935D' : '#000000',
        emissiveIntensity: isNear ? 0.22 : 0,
        roughness: 0.36,
        metalness: 0.78,
        roughnessMap: QUALITY.current.physicalMaterials ? boardRough : null,
      }),
      navyBacking: new THREE.MeshStandardMaterial({
        color: '#23364F',
        roughness: 0.5,
      }),
      lampWarm: new THREE.MeshStandardMaterial({
        color: '#fffaf2',
        emissive: '#fff6e8',
        emissiveIntensity: 1.8,
      }),
    }
  }, [isNear])

  const bw = 1.4 // board width
  const bh = 1.7 // board height

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Base Stand Plinth (Heritage Brown & Gold) */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.1, 0.7]} />
        <primitive object={materials.heritageWood} attach="material" />
      </mesh>
      <mesh position={[0, 0.105, 0]}>
        <boxGeometry args={[1.06, 0.02, 0.66]} />
        <primitive object={materials.goldTrim} attach="material" />
      </mesh>

      {/* 2. Dual Supporting Posts */}
      {[-0.32, 0.32].map((px, pi) => (
        <mesh key={pi} position={[px, 0.68, 0]} castShadow>
          <boxGeometry args={[0.07, 1.15, 0.07]} />
          <primitive object={materials.heritageWood} attach="material" />
        </mesh>
      ))}

      {/* 3. Angled Display Board Enclosure */}
      <group position={[0, 1.48, 0.06]} rotation={[-0.22, 0, 0]}>
        {/* Rear enclosure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[bw + 0.08, bh + 0.08, 0.08]} />
          <primitive object={materials.heritageWood} attach="material" />
        </mesh>

        {/* Gold Border Rim */}
        <mesh position={[0, 0, 0.035]}>
          <boxGeometry args={[bw + 0.02, bh + 0.02, 0.03]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>

        {/* Printed Directory Canvas */}
        <mesh position={[0, 0, 0.052]}>
          <planeGeometry args={[bw - 0.04, bh - 0.04]} />
          <meshStandardMaterial map={texture} roughness={0.6} />
        </mesh>

        {/* Overhead Spot Sconce on Board */}
        <group position={[0, bh / 2 + 0.18, 0.12]}>
          <mesh rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.22, 12]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
          <mesh position={[0, -0.06, 0.08]} rotation={[-0.8, 0, 0]}>
            <boxGeometry args={[0.34, 0.06, 0.1]} />
            <primitive object={materials.heritageWood} attach="material" />
          </mesh>
          <mesh position={[0, -0.08, 0.08]} rotation={[-0.8, 0, 0]}>
            <planeGeometry args={[0.3, 0.06]} />
            <primitive object={materials.lampWarm} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Proximity Halo Glow on floor when visitor is near */}
      {isNear && (
        <mesh position={[0, 0.015, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.96, 32]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}
