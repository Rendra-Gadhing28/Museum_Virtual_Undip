import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import { createResearchTexture } from './textures'
import type { Zone2Exhibit } from './types'
import {
  ACHIEVEMENT_EXHIBITS,
  RESEARCH_EXHIBITS,
} from './data/zone2Exhibits'
import {
  RESEARCH_PANEL_Y,
  RESEARCH_SPACING,
  RESEARCH_START_Z,
  RESEARCH_WALL_X,
} from './layout'

interface ResearchContributionWingProps {
  selectedId: string | null
  hoveredId: string | null
  onSelectExhibit: (exhibit: Zone2Exhibit) => void
  onHover: (id: string | null) => void
}

/**
 * Research & Community Contribution Wing (Right Wall of Zone 2)
 * Features tiered interactive gallery frames showcasing:
 * 1. Pola Ilmiah Pokok (PIP) Bina Kelautan
 * 2. Laboratorium Terpadu & Hilirisasi Paten
 * 3. Pelopor KKN Tematik & Pengabdian 3T
 * 4. Lompatan Reputasi Global (QS Ranking #1 Graduate Employability)
 */
export function ResearchContributionWing({
  selectedId,
  hoveredId,
  onSelectExhibit,
  onHover,
}: ResearchContributionWingProps) {
  const allExhibits = useMemo(
    () => [...RESEARCH_EXHIBITS, ...ACHIEVEMENT_EXHIBITS],
    [],
  )

  return (
    <group>
      {/* Archway Header on Right Wall */}
      <group position={[RESEARCH_WALL_X - 0.15, 6.2, -4.5]} rotation={[0, -Math.PI / 2, 0]}>
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
          fontSize={0.32}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0b172a"
        >
          SAYAP RISET KELAUTAN, PATEN & PENGABDIAN MASYARAKAT
        </Text>
      </group>

      {/* Research & Achievement Panels along Right Wall */}
      {allExhibits.map((exhibit, index) => {
        const zPos = RESEARCH_START_Z - index * RESEARCH_SPACING
        const isSelected = selectedId === exhibit.id
        const isHovered = hoveredId === exhibit.id

        return (
          <ResearchPanelItem
            key={exhibit.id}
            exhibit={exhibit}
            position={[RESEARCH_WALL_X - 0.15, RESEARCH_PANEL_Y, zPos]}
            isSelected={isSelected}
            isHovered={isHovered}
            onSelect={() => onSelectExhibit(exhibit)}
            onHover={(hover) => onHover(hover ? exhibit.id : null)}
          />
        )
      })}
    </group>
  )
}

interface ResearchPanelItemProps {
  exhibit: Zone2Exhibit
  position: [number, number, number]
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: (hover: boolean) => void
}

function ResearchPanelItem({
  exhibit,
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: ResearchPanelItemProps) {
  const texture = useMemo(() => createResearchTexture(exhibit), [exhibit])

  return (
    <group
      position={position}
      rotation={[0, -Math.PI / 2, 0]}
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
      {/* 1. Mahogany Backing Plaque */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.2, 2.9, 0.12]} />
        <meshStandardMaterial
          color={isSelected ? '#352115' : isHovered ? '#25170e' : '#181410'}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      {/* 2. Gold Frame */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[4.26, 2.96, 0.04]} />
        <meshStandardMaterial
          color={isSelected ? '#ffe066' : isHovered ? '#ffd700' : '#d4af37'}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* 3. High-Definition Canvas Canvas Art */}
      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[4.06, 2.76]} />
        <meshStandardMaterial map={texture} roughness={0.25} metalness={0.15} />
      </mesh>

      {/* 4. Display Pedestal below Frame */}
      <group position={[0, -2.0, 0.4]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.5, 0.6]} />
          <meshStandardMaterial color="#0e1d35" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.51, 0]}>
          <boxGeometry args={[3.86, 0.02, 0.66]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} />
        </mesh>
        <Text
          position={[0, 0.25, 0.32]}
          fontSize={0.16}
          color={isHovered ? '#ffd700' : '#e2e8f0'}
          anchorX="center"
          anchorY="middle"
        >
          {exhibit.shortLabel.toUpperCase()}
        </Text>
      </group>

      {/* 5. Sleek Warm Picture Lamp Fixture (Lightweight emissive) */}
      <group position={[0, 1.7, 0.3]}>
        <mesh>
          <boxGeometry args={[1.8, 0.07, 0.14]} />
          <meshStandardMaterial color="#c5a059" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[1.7, 0.02, 0.1]} />
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
