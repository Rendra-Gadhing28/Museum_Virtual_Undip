import { useMemo } from 'react'
import * as THREE from 'three'
import { assetCache } from './cache'

interface StatueProps {
  position: [number, number, number]
  rotationY?: number
}

/**
 * 3D Monumental Statue of Pangeran Diponegoro on a Rearing Horse
 * Dedicated monument honoring the national hero and patron of Universitas Diponegoro.
 */
export function DiponegoroStatue({ position, rotationY = 0 }: StatueProps) {
  const materials = useMemo(() => {
    return {
      bronzeStatue: assetCache.getMaterial(
        'statue-bronze',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#362b20',
            roughness: 0.35,
            metalness: 0.8,
          }),
      ),
      goldAccent: assetCache.getMaterial(
        'statue-gold',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#d4af37',
            roughness: 0.28,
            metalness: 0.88,
          }),
      ),
      marblePlinth: assetCache.getMaterial(
        'statue-marble',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#f5f0e6',
            roughness: 0.4,
            metalness: 0.1,
          }),
      ),
      teakBase: assetCache.getMaterial(
        'statue-teak',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#3d2516',
            roughness: 0.5,
          }),
      ),
      navyPlate: assetCache.getMaterial(
        'statue-navy',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#0b1d3a',
            roughness: 0.4,
          }),
      ),
    }
  }, [])

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Pedestal Base (Heritage Brown Teak & Gold) */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.16, 2.8]} />
        <primitive object={materials.teakBase} attach="material" />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[1.94, 0.02, 2.74]} />
        <primitive object={materials.goldAccent} attach="material" />
      </mesh>

      {/* 2. Main Marble Pedestal Body */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.95, 2.4]} />
        <primitive object={materials.marblePlinth} attach="material" />
      </mesh>

      {/* Navy & Gold Inscription Plaque on Pedestal Front */}
      <group position={[0, 0.65, 1.21]}>
        <mesh castShadow>
          <boxGeometry args={[1.3, 0.42, 0.02]} />
          <primitive object={materials.navyPlate} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[1.34, 0.44, 0.01]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>
      </group>

      {/* Pedestal Top Table Lip with Gold Trim */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.82, 0.06, 2.52]} />
        <primitive object={materials.teakBase} attach="material" />
      </mesh>
      <mesh position={[0, 1.185, 0]}>
        <boxGeometry args={[1.86, 0.015, 2.56]} />
        <primitive object={materials.goldAccent} attach="material" />
      </mesh>

      {/* 3. Bronze Sculpture: Rearing Horse & Pangeran Diponegoro */}
      <group position={[0, 1.2, 0]}>
        {/* Horse Base Plinth Plate */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[1.2, 0.08, 1.9]} />
          <primitive object={materials.bronzeStatue} attach="material" />
        </mesh>

        {/* --- HORSE BODY (REARING STANCE) --- */}
        {/* Main Torso (Angled upward in rearing pose) */}
        <mesh position={[0, 0.85, -0.1]} rotation={[-0.55, 0, 0]} castShadow>
          <boxGeometry args={[0.52, 0.65, 1.2]} />
          <primitive object={materials.bronzeStatue} attach="material" />
        </mesh>

        {/* Horse Chest & Neck (Rising high) */}
        <mesh position={[0, 1.35, 0.35]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.75, 0.48]} />
          <primitive object={materials.bronzeStatue} attach="material" />
        </mesh>

        {/* Horse Head with alert ears */}
        <group position={[0, 1.78, 0.52]} rotation={[0.2, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.32, 0.52]} />
            <primitive object={materials.bronzeStatue} attach="material" />
          </mesh>
          {/* Muzzle */}
          <mesh position={[0, -0.08, 0.28]} castShadow>
            <boxGeometry args={[0.22, 0.2, 0.24]} />
            <primitive object={materials.bronzeStatue} attach="material" />
          </mesh>
          {/* Ears */}
          {[-0.09, 0.09].map((ex, ei) => (
            <mesh key={ei} position={[ex, 0.22, -0.1]} rotation={[-0.2, 0, ei === 0 ? -0.2 : 0.2]} castShadow>
              <coneGeometry args={[0.04, 0.14, 8]} />
              <primitive object={materials.bronzeStatue} attach="material" />
            </mesh>
          ))}
        </group>

        {/* Front Legs (Rearing into the air) */}
        {/* Left Front Leg (Raised high) */}
        <group position={[-0.22, 1.25, 0.3]} rotation={[0.7, 0, -0.15]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.5, 10]} />
            <primitive object={materials.bronzeStatue} attach="material" />
          </mesh>
          <mesh position={[0, -0.6, 0.12]} rotation={[-0.8, 0, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.045, 0.45, 10]} />
            <primitive object={materials.bronzeStatue} attach="material" />
          </mesh>
          <mesh position={[0, -0.84, 0.26]} castShadow>
            <cylinderGeometry args={[0.055, 0.065, 0.09, 10]} />
            <primitive object={materials.goldAccent} attach="material" />
          </mesh>
        </group>

        {/* Right Front Leg (Bent in gallop) */}
        <group position={[0.22, 1.35, 0.2]} rotation={[0.9, 0, 0.15]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.45, 10]} />
            <primitive object={materials.bronzeStatue} attach="material" />
          </mesh>
          <mesh position={[0, -0.5, 0.16]} rotation={[-1.1, 0, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.045, 0.42, 10]} />
            <primitive object={materials.bronzeStatue} attach="material" />
          </mesh>
          <mesh position={[0, -0.72, 0.3]} castShadow>
            <cylinderGeometry args={[0.055, 0.065, 0.09, 10]} />
            <primitive object={materials.goldAccent} attach="material" />
          </mesh>
        </group>

        {/* Hind Legs (Firmly planted, bearing weight) */}
        {[-0.22, 0.22].map((hx, hi) => (
          <group key={hi} position={[hx, 0.55, -0.55]}>
            <mesh position={[0, -0.05, 0]} rotation={[-0.3, 0, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.08, 0.55, 10]} />
              <primitive object={materials.bronzeStatue} attach="material" />
            </mesh>
            <mesh position={[0, -0.38, 0]} rotation={[0.2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.06, 0.48, 10]} />
              <primitive object={materials.bronzeStatue} attach="material" />
            </mesh>
            <mesh position={[0, -0.58, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.08, 0.1, 10]} />
              <primitive object={materials.goldAccent} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Horse Tail (Flowing downward) */}
        <mesh position={[0, 0.65, -0.85]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.03, 0.75, 10]} />
          <primitive object={materials.bronzeStatue} attach="material" />
        </mesh>

        {/* --- PANGERAN DIPONEGORO (THE NOBLE RIDER) --- */}
        <group position={[0, 1.25, -0.08]}>
          {/* Saddle & Horse Tack with Gold Accents */}
          <mesh position={[0, -0.08, 0]} castShadow>
            <boxGeometry args={[0.56, 0.14, 0.6]} />
            <primitive object={materials.goldAccent} attach="material" />
          </mesh>

          {/* Torso & Flowing Javanese Royal Robe */}
          <mesh position={[0, 0.38, 0]} castShadow>
            <boxGeometry args={[0.46, 0.62, 0.34]} />
            <primitive object={materials.bronzeStatue} attach="material" />
          </mesh>

          {/* Legs astride the horse */}
          {[-0.28, 0.28].map((lx, li) => (
            <mesh key={li} position={[lx, 0.05, 0.05]} rotation={[0.5, 0, li === 0 ? -0.2 : 0.2]} castShadow>
              <boxGeometry args={[0.15, 0.55, 0.22]} />
              <primitive object={materials.bronzeStatue} attach="material" />
            </mesh>
          ))}

          {/* Head & Traditional Diponegoro Sorban/Turban */}
          <group position={[0, 0.82, 0.04]}>
            <mesh castShadow>
              <sphereGeometry args={[0.14, 16, 16]} />
              <primitive object={materials.bronzeStatue} attach="material" />
            </mesh>
            {/* Turban Wrap (Sorban Diponegoro) */}
            <mesh position={[0, 0.06, 0]} castShadow>
              <torusGeometry args={[0.15, 0.065, 12, 24]} />
              <primitive object={materials.goldAccent} attach="material" />
            </mesh>
            {/* Turban Peak */}
            <mesh position={[0, 0.16, -0.03]} castShadow>
              <coneGeometry args={[0.07, 0.12, 12]} />
              <primitive object={materials.goldAccent} attach="material" />
            </mesh>
          </group>

          {/* Right Arm: Raised Forward with Keris / Commanding Pose */}
          <group position={[0.26, 0.52, 0.08]} rotation={[0.8, 0.3, 0.4]}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.045, 0.42, 10]} />
              <primitive object={materials.bronzeStatue} attach="material" />
            </mesh>
            {/* Keris Hilt and Blade in Gold Bronze */}
            <group position={[0, 0.44, 0]} rotation={[0.2, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
                <primitive object={materials.goldAccent} attach="material" />
              </mesh>
              {/* Asymmetrical Keris Sheath/Blade */}
              <mesh position={[0, 0.22, 0]} castShadow>
                <boxGeometry args={[0.025, 0.34, 0.055]} />
                <primitive object={materials.goldAccent} attach="material" />
              </mesh>
            </group>
          </group>

          {/* Left Arm: Holding Horse Reins */}
          <group position={[-0.24, 0.42, 0.14]} rotation={[0.4, -0.2, -0.3]}>
            <mesh position={[0, 0.16, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.045, 0.36, 10]} />
              <primitive object={materials.bronzeStatue} attach="material" />
            </mesh>
          </group>
        </group>

        {/* Dedicated Museum Spotlights for the Monument */}
        <pointLight position={[0, 2.8, 1.2]} color="#fff3d9" intensity={18} distance={6} />
      </group>
    </group>
  )
}

/**
 * 3D Monumental "UNDIP" Acronym Typography Sculpture
 * Featuring deep Navy Blue letter bodies with Gold beveled front faces on an ivory plinth.
 */
export function UndipLogoMonument({ position, rotationY = 0 }: StatueProps) {
  const materials = useMemo(() => {
    return {
      plinthIvory: new THREE.MeshStandardMaterial({
        color: '#f7f4eb',
        roughness: 0.85,
      }),
      teakBorder: new THREE.MeshStandardMaterial({
        color: '#3d2516',
        roughness: 0.5,
      }),
      navyBlueLetters: new THREE.MeshStandardMaterial({
        color: '#0b1d3a',
        roughness: 0.35,
        metalness: 0.25,
      }),
      goldBevel: new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.25,
        metalness: 0.88,
      }),
    }
  }, [])

  // Letter width and spacing
  const letterDepth = 0.22
  const letterHeight = 0.72

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Plinth Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.2, 0.9]} />
        <primitive object={materials.teakBorder} attach="material" />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <boxGeometry args={[3.74, 0.02, 0.84]} />
        <primitive object={materials.goldBevel} attach="material" />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.2, 0.76]} />
        <primitive object={materials.plinthIvory} attach="material" />
      </mesh>

      {/* 3D "U N D I P" Block Letters */}
      <group position={[0, 0.42 + letterHeight / 2, 0]}>
        {/* Letter 'U' */}
        <group position={[-1.35, 0, 0]}>
          {/* Left upright */}
          <mesh position={[-0.18, 0.06, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight - 0.12, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Right upright */}
          <mesh position={[0.18, 0.06, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight - 0.12, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Bottom curve */}
          <mesh position={[0, -letterHeight / 2 + 0.09, 0]} castShadow>
            <boxGeometry args={[0.49, 0.14, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Gold Front Trim */}
          <mesh position={[0, 0, letterDepth / 2 + 0.005]}>
            <boxGeometry args={[0.49, letterHeight, 0.01]} />
            <primitive object={materials.goldBevel} attach="material" />
          </mesh>
        </group>

        {/* Letter 'N' */}
        <group position={[-0.68, 0, 0]}>
          {/* Left upright */}
          <mesh position={[-0.18, 0, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Right upright */}
          <mesh position={[0.18, 0, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Diagonal bar */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, -0.44]} castShadow>
            <boxGeometry args={[0.12, letterHeight * 1.1, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Gold Front Trim */}
          <mesh position={[0, 0, letterDepth / 2 + 0.005]}>
            <boxGeometry args={[0.49, letterHeight, 0.01]} />
            <primitive object={materials.goldBevel} attach="material" />
          </mesh>
        </group>

        {/* Letter 'D' */}
        <group position={[0, 0, 0]}>
          {/* Left vertical */}
          <mesh position={[-0.18, 0, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Top horizontal */}
          <mesh position={[0.02, letterHeight / 2 - 0.07, 0]} castShadow>
            <boxGeometry args={[0.34, 0.14, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Bottom horizontal */}
          <mesh position={[0.02, -letterHeight / 2 + 0.07, 0]} castShadow>
            <boxGeometry args={[0.34, 0.14, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Curved right vertical */}
          <mesh position={[0.18, 0, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight - 0.22, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Gold Front Trim */}
          <mesh position={[0, 0, letterDepth / 2 + 0.005]}>
            <boxGeometry args={[0.49, letterHeight, 0.01]} />
            <primitive object={materials.goldBevel} attach="material" />
          </mesh>
        </group>

        {/* Letter 'I' */}
        <group position={[0.62, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, letterHeight, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Top/bottom crossbar */}
          <mesh position={[0, letterHeight / 2 - 0.05, 0]} castShadow>
            <boxGeometry args={[0.32, 0.1, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          <mesh position={[0, -letterHeight / 2 + 0.05, 0]} castShadow>
            <boxGeometry args={[0.32, 0.1, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Gold Front Trim */}
          <mesh position={[0, 0, letterDepth / 2 + 0.005]}>
            <boxGeometry args={[0.32, letterHeight, 0.01]} />
            <primitive object={materials.goldBevel} attach="material" />
          </mesh>
        </group>

        {/* Letter 'P' */}
        <group position={[1.28, 0, 0]}>
          {/* Left upright */}
          <mesh position={[-0.16, 0, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Upper loop top */}
          <mesh position={[0.04, letterHeight / 2 - 0.07, 0]} castShadow>
            <boxGeometry args={[0.32, 0.14, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Upper loop mid */}
          <mesh position={[0.04, 0.05, 0]} castShadow>
            <boxGeometry args={[0.32, 0.14, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Upper loop right */}
          <mesh position={[0.18, letterHeight / 4, 0]} castShadow>
            <boxGeometry args={[0.12, letterHeight / 2, letterDepth]} />
            <primitive object={materials.navyBlueLetters} attach="material" />
          </mesh>
          {/* Gold Front Trim */}
          <mesh position={[0, 0, letterDepth / 2 + 0.005]}>
            <boxGeometry args={[0.49, letterHeight, 0.01]} />
            <primitive object={materials.goldBevel} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  )
}
