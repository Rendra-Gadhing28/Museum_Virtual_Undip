import { useState, useRef } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { LABS_WALL_X } from './layout'
import zone4Data from './data/zone4.json'
import type { Zone4Exhibit } from './types'

interface ResearchWingProps {
  onSelect: (exhibit: Zone4Exhibit) => void
  onHover: (id: string | null) => void
  selectedId: string | null
}

/**
 * Sayap Kiri: Laboratorium & Pusat Penelitian (Sains, Teknologi, & Kesehatan)
 * Tertata rapi di sepanjang dinding barat aula dengan vitrine kaca,
 * display panel riset berbingkai kuningan emas, dan miniatur stasiun inovasi
 */
export function ResearchWing({ onSelect, onHover, selectedId }: ResearchWingProps) {
  const [experimentActive, setExperimentActive] = useState(false)
  const robotArmRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (robotArmRef.current) {
      robotArmRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.5
    }
  })

  return (
    <group position={[LABS_WALL_X, 0, 0]}>
      {/* ==============================================================
          1. HEADER SAYAP PENELITIAN DI DINDING BARAT
          ============================================================== */}
      <group position={[0.35, 6.2, -10.0]} rotation={[0, Math.PI / 2, 0]}>
        <Text fontSize={0.34} color="#ffd700" anchorX="center">
          SAYAP INOVASI, LABORATORIUM TERPADU & RISET UNGGULAN
        </Text>
        <Text position={[0, -0.4, 0]} fontSize={0.18} color="#e2e8f0" anchorX="center">
          Pusat Keunggulan PIP: Pesisir & Laut Tropis, Biomedis Bionik, Energi Bersih, & AI
        </Text>
      </group>

      {/* ==============================================================
          2. VITRINE & DISPLAY STASIUN LAB (6 STASIUN UTAMA)
          ============================================================== */}
      {zone4Data.labs.map((lab, li) => {
        const lz = 6.0 - li * 6.5 // Berjejer rapi di sepanjang Z = 6 s.d. -26.5
        const isSelected = selectedId === lab.id

        return (
          <group
            key={lab.id}
            position={[1.6, 0, lz]}
            rotation={[0, Math.PI / 2, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({
                id: lab.id,
                title: lab.name,
                category: 'lab',
                subtitle: lab.sector,
                leadScientist: lab.leadScientist,
                description: lab.description,
                highlights: lab.innovations,
              })
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHover(lab.id)
            }}
            onPointerOut={() => onHover(null)}
          >
            {/* a) Plinth Kayu Jati & Lis Kuningan Emas */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[3.2, 0.9, 1.4]} />
              <meshStandardMaterial
                color={isSelected ? '#1f2937' : '#0B1F3A'}
                roughness={0.4}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[0, 0.91, 0]}>
              <boxGeometry args={[3.24, 0.02, 1.44]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.9} />
            </mesh>

            {/* b) Vitrine Kaca Transparan & Dudukan Beludru Navy */}
            <mesh position={[0, 0.93, 0]}>
              <boxGeometry args={[2.9, 0.04, 1.2]} />
              <meshStandardMaterial color="#0B1F3A" roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.65, 0]}>
              <boxGeometry args={[3.0, 1.4, 1.3]} />
              <meshStandardMaterial
                color="#f8fafc"
                transparent
                opacity={0.25}
                roughness={0.05}
                metalness={0.1}
              />
            </mesh>

            {/* c) Miniatur Objek Eksperimen di dalam Vitrine */}
            {li === 0 && (
              <group ref={robotArmRef} position={[0, 1.0, 0]}>
                <mesh position={[0, 0.25, 0]}>
                  <cylinderGeometry args={[0.06, 0.1, 0.5, 12]} />
                  <meshStandardMaterial color="#475569" metalness={0.8} />
                </mesh>
                <mesh position={[0.15, 0.5, 0]} rotation={[0, 0, 0.4]}>
                  <boxGeometry args={[0.35, 0.06, 0.06]} />
                  <meshStandardMaterial color="#0284c7" />
                </mesh>
              </group>
            )}

            {li === 1 && (
              <group position={[0, 1.0, 0]}>
                <mesh position={[0, 0.35, 0]}>
                  <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
                  <meshStandardMaterial color="#10b981" transparent opacity={0.8} />
                </mesh>
              </group>
            )}

            {li === 2 && (
              <group position={[0, 1.0, 0]}>
                <mesh position={[0, 0.35, 0]}>
                  <boxGeometry args={[0.3, 0.5, 0.25]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[0, 0.7, 0]}>
                  <sphereGeometry args={[0.12, 12, 12]} />
                  <meshBasicMaterial color="#7fd1e8" />
                </mesh>
              </group>
            )}

            {li >= 3 && (
              <mesh position={[0, 1.35, 0]}>
                <boxGeometry args={[0.5, 0.6, 0.4]} />
                <meshStandardMaterial color="#0284c7" metalness={0.6} />
              </mesh>
            )}

            {/* d) Label Kuningan di Depan Vitrine */}
            <group position={[0, 0.5, 0.72]}>
              <mesh>
                <boxGeometry args={[2.2, 0.22, 0.02]} />
                <meshStandardMaterial color="#c9a24b" metalness={0.9} />
              </mesh>
              <Text position={[0, 0.02, 0.015]} fontSize={0.09} color="#0B1F3A" anchorX="center">
                {lab.icon} {lab.name.split(' (')[0].slice(0, 26)}
              </Text>
              <Text position={[0, -0.06, 0.015]} fontSize={0.065} color="#3E2A1E" anchorX="center">
                {lab.sector}
              </Text>
            </group>

            {/* e) Lampu Sorot Galeri Hangat di Atas Vitrine */}
            <pointLight position={[0, 2.8, 0]} color="#fff3db" intensity={16} distance={4} />

            {/* f) Panel Dinding Informasi Riset di Belakang Vitrine */}
            <group position={[0, 3.2, -0.6]}>
              <mesh castShadow>
                <boxGeometry args={[2.8, 1.6, 0.06]} />
                <meshStandardMaterial color="#c9a24b" metalness={0.85} />
              </mesh>
              <mesh position={[0, 0, 0.035]}>
                <boxGeometry args={[2.7, 1.5, 0.02]} />
                <meshStandardMaterial color="#08172c" />
              </mesh>
              <Text position={[0, 0.45, 0.05]} fontSize={0.13} color="#ffd700" anchorX="center">
                {lab.innovations[0]}
              </Text>
              <Text position={[0, 0.1, 0.05]} fontSize={0.09} color="#ffffff" anchorX="center" maxWidth={2.4}>
                {lab.description.slice(0, 95)}...
              </Text>
              <Text position={[0, -0.45, 0.05]} fontSize={0.08} color="#7fd1e8" anchorX="center">
                Peneliti: {lab.leadScientist.slice(0, 36)}
              </Text>
            </group>
          </group>
        )
      })}

      {/* Tombol Eksperimen Interaktif di Meja Tengah Sayap Lab */}
      <group
        position={[2.0, 1.0, -10.0]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation()
          setExperimentActive(true)
          setTimeout(() => setExperimentActive(false), 3000)
        }}
      >
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.45, 0.15, 24]} />
          <meshStandardMaterial color={experimentActive ? '#ffd700' : '#c9a24b'} metalness={0.9} />
        </mesh>
        <Text position={[0, 0.25, 0]} fontSize={0.11} color="#ffd700" anchorX="center">
          {experimentActive ? '⚡ EKSPERIMEN AKTIF' : '▶ SIMULASI EKSPERIMEN'}
        </Text>
        {experimentActive && (
          <pointLight position={[0, 0.8, 0]} color="#ffe082" intensity={40} distance={6} />
        )}
      </group>
    </group>
  )
}
