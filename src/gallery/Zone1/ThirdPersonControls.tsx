import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { ThirdPersonControlsProps } from './types'
import {
  BOUNDS,
  DIRECTORY_BOARD_POS,
  DIRECTORY_PROXIMITY_RADIUS,
  DRAG_SENSITIVITY,
  DRAG_THRESHOLD,
  LOOK_SENSITIVITY,
  RUN_SPEED,
  START_POSITION,
  WALK_SPEED,
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

const FORWARD_KEYS = new Set(['KeyW', 'ArrowUp'])
const BACKWARD_KEYS = new Set(['KeyS', 'ArrowDown'])
const LEFT_KEYS = new Set(['KeyA', 'ArrowLeft'])
const RIGHT_KEYS = new Set(['KeyD', 'ArrowRight'])
const SPRINT_KEYS = new Set(['ShiftLeft', 'ShiftRight', 'Shift'])

/**
 * Roblox-Style Third-Person Museum Controls:
 * - Desktop: WASD/Arrows to move relative to camera, Shift to sprint, Space to jump,
 *   Right-click or Left-click drag to orbit camera, Scroll to zoom, N to toggle pointer lock.
 * - Touch: Virtual joystick to move, drag screen to orbit camera.
 */
export function ThirdPersonControls({
  resetSignal,
  targetPosition,
  spawnPosition = START_POSITION,
  bounds = BOUNDS,
  moveInputRef,
  panelOpenRef,
  draggedRef,
  onProximityChange,
  disabled = false,
}: ThirdPersonControlsProps) {
  const { camera, gl } = useThree()
  const keys = useRef(new Set<string>())

  // Camera orbit state
  const camYaw = useRef(0)
  const camPitch = useRef(DEFAULT_CAM_PITCH)
  const camDistance = useRef(DEFAULT_CAM_DISTANCE)

  // Character state (feet at y = 0)
  const pos = useRef<[number, number, number]>([spawnPosition[0], 0, spawnPosition[2]])
  const charYaw = useRef(Math.PI)
  const vy = useRef(0)
  const animState = useRef<AvatarAnimState>('idle')

  const drag = useRef<{ id: number; x: number; y: number } | null>(null)
  const isNearDirectoryRef = useRef(false)
  const disabledRef = useRef(disabled)

  useEffect(() => {
    pos.current = [spawnPosition[0], 0, spawnPosition[2]]
    vy.current = 0
    camYaw.current = 0
    camPitch.current = DEFAULT_CAM_PITCH
    charYaw.current = Math.PI
  }, [spawnPosition])

  useEffect(() => {
    disabledRef.current = disabled
    if (!disabled) {
      pos.current = [spawnPosition[0], 0, spawnPosition[2]]
      vy.current = 0
      camYaw.current = 0
      camPitch.current = DEFAULT_CAM_PITCH
      charYaw.current = Math.PI
      keys.current.clear()
      drag.current = null
    }
  }, [disabled, spawnPosition])

  // Keyboard Event Listeners
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (disabledRef.current) return

      // Toggle pointer lock on 'KeyN'
      if (event.code === 'KeyN' || event.key.toLowerCase() === 'n') {
        event.preventDefault()
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

      if (event.code === 'Space') {
        event.preventDefault()
        if (pos.current[1] <= 0.001 && !panelOpenRef.current) {
          vy.current = JUMP_VELOCITY
        }
        return
      }

      if (
        FORWARD_KEYS.has(event.code) ||
        BACKWARD_KEYS.has(event.code) ||
        LEFT_KEYS.has(event.code) ||
        RIGHT_KEYS.has(event.code) ||
        SPRINT_KEYS.has(event.code) ||
        event.key === 'Shift'
      ) {
        event.preventDefault()
        keys.current.add(event.code)
        if (event.key === 'Shift') keys.current.add('Shift')
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.code)
      if (event.key === 'Shift') keys.current.delete('Shift')
    }

    const onBlur = () => {
      keys.current.clear()
    }

    window.addEventListener('keydown', onKeyDown, { passive: false })
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [gl, panelOpenRef])

  // Pointer Orbit & Wheel Zoom (Left or Right drag on desktop, drag on touch)
  useEffect(() => {
    const element = gl.domElement

    const onPointerDown = (event: PointerEvent) => {
      if (disabledRef.current) return
      draggedRef.current = false
      if (event.button !== 0 && event.button !== 2) return
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
      try {
        if (!document.pointerLockElement) {
          element.setPointerCapture?.(event.pointerId)
        }
      } catch {
        // Prevent unhandled InvalidStateError
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (disabledRef.current) return
      const locked = document.pointerLockElement === element
      if (locked) {
        camYaw.current -= event.movementX * LOOK_SENSITIVITY
        camPitch.current = clampPitch(camPitch.current + event.movementY * LOOK_SENSITIVITY)
        return
      }
      const active = drag.current
      if (!active || active.id !== event.pointerId) return
      const dx = event.clientX - active.x
      const dy = event.clientY - active.y
      if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) draggedRef.current = true
      camYaw.current -= dx * DRAG_SENSITIVITY
      camPitch.current = clampPitch(camPitch.current + dy * DRAG_SENSITIVITY)
      active.x = event.clientX
      active.y = event.clientY
    }

    const onPointerUp = (event: PointerEvent) => {
      if (drag.current?.id === event.pointerId) {
        drag.current = null
        try {
          if (element.hasPointerCapture?.(event.pointerId)) {
            element.releasePointerCapture?.(event.pointerId)
          }
        } catch {
          // Prevent unhandled InvalidStateError
        }
      }
    }

    const onWheel = (event: WheelEvent) => {
      if (disabledRef.current || panelOpenRef.current) return
      event.preventDefault()
      camDistance.current = Math.max(
        MIN_CAM_DISTANCE,
        Math.min(MAX_CAM_DISTANCE, camDistance.current + event.deltaY * 0.004),
      )
    }

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }

    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerup', onPointerUp)
    element.addEventListener('pointercancel', onPointerUp)
    element.addEventListener('wheel', onWheel, { passive: false })
    element.addEventListener('contextmenu', onContextMenu)
    return () => {
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerup', onPointerUp)
      element.removeEventListener('pointercancel', onPointerUp)
      element.removeEventListener('wheel', onWheel)
      element.removeEventListener('contextmenu', onContextMenu)
    }
  }, [gl, panelOpenRef, draggedRef])

  // Reset View Signal
  useEffect(() => {
    if (resetSignal === 0) return
    camYaw.current = 0
    camPitch.current = DEFAULT_CAM_PITCH
    camDistance.current = DEFAULT_CAM_DISTANCE
    pos.current = [START_POSITION[0], 0, START_POSITION[2]]
    charYaw.current = Math.PI
    vy.current = 0
    keys.current.clear()
    if (moveInputRef.current) {
      moveInputRef.current.forward = 0
      moveInputRef.current.strafe = 0
    }
    drag.current = null
    if (document.pointerLockElement) document.exitPointerLock()
  }, [resetSignal, moveInputRef])

  // Teleport to target position
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

  // Frame Loop Movement & Camera Update
  useFrame((_, delta) => {
    if (disabledRef.current) return
    const dt = Math.min(delta, 0.05)

    let forward = 0
    let strafe = 0

    if (!panelOpenRef.current) {
      if (Array.from(keys.current).some((c) => FORWARD_KEYS.has(c))) forward += 1
      if (Array.from(keys.current).some((c) => BACKWARD_KEYS.has(c))) forward -= 1
      if (Array.from(keys.current).some((c) => RIGHT_KEYS.has(c))) strafe += 1
      if (Array.from(keys.current).some((c) => LEFT_KEYS.has(c))) strafe -= 1

      if (moveInputRef.current) {
        forward += moveInputRef.current.forward
        strafe += moveInputRef.current.strafe
      }
    }

    const inputLen = Math.hypot(forward, strafe)
    if (inputLen > 1) {
      forward /= inputLen
      strafe /= inputLen
    }

    const isSprinting =
      keys.current.has('ShiftLeft') ||
      keys.current.has('ShiftRight') ||
      keys.current.has('Shift')

    const currentSpeed = isSprinting ? RUN_SPEED : WALK_SPEED

    if (inputLen > 0.01) {
      const cosY = Math.cos(camYaw.current)
      const sinY = Math.sin(camYaw.current)

      const moveX = strafe * cosY - forward * sinY
      const moveZ = -forward * cosY - strafe * sinY

      pos.current[0] = Math.max(bounds.minX, Math.min(bounds.maxX, pos.current[0] + moveX * currentSpeed * dt))
      pos.current[2] = Math.max(bounds.minZ, Math.min(bounds.maxZ, pos.current[2] + moveZ * currentSpeed * dt))

      // Smoothly rotate character to face movement direction (Roblox-style)
      const targetYaw = Math.atan2(moveX, moveZ)
      charYaw.current = lerpAngle(charYaw.current, targetYaw, Math.min(1, dt * 14))

      animState.current = isSprinting ? 'run' : 'walk'
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

    // Position third-person orbit camera behind character
    updateThirdPersonCamera(camera, pos.current, camYaw.current, camPitch.current, camDistance.current, bounds)

    // Proximity check to the Directory Board
    const distToDirectory = Math.hypot(
      pos.current[0] - DIRECTORY_BOARD_POS[0],
      pos.current[2] - DIRECTORY_BOARD_POS[2],
    )
    const isNear = distToDirectory <= DIRECTORY_PROXIMITY_RADIUS
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
      visible={!disabled}
    />
  )
}

function clampPitch(value: number): number {
  return Math.max(MIN_CAM_PITCH, Math.min(MAX_CAM_PITCH, value))
}
