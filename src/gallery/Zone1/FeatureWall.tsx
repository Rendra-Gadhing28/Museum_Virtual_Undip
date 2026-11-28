import { useMemo } from 'react'
import * as THREE from 'three'
import { assetCache } from './cache'

interface FeatureWallProps {
  zBack: number
  height: number
  halfWidth: number
}

/**
 * Feature Wall Monumental UNDIP di Dinding Belakang Base Zone
 * - Panel Muted Navy (#23364F) & Dark Walnut
 * - Architrave & Framing Neoclassical dengan Moulding Gilded Gold (#B2935D)
 * - Emblem / Prasasti relief megah UNDIP
 * - Membingkai portal Pintu 05 (Cetak Biru Muladi Dome / Masa Depan) di sumbu tengah
 */
export function FeatureWall({ zBack, height, halfWidth: _halfWidth }: FeatureWallProps) {
  const materials = useMemo(() => {
    return {
      navyPanel: assetCache.getMaterial(
        'feature-navy-panel',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#23364F',
            roughness: 0.72,
            metalness: 0.08,
          }),
      ),
      goldRelief: assetCache.getMaterial(
        'feature-gold-relief',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#B2935D',
            roughness: 0.32,
            metalness: 0.82,
          }),
      ),
      walnutTrim: assetCache.getMaterial(
        'feature-walnut-trim',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#392D25',
            roughness: 0.85,
            metalness: 0.05,
          }),
      ),
      limestoneArch: assetCache.getMaterial(
        'feature-limestone-arch',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#D8CDBB',
            roughness: 0.8,
            metalness: 0.04,
          }),
      ),
    }
  }, [])

  return (
    <group position={[0, 0, zBack + 0.12]}>
      {/* 1. Backdrop Panel Navy Pusat (Lebar 9.6m, tinggi mengikuti hall) */}
      <mesh
        position={[0, height / 2, 0]}
        material={materials.navyPanel}
        receiveShadow
      >
        <planeGeometry args={[9.6, height]} />
      </mesh>

      {/* 2. Architrave Frame Kayu Walnut Keliling */}
      {/* Balok atas */}
      <mesh
        position={[0, height - 0.4, 0.04]}
        material={materials.walnutTrim}
        castShadow
      >
        <boxGeometry args={[9.8, 0.35, 0.12]} />
      </mesh>
      {/* Lis Emas Atas */}
      <mesh
        position={[0, height - 0.22, 0.06]}
        material={materials.goldRelief}
        castShadow
      >
        <boxGeometry args={[9.6, 0.06, 0.08]} />
      </mesh>

      {/* 3. Panel Entablature Tulisan Monumental UNDIP */}
      <group position={[0, height - 1.25, 0.06]}>
        <mesh material={materials.navyPanel} receiveShadow>
          <boxGeometry args={[6.8, 0.9, 0.08]} />
        </mesh>
        <mesh material={materials.goldRelief} position={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[6.7, 0.85, 0.02]} />
        </mesh>
        {/* Emblem Medallion Emas Pusat */}
        <mesh material={materials.goldRelief} position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.04, 32]} />
        </mesh>
      </group>

      {/* 4. Portal Arch Frame Membingkai Pintu 05 di Bagian Bawah */}
      {/* Tiang kiri portal pintu */}
      <mesh
        position={[-1.75, 2.1, 0.08]}
        material={materials.limestoneArch}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.35, 4.2, 0.18]} />
      </mesh>
      {/* Tiang kanan portal pintu */}
      <mesh
        position={[1.75, 2.1, 0.08]}
        material={materials.limestoneArch}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.35, 4.2, 0.18]} />
      </mesh>
      {/* Balok lengkung/ambang atas portal pintu */}
      <mesh
        position={[0, 4.3, 0.1]}
        material={materials.limestoneArch}
        castShadow
      >
        <boxGeometry args={[3.85, 0.4, 0.22]} />
      </mesh>
      <mesh
        position={[0, 4.45, 0.14]}
        material={materials.goldRelief}
        castShadow
      >
        <boxGeometry args={[3.7, 0.08, 0.1]} />
      </mesh>
    </group>
  )
}
