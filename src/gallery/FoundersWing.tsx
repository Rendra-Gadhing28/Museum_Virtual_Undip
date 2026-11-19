import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import type { Founder } from './data/exhibits'
import { UNDIP_FOUNDERS } from './data/exhibits'
import {
  FOUNDERS_FRAME_Y,
  FOUNDERS_SPACING,
  FOUNDERS_START_Z,
  FOUNDERS_WALL_X,
} from './layout'
import { createFounderPortraitTexture } from './textures'
import { assetCache } from './cache'

interface FounderCardProps {
  founder: Founder
  index: number
  position: [number, number, number]
  rotationY: number
  isSelected: boolean
  isHovered: boolean
  onSelect: (founder: Founder) => void
  onHover: (id: string | null) => void
}

function FounderCard({
  founder,
  index,
  position,
  rotationY,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: FounderCardProps) {
  const generatedTexture = useMemo(
    () => createFounderPortraitTexture(founder, index),
    [founder, index],
  )
  const [loadedTexture, setLoadedTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!founder.imagePath) return
    let active = true
    const cached = assetCache.loadExternalTexture(founder.imagePath, (tex) => {
      if (active) setLoadedTexture(tex)
    })
    if (cached) setLoadedTexture(cached)
    return () => {
      active = false
    }
  }, [founder.imagePath])

  const texture = loadedTexture ?? generatedTexture

  const frameMaterials = useMemo(() => {
    return {
      backboard: assetCache.getMaterial(
        'founder-frame-backboard',
        () => new THREE.MeshStandardMaterial({ color: '#22150d', roughness: 0.7 }),
      ),
      navyMat: assetCache.getMaterial(
        'founder-frame-navymat',
        () => new THREE.MeshStandardMaterial({ color: '#0b1d3a', roughness: 0.65, metalness: 0.2 }),
      ),
      ivoryBorder: assetCache.getMaterial(
        'founder-frame-ivoryborder',
        () => new THREE.MeshStandardMaterial({ color: '#f7f4eb', roughness: 0.85 }),
      ),
      bracketGold: assetCache.getMaterial(
        'founder-sconce-gold',
        () => new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.3, metalness: 0.8 }),
      ),
      hoodDark: assetCache.getMaterial(
        'founder-sconce-hood',
        () => new THREE.MeshStandardMaterial({ color: '#22150d', roughness: 0.5, metalness: 0.4 }),
      ),
      bulbEmissive: assetCache.getMaterial(
        'founder-sconce-bulb',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#ffffff',
            emissive: '#fff2db',
            emissiveIntensity: 2.2,
          }),
      ),
    }
  }, [])

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(founder.id)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onHover(null)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(founder)
      }}
    >
      {/* 1. Dark Heritage Backboard */}
      <mesh position={[0, 0, -0.04]} castShadow>
        <boxGeometry args={[1.5, 1.9, 0.04]} />
        <primitive object={frameMaterials.backboard} attach="material" />
      </mesh>

      {/* 2. Ornate Gilded Gold Outer Frame */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.46, 1.86, 0.1]} />
        <meshStandardMaterial
          color={isSelected ? '#ffd966' : isHovered ? '#f5cf65' : '#d4af37'}
          emissive={isSelected ? 0xd4af37 : isHovered ? 0xb58a22 : 0x000000}
          emissiveIntensity={isSelected ? 0.45 : isHovered ? 0.25 : 0}
          roughness={0.28}
          metalness={0.88}
        />
      </mesh>

      {/* 3. Deep Navy Blue Velvet Inset Matting */}
      <mesh position={[0, 0, 0.03]} receiveShadow>
        <boxGeometry args={[1.28, 1.68, 0.08]} />
        <primitive object={frameMaterials.navyMat} attach="material" />
      </mesh>

      {/* 4. Warm Ivory Border */}
      <mesh position={[0, 0, 0.05]} receiveShadow>
        <boxGeometry args={[1.2, 1.6, 0.06]} />
        <primitive object={frameMaterials.ivoryBorder} attach="material" />
      </mesh>

      {/* 5. Portrait Artwork Canvas */}
      <mesh position={[0, 0, 0.085]}>
        <planeGeometry args={[1.14, 1.54]} />
        <meshStandardMaterial map={texture} roughness={0.5} />
      </mesh>

      {/* 6. Museum Spot Sconce Fixture Mounted Above Frame */}
      <group position={[0, 1.15, 0.12]}>
        {/* Wall bracket */}
        <mesh position={[0, 0, -0.15]}>
          <boxGeometry args={[0.08, 0.14, 0.04]} />
          <primitive object={frameMaterials.bracketGold} attach="material" />
        </mesh>
        {/* Extended arm */}
        <mesh position={[0, 0, -0.06]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 12]} />
          <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Lamp head shade */}
        <mesh position={[0, -0.04, 0.05]} rotation={[-0.7, 0, 0]}>
          <boxGeometry args={[0.34, 0.08, 0.12]} />
          <meshStandardMaterial color="#2d2217" roughness={0.5} metalness={0.6} />
        </mesh>
        {/* Luminous bulb */}
        <mesh position={[0, -0.07, 0.05]} rotation={[-0.7, 0, 0]}>
          <planeGeometry args={[0.3, 0.08]} />
          <meshStandardMaterial
            color="#fff6e5"
            emissive="#ffd9a0"
            emissiveIntensity={1.8}
            roughness={0.4}
          />
        </mesh>
        {/* Direct warm downlight cone onto the portrait */}
        <pointLight
          position={[0, -0.08, 0.06]}
          color="#ffe7ba"
          intensity={8}
          distance={3.2}
          decay={2}
        />
      </group>

      {/* 7. Hover Indicator Underneath */}
      {(isHovered || isSelected) && (
        <mesh position={[0, -1.05, 0.05]}>
          <boxGeometry args={[1.3, 0.04, 0.02]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
      )}
    </group>
  )
}

interface FoundersWingProps {
  selectedFounderId: string | null
  hoveredId: string | null
  onSelectFounder: (founder: Founder) => void
  onHover: (id: string | null) => void
}

/**
 * Sayap Tokoh Pendiri (Founders Wing - Left Side of Gallery)
 * Displays 13 photos of UNDIP's founders along the left wall.
 */
export function FoundersWing({
  selectedFounderId,
  hoveredId,
  onSelectFounder,
  onHover,
}: FoundersWingProps) {
  return (
    <group>
      {/* Wing Portal Sign / Header Banner along the left top wall */}
      <group position={[FOUNDERS_WALL_X + 0.1, 4.4, -6.0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[18.0, 0.5, 0.08]} />
          <meshStandardMaterial color="#0b1d3a" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.22, 0.04]}>
          <boxGeometry args={[18.0, 0.04, 0.02]} />
          <meshStandardMaterial color="#d4af37" roughness={0.25} metalness={0.88} />
        </mesh>
      </group>

      {/* The 13 Founder Portraits evenly arranged */}
      {UNDIP_FOUNDERS.map((founder, idx) => {
        const z = FOUNDERS_START_Z - idx * FOUNDERS_SPACING
        return (
          <FounderCard
            key={founder.id}
            founder={founder}
            index={idx}
            position={[FOUNDERS_WALL_X, FOUNDERS_FRAME_Y, z]}
            rotationY={Math.PI / 2}
            isSelected={selectedFounderId === founder.id}
            isHovered={hoveredId === founder.id}
            onSelect={onSelectFounder}
            onHover={onHover}
          />
        )
      })}
    </group>
  )
}
