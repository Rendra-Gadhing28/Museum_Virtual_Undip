import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import type { SpotLight } from 'three'

/**
 * Makes `target-position` (world coordinates) actually work for a `<spotLight>`.
 *
 * three.js computes a spotlight beam from `light.target.matrixWorld`, but the
 * target is only updated while it is part of the scene graph. R3F's
 * `target-position` prop merely writes `target.position`, leaving the target
 * detached — so every beam would silently aim at the world origin instead of
 * the intended exhibit.
 *
 * This hook attaches the light's target to the scene for the component's
 * lifetime and removes it again on unmount.
 *
 * Usage:
 *   const spotRef = useSpotTarget()
 *   <spotLight ref={spotRef} target-position={worldPos} ... />
 */
export function useSpotTarget() {
  const ref = useRef<SpotLight>(null)
  const scene = useThree((state) => state.scene)

  useEffect(() => {
    const light = ref.current
    if (!light) return
    scene.add(light.target)
    return () => {
      scene.remove(light.target)
    }
  }, [scene])

  return ref
}
