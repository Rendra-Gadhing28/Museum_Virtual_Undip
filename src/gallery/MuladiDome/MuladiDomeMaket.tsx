import { useMemo } from 'react'
import { DEFAULT_MULADI_DOME_CONFIG, type MuladiDomeConfig } from './config'
import {
  createRoofTextureBundle,
  createLatticeTextureBundle,
  createLandscapeTextureBundle,
} from './textures'
import {
  createPillowRoofGeometry,
  createOverhangGeometry,
  createEntranceCanopyGeometry,
} from './geometry'
import { createMuladiDomeMaterials } from './materials'

interface MuladiDomeMaketProps {
  config?: MuladiDomeConfig
  showcaseGlass?: boolean
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * Komponen 3D Utama Maket Diorama Muladi Dome
 * Merakit bangunan fisik, atap bantal 4K, fasad 12 kolom & kisi anyaman,
 * lanskap plaza, pohon miniatur, jalan, mobil mini, meja kayu veneer, dan etalase kaca.
 */
export function MuladiDomeMaket({
  config = DEFAULT_MULADI_DOME_CONFIG,
  showcaseGlass = true,
  scale = 1.0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: MuladiDomeMaketProps) {
  // 1. Inisialisasi Tekstur & Material (Memoized)
  const roofTextures = useMemo(() => createRoofTextureBundle(config), [config])
  const latticeTextures = useMemo(() => createLatticeTextureBundle(config), [config])
  const landscapeTextures = useMemo(() => createLandscapeTextureBundle(config), [config])

  const materials = useMemo(
    () =>
      createMuladiDomeMaterials(
        config,
        roofTextures,
        latticeTextures,
        landscapeTextures
      ),
    [config, roofTextures, latticeTextures, landscapeTextures]
  )

  // 2. Geometri Bangunan (Memoized)
  const pillowRoofGeom = useMemo(() => createPillowRoofGeometry(config), [config])
  const overhangGeom = useMemo(() => createOverhangGeometry(config), [config])
  const entranceCanopyGeom = useMemo(() => createEntranceCanopyGeometry(config), [config])

  const { dimensions, facade, groundFloor, diorama } = config

  // Posisi vertikal bertingkat
  const yGround = 0.02
  const ySlab = yGround + dimensions.heightGround
  const yUpper = ySlab + 0.04
  const yOverhang = yUpper + dimensions.heightUpper
  const yRoofBase = yOverhang + dimensions.overhangThickness

  // Kolom sisi depan: 12 kolom berjarak sama
  const columnsFront = useMemo(() => {
    const cols = []
    const span = dimensions.width - 0.6
    const step = span / (facade.columnCountFront - 1)
    const zPos = dimensions.length / 2 - 0.08

    for (let i = 0; i < facade.columnCountFront; i++) {
      const x = -span / 2 + i * step
      cols.push([x, yUpper + dimensions.heightUpper / 2, zPos] as [number, number, number])
    }
    return cols
  }, [dimensions, facade, yUpper])

  // Sirip louvers sudut (7 lapis pada 4 sudut membulat)
  const cornerLouvers = useMemo(() => {
    const items = []
    const layers = facade.cornerLouverLayers
    const step = (dimensions.heightUpper - 0.1) / layers
    const corners = [
      { x: dimensions.width / 2 - 0.4, z: dimensions.length / 2 - 0.4, rot: 0 },
      { x: -dimensions.width / 2 + 0.4, z: dimensions.length / 2 - 0.4, rot: Math.PI / 2 },
      { x: -dimensions.width / 2 + 0.4, z: -dimensions.length / 2 + 0.4, rot: Math.PI },
      { x: dimensions.width / 2 - 0.4, z: -dimensions.length / 2 + 0.4, rot: -Math.PI / 2 },
    ]

    for (const corner of corners) {
      for (let l = 0; l < layers; l++) {
        items.push({
          pos: [corner.x, yUpper + 0.06 + l * step, corner.z] as [number, number, number],
          rot: corner.rot,
        })
      }
    }
    return items
  }, [dimensions, facade, yUpper])

  // Miniatur Pohon di Sekeliling Plaza (Seeded Deterministic)
  const trees = useMemo(() => {
    const list: { pos: [number, number, number]; scale: number; type: 'round' | 'palm' }[] = []

    // Pohon palem di depan gedung (sesuai foto 3 & 4)
    const palmX = [-2.6, -1.8, -1.0, 1.0, 1.8, 2.6]
    for (const px of palmX) {
      list.push({
        pos: [px, 0.02, dimensions.length / 2 + 0.9],
        scale: 0.55,
        type: 'palm',
      })
    }

    // Pohon peneduh bulat di sekeliling taman
    const borderOffsets = [
      [-4.2, 2.8], [-4.4, 0.5], [-4.3, -2.0], [-4.2, -4.2],
      [4.2, 2.8], [4.4, 0.5], [4.3, -2.0], [4.2, -4.2],
      [-2.5, -5.2], [0, -5.4], [2.5, -5.2],
      [-3.2, 4.8], [3.2, 4.8]
    ]

    borderOffsets.forEach(([tx, tz], idx) => {
      list.push({
        pos: [tx, 0.02, tz],
        scale: 0.7 + (idx % 3) * 0.15,
        type: 'round',
      })
    })

    return list
  }, [dimensions])

  // Miniatur Mobil pada Jalan Aspal
  const cars = useMemo(() => [
    { pos: [-4.6, 0.04, 1.5] as [number, number, number], rot: Math.PI / 2, colorIdx: 1 }, // Merah
    { pos: [-4.6, 0.04, -1.8] as [number, number, number], rot: Math.PI / 2, colorIdx: 0 }, // Putih
    { pos: [4.6, 0.04, -2.5] as [number, number, number], rot: -Math.PI / 2, colorIdx: 2 }, // Kuning
    { pos: [2.2, 0.04, 5.8] as [number, number, number], rot: 0, colorIdx: 4 }, // Hitam
    { pos: [-1.4, 0.04, 5.8] as [number, number, number], rot: 0, colorIdx: 3 }, // Abu
  ], [])

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ==============================================================
          1. MEJA MAKET KAYU VENEER & PLINTH DIORAMA
          ============================================================== */}
      {/* Plinth Hitam Paling Dasar */}
      <mesh position={[0, -diorama.tableHeight - 0.05, 0]} material={materials.plinthBlackMaterial}>
        <boxGeometry args={[diorama.tableWidth + 0.4, 0.1, diorama.tableLength + 0.4]} />
      </mesh>

      {/* Meja Kayu Veneer Cokelat Kemerahan */}
      <mesh position={[0, -diorama.tableHeight / 2, 0]} material={materials.woodVeneerMaterial}>
        <boxGeometry args={[diorama.tableWidth, diorama.tableHeight, diorama.tableLength]} />
      </mesh>

      {/* Lis Tepi Meja Maket */}
      <mesh position={[0, -0.015, 0]} material={materials.plinthBlackMaterial}>
        <boxGeometry args={[diorama.tableWidth + 0.08, 0.03, diorama.tableLength + 0.08]} />
      </mesh>

      {/* ==============================================================
          2. LINGKUNGAN DIORAMA (Plaza, Rumput, Jalan Aspal)
          ============================================================== */}
      {/* Dasar Plaza Paving Blok */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.plazaMaterial}>
        <planeGeometry args={[diorama.tableWidth - 0.4, diorama.tableLength - 0.4]} />
      </mesh>

      {/* Jalan Aspal Perimeter */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.asphaltMaterial}>
        <ringGeometry args={[dimensions.width * 0.72, dimensions.width * 0.94, 32]} />
      </mesh>

      {/* Petak Rumput Hijau Maket (Flock Grass) & Dinding Plinth Putih */}
      <group position={[-3.6, 0.015, -1.0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.grassMaterial}>
          <planeGeometry args={[2.2, 5.4]} />
        </mesh>
        {/* Lis Plinth Foam Putih Pembatas Rumput */}
        <mesh position={[0, 0.02, 0]} material={materials.columnMaterial}>
          <boxGeometry args={[2.24, 0.04, 5.44]} />
        </mesh>
      </group>

      <group position={[3.6, 0.015, -1.0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.grassMaterial}>
          <planeGeometry args={[2.2, 5.4]} />
        </mesh>
        <mesh position={[0, 0.02, 0]} material={materials.columnMaterial}>
          <boxGeometry args={[2.24, 0.04, 5.44]} />
        </mesh>
      </group>

      {/* Paviliun Kecil Maket di Sayap Kanan (Sesuai Foto 3) */}
      <group position={[4.2, 0.02, -3.8]}>
        <mesh position={[0, 0.18, 0]} material={materials.groundWallMaterial}>
          <boxGeometry args={[0.9, 0.36, 1.4]} />
        </mesh>
        <mesh position={[0, 0.38, 0]} material={materials.columnMaterial}>
          <boxGeometry args={[1.04, 0.04, 1.54]} />
        </mesh>
      </group>

      {/* Miniatur Mobil */}
      {cars.map((car, idx) => (
        <group key={`car-${idx}`} position={car.pos} rotation={[0, car.rot, 0]}>
          <mesh position={[0, 0.04, 0]} material={materials.miniCarMaterials[car.colorIdx]}>
            <boxGeometry args={[0.16, 0.07, 0.34]} />
          </mesh>
          <mesh position={[0, 0.08, -0.02]} material={materials.glassWindowMaterial}>
            <boxGeometry args={[0.14, 0.05, 0.18]} />
          </mesh>
        </group>
      ))}

      {/* Miniatur Pohon Palem & Pohon Peneduh */}
      {trees.map((tree, idx) => (
        <group key={`tree-${idx}`} position={tree.pos} scale={tree.scale}>
          {tree.type === 'palm' ? (
            <group>
              {/* Batang Palem ramping */}
              <mesh position={[0, 0.32, 0]} material={materials.treeTrunkMaterial}>
                <cylinderGeometry args={[0.025, 0.04, 0.65, 8]} />
              </mesh>
              {/* Pelepah Palem melengkung */}
              {Array.from({ length: 8 }).map((_, pi) => {
                const angle = (pi * Math.PI * 2) / 8
                return (
                  <mesh
                    key={`frond-${pi}`}
                    position={[Math.cos(angle) * 0.15, 0.64, Math.sin(angle) * 0.15]}
                    rotation={[0.35, angle, 0]}
                    material={materials.treeCanopyMaterial}
                  >
                    <boxGeometry args={[0.08, 0.015, 0.32]} />
                  </mesh>
                )
              })}
            </group>
          ) : (
            <group>
              {/* Batang Pohon Bulat */}
              <mesh position={[0, 0.25, 0]} material={materials.treeTrunkMaterial}>
                <cylinderGeometry args={[0.04, 0.06, 0.5, 8]} />
              </mesh>
              {/* Kluster Daun Spons Maket */}
              <mesh position={[0, 0.65, 0]} material={materials.treeCanopyMaterial}>
                <sphereGeometry args={[0.38, 12, 10]} />
              </mesh>
              <mesh position={[0.1, 0.8, -0.05]} material={materials.treeCanopyMaterial}>
                <sphereGeometry args={[0.26, 10, 8]} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* ==============================================================
          3. GEDUNG MULADI DOME — STRUKTUR FISIK MAKET
          ============================================================== */}
      <group position={[0, 0, 0]}>
        {/* A. LANTAI DASAR */}
        <mesh position={[0, yGround + dimensions.heightGround / 2, 0]} material={materials.groundWallMaterial}>
          <boxGeometry args={[dimensions.width - 0.24, dimensions.heightGround, dimensions.length - 0.24]} />
        </mesh>

        {/* Deretan Jendela Persegi Panjang Lantai Dasar */}
        {Array.from({ length: groundFloor.windowGridCount }).map((_, wi) => {
          const spanW = dimensions.width - 1.2
          const stepW = spanW / (groundFloor.windowGridCount - 1)
          const wx = -spanW / 2 + wi * stepW
          return (
            <mesh
              key={`win-${wi}`}
              position={[wx, yGround + dimensions.heightGround / 2, dimensions.length / 2 - 0.1]}
              material={materials.glassWindowMaterial}
            >
              <boxGeometry args={[groundFloor.windowWidth, groundFloor.windowHeight, 0.03]} />
            </mesh>
          )
        })}

        {/* B. KANOPI PINTU MASUK UTAMA (Bentuk Lensa/Elips Melengkung) */}
        <group position={[0, yGround + dimensions.heightGround * 0.85, dimensions.length / 2 + 0.25]}>
          <mesh geometry={entranceCanopyGeom} material={materials.entranceCanopyMaterial} />
          {/* Kaca translusen bagian atas kanopi */}
          <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.canopyGlassMaterial}>
            <circleGeometry args={[groundFloor.entranceCanopyWidth * 0.44, 32]} />
          </mesh>
          {/* Tangga Masuk Maket Abu-abu */}
          {Array.from({ length: groundFloor.entranceStepCount }).map((_, si) => (
            <mesh
              key={`step-${si}`}
              position={[0, -0.15 - si * 0.04, -0.05 + si * 0.08]}
              material={materials.plazaMaterial}
            >
              <boxGeometry args={[1.2 - si * 0.1, 0.04, 0.35 + si * 0.1]} />
            </mesh>
          ))}
        </group>

        {/* C. SLAB PUTIH PEMBATAS LANTAI */}
        <mesh position={[0, ySlab, 0]} material={materials.slabMaterial}>
          <boxGeometry args={[dimensions.width - 0.1, 0.04, dimensions.length - 0.1]} />
        </mesh>

        {/* D. LANTAI ATAS: PANEL KISI ANYAMAN GELOMBANG & INTERIOR GELAP */}
        {/* Interior Gelap di Balik Kisi */}
        <mesh
          position={[0, yUpper + dimensions.heightUpper / 2, 0]}
          material={materials.interiorBackingMaterial}
        >
          <boxGeometry
            args={[
              dimensions.width - 0.45,
              dimensions.heightUpper - 0.02,
              dimensions.length - 0.45,
            ]}
          />
        </mesh>

        {/* Panel Kisi Anyaman Fasad (Depan & Belakang) */}
        <mesh
          position={[0, yUpper + dimensions.heightUpper / 2, dimensions.length / 2 - 0.18]}
          material={materials.latticeMaterial}
        >
          <planeGeometry args={[dimensions.width - 0.8, dimensions.heightUpper - 0.04]} />
        </mesh>
        <mesh
          position={[0, yUpper + dimensions.heightUpper / 2, -dimensions.length / 2 + 0.18]}
          rotation={[0, Math.PI, 0]}
          material={materials.latticeMaterial}
        >
          <planeGeometry args={[dimensions.width - 0.8, dimensions.heightUpper - 0.04]} />
        </mesh>

        {/* Panel Kisi Anyaman Fasad (Sisi Kiri & Kanan) */}
        <mesh
          position={[-dimensions.width / 2 + 0.18, yUpper + dimensions.heightUpper / 2, 0]}
          rotation={[0, Math.PI / 2, 0]}
          material={materials.latticeMaterial}
        >
          <planeGeometry args={[dimensions.length - 1.2, dimensions.heightUpper - 0.04]} />
        </mesh>
        <mesh
          position={[dimensions.width / 2 - 0.18, yUpper + dimensions.heightUpper / 2, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          material={materials.latticeMaterial}
        >
          <planeGeometry args={[dimensions.length - 1.2, dimensions.heightUpper - 0.04]} />
        </mesh>

        {/* E. 12 KOLOM SILINDER PUTIH RAMBUT DI SISI DEPAN */}
        {columnsFront.map((colPos, idx) => (
          <mesh
            key={`col-${idx}`}
            position={colPos}
            material={materials.columnMaterial}
          >
            <cylinderGeometry
              args={[
                facade.columnRadius,
                facade.columnRadius,
                dimensions.heightUpper,
                16,
              ]}
            />
          </mesh>
        ))}

        {/* F. SIRIP LOUVERS HORIZONTAL BERTUMPUK DI KEEMPAT SUDUT MELENGKUNG */}
        {cornerLouvers.map((cl, idx) => (
          <mesh
            key={`louver-${idx}`}
            position={cl.pos}
            rotation={[0, cl.rot, 0]}
            material={materials.curvedLouverMaterial}
          >
            <boxGeometry args={[0.55, facade.cornerLouverThickness, 0.55]} />
          </mesh>
        ))}

        {/* G. CINCIN TEPI ATAP (OVERHANG & SOFFIT) */}
        <mesh position={[0, yOverhang, 0]} geometry={overhangGeom} material={materials.overhangMaterial} />

        {/* H. ATAP "BANTAL" CEMBUNG DENGAN TEKSTUR 4K CHEVRON & 12 BUKAAN */}
        <mesh
          position={[0, yRoofBase, 0]}
          geometry={pillowRoofGeom}
          material={materials.roofMaterial}
        />
      </group>

      {/* ==============================================================
          4. KOTAK ETALASE KACA AKRILIK (SHOWCASE DISPLAY BOX)
          ============================================================== */}
      {showcaseGlass && (
        <mesh position={[0, diorama.acrylicCaseHeight / 2 - 0.01, 0]} material={materials.acrylicCaseMaterial}>
          <boxGeometry args={[diorama.tableWidth - 0.2, diorama.acrylicCaseHeight, diorama.tableLength - 0.2]} />
        </mesh>
      )}
    </group>
  )
}
