import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { MaterialLibrary } from '../quality'
import { MINIATURE_DOME_CONFIG } from '../MuladiDome/config'
import { createRoofTextureBundle, createLandscapeTextureBundle } from '../MuladiDome/textures'

export interface MuladiDomeVitrineProps {
  position?: [number, number, number]
  rotationY?: number
  scale?: number
  isSelected?: boolean
  isHovered?: boolean
  onSelect?: () => void
  onHover?: (id: string | null) => void
  onOpenShowcase?: () => void
}

/**
 * Maket Miniatur Kaca Muladi Dome (Convention Center Undip)
 * Model 3D GLB teroptimasi (356 KB dari 9.08 MB) dengan tekstur PBR asli:
 * - Atap Anyaman Besek 3D bertekstur PBR (Albedo, Normal Map Sobel, Roughness, AO)
 * - Kisi louvers fasad bergelombang metalik
 * - Kaca tirai arsitektural gelap reflektif
 * - Kolom dan kanopi komposit putih bersih
 * - Signage akrilik emas berkilau "MULADI DOME UNIVERSITAS DIPONEGORO"
 * - Ditempatkan di dalam etalase vitrine kaca museum berlis kuningan dengan pencahayaan pameran.
 */
export function MuladiDomeVitrine({
  position = [0, 0, -2.5],
  rotationY = 0,
  scale = 0.115,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
  onOpenShowcase,
}: MuladiDomeVitrineProps) {
  // Muat model GLB terkompresi (Draco offline di /draco/)
  const { scene } = useGLTF('/assets/models/muladi_dome_draco.glb', '/draco/')

  // 1. Tekstur PBR Asli Muladi Dome (Resolusi 512px cepat, bebas freeze CPU)
  const roofTextures = useMemo(() => createRoofTextureBundle(MINIATURE_DOME_CONFIG), [])
  const landscapeTextures = useMemo(() => createLandscapeTextureBundle(MINIATURE_DOME_CONFIG), [])

  // 2. Kumpulan Material PBR Asli Muladi Dome
  const customMaterials = useMemo(() => {
    // A. Atap Anyaman Besek Tradisional Khas Muladi Dome (PBR 4-Map)
    const roofBesekPbr = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: roofTextures.albedoMap,
      normalMap: roofTextures.normalMap,
      normalScale: new THREE.Vector2(1.5, 1.5),
      roughnessMap: roofTextures.roughnessMap,
      roughness: 0.45,
      metalness: 0.15,
      aoMap: roofTextures.aoMap,
      aoMapIntensity: 1.25,
    })

    // B. Kubah Mahkota Atap Muladi Dome (Champagne Gold / Metallic White)
    const roofCrownPbr = new THREE.MeshStandardMaterial({
      color: 0xf5eedc,
      map: roofTextures.albedoMap,
      normalMap: roofTextures.normalMap,
      normalScale: new THREE.Vector2(1.0, 1.0),
      roughness: 0.35,
      metalness: 0.55,
    })

    // C. Sirip Louver Anyaman Fasad (Metallic Steel-Silver)
    const louverSilver = new THREE.MeshStandardMaterial({
      color: 0xbed2e6,
      roughness: 0.28,
      metalness: 0.65,
    })

    // D. Kaca Tirai Bangunan (Reflektif & Mengkilap)
    const architecturalGlass = new THREE.MeshPhysicalMaterial({
      color: 0x182434,
      roughness: 0.08,
      metalness: 0.3,
      transmission: 0.45,
      transparent: true,
      opacity: 0.88,
    })

    // E. Kolom Fasad & Lis Komposit Putih Bersih
    const whiteComposite = new THREE.MeshStandardMaterial({
      color: 0xfafcff,
      roughness: 0.38,
      metalness: 0.05,
    })

    // F. Spandrel Gray & Ventilasi Atap
    const spandrelDark = new THREE.MeshStandardMaterial({
      color: 0x28323e,
      roughness: 0.5,
      metalness: 0.2,
    })

    // G. Signage Emas Berkilau "MULADI DOME"
    const signGold = new THREE.MeshStandardMaterial({
      color: 0xffd966,
      emissive: 0xd4af37,
      emissiveIntensity: 0.32,
      roughness: 0.22,
      metalness: 0.88,
    })

    // H. Signage Putih Bersih "UNIVERSITAS DIPONEGORO"
    const signWhite = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff6ea,
      emissiveIntensity: 0.22,
      roughness: 0.25,
      metalness: 0.2,
    })

    // I. Plaza Lantai Maket Batu Granit
    const plazaPaving = new THREE.MeshStandardMaterial({
      map: landscapeTextures.plazaMap,
      normalMap: landscapeTextures.plazaNormal,
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughness: 0.75,
      metalness: 0.05,
    })

    return {
      roofBesekPbr,
      roofCrownPbr,
      louverSilver,
      architecturalGlass,
      whiteComposite,
      spandrelDark,
      signGold,
      signWhite,
      plazaPaving,
    }
  }, [roofTextures, landscapeTextures])

  // 3. Clone Scene & Terapkan Material PBR Realistis ke Tiap Mesh Berdasarkan Nama
  const domeModel = useMemo(() => {
    const clone = scene.clone(true)

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      child.castShadow = true
      child.receiveShadow = true

      const name = child.name.toLowerCase()

      if (name.includes('besek_3d_weave') || name.includes('roof_besek_white')) {
        child.material = customMaterials.roofBesekPbr
      } else if (name.includes('besek_dome') || name.includes('roof_crown')) {
        child.material = customMaterials.roofCrownPbr
      } else if (name.includes('louver')) {
        child.material = customMaterials.louverSilver
      } else if (name.includes('glass') || name.includes('skylight')) {
        child.material = customMaterials.architecturalGlass
      } else if (name.includes('column') || name.includes('rim') || name.includes('overhanging') || name.includes('plinth') || name.includes('ramp')) {
        child.material = customMaterials.whiteComposite
      } else if (name.includes('spandrel') || name.includes('vent') || name.includes('channel') || name.includes('mechanical')) {
        child.material = customMaterials.spandrelDark
      } else if (name.includes('sign_muladi') || name.includes('text.029')) {
        child.material = customMaterials.signGold
      } else if (name.includes('universitas') || name.includes('text.030')) {
        child.material = customMaterials.signWhite
      } else if (name.includes('plaza') || name.includes('apron') || name.includes('forecourt')) {
        child.material = customMaterials.plazaPaving
      } else if (name.includes('logo')) {
        child.material = customMaterials.signGold
      }
    })

    return clone
  }, [scene, customMaterials])

  // 4. Material Vitrine & Meja Museum
  const materials = useMemo(() => {
    return {
      pedestalBase: MaterialLibrary.polishedTeakwood(),
      marbleTop: MaterialLibrary.cremaMarfilMarble({ roughness: 0.28, clearcoat: 0.35 }),
      vitrineGlass: MaterialLibrary.museumVitrineGlass(),
      brassGold: MaterialLibrary.antiqueBrass(false),
      brassBright: MaterialLibrary.antiqueBrass(true),
    }
  }, [])

  // Dimensi Meja & Vitrine
  const pw = 3.6  // Lebar meja
  const pl = 3.2  // Panjang meja
  const ph = 0.72 // Tinggi meja dari lantai

  const gw = 3.2  // Lebar kaca
  const gl = 2.8  // Panjang kaca
  const gh = 0.95 // Tinggi kaca

  return (
    <group
      position={position}
        rotation={[0, rotationY, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover?.('muladi-dome-vitrine')
        }}
        onPointerOut={() => onHover?.(null)}
      >
        {/* ==============================================================
            1. TIERED PEDESTAL PLINTH (MEJA MARMER HITAM & TEAK KAYU JATI)
            ============================================================== */}
        {/* Undakan Bawah (Teak Kayu Jati Tua Berlis Emas) */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[pw + 0.3, 0.24, pl + 0.3]} />
          <primitive object={materials.pedestalBase} attach="material" />
        </mesh>
        <mesh position={[0, 0.245, 0]}>
          <boxGeometry args={[pw + 0.34, 0.02, pl + 0.34]} />
          <primitive object={materials.brassGold} attach="material" />
        </mesh>

        {/* Undakan Atas (Marmer Crema Marfil Ivory Mengkilap) */}
        <mesh position={[0, ph / 2 + 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[pw, ph, pl]} />
          <primitive object={materials.marbleTop} attach="material" />
        </mesh>
        <mesh position={[0, ph + 0.125, 0]}>
          <boxGeometry args={[pw + 0.04, 0.025, pl + 0.04]} />
          <primitive object={materials.brassGold} attach="material" />
        </mesh>

        {/* ==============================================================
            2. MODEL 3D GLB MULADI DOME (DI DALAM VITRINE)
            ============================================================== */}
        <group position={[0, ph + 0.16, 0]} scale={scale}>
          <primitive object={domeModel} />
        </group>

        {/* ==============================================================
            3. ETALASE KACA PELINDUNG VITRINE (CLEAR MUSEUM GLASS)
            ============================================================== */}
        <group position={[0, ph + 0.14 + gh / 2, 0]}>
          {/* Kotak Kaca Transparan */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[gw, gh, gl]} />
            <primitive object={materials.vitrineGlass} attach="material" />
          </mesh>

          {/* 4 Tiang Sudut Kuningan Emas */}
          {[-1, 1].map((sx) =>
            [-1, 1].map((sz) => (
              <mesh
                key={`vitrine-post-${sx}-${sz}`}
                position={[sx * ((gw - 0.04) / 2), 0, sz * ((gl - 0.04) / 2)]}
              >
                <boxGeometry args={[0.03, gh, 0.03]} />
                <primitive object={materials.brassBright} attach="material" />
              </mesh>
            ))
          )}

          {/* Lis Keliling Atas Kaca */}
          <mesh position={[0, gh / 2, 0]}>
            <boxGeometry args={[gw + 0.02, 0.03, gl + 0.02]} />
            <primitive object={materials.brassBright} attach="material" />
          </mesh>
        </group>

        {/* ==============================================================
            4. PLAKAT KUNINGAN RESMI MULADI DOME DI MUKA MEJA
            ============================================================== */}
        <group position={[0, ph - 0.15, pl / 2 + 0.015]}>
          <mesh castShadow>
            <boxGeometry args={[1.65, 0.28, 0.02]} />
            <primitive object={materials.brassBright} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[1.61, 0.24, 0.005]} />
            <meshStandardMaterial color="#0b1d3a" roughness={0.3} metalness={0.2} />
          </mesh>
        </group>

        {/* Tombol Inspeksi 3D Interaktif jika tersedia */}
        {onOpenShowcase && (
          <group
            position={[0, ph + 0.05, pl / 2 + 0.35]}
            onClick={(e) => {
              e.stopPropagation()
              onOpenShowcase()
            }}
          >
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[1.2, 0.06, 0.3]} />
              <meshStandardMaterial color="#c59f48" roughness={0.3} metalness={0.8} />
            </mesh>
          </group>
        )}

        {/* Halo Indikator Sorot saat Kursor Mengarah ke Meja */}
        {(isHovered || isSelected) && (
          <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.1, 2.25, 48]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.7} />
          </mesh>
        )}
    </group>
  )
}
