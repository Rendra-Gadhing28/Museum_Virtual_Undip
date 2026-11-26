import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

export interface PostFXProps {
  zone: 'zone1' | 'zone2' | 'zone3'
}

/**
 * PostFX — Konfigurasi Ringan WebGLRenderer (Tanpa EffectComposer / Bloom / Grain)
 * Mengatur SRGBColorSpace, ACESFilmicToneMapping, dan pixelRatio aman agar 60fps stabil.
 */
export function PostFX({ zone: _zone }: PostFXProps) {
  const { gl } = useThree()

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.0
    gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  }, [gl])

  return null
}
