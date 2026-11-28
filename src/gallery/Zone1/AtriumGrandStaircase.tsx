import { useMemo } from 'react'
import * as THREE from 'three'
import { HALL, MEZZANINE_HEIGHT, MEZZANINE_Z_BRIDGE, MEZZANINE_Z_BACK } from './layout'
import { assetCache } from './cache'

/**
 * AtriumGrandStaircase — Tangga Imperial Melengkung (S-Curve Flush Landing) & Mezzanine Lantai 2
 * dengan Pembatas Kaca Tempered Profesional Standar Mall / Museum Modern.
 *
 * Fitur:
 * - Anak tangga terakhir mendarat sejajar rata (rotY = 0, Y = 4.94m, Z = -14.0) menempel sempurna
 *   tanpa celah atau korup terhadap bibir lantai Mezzanine Lantai 2.
 * - Pembatas Kaca Tempered Standar Mall di sepanjang tepi lantai 2 dan kedua sisi tangga.
 */
export function AtriumGrandStaircase() {
  const mats = useMemo(() => {
    return {
      marbleFloor: assetCache.getMaterial('atr-marble-floor-gloss', () => new THREE.MeshStandardMaterial({
        color: '#f8f5ee',
        roughness: 0.16,
        metalness: 0.12,
      })),
      marbleStepSide: assetCache.getMaterial('atr-marble-step-side', () => new THREE.MeshStandardMaterial({
        color: '#eae3d5',
        roughness: 0.28,
        metalness: 0.08,
      })),
      goldTrim: assetCache.getMaterial('atr-gold-trim', () => new THREE.MeshStandardMaterial({
        color: '#c9a25b',
        roughness: 0.25,
        metalness: 0.88,
      })),
      brushedMetal: assetCache.getMaterial('atr-brushed-stainless', () => new THREE.MeshStandardMaterial({
        color: '#d4d8dd',
        roughness: 0.22,
        metalness: 0.9,
      })),
      // Menggunakan MeshStandardMaterial ultra-ringan tanpa pass transmission overhead
      temperedGlass: assetCache.getMaterial('atr-mall-tempered-glass-opt', () => new THREE.MeshStandardMaterial({
        color: '#cfe9f2',
        roughness: 0.05,
        metalness: 0.15,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      })),
      underSoffit: assetCache.getMaterial('atr-under-soffit', () => new THREE.MeshStandardMaterial({
        color: '#dfd7c8',
        roughness: 0.45,
      })),
      columnMarble: assetCache.getMaterial('atr-column-marble', () => new THREE.MeshStandardMaterial({
        color: '#ede6d8',
        roughness: 0.25,
      })),
    }
  }, [])

  const stepsCount = 21
  const mezzanineDepth = Math.abs(MEZZANINE_Z_BACK - MEZZANINE_Z_BRIDGE) // 7.8m
  const mezzanineTopY = MEZZANINE_HEIGHT + 0.14 // 4.94m
  const stairWidth = 3.2
  const treadDepth = 0.68

  // Geometri terbagi (Shared Geometries) untuk mencegah ratusan alokasi memori buffer baru
  const geoms = useMemo(() => ({
    goldTrimStep: new THREE.BoxGeometry(stairWidth + 0.04, 0.03, 0.025),
    balusterPost: new THREE.CylinderGeometry(0.025, 0.025, 1.1, 8),
    glassStepPanel: new THREE.BoxGeometry(0.02, 0.95, 0.72),
    handrailStep: new THREE.BoxGeometry(0.06, 0.04, 0.76),
    mallPost: new THREE.BoxGeometry(0.045, 1.12, 0.065),
    mallPostBase: new THREE.BoxGeometry(0.08, 0.08, 0.1),
    colBridgeShaft: new THREE.CylinderGeometry(0.38, 0.42, MEZZANINE_HEIGHT - 0.28, 16),
    colBridgeBase: new THREE.BoxGeometry(1.0, 0.36, 1.0),
    colBridgeCap: new THREE.BoxGeometry(0.95, 0.32, 0.95),
  }), [stairWidth])

  // Kurva S-Curve mulus: mulai di (X=±6.5, Z=-6.5, rotY=0), berakhir tepat di (X=±13.0, Z=-13.66, rotY=0)
  // sehingga tepi belakang anak tangga terakhir menempel rata 100% di Z=-14.0 pada ketinggian tepat 4.94m
  const leftSteps = useMemo(() => {
    const list = []
    for (let i = 0; i < stepsCount; i++) {
      const t = i / (stepsCount - 1)
      const s = 0.5 - 0.5 * Math.cos(t * Math.PI)
      const topY = ((i + 1) / stepsCount) * mezzanineTopY
      const cx = -6.5 - 6.5 * s
      const cz = -6.5 - 7.16 * t
      const dxDt = 6.5 * 0.5 * Math.PI * Math.sin(t * Math.PI)
      const rotY = Math.atan2(dxDt, 7.16) * 0.65
      list.push({ topY, cx, cz, rotY, t, idx: i })
    }
    return list
  }, [mezzanineTopY, stepsCount])

  const rightSteps = useMemo(() => {
    const list = []
    for (let i = 0; i < stepsCount; i++) {
      const t = i / (stepsCount - 1)
      const s = 0.5 - 0.5 * Math.cos(t * Math.PI)
      const topY = ((i + 1) / stepsCount) * mezzanineTopY
      const cx = 6.5 + 6.5 * s
      const cz = -6.5 - 7.16 * t
      const dxDt = 6.5 * 0.5 * Math.PI * Math.sin(t * Math.PI)
      const rotY = -Math.atan2(dxDt, 7.16) * 0.65
      list.push({ topY, cx, cz, rotY, t, idx: i })
    }
    return list
  }, [mezzanineTopY, stepsCount])

  return (
    <group>
      {/* ========================================================
          1. LANTAI MEZZANINE LANTAI 2 (Z = -14.0 s/d -21.8)
          ======================================================== */}
      <group position={[0, MEZZANINE_HEIGHT, (MEZZANINE_Z_BRIDGE + MEZZANINE_Z_BACK) / 2]}>
        <mesh position={[0, 0, 0]} receiveShadow material={mats.marbleFloor}>
          <boxGeometry args={[HALL.halfWidth * 2 - 0.2, 0.28, mezzanineDepth]} />
        </mesh>
        <mesh position={[0, -0.2, 0]} material={mats.underSoffit}>
          <boxGeometry args={[HALL.halfWidth * 2 - 0.3, 0.12, mezzanineDepth - 0.1]} />
        </mesh>
        <mesh position={[0, 0.08, mezzanineDepth / 2]} material={mats.goldTrim}>
          <boxGeometry args={[HALL.halfWidth * 2, 0.14, 0.08]} />
        </mesh>
      </group>

      {/* ========================================================
          2. PILAR PENOPANG MEZZANINE DI BAWAH
          ======================================================== */}
      {[-11.0, -4.0, 4.0, 11.0].map((colX, idx) => (
        <group key={`col-bridge-${idx}`} position={[colX, MEZZANINE_HEIGHT / 2, MEZZANINE_Z_BRIDGE]}>
          <mesh material={mats.columnMarble} geometry={geoms.colBridgeShaft} />
          <mesh position={[0, -MEZZANINE_HEIGHT / 2 + 0.18, 0]} material={mats.marbleStepSide} geometry={geoms.colBridgeBase} />
          <mesh position={[0, MEZZANINE_HEIGHT / 2 - 0.18, 0]} material={mats.goldTrim} geometry={geoms.colBridgeCap} />
        </group>
      ))}

      {/* ========================================================
          3. TANGGA MARMER MELENGKUNG (SAYAP KIRI)
          ======================================================== */}
      <group>
        {leftSteps.map((step) => {
          const blockHeight = step.topY
          return (
            <group key={`l-curved-step-${step.idx}`} position={[step.cx, blockHeight / 2, step.cz]} rotation={[0, step.rotY, 0]}>
              <mesh receiveShadow material={mats.marbleFloor}>
                <boxGeometry args={[stairWidth, blockHeight, treadDepth]} />
              </mesh>
              <mesh position={[0, blockHeight / 2 - 0.015, treadDepth / 2]} material={mats.goldTrim} geometry={geoms.goldTrimStep} />
              {step.idx % 2 === 0 && (
                <>
                  <mesh position={[stairWidth / 2 - 0.1, blockHeight / 2 + 0.55, 0]} material={mats.brushedMetal} geometry={geoms.balusterPost} />
                  <mesh position={[-stairWidth / 2 + 0.1, blockHeight / 2 + 0.55, 0]} material={mats.brushedMetal} geometry={geoms.balusterPost} />
                </>
              )}
              <mesh position={[stairWidth / 2 - 0.1, blockHeight / 2 + 0.52, 0]} material={mats.temperedGlass} geometry={geoms.glassStepPanel} />
              <mesh position={[-stairWidth / 2 + 0.1, blockHeight / 2 + 0.52, 0]} material={mats.temperedGlass} geometry={geoms.glassStepPanel} />
              <mesh position={[stairWidth / 2 - 0.1, blockHeight / 2 + 1.08, 0]} material={mats.brushedMetal} geometry={geoms.handrailStep} />
              <mesh position={[-stairWidth / 2 + 0.1, blockHeight / 2 + 1.08, 0]} material={mats.brushedMetal} geometry={geoms.handrailStep} />
            </group>
          )
        })}
      </group>

      {/* ========================================================
          4. TANGGA MARMER MELENGKUNG (SAYAP KANAN)
          ======================================================== */}
      <group>
        {rightSteps.map((step) => {
          const blockHeight = step.topY
          return (
            <group key={`r-curved-step-${step.idx}`} position={[step.cx, blockHeight / 2, step.cz]} rotation={[0, step.rotY, 0]}>
              <mesh receiveShadow material={mats.marbleFloor}>
                <boxGeometry args={[stairWidth, blockHeight, treadDepth]} />
              </mesh>
              <mesh position={[0, blockHeight / 2 - 0.015, treadDepth / 2]} material={mats.goldTrim} geometry={geoms.goldTrimStep} />
              {step.idx % 2 === 0 && (
                <>
                  <mesh position={[-stairWidth / 2 + 0.1, blockHeight / 2 + 0.55, 0]} material={mats.brushedMetal} geometry={geoms.balusterPost} />
                  <mesh position={[stairWidth / 2 - 0.1, blockHeight / 2 + 0.55, 0]} material={mats.brushedMetal} geometry={geoms.balusterPost} />
                </>
              )}
              <mesh position={[-stairWidth / 2 + 0.1, blockHeight / 2 + 0.52, 0]} material={mats.temperedGlass} geometry={geoms.glassStepPanel} />
              <mesh position={[stairWidth / 2 - 0.1, blockHeight / 2 + 0.52, 0]} material={mats.temperedGlass} geometry={geoms.glassStepPanel} />
              <mesh position={[-stairWidth / 2 + 0.1, blockHeight / 2 + 1.08, 0]} material={mats.brushedMetal} geometry={geoms.handrailStep} />
              <mesh position={[stairWidth / 2 - 0.1, blockHeight / 2 + 1.08, 0]} material={mats.brushedMetal} geometry={geoms.handrailStep} />
            </group>
          )
        })}
      </group>

      {/* ========================================================
          5. PEMBATAS KACA TEMPERED PROFESIONAL STANDAR MALL (LANTAI 2)
          ======================================================== */}
      {/* 5A. Pembatas Kaca Tengah Depan (X = -11.3 s/d +11.3, lebar 22.6m) */}
      <group position={[0, mezzanineTopY, MEZZANINE_Z_BRIDGE]}>
        <mesh position={[0, 0.05, 0]} material={mats.brushedMetal}>
          <boxGeometry args={[22.6, 0.1, 0.08]} />
        </mesh>
        <mesh position={[0, 0.6, 0]} material={mats.temperedGlass}>
          <boxGeometry args={[22.56, 1.04, 0.028]} />
        </mesh>
        <mesh position={[0, 1.14, 0]} material={mats.brushedMetal}>
          <boxGeometry args={[22.7, 0.055, 0.08]} />
        </mesh>
        <mesh position={[0, 1.17, 0]} material={mats.goldTrim}>
          <boxGeometry args={[22.7, 0.012, 0.05]} />
        </mesh>
        {Array.from({ length: 17 }).map((_, i) => {
          const px = -11.2 + i * 1.4
          return (
            <group key={`mall-post-c-${i}`} position={[px, 0.58, 0]}>
              <mesh material={mats.brushedMetal} geometry={geoms.mallPost} />
              <mesh position={[0, -0.5, 0]} material={mats.goldTrim} geometry={geoms.mallPostBase} />
            </group>
          )
        })}
      </group>

      {/* 5B. Pembatas Kaca Ujung Luar Sayap Kiri (X = -14.7 s/d -17.9) */}
      <group position={[-16.3, mezzanineTopY, MEZZANINE_Z_BRIDGE]}>
        <mesh position={[0, 0.05, 0]} material={mats.brushedMetal}>
          <boxGeometry args={[3.2, 0.1, 0.08]} />
        </mesh>
        <mesh position={[0, 0.6, 0]} material={mats.temperedGlass}>
          <boxGeometry args={[3.16, 1.04, 0.028]} />
        </mesh>
        <mesh position={[0, 1.14, 0]} material={mats.brushedMetal}>
          <boxGeometry args={[3.25, 0.055, 0.08]} />
        </mesh>
        {[-1.5, 0, 1.5].map((px, i) => (
          <mesh key={`mall-post-l-${i}`} position={[px, 0.58, 0]} material={mats.brushedMetal} geometry={geoms.mallPost} />
        ))}
      </group>

      {/* 5C. Pembatas Kaca Ujung Luar Sayap Kanan (X = +14.7 s/d +17.9) */}
      <group position={[16.3, mezzanineTopY, MEZZANINE_Z_BRIDGE]}>
        <mesh position={[0, 0.05, 0]} material={mats.brushedMetal}>
          <boxGeometry args={[3.2, 0.1, 0.08]} />
        </mesh>
        <mesh position={[0, 0.6, 0]} material={mats.temperedGlass}>
          <boxGeometry args={[3.16, 1.04, 0.028]} />
        </mesh>
        <mesh position={[0, 1.14, 0]} material={mats.brushedMetal}>
          <boxGeometry args={[3.25, 0.055, 0.08]} />
        </mesh>
        {[-1.5, 0, 1.5].map((px, i) => (
          <mesh key={`mall-post-r-${i}`} position={[px, 0.58, 0]} material={mats.brushedMetal} geometry={geoms.mallPost} />
        ))}
      </group>
    </group>
  )
}
