import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import type { StatueProps } from './types'
import { assetCache } from './cache'
import { MaterialLibrary } from '../graphics'

interface ExtendedStatueProps extends StatueProps {
  scale?: number
}

/**
 * 3D Model GLB Loader for Patung Kuda Pangeran Diponegoro
 * Loads /assets/patung_kuda.glb using offline Draco decoder.
 */
function HorseStatueGLB({ scale = 2.4 }: { scale?: number }) {
  const { scene } = useGLTF('/assets/patung_kuda.glb', '/draco/')
  const { camera } = useThree()
  ;(window as any).__THREE_CAMERA__ = camera
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        ;(window as any).__HORSE_MESH__ = child

        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (mat) {
          const customMat = mat.clone()
          customMat.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
              '#include <common>',
              `#include <common>
              varying vec3 vModelPosition;`
            ).replace(
              '#include <begin_vertex>',
              `#include <begin_vertex>
              vModelPosition = position;`
            )

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <common>',
              `#include <common>
              varying vec3 vModelPosition;
              
              bool isRider(vec3 p) {
                // Diponegoro upper body, head, turban, keris, arms
                if (p.y > 0.08 && p.z < 0.02 && p.z > -0.28 && abs(p.x) < 0.18) return true;
                if (p.y > 0.20 && p.z < 0.05 && p.z > -0.22) return true;
                // Diponegoro legs along the flanks
                if (p.y >= -0.22 && p.y <= 0.08 && p.z >= -0.15 && p.z <= 0.04 && abs(p.x) > 0.085) return true;
                return false;
              }`
            ).replace(
              '#include <map_fragment>',
              `#include <map_fragment>
              if (!isRider(vModelPosition)) {
                diffuseColor = vec4(0.96, 0.96, 0.98, 1.0);
              }`
            ).replace(
              '#include <roughnessmap_fragment>',
              `#include <roughnessmap_fragment>
              if (!isRider(vModelPosition)) {
                roughnessFactor = 0.36;
              }`
            ).replace(
              '#include <metalnessmap_fragment>',
              `#include <metalnessmap_fragment>
              if (!isRider(vModelPosition)) {
                metalnessFactor = 0.02;
              }`
            )
          }
          customMat.needsUpdate = true
          ;(child as THREE.Mesh).material = customMat
        }
      }
    })
    return clone
  }, [scene])

  // Center bottom of patung_kuda sits right on the marble plinth surface
  return (
    <primitive
      object={clonedScene}
      position={[0, 0.55 * scale, 0]}
      scale={scale}
      rotation={[0, 0, 0]}
    />
  )
}

/**
 * Procedural Sculpture Fallback:
 * Rendered instantly while GLB is loading or as graceful degradation.
 */
function ProceduralHorseFallback({ materials }: { materials: any }) {
  return (
    <group>
      {/* Sculpture Base Plinth Plate in Polished White Marble & Gold */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[1.5, 0.09, 2.2]} />
        <primitive object={materials.marblePlinth} attach="material" />
      </mesh>
      <mesh position={[0, 0.105, 0]}>
        <boxGeometry args={[1.54, 0.02, 2.24]} />
        <primitive object={materials.goldAccent} attach="material" />
      </mesh>

      {/* The White Horse Torso & Neck */}
      <mesh position={[0, 0.95, -0.1]} rotation={[-0.55, 0, 0]} castShadow>
        <boxGeometry args={[0.56, 0.68, 1.25]} />
        <primitive object={materials.whiteHorse} attach="material" />
      </mesh>
      <mesh position={[0, 1.48, 0.38]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.46, 0.78, 0.52]} />
        <primitive object={materials.whiteHorse} attach="material" />
      </mesh>
      <mesh position={[0, 1.62, 0.22]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.75, 0.18]} />
        <primitive object={materials.whiteMane} attach="material" />
      </mesh>
      <group position={[0, 1.95, 0.56]} rotation={[0.2, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.34, 0.55]} />
          <primitive object={materials.whiteHorse} attach="material" />
        </mesh>
        <mesh position={[0, -0.09, 0.3]} castShadow>
          <boxGeometry args={[0.23, 0.22, 0.26]} />
          <primitive object={materials.whiteHorse} attach="material" />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 3D Monumental Statue: Pangeran Diponegoro on White Horse (Kuda Putih)
 * Arranged neatly with an expanded, spacious plaza,
 * polished brass stanchion posts, and royal velvet cords.
 */
export function DiponegoroStatue({
  position,
  rotationY = 0,
  scale = 1.0,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
}: ExtendedStatueProps) {
  const materials = useMemo(() => {
    return {
      // 1. Pure White Horse Material (Alabaster / White Marble with smooth pearlescent sheen)
      whiteHorse: MaterialLibrary.statuaryMarble('#f8fafc', 0.24),
      whiteMane: MaterialLibrary.statuaryMarble('#ffffff', 0.34),
      // 2. Diponegoro White Royal Robe & White Sorban
      heroWhiteRobe: MaterialLibrary.statuaryMarble('#f7f6f2', 0.36),
      heroSorban: MaterialLibrary.statuaryMarble('#ffffff', 0.34),
      // 3. Gold Trims & Keris Pusaka
      goldAccent: MaterialLibrary.antiqueBrass(false),
      goldBright: MaterialLibrary.antiqueBrass(true),
      // 4. White Marble Plinth & Teakwood Base
      marblePlinth: MaterialLibrary.cremaMarfilMarble({ roughness: 0.26, clearcoat: 0.35 }),
      teakBase: MaterialLibrary.polishedTeakwood(),
      darkTeak: assetCache.getMaterial(
        'statue-dark-teak',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#24150c',
            roughness: 0.52,
          }),
      ),
      navyPlate: assetCache.getMaterial(
        'statue-navy-vibrant',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#142e56',
            roughness: 0.35,
            metalness: 0.2,
          }),
      ),
      navyVelvet: MaterialLibrary.royalVelvet('#122a4d'),
    }
  }, [])

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      scale={[scale, scale, scale]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover?.('statue')
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onHover?.(null)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.()
      }}
    >
      {/* ============================================================
          1. EXPANDED CORNER PLAZA SANCTUARY (LEBAR & TERTATA RAPI DI POJOKAN)
          Widened multi-tier plaza platform (3.4m x 3.8m)
          ============================================================ */}
      {/* Tier 1 Ground Foundation (Carved Dark Teak with Gold Edge) */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.16, 3.8]} />
        <primitive object={materials.teakBase} attach="material" />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[3.34, 0.02, 3.74]} />
        <primitive object={materials.goldAccent} attach="material" />
      </mesh>

      {/* Tier 2 Polished Crema Marfil Marble Plaza Deck */}
      <mesh position={[0, 0.27, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 0.18, 3.5]} />
        <primitive object={materials.marblePlinth} attach="material" />
      </mesh>
      <mesh position={[0, 0.365, 0]}>
        <boxGeometry args={[3.04, 0.015, 3.44]} />
        <primitive object={materials.goldAccent} attach="material" />
      </mesh>

      {/* Polished Brass Stanchion Barrier Posts & Royal Velvet Ropes Around the Corner Plaza */}
      {[
        [-1.45, -1.6],
        [1.45, -1.6],
        [-1.45, 1.6],
        [1.45, 1.6],
        [-1.45, 0],
        [1.45, 0],
      ].map(([sx, sz], si) => (
        <group key={`post-${si}`} position={[sx, 0.36, sz]}>
          {/* Heavy Brass Base */}
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.11, 0.04, 16]} />
            <primitive object={materials.goldAccent} attach="material" />
          </mesh>
          {/* Polished Brass Stem */}
          <mesh position={[0, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.8, 14]} />
            <primitive object={materials.goldAccent} attach="material" />
          </mesh>
          {/* Crown Spherical Finial */}
          <mesh position={[0, 0.84, 0]} castShadow>
            <sphereGeometry args={[0.045, 16, 16]} />
            <primitive object={materials.goldBright} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Velvet Cordon Ropes between posts */}
      {/* Front cross cordon */}
      <mesh position={[0, 1.05, 1.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 2.8, 12]} />
        <primitive object={materials.navyVelvet} attach="material" />
      </mesh>
      {/* Left side cordon */}
      <mesh position={[-1.45, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 3.1, 12]} />
        <primitive object={materials.navyVelvet} attach="material" />
      </mesh>
      {/* Right side cordon */}
      <mesh position={[1.45, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 3.1, 12]} />
        <primitive object={materials.navyVelvet} attach="material" />
      </mesh>

      {/* ============================================================
          2. WIDE MARBLE & TEAK MONUMENT PEDESTAL BODY
          ============================================================ */}
      {/* Pedestal Plinth Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.22, 2.9]} />
        <primitive object={materials.darkTeak} attach="material" />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[2.24, 0.02, 2.84]} />
        <primitive object={materials.goldAccent} attach="material" />
      </mesh>

      {/* Main Pedestal White Marble Shaft */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.02, 2.6]} />
        <primitive object={materials.marblePlinth} attach="material" />
      </mesh>

      {/* Royal Navy & Gold Inscription Plaque on Pedestal Front */}
      <group position={[0, 1.15, 1.32]}>
        {/* Navy Blue Inset Board */}
        <mesh castShadow>
          <boxGeometry args={[1.65, 0.54, 0.03]} />
          <primitive object={materials.navyPlate} attach="material" />
        </mesh>
        {/* Gold Outer Molding Frame */}
        <mesh position={[0, 0, 0.018]}>
          <boxGeometry args={[1.7, 0.58, 0.01]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>
        {/* Gold Emblem Crest */}
        <mesh position={[0, 0.12, 0.025]}>
          <circleGeometry args={[0.08, 24]} />
          <primitive object={materials.goldBright} attach="material" />
        </mesh>
        {/* Inscription Accent Bars */}
        <mesh position={[0, -0.06, 0.025]}>
          <boxGeometry args={[1.35, 0.03, 0.01]} />
          <primitive object={materials.goldBright} attach="material" />
        </mesh>
        <mesh position={[0, -0.15, 0.025]}>
          <boxGeometry args={[1.05, 0.02, 0.01]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>
      </group>

      {/* Pedestal Top Lip with Gold Cornice */}
      <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.15, 0.08, 2.75]} />
        <primitive object={materials.darkTeak} attach="material" />
      </mesh>
      <mesh position={[0, 1.745, 0]}>
        <boxGeometry args={[2.2, 0.018, 2.8]} />
        <primitive object={materials.goldAccent} attach="material" />
      </mesh>

      {/* ============================================================
          3. SCULPTURE: PANGERAN DIPONEGORO DENGAN KUDA PUTIH
          Mounted majestically on the marble pedestal plinth.
          Uses 3D GLB Model (patung_kuda.glb) with Procedural Fallback.
          ============================================================ */}
      <group position={[0, 1.76, 0]}>
        {/* Sculpture Base Plinth Plate in Polished White Marble & Gold */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[1.5, 0.09, 2.2]} />
          <primitive object={materials.marblePlinth} attach="material" />
        </mesh>
        <mesh position={[0, 0.105, 0]}>
          <boxGeometry args={[1.54, 0.02, 2.24]} />
          <primitive object={materials.goldAccent} attach="material" />
        </mesh>

        <Suspense fallback={<ProceduralHorseFallback materials={materials} />}>
          <HorseStatueGLB scale={2.4} />
        </Suspense>
      </group>

      {/* Interactive Selection Highlight Ring */}
      {(isHovered || isSelected) && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.18, 36]} />
          <meshBasicMaterial color="#f9d342" transparent opacity={0.8} />
        </mesh>
      )}
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
      ivoryBg: new THREE.MeshStandardMaterial({
        color: '#f7f4eb',
        roughness: 0.78,
        metalness: 0.02,
      }),
      navyBlue: new THREE.MeshStandardMaterial({
        color: '#0b1d3a',
        roughness: 0.35,
        metalness: 0.2,
      }),
    }
  }, [])

  const letterDepth = 0.22
  const letterHeight = 0.72

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Ivory Plinth Base with Navy Blue Trim */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.9, 0.2, 0.92]} />
        <primitive object={materials.navyBlue} attach="material" />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.7, 0.22, 0.78]} />
        <primitive object={materials.ivoryBg} attach="material" />
      </mesh>

      {/* Ivory Backdrop Panel behind the Navy Blue UNDIP letters */}
      <mesh position={[0, 0.85, -0.18]} castShadow receiveShadow>
        <boxGeometry args={[3.55, 0.96, 0.12]} />
        <primitive object={materials.ivoryBg} attach="material" />
      </mesh>
      <mesh position={[0, 0.85, -0.245]} receiveShadow>
        <boxGeometry args={[3.62, 1.02, 0.03]} />
        <primitive object={materials.navyBlue} attach="material" />
      </mesh>

      {/* 3D "U N D I P" Block Letters (Navy Blue) */}
      <group position={[0, 0.42 + letterHeight / 2, 0.02]}>
        {/* Letter 'U' */}
        <group position={[-1.32, 0, 0]}>
          <mesh position={[-0.18, 0.06, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight - 0.12, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0.18, 0.06, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight - 0.12, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0, -letterHeight / 2 + 0.09, 0]} castShadow>
            <boxGeometry args={[0.49, 0.14, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
        </group>

        {/* Letter 'N' */}
        <group position={[-0.66, 0, 0]}>
          <mesh position={[-0.18, 0, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0.18, 0, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0.44]} castShadow>
            <boxGeometry args={[0.12, letterHeight * 1.06, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
        </group>

        {/* Letter 'D' */}
        <group position={[0, 0, 0]}>
          <mesh position={[-0.18, 0, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0.02, letterHeight / 2 - 0.07, 0]} castShadow>
            <boxGeometry args={[0.34, 0.14, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0.02, -letterHeight / 2 + 0.07, 0]} castShadow>
            <boxGeometry args={[0.34, 0.14, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0.18, 0, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight - 0.22, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
        </group>

        {/* Letter 'I' */}
        <group position={[0.62, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, letterHeight, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0, letterHeight / 2 - 0.05, 0]} castShadow>
            <boxGeometry args={[0.32, 0.1, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0, -letterHeight / 2 + 0.05, 0]} castShadow>
            <boxGeometry args={[0.32, 0.1, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
        </group>

        {/* Letter 'P' */}
        <group position={[1.26, 0, 0]}>
          <mesh position={[-0.16, 0, 0]} castShadow>
            <boxGeometry args={[0.13, letterHeight, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0.04, letterHeight / 2 - 0.07, 0]} castShadow>
            <boxGeometry args={[0.32, 0.14, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0.04, 0.05, 0]} castShadow>
            <boxGeometry args={[0.32, 0.14, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
          <mesh position={[0.18, letterHeight / 4, 0]} castShadow>
            <boxGeometry args={[0.12, letterHeight / 2, letterDepth]} />
            <primitive object={materials.navyBlue} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  )
}

try {
  useGLTF.preload('/assets/patung_kuda.glb', '/draco/')
} catch {
  // Ignore in SSR
}
