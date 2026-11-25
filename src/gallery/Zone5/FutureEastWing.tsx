import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { ZONE5_HALL } from './layout'
import zone5Data from './data/zone5.json'
import type { Zone5Exhibit } from './types'

interface FutureEastWingProps {
  onSelect: (exhibit: Zone5Exhibit) => void
  onHover: (id: string | null) => void
  selectedId: string | null
}

/**
 * Sayap Timur (Kanan) Galeri Zona 5:
 * 1. Bagian Depan: The Summit (7 Pilar Kualitas World Class University & Jejaring Mitra Global)
 * 2. Bagian Belakang: The Living Grove (Inisiatif Keberlanjutan SDGs & Net-Zero 2045)
 */
export function FutureEastWing({ onSelect, onHover, selectedId }: FutureEastWingProps) {
  const wallX = ZONE5_HALL.halfWidth - 0.4

  const materials = useMemo(() => {
    return {
      pedestalBase: new THREE.MeshStandardMaterial({
        color: '#0B1F3A',
        roughness: 0.4,
        metalness: 0.3,
      }),
      pedestalActive: new THREE.MeshStandardMaterial({
        color: '#1a365d',
        roughness: 0.3,
        metalness: 0.5,
      }),
      goldTrim: new THREE.MeshStandardMaterial({
        color: '#c9a24b',
        metalness: 0.9,
        roughness: 0.2,
      }),
      emeraldTrim: new THREE.MeshStandardMaterial({
        color: '#10b981',
        metalness: 0.8,
        roughness: 0.2,
      }),
      holoGlass: new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
        metalness: 0.1,
      }),
    }
  }, [])

  return (
    <group position={[wallX, 0, 0]}>
      {/* ==============================================================
          1. HEADER SAYAP TIMUR DI DINDING
          ============================================================== */}
      <group position={[-0.3, 6.2, -8.0]} rotation={[0, -Math.PI / 2, 0]}>
        <Text fontSize={0.34} color="#ffd700" anchorX="center">
          SAYAP REPUTASI GLOBAL & KEBERLANJUTAN
        </Text>
        <Text position={[0, -0.42, 0]} fontSize={0.17} color="#10b981" anchorX="center">
          The Summit: 7 Pilar Menuju Top Global • The Living Grove: SDGs & Net-Zero 2045
        </Text>
      </group>

      {/* ==============================================================
          2. KLUSTER 1: THE SUMMIT — 7 PILAR KUALITAS WORLD CLASS (Z = 6.0 s.d. -6.0)
          ============================================================== */}
      {zone5Data.worldClass.pillars.map((pillar, pi) => {
        const lz = 6.0 - pi * 2.0
        const isSelected = selectedId === `summit-${pillar.level}`

        return (
          <group
            key={`pillar-${pillar.level}`}
            position={[-1.5, 0, lz]}
            rotation={[0, -Math.PI / 2, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({
                id: `summit-${pillar.level}`,
                title: `Pilar ${pillar.level}: ${pillar.name}`,
                category: 'worldClass',
                subtitle: `Target Pencapaian Tahun ${pillar.year}`,
                description: pillar.target,
                level: pillar.level,
                targetYear: pillar.year,
                highlights: [
                  `Target Tonggak Sejarah: Tahun ${pillar.year}`,
                  pillar.target,
                  'Kemitraan Strategis Konsorsium Universitas Top 100 Dunia',
                ],
              })
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHover(`summit-${pillar.level}`)
            }}
            onPointerOut={() => onHover(null)}
          >
            {/* Pedestal Bertingkat Spiral Naik */}
            <mesh position={[0, 0.35 + pi * 0.05, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.4, 0.7 + pi * 0.1, 1.0]} />
              <primitive object={isSelected ? materials.pedestalActive : materials.pedestalBase} attach="material" />
            </mesh>
            <mesh position={[0, 0.71 + pi * 0.1, 0]}>
              <boxGeometry args={[2.44, 0.02, 1.04]} />
              <primitive object={materials.goldTrim} attach="material" />
            </mesh>

            {/* Display Tingkat Pilar */}
            <group position={[0, 0.85 + pi * 0.1, 0]}>
              <Text position={[-0.9, 0.2, 0.02]} fontSize={0.22} color="#ffd700" anchorX="center">
                #{pillar.level}
              </Text>
              <Text position={[0.2, 0.28, 0.02]} fontSize={0.11} color="#ffffff" anchorX="left">
                {pillar.name}
              </Text>
              <Text position={[0.2, 0.12, 0.02]} fontSize={0.08} color="#94a3b8" anchorX="left">
                Target: {pillar.year} • {pillar.target.slice(0, 36)}...
              </Text>
            </group>
          </group>
        )
      })}

      {/* ==============================================================
          3. KLUSTER 2: THE LIVING GROVE — INOVASI & SDGS (4 STASIUN)
          Z = -10.0 s.d. -25.0
          ============================================================== */}
      {zone5Data.sustainability.initiatives.map((item, ii) => {
        const lz = -10.0 - ii * 3.8
        const isSelected = selectedId === `sdg-${ii}`

        return (
          <group
            key={`sdg-${ii}`}
            position={[-1.5, 0, lz]}
            rotation={[0, -Math.PI / 2, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({
                id: `sdg-${ii}`,
                title: item.title,
                category: 'sustainability',
                subtitle: item.sdg,
                description: `Inisiatif unggulan Universitas Diponegoro dalam mewujudkan kampus hijau berkelanjutan (UI GreenMetric) berstandar internasional. ${item.metric}.`,
                metric: item.metric,
                highlights: [
                  item.sdg,
                  item.metric,
                  'Mendukung Dekarbonisasi Kampus Menuju Net-Zero 2045',
                ],
              })
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHover(`sdg-${ii}`)
            }}
            onPointerOut={() => onHover(null)}
          >
            {/* Meja Pedestal Emerald-Gold */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.8, 0.9, 1.2]} />
              <primitive object={isSelected ? materials.pedestalActive : materials.pedestalBase} attach="material" />
            </mesh>
            <mesh position={[0, 0.91, 0]}>
              <boxGeometry args={[2.84, 0.02, 1.24]} />
              <primitive object={materials.emeraldTrim} attach="material" />
            </mesh>

            {/* Vitrine Kaca Tanaman Inovasi */}
            <mesh position={[0, 1.35, 0]}>
              <boxGeometry args={[2.5, 0.8, 0.9]} />
              <primitive object={materials.holoGlass} attach="material" />
            </mesh>

            {/* Simbol Tanaman / Daun Hijau di dalam Vitrine */}
            <mesh position={[0, 1.15, 0]}>
              <cylinderGeometry args={[0.04, 0.08, 0.35, 12]} />
              <meshStandardMaterial color="#166534" roughness={0.6} />
            </mesh>
            <mesh position={[0, 1.38, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#22c55e" roughness={0.3} metalness={0.2} />
            </mesh>

            {/* Teks SDG & Metrik */}
            <Text position={[0, 1.9, 0]} fontSize={0.12} color="#ffd700" anchorX="center">
              {item.sdg}
            </Text>
            <Text position={[0, 1.72, 0]} fontSize={0.11} color="#ffffff" anchorX="center">
              {item.title}
            </Text>
            <Text position={[0, 0.96, 0.62]} fontSize={0.085} color="#10b981" anchorX="center">
              ✦ {item.metric} ✦
            </Text>
          </group>
        )
      })}
    </group>
  )
}
