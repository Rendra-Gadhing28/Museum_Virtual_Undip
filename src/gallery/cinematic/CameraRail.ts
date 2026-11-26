/**
 * CameraRail — CatmullRomCurve3 Spline & Smooth Easing Evaluator
 *
 * Computes camera position, lookAt target, and breathing FOV strictly from
 * elapsed time (time-based, never frame-based), with zero per-frame allocations.
 * Guarantees exact landing at START_POSITION & (0,0,0) rotation at t = 1.0.
 */

import * as THREE from 'three'
import { CHAPTERS, TOTAL_INTRO_DURATION, type ChapterConfig } from './config'

export interface ChapterTiming {
  chapter: ChapterConfig
  startTime: number
  endTime: number
  posCurve: THREE.CatmullRomCurve3
  lookCurve: THREE.CatmullRomCurve3
}

export class CameraRail {
  private timings: ChapterTiming[] = []
  private readonly tempPos = new THREE.Vector3()
  private readonly tempLook = new THREE.Vector3()
  private readonly tempNextPos = new THREE.Vector3()
  private readonly tempNextLook = new THREE.Vector3()
  private readonly lookMatrix = new THREE.Matrix4()
  private readonly targetQuat = new THREE.Quaternion()

  constructor() {
    let cursor = 0
    for (const chapter of CHAPTERS) {
      const startTime = cursor
      const endTime = cursor + chapter.duration
      cursor = endTime

      const posVectors = chapter.cameraPoints.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
      const lookVectors = chapter.lookAtPoints.map((p) => new THREE.Vector3(p[0], p[1], p[2]))

      const posCurve = new THREE.CatmullRomCurve3(posVectors, false, 'catmullrom', 0.45)
      const lookCurve = new THREE.CatmullRomCurve3(lookVectors, false, 'catmullrom', 0.45)

      this.timings.push({
        chapter,
        startTime,
        endTime,
        posCurve,
        lookCurve,
      })
    }
  }

  public getActiveTiming(elapsed: number): {
    timing: ChapterTiming
    localProgress: number
    chapterIndex: number
  } {
    const clamped = Math.max(0, Math.min(elapsed, TOTAL_INTRO_DURATION))
    for (let i = 0; i < this.timings.length; i++) {
      const timing = this.timings[i]
      if (clamped <= timing.endTime || i === this.timings.length - 1) {
        const span = Math.max(0.001, timing.endTime - timing.startTime)
        const localProgress = Math.max(0, Math.min(1, (clamped - timing.startTime) / span))
        return { timing, localProgress, chapterIndex: i }
      }
    }
    const last = this.timings[this.timings.length - 1]
    return { timing: last, localProgress: 1, chapterIndex: this.timings.length - 1 }
  }

  /**
   * Updates camera transform & FOV in-place (zero allocations).
   */
  public applyToCamera(
    camera: THREE.PerspectiveCamera,
    elapsed: number,
    reducedMotion: boolean,
    baseFov: number,
  ): { timing: ChapterTiming; localProgress: number } {
    const { timing, localProgress } = this.getActiveTiming(elapsed)
    const { chapter, posCurve, lookCurve } = timing

    if (reducedMotion) {
      this.tempPos.set(...chapter.reducedMotionPos)
      this.tempLook.set(...chapter.reducedMotionLookAt)
      camera.position.copy(this.tempPos)
      camera.lookAt(this.tempLook)
      if (Math.abs(camera.fov - baseFov) > 0.05) {
        camera.fov = baseFov
        camera.updateProjectionMatrix()
      }
      return { timing, localProgress }
    }

    // Smoothstep easing for gentle acceleration & deceleration within each chapter
    const eased = localProgress * localProgress * (3 - 2 * localProgress)

    posCurve.getPointAt(eased, this.tempPos)
    lookCurve.getPointAt(eased, this.tempLook)

    // Smooth cross-chapter blend at the very end (last 10%) into next chapter's start
    const isEpilogue = chapter.id === 'epilogue'
    if (isEpilogue && localProgress > 0.85) {
      // Exact lock onto spawn position & forward gaze (pitch=0, yaw=0)
      const finalBlend = (localProgress - 0.85) / 0.15
      const smoothFinal = finalBlend * finalBlend * (3 - 2 * finalBlend)
      const lastPt = chapter.cameraPoints[chapter.cameraPoints.length - 1]
      const lastLook = chapter.lookAtPoints[chapter.lookAtPoints.length - 1]
      this.tempNextPos.set(lastPt[0], lastPt[1], lastPt[2])
      this.tempNextLook.set(lastLook[0], lastLook[1], lastLook[2])
      this.tempPos.lerp(this.tempNextPos, smoothFinal)
      this.tempLook.lerp(this.tempNextLook, smoothFinal)
    }

    camera.position.copy(this.tempPos)
    this.lookMatrix.lookAt(this.tempPos, this.tempLook, camera.up)
    this.targetQuat.setFromRotationMatrix(this.lookMatrix)
    camera.quaternion.copy(this.targetQuat)

    // Gentle FOV breathing (returns smoothly to baseFov in epilogue)
    const breath = isEpilogue
      ? THREE.MathUtils.lerp(chapter.fov, baseFov, eased)
      : chapter.fov + Math.sin(elapsed * 0.65) * 1.2

    if (Math.abs(camera.fov - breath) > 0.02) {
      camera.fov = breath
      camera.updateProjectionMatrix()
    }

    return { timing, localProgress }
  }
}
