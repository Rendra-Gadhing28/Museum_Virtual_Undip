import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import {
  ZONE3_BOUNDS,
  ZONE3_DIRECTORY_POS,
  ZONE3_DIRECTORY_PROXIMITY_RADIUS,
  ZONE3_EYE_HEIGHT,
  ZONE3_START_POSITION,
  ZONE3_WALK_SPEED,
  ZONE3_RUN_SPEED,
} from './layout'

interface Zone3ControlsProps {
  resetSignal: number
  targetPosition: [number, number, number] | null
  moveInputRef: React.MutableRefObject<{ forward: number; strafe: number }>
  hoveredRef: React.MutableRefObject<string | null>
  panelOpenRef: React.MutableRefObject<boolean>
  draggedRef: React.MutableRefObject<boolean>
  onProximityChange?: (isNear: boolean) => void
  isTouring: boolean
  tourStationIndex: number | null
  onTourStationArrived?: () => void
}

const FORWARD_KEYS = new Set(['KeyW', 'ArrowUp'])
const BACKWARD_KEYS = new Set(['KeyS', 'ArrowDown'])
const LEFT_KEYS = new Set(['KeyA', 'ArrowLeft'])
const RIGHT_KEYS = new Set(['KeyD', 'ArrowRight'])
const SPRINT_KEYS = new Set(['ShiftLeft', 'ShiftRight', 'Shift'])

const DRAG_THRESHOLD = 5
const DRAG_SENSITIVITY = 0.003
const LOOK_SENSITIVITY = 0.0022
const PITCH_LIMIT = Math.PI / 2.6

// 5 Stasiun Sinematik Tur Sejarah Undip
const TOUR_WAYPOINTS = [
  { pos: [0, ZONE3_EYE_HEIGHT + 0.2, 2.0], lookAt: [0, 1.2, -2.5] },       // 1. Meja Pusaka & Lambang Diponegoro
  { pos: [-4.2, ZONE3_EYE_HEIGHT, -4.0], lookAt: [-7.2, 1.6, -4.0] },      // 2. Sayap Artefak Akademik
  { pos: [-4.2, ZONE3_EYE_HEIGHT, 4.0], lookAt: [-7.8, 2.4, 4.0] },        // 3. Hall of Legacy (Tokoh)
  { pos: [4.2, ZONE3_EYE_HEIGHT, -4.0], lookAt: [7.2, 1.6, -4.0] },        // 4. Sayap Dokumen & Audiovisual
  { pos: [0, ZONE3_EYE_HEIGHT + 0.3, -15.0], lookAt: [0, 2.8, -21.0] },    // 5. HERO: Plaza Prasasti Monumental
]

/**
 * Kontrol Navigasi Hibrida Zona 3:
 * 1. Mode Bebas: First-Person Walking (WASD/Panah/Touch/Mouse look) identik dengan Zona 1 & 4
 * 2. Mode Guided Tour: Kamera meluncur otomatis menyusuri atraksi warisan sejarah kampus
 */
export function Zone3Controls({
  resetSignal,
  targetPosition,
  moveInputRef,
  hoveredRef,
  panelOpenRef,
  draggedRef,
  onProximityChange,
  isTouring,
  tourStationIndex,
  onTourStationArrived,
}: Zone3ControlsProps) {
  const { camera, gl } = useThree()
  const keys = useRef(new Set<string>())
  const yaw = useRef(0)
  const pitch = useRef(0)
  const pos = useRef<[number, number, number]>([...ZONE3_START_POSITION])
  const drag = useRef<{ id: number; x: number; y: number } | null>(null)
  const isNearDirectoryRef = useRef(false)

  // Keyboard Event Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (panelOpenRef.current || isTouring) return
      keys.current.add(e.code)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.code)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [panelOpenRef, isTouring])

  // Reset Signal
  useEffect(() => {
    if (resetSignal > 0) {
      pos.current = [...ZONE3_START_POSITION]
      yaw.current = 0
      pitch.current = 0
    }
  }, [resetSignal])

  // Teleport to target position & auto-orient camera
  useEffect(() => {
    if (!targetPosition) return
    pos.current = [targetPosition[0], targetPosition[1], targetPosition[2]]
    // Arahkan pandangan kamera sesuai sayap yang dituju
    if (targetPosition[0] < -2) yaw.current = -Math.PI / 2
    else if (targetPosition[0] > 2) yaw.current = Math.PI / 2
    else yaw.current = 0
    pitch.current = 0
  }, [targetPosition])

  // Pointer Drag Look Around (Desktop & Mobile)
  useEffect(() => {
    const el = gl.domElement

    const onPointerDown = (e: PointerEvent) => {
      if (panelOpenRef.current || isTouring) return
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
      draggedRef.current = false
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!drag.current || drag.current.id !== e.pointerId) return
      const dx = e.clientX - drag.current.x
      const dy = e.clientY - drag.current.y
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        draggedRef.current = true
      }
      yaw.current -= dx * (document.pointerLockElement ? LOOK_SENSITIVITY : DRAG_SENSITIVITY)
      pitch.current = Math.max(
        -PITCH_LIMIT,
        Math.min(PITCH_LIMIT, pitch.current - dy * (document.pointerLockElement ? LOOK_SENSITIVITY : DRAG_SENSITIVITY)),
      )
      drag.current.x = e.clientX
      drag.current.y = e.clientY
    }

    const onPointerUp = (e: PointerEvent) => {
      if (drag.current?.id === e.pointerId) drag.current = null
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [gl, panelOpenRef, draggedRef, isTouring])

  // Click canvas to lock pointer (Desktop)
  useEffect(() => {
    const el = gl.domElement
    const handleClick = () => {
      if (panelOpenRef.current || isTouring || hoveredRef.current) return
      if (!document.pointerLockElement && window.innerWidth > 820) {
        el.requestPointerLock?.()
      }
    }
    el.addEventListener('click', handleClick)
    return () => el.removeEventListener('click', handleClick)
  }, [gl, panelOpenRef, isTouring, hoveredRef])

  // Frame Loop
  useFrame((_, delta) => {
    // ==============================================================
    // A) MODE GUIDED TOUR SINEMATIK
    // ==============================================================
    if (isTouring && tourStationIndex !== null && TOUR_WAYPOINTS[tourStationIndex]) {
      const station = TOUR_WAYPOINTS[tourStationIndex]
      const targetPos = new THREE.Vector3(...(station.pos as [number, number, number]))
      const targetLook = new THREE.Vector3(...(station.lookAt as [number, number, number]))

      camera.position.lerp(targetPos, delta * 2.2)
      pos.current = [camera.position.x, camera.position.y, camera.position.z]

      const currentLook = new THREE.Vector3()
      camera.getWorldDirection(currentLook)
      const desiredLook = targetLook.clone().sub(camera.position).normalize()
      currentLook.lerp(desiredLook, delta * 2.5)
      camera.lookAt(camera.position.clone().add(currentLook))

      if (camera.position.distanceTo(targetPos) < 0.22) {
        onTourStationArrived?.()
      }
      return
    }

    // ==============================================================
    // B) MODE GLIDE TELEPORTASI WAYPOINT
    // ==============================================================
    if (targetPosition) {
      pos.current[0] += (targetPosition[0] - pos.current[0]) * 0.1
      pos.current[1] = ZONE3_EYE_HEIGHT
      pos.current[2] += (targetPosition[2] - pos.current[2]) * 0.1
    } else {
      // ==============================================================
      // C) MODE FIRST-PERSON WALK-THROUGH BEBAS (WASD / TOUCH)
      // ==============================================================
      let forward = 0
      let strafe = 0

      FORWARD_KEYS.forEach((k) => { if (keys.current.has(k)) forward += 1 })
      BACKWARD_KEYS.forEach((k) => { if (keys.current.has(k)) forward -= 1 })
      LEFT_KEYS.forEach((k) => { if (keys.current.has(k)) strafe -= 1 })
      RIGHT_KEYS.forEach((k) => { if (keys.current.has(k)) strafe += 1 })

      forward += moveInputRef.current.forward
      strafe += moveInputRef.current.strafe

      let isRunning = false
      SPRINT_KEYS.forEach((k) => { if (keys.current.has(k)) isRunning = true })

      const speed = (isRunning ? ZONE3_RUN_SPEED : ZONE3_WALK_SPEED) * delta

      if (forward !== 0 || strafe !== 0) {
        const len = Math.hypot(forward, strafe)
        forward /= len
        strafe /= len

        const sinY = Math.sin(yaw.current)
        const cosY = Math.cos(yaw.current)

        const dx = (strafe * cosY - forward * sinY) * speed
        const dz = (-forward * cosY - strafe * sinY) * speed

        pos.current[0] = Math.max(ZONE3_BOUNDS.minX, Math.min(ZONE3_BOUNDS.maxX, pos.current[0] + dx))
        pos.current[2] = Math.max(ZONE3_BOUNDS.minZ, Math.min(ZONE3_BOUNDS.maxZ, pos.current[2] + dz))
      }
    }

    // Update Kamera
    camera.position.set(pos.current[0], ZONE3_EYE_HEIGHT, pos.current[2])
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')

    // Cek kedekatan dengan Papan Direktori
    const distToDir = Math.hypot(pos.current[0] - ZONE3_DIRECTORY_POS[0], pos.current[2] - ZONE3_DIRECTORY_POS[2])
    const isNear = distToDir < ZONE3_DIRECTORY_PROXIMITY_RADIUS
    if (isNear !== isNearDirectoryRef.current) {
      isNearDirectoryRef.current = isNear
      onProximityChange?.(isNear)
    }
  })

  return null
}
