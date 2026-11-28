import React, { useMemo } from 'react'
import * as THREE from 'three'
import { assetCache } from './cache'

interface ColumnProps {
  position: [number, number, number]
  height?: number
  diameter?: number
}

/**
 * Satu Kolom Neoclassical Bergalur (Fluted Column)
 * Material: Cream Limestone (#D8CDBB)
 * Struktur: Plinth/Base bertingkat, Poros bergalur vertikal (flutes), Capital Tuscan/Ionic yang disederhanakan
 */
export function NeoclassicalColumn({
  position,
  height = 8.8,
  diameter = 0.72,
}: ColumnProps) {
  const materials = useMemo(() => {
    return {
      limestone: assetCache.getMaterial(
        'column-limestone',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#D8CDBB',
            roughness: 0.82,
            metalness: 0.04,
          }),
      ),
      limestoneDark: assetCache.getMaterial(
        'column-limestone-dark',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#C6B9A3',
            roughness: 0.86,
            metalness: 0.04,
          }),
      ),
      brassTrim: assetCache.getMaterial(
        'column-brass-trim',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#B2935D',
            roughness: 0.38,
            metalness: 0.75,
          }),
      ),
    }
  }, [])

  const radius = diameter / 2
  const shaftHeight = height - 1.2

  return (
    <group position={position}>
      {/* 1. Pedestal / Plinth bertingkat bawah */}
      <mesh
        position={[0, 0.15, 0]}
        material={materials.limestoneDark}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[diameter * 1.5, 0.3, diameter * 1.5]} />
      </mesh>
      <mesh
        position={[0, 0.38, 0]}
        material={materials.limestone}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[radius * 1.35, radius * 1.45, 0.2, 24]} />
      </mesh>
      <mesh
        position={[0, 0.52, 0]}
        material={materials.brassTrim}
        castShadow
      >
        <cylinderGeometry args={[radius * 1.25, radius * 1.25, 0.08, 24]} />
      </mesh>

      {/* 2. Shaft Silinder Bergalur (Fluted Shaft) */}
      <mesh
        position={[0, 0.56 + shaftHeight / 2, 0]}
        material={materials.limestone}
        castShadow
        receiveShadow
      >
        {/* Menggunakan 24 segmen radial untuk efek facet/fluted neoclassical */}
        <cylinderGeometry
          args={[radius * 0.92, radius, shaftHeight, 24, 1, false]}
        />
      </mesh>

      {/* 3. Cincin Leher Atas Brass */}
      <mesh
        position={[0, 0.56 + shaftHeight + 0.05, 0]}
        material={materials.brassTrim}
        castShadow
      >
        <cylinderGeometry args={[radius * 1.05, radius * 0.96, 0.08, 24]} />
      </mesh>

      {/* 4. Capital Neoclassical Sederhana */}
      <mesh
        position={[0, 0.56 + shaftHeight + 0.2, 0]}
        material={materials.limestone}
        castShadow
      >
        <cylinderGeometry args={[radius * 1.35, radius * 1.05, 0.22, 24]} />
      </mesh>

      {/* 5. Abacus Kotak Puncak Kolom */}
      <mesh
        position={[0, 0.56 + shaftHeight + 0.36, 0]}
        material={materials.limestoneDark}
        castShadow
      >
        <boxGeometry args={[diameter * 1.4, 0.14, diameter * 1.4]} />
      </mesh>
    </group>
  )
}

interface ColonadeProps {
  halfWidth: number
  height: number
  zFront: number
  zBack: number
}

/**
 * Barisan Kolom Monumental di sepanjang dinding Base Zone
 * Diposisikan secara ritmis membingkai aula dan bukaan pintu tanpa menghalangi sirkulasi
 */
export function NeoclassicalColonnade({
  halfWidth,
  height,
  zFront: _zFront,
  zBack,
}: ColonadeProps) {
  // Posisi Z pilar diatur simetris agar ritmis dan tidak menabrak pintu galeri
  // Pintu Kiri: z = 3.0 & z = -9.0; Pintu Kanan: z = 3.0 & z = -9.0
  const columnZPositions = useMemo(() => {
    return [
      9.0,    // Dekat pintu masuk
      6.5,    // Antara entrance & Pintu 01/03
      -3.0,   // Antara Pintu 01/03 dan Pintu 02/04
      -15.0,  // Melewati Pintu 02/04
      -21.5,  // Membingkai area belakang
    ]
  }, [])

  const colX = halfWidth - 0.75

  return (
    <group>
      {columnZPositions.map((z, idx) => (
        <React.Fragment key={`col-pair-${idx}`}>
          {/* Kolom Sisi Kiri */}
          <NeoclassicalColumn
            position={[-colX, 0, z]}
            height={height}
            diameter={0.72}
          />
          {/* Kolom Sisi Kanan */}
          <NeoclassicalColumn
            position={[colX, 0, z]}
            height={height}
            diameter={0.72}
          />
        </React.Fragment>
      ))}

      {/* Kolom Kembar Membingkai Feature Wall di Dinding Belakang */}
      <NeoclassicalColumn
        position={[-3.2, 0, zBack + 0.8]}
        height={height}
        diameter={0.75}
      />
      <NeoclassicalColumn
        position={[3.2, 0, zBack + 0.8]}
        height={height}
        diameter={0.75}
      />
    </group>
  )
}
