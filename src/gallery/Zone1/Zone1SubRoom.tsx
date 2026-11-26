import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import type { Founder, HistoryExhibit } from './data/exhibits'
import { createFloorTexture } from './textures'
import { FounderCard } from './FoundersWing'
import { SalonItem } from './HistoryArchivesWing'
import { PortalDoor } from './PortalDoor'
import { CeilingRoof } from './CeilingRoof'
import {
  computeSubRoomDimensions,
  getRoomExhibits,
  type RoofStyle,
  type Zone1PortalDoor,
} from './subRooms'

interface Zone1SubRoomProps {
  portal: Zone1PortalDoor
  selectedFounderId: string | null
  selectedHistoryId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelectFounder: (founder: Founder) => void
  onSelectHistory: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
  onExitRoom: () => void
}

/**
 * Lampu Hias Dinding (Picture Accent Lamp) di atas setiap bingkai pameran
 * Memberikan pendar cahaya hangat lembut (low-light soft warm ambient).
 */
function PictureAccentLamp({
  position,
  rotationY,
  isMobile = false,
}: {
  position: [number, number, number]
  rotationY: number
  isMobile?: boolean
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Dudukan Dinding Emas */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.16, 0.07, 0.04]} />
        <meshStandardMaterial color="#b89438" roughness={0.35} metalness={0.82} />
      </mesh>
      {/* Tangkai Lengan Lampu */}
      <mesh position={[0, 0.02, 0.14]}>
        <boxGeometry args={[0.035, 0.03, 0.24]} />
        <meshStandardMaterial color="#c8a248" roughness={0.32} metalness={0.85} />
      </mesh>
      {/* Kap Lampu Hias Memanjang */}
      <mesh position={[0, 0.01, 0.27]}>
        <boxGeometry args={[0.72, 0.055, 0.11]} />
        <meshStandardMaterial color="#c8a248" roughness={0.3} metalness={0.86} />
      </mesh>
      {/* Strip Bohlam Hangat Menyala */}
      <mesh position={[0, -0.02, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.64, 0.07]} />
        <meshStandardMaterial
          color="#fff4d6"
          emissive="#ffdc94"
          emissiveIntensity={3.4}
          roughness={0.2}
        />
      </mesh>
      {/* Pendar Cahaya Hangat Lembut Menyinari Bingkai di Bawahnya */}
      {!isMobile && (
        <pointLight
          position={[0, -0.18, 0.34]}
          color="#ffdf9e"
          intensity={2.4}
          distance={4.2}
          decay={1.8}
        />
      )}
    </group>
  )
}

/**
 * 5 Gaya Atap Berbeda Per Ruangan Sub-Bab
 * Mempertahankan tema warna Navy, Gold, Ivory, & Heritage Brown.
 */
function SubRoomCeiling({
  style,
  halfWidth,
  length,
  height,
  isMobile = false,
}: {
  style: RoofStyle
  halfWidth: number
  length: number
  height: number
  isMobile?: boolean
}) {
  const fullWidth = halfWidth * 2

  if (style === 'labyrinth-pvc') {
    return (
      <CeilingRoof
        isMobile={isMobile}
        halfWidth={halfWidth}
        height={height}
        length={length}
        centerZ={0}
        zFront={length / 2}
        zBack={-length / 2}
        showChandeliers={false}
      />
    )
  }

  if (style === 'octagon-dome') {
    return (
      <group>
        <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[fullWidth, length]} />
          <meshStandardMaterial color="#f8f5ee" roughness={0.65} metalness={0.05} />
        </mesh>
        {/* Stepped Royal Dome Skylight */}
        <mesh position={[0, height - 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.4, 4.2, 8]} />
          <meshStandardMaterial color="#142e56" roughness={0.5} />
        </mesh>
        <mesh position={[0, height - 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.3, 2.5, 8]} />
          <meshStandardMaterial color="#d4af37" roughness={0.25} metalness={0.88} />
        </mesh>
        <mesh position={[0, height - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.3, 8]} />
          <meshStandardMaterial color="#fff7e2" emissive="#ffd999" emissiveIntensity={0.85} />
        </mesh>
      </group>
    )
  }

  if (style === 'coffered-pvc') {
    const bayWidth = Math.min(fullWidth - 1.6, 6.8)
    const bayLength = Math.max(6.0, length - 4.0)
    return (
      <group position={[0, height, 0]}>
        {/* Base PVC Ivory Ceiling */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[fullWidth, length]} />
          <meshStandardMaterial color="#f8f5ee" roughness={0.65} metalness={0.05} />
        </mesh>

        {/* Perimeter Heritage Brown & Gold Crown Molding */}
        {[-1, 1].map((side) => (
          <group key={`c4-crown-${side}`}>
            <mesh position={[side * (halfWidth - 0.08), -0.12, 0]}>
              <boxGeometry args={[0.16, 0.24, length]} />
              <meshStandardMaterial color="#3d2516" roughness={0.5} metalness={0.12} />
            </mesh>
            <mesh position={[side * (halfWidth - 0.17), -0.22, 0]}>
              <boxGeometry args={[0.03, 0.05, length]} />
              <meshStandardMaterial color="#d4af37" roughness={0.28} metalness={0.88} />
            </mesh>
          </group>
        ))}

        {/* Drop-Ceiling Rectangular Coffer Frame (PVC Ivory) */}
        {[-1, 1].map((s) => (
          <mesh key={`c4-side-${s}`} position={[s * (bayWidth / 2 + 0.35), -0.16, 0]} castShadow>
            <boxGeometry args={[0.7, 0.32, bayLength + 1.4]} />
            <meshStandardMaterial color="#f5f0e4" roughness={0.6} metalness={0.05} />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={`c4-end-${s}`} position={[0, -0.16, s * (bayLength / 2 + 0.35)]} castShadow>
            <boxGeometry args={[bayWidth + 1.4, 0.32, 0.7]} />
            <meshStandardMaterial color="#f5f0e4" roughness={0.6} metalness={0.05} />
          </mesh>
        ))}

        {/* Inner Stepped PVC Ivory Panel & Hidden Cove LED */}
        {[-1, 1].map((s) => (
          <mesh key={`c4-cove-s-${s}`} position={[s * (bayWidth / 2 + 0.02), -0.06, 0]}>
            <boxGeometry args={[0.04, 0.04, bayLength]} />
            <meshStandardMaterial color="#fffdf5" emissive="#fff4dc" emissiveIntensity={3.2} roughness={0.3} />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={`c4-cove-e-${s}`} position={[0, -0.06, s * (bayLength / 2 + 0.02)]}>
            <boxGeometry args={[bayWidth, 0.04, 0.04]} />
            <meshStandardMaterial color="#fffdf5" emissive="#fff4dc" emissiveIntensity={3.2} roughness={0.3} />
          </mesh>
        ))}

        {/* Clean Center PVC Ivory Coffer Panel (Tanpa Motif Berlian & Tanpa Chandelier) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} receiveShadow={!isMobile}>
          <planeGeometry args={[bayWidth, bayLength]} />
          <meshStandardMaterial color="#fcfaf5" roughness={0.55} metalness={0.08} />
        </mesh>

        {/* Gold Trim Lining */}
        {[-1, 1].map((s) => (
          <mesh key={`c4-gold-s-${s}`} position={[s * (bayWidth / 2 - 0.12), -0.28, 0]}>
            <boxGeometry args={[0.04, 0.04, bayLength - 0.2]} />
            <meshStandardMaterial color="#d4af37" roughness={0.28} metalness={0.88} />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={`c4-gold-e-${s}`} position={[0, -0.28, s * (bayLength / 2 - 0.12)]}>
            <boxGeometry args={[bayWidth - 0.2, 0.04, 0.04]} />
            <meshStandardMaterial color="#d4af37" roughness={0.28} metalness={0.88} />
          </mesh>
        ))}
      </group>
    )
  }

  if (style === 'radial-dome') {
    const spokeAngles = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6)
    return (
      <group>
        <mesh position={[0, height + 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[fullWidth, length]} />
          <meshStandardMaterial color="#f8f5ee" roughness={0.65} metalness={0.05} />
        </mesh>
        {/* Kubah Radial Muladi Dome */}
        <mesh position={[0, height - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[Math.min(halfWidth - 0.8, 4.6), 32]} />
          <meshStandardMaterial color="#fff5db" emissive="#ffd98e" emissiveIntensity={0.75} />
        </mesh>
        <mesh position={[0, height - 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.min(halfWidth - 0.9, 4.5), Math.min(halfWidth - 0.6, 4.8), 32]} />
          <meshStandardMaterial color="#d4af37" roughness={0.24} metalness={0.9} />
        </mesh>
        {spokeAngles.map((angle, idx) => (
          <mesh key={idx} position={[0, height - 0.1, 0]} rotation={[0, angle, 0]}>
            <boxGeometry args={[Math.min(fullWidth - 1.5, 9.2), 0.14, 0.1]} />
            <meshStandardMaterial color="#d4af37" roughness={0.28} metalness={0.85} />
          </mesh>
        ))}
      </group>
    )
  }

  // Default: 'coffered-skylight'
  const panelCount = Math.max(3, Math.floor(length / 4.2))
  return (
    <group>
      <mesh position={[0, height + 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[fullWidth, length]} />
        <meshStandardMaterial color="#f8f5ee" roughness={0.65} metalness={0.05} />
      </mesh>
      {Array.from({ length: panelCount }, (_, i) => {
        const z = -length / 2 + 2.4 + i * ((length - 4.8) / Math.max(1, panelCount - 1))
        return (
          <group key={i} position={[0, height - 0.02, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[fullWidth * 0.56, 2.3]} />
              <meshStandardMaterial color="#fff7e2" emissive="#ffe4a8" emissiveIntensity={0.68} />
            </mesh>
            <mesh position={[0, -0.05, 1.2]}>
              <boxGeometry args={[fullWidth * 0.6, 0.12, 0.1]} />
              <meshStandardMaterial color="#d4af37" roughness={0.28} metalness={0.85} />
            </mesh>
            <mesh position={[0, -0.05, -1.2]}>
              <boxGeometry args={[fullWidth * 0.6, 0.12, 0.1]} />
              <meshStandardMaterial color="#d4af37" roughness={0.28} metalness={0.85} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/**
 * Ruangan Sub-Bab Dinamis Zona 1:
 * Tema dan palet warna seragam dengan Base Zone, dimensi menyesuaikan jumlah arsip,
 * dan memiliki gaya atap tersendiri.
 */
export function Zone1SubRoom({
  portal,
  selectedFounderId,
  selectedHistoryId,
  hoveredId,
  isMobile = false,
  onSelectFounder,
  onSelectHistory,
  onHover,
  onExitRoom,
}: Zone1SubRoomProps) {
  const { founders, histories } = useMemo(() => getRoomExhibits(portal), [portal])
  const totalItems = founders.length + histories.length
  const dims = useMemo(() => computeSubRoomDimensions(totalItems), [totalItems])

  const floorTexture = useMemo(() => {
    const tex = createFloorTexture()
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(Math.round(dims.halfWidth), Math.round(dims.length / 2.2))
    return tex
  }, [dims.halfWidth, dims.length])

  // Distribusikan seluruh koleksi secara berimbang di sisi kiri & kanan dinding
  const placedItems = useMemo(() => {
    const combined: Array<
      | { kind: 'founder'; item: Founder; index: number }
      | { kind: 'history'; item: HistoryExhibit; index: number }
    > = [
      ...founders.map((f, i) => ({ kind: 'founder' as const, item: f, index: i })),
      ...histories.map((h, i) => ({ kind: 'history' as const, item: h, index: i })),
    ]

    const leftCount = Math.ceil(combined.length / 2)
    const rightCount = combined.length - leftCount

    const zStart = dims.zFront - 4.0
    const zEnd = dims.zBack + 3.4
    const span = Math.max(4, zStart - zEnd)

    return combined.map((entry, idx) => {
      const isLeft = idx < leftCount
      const sideIdx = isLeft ? idx : idx - leftCount
      const sideTotal = isLeft ? leftCount : rightCount
      const t = sideTotal <= 1 ? 0.5 : sideIdx / (sideTotal - 1)
      const z = zStart - t * span
      const x = isLeft ? -(dims.halfWidth - 0.16) : dims.halfWidth - 0.16
      const rotY = isLeft ? Math.PI / 2 : -Math.PI / 2

      return { ...entry, position: [x, 2.75, z] as [number, number, number], rotationY: rotY }
    })
  }, [founders, histories, dims.halfWidth, dims.zFront, dims.zBack])

  // Hitung posisi lampu plafon LED menyala di sepanjang tengah ruangan
  const ceilingLightZs = useMemo(() => {
    const count = Math.max(2, Math.floor(dims.length / 5.5))
    return Array.from({ length: count }, (_, i) => {
      const t = count === 1 ? 0.5 : i / (count - 1)
      return dims.zFront - 3.2 - t * (dims.length - 6.4)
    })
  }, [dims.length, dims.zFront])

  return (
    <group>
      {/* Pencahayaan Low-Light Soft Warm Ambient */}
      <ambientLight intensity={0.82} color="#ffe9c8" />
      <hemisphereLight args={['#fff3db', '#bfa98a', 0.52]} />
      <directionalLight position={[4, dims.height + 2, 6]} intensity={0.42} color="#ffefd4" />

      {/* Panel Lampu Plafon LED Lembut Hangat */}
      {ceilingLightZs.map((lz, idx) => (
        <group key={`ceil-led-${idx}`} position={[0, dims.height - 0.04, lz]}>
          {/* Bingkai Gelap Tipis Panel Lampu */}
          <mesh>
            <boxGeometry args={[2.35, 0.06, 1.55]} />
            <meshStandardMaterial color="#23272e" roughness={0.5} />
          </mesh>
          {/* Panel LED Putih Hangat Lembut */}
          <mesh position={[0, -0.032, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.18, 1.38]} />
            <meshStandardMaterial
              color="#fff6e3"
              emissive="#ffe7ba"
              emissiveIntensity={2.8}
              roughness={0.2}
            />
          </mesh>
          {!isMobile && (
            <pointLight
              position={[0, -0.65, 0]}
              color="#ffe9c6"
              intensity={6.5}
              distance={20}
              decay={1.6}
            />
          )}
        </group>
      ))}

      {/* 1. Lantai Marmer Matte (Tidak Terlalu Terang / Anti-Silau) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[dims.halfWidth * 2, dims.length]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#b8b0a2"
          roughness={0.94}
          metalness={0}
        />
      </mesh>

      {/* Karpet Merah Tengah */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <planeGeometry args={[2.8, dims.length - 1.6]} />
        <meshStandardMaterial color="#7c1a22" roughness={0.92} metalness={0} />
      </mesh>
      {[-1.42, 1.42].map((rx, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[rx, 0.018, 0]}>
          <planeGeometry args={[0.06, dims.length - 1.6]} />
          <meshStandardMaterial color="#d4af37" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* 2. Dinding Kiri & Kanan (Perpaduan Blue Navy Bawah & Putih Ivory Atas - Matte) */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * dims.halfWidth, 2.12, 0]}
            rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
            receiveShadow
          >
            <planeGeometry args={[dims.length, 4.24]} />
            <meshStandardMaterial color="#142e56" roughness={1} metalness={0} />
          </mesh>
          <mesh
            position={[side * dims.halfWidth, 4.24 + (dims.height - 4.24) / 2, 0]}
            rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
            receiveShadow
          >
            <planeGeometry args={[dims.length, dims.height - 4.24]} />
            <meshStandardMaterial color="#dcd5c7" roughness={1} metalness={0} />
          </mesh>
          <mesh position={[side * (dims.halfWidth - 0.05), 0.1, 0]}>
            <boxGeometry args={[0.1, 0.2, dims.length]} />
            <meshStandardMaterial color="#2c1a0e" roughness={0.85} metalness={0} />
          </mesh>
          <mesh position={[side * (dims.halfWidth - 0.04), 0.55, 0]} receiveShadow>
            <boxGeometry args={[0.08, 0.7, dims.length]} />
            <meshStandardMaterial color="#3d2516" roughness={0.85} metalness={0} />
          </mesh>
          <mesh position={[side * (dims.halfWidth - 0.06), 0.92, 0]}>
            <boxGeometry args={[0.12, 0.06, dims.length]} />
            <meshStandardMaterial color="#d4af37" roughness={0.4} metalness={0.75} />
          </mesh>
        </group>
      ))}

      {/* 3. Dinding Depan (Pintu Keluar ke Base Zone - Matte Ivory) */}
      <mesh position={[0, dims.height / 2, dims.zFront]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[dims.halfWidth * 2, dims.height]} />
        <meshStandardMaterial color="#dcd5c7" roughness={1} metalness={0} />
      </mesh>

      {/* 4. Dinding Belakang Fokus (Royal Navy Matte + Judul Ruangan) */}
      <mesh position={[0, dims.height / 2, dims.zBack]} receiveShadow>
        <planeGeometry args={[dims.halfWidth * 2, dims.height]} />
        <meshStandardMaterial color="#142e56" roughness={1} metalness={0} />
      </mesh>
      <group position={[0, 3.8, dims.zBack + 0.08]}>
        <Text
          position={[0, 0.55, 0]}
          fontSize={0.22}
          letterSpacing={0.15}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
        >
          {portal.doorNumber}
        </Text>
        <Text
          position={[0, 0.05, 0]}
          fontSize={0.44}
          fontWeight={700}
          color="#fdfbf7"
          anchorX="center"
          anchorY="middle"
          maxWidth={dims.halfWidth * 1.5}
          textAlign="center"
        >
          {portal.title}
        </Text>
        <Text
          position={[0, -0.48, 0]}
          fontSize={0.2}
          color="#d9e2ec"
          anchorX="center"
          anchorY="middle"
          maxWidth={dims.halfWidth * 1.5}
          textAlign="center"
        >
          {portal.subtitle}
        </Text>
      </group>

      {/* 5. Atap Khas Ruangan Sub-Bab */}
      <SubRoomCeiling
        style={portal.roofStyle}
        halfWidth={dims.halfWidth}
        length={dims.length}
        height={dims.height}
        isMobile={isMobile}
      />

      {/* 6. Pintu Keluar Kembali ke Aula Utama Base Zone */}
      <PortalDoor
        id="exit-to-base-zone"
        doorNumber="KELUAR"
        title="Kembali ke Aula Utama"
        subtitle="Base Zone 1"
        position={[0, 0, dims.zFront - 0.04]}
        rotationY={Math.PI}
        isHovered={hoveredId === 'exit-to-base-zone'}
        onSelect={onExitRoom}
        onHover={onHover}
        variant="exit"
      />

      {/* 7. Bingkai Koleksi & Arsip + Lampu Hias di Atasnya */}
      {placedItems.map((entry) => {
        const lampPos: [number, number, number] = [
          entry.position[0],
          entry.position[1] + 0.92,
          entry.position[2],
        ]

        if (entry.kind === 'founder') {
          return (
            <group key={entry.item.id}>
              <PictureAccentLamp
                position={lampPos}
                rotationY={entry.rotationY}
                isMobile={isMobile}
              />
              <FounderCard
                founder={entry.item}
                index={entry.index}
                position={entry.position}
                rotationY={entry.rotationY}
                isMainFounder={entry.item.category === 'pendiri-utama'}
                isSelected={selectedFounderId === entry.item.id}
                isHovered={hoveredId === entry.item.id}
                isMobile={isMobile}
                onSelect={onSelectFounder}
                onHover={onHover}
              />
            </group>
          )
        }

        return (
          <group key={entry.item.id}>
            <PictureAccentLamp
              position={lampPos}
              rotationY={entry.rotationY}
              isMobile={isMobile}
            />
            <SalonItem
              config={{
                exhibitId: entry.item.id,
                z: entry.position[2],
                y: entry.position[1],
                width: 1.55,
                height: 1.35,
                frameColor: '#d4af37',
              }}
              exhibit={entry.item}
              position={entry.position}
              rotationY={entry.rotationY}
              isSelected={selectedHistoryId === entry.item.id}
              isHovered={hoveredId === entry.item.id}
              isMobile={isMobile}
              onSelect={onSelectHistory}
              onHover={onHover}
            />
          </group>
        )
      })}
    </group>
  )
}
