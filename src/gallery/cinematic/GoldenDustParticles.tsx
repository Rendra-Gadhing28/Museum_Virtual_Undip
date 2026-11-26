import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GoldenDustParticlesProps {
  active?: boolean
  count?: number
}

/**
 * Partikel debu emas (THREE.Points) berukuran kecil dan bergerak pelan
 * untuk atmosfer layar judul & intro sinematik museum.
 */
export function GoldenDustParticles({
  active = true,
  count = 360,
}: GoldenDustParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speedArr = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Sebar di sepanjang aula utama, terutama di depan kamera intro
      positions[i3] = (Math.random() - 0.5) * 14
      positions[i3 + 1] = 0.4 + Math.random() * 5.2
      positions[i3 + 2] = -21 + Math.random() * 24

      speedArr[i3] = (Math.random() - 0.5) * 0.08
      speedArr[i3 + 1] = 0.04 + Math.random() * 0.09
      speedArr[i3 + 2] = (Math.random() - 0.5) * 0.08
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return { geometry: geo, speeds: speedArr }
  }, [count])

  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  useFrame((state, delta) => {
    if (!active || !pointsRef.current) return
    const dt = Math.min(delta, 0.05)
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      arr[i3] += (speeds[i3] + Math.sin(t * 0.4 + i) * 0.02) * dt
      arr[i3 + 1] += speeds[i3 + 1] * dt
      arr[i3 + 2] += (speeds[i3 + 2] + Math.cos(t * 0.35 + i) * 0.02) * dt

      if (arr[i3 + 1] > 5.8) {
        arr[i3 + 1] = 0.4
      }
      if (arr[i3] > 7) arr[i3] = -7
      else if (arr[i3] < -7) arr[i3] = 7
    }

    posAttr.needsUpdate = true
  })

  if (!active) return null

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#ffd9a0"
        size={0.032}
        transparent
        opacity={0.72}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
