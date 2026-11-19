import { useMemo } from 'react'
import * as THREE from 'three'
import type { MiniatureMapProps } from './types'
import { createCampusMiniatureTexture } from './textures'
import { assetCache } from './cache'

/**
 * 3D Miniature Map of Universitas Diponegoro (Tembalang & Pleburan Campus)
 * Situated on an ivory & heritage brown pedestal with a gold-trimmed glass vitrine.
 */
export function MiniatureMap({
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: MiniatureMapProps) {
  const mapTexture = useMemo(() => createCampusMiniatureTexture(), [])

  const baseMaterials = useMemo(() => {
    return {
      heritageBase: assetCache.getMaterial(
        'mini-heritage-base',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#3d2516',
            roughness: 0.5,
            metalness: 0.15,
          }),
      ),
      ivoryBody: assetCache.getMaterial(
        'mini-ivory-body',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#f7f4eb',
            roughness: 0.85,
            metalness: 0.05,
          }),
      ),
      navyInset: assetCache.getMaterial(
        'mini-navy-inset',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#0b1d3a',
            roughness: 0.45,
            metalness: 0.2,
          }),
      ),
      goldBrass: assetCache.getMaterial(
        'mini-gold-brass',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#d4af37',
            roughness: 0.28,
            metalness: 0.88,
          }),
      ),
      glass: assetCache.getMaterial(
        'mini-glass-vitrine',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.32,
            roughness: 0.05,
            metalness: 0.1,
          }),
      ),
      buildingWhite: assetCache.getMaterial(
        'mini-building-white',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#e8e4dc',
            roughness: 0.6,
          }),
      ),
      widyaRoofGold: assetCache.getMaterial(
        'mini-widya-gold',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#c59f48',
            roughness: 0.35,
            metalness: 0.65,
          }),
      ),
      waterBlue: assetCache.getMaterial(
        'mini-water-blue',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#1a5276',
            roughness: 0.1,
            metalness: 0.4,
          }),
      ),
      treeGreen: assetCache.getMaterial(
        'mini-tree-green',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#2d5a27',
            roughness: 0.9,
          }),
      ),
    }
  }, [])

  const goldAccentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#ffdf73' : isHovered ? '#f5cf65' : '#d4af37',
      emissive: isSelected ? '#d4af37' : isHovered ? '#a88020' : '#000000',
      emissiveIntensity: isSelected ? 0.35 : isHovered ? 0.2 : 0,
      roughness: 0.25,
      metalness: 0.85,
    })
  }, [isSelected, isHovered])

  const materials = {
    ...baseMaterials,
    goldAccent: goldAccentMaterial,
  }

  // Pedestal dimensions
  const pw = 2.6  // width
  const pl = 3.2  // length
  const ph = 0.82 // height

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover('miniature-map')
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onHover(null)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {/* 1. Pedestal Base Floor Ring (Heritage Brown Teak) */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[pw + 0.3, 0.08, pl + 0.3]} />
        <primitive object={materials.heritageBase} attach="material" />
      </mesh>

      {/* Gold Trim above floor ring */}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[pw + 0.26, 0.02, pl + 0.26]} />
        <primitive object={materials.goldBrass} attach="material" />
      </mesh>

      {/* 2. Main Pedestal Body (Museum Ivory) */}
      <mesh position={[0, ph / 2 + 0.09, 0]} castShadow receiveShadow>
        <boxGeometry args={[pw, ph, pl]} />
        <primitive object={materials.ivoryBody} attach="material" />
      </mesh>

      {/* Navy Blue Inset Decorative Panels on 4 sides */}
      {/* Front & Back Navy insets */}
      {[-1, 1].map((s) => (
        <mesh key={`fb-${s}`} position={[0, ph / 2 + 0.09, s * (pl / 2 + 0.005)]}>
          <planeGeometry args={[pw - 0.4, ph - 0.2]} />
          <primitive object={materials.navyInset} attach="material" />
        </mesh>
      ))}
      {/* Left & Right Navy insets */}
      {[-1, 1].map((s) => (
        <mesh
          key={`lr-${s}`}
          position={[s * (pw / 2 + 0.005), ph / 2 + 0.09, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[pl - 0.4, ph - 0.2]} />
          <primitive object={materials.navyInset} attach="material" />
        </mesh>
      ))}

      {/* 3. Front Informative Brass Plaque */}
      <group position={[0, ph * 0.65, pl / 2 + 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.22, 0.02]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>
      </group>

      {/* 4. Pedestal Top Table Lip (Heritage Brown with Gold Rim) */}
      <mesh position={[0, ph + 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[pw + 0.15, 0.05, pl + 0.15]} />
        <primitive object={materials.heritageBase} attach="material" />
      </mesh>
      <mesh position={[0, ph + 0.128, 0]}>
        <boxGeometry args={[pw + 0.18, 0.015, pl + 0.18]} />
        <primitive object={materials.goldBrass} attach="material" />
      </mesh>

      {/* 5. 3D Miniature Model Surface (Inside Vitrine) */}
      {/* Base Campus Terrain Board */}
      <mesh
        position={[0, ph + 0.14, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[pw - 0.1, pl - 0.1]} />
        <meshStandardMaterial map={mapTexture} roughness={0.7} />
      </mesh>

      {/* Miniature Campus Features in 3D */}
      <group position={[0, ph + 0.14, 0]}>
        {/* --- ICONIC WIDYA PURAYA CENTRAL BUILDING --- */}
        {/* Central Plaza Base */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.48, 0.04, 0.48]} />
          <primitive object={materials.ivoryBody} attach="material" />
        </mesh>
        {/* Widya Puraya Lower Pyramid Tier */}
        <mesh position={[0, 0.07, 0]} castShadow>
          <boxGeometry args={[0.36, 0.06, 0.36]} />
          <primitive object={materials.buildingWhite} attach="material" />
        </mesh>
        {/* Widya Puraya Mid Stepped Tier */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <boxGeometry args={[0.26, 0.05, 0.26]} />
          <primitive object={materials.widyaRoofGold} attach="material" />
        </mesh>
        {/* Widya Puraya Crown Pinnacle / Pyramid Top */}
        <mesh position={[0, 0.17, 0]} castShadow>
          <coneGeometry args={[0.12, 0.12, 4]} />
          <primitive object={materials.widyaRoofGold} attach="material" />
        </mesh>

        {/* --- UNDIP RESERVOIR (WADUK UNDIP) --- */}
        <mesh position={[-0.45, 0.005, 0.1]} rotation={[-Math.PI / 2, 0, 0.3]}>
          <circleGeometry args={[0.28, 24]} />
          <primitive object={materials.waterBlue} attach="material" />
        </mesh>

        {/* --- MINIATURE FACULTY BUILDINGS --- */}
        {/* Faculty of Engineering (Teknik) - Blue roofs */}
        <mesh position={[-0.65, 0.04, -0.6]} castShadow>
          <boxGeometry args={[0.35, 0.07, 0.24]} />
          <primitive object={materials.navyInset} attach="material" />
        </mesh>
        {/* Faculty of Law (Hukum) */}
        <mesh position={[0.62, 0.04, -0.6]} castShadow>
          <boxGeometry args={[0.32, 0.07, 0.22]} />
          <primitive object={materials.heritageBase} attach="material" />
        </mesh>
        {/* Faculty of Economics & Business (FEB) */}
        <mesh position={[-0.62, 0.04, 0.65]} castShadow>
          <boxGeometry args={[0.3, 0.06, 0.25]} />
          <primitive object={materials.buildingWhite} attach="material" />
        </mesh>
        {/* Faculty of Medicine (Kedokteran) & RSND */}
        <mesh position={[0.65, 0.05, 0.62]} castShadow>
          <boxGeometry args={[0.36, 0.08, 0.26]} />
          <primitive object={materials.buildingWhite} attach="material" />
        </mesh>
        {/* Diponegoro University Stadium */}
        <mesh position={[0, 0.02, 0.85]} castShadow>
          <cylinderGeometry args={[0.22, 0.24, 0.03, 24]} />
          <primitive object={materials.ivoryBody} attach="material" />
        </mesh>

        {/* Micro Campus Trees & Greenery */}
        {[
          [-0.25, -0.4],
          [0.25, -0.4],
          [-0.3, 0.4],
          [0.3, 0.4],
          [-0.8, 0.1],
          [0.8, -0.1],
          [0, -0.75],
        ].map(([tx, tz], ti) => (
          <mesh key={ti} position={[tx, 0.035, tz]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <primitive object={materials.treeGreen} attach="material" />
          </mesh>
        ))}

        {/* Mini Accent Spotlights inside the display vitrine */}
        <pointLight position={[0, 0.45, 0]} color="#fff0d0" intensity={12} distance={2.5} />
      </group>

      {/* 6. High-Clarity Glass Vitrine Case */}
      <group position={[0, ph + 0.14 + 0.35, 0]}>
        {/* Glass cube */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[pw - 0.08, 0.7, pl - 0.08]} />
          <primitive object={materials.glass} attach="material" />
        </mesh>

        {/* Brass Frame Ribs on Glass Corners */}
        {[-1, 1].map((sx) =>
          [-1, 1].map((sz) => (
            <mesh
              key={`post-${sx}-${sz}`}
              position={[sx * ((pw - 0.08) / 2), 0, sz * ((pl - 0.08) / 2)]}
            >
              <boxGeometry args={[0.02, 0.7, 0.02]} />
              <primitive object={materials.goldBrass} attach="material" />
            </mesh>
          )),
        )}

        {/* Top Brass Perimeter Rim */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[pw - 0.06, 0.025, pl - 0.06]} />
          <primitive object={materials.goldBrass} attach="material" />
        </mesh>
      </group>

      {/* 7. Hover / Selection Glow Indicator */}
      {(isHovered || isSelected) && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.7, 1.82, 32]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  )
}
