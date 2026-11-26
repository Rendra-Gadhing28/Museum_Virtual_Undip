import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { QUALITY } from './QualityConfig'
import { createContactShadowTexture } from './MaterialLibrary'

export interface LightingRigProps {
  zone: 'zone1' | 'zone2' | 'zone3' | 'zone4' | 'zone5'
}

/**
 * FauxVolumetricBeam component
 * Retained for backwards-compatibility; returns null per user request:
 * "hapus cahaya yang ada ditengah tengah itu, bikin jelek"
 */
export function FauxVolumetricBeam(_props: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  radiusTop?: number
  radiusBottom?: number
  height?: number
  color?: string
  intensity?: number
}) {
  return null
}

/**
 * Ground Contact Shadow (Soft Radial Ambient Occlusion Ground Plane)
 * Grounds furniture and pedestals firmly onto marble floor without expensive shadow cascades.
 */
export function ContactShadow({
  position,
  scale = [4.5, 3.5],
  opacity = 0.65,
}: {
  position: [number, number, number]
  scale?: [number, number]
  opacity?: number
}) {
  const shadowTex = useMemo(() => createContactShadowTexture(512, 512), [])

  if (!QUALITY.current.contactShadows || !QUALITY.current.enabled) return null

  return (
    <mesh position={[position[0], 0.003, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[scale[0], scale[1]]} />
      <meshBasicMaterial
        map={shadowTex}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  )
}

/**
 * Per-Zone Cinematic Lighting Rig
 */
export function LightingRig({ zone }: LightingRigProps) {
  const { gl } = useThree()

  // Configure soft shadows when flag is enabled
  useEffect(() => {
    const handleQuality = () => {
      if (QUALITY.current.softShadows && QUALITY.current.enabled) {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      } else {
        gl.shadowMap.enabled = false
      }
    }
    const unsub = QUALITY.subscribe(handleQuality)
    return () => unsub()
  }, [gl])

  return (
    <group>
      {/* ==============================================================
          ZONE 1: The Origin of Undip (Ceremonial Dais & Prasasti Hero)
          ============================================================== */}
      {zone === 'zone1' && (
        <>
          {/* Ground Contact Shadows under major plinths & podium */}
          <ContactShadow position={[0, 0, -18.2]} scale={[5.2, 4.2]} opacity={0.7} />
          <ContactShadow position={[-7.5, 0, -20.5]} scale={[4.0, 3.8]} opacity={0.65} />
          <ContactShadow position={[0, 0, -2.5]} scale={[3.8, 3.8]} opacity={0.6} />
        </>
      )}

      {/* ==============================================================
          ZONE 2: The Growth of Knowledge (Campus Transformation Diorama)
          ============================================================== */}
      {zone === 'zone2' && (
        <>
          {/* Ground Contact Shadows */}
          <ContactShadow position={[0, 0, -4.5]} scale={[5.6, 4.2]} opacity={0.72} />
          <ContactShadow position={[0, 0, -25.2]} scale={[7.0, 3.0]} opacity={0.65} />
        </>
      )}

      {/* ==============================================================
          ZONE 3: The Heritage of Undip (Andesite Inscription & Emblem Hero)
          ============================================================== */}
      {zone === 'zone3' && (
        <>
          {/* Ground Contact Shadows */}
          <ContactShadow position={[0, 0, -21.0]} scale={[6.2, 5.0]} opacity={0.75} />
          <ContactShadow position={[0, 0, -2.5]} scale={[4.8, 3.8]} opacity={0.68} />
        </>
      )}

      {/* ==============================================================
          ZONE 4: Undip Today (Tembalang Living Campus Maket Hero)
          ============================================================== */}
      {zone === 'zone4' && (
        <>
          {/* Ground Contact Shadows */}
          <ContactShadow position={[0, 0, -2.5]} scale={[9.5, 7.2]} opacity={0.72} />
          <ContactShadow position={[0, 0, -26.0]} scale={[8.0, 4.0]} opacity={0.65} />
        </>
      )}

      {/* ==============================================================
          ZONE 5: Undip Future (Vision Beacon & AI Neural Core Hero)
          ============================================================== */}
      {zone === 'zone5' && (
        <>
          {/* Ground Contact Shadows */}
          <ContactShadow position={[0, 0, -23.0]} scale={[7.0, 5.0]} opacity={0.75} />
          <ContactShadow position={[0, 0, -2.5]} scale={[5.0, 4.0]} opacity={0.68} />
        </>
      )}
    </group>
  )
}
