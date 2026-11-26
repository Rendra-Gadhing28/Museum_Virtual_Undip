import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ZoneGraphicsManager } from './ZoneGraphicsManager'
import type { ZoneId } from './zoneGfxConfig'

interface ZoneGraphicsControllerProps {
  zone: ZoneId
}

/**
 * ZoneGraphicsController
 * Ditempatkan di dalam <Canvas> tiap zona. Mengaitkan WebGLRenderer aktif
 * ke ZoneGraphicsManager untuk setup shadow map, tone mapping, PMREM, dan per-frame telemetry.
 */
export function ZoneGraphicsController({ zone }: ZoneGraphicsControllerProps) {
  const { gl, scene, camera } = useThree()
  const frameCount = useRef(0)

  useEffect(() => {
    // 1. Terapkan konfigurasi zona aktif
    ZoneGraphicsManager.applyZone(zone, gl, scene, camera)

    // 2. Minta kalkulasi shadow map
    ZoneGraphicsManager.requestShadowUpdate(gl)

    return () => {
      // Bersihkan zona saat unmount
      ZoneGraphicsManager.releaseZone(zone)
    }
  }, [zone, gl, scene, camera])

  // Sample performa dan update telemetry setiap 15 frame
  useFrame((_, delta) => {
    frameCount.current++
    if (frameCount.current % 15 === 0) {
      ZoneGraphicsManager.sampleFrame(gl, delta)
    }
  })

  return null
}
