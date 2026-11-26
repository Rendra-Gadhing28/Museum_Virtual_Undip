import { useMemo } from 'react'
import * as THREE from 'three'
import { HALL, HALL_CENTER_Z, HALL_LENGTH } from './layout'
import { createPvcDiamondLatticeTexture } from './textures'
import { Chandelier } from './Chandelier'
import { assetCache } from './cache'

/**
 * Modern PVC Coffered Drop Ceiling with Hidden Cove LED Lighting & Chandeliers
 * Modeled exactly after the user's reference photograph:
 * - High-end ivory PVC architectural drop-ceiling panels
 * - Stepped labyrinth geometric perimeter tiers with glowing cove channels
 * - Central coffer with quilted diamond lattice PVC motif
 * - Recessed warm LED circular downlights
 * - Grand hanging crystal chandeliers in the center bays
 */
export interface CeilingRoofProps {
  isMobile?: boolean
  halfWidth?: number
  height?: number
  length?: number
  centerZ?: number
  zFront?: number
  zBack?: number
}

export function CeilingRoof({
  isMobile = false,
  halfWidth = HALL.halfWidth,
  height = HALL.height,
  length = HALL_LENGTH,
  centerZ = HALL_CENTER_Z,
  zFront = HALL.zFront,
  zBack = HALL.zBack,
}: CeilingRoofProps) {
  const diamondTexture = useMemo(() => {
    const tex = createPvcDiamondLatticeTexture()
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(4, 10)
    return tex
  }, [])

  const halfW = halfWidth

  const materials = useMemo(() => {
    return {
      pvcIvoryBase: assetCache.getMaterial(
        'ceil-pvc-ivory-base',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#f8f5ee',
            roughness: 0.65,
            metalness: 0.05,
          }),
      ),
      pvcDropTier: assetCache.getMaterial(
        'ceil-pvc-drop-tier',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#f5f0e4',
            roughness: 0.6,
            metalness: 0.05,
          }),
      ),
      pvcLabyrinth: assetCache.getMaterial(
        'ceil-pvc-labyrinth',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#fcfaf5',
            roughness: 0.55,
            metalness: 0.08,
          }),
      ),
      goldTrim: assetCache.getMaterial(
        'ceil-gold-trim',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#d4af37',
            roughness: 0.28,
            metalness: 0.88,
          }),
      ),
      coveLedGlow: assetCache.getMaterial(
        'ceil-cove-glow',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#fffdf5',
            emissive: '#fff4dc',
            emissiveIntensity: 3.5,
            roughness: 0.3,
          }),
      ),
      downlightBulb: assetCache.getMaterial(
        'ceil-downlight-bulb',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#ffffff',
            emissive: '#fffbf0',
            emissiveIntensity: 3.8,
          }),
      ),
      timberCrown: assetCache.getMaterial(
        'ceil-timber-crown',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#3d2516',
            roughness: 0.5,
            metalness: 0.12,
          }),
      ),
    }
  }, [])

  const bayWidth = Math.min(halfW * 2 - 1.2, 7.2)

  // Dynamic coffer bays down the length of the hall
  const bays = useMemo(() => {
    if (length > 42) {
      // 3 bays for larger zones (Zone 3, 4, 5)
      const bLen = Math.min(13.0, (length - 8) / 3)
      return [
        { z: centerZ + length * 0.3, id: 'front-bay', length: bLen },
        { z: centerZ, id: 'mid-bay', length: bLen },
        { z: centerZ - length * 0.3, id: 'back-bay', length: bLen },
      ]
    }
    // 2 bays for Zone 1 & 2
    return [
      { z: centerZ + 9.5, id: 'front-bay', length: 15.0 },
      { z: centerZ - 7.5, id: 'back-bay', length: 15.0 },
    ]
  }, [length, centerZ])

  return (
    <group position={[0, height, 0]}>
      {/* 1. Base Outer PVC Ceiling Surface (Spans whole room) */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, centerZ]}
        receiveShadow
      >
        <planeGeometry args={[halfW * 2, length]} />
        <primitive object={materials.pvcIvoryBase} attach="material" />
      </mesh>

      {/* Perimeter Heritage Brown & Gold Crown Molding */}
      {[-1, 1].map((side) => (
        <group key={`crown-${side}`}>
          <mesh position={[side * (halfW - 0.08), -0.12, centerZ]}>
            <boxGeometry args={[0.16, 0.24, length]} />
            <primitive object={materials.timberCrown} attach="material" />
          </mesh>
          <mesh position={[side * (halfW - 0.17), -0.22, centerZ]}>
            <boxGeometry args={[0.03, 0.05, length]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Front & Back Crown Moldings */}
      <mesh position={[0, -0.12, zFront - 0.08]}>
        <boxGeometry args={[halfW * 2, 0.24, 0.16]} />
        <primitive object={materials.timberCrown} attach="material" />
      </mesh>
      <mesh position={[0, -0.12, zBack + 0.08]}>
        <boxGeometry args={[halfW * 2, 0.24, 0.16]} />
        <primitive object={materials.timberCrown} attach="material" />
      </mesh>

      {/* 2. Coffered Drop Bays with Labyrinth Tiers & Hidden Cove LEDs */}
      {bays.map((bay) => {
        const bayLength = bay.length
        return (
          <group key={bay.id} position={[0, 0, bay.z]}>
            {/* TIER 1: Outer Drop Tier Frame */}
            {/* Left & Right Drop Beams */}
            {[-1, 1].map((s) => (
              <mesh
                key={`t1-side-${s}`}
                position={[s * (bayWidth / 2 + 0.35), -0.16, 0]}
                castShadow
              >
                <boxGeometry args={[0.7, 0.32, bayLength + 1.4]} />
                <primitive object={materials.pvcDropTier} attach="material" />
              </mesh>
            ))}
            {/* Front & Back Drop Beams */}
            {[-1, 1].map((s) => (
              <mesh
                key={`t1-end-${s}`}
                position={[0, -0.16, s * (bayLength / 2 + 0.35)]}
                castShadow
              >
                <boxGeometry args={[bayWidth + 1.4, 0.32, 0.7]} />
                <primitive object={materials.pvcDropTier} attach="material" />
              </mesh>
            ))}

            {/* Hidden Cove Light Ribbon (Outer Step) */}
            {[-1, 1].map((s) => (
              <mesh key={`cove-out-s-${s}`} position={[s * (bayWidth / 2 + 0.02), -0.06, 0]}>
                <boxGeometry args={[0.04, 0.04, bayLength]} />
                <primitive object={materials.coveLedGlow} attach="material" />
              </mesh>
            ))}
            {[-1, 1].map((s) => (
              <mesh key={`cove-out-e-${s}`} position={[0, -0.06, s * (bayLength / 2 + 0.02)]}>
                <boxGeometry args={[bayWidth, 0.04, 0.04]} />
                <primitive object={materials.coveLedGlow} attach="material" />
              </mesh>
            ))}

            {/* TIER 2: Labyrinth Geometric Stepped Inner Inset (Matching photo - Desktop only) */}
            {!isMobile && [-1, 1].map((s) => (
              <group key={`lab-${s}`}>
                {/* Corner L-bracket steps */}
                <mesh position={[s * (bayWidth / 2 - 0.5), -0.24, (bayLength / 2 - 1.8)]}>
                  <boxGeometry args={[0.45, 0.16, 3.2]} />
                  <primitive object={materials.pvcLabyrinth} attach="material" />
                </mesh>
                <mesh position={[s * (bayWidth / 2 - 0.5), -0.24, -(bayLength / 2 - 1.8)]}>
                  <boxGeometry args={[0.45, 0.16, 3.2]} />
                  <primitive object={materials.pvcLabyrinth} attach="material" />
                </mesh>
                {/* Middle horizontal return step */}
                <mesh position={[s * (bayWidth / 2 - 1.1), -0.24, 0]}>
                  <boxGeometry args={[0.45, 0.16, 4.5]} />
                  <primitive object={materials.pvcLabyrinth} attach="material" />
                </mesh>
              </group>
            ))}

            {/* Inner Glowing Cove LED Ribbon Channel */}
            {[-1, 1].map((s) => (
              <mesh key={`cove-in-s-${s}`} position={[s * 1.85, -0.16, 0]}>
                <boxGeometry args={[0.04, 0.04, bayLength - 2.8]} />
                <primitive object={materials.coveLedGlow} attach="material" />
              </mesh>
            ))}
            {[-1, 1].map((s) => (
              <mesh key={`cove-in-e-${s}`} position={[0, -0.16, s * (bayLength / 2 - 1.4)]}>
                <boxGeometry args={[3.6, 0.04, 0.04]} />
                <primitive object={materials.coveLedGlow} attach="material" />
              </mesh>
            ))}

            {/* TIER 3: Center Recessed Ceiling with Diamond Lattice Motif (From Photo) */}
            <group position={[0, 0.12, 0]}>
              {/* Diamond Lattice PVC Motif Panel */}
              <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow={!isMobile}>
                <planeGeometry args={[3.6, bayLength - 2.8]} />
                <meshStandardMaterial
                  map={diamondTexture}
                  roughness={0.45}
                  metalness={0.05}
                />
              </mesh>

              {/* Gold Perimeter Inlay Frame around Diamond Panel */}
              <mesh position={[0, -0.02, 0]}>
                <boxGeometry args={[3.64, 0.03, bayLength - 2.76]} />
                <primitive object={materials.goldTrim} attach="material" />
              </mesh>
            </group>

            {/* 3. Recessed Downlight Spotlights along the channels (Desktop only) */}
            {!isMobile && [-2.2, 2.2].map((dx, di) =>
              [-bayLength / 3, 0, bayLength / 3].map((dz, zi) => (
                <group key={`dl-${di}-${zi}`} position={[dx, -0.25, dz]}>
                  {/* Downlight Gold Bezel */}
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.1, 0.14, 18]} />
                    <primitive object={materials.goldTrim} attach="material" />
                  </mesh>
                  {/* Downlight Bulb */}
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.1, 18]} />
                    <primitive object={materials.downlightBulb} attach="material" />
                  </mesh>
                </group>
              )),
            )}

            {/* 4. Grand Multi-Tiered Crystal Chandelier Suspended in Center of Bay */}
            <Chandelier position={[0, 0.12, 0]} scale={1.2} isMobile={isMobile} />
          </group>
        )
      })}
    </group>
  )
}
