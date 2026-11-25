import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { createSteleInscriptionTexture } from './textures'
import { PRASASTI_HERO_POS, HERITAGE_TABLE_POS } from './layout'
import zone3Data from './data/zone3.json'

interface HeritageCenterpieceProps {
  selectedId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelect: (item: any) => void
  onHover: (id: string | null) => void
}

/**
 * SUMBU TENGAH UTAMA ZONA 3 — THE HERITAGE OF UNDIP
 * 1. Meja Pusaka & Lambang Kehormatan Pangeran Diponegoro (Z = -2.5)
 * 2. HERO: Plaza Prasasti Monumental Peresmian 1957 & 1960 (Z = -21.0)
 */
export function HeritageCenterpiece({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: HeritageCenterpieceProps) {
  const ringRef = useRef<THREE.Mesh>(null)

  const inscriptionTexture = useMemo(
    () => createSteleInscriptionTexture(zone3Data.inscription),
    []
  )

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.4
    }
  })

  const isPrasastiSelected = selectedId === 'hero-inscription-stele'
  const isPrasastiHovered = hoveredId === 'hero-inscription-stele'

  const isHeritageTableSelected = selectedId === 'heritage-emblem-center'
  const isHeritageTableHovered = hoveredId === 'heritage-emblem-center'

  return (
    <group>
      {/* ==============================================================
          1. MEJA PUSAKA & LAMBANG DIPONEGORO DI SUMBU TENGAH (Z = -2.5)
          ============================================================== */}
      <group
        position={HERITAGE_TABLE_POS}
        onClick={(e) => {
          e.stopPropagation()
          onSelect({
            type: 'heritage-table',
            data: {
              id: 'heritage-emblem-center',
              title: 'Pusaka Lambang Kehormatan Pangeran Diponegoro',
              category: 'Pusaka Kehormatan',
              year: '1960',
              description: 'Patung dada relief dan lambang resmi Pangeran Diponegoro yang dianugerahkan oleh Presiden Sukarno pada Dies Natalis III, melambangkan watak ksatria, kejujuran ilmiah, dan keberanian membela keadilan rakyat.',
              highlights: [
                'Bahan: Perunggu Tempa Bersepuh Emas Murni 24 Karat',
                'Simbol Keris & Sorban: Keteguhan Iman dan Jiwa Kepahlawanan',
                'Diresmikan Bersama Penetapan Nama Universitas Diponegoro',
              ],
            },
          })
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover('heritage-emblem-center')
        }}
        onPointerOut={() => onHover(null)}
      >
        {/* Undakan Meja Marmer Hitam Bertingkat */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.5, 3.2]} />
          <meshStandardMaterial
            color={isHeritageTableSelected ? '#2e2515' : isHeritageTableHovered ? '#1f1b14' : '#141416'}
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.51, 0]}>
          <boxGeometry args={[4.26, 0.02, 3.26]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Tingkat Kedua Marmer Ivory */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.26, 2.6]} />
          <meshStandardMaterial color="#f7f2e6" roughness={0.3} />
        </mesh>

        {/* Relief Lambang Emas Pangeran Diponegoro */}
        <group position={[0, 0.85, 0]}>
          {/* Piringan Medali Emas */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.9, 0.9, 0.08, 36]} />
            <meshStandardMaterial color="#ffd700" metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Sorban & Siluet Simbolik */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 0.45, 24]} />
            <meshStandardMaterial color="#c9a24b" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>

        {/* Teks Penjelasan Plinth */}
        <Text position={[0, 0.32, 1.62]} fontSize={0.1} color="#ffd700" anchorX="center">
          PUSAKA LAMBANG KEHORMATAN DIPONEGORO
        </Text>
        <Text position={[0, 0.18, 1.62]} fontSize={0.075} color="#cbd5e1" anchorX="center">
          (Klik untuk membaca naskah kuratorial pusaka)
        </Text>
      </group>

      {/* ==============================================================
          2. HERO: PLAZA PRASASTI MONUMENTAL PERESMIAN (Z = -21.0)
          ============================================================== */}
      <group
        position={PRASASTI_HERO_POS}
        onClick={(e) => {
          e.stopPropagation()
          onSelect({ type: 'inscription', data: zone3Data.inscription })
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover('hero-inscription-stele')
        }}
        onPointerOut={() => onHover(null)}
      >
        {/* Panggung Lingkaran Marmer Bertingkat Tiga */}
        {[
          { r: 4.8, h: 0.22, y: 0.11 },
          { r: 4.0, h: 0.22, y: 0.33 },
          { r: 3.2, h: 0.22, y: 0.55 },
        ].map((tier, ti) => (
          <group key={`prasasti-tier-${ti}`}>
            <mesh position={[0, tier.y, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[tier.r, tier.r + 0.08, tier.h, 48]} />
              <meshStandardMaterial
                color={ti === 1 ? '#0B1F3A' : '#f7f2e6'}
                roughness={0.3}
                metalness={ti === 1 ? 0.3 : 0.1}
              />
            </mesh>
            {/* Lis Emas Tepian Lingkaran */}
            <mesh position={[0, tier.y + tier.h / 2 + 0.005, 0]}>
              <cylinderGeometry args={[tier.r + 0.02, tier.r + 0.02, 0.015, 48]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Ring Cahaya Emas di Atas Panggung */}
        <mesh ref={ringRef} position={[0, 0.67, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 2.95, 48]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.65} />
        </mesh>

        {/* ==============================================================
            MONUMEN PRASASTI BATU ANDESIT HITAM BERUKIR EMAS MURNI
            Tinggi 4.8m x Lebar 2.6m x Tebal 0.45m
            ============================================================== */}
        <group position={[0, 0.66, 0]}>
          {/* Dudukan Dasar Prasasti */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.0, 0.4, 1.2]} />
            <meshStandardMaterial color="#1a1a1c" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.41, 0]}>
            <boxGeometry args={[3.06, 0.03, 1.26]} />
            <meshStandardMaterial color="#c9a24b" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Batu Andesit Utama */}
          <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.6, 4.4, 0.42]} />
            <meshStandardMaterial
              color={isPrasastiSelected ? '#252528' : isPrasastiHovered ? '#1c1c1e' : '#141416'}
              roughness={0.65}
              metalness={0.15}
            />
          </mesh>

          {/* Plat Permukaan Tekstur Ukiran Emas Prasasti */}
          <mesh position={[0, 2.6, 0.22]}>
            <planeGeometry args={[2.45, 4.2]} />
            <meshStandardMaterial
              map={inscriptionTexture}
              color="#ffffff"
              roughness={0.4}
              metalness={0.3}
            />
          </mesh>

          {/* Teks Penanda Klik */}
          <Text position={[0, 0.58, 0.62]} fontSize={0.1} color="#ffd700" anchorX="center">
            ✦ PRASASTI PERESMIAN UNIVERSITAS DIPONEGORO 1957 & 1960 ✦
          </Text>
          <Text position={[0, 0.42, 0.62]} fontSize={0.075} color="#7fd1e8" anchorX="center">
            (Klik prasasti untuk membaca teks peresmian & transkrip orasi Ir. Soekarno)
          </Text>
        </group>

        {/* Dua Obor Pilar Marmer-Emas di Kiri & Kanan Prasasti */}
        {[-3.2, 3.2].map((ox, oi) => (
          <group key={`torch-${oi}`} position={[ox, 0.66, 0]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.26, 2.4, 18]} />
              <meshStandardMaterial color="#0B1F3A" roughness={0.4} />
            </mesh>
            <mesh position={[0, 2.45, 0]}>
              <cylinderGeometry args={[0.3, 0.18, 0.25, 18]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Nyala Api / Cahaya Obor Kehormatan Abadi */}
            <mesh position={[0, 2.65, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color="#ffaa33" />
            </mesh>
            <pointLight position={[0, 2.7, 0]} color="#ff9922" intensity={18} distance={8} decay={2} />
          </group>
        ))}
      </group>
    </group>
  )
}
