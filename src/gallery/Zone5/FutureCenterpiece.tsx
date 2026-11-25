import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { VISION_BEACON_POS, NEURAL_CORE_POS } from './layout'
import zone5Data from './data/zone5.json'
import type { FutureLantern } from './types'

interface FutureCenterpieceProps {
  neuralPos?: [number, number, number]
  beaconPos?: [number, number, number]
  selectedId: string | null
  hoveredId?: string | null
  dawnFactor: number
  lanterns: FutureLantern[]
  isMobile?: boolean
  onSelect: (item: any) => void
  onHover: (id: string | null) => void
  onOpenMessageModal?: () => void
  onTriggerDawnClimax?: () => void
}

/**
 * SUMBU TENGAH UTAMA ZONA 5 — UNDIP FUTURE 2050
 * 1. AI Nexus & The Neural Brain Core (Z = -2.5)
 * 2. HERO: Vision Beacon & Horizon Gate 2050 (Z = -23.0)
 */
export function FutureCenterpiece({
  neuralPos = NEURAL_CORE_POS,
  beaconPos = VISION_BEACON_POS,
  selectedId,
  hoveredId,
  dawnFactor,
  lanterns,
  onSelect,
  onHover,
  onOpenMessageModal,
}: FutureCenterpieceProps) {
  const brainRef = useRef<THREE.Group>(null)
  const beaconRingsRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    if (brainRef.current) {
      brainRef.current.rotation.y = time * 0.5
      brainRef.current.position.y = 1.6 + Math.sin(time * 2.0) * 0.08
    }
    if (beaconRingsRef.current) {
      beaconRingsRef.current.rotation.y = time * 0.35
      beaconRingsRef.current.rotation.z = Math.sin(time * 0.5) * 0.1
    }
    // Lentera harapan melayang naik pelan
    lanterns.forEach((l) => {
      l.position[1] += delta * 0.3
      if (l.position[1] > 18.0) {
        l.position[1] = 2.0
      }
    })
  })

  const isBrainSelected = selectedId === 'ai-brain-hero'
  const isBrainHovered = hoveredId === 'ai-brain-hero'

  const isBeaconSelected = selectedId === 'vision-beacon-monument'
  const isBeaconHovered = hoveredId === 'vision-beacon-monument'

  return (
    <group>
      {/* ==============================================================
          1. AI NEXUS & THE NEURAL BRAIN CORE (Z = -2.5)
          ============================================================== */}
      <group
        position={neuralPos}
        onClick={(e) => {
          e.stopPropagation()
          onSelect({
            type: 'ai-nexus',
            data: {
              id: 'ai-brain-hero',
              title: zone5Data.aiNexus.title,
              category: 'aiNexus',
              subtitle: zone5Data.aiNexus.subtitle,
              description: 'Inti komputasi kognitif terpusat Universitas Diponegoro yang mengintegrasikan model deep learning biomedis, oseanografi pesisir, robotika otonom, dan pelestarian bahasa nusantara.',
              highlights: zone5Data.aiNexus.domains.map((d) => `${d.icon} ${d.name}: ${d.desc}`),
            },
          })
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover('ai-brain-hero')
        }}
        onPointerOut={() => onHover(null)}
      >
        {/* Dudukan Meja Marmer Bertingkat */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 0.6, 3.4]} />
          <meshStandardMaterial
            color={isBrainSelected ? '#1a2b4c' : isBrainHovered ? '#122038' : '#0B1F3A'}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.61, 0]}>
          <boxGeometry args={[4.46, 0.02, 3.46]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Plat Atas Kaca Hologram */}
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[1.3, 1.4, 0.12, 32]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} metalness={0.8} />
        </mesh>

        {/* The Neural Brain Hologram (Geometri Simbolik Bercahaya) */}
        <group ref={brainRef} position={[0, 1.6, 0]}>
          <mesh castShadow>
            <icosahedronGeometry args={[0.65, 2]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={0.65}
              wireframe
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.38, 16, 16]} />
            <meshBasicMaterial color="#ffd700" />
          </mesh>
          {/* Cincin Orbit Data */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.9, 0.02, 16, 48]} />
            <meshBasicMaterial color="#7fd1e8" />
          </mesh>
        </group>

        {/* Teks Penjelasan */}
        <Text position={[0, 0.35, 1.72]} fontSize={0.1} color="#ffd700" anchorX="center">
          ✦ THE NEURAL ATRIUM — AI RESEARCH CORE ✦
        </Text>
        <Text position={[0, 0.18, 1.72]} fontSize={0.075} color="#7fd1e8" anchorX="center">
          (Klik untuk menjelajahi 8 domain kecerdasan buatan & tanya AI)
        </Text>
      </group>

      {/* ==============================================================
          2. HERO: VISION BEACON & HORIZON GATE 2050 (Z = -23.0)
          ============================================================== */}
      <group
        position={beaconPos}
        onClick={(e) => {
          e.stopPropagation()
          onSelect({
            type: 'vision',
            data: {
              id: 'vision-beacon-monument',
              title: zone5Data.vision.title,
              category: 'vision',
              subtitle: zone5Data.vision.motto,
              description: zone5Data.vision.beaconCuratorText,
              stats: `Target Tahun: ${zone5Data.vision.targetYear} • Peradaban Mulia`,
              highlights: [
                'Visi Terpadu: Riset Unggul, Inovatif, Mandiri, Berorientasi Laut Tropis & Kebangsaan',
                'Simbol Sinar Emas: Kedaulatan Sains & Martabat Luhur Bangsa Indonesia',
                'Instalasi Pesan Pengunjung: Lentera Harapan Melayang Menuju Tahun 2050',
              ],
            },
          })
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover('vision-beacon-monument')
        }}
        onPointerOut={() => onHover(null)}
      >
        {/* Panggung Marmer Ivory Tiga Undakan */}
        {[
          { r: 4.8, h: 0.22, y: 0.11 },
          { r: 4.0, h: 0.22, y: 0.33 },
          { r: 3.2, h: 0.22, y: 0.55 },
        ].map((tier, ti) => (
          <group key={`beacon-tier-${ti}`}>
            <mesh position={[0, tier.y, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[tier.r, tier.r + 0.08, tier.h, 48]} />
              <meshStandardMaterial
                color={ti === 1 ? '#0B1F3A' : '#f7f2e6'}
                roughness={0.3}
                metalness={ti === 1 ? 0.4 : 0.1}
              />
            </mesh>
            <mesh position={[0, tier.y + tier.h / 2 + 0.005, 0]}>
              <cylinderGeometry args={[tier.r + 0.02, tier.r + 0.02, 0.015, 48]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Monumen Pilar Mercusuar Cahaya (Vision Beacon) */}
        <group position={[0, 0.66, 0]}>
          {/* Dudukan Silinder Marmer Navy */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.5, 1.8, 1.0, 36]} />
            <meshStandardMaterial
              color={isBeaconSelected ? '#1f2d48' : isBeaconHovered ? '#152238' : '#0B1F3A'}
              roughness={0.4}
              metalness={0.5}
            />
          </mesh>
          <mesh position={[0, 1.02, 0]}>
            <cylinderGeometry args={[1.55, 1.55, 0.04, 36]} />
            <meshStandardMaterial color="#c9a24b" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Pilar Kristal Cahaya Emas Vertikal */}
          <mesh position={[0, 3.8, 0]}>
            <cylinderGeometry args={[0.35, 0.45, 5.6, 24]} />
            <meshStandardMaterial
              color={dawnFactor > 0.5 ? '#FFD700' : '#E0E7FF'}
              emissive={dawnFactor > 0.5 ? '#FFD700' : '#38BDF8'}
              emissiveIntensity={0.8}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Cincin Putar Cahaya */}
          <group ref={beaconRingsRef} position={[0, 3.8, 0]}>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <torusGeometry args={[1.2, 0.04, 16, 48]} />
              <meshBasicMaterial color="#FFD700" />
            </mesh>
            <mesh rotation={[-Math.PI / 4, 0, 0]}>
              <torusGeometry args={[1.6, 0.03, 16, 48]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>

          {/* Teks Penanda Monumen */}
          <Text position={[0, 0.5, 1.85]} fontSize={0.11} color="#ffd700" anchorX="center">
            ✦ VISION BEACON & HORIZON GATE 2050 ✦
          </Text>
          <Text position={[0, 0.32, 1.85]} fontSize={0.08} color="#7fd1e8" anchorX="center">
            (Klik untuk membaca Visi 2050 atau terbangkan lentera harapan)
          </Text>
        </group>

        {/* Lentera-Lentera Harapan yang Melayang Naik (Glowing Emissive Material) */}
        {lanterns.map((l) => (
          <group key={l.id} position={[l.position[0] - 12.0, l.position[1], l.position[2]]}>
            <mesh>
              <boxGeometry args={[0.3, 0.42, 0.3]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FFA500"
                emissiveIntensity={1.8}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        ))}

        {/* Tombol Terbangkan Lentera Harapan di Lantai Depan Monumen */}
        <group
          position={[0, 0.72, 2.6]}
          onClick={(e) => {
            e.stopPropagation()
            onOpenMessageModal?.()
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.6, 0.6]} />
            <meshStandardMaterial color="#c9a24b" roughness={0.3} metalness={0.8} />
          </mesh>
          <Text position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.1} color="#0b1f3a" anchorX="center">
            ✉ Tulis Pesan untuk Masa Depan 2050
          </Text>
        </group>
      </group>
    </group>
  )
}
