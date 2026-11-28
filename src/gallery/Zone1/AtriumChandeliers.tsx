import { useMemo } from 'react'
import * as THREE from 'three'
import { assetCache } from './cache'

/**
 * SingleChandelier — Model Chandelier Kristal Bertingkat Klasik
 * Terinspirasi langsung dari chandelier gantung di gambar referensi 1:
 * - Rangka kuningan emas berukir (*ornate gold/brass body*)
 * - 3 tingkatan mangkuk lilin (*candle cups*) dengan pendar cahaya hangat
 * - Untaian kristal prismatik menggantung berkilau (*cascading crystal pendants*)
 */
function SingleChandelier({
  position,
  scale = 1.0,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const mats = useMemo(() => {
    return {
      brass: assetCache.getMaterial('chan-brass', () => new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.25,
        metalness: 0.88,
      })),
      // Ultra-ringan: MeshStandardMaterial tanpa transmission buffer pass yang membebani GPU
      crystal: assetCache.getMaterial('chan-crystal-opt', () => new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.08,
        metalness: 0.15,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      })),
      candleBody: assetCache.getMaterial('chan-candle-body', () => new THREE.MeshStandardMaterial({
        color: '#fcf8f0',
        roughness: 0.45,
      })),
      candleFlame: assetCache.getMaterial('chan-flame', () => new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#fff2ce',
        emissiveIntensity: 5.0,
        roughness: 0.1,
      })),
    }
  }, [])

  // Geometri terbagi (Shared Geometries) untuk menghemat VRAM dan alokasi memori CPU
  const geoms = useMemo(() => ({
    chain: new THREE.CylinderGeometry(0.015, 0.015, 3.1, 6),
    crown: new THREE.SphereGeometry(0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    torus1: new THREE.TorusGeometry(0.5, 0.025, 6, 18),
    torus2: new THREE.TorusGeometry(0.9, 0.03, 6, 24),
    torus3: new THREE.TorusGeometry(1.35, 0.035, 6, 28),
    candle: new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6),
    flame: new THREE.SphereGeometry(0.025, 6, 6),
    crystal1: new THREE.ConeGeometry(0.035, 0.22, 5),
    crystal2: new THREE.ConeGeometry(0.04, 0.26, 5),
    crystal3: new THREE.ConeGeometry(0.045, 0.32, 5),
    bowl: new THREE.SphereGeometry(0.18, 12, 10),
    pendant: new THREE.OctahedronGeometry(0.14, 0),
  }), [])

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Rantai Gantung Logam ke Plafon */}
      <mesh position={[0, 1.55, 0]} geometry={geoms.chain} material={mats.brass} />

      {/* Kubah Mahkota Atas */}
      <mesh position={[0, 0.4, 0]} geometry={geoms.crown} material={mats.brass} />

      {/* Tingkat 1 (Atas - Diameter Kecil) */}
      <group position={[0, 0.1, 0]}>
        <mesh geometry={geoms.torus1} material={mats.brass} />
        {Array.from({ length: 6 }).map((_, i) => {
          const ang = (i / 6) * Math.PI * 2
          const cx = Math.cos(ang) * 0.5
          const cz = Math.sin(ang) * 0.5
          return (
            <group key={`c1-${i}`} position={[cx, 0, cz]}>
              <mesh position={[0, 0.08, 0]} geometry={geoms.candle} material={mats.candleBody} />
              <mesh position={[0, 0.16, 0]} geometry={geoms.flame} material={mats.candleFlame} />
              <mesh position={[0, -0.15, 0]} geometry={geoms.crystal1} material={mats.crystal} />
            </group>
          )
        })}
      </group>

      {/* Tingkat 2 (Tengah - Diameter Sedang) */}
      <group position={[0, -0.35, 0]}>
        <mesh geometry={geoms.torus2} material={mats.brass} />
        {Array.from({ length: 10 }).map((_, i) => {
          const ang = (i / 10) * Math.PI * 2
          const cx = Math.cos(ang) * 0.9
          const cz = Math.sin(ang) * 0.9
          return (
            <group key={`c2-${i}`} position={[cx, 0, cz]}>
              <mesh position={[0, 0.08, 0]} geometry={geoms.candle} material={mats.candleBody} />
              <mesh position={[0, 0.16, 0]} geometry={geoms.flame} material={mats.candleFlame} />
              <mesh position={[0, -0.18, 0]} geometry={geoms.crystal2} material={mats.crystal} />
            </group>
          )
        })}
      </group>

      {/* Tingkat 3 (Bawah - Diameter Akbar Utama) */}
      <group position={[0, -0.85, 0]}>
        <mesh geometry={geoms.torus3} material={mats.brass} />
        {Array.from({ length: 16 }).map((_, i) => {
          const ang = (i / 16) * Math.PI * 2
          const cx = Math.cos(ang) * 1.35
          const cz = Math.sin(ang) * 1.35
          return (
            <group key={`c3-${i}`} position={[cx, 0, cz]}>
              <mesh position={[0, 0.08, 0]} geometry={geoms.candle} material={mats.candleBody} />
              <mesh position={[0, 0.18, 0]} geometry={geoms.flame} material={mats.candleFlame} />
              <mesh position={[0, -0.22, 0]} geometry={geoms.crystal3} material={mats.crystal} />
            </group>
          )
        })}
      </group>

      {/* Mangkuk Bawah & Bandul Kristal Tengah */}
      <mesh position={[0, -1.2, 0]} geometry={geoms.bowl} material={mats.crystal} />
      <mesh position={[0, -1.45, 0]} geometry={geoms.pendant} material={mats.crystal} />
    </group>
  )
}

/**
 * AtriumChandeliers — 3 Chandelier Kristal Bertingkat di Sumbu Tengah Aula Atrium
 */
export function AtriumChandeliers({ isMobile }: { isMobile?: boolean }) {
  return (
    <group>
      {/* 1. Chandelier Utama Akbar di Pusat Atrium */}
      <SingleChandelier position={[0, 11.2, 0]} scale={1.25} />
      {!isMobile && (
        <pointLight
          position={[0, 10.0, 0]}
          color="#fff2ce"
          intensity={5.5}
          distance={18}
          decay={1.7}
        />
      )}

      {/* 2. Chandelier Belakang di Depan Mezzanine */}
      <SingleChandelier position={[0, 11.2, -9.0]} scale={1.1} />
      {!isMobile && (
        <pointLight
          position={[0, 10.0, -9.0]}
          color="#fff2ce"
          intensity={4.8}
          distance={16}
          decay={1.7}
        />
      )}

      {/* 3. Chandelier Depan dekat Gerbang Masuk */}
      <SingleChandelier position={[0, 11.2, 8.0]} scale={1.1} />
      {!isMobile && (
        <pointLight
          position={[0, 10.0, 8.0]}
          color="#fff2ce"
          intensity={4.8}
          distance={16}
          decay={1.7}
        />
      )}
    </group>
  )
}
