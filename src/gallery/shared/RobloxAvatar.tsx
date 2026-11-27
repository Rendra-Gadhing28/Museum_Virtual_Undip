import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export type AvatarAnimState = 'idle' | 'walk' | 'run'

interface RobloxAvatarProps {
  positionRef: React.MutableRefObject<[number, number, number]>
  rotationYRef: React.MutableRefObject<number>
  animStateRef: React.MutableRefObject<AvatarAnimState>
  visible?: boolean
}

const AVATAR_MODEL_PATH = '/assets/avatar_museum_batik.glb'
const FADE_DURATION = 0.16

/**
 * Karakter Avatar 3D bergaya Roblox (Batik & Peci)
 * Memuat model .glb dengan animasi Idle, Walk, dan Run.
 */
export function RobloxAvatar({
  positionRef,
  rotationYRef,
  animStateRef,
  visible = true,
}: RobloxAvatarProps) {
  const groupRef = useRef<THREE.Group>(null)
  const gltf = useGLTF(AVATAR_MODEL_PATH, '/draco/')

  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(gltf.scene)
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
    return clone
  }, [gltf.scene])

  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const actionsRef = useRef<Record<AvatarAnimState, THREE.AnimationAction | null>>({
    idle: null,
    walk: null,
    run: null,
  })
  const currentStateRef = useRef<AvatarAnimState>('idle')

  useEffect(() => {
    const mixer = new THREE.AnimationMixer(clonedScene)
    mixerRef.current = mixer

    const findClip = (names: string[]) =>
      gltf.animations.find((clip) =>
        names.some((n) => clip.name.toLowerCase() === n.toLowerCase()),
      ) ?? null

    const idleClip = findClip(['Idle']) ?? gltf.animations[0] ?? null
    const walkClip = findClip(['Walk', 'berjalan']) ?? idleClip
    const runClip = findClip(['Run', 'berlari']) ?? walkClip

    const idleAction = idleClip ? mixer.clipAction(idleClip) : null
    const walkAction = walkClip ? mixer.clipAction(walkClip) : null
    const runAction = runClip ? mixer.clipAction(runClip) : null

    actionsRef.current = {
      idle: idleAction,
      walk: walkAction,
      run: runAction,
    }

    currentStateRef.current = 'idle'
    if (idleAction) {
      idleAction.reset().play()
    }

    return () => {
      mixer.stopAllAction()
      mixer.uncacheRoot(clonedScene)
      mixerRef.current = null
    }
  }, [clonedScene, gltf.animations])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)

    if (groupRef.current) {
      const [x, y, z] = positionRef.current
      groupRef.current.position.set(x, y, z)
      groupRef.current.rotation.y = rotationYRef.current
    }

    const nextState = animStateRef.current
    if (nextState !== currentStateRef.current) {
      const prevAction = actionsRef.current[currentStateRef.current]
      const nextAction = actionsRef.current[nextState]

      if (nextAction && nextAction !== prevAction) {
        nextAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play()
        if (prevAction) {
          prevAction.crossFadeTo(nextAction, FADE_DURATION, true)
        }
      }
      currentStateRef.current = nextState
    }

    mixerRef.current?.update(dt)
  })

  return (
    <group ref={groupRef} visible={visible}>
      <primitive object={clonedScene} />
    </group>
  )
}

useGLTF.preload(AVATAR_MODEL_PATH, '/draco/')
