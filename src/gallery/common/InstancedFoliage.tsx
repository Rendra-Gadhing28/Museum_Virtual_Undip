import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MaterialLibrary } from '../quality'

export interface FoliageCluster {
  position: [number, number, number]
  radius?: number
  count?: number
}

interface InstancedFoliageProps {
  clusters: FoliageCluster[]
  leafSize?: number
  color?: string
  castShadow?: boolean
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Shared InstancedMesh leaf canopy for miniature trees & diorama greenery.
 * Uses alpha-tested double-sided leaf cards with normal maps and random per-instance transforms.
 */
export function InstancedFoliage({
  clusters,
  leafSize = 0.09,
  color = '#2d5a27',
  castShadow = false,
}: InstancedFoliageProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const totalCount = useMemo(
    () => clusters.reduce((sum, c) => sum + (c.count ?? 28), 0),
    [clusters],
  )

  const leafMaterial = useMemo(
    () => MaterialLibrary.leafFoliageMaterial(color),
    [color],
  )

  const leafGeometry = useMemo(
    () => new THREE.PlaneGeometry(leafSize, leafSize),
    [leafSize],
  )

  useEffect(() => {
    return () => {
      leafGeometry.dispose()
    }
  }, [leafGeometry])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh || totalCount === 0) return

    const dummy = new THREE.Object3D()
    let instanceIdx = 0

    clusters.forEach((cluster, cIdx) => {
      const count = cluster.count ?? 28
      const radius = cluster.radius ?? 0.14
      const [cx, cy, cz] = cluster.position

      for (let i = 0; i < count; i++) {
        const s = cIdx * 997 + i * 31 + 1
        const theta = seededRandom(s) * Math.PI * 2
        const phi = Math.acos(2 * seededRandom(s + 1) - 1)
        const r = radius * Math.cbrt(seededRandom(s + 2))

        dummy.position.set(
          cx + r * Math.sin(phi) * Math.cos(theta),
          cy + r * Math.cos(phi) * 0.85,
          cz + r * Math.sin(phi) * Math.sin(theta),
        )
        dummy.rotation.set(
          (seededRandom(s + 3) - 0.5) * Math.PI,
          seededRandom(s + 4) * Math.PI * 2,
          (seededRandom(s + 5) - 0.5) * Math.PI,
        )
        const scale = 0.7 + seededRandom(s + 6) * 0.65
        dummy.scale.setScalar(scale)
        dummy.updateMatrix()
        mesh.setMatrixAt(instanceIdx++, dummy.matrix)
      }
    })

    mesh.instanceMatrix.needsUpdate = true
  }, [clusters, totalCount])

  if (totalCount === 0) return null

  return (
    <instancedMesh
      ref={meshRef}
      args={[leafGeometry, leafMaterial, totalCount]}
      castShadow={castShadow}
    />
  )
}
