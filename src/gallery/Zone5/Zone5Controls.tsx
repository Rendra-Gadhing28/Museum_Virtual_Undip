import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import {
  ZONE5_BOUNDS,
  ZONE5_DIRECTORY_POS,
  ZONE5_DIRECTORY_PROXIMITY_RADIUS,
  ZONE5_EYE_HEIGHT,
  ZONE5_START_POSITION,
  ZONE5_WALK_SPEED,
  ZONE5_RUN_SPEED,
} from './layout'

interface Zone5ControlsProps {
  resetSignal: number
  targetPosition: [number, number, number] | null
  moveInputRef: React.MutableRefObject<{ forward: number; strafe: number }>
  hoveredRef: React.MutableRefObject<string | null>
  panelOpenRef: React.MutableRefObject<boolean>
  draggedRef: React.MutableRefObject<boolean>
  onProximityChange?: (isNear: boolean) => void
  // Guided Tour Mode
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

// 5 Titik Sinematik Guided Tour Zona 5
const TOUR_WAYPOINTS = [
  { pos: [0, ZONE5_EYE_HEIGHT + 0.2, 8.5], lookAt: [0, 1.6, -2.5] },         // 1. Gerbang Masuk & Aula Megah
  { pos: [-4.2, ZONE5_EYE_HEIGHT, 4.0], lookAt: [-8.0, 1.8, 4.0] },          // 2. Sayap Digital Campus & Metaverse
  { pos: [0, ZONE5_EYE_HEIGHT + 0.3, 1.5], lookAt: [0, 2.2, -2.5] },         // 3. AI Nexus & The Neural Brain
  { pos: [4.2, ZONE5_EYE_HEIGHT, -4.0], lookAt: [8.0, 1.8, -4.0] },          // 4. The Summit & Living Grove (SDGs)
  { pos: [0, ZONE5_EYE_HEIGHT + 0.4, -16.0], lookAt: [0, 3.5, -23.0] },      // 5. Vision Beacon & Horizon Gate 2050
]

/**
 * Kontrol Navigasi Hibrida Zona 5:
 * 1. Mode Bebas: First-Person Walking (WASD/Panah/Touch/Mouse look) identik dengan Zona 1, 2, 3, 4
 * 2. Mode Guided Tour: Kamera bergerak otomatis sinematik menyusuri 5 stasiun utama galeri
 */
export function Zone5Controls({
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
}: Zone5ControlsProps) {
  const { camera, gl } = useThree()
  const keys = useRef(new Set<string>())
  const yaw = useRef(0)
  const pitch = useRef(0)
  const pos = useRef<[number, number, number]>([...ZONE5_START_POSITION])
  const drag = useRef<{ id: number; x: number; y: number } | null>(null)
  const isNearDirectoryRef = useRef(false)

  // Keyboard Event Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Toggle pointer lock on 'KeyN' / 'n'
      if (e.code === 'KeyN' || e.key.toLowerCase() === 'n') {
        e.preventDefault()
        const element = gl.domElement
        if (document.pointerLockElement === element) {
          document.exitPointerLock()
        } else {
          try {
            const res = element.requestPointerLock() as unknown as Promise<void> | undefined
            if (res && typeof res.catch === 'function') res.catch(() => {})
          } catch {
            // pointer lock error handle
          }
        }
        return
      }

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
  }, [gl, panelOpenRef, isTouring])

  // Reset Signal
  useEffect(() => {
    if (resetSignal > 0) {
      pos.current = [...ZONE5_START_POSITION]
      yaw.current = 0
      pitch.current = 0
    }
  }, [resetSignal])

  // Teleport to target position & auto-orient camera
  useEffect(() => {
    if (!targetPosition) return
    pos.current = [targetPosition[0], targetPosition[1], targetPosition[2]]
    // Orient camera towards the exhibit wing
    if (targetPosition[0] < -2) yaw.current = -Math.PI / 2
    else if (targetPosition[0] > 2) yaw.current = Math.PI / 2
    else yaw.current = 0
    pitch.current = 0
  }, [targetPosition])

  // Pointer Drag Look Around (Desktop & Mobile)
  useEffect(() => {
    const element = gl.domElement

    const onPointerDown = (event: PointerEvent) => {
      draggedRef.current = false
      if (panelOpenRef.current || isTouring) return
      if (event.button !== 0) return
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
      element.setPointerCapture?.(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      const locked = document.pointerLockElement === element
      if (locked) {
        yaw.current -= event.movementX * LOOK_SENSITIVITY
        pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current - event.movementY * LOOK_SENSITIVITY))
        return
      }
      const active = drag.current
      if (!active || active.id !== event.pointerId) return
      const dx = event.clientX - active.x
      const dy = event.clientY - active.y
      if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) draggedRef.current = true
      yaw.current -= dx * DRAG_SENSITIVITY
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current - dy * DRAG_SENSITIVITY))
      active.x = event.clientX
      active.y = event.clientY
    }

    const onPointerUp = (event: PointerEvent) => {
      if (drag.current?.id === event.pointerId) {
        drag.current = null
        element.releasePointerCapture?.(event.pointerId)
      }
    }

    const onClick = () => {
      if (panelOpenRef.current || isTouring || hoveredRef.current) return
      if (document.pointerLockElement === element) return
      if (window.innerWidth > 820) {
        try {
          const res = element.requestPointerLock() as unknown as Promise<void> | undefined
          if (res && typeof res.catch === 'function') res.catch(() => {})
        } catch {
          // ignore
        }
      }
    }

    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerup', onPointerUp)
    element.addEventListener('pointercancel', onPointerUp)
    element.addEventListener('click', onClick)
    return () => {
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerup', onPointerUp)
      element.removeEventListener('pointercancel', onPointerUp)
      element.removeEventListener('click', onClick)
    }
  }, [gl, panelOpenRef, hoveredRef, draggedRef, isTouring])

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

      // Hitung orientasi menghadap target
      const currentLook = new THREE.Vector3()
      camera.getWorldDirection(currentLook)
      const desiredLook = targetLook.clone().sub(camera.position).normalize()
      currentLook.lerp(desiredLook, delta * 2.5)
      camera.lookAt(camera.position.clone().add(currentLook))

      if (camera.position.distanceTo(targetPos) < 0.25) {
        onTourStationArrived?.()
      }
      return
    }

    // ==============================================================
    // B) MODE GLIDE TELEPORTASI WAYPOINT
    // ==============================================================
    if (targetPosition) {
      pos.current[0] += (targetPosition[0] - pos.current[0]) * 0.1
      pos.current[1] = ZONE5_EYE_HEIGHT
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

      // Tambahkan input mobile touch joystick
      forward += moveInputRef.current.forward
      strafe += moveInputRef.current.strafe

      let isRunning = false
      SPRINT_KEYS.forEach((k) => { if (keys.current.has(k)) isRunning = true })

      const speed = (isRunning ? ZONE5_RUN_SPEED : ZONE5_WALK_SPEED) * delta

      if (forward !== 0 || strafe !== 0) {
        const len = Math.hypot(forward, strafe)
        forward /= len
        strafe /= len

        const sinY = Math.sin(yaw.current)
        const cosY = Math.cos(yaw.current)

        const dx = (strafe * cosY - forward * sinY) * speed
        const dz = (-forward * cosY - strafe * sinY) * speed

        pos.current[0] = Math.max(ZONE5_BOUNDS.minX, Math.min(ZONE5_BOUNDS.maxX, pos.current[0] + dx))
        pos.current[2] = Math.max(ZONE5_BOUNDS.minZ, Math.min(ZONE5_BOUNDS.maxZ, pos.current[2] + dz))
      }
    }

    // Update Kamera
    camera.position.set(pos.current[0], ZONE5_EYE_HEIGHT, pos.current[2])
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')

    // Cek kedekatan dengan Papan Direktori
    const distToDir = Math.hypot(pos.current[0] - ZONE5_DIRECTORY_POS[0], pos.current[2] - ZONE5_DIRECTORY_POS[2])
    const isNear = distToDir < ZONE5_DIRECTORY_PROXIMITY_RADIUS
    if (isNear !== isNearDirectoryRef.current) {
      isNearDirectoryRef.current = isNear
      onProximityChange?.(isNear)
    }
  })

  return null
}
