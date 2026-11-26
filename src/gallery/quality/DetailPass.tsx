import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { CulledObject } from '../../perf/culling'
import { QUALITY } from './QualityConfig'
import { MaterialLibrary } from './MaterialLibrary'

export interface DetailPassProps {
  zone: 'zone1' | 'zone2' | 'zone3' | 'zone4' | 'zone5'
}

/**
 * Museum Stanchion Post & Velvet Cordon
 * High-end brass stanchions with weighted base, ring collar, and sphere finial
 */
export function MuseumStanchionPost({ position }: { position: [number, number, number] }) {
  const brassMat = useMemo(() => MaterialLibrary.antiqueBrass(true), [])

  return (
    <group position={position}>
      {/* Weighted Plinth Base */}
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.05, 24]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
      {/* Main Upright Post */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 16]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
      {/* Collar Ring */}
      <mesh position={[0, 0.93, 0]}>
        <torusGeometry args={[0.04, 0.015, 12, 24]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
      {/* Spherical Finial */}
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * Catenary Curved Velvet Rope between two points
 */
export function VelvetCatenaryRope({
  start,
  end,
  sag = 0.15,
  color = '#800d17',
}: {
  start: [number, number, number]
  end: [number, number, number]
  sag?: number
  color?: string
}) {
  const velvetMat = useMemo(() => MaterialLibrary.royalVelvet(color), [color])

  const curve = useMemo(() => {
    const p0 = new THREE.Vector3(...start)
    const p2 = new THREE.Vector3(...end)
    const p1 = new THREE.Vector3(
      (start[0] + end[0]) / 2,
      Math.min(start[1], end[1]) - sag,
      (start[2] + end[2]) / 2,
    )
    return new THREE.QuadraticBezierCurve3(p0, p1, p2)
  }, [start, end, sag])

  const geom = useMemo(() => new THREE.TubeGeometry(curve, 20, 0.016, 8, false), [curve])

  return (
    <mesh geometry={geom}>
      <primitive object={velvetMat} attach="material" />
    </mesh>
  )
}

/**
 * Brass Corner Guard / Bevel Bracket with micro-screws
 */
export function BrassCornerBracket({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  const brassMat = useMemo(() => MaterialLibrary.antiqueBrass(), [])

  return (
    <group position={position} rotation={rotation}>
      {/* Horizontal plate */}
      <mesh position={[0.04, 0.004, 0.04]}>
        <boxGeometry args={[0.08, 0.008, 0.08]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
      {/* Vertical front plate */}
      <mesh position={[0.04, -0.04, 0.08]}>
        <boxGeometry args={[0.08, 0.08, 0.008]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
      {/* Vertical side plate */}
      <mesh position={[0.08, -0.04, 0.04]}>
        <boxGeometry args={[0.008, 0.08, 0.08]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
      {/* Micro-rivet / Screw head */}
      <mesh position={[0.04, 0.009, 0.04]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * Static Diorama Foliage (Miniature Bushes & Trees)
 * 100% STATIC InstancedMesh with seeded variation.
 * STRICTLY NO PARTICLES!
 */
export function StaticDioramaFoliage({
  count = 24,
  center = [0, 0, 0],
  radius = 3.5,
  seed = 42,
}: {
  count?: number
  center?: [number, number, number]
  radius?: number
  seed?: number
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const foliageMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#2e5932',
      roughness: 0.85,
      metalness: 0.05,
    })
  }, [])

  const geom = useMemo(() => new THREE.DodecahedronGeometry(0.12, 1), [])

  useMemo(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    let s = seed

    const prng = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }

    for (let i = 0; i < count; i++) {
      const angle = prng() * Math.PI * 2
      const dist = 0.8 + prng() * radius
      const x = center[0] + Math.cos(angle) * dist
      const z = center[2] + Math.sin(angle) * dist
      const y = center[1] + 0.08

      const scale = 0.7 + prng() * 0.8
      dummy.position.set(x, y, z)
      dummy.rotation.set(prng() * 0.4, prng() * Math.PI * 2, prng() * 0.4)
      dummy.scale.set(scale, scale * (1 + prng() * 0.5), scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [count, center, radius, seed])

  return (
    <instancedMesh
      ref={meshRef}
      args={[geom, foliageMat, count]}
      castShadow
      receiveShadow
    />
  )
}

/**
 * Museum Architectural Exhibit Brass Title Plaque
 * Placed at 45-degree angle in front of pedestals
 */
export function DioramaTitlePlaque({
  position,
  title,
  sub,
}: {
  position: [number, number, number]
  title: string
  sub?: string
}) {
  const brassMat = useMemo(() => MaterialLibrary.antiqueBrass(), [])
  const plaqueTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 196
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#141311'
    ctx.fillRect(0, 0, 512, 196)

    // Gold border line
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 4
    ctx.strokeRect(8, 8, 496, 180)

    ctx.fillStyle = '#ffd700'
    ctx.font = 'bold 28px "Segoe UI", system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(title, 256, sub ? 78 : 98)

    if (sub) {
      ctx.fillStyle = '#cbd5e1'
      ctx.font = '20px "Segoe UI", system-ui, sans-serif'
      ctx.fillText(sub, 256, 130)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [title, sub])

  return (
    <group position={position} rotation={[-Math.PI / 4, 0, 0]}>
      {/* Brass Mount Frame */}
      <mesh>
        <boxGeometry args={[0.84, 0.32, 0.02]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
      {/* Dark Enamel Face with Inscribed Gold Title (Synchronous, 0 network, never hangs) */}
      <mesh position={[0, 0, 0.012]}>
        <boxGeometry args={[0.78, 0.26, 0.01]} />
        <meshStandardMaterial map={plaqueTexture} roughness={0.35} metalness={0.7} />
      </mesh>
      {/* 4 Corner Screws */}
      {[-0.38, 0.38].map((sx, si) =>
        [-0.12, 0.12].map((sy, syi) => (
          <mesh key={`screw-${si}-${syi}`} position={[sx, sy, 0.02]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <primitive object={brassMat} attach="material" />
          </mesh>
        )),
      )}
    </group>
  )
}

/**
 * Master DetailPass: Adds museum-grade diorama props per zone,
 * strictly registered into the CullingManager!
 */
export function DetailPass({ zone }: DetailPassProps) {
  if (!QUALITY.current.detailProps || !QUALITY.current.enabled) return null

  return (
    <group>
      {/* ==============================================================
          ZONE 1: The Origin of Undip — Stanchions & Brass Plaques
          ============================================================== */}
      {zone === 'zone1' && (
        <CulledObject id="zone1-details" radius={12}>
          {/* Stanchions guarding the Ceremonial Podium & Prasasti */}
          <MuseumStanchionPost position={[-2.2, 0, -16.2]} />
          <MuseumStanchionPost position={[-2.2, 0, -20.2]} />
          <MuseumStanchionPost position={[2.2, 0, -16.2]} />
          <MuseumStanchionPost position={[2.2, 0, -20.2]} />

          {/* Catenary Velvet Ropes */}
          <VelvetCatenaryRope start={[-2.2, 0.93, -16.2]} end={[-2.2, 0.93, -20.2]} color="#800d17" />
          <VelvetCatenaryRope start={[2.2, 0.93, -16.2]} end={[2.2, 0.93, -20.2]} color="#800d17" />
          <VelvetCatenaryRope start={[-2.2, 0.93, -16.2]} end={[-0.8, 0.93, -16.2]} color="#800d17" />
          <VelvetCatenaryRope start={[0.8, 0.93, -16.2]} end={[2.2, 0.93, -16.2]} color="#800d17" />

          {/* Stanchions around Pangeran Diponegoro Statue Plaza */}
          <MuseumStanchionPost position={[-5.4, 0, -18.6]} />
          <MuseumStanchionPost position={[-9.6, 0, -18.6]} />
          <VelvetCatenaryRope start={[-5.4, 0.93, -18.6]} end={[-9.6, 0.93, -18.6]} color="#112d56" />

          {/* Brass Title Plaque on Ceremonial Dias */}
          <DioramaTitlePlaque position={[0, 0.42, -16.1]} title="PODIUM KEHORMATAN" />
        </CulledObject>
      )}

      {/* ==============================================================
          ZONE 2: The Growth of Knowledge — Diorama Foliage & Vitrine Trims
          ============================================================== */}
      {zone === 'zone2' && (
        <CulledObject id="zone2-details" radius={10}>
          {/* Static Mini-Bushes around Pleburan & Tembalang dioramas */}
          <StaticDioramaFoliage count={18} center={[-1.2, 0.55, 0]} radius={1.4} seed={201} />
          <StaticDioramaFoliage count={22} center={[1.2, 0.55, 0]} radius={1.5} seed={302} />

          {/* Brass Corner Brackets on Diorama Plinth */}
          <BrassCornerBracket position={[2.4, 0.53, 1.7]} rotation={[0, 0, 0]} />
          <BrassCornerBracket position={[-2.4, 0.53, 1.7]} rotation={[0, Math.PI / 2, 0]} />
          <BrassCornerBracket position={[-2.4, 0.53, -1.7]} rotation={[0, Math.PI, 0]} />
          <BrassCornerBracket position={[2.4, 0.53, -1.7]} rotation={[0, -Math.PI / 2, 0]} />

          {/* Museum Plaque */}
          <DioramaTitlePlaque position={[0, 0.52, 1.72]} title="DIORAMA TRANSFORMASI KAMPUS" />
        </CulledObject>
      )}

      {/* ==============================================================
          ZONE 3: The Heritage of Undip — Andesite Sanctum Stanchions
          ============================================================== */}
      {zone === 'zone3' && (
        <CulledObject id="zone3-details" radius={12}>
          {/* Stanchions guarding Plaza Prasasti Batu Andesit */}
          <MuseumStanchionPost position={[-2.8, 0, -18.8]} />
          <MuseumStanchionPost position={[-2.8, 0, -23.2]} />
          <MuseumStanchionPost position={[2.8, 0, -18.8]} />
          <MuseumStanchionPost position={[2.8, 0, -23.2]} />

          <VelvetCatenaryRope start={[-2.8, 0.93, -18.8]} end={[-2.8, 0.93, -23.2]} color="#112d56" />
          <VelvetCatenaryRope start={[2.8, 0.93, -18.8]} end={[2.8, 0.93, -23.2]} color="#112d56" />
          <VelvetCatenaryRope start={[-2.8, 0.93, -18.8]} end={[-0.9, 0.93, -18.8]} color="#112d56" />
          <VelvetCatenaryRope start={[0.9, 0.93, -18.8]} end={[2.8, 0.93, -18.8]} color="#112d56" />

          {/* Brass Plaque on Andesite Pedestal */}
          <DioramaTitlePlaque position={[0, 0.58, -18.8]} title="PRASASTI BATU ANDESIT 1957" />
        </CulledObject>
      )}

      {/* ==============================================================
          ZONE 4: Undip Today — Campus Living Maket Greens & Architectural Trims
          ============================================================== */}
      {zone === 'zone4' && (
        <CulledObject id="zone4-details" radius={15}>
          {/* Static Greenery around Maket Tembalang 220 Ha */}
          <StaticDioramaFoliage count={32} center={[0, 0.58, -2.5]} radius={3.2} seed={404} />

          {/* Modern Titanium Plaque */}
          <DioramaTitlePlaque position={[0, 0.48, 0.72]} title="MAKET KAMPUS TERPADU TEMBALANG" />
        </CulledObject>
      )}

      {/* ==============================================================
          ZONE 5: Undip Future — Optical Conduit Trim & Stanchions
          ============================================================== */}
      {zone === 'zone5' && (
        <CulledObject id="zone5-details" radius={14}>
          {/* Stanchions guarding the Horizon Gate 2050 */}
          <MuseumStanchionPost position={[-3.2, 0, -20.5]} />
          <MuseumStanchionPost position={[3.2, 0, -20.5]} />
          <VelvetCatenaryRope start={[-3.2, 0.93, -20.5]} end={[-1.2, 0.93, -20.5]} color="#38bdf8" />
          <VelvetCatenaryRope start={[1.2, 0.93, -20.5]} end={[3.2, 0.93, -20.5]} color="#38bdf8" />

          {/* Future Beacon Plaque */}
          <DioramaTitlePlaque position={[0, 0.55, -20.6]} title="VISION BEACON 2050" />
        </CulledObject>
      )}
    </group>
  )
}
