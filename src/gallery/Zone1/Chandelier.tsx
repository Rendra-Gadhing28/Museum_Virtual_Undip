import { useMemo } from 'react'
import * as THREE from 'three'
import { assetCache } from './cache'

interface ChandelierProps {
  position: [number, number, number]
  scale?: number
  isMobile?: boolean
}

/**
 * 3D Grand Multi-Tiered Luxury Crystal Chandelier (Lampu Gantung Mewah)
 * Matches the reference image: circular tiered crystal prisms, gold brass framework,
 * and warm interior candle/filament glow.
 */
export function Chandelier({ position, scale = 1, isMobile = false }: ChandelierProps) {
  const materials = useMemo(() => {
    return {
      goldBrass: assetCache.getMaterial(
        'chand-gold-brass',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#B2935D',
            roughness: 0.36,
            metalness: 0.78,
          }),
      ),
      crystalPrism: assetCache.getMaterial(
        'chand-crystal-prism',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.75,
            roughness: 0.05,
            metalness: 0.2,
          }),
      ),
      lightGlow: assetCache.getMaterial(
        'chand-light-glow',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#fffaf2',
            emissive: '#fff6e8',
            emissiveIntensity: 2.0,
          }),
      ),
    }
  }, [])

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* 1. Ceiling Canopy Rosette (Gold mount attached to the ceiling) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.38, 0.08, 24]} />
        <primitive object={materials.goldBrass} attach="material" />
      </mesh>

      {/* 2. Central Suspension Rod & Decorative Baluster */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.2, 16]} />
        <primitive object={materials.goldBrass} attach="material" />
      </mesh>
      <mesh position={[0, -1.25, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <primitive object={materials.goldBrass} attach="material" />
      </mesh>

      {/* 3. Tier 1 (Top Tier - Diameter ~1.4m) */}
      <group position={[0, -1.45, 0]}>
        {/* Gold Circular Support Ring */}
        <mesh>
          <torusGeometry args={[0.7, 0.03, 12, 36]} />
          <primitive object={materials.goldBrass} attach="material" />
        </mesh>
        {/* Crystal Prisms hanging around Tier 1 */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.7, 0.72, 0.38, isMobile ? 16 : 24, 1, true]} />
          <primitive object={materials.crystalPrism} attach="material" />
        </mesh>
      </group>

      {/* 4. Tier 2 (Middle Tier - Diameter ~1.0m) */}
      <group position={[0, -1.75, 0]}>
        <mesh>
          <torusGeometry args={[0.5, 0.028, 12, isMobile ? 16 : 24]} />
          <primitive object={materials.goldBrass} attach="material" />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.5, 0.52, 0.32, isMobile ? 16 : 24, 1, true]} />
          <primitive object={materials.crystalPrism} attach="material" />
        </mesh>
      </group>

      {/* 5. Tier 3 (Bottom Tier - Diameter ~0.6m) */}
      <group position={[0, -2.0, 0]}>
        <mesh>
          <torusGeometry args={[0.3, 0.025, 12, isMobile ? 12 : 20]} />
          <primitive object={materials.goldBrass} attach="material" />
        </mesh>
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.3, 0.32, 0.26, isMobile ? 12 : 18, 1, true]} />
          <primitive object={materials.crystalPrism} attach="material" />
        </mesh>
        {/* Bottom Crystal Pendant Finial */}
        <mesh position={[0, -0.32, 0]}>
          <octahedronGeometry args={[0.09, 0]} />
          <primitive object={materials.crystalPrism} attach="material" />
        </mesh>
      </group>

      {/* 6. Internal Glowing Bulbs Core */}
      <group position={[0, -1.7, 0]}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <primitive object={materials.lightGlow} attach="material" />
        </mesh>
      </group>
    </group>
  )
}
