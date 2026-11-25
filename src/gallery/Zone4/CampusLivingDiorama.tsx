import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useEntityVisibility } from '../../perf/core/EntityCulling'
import { Text } from '@react-three/drei'
import zone4Data from './data/zone4.json'
import type { Zone4Exhibit } from './types'

interface CampusLivingDioramaProps {
  position: [number, number, number]
  isSelected: boolean
  isHovered: boolean
  onSelect: (exhibit: Zone4Exhibit) => void
  onHover: (id: string | null) => void
  timeOfDay: number // 0 (Siang) s.d. 1 (Malam)
}

/**
 * Centerpiece Maket Kampus Modern Tembalang & Smart Campus
 * Berdiri di sumbu tengah aula pameran di atas meja marmer bertingkat tepi kuningan emas
 */
export function CampusLivingDiorama({
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  timeOfDay,
}: CampusLivingDioramaProps) {
  const droneRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [selectedBldg, setSelectedBldg] = useState<string | null>(null)

  const nightFactor = Math.max(0, (timeOfDay - 0.3) / 0.7)

  // Animasi drone patrol & pulsing indicator ring
  const isVisible = useEntityVisibility()

  useFrame((state) => {
    if (!isVisible) return
    const time = state.clock.elapsedTime
    if (droneRef.current) {
      droneRef.current.position.x = Math.sin(time * 0.6) * 3.8
      droneRef.current.position.z = Math.cos(time * 0.6) * 2.8
      droneRef.current.position.y = 2.4 + Math.sin(time * 2.0) * 0.15
      droneRef.current.rotation.y = time * 0.6 + Math.PI / 2
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.6
      const s = 1 + Math.sin(time * 2.5) * 0.05
      ringRef.current.scale.set(s, s, 1)
    }
  })

  // Centerpiece Master Exhibit Data
  const centerpieceExhibit: Zone4Exhibit = useMemo(
    () => ({
      id: 'campus-master-diorama',
      title: 'Maket Kampus Terpadu Tembalang & Smart Campus Undip',
      category: 'campus',
      subtitle: 'Diorama Berskala Komprehensif Arsitektur Kampus Hijau 220 Hektar',
      description:
        'Maket fisik-digital yang merepresentasikan transformasi tata ruang Kampus Undip Tembalang. Menghubungkan pusat administrasi Widya Puraya, klaster fakultas sains dan teknologi, rumah sakit riset nasional, hingga convention hall termegah Muladi Dome dalam kesatuan kampus hijau hemat energi (UI GreenMetric).',
      highlights: [
        'Model 12 Landmark Gedung Kampus Modern Tembalang',
        'Sistem Smart Campus: Jaringan Fiber Optic & Sel Surya Terpadu',
        'Simulasi Dinamis Siklus Pencahayaan Jendela & Lampu Jalan',
        'Pusat Aktivitas Lebih dari 56.000 Mahasiswa dari Seluruh Nusantara',
      ],
    }),
    []
  )

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(centerpieceExhibit)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover('campus-master-diorama')
      }}
      onPointerOut={() => onHover(null)}
    >
      {/* ==============================================================
          1. MEJA MARMER BERTINGKAT MONUMENTAL TEPI KUNINGAN EMAS
          ============================================================== */}
      {/* Undakan Tingkat 1 (Marmer Gelap Dasar) */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.8, 0.32, 6.4]} />
        <meshStandardMaterial
          color={isSelected ? '#2e2515' : isHovered ? '#1f1b14' : '#141416'}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Lis Emas Tingkat 1 */}
      <mesh position={[0, 0.33, 0]}>
        <boxGeometry args={[8.86, 0.03, 6.46]} />
        <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Undakan Tingkat 2 (Marmer Ivory Top) */}
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 0.36, 6.0]} />
        <meshStandardMaterial color="#f4efe4" roughness={0.25} metalness={0.1} />
      </mesh>

      {/* Permukaan Lanskap Rumput Hijau & Jalan Maket Kampus */}
      <mesh position={[0, 0.71, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.1, 5.7]} />
        <meshStandardMaterial color="#dcfce7" roughness={0.8} />
      </mesh>

      {/* Jalan Lingkar Maket Kampus */}
      <mesh position={[0, 0.715, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 3.2, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* ==============================================================
          2. MINIATUR GEDUNG-GEDUNG MODERN KAMPUS TEMBALANG
          ============================================================== */}
      {zone4Data.campus.buildings.map((bldg) => {
        // Skala miniatur meja galeri (faktor skala 0.28)
        const mx = bldg.x * 0.28
        const mz = bldg.z * 0.28
        const mw = bldg.width * 0.28
        const ml = bldg.length * 0.28
        const mh = bldg.height * 0.28
        const isBldgHovered = selectedBldg === bldg.id

        return (
          <group
            key={bldg.id}
            position={[mx, 0.72, mz]}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedBldg(bldg.id)
              onSelect({
                id: bldg.id,
                title: bldg.name,
                category: 'campus',
                subtitle: bldg.function,
                year: bldg.year,
                description: bldg.description,
                highlights: bldg.highlights,
              })
            }}
          >
            {/* Fasad Gedung Modern */}
            <mesh position={[0, mh / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[mw, mh, ml]} />
              <meshStandardMaterial
                color={isBldgHovered ? '#ffffff' : '#f8fafc'}
                roughness={0.25}
                metalness={0.15}
              />
            </mesh>

            {/* Jendela Kaca yang Menyala Hangat Saat Malam */}
            <mesh position={[0, mh / 2, 0]}>
              <boxGeometry args={[mw + 0.02, mh * 0.75, ml + 0.02]} />
              <meshStandardMaterial
                color={nightFactor > 0.2 ? '#ffe082' : '#0369a1'}
                emissive={nightFactor > 0.2 ? '#ffd54f' : '#000000'}
                emissiveIntensity={nightFactor * 1.8}
                transparent
                opacity={0.88}
                roughness={0.1}
              />
            </mesh>

            {/* Atap Hijau Modern / Joglo Hero */}
            {bldg.id === 'bldg-widya-puraya' ? (
              <mesh position={[0, mh + 0.15, 0]} castShadow>
                <coneGeometry args={[mw * 0.6, 0.35, 4]} />
                <meshStandardMaterial color="#3E2A1E" roughness={0.4} />
              </mesh>
            ) : (
              <mesh position={[0, mh + 0.02, 0]}>
                <boxGeometry args={[mw * 0.9, 0.03, ml * 0.9]} />
                <meshStandardMaterial color="#15803d" roughness={0.6} />
              </mesh>
            )}

            {/* Label Miniatur Nama Gedung */}
            <Text
              position={[0, mh + 0.25, 0]}
              fontSize={0.09}
              color={isBldgHovered ? '#ffd700' : '#0B1F3A'}
              anchorX="center"
              outlineWidth={0.01}
              outlineColor="#ffffff"
            >
              {bldg.name.split(' (')[0].slice(0, 18)}
            </Text>
          </group>
        )
      })}

      {/* Drone Patrol Miniatur Terbang Melintas */}
      <group ref={droneRef} position={[0, 2.4, 0]}>
        <mesh>
          <boxGeometry args={[0.22, 0.04, 0.22]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#7fd1e8" />
        </mesh>
        <pointLight color="#7fd1e8" intensity={4} distance={2} />
      </group>

      {/* Ring Hotspot Interaktif di Depan Maket */}
      <group position={[0, 0.73, 2.7]}>
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 32]} />
          <meshBasicMaterial color="#c9a24b" side={THREE.DoubleSide} />
        </mesh>
        <Text position={[0, 0.25, 0]} fontSize={0.14} color="#ffd700" anchorX="center">
          ✦ KLIK MAKET UNTUK MENJELAJAH KAMPUS ✦
        </Text>
      </group>
    </group>
  )
}
