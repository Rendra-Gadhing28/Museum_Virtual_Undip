import * as THREE from 'three'
import type { MuladiDomeConfig } from './config'
import type {
  RoofTextureBundle,
  LatticeTextureBundle,
  LandscapeTextureBundle,
} from './textures'

export interface MuladiDomeMaterialBundle {
  roofMaterial: THREE.MeshStandardMaterial
  overhangMaterial: THREE.MeshStandardMaterial
  columnMaterial: THREE.MeshStandardMaterial
  latticeMaterial: THREE.MeshStandardMaterial
  interiorBackingMaterial: THREE.MeshBasicMaterial
  groundWallMaterial: THREE.MeshStandardMaterial
  glassWindowMaterial: THREE.MeshPhysicalMaterial
  entranceCanopyMaterial: THREE.MeshStandardMaterial
  canopyGlassMaterial: THREE.MeshPhysicalMaterial
  curvedLouverMaterial: THREE.MeshStandardMaterial
  slabMaterial: THREE.MeshStandardMaterial
  plazaMaterial: THREE.MeshStandardMaterial
  grassMaterial: THREE.MeshStandardMaterial
  woodVeneerMaterial: THREE.MeshStandardMaterial
  asphaltMaterial: THREE.MeshStandardMaterial
  acrylicCaseMaterial: THREE.MeshPhysicalMaterial
  plinthBlackMaterial: THREE.MeshStandardMaterial
  treeCanopyMaterial: THREE.MeshStandardMaterial
  treeTrunkMaterial: THREE.MeshStandardMaterial
  miniCarMaterials: THREE.MeshStandardMaterial[]
}

/**
 * Membuat kumpulan material PBR khusus karakter MAKET FISIK (matte/satin akrilik,
 * potongan laser-cut, bersih tanpa kotoran/lumut).
 */
export function createMuladiDomeMaterials(
  cfg: MuladiDomeConfig,
  roofTex: RoofTextureBundle,
  latticeTex: LatticeTextureBundle,
  landscapeTex: LandscapeTextureBundle
): MuladiDomeMaterialBundle {
  // 1. Material Atap "Bantal" (PBR Utama dengan 4K Map)
  const roofMaterial = new THREE.MeshStandardMaterial({
    map: roofTex.albedoMap,
    normalMap: roofTex.normalMap,
    normalScale: new THREE.Vector2(1.2, 1.2),
    roughnessMap: roofTex.roughnessMap,
    roughness: 0.52,
    metalness: 0.04,
    aoMap: roofTex.aoMap,
    aoMapIntensity: 1.15,
  })

  // 2. Cincin Overhang Lis Tepi Atap (Putih Cat Satin)
  const overhangMaterial = new THREE.MeshStandardMaterial({
    color: cfg.colors.whiteModelPaint,
    roughness: 0.42,
    metalness: 0.05,
  })

  // 3. Kolom Silinder Fasad Ramping (Cat Putih Satin Maket)
  const columnMaterial = new THREE.MeshStandardMaterial({
    color: cfg.colors.whitePure,
    roughness: cfg.facade.columnRoughness,
    metalness: 0.06,
  })

  // 4. Panel Kisi Anyaman Gelombang (Steel-Blue Woven Lattice)
  const latticeMaterial = new THREE.MeshStandardMaterial({
    map: latticeTex.albedoMap,
    alphaMap: latticeTex.alphaMap,
    normalMap: latticeTex.normalMap,
    normalScale: new THREE.Vector2(1.0, 1.0),
    roughnessMap: latticeTex.roughnessMap,
    roughness: 0.40,
    metalness: 0.25,
    transparent: true,
    alphaTest: 0.25,
    side: THREE.DoubleSide,
  })

  // 5. Interior Gelap di Balik Kisi Anyaman
  const interiorBackingMaterial = new THREE.MeshBasicMaterial({
    color: cfg.colors.interiorDark,
  })

  // 6. Dinding Lantai Dasar (Putih-Abu Matte Akrilik)
  const groundWallMaterial = new THREE.MeshStandardMaterial({
    color: cfg.colors.groundWallMatte,
    roughness: cfg.groundFloor.wallRoughness,
    metalness: 0.04,
  })

  // 7. Jendela Kaca Kecil Lantai Dasar
  const glassWindowMaterial = new THREE.MeshPhysicalMaterial({
    color: '#1E252D',
    roughness: 0.12,
    metalness: 0.4,
    transmission: 0.4,
    transparent: true,
    opacity: 0.92,
  })

  // 8. Kanopi Pintu Masuk Elips
  const entranceCanopyMaterial = new THREE.MeshStandardMaterial({
    color: cfg.colors.whitePure,
    roughness: 0.38,
    metalness: 0.06,
  })

  // Atap kaca kanopi translusen
  const canopyGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: cfg.colors.skylightGlass,
    roughness: 0.18,
    metalness: 0.1,
    transmission: 0.75,
    transparent: true,
    opacity: 0.85,
  })

  // 9. Sirip Louvers Melengkung Sudut
  const curvedLouverMaterial = new THREE.MeshStandardMaterial({
    color: cfg.colors.whiteModelPaint,
    roughness: 0.45,
    metalness: 0.05,
  })

  // 10. Slab Pembatas Putih
  const slabMaterial = new THREE.MeshStandardMaterial({
    color: cfg.colors.whitePure,
    roughness: 0.40,
    metalness: 0.06,
  })

  // 11. Plaza Paving Diorama
  const plazaMaterial = new THREE.MeshStandardMaterial({
    map: landscapeTex.plazaMap,
    normalMap: landscapeTex.plazaNormal,
    normalScale: new THREE.Vector2(0.8, 0.8),
    roughness: 0.65,
    metalness: 0.08,
  })

  // 12. Rumput Hijau Maket (Flock Grass)
  const grassMaterial = new THREE.MeshStandardMaterial({
    map: landscapeTex.grassMap,
    normalMap: landscapeTex.grassNormal,
    normalScale: new THREE.Vector2(1.2, 1.2),
    roughness: 0.85,
    metalness: 0.0,
  })

  // 13. Meja Kayu Veneer
  const woodVeneerMaterial = new THREE.MeshStandardMaterial({
    map: landscapeTex.woodVeneerMap,
    roughness: 0.32,
    metalness: 0.05,
  })

  // 14. Aspal Jalan
  const asphaltMaterial = new THREE.MeshStandardMaterial({
    map: landscapeTex.asphaltRoadMap,
    roughness: 0.78,
    metalness: 0.05,
  })

  // 15. Kotak Etalase Kaca Akrilik Maket
  const acrylicCaseMaterial = new THREE.MeshPhysicalMaterial({
    color: '#FFFFFF',
    transmission: cfg.diorama.acrylicTransmission,
    opacity: 1.0,
    transparent: true,
    roughness: cfg.diorama.acrylicRoughness,
    ior: 1.49, // Indeks refraksi akrilik murni
    metalness: 0.02,
    depthWrite: false,
    side: THREE.DoubleSide,
  })

  // 16. Plinth Hitam Dasar Meja
  const plinthBlackMaterial = new THREE.MeshStandardMaterial({
    color: cfg.colors.plinthBlack,
    roughness: 0.35,
    metalness: 0.2,
  })

  // 17. Pohon & Ranting Maket
  const treeCanopyMaterial = new THREE.MeshStandardMaterial({
    color: cfg.colors.foliageCanopy,
    roughness: 0.88,
    metalness: 0.0,
  })

  const treeTrunkMaterial = new THREE.MeshStandardMaterial({
    color: cfg.colors.trunkWood,
    roughness: 0.75,
    metalness: 0.1,
  })

  // 18. Miniatur Mobil Berwarna Glossy (Putih, Merah, Kuning, Abu, Hitam)
  const carColors = ['#F5F5F5', '#C02626', '#EAB308', '#475569', '#1E293B']
  const miniCarMaterials = carColors.map(
    (c) =>
      new THREE.MeshStandardMaterial({
        color: c,
        roughness: 0.18,
        metalness: 0.65,
      })
  )

  return {
    roofMaterial,
    overhangMaterial,
    columnMaterial,
    latticeMaterial,
    interiorBackingMaterial,
    groundWallMaterial,
    glassWindowMaterial,
    entranceCanopyMaterial,
    canopyGlassMaterial,
    curvedLouverMaterial,
    slabMaterial,
    plazaMaterial,
    grassMaterial,
    woodVeneerMaterial,
    asphaltMaterial,
    acrylicCaseMaterial,
    plinthBlackMaterial,
    treeCanopyMaterial,
    treeTrunkMaterial,
    miniCarMaterials,
  }
}
