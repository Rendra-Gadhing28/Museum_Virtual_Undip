import { useMemo } from 'react'
import * as THREE from 'three'
import { RED_CARPET } from './layout'
import { createRedCarpetTexture } from './textures'
import { createProceduralNormalMap, MaterialLibrary, QUALITY } from '../graphics'

/**
 * Ceremonial Red Carpet Runner
 * Underneath the central axis, leading past the miniature map of Undip straight to the podium.
 * Rich crimson velvet with ornate gold patterned borders.
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

  const brassMaterial = useMemo(() => MaterialLibrary.antiqueBrass(false), [])

  const length = RED_CARPET.zStart - RED_CARPET.zEnd
  const centerZ = (RED_CARPET.zStart + RED_CARPET.zEnd) / 2
  const width = RED_CARPET.width

  return (
    <group position={[0, RED_CARPET.y, centerZ]}>
      {/* Main Velvet Carpet Runner Mesh (MeshPhysicalMaterial + sheen + fabric normal) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshPhysicalMaterial
          map={carpetTexture}
          normalMap={QUALITY.current.physicalMaterials ? fabricNormal : null}
          normalScale={new THREE.Vector2(0.55, 0.55)}
          roughness={0.86}
          metalness={0.04}
          sheen={QUALITY.current.sheen ? 0.9 : 0}
          sheenColor="#e04555"
          sheenRoughness={0.35}
        />
      </mesh>

      {/* Raised Carpet Edge Bevels (Gold/Brass trim along floor boundary) */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2 + 0.02), 0.01, 0]}>
          <boxGeometry args={[0.04, 0.02, length]} />
          <primitive object={brassMaterial} attach="material" />
        </mesh>
      ))}

      {/* Front Entrance Carpet Threshold / Brass Tread */}
      <mesh position={[0, 0.015, length / 2]}>
        <boxGeometry args={[width + 0.08, 0.025, 0.08]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>

      {/* Back Podium Threshold Brass Tread */}
      <mesh position={[0, 0.015, -length / 2]}>
        <boxGeometry args={[width + 0.08, 0.025, 0.08]} />
        <primitive object={brassMaterial} attach="material" />
      </mesh>
    </group>
  )
}
