/**
 * CinematicIntro — Main 3D Timeline & State Machine Orchestrator
 *
 * Runs inside R3F <Canvas>. Drives camera along CatmullRomCurve3 splines,
 * renders the clean 3D gallery without diagnostic wireframes, collects
 * real runtime telemetry, and hands off smoothly at START_POSITION.
 */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EYE_HEIGHT, START_POSITION } from '../Zone1/layout'
import { CameraRail } from './CameraRail'
import {
  TOTAL_INTRO_DURATION,
  type ChapterConfig,
} from './config'
import { formatTelemetryForChapter, type LiveEngineMetrics, type TelemetrySnapshot } from './Telemetry'

export interface CinematicStateUpdate {
  chapter: ChapterConfig
  telemetry: TelemetrySnapshot
  progressPercent: number
}

interface CinematicIntroProps {
  active: boolean
  isIntroOpen?: boolean
  baseFov: number
  onStateUpdate: (update: CinematicStateUpdate) => void
  onComplete: () => void
}

export function CinematicIntro({
  active,
  isIntroOpen = false,
  baseFov,
  onStateUpdate,
  onComplete,
}: CinematicIntroProps) {
  const { camera, gl } = useThree()
  const rail = useMemo(() => new CameraRail(), [])

  const elapsedRef = useRef(0)
  const completedRef = useRef(false)
  const lastUiPushRef = useRef(0)
  const reducedMotionRef = useRef(false)

  const metricsRef = useRef<LiveEngineMetrics>({
    fps: 60,
  })

  // Detect prefers-reduced-motion & reset timer whenever intro becomes active
  useEffect(() => {
    if (!active) return
    elapsedRef.current = 0
    completedRef.current = false
    lastUiPushRef.current = -1

    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = Boolean(mql?.matches)

    if (document.pointerLockElement) {
      try {
        document.exitPointerLock()
      } catch {
        // ignore
      }
    }
  }, [active])

  // Saat fase judul & narasi (belum dolly), posisikan kamera menghadap tepat ke Papan Logo UNDIP di Lantai 2 Mezzanine (Y=9.90, Z=-21.88)
  useEffect(() => {
    if (!isIntroOpen || active) return
    const persp = camera as THREE.PerspectiveCamera
    persp.position.set(0, 9.6, -12.0)
    persp.lookAt(0, 9.9, -21.88)
    persp.updateProjectionMatrix()
  }, [isIntroOpen, active, camera])

  // Ensure exact spawn alignment when intro ends or is skipped
  useEffect(() => {
    if (active || isIntroOpen) return
    const persp = camera as THREE.PerspectiveCamera
    persp.position.set(START_POSITION[0], EYE_HEIGHT, START_POSITION[2])
    persp.rotation.set(0, 0, 0, 'YXZ')
    if (Math.abs(persp.fov - baseFov) > 0.05) {
      persp.fov = baseFov
      persp.updateProjectionMatrix()
    }
  }, [active, isIntroOpen, camera, baseFov])

  useFrame((_, delta) => {
    if (!active || completedRef.current) return

    const dt = Math.min(delta, 0.05)
    elapsedRef.current += dt

    const persp = camera as THREE.PerspectiveCamera
    const { timing } = rail.applyToCamera(
      persp,
      elapsedRef.current,
      reducedMotionRef.current,
      baseFov,
    )

    // Throttle DOM UI telemetry updates (~10Hz) to keep 60fps smooth
    if (
      lastUiPushRef.current < 0 ||
      elapsedRef.current - lastUiPushRef.current >= 0.1
    ) {
      lastUiPushRef.current = elapsedRef.current
      const telemetry = formatTelemetryForChapter(
        timing.chapter.id,
        gl,
        metricsRef.current,
      )
      onStateUpdate({
        chapter: timing.chapter,
        telemetry,
        progressPercent: (elapsedRef.current / TOTAL_INTRO_DURATION) * 100,
      })
    }

    if (elapsedRef.current >= TOTAL_INTRO_DURATION) {
      completedRef.current = true
      persp.position.set(START_POSITION[0], EYE_HEIGHT, START_POSITION[2])
      persp.rotation.set(0, 0, 0, 'YXZ')
      persp.fov = baseFov
      persp.updateProjectionMatrix()
      onComplete()
    }
  })

  return null
}
