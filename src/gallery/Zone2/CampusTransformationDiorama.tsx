import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useEntityVisibility } from '../../perf/core/EntityCulling'
import { Text } from '@react-three/drei'
import { createDioramaPlaqueTexture } from './textures'
import type { Zone2Exhibit } from './types'
import { ZONE2_CENTERPIECE } from './data/zone2Exhibits'

interface CampusTransformationDioramaProps {
  position: [number, number, number]
  isSelected: boolean
  isHovered: boolean
  onSelect: (exhibit: Zone2Exhibit) => void
  onHover: (id: string | null) => void
}

/**
 * Campus Transformation Diorama — Centerpiece for Zone 2
 * Tiered non-monotonous 3D diorama displaying:
 * 1. Pleburan Heritage Campus (Historic City Center)
 * 2. Tembalang Master Campus (180 Ha Eco-Campus with Widya Purabaya)
 * 3. Jepara Marine Science Park (Teluk Awur & Coastal Research)
 * Features warm golden accentuation, tiered pedestals, and interactive hotspot rings.
 */
export function CampusTransformationDiorama({
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: CampusTransformationDioramaProps) {
  const plaqueTexture = useMemo(() => createDioramaPlaqueTexture(), [])
  const ringRef = useRef<THREE.Mesh>(null)

  // Subtle pulsing animation on interactive indicator
  const isVisible = useEntityVisibility()

  useFrame((state) => {
    if (!isVisible) return
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.8
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05
      ringRef.current.scale.set(s, s, 1)
    }
  })

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(ZONE2_CENTERPIECE)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover('centerpiece-diorama')
      }}
      onPointerOut={() => onHover(null)}
    >
      {/* 1. Base Multi-Tiered Monumental Pedestal */}
      {/* Tier 1 - Ground Marble Plinth */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.24, 3.4]} />
        <meshStandardMaterial
          color={isSelected ? '#3b2f15' : isHovered ? '#261f12' : '#1a1815'}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Gold Trim Line around Tier 1 */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[4.84, 0.02, 3.44]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Tier 2 - Raised Platform */}
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.24, 3.0]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.25} metalness={0.1} />
      </mesh>

      {/* Gold Inlay Edge on Tier 2 */}
      <mesh position={[0, 0.51, 0]}>
        <boxGeometry args={[4.44, 0.02, 3.04]} />
        <meshStandardMaterial color="#ffd700" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Tier 3 - Campus Display Top Surface (Landscape Green / Modern Ground) */}
      <mesh position={[0, 0.53, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.04, 2.8]} />
        <meshStandardMaterial color="#1e3a24" roughness={0.7} />
      </mesh>

      {/* ==============================================================
          DIORAMA PART A: PLEBURAN CAMPUS MINIATURE (Left Side of Plinth)
          ============================================================== */}
      <group position={[-1.3, 0.55, 0]}>
        {/* Heritage Pavement & Courtyard */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.2, 0.03, 1.8]} />
          <meshStandardMaterial color="#8c7e6d" roughness={0.6} />
        </mesh>

        {/* Historic Auditorium Imam Bardjo (Terracotta Roof) */}
        <mesh position={[0, 0.25, -0.3]} castShadow>
          <boxGeometry args={[0.9, 0.4, 0.6]} />
          <meshStandardMaterial color="#f3eee3" roughness={0.5} />
        </mesh>
        {/* Gable Roof */}
        <mesh position={[0, 0.52, -0.3]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[0.65, 0.25, 4]} />
          <meshStandardMaterial color="#a04028" roughness={0.4} />
        </mesh>

        {/* Heritage Rektorat Building */}
        <mesh position={[0, 0.2, 0.4]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.5]} />
          <meshStandardMaterial color="#eae4d3" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.4, 0.4]}>
          <boxGeometry args={[0.84, 0.08, 0.54]} />
          <meshStandardMaterial color="#8f3a22" roughness={0.4} />
        </mesh>

        {/* Miniature Trees */}
        {[-0.45, 0.45].map((tx, ti) => (
          <group key={`tree-pleburan-${ti}`} position={[tx, 0.05, 0]}>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.02, 0.03, 0.2, 6]} />
              <meshStandardMaterial color="#4a3728" />
            </mesh>
            <mesh position={[0, 0.24, 0]} castShadow>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color="#2d5a27" roughness={0.6} />
            </mesh>
          </group>
        ))}

        <Text
          position={[0, 0.05, 0.82]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.09}
          color="#ffd54f"
          anchorX="center"
          anchorY="middle"
        >
          PLEBURAN (1956)
        </Text>
      </group>

      {/* ==============================================================
          DIORAMA PART B: TEMBALANG MASTER CAMPUS (Center & Right - Grand 180 Ha)
          ============================================================== */}
      <group position={[0.5, 0.55, 0]}>
        {/* Campus Roads and Ring */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[2.0, 0.03, 2.0]} />
          <meshStandardMaterial color="#2b4731" roughness={0.7} />
        </mesh>

        {/* Central Water Retention Basin / Danau Kampus */}
        <mesh position={[0.2, 0.035, -0.4]}>
          <cylinderGeometry args={[0.35, 0.35, 0.02, 16]} />
          <meshStandardMaterial color="#1e4d6b" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Widya Purabaya Main Rektorat Building (Iconic Multi-Tier Tower) */}
        <group position={[-0.2, 0, 0]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.8, 0.5, 0.5]} />
            <meshStandardMaterial color="#f0f4f8" metalness={0.2} roughness={0.3} />
          </mesh>
          {/* Central Elevated Tower */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.24, 0.35, 12]} />
            <meshStandardMaterial color="#142e56" metalness={0.5} roughness={0.2} />
          </mesh>
          {/* Blue Dome Cap */}
          <mesh position={[0, 0.88, 0]}>
            <sphereGeometry args={[0.16, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* ICT Center Tower */}
        <mesh position={[0.6, 0.35, 0.3]} castShadow>
          <boxGeometry args={[0.35, 0.65, 0.35]} />
          <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0.6, 0.7, 0.3]}>
          <boxGeometry args={[0.38, 0.05, 0.38]} />
          <meshStandardMaterial color="#ffd700" metalness={0.8} />
        </mesh>

        {/* Grand Mosque Maskam Undip Dome */}
        <mesh position={[-0.6, 0.2, 0.45]} castShadow>
          <boxGeometry args={[0.4, 0.35, 0.4]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[-0.6, 0.42, 0.45]}>
          <sphereGeometry args={[0.15, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#10b981" roughness={0.3} />
        </mesh>

        {/* RSND (Rumah Sakit Nasional Diponegoro) Complex */}
        <mesh position={[0.65, 0.22, -0.45]} castShadow>
          <boxGeometry args={[0.5, 0.38, 0.4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        {/* Red Cross sign */}
        <mesh position={[0.65, 0.43, -0.45]}>
          <boxGeometry args={[0.18, 0.04, 0.04]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0.65, 0.43, -0.45]}>
          <boxGeometry args={[0.04, 0.04, 0.18]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>

        <Text
          position={[0.2, 0.05, 0.85]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.09}
          color="#ffd54f"
          anchorX="center"
          anchorY="middle"
        >
          TEMBALANG (180 HA TERPADU)
        </Text>
      </group>

      {/* ==============================================================
          DIORAMA PART C: JEPARA MARINE SCIENCE PARK (Teluk Awur Accent)
          ============================================================== */}
      <group position={[1.65, 0.55, 0.1]}>
        {/* Sea Water Basin */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.6, 0.04, 1.4]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.15} />
        </mesh>
        {/* Pier / Dermaga */}
        <mesh position={[-0.1, 0.06, 0]}>
          <boxGeometry args={[0.3, 0.04, 0.1]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Research Vessel Ship */}
        <mesh position={[0.1, 0.08, 0]} castShadow>
          <boxGeometry args={[0.15, 0.08, 0.35]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0.1, 0.14, -0.05]}>
          <boxGeometry args={[0.1, 0.08, 0.12]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>

        <Text
          position={[0, 0.05, 0.72]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.075}
          color="#93c5fd"
          anchorX="center"
          anchorY="middle"
        >
          MSTP JEPARA
        </Text>
      </group>

      {/* ==============================================================
          FRONT ANGLED INFORMATION PLAQUE
          ============================================================== */}
      <group position={[0, 0.72, 1.72]} rotation={[-Math.PI / 6, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 1.1, 0.08]} />
          <meshStandardMaterial color="#221b14" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.12, 1.02]} />
          <meshStandardMaterial map={plaqueTexture} roughness={0.3} metalness={0.2} />
        </mesh>
      </group>

      {/* ==============================================================
          PULSING INTERACTIVE HOTSPOT INDICATOR
          ============================================================== */}
      <group position={[0, 1.6, 0]}>
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.38, 32]} />
          <meshBasicMaterial
            color={isSelected ? '#ffd700' : isHovered ? '#ffea00' : '#f59e0b'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.16}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0b172a"
        >
          {isHovered ? 'KLIK UNTUK EKSPLORASI DIORAMA' : '★ DIORAMA 3D KAMPUS ★'}
        </Text>
      </group>
    </group>
  )
}
