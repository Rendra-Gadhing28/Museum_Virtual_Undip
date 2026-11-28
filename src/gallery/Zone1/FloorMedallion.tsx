import { useMemo } from 'react'
import * as THREE from 'three'
import { createFloorMedallionTexture } from './textures'
import { assetCache } from './cache'

interface FloorMedallionProps {
  position?: [number, number, number]
  radius?: number
}

/**
 * Ornamen Medallion Lantai Geometris Batik Pesisir Jawa (Diameter 4.8m)
 * Titik fokus orientasi di tengah Base Zone (Central Orientation Hall).
 * Sesuai panduan arsitektur: Travertine, Navy, Antique Gold, Inlay Kuningan.
 */
export function FloorMedallion({
  position = [0, 0.005, -6.0],
  radius = 2.4, // Diameter 4.8 meter
}: FloorMedallionProps) {
  const medallionTexture = useMemo(() => {
    return createFloorMedallionTexture()
  }, [])

  const materials = useMemo(() => {
    return {
      medallion: new THREE.MeshStandardMaterial({
        map: medallionTexture,
        roughness: 0.65,
        metalness: 0.12,
      }),
      outerBrassRim: assetCache.getMaterial(
        'medallion-brass-rim',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#B2935D',
            roughness: 0.32,
            metalness: 0.85,
          }),
      ),
    }
  }, [medallionTexture])

  return (
    <group position={position}>
      {/* 1. Medallion Tile Utama */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={materials.medallion}
      >
        <circleGeometry args={[radius, 64]} />
      </mesh>

      {/* 2. Cincin Kuningan Tipis (Brass Trim Lip) di batas medallion */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.002, 0]}
        receiveShadow
        material={materials.outerBrassRim}
      >
        <ringGeometry args={[radius - 0.05, radius + 0.04, 64]} />
      </mesh>
    </group>
  )
}
