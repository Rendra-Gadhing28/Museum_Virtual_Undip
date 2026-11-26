import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { createSteleInscriptionTexture } from './textures'
import { PRASASTI_HERO_POS, HERITAGE_TABLE_POS } from './layout'
import zone3Data from './data/zone3.json'
import { MaterialLibrary, QUALITY } from '../quality'
import { MuladiDomeVitrine } from './MuladiDomeVitrine'

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
  const andesiteMat = useMemo(() => MaterialLibrary.volcanicAndesite(), [])
  const carvedStoneMaps = useMemo(() => MaterialLibrary.carvedStoneMaps(), [])

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.4
    }
  })

  const isPrasastiSelected = selectedId === 'hero-inscription-stele'
  const isPrasastiHovered = hoveredId === 'hero-inscription-stele'

  const isVitrineSelected = selectedId === 'muladi-dome-vitrine' || selectedId === 'heritage-emblem-center'
  const isVitrineHovered = hoveredId === 'muladi-dome-vitrine' || hoveredId === 'heritage-emblem-center'

  return (
    <group>
      {/* ==============================================================
          1. MINIATUR KACA MULADI DOME DI SUMBU TENGAH (Z = -2.5)
          ============================================================== */}
      <MuladiDomeVitrine
        position={HERITAGE_TABLE_POS}
        isSelected={isVitrineSelected}
        isHovered={isVitrineHovered}
        onSelect={() => {
          onSelect({
            type: 'muladi-dome',
            data: {
              id: 'muladi-dome-vitrine',
              title: 'Maket Miniatur Muladi Dome (Multipurpose Convention Hall)',
              category: 'Arsitektur Akbar Undip',
              year: '2023',
              description:
                'Gedung serbaguna dan convention hall termegah Universitas Diponegoro berkapasitas lebih dari 4.500 orang. Mengadopsi arsitektur atap bantal dengan motif anyaman besek tradisional khas Jawa Tengah dan fasad kisi louvers modern.',
              highlights: [
                'Model 3D Arsitektur Presisi Muladi Dome dalam Etalase Kaca',
                'Desain Ikonik: Atap Anyaman Besek Tradisional & Sirip Louvers Fasad',
                'Fasilitas Terakbar: Convention Hall, Grand Ballroom, Exhibition Area',
                'Penghormatan kepada Prof. Dr. Muladi, S.H. atas jasa kepemimpinan beliau',
              ],
            },
          })
        }}
        onHover={onHover}
      />

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
            {isPrasastiSelected || isPrasastiHovered ? (
              <meshStandardMaterial
                color={isPrasastiSelected ? '#252528' : '#1c1c1e'}
                roughness={0.65}
                metalness={0.15}
              />
            ) : (
              <primitive object={andesiteMat} attach="material" />
            )}
          </mesh>

          {/* Plat Permukaan Tekstur Ukiran Emas Prasasti (Normal + Displacement + Segmented) */}
          <mesh position={[0, 2.6, 0.22]}>
            <planeGeometry args={[2.45, 4.2, 48, 84]} />
            <meshStandardMaterial
              map={inscriptionTexture}
              normalMap={QUALITY.current.physicalMaterials ? carvedStoneMaps.normalMap : null}
              normalScale={new THREE.Vector2(0.65, 0.65)}
              displacementMap={QUALITY.current.microDetailBump ? carvedStoneMaps.displacementMap : null}
              displacementScale={0.014}
              roughnessMap={QUALITY.current.physicalMaterials ? carvedStoneMaps.roughnessMap : null}
              color="#ffffff"
              roughness={0.45}
              metalness={0.28}
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
          </group>
        ))}
      </group>
    </group>
  )
}
