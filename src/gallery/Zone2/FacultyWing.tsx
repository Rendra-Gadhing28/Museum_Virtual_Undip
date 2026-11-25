import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import { createFacultyTexture } from './textures'
import type { Zone2Exhibit } from './types'
import { FACULTY_EXHIBITS } from './data/zone2Exhibits'
import {
  FACULTY_PANEL_Y,
  FACULTY_SPACING,
  FACULTY_START_Z,
  FACULTY_WALL_X,
} from './layout'

interface FacultyWingProps {
  selectedId: string | null
  hoveredId: string | null
  onSelectExhibit: (exhibit: Zone2Exhibit) => void
  onHover: (id: string | null) => void
}

/**
 * Faculty Wing (Left Wall of Zone 2)
 * Features tiered interactive gallery frames showcasing all 11 UNDIP faculties
 * in chronological order: FH, FEB, FT, FK, FPP, FIB, FISIP, FPIK, FSM, FKM, FPsi.
 * Panel visual language: IVORY background with BLUE NAVY typography.
 */
export function FacultyWing({
  selectedId,
  hoveredId,
  onSelectExhibit,
  onHover,
}: FacultyWingProps) {
  return (
    <group>
      {/* Grand Archway Header on Left Wall */}
      <group position={[FACULTY_WALL_X + 0.15, 6.2, -4.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[26.0, 0.7, 0.2]} />
          <meshStandardMaterial color="#0f2444" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[25.8, 0.6, 0.02]} />
          <meshStandardMaterial color="#142e56" roughness={0.2} metalness={0.6} />
        </mesh>
        <Text
          position={[0, 0, 0.14]}
          fontSize={0.3}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0b172a"
        >
          11 FAKULTAS • SEKOLAH VOKASI & PASCASARJANA UNIVERSITAS DIPONEGORO
        </Text>
      </group>

      {/* Faculty Panels along Left Wall */}
      {FACULTY_EXHIBITS.map((faculty, index) => {
        const zPos = FACULTY_START_Z - index * FACULTY_SPACING
        const isSelected = selectedId === faculty.id
        const isHovered = hoveredId === faculty.id

        return (
          <FacultyPanelItem
            key={faculty.id}
            faculty={faculty}
            position={[FACULTY_WALL_X + 0.15, FACULTY_PANEL_Y, zPos]}
            isSelected={isSelected}
            isHovered={isHovered}
            onSelect={() => onSelectExhibit(faculty)}
            onHover={(hover) => onHover(hover ? faculty.id : null)}
          />
        )
      })}
    </group>
  )
}

interface FacultyPanelItemProps {
  faculty: Zone2Exhibit
  position: [number, number, number]
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: (hover: boolean) => void
}

function FacultyPanelItem({
  faculty,
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: FacultyPanelItemProps) {
  const texture = useMemo(() => createFacultyTexture(faculty), [faculty])

  return (
    <group
      position={position}
      rotation={[0, Math.PI / 2, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(true)
      }}
      onPointerOut={() => onHover(false)}
    >
      {/* 1. Navy Backing Plaque */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 2.1, 0.12]} />
        <meshStandardMaterial
          color={isSelected ? '#1b3a66' : isHovered ? '#16345f' : '#0f2444'}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      {/* 2. Heavy Navy-Blue Beveled Frame */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[2.86, 2.16, 0.04]} />
        <meshStandardMaterial
          color={isSelected ? '#3f6db3' : isHovered ? '#2a5494' : '#1b3a66'}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* 3. High-Definition Ivory Panel Art (navy typography) */}
      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[2.68, 2.01]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>

      {/* 4. Tiered Pedestal Display Stand below the Frame */}
      <group position={[0, -1.62, 0.4]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.5, 0.6]} />
          <meshStandardMaterial color="#0e1d35" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.51, 0]}>
          <boxGeometry args={[2.46, 0.02, 0.66]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} />
        </mesh>
        <Text
          position={[0, 0.25, 0.32]}
          fontSize={0.13}
          color={isHovered ? '#ffd700' : '#f7f1e3'}
          anchorX="center"
          anchorY="middle"
        >
          {faculty.shortLabel.toUpperCase()}
        </Text>
      </group>

      {/* 5. Sleek Warm Picture Lamp Fixture (Lightweight emissive) */}
      <group position={[0, 1.25, 0.25]}>
        <mesh>
          <boxGeometry args={[1.2, 0.06, 0.12]} />
          <meshStandardMaterial color="#c5a059" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[1.1, 0.02, 0.08]} />
          <meshStandardMaterial
            color="#fff0cc"
            emissive={isSelected || isHovered ? '#ffd700' : '#ffc060'}
            emissiveIntensity={isSelected ? 1.6 : isHovered ? 1.2 : 0.8}
          />
        </mesh>
      </group>
    </group>
  )
}
