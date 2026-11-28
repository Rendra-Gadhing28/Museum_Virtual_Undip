import { useMemo } from 'react'
import * as THREE from 'three'
import { assetCache } from './cache'

interface OrientationDeskProps {
  position?: [number, number, number]
  rotationY?: number
}

/**
 * Orientation & Information Desk dekat Main Entrance Base Zone
 * Desain: Kayu Walnut (#392D25), panel depan Warm Ivory (#E9E1D3), lis kuningan (#B2935D),
 * dilengkapi layar/denah informasi orientasi museum.
 */
export function OrientationDesk({
  position = [4.2, 0, 8.5],
  rotationY = -Math.PI / 4,
}: OrientationDeskProps) {
  const materials = useMemo(() => {
    return {
      walnut: assetCache.getMaterial(
        'desk-walnut',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#392D25',
            roughness: 0.76,
            metalness: 0.04,
          }),
      ),
      ivoryPlaster: assetCache.getMaterial(
        'desk-ivory',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#E9E1D3',
            roughness: 0.88,
            metalness: 0.02,
          }),
      ),
      brass: assetCache.getMaterial(
        'desk-brass',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#B2935D',
            roughness: 0.35,
            metalness: 0.82,
          }),
      ),
      screenGlow: assetCache.getMaterial(
        'desk-screen-glow',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#1a2b3c',
            emissive: '#102235',
            emissiveIntensity: 0.8,
            roughness: 0.2,
          }),
      ),
    }
  }, [])

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Countertop Kayu Walnut (Lengkung / Sudut L) */}
      <mesh
        position={[0, 0.98, 0]}
        material={materials.walnut}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.2, 0.08, 0.9]} />
      </mesh>

      {/* 2. Badan Meja Ivory dengan Wainscoting Profil */}
      <mesh
        position={[0, 0.47, 0]}
        material={materials.ivoryPlaster}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.08, 0.94, 0.78]} />
      </mesh>

      {/* 3. Plinth Bawah & Trim Lis Kuningan */}
      <mesh
        position={[0, 0.05, 0]}
        material={materials.brass}
        castShadow
      >
        <boxGeometry args={[2.14, 0.1, 0.82]} />
      </mesh>
      <mesh
        position={[0, 0.92, 0]}
        material={materials.brass}
        castShadow
      >
        <boxGeometry args={[2.14, 0.04, 0.82]} />
      </mesh>

      {/* 4. Display Panduan Digital / Orientation Touchscreen di atas Meja */}
      <group position={[0, 1.15, -0.05]} rotation={[-Math.PI / 6, 0, 0]}>
        {/* Frame layar */}
        <mesh material={materials.brass} castShadow>
          <boxGeometry args={[0.9, 0.55, 0.05]} />
        </mesh>
        {/* Permukaan layar interaktif */}
        <mesh position={[0, 0, 0.03]} material={materials.screenGlow}>
          <planeGeometry args={[0.82, 0.47]} />
        </mesh>
      </group>
    </group>
  )
}
