import { useMemo } from 'react'
import * as THREE from 'three'
import type { CeremonialPodiumProps } from './types'
import {
  createPodiumSealTexture,
  createPresidentTexture,
  createVicePresidentTexture,
} from './textures'
import { GarudaPancasila } from './GarudaPancasila'
import { HALL } from './layout'
import { assetCache } from './cache'

/**
 * Universitas Diponegoro Ceremonial Dais & Stage Installation
 * Features:
 * 1. Navy Blue rectangular accent wall expanding to cover the corners entirely.
 * 2. Golden Garuda Pancasila sculpture at the top center.
 * 3. Official framed portraits of President & Vice-President flanking Garuda.
 * 4. Official Universitas Diponegoro golden logo medallion underneath.
 * 5. Double ceremonial flags placed side-by-side on the left (Indonesia, then Undip)
 *    with a unified timber & brass flagpole stand underneath.
 * 6. Carved teakwood podium with Diponegoro crest on 2-tier dais.
 */
export function CeremonialPodium({
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: CeremonialPodiumProps) {
  const sealTexture = useMemo(() => createPodiumSealTexture(), [])
  const presTexture = useMemo(() => createPresidentTexture(), [])
  const vpTexture = useMemo(() => createVicePresidentTexture(), [])

  const baseMaterials = useMemo(() => {
    return {
      teakWood: assetCache.getMaterial(
        'pod-teak-wood',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#3d2516',
            roughness: 0.45,
            metalness: 0.12,
          }),
      ),
      darkTeakCarved: assetCache.getMaterial(
        'pod-dark-teak',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#2a180e',
            roughness: 0.5,
            metalness: 0.1,
          }),
      ),
      navyWallPanel: assetCache.getMaterial(
        'pod-navy-wall',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#081a33',
            roughness: 0.4,
            metalness: 0.2,
          }),
      ),
      navyPanel: assetCache.getMaterial(
        'pod-navy-panel',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#0b1d3a',
            roughness: 0.4,
            metalness: 0.25,
          }),
      ),
      goldTrim: assetCache.getMaterial(
        'pod-gold-trim',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#d4af37',
            roughness: 0.28,
            metalness: 0.85,
          }),
      ),
      redVelvet: assetCache.getMaterial(
        'pod-red-velvet',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#8b0000',
            roughness: 0.85,
            metalness: 0.05,
          }),
      ),
      microphoneChrome: assetCache.getMaterial(
        'pod-mic-chrome',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#222222',
            roughness: 0.2,
            metalness: 0.9,
          }),
      ),
      parchment: assetCache.getMaterial(
        'pod-parchment',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#fcf8ee',
            roughness: 0.7,
          }),
      ),
    }
  }, [])

  const goldBrass = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#ffdf73' : isHovered ? '#f5cf65' : '#d4af37',
      emissive: isSelected ? '#d4af37' : isHovered ? '#a88020' : '#000000',
      emissiveIntensity: isSelected ? 0.35 : isHovered ? 0.18 : 0,
      roughness: 0.25,
      metalness: 0.88,
    })
  }, [isSelected, isHovered])

  const materials = {
    ...baseMaterials,
    goldBrass,
  }

  const halfW = HALL.halfWidth
  const height = HALL.height
  const backWallZ = HALL.zBack + 0.08

  return (
    <group position={position}>
      {/* ============================================================
          1. NAVY BLUE RECTANGLE EXPANDING TO COVER THE CORNERS
          Spans the entire hall width (X = -halfW to +halfW) and floor to ceiling.
          ============================================================ */}
      <group position={[0, height / 2, backWallZ - position[2]]}>
        {/* Full-width Navy Blue Wall Covering the corners completely */}
        <mesh receiveShadow>
          <planeGeometry args={[halfW * 2, height]} />
          <primitive object={materials.navyWallPanel} attach="material" />
        </mesh>

        {/* Gold Architectural Perimeter Frame molding covering the corners */}
        {/* Top gold beam */}
        <mesh position={[0, height / 2 - 0.15, 0.02]}>
          <boxGeometry args={[halfW * 2, 0.08, 0.04]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>
        {/* Bottom gold beam */}
        <mesh position={[0, -height / 2 + 0.2, 0.02]}>
          <boxGeometry args={[halfW * 2, 0.08, 0.04]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>
        {/* Left & Right corner gold pillars */}
        {[-halfW + 0.06, halfW - 0.06].map((cx, ci) => (
          <mesh key={ci} position={[cx, 0, 0.03]}>
            <boxGeometry args={[0.12, height, 0.06]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
        ))}

        {/* ============================================================
            2. PATUNG LAMBANG GARUDA PANCASILA (TOP CENTER)
            Elevated higher to utilize the full 8.8m ceiling height
            ============================================================ */}
        <GarudaPancasila position={[0, 2.4, 0.15]} scale={1.6} />

        {/* Gold decorative horizontal divider line below Garuda */}
        <mesh position={[0, 1.3, 0.04]}>
          <boxGeometry args={[3.6, 0.025, 0.02]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>
        <mesh position={[0, 1.26, 0.04]}>
          <boxGeometry args={[2.4, 0.01, 0.02]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>

        {/* ============================================================
            3. DUA FOTO RESMI: PRESIDEN & WAKIL PRESIDEN RI
            Flanking the Garuda Pancasila — lowered to 0.3 for visibility
            ============================================================ */}
        {/* Foto Presiden RI (Sisi Kiri Penonton) */}
        <group position={[-2.4, 0.3, 0.12]}>
          {/* Gilded Gold Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.82, 0.08]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.025]} receiveShadow>
            <boxGeometry args={[1.24, 1.66, 0.05]} />
            <meshStandardMaterial color="#0b1d3a" roughness={0.5} />
          </mesh>
          {/* Presidential Canvas */}
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[1.14, 1.56]} />
            <meshStandardMaterial map={presTexture} roughness={0.5} />
          </mesh>
          {/* Name plaque below portrait */}
          <mesh position={[0, -1.0, 0.05]}>
            <boxGeometry args={[1.1, 0.12, 0.02]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
        </group>

        {/* Foto Wakil Presiden RI (Sisi Kanan Penonton) */}
        <group position={[2.4, 0.3, 0.12]}>
          {/* Gilded Gold Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.82, 0.08]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.025]} receiveShadow>
            <boxGeometry args={[1.24, 1.66, 0.05]} />
            <meshStandardMaterial color="#0b1d3a" roughness={0.5} />
          </mesh>
          {/* Vice-Presidential Canvas */}
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[1.14, 1.56]} />
            <meshStandardMaterial map={vpTexture} roughness={0.5} />
          </mesh>
          {/* Name plaque below portrait */}
          <mesh position={[0, -1.0, 0.05]}>
            <boxGeometry args={[1.1, 0.12, 0.02]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
        </group>

        {/* ============================================================
            4. LAMBANG / LOGO BESAR UNIVERSITAS DIPONEGORO
            Centered between the presidential portraits, below the Garuda divider
            ============================================================ */}
        <group position={[0, -0.9, 0.16]}>
          {/* Outer Gold Medallion Rim */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.80, 0.80, 0.06, 48]} />
            <primitive object={materials.goldBrass} attach="material" />
          </mesh>
          {/* Inner Navy Sunken Plate */}
          <mesh position={[0, 0, 0.035]}>
            <circleGeometry args={[0.72, 48]} />
            <primitive object={materials.navyPanel} attach="material" />
          </mesh>
          {/* Official Undip Emblem Texture */}
          <mesh position={[0, 0, 0.04]}>
            <circleGeometry args={[0.68, 48]} />
            <meshStandardMaterial map={sealTexture} transparent roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Gold ring accent outside the medallion */}
          <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.84, 0.025, 8, 48]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          5. STAGE DAIS & CEREMONIAL PODIUM
          ============================================================ */}
      <group
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover('podium')
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
        {/* Tier 1 Stage Platform */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.6, 0.2, 3.6]} />
          <primitive object={materials.teakWood} attach="material" />
        </mesh>
        <mesh position={[0, 0.19, 1.8]}>
          <boxGeometry args={[5.64, 0.02, 0.04]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>

        {/* Tier 2 Stage Platform */}
        <mesh position={[0, 0.26, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.16, 2.8]} />
          <primitive object={materials.darkTeakCarved} attach="material" />
        </mesh>
        <mesh position={[0, 0.33, 1.2]}>
          <boxGeometry args={[4.84, 0.02, 0.04]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>

        {/* Red Carpet on Stage Top */}
        <mesh position={[0, 0.345, 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.6, 2.4]} />
          <primitive object={materials.redVelvet} attach="material" />
        </mesh>

        {/* Podium Structure */}
        <group position={[0, 0.34, 0.35]}>
          {/* Base Plinth */}
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.1, 0.8]} />
            <primitive object={materials.darkTeakCarved} attach="material" />
          </mesh>
          <mesh position={[0, 0.105, 0]}>
            <boxGeometry args={[1.16, 0.015, 0.76]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>

          {/* Podium Column Body */}
          <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.86, 0.65]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>

          {/* Navy Blue Front Inset */}
          <mesh position={[0, 0.58, 0.33]}>
            <planeGeometry args={[0.82, 0.7]} />
            <primitive object={materials.navyPanel} attach="material" />
          </mesh>
          <mesh position={[0, 0.58, 0.332]}>
            <boxGeometry args={[0.84, 0.72, 0.01]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>

          {/* Gold Medallion on Podium Front */}
          <mesh position={[0, 0.65, 0.34]}>
            <circleGeometry args={[0.22, 32]} />
            <meshStandardMaterial map={sealTexture} transparent roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.34, 0.34]}>
            <boxGeometry args={[0.7, 0.08, 0.015]} />
            <primitive object={materials.goldBrass} attach="material" />
          </mesh>

          {/* Slanted Reading Desk */}
          <group position={[0, 1.05, 0]} rotation={[0.22, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.12, 0.08, 0.75]} />
              <primitive object={materials.darkTeakCarved} attach="material" />
            </mesh>
            <mesh position={[0, 0.045, 0]}>
              <planeGeometry args={[0.96, 0.6]} />
              <primitive object={materials.navyPanel} attach="material" />
            </mesh>
            <mesh position={[0, 0.06, 0.35]}>
              <boxGeometry args={[1.0, 0.04, 0.04]} />
              <primitive object={materials.goldTrim} attach="material" />
            </mesh>

            {/* Scroll */}
            <mesh position={[0, 0.055, 0.05]} rotation={[0, 0.05, 0]}>
              <planeGeometry args={[0.38, 0.48]} />
              <primitive object={materials.parchment} attach="material" />
            </mesh>

            {/* Condenser Studio Gooseneck Microphone with Pop Filter */}
            <group position={[0.26, 0.05, -0.15]}>
              {/* Heavy Metal Base Mount */}
              <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.05, 0.025, 16]} />
                <primitive object={materials.goldTrim} attach="material" />
              </mesh>
              {/* Articulated Shockmount Stem */}
              <mesh position={[0, 0.16, 0.05]} rotation={[0.3, 0, 0]} castShadow>
                <cylinderGeometry args={[0.009, 0.009, 0.3, 10]} />
                <primitive object={materials.microphoneChrome} attach="material" />
              </mesh>
              {/* Condenser Capsule Body (Black & Gold) */}
              <group position={[0, 0.32, 0.12]} rotation={[0.4, 0, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.018, 0.018, 0.08, 16]} />
                  <primitive object={materials.microphoneChrome} attach="material" />
                </mesh>
                {/* Gold Capsule Grill Band */}
                <mesh position={[0, 0.02, 0]}>
                  <cylinderGeometry args={[0.019, 0.019, 0.03, 16]} />
                  <primitive object={materials.goldTrim} attach="material" />
                </mesh>
                {/* Studio Pop Filter Disk */}
                <mesh position={[0, 0.01, 0.04]} rotation={[0, 0, 0]}>
                  <cylinderGeometry args={[0.032, 0.032, 0.004, 20]} />
                  <meshStandardMaterial color="#111111" roughness={0.9} />
                </mesh>
              </group>
            </group>

            {/* Secondary Gooseneck Backup Mic */}
            <group position={[-0.26, 0.05, -0.18]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.03, 0.04, 0.02, 14]} />
                <primitive object={materials.goldTrim} attach="material" />
              </mesh>
              <mesh position={[0, 0.14, 0.04]} rotation={[0.35, 0, -0.1]} castShadow>
                <cylinderGeometry args={[0.008, 0.008, 0.28, 8]} />
                <primitive object={materials.microphoneChrome} attach="material" />
              </mesh>
              <mesh position={[-0.02, 0.28, 0.11]} rotation={[0.45, 0, -0.1]} castShadow>
                <cylinderGeometry args={[0.014, 0.014, 0.05, 12]} />
                <primitive object={materials.microphoneChrome} attach="material" />
              </mesh>
            </group>
          </group>

          {/* Spotlight for Podium */}
          <pointLight position={[0, 1.8, 0.2]} color="#fff3db" intensity={24} distance={5} />
        </group>

        {/* ============================================================
            6. BENDERA BERADA DI SISI KIRI PODIUM & MUNDUR >= 2 METER
            - Arah pandang pintu utama: Sisi Kiri Podium (X negatif: -3.2)
            - Mundur >= 2 meter di belakang podium (Z negatif: -2.35)
            - Urutan dari kiri ke kanan: Indonesia (Merah Putih), lalu Pataka Undip
            - Penyangga tongkat bersama kayu jati & kuningan emas yang diperlebar
            ============================================================ */}
        <group position={[-3.2, 0, -2.35]}>
          {/* Lantai Kayu Penyangga Tongkat Bersama yang Diperlebar */}
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.16, 0.8]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>
          <mesh position={[0, 0.165, 0]}>
            <boxGeometry args={[2.34, 0.02, 0.74]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>

          {/* Dua Soket Dudukan Kuningan dengan Jarak yang Diperlebar (1.1m) */}
          {[-0.55, 0.55].map((sx, si) => (
            <mesh key={si} position={[sx, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.085, 0.12, 16]} />
              <primitive object={materials.goldBrass} attach="material" />
            </mesh>
          ))}

          {/* 6A. BENDERA PERTAMA (SISI KIRI): BENDERA INDONESIA (MERAH PUTIH) */}
          <group position={[-0.55, 0.22, 0]}>
            {/* Tongkat Tiang Emas */}
            <mesh position={[0, 1.8, 0]} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 3.6, 16]} />
              <primitive object={materials.goldBrass} attach="material" />
            </mesh>
            {/* Ujung Tombak Finial */}
            <mesh position={[0, 3.65, 0]}>
              <coneGeometry args={[0.055, 0.18, 12]} />
              <primitive object={materials.goldBrass} attach="material" />
            </mesh>
            {/* Kain Bendera Merah Putih */}
            <mesh position={[0.48, 2.85, 0]} rotation={[0, 0.08, 0]} castShadow>
              <planeGeometry args={[0.95, 0.38]} />
              <meshStandardMaterial color="#c4161c" roughness={0.7} />
            </mesh>
            <mesh position={[0.48, 2.47, 0]} rotation={[0, 0.08, 0]} castShadow>
              <planeGeometry args={[0.95, 0.38]} />
              <meshStandardMaterial color="#ffffff" roughness={0.7} />
            </mesh>
          </group>

          {/* 6B. BENDERA KEDUA (SISI KANAN / MENUJU PODIUM): BENDERA PATAKA UNDIP */}
          <group position={[0.55, 0.22, 0]}>
            {/* Tongkat Tiang Emas */}
            <mesh position={[0, 1.8, 0]} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 3.6, 16]} />
              <primitive object={materials.goldBrass} attach="material" />
            </mesh>
            {/* Ujung Tombak Finial */}
            <mesh position={[0, 3.65, 0]}>
              <coneGeometry args={[0.055, 0.18, 12]} />
              <primitive object={materials.goldBrass} attach="material" />
            </mesh>
            {/* Kain Pataka Undip: Navy Blue dengan Rumbai Emas */}
            <mesh position={[0.48, 2.66, 0]} rotation={[0, -0.08, 0]} castShadow>
              <planeGeometry args={[0.95, 0.76]} />
              <primitive object={materials.navyPanel} attach="material" />
            </mesh>
            {/* Lambang Emas Undip pada Pataka */}
            <mesh position={[0.48, 2.66, 0.005]} rotation={[0, -0.08, 0]}>
              <circleGeometry args={[0.2, 24]} />
              <meshStandardMaterial map={sealTexture} transparent roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* Hover Highlight Ring */}
        {(isHovered || isSelected) && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.8, 2.95, 32]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.7} />
          </mesh>
        )}
      </group>
    </group>
  )
}
