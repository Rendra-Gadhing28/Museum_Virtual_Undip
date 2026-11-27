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
import { RobloxAvatar, type AvatarAnimState } from '../shared/RobloxAvatar'
import {
  DEFAULT_CAM_DISTANCE,
  DEFAULT_CAM_PITCH,
  GRAVITY,
  JUMP_VELOCITY,
  MAX_CAM_DISTANCE,
  MAX_CAM_PITCH,
  MIN_CAM_DISTANCE,
  MIN_CAM_PITCH,
  lerpAngle,
  updateThirdPersonCamera,
} from '../shared/thirdPersonCamera'

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
const DRAG_SENSITIVITY = 0.004
const LOOK_SENSITIVITY = 0.0022

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
 * 1. Mode Bebas: Third-Person Roblox-Style Avatar (WASD/Panah/Spasi/Shift/Touch/Orbit Camera)
 * 2. Mode Guided Tour: Kamera meluncur otomatis menyusuri atraksi warisan sejarah kampus
 */
export function Zone3Controls({
  resetSignal,
  targetPosition,
  moveInputRef,
  panelOpenRef,
  draggedRef,
  onProximityChange,
  isTouring,
  tourStationIndex,
  onTourStationArrived,
}: Zone3ControlsProps) {
  const { camera, gl } = useThree()
  const keys = useRef(new Set<string>())

  // Camera orbit state
  const camYaw = useRef(0)
  const camPitch = useRef(DEFAULT_CAM_PITCH)
  const camDistance = useRef(DEFAULT_CAM_DISTANCE)

  // Character state (feet at y = 0)
  const pos = useRef<[number, number, number]>([ZONE3_START_POSITION[0], 0, ZONE3_START_POSITION[2]])
  const charYaw = useRef(Math.PI)
  const vy = useRef(0)
  const animState = useRef<AvatarAnimState>('idle')

  const drag = useRef<{ id: number; x: number; y: number } | null>(null)
  const isNearDirectoryRef = useRef(false)

  // Keyboard Event Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (panelOpenRef.current || isTouring) return

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

      if (e.code === 'Space') {
        e.preventDefault()
        if (pos.current[1] <= 0.001) {
          vy.current = JUMP_VELOCITY
        }
        return
      }

      keys.current.add(e.code)
      if (e.key === 'Shift') keys.current.add('Shift')
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.code)
      if (e.key === 'Shift') keys.current.delete('Shift')
    }
    const onBlur = () => {
      keys.current.clear()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [gl, panelOpenRef, isTouring])

  // Reset Signal
  useEffect(() => {
    if (resetSignal > 0) {
      pos.current = [ZONE3_START_POSITION[0], 0, ZONE3_START_POSITION[2]]
      camYaw.current = 0
      camPitch.current = DEFAULT_CAM_PITCH
      camDistance.current = DEFAULT_CAM_DISTANCE
      charYaw.current = Math.PI
      vy.current = 0
      keys.current.clear()
      if (document.pointerLockElement) document.exitPointerLock()
    }
  }, [resetSignal])

  // Teleport to target position & auto-orient camera
  useEffect(() => {
    if (!targetPosition) return
    pos.current = [targetPosition[0], 0, targetPosition[2]]
    vy.current = 0
    if (targetPosition[0] < -2) camYaw.current = -Math.PI / 2
    else if (targetPosition[0] > 2) camYaw.current = Math.PI / 2
    else camYaw.current = 0
    camPitch.current = DEFAULT_CAM_PITCH
    charYaw.current = camYaw.current + Math.PI
  }, [targetPosition])

  // Pointer Drag Orbit & Wheel Zoom (Desktop & Mobile)
  useEffect(() => {
    const el = gl.domElement

    const onPointerDown = (e: PointerEvent) => {
      if (panelOpenRef.current || isTouring) return
      draggedRef.current = false
      if (e.button !== 0 && e.button !== 2) return
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (isTouring) return
      const locked = document.pointerLockElement === el
      if (locked) {
        camYaw.current -= e.movementX * LOOK_SENSITIVITY
        camPitch.current = Math.max(
          MIN_CAM_PITCH,
          Math.min(MAX_CAM_PITCH, camPitch.current + e.movementY * LOOK_SENSITIVITY),
        )
        return
      }
      if (!drag.current || drag.current.id !== e.pointerId) return
      const dx = e.clientX - drag.current.x
      const dy = e.clientY - drag.current.y
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        draggedRef.current = true
      }
      camYaw.current -= dx * DRAG_SENSITIVITY
      camPitch.current = Math.max(
        MIN_CAM_PITCH,
        Math.min(MAX_CAM_PITCH, camPitch.current + dy * DRAG_SENSITIVITY),
      )
      drag.current.x = e.clientX
      drag.current.y = e.clientY
    }

    const onPointerUp = (e: PointerEvent) => {
      if (drag.current?.id === e.pointerId) drag.current = null
    }

    const onWheel = (e: WheelEvent) => {
      if (panelOpenRef.current || isTouring) return
      e.preventDefault()
      camDistance.current = Math.max(
        MIN_CAM_DISTANCE,
        Math.min(MAX_CAM_DISTANCE, camDistance.current + e.deltaY * 0.004),
      )
    }

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('contextmenu', onContextMenu)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('contextmenu', onContextMenu)
    }
  }, [gl, panelOpenRef, draggedRef, isTouring])

  // Frame Loop
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)

    // ==============================================================
    // A) MODE GUIDED TOUR SINEMATIK
    // ==============================================================
    if (isTouring && tourStationIndex !== null && TOUR_WAYPOINTS[tourStationIndex]) {
      const station = TOUR_WAYPOINTS[tourStationIndex]
      const targetPos = new THREE.Vector3(...(station.pos as [number, number, number]))
      const targetLook = new THREE.Vector3(...(station.lookAt as [number, number, number]))

      camera.position.lerp(targetPos, dt * 2.2)

      const currentLook = new THREE.Vector3()
      camera.getWorldDirection(currentLook)
      const desiredLook = targetLook.clone().sub(camera.position).normalize()
      currentLook.lerp(desiredLook, dt * 2.5)
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
      const dx = targetPosition[0] - pos.current[0]
      const dz = targetPosition[2] - pos.current[2]
      pos.current[0] += dx * 0.1
      pos.current[1] = 0
      pos.current[2] += dz * 0.1
      animState.current = Math.hypot(dx, dz) > 0.1 ? 'walk' : 'idle'
    } else {
      // ==============================================================
      // C) MODE THIRD-PERSON ROBLOX WALK-THROUGH (WASD / SPASI / TOUCH)
      // ==============================================================
      let forward = 0
      let strafe = 0

      if (!panelOpenRef.current) {
        FORWARD_KEYS.forEach((k) => { if (keys.current.has(k)) forward += 1 })
        BACKWARD_KEYS.forEach((k) => { if (keys.current.has(k)) forward -= 1 })
        LEFT_KEYS.forEach((k) => { if (keys.current.has(k)) strafe -= 1 })
        RIGHT_KEYS.forEach((k) => { if (keys.current.has(k)) strafe += 1 })

        forward += moveInputRef.current.forward
        strafe += moveInputRef.current.strafe
      }

      let isRunning = false
      SPRINT_KEYS.forEach((k) => { if (keys.current.has(k)) isRunning = true })

      const speed = (isRunning ? ZONE3_RUN_SPEED : ZONE3_WALK_SPEED) * dt
      const len = Math.hypot(forward, strafe)

      if (len > 0.01) {
        if (len > 1) {
          forward /= len
          strafe /= len
        }

        const sinY = Math.sin(camYaw.current)
        const cosY = Math.cos(camYaw.current)

        const moveX = strafe * cosY - forward * sinY
        const moveZ = -forward * cosY - strafe * sinY

        pos.current[0] = Math.max(ZONE3_BOUNDS.minX, Math.min(ZONE3_BOUNDS.maxX, pos.current[0] + moveX * speed))
        pos.current[2] = Math.max(ZONE3_BOUNDS.minZ, Math.min(ZONE3_BOUNDS.maxZ, pos.current[2] + moveZ * speed))

        const targetYaw = Math.atan2(moveX, moveZ)
        charYaw.current = lerpAngle(charYaw.current, targetYaw, Math.min(1, dt * 14))

        animState.current = isRunning ? 'run' : 'walk'
      } else {
        animState.current = 'idle'
      }

      // Jump & gravity physics
      if (pos.current[1] > 0 || vy.current > 0) {
        vy.current -= GRAVITY * dt
        pos.current[1] += vy.current * dt
        if (pos.current[1] <= 0) {
          pos.current[1] = 0
          vy.current = 0
        }
      }
    }

    // Update Kamera Third-Person
    updateThirdPersonCamera(camera, pos.current, camYaw.current, camPitch.current, camDistance.current, ZONE3_BOUNDS)

    // Cek kedekatan dengan Papan Direktori
    const distToDir = Math.hypot(pos.current[0] - ZONE3_DIRECTORY_POS[0], pos.current[2] - ZONE3_DIRECTORY_POS[2])
    const isNear = distToDir < ZONE3_DIRECTORY_PROXIMITY_RADIUS
    if (isNear !== isNearDirectoryRef.current) {
      isNearDirectoryRef.current = isNear
      onProximityChange?.(isNear)
    }
  })

  return (
    <RobloxAvatar
      positionRef={pos}
      rotationYRef={charYaw}
      animStateRef={animState}
      visible={!isTouring}
    />
  )
}
