import { useMemo } from 'react'
import * as THREE from 'three'
import { RED_CARPET } from './layout'
import { createRedCarpetTexture } from './textures'
import { createProceduralNormalMap, museumPalette, QUALITY } from '../graphics'

/**
 * Ceremonial Burgundy Carpet Runner
 * Underneath the central axis, leading past the miniature map of Undip straight to the podium.
 * Deep Burgundy (#672C35) velvet with Antique Gold (#B2935D) borders.
 */
export function RedCarpet() {
  const carpetTexture = useMemo(() => {
    const tex = createRedCarpetTexture()
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    // Repeat along the long carpet length
    const length = RED_CARPET.zStart - RED_CARPET.zEnd
    tex.repeat.set(1, Math.round(length / 2.8))
    return tex
  }, [])

  const fabricNormal = useMemo(() => {
    const n = createProceduralNormalMap('fabric', 512, 512)
    n.repeat.set(4, Math.round((RED_CARPET.zStart - RED_CARPET.zEnd) * 2))
    return n
  }, [])

  const antiqueGoldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: museumPalette.gold,
        roughness: 0.38,
        metalness: 0.78,
      }),
    [],
  )

  const length = RED_CARPET.zStart - RED_CARPET.zEnd
  const centerZ = (RED_CARPET.zStart + RED_CARPET.zEnd) / 2
  const width = RED_CARPET.width

  return (
    <group position={[0, RED_CARPET.y, centerZ]}>
      {/* Main Velvet Carpet Runner Mesh (MeshPhysicalMaterial + subtle burgundy sheen) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshPhysicalMaterial
          map={carpetTexture}
          normalMap={QUALITY.current.physicalMaterials ? fabricNormal : null}
          normalScale={new THREE.Vector2(0.55, 0.55)}
          roughness={0.88}
          metalness={0.02}
          sheen={QUALITY.current.sheen ? 0.45 : 0}
          sheenColor="#8c424d"
          sheenRoughness={0.45}
        />
      </mesh>

      {/* Raised Carpet Edge Bevels (Antique Gold trim along floor boundary) */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2 + 0.02), 0.01, 0]}>
          <boxGeometry args={[0.04, 0.02, length]} />
          <primitive object={antiqueGoldMaterial} attach="material" />
        </mesh>
      ))}

      {/* Front Entrance Carpet Threshold / Antique Gold Tread */}
      <mesh position={[0, 0.015, length / 2]}>
        <boxGeometry args={[width + 0.08, 0.025, 0.08]} />
        <primitive object={antiqueGoldMaterial} attach="material" />
      </mesh>

      {/* Back Podium Threshold Antique Gold Tread */}
      <mesh position={[0, 0.015, -length / 2]}>
        <boxGeometry args={[width + 0.08, 0.025, 0.08]} />
        <primitive object={antiqueGoldMaterial} attach="material" />
      </mesh>
    </group>
  )
}
