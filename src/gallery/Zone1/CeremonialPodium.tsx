import { useMemo } from 'react'
import * as THREE from 'three'
import type { CeremonialPodiumProps } from './types'
import {
  createIndonesianFlagTexture,
  createUndipFlagTexture,
  createUndipWallTypographyTexture,
  createOfficialUndipLogoTexture,
  createIvoryGraniteTexture,
} from './textures'
import { HALL } from './layout'
import { assetCache } from './cache'
import { createProceduralNormalMap, MaterialLibrary, QUALITY } from '../graphics'

/**
 * Modern Architectural LED Ring Pendant Chandelier
 * Securely anchored to the grand ceiling surface (HALL.height = 8.8m)
 * with continuous brass aircraft suspension cables and architectural ceiling canopy,
 * eliminating any mid-air floating appearance.
 */
function LedRingPendantChandelier({
  position,
  isMobile: _isMobile = false,
}: {
  position: [number, number, number]
  isMobile?: boolean
}) {
  // Height difference from chandelier ring (y=4.8) to ceiling (y=8.8) is exactly 4.0m
  const ceilingDist = 4.0

  return (
    <group position={position}>
      {/* 4 Continuous Brass Aircraft Suspension Cables reaching the ceiling flush */}
      {[-0.95, 0.95].map((cx, ci) =>
        [-0.75, 0.75].map((cz, czi) => (
          <group key={`wire-${ci}-${czi}`}>
            {/* Cable spanning full 4.0m to ceiling */}
            <mesh position={[cx, ceilingDist / 2, cz]}>
              <cylinderGeometry args={[0.0035, 0.0035, ceilingDist, 8]} />
              <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Ceiling Cable Tensioner / Anchor Stud */}
            <mesh position={[cx, ceilingDist - 0.02, cz]}>
              <cylinderGeometry args={[0.016, 0.016, 0.04, 12]} />
              <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )),
      )}

      {/* Central Structural Downrod / Power Conduit running to ceiling */}
      <mesh position={[0, ceilingDist / 2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, ceilingDist, 16]} />
        <meshStandardMaterial color="#c5a059" metalness={0.88} roughness={0.25} />
      </mesh>

      {/* Grand Ceiling Mounting Canopy Rose (Anchored flush against the ceiling at y=4.0) */}
      <group position={[0, ceilingDist - 0.02, 0]}>
        {/* Main Architectural Canopy Plate */}
        <mesh>
          <cylinderGeometry args={[0.38, 0.38, 0.05, 32]} />
          <meshStandardMaterial color="#c5a059" metalness={0.88} roughness={0.25} />
        </mesh>
        {/* Ceiling Trim Bezel */}
        <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.36, 0.44, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Center Cable Hub Coupler */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.06, 24]} />
          <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Outer Ring Torus (Diameter ~2.6m) */}
      <group position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Outer Brushed Brass Casing */}
        <mesh castShadow>
          <torusGeometry args={[1.3, 0.026, 16, 48]} />
          <meshStandardMaterial color="#c5a059" metalness={0.88} roughness={0.22} />
        </mesh>
        {/* Outer Warm Cream LED Diffuser Ring */}
        <mesh position={[0, 0, 0.012]}>
          <torusGeometry args={[1.3, 0.016, 16, 48]} />
          <meshStandardMaterial
            color="#fffdf8"
            emissive="#fff6e8"
            emissiveIntensity={1.8}
            roughness={0.25}
          />
        </mesh>
      </group>

      {/* Inner Ring Torus (Diameter ~1.6m) */}
      <group position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Inner Brushed Brass Casing */}
        <mesh castShadow>
          <torusGeometry args={[0.8, 0.022, 16, 40]} />
          <meshStandardMaterial color="#c5a059" metalness={0.88} roughness={0.22} />
        </mesh>
        {/* Inner Warm Cream LED Diffuser Ring */}
        <mesh position={[0, 0, 0.012]}>
          <torusGeometry args={[0.8, 0.014, 16, 40]} />
          <meshStandardMaterial
            color="#fffdf8"
            emissive="#fff6e8"
            emissiveIntensity={1.8}
            roughness={0.25}
          />
        </mesh>
      </group>

      {/* Soft Warm Ivory Downward Illumination removed for lightweight ambient lighting */}
    </group>
  )
}

/**
 * Static Curved Fabric Flag Component (Lightweight, Zero Animation Overhead)
 * Pre-computes smooth draped folds once with useMemo. Zero CPU load during render loop.
 */
interface StaticFlagProps {
  position: [number, number, number]
  width?: number
  height?: number
  texture?: THREE.Texture | null
}

function StaticCurvedFlag({
  position,
  width = 1.08,
  height = 0.72,
  texture,
}: StaticFlagProps) {
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(width, height, 24, 14)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i)
      const v = pos.getY(i)
      const factor = Math.max(0, (u + width / 2) / width)
      const wave =
        Math.sin(factor * Math.PI * 2.2) * 0.065 * factor +
        Math.sin(factor * Math.PI * 1.4 + v * 1.8) * 0.025 * factor
      pos.setZ(i, wave)
    }
    g.computeVertexNormals()
    return g
  }, [width, height])

  const fabricNormal = useMemo(() => {
    const n = createProceduralNormalMap('fabric', 512, 512)
    n.repeat.set(3, 2)
    return n
  }, [])

  return (
    <mesh position={position} geometry={geom} castShadow>
      <meshPhysicalMaterial
        map={texture}
        normalMap={QUALITY.current.physicalMaterials ? fabricNormal : null}
        normalScale={new THREE.Vector2(0.4, 0.4)}
        roughness={0.72}
        metalness={0.04}
        sheen={QUALITY.current.sheen ? 0.75 : 0}
        sheenColor="#ffffff"
        sheenRoughness={0.45}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/**
 * Universitas Diponegoro Ceremonial Dais & Stage Installation
 * Features:
 * 1. Royal Navy Blue architectural wall (#142e56) with gilded wainscoting and pilasters.
 * 2. Golden Garuda Pancasila sculpture at the top center.
 * 3. Official framed portraits of President & Vice-President flanking Garuda.
 * 4. Official Shield Logo of Universitas Diponegoro & "UNIVERSITAS DIPONEGORO" 3D title.
 * 5. Monumental Black & Gold Prasasti Pendirian & Peresmian Universitas Diponegoro.
 * 6. Naturally waving ceremonial flags (Indonesia & Pataka Undip) fluttering in the air.
 * 7. Carved teakwood ceremonial podium (without glitchy blue board) on 2-tier dais.
 */
export function CeremonialPodium({
  position,
  isSelected: _isSelected,
  isHovered: _isHovered,
  isMobile = false,
  onSelect: _onSelect,
  onHover: _onHover,
  onSelectPrasasti: _onSelectPrasasti,
}: CeremonialPodiumProps) {
  const wallTitleTexture = useMemo(() => createUndipWallTypographyTexture(), [])
  const indoFlagTexture = useMemo(() => createIndonesianFlagTexture(), [])
  const undipFlagTexture = useMemo(() => createUndipFlagTexture(), [])
  const ivoryGraniteTexture = useMemo(() => createIvoryGraniteTexture(), [])

  // Load the official Undip shield logo from the user's reference photo (auto-cleaned background)
  const officialLogoTexture = useMemo(() => createOfficialUndipLogoTexture(), [])

  const baseMaterials = useMemo(() => {
    return {
      ivoryGraniteMaterial: assetCache.getMaterial(
        'pod-pure-ivory-granite-v4',
        () =>
          new THREE.MeshStandardMaterial({
            map: ivoryGraniteTexture,
            color: '#ffffff',
            roughness: 0.95, // Pure honed matte natural stone - zero specular reflection
            metalness: 0.0,
          }),
      ),
      futuristicWood: assetCache.getMaterial(
        'pod-futuristic-wood',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#8c5828',
            roughness: 0.55,
            metalness: 0.05,
          }),
      ),
      woodSlat: assetCache.getMaterial(
        'pod-wood-slat',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#6e401b',
            roughness: 0.58,
            metalness: 0.05,
          }),
      ),
      warmCoveLightGlow: assetCache.getMaterial(
        'pod-warm-cove-glow',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#ffe082',
            emissive: '#ff9800',
            emissiveIntensity: 2.2,
            roughness: 0.35,
            metalness: 0.05,
          }),
      ),
      teakWood: MaterialLibrary.polishedTeakwood(),
      darkTeakCarved: assetCache.getMaterial(
        'pod-dark-teak',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#2a180e',
            roughness: 0.58,
            metalness: 0.08,
          }),
      ),
      navyWallPanel: assetCache.getMaterial(
        'pod-navy-wall-matte-v4',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#122c54',
            roughness: 0.92, // Matte museum architectural paint - zero specular reflection
            metalness: 0.0,
          }),
      ),
      navyPanel: assetCache.getMaterial(
        'pod-navy-panel-matte-v4',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#163666',
            roughness: 0.92,
            metalness: 0.0,
          }),
      ),
      goldTrim: assetCache.getMaterial(
        'pod-gold-trim-satin-v4',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#d4af37',
            roughness: 0.52, // Satin brushed brass - soft diffuse, no sharp hotspot glare
            metalness: 0.7,
          }),
      ),
      goldBright: assetCache.getMaterial(
        'pod-gold-bright-satin-v4',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#f9d342',
            emissive: '#d4af37',
            emissiveIntensity: 0.05,
            roughness: 0.52,
            metalness: 0.65,
          }),
      ),
      blackGranite: assetCache.getMaterial(
        'pod-black-granite',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#0e1117',
            roughness: 0.2,
            metalness: 0.3,
          }),
      ),
      redVelvet: MaterialLibrary.royalVelvet('#8b151b'),
      goldBrass: MaterialLibrary.antiqueBrass(false),
      leatherBlotter: assetCache.getMaterial(
        'pod-leather-blotter',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#1c140d',
            roughness: 0.7,
            metalness: 0.1,
          }),
      ),
      parchment: MaterialLibrary.parchmentPaper('#f4ecd8'),
      microphoneChrome: assetCache.getMaterial(
        'pod-mic-chrome',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#e2e8f0',
            roughness: 0.2,
            metalness: 0.9,
          }),
      ),
    }
  }, [])

  const materials = baseMaterials

  const halfW = HALL.halfWidth
  const height = HALL.height
  const backWallZ = HALL.zBack - position[2] // relative to podium group

  return (
    <group position={position}>
      {/* ============================================================
          1. BACK FOCAL WALL ARCHITECTURE & WAINSCOTING (Royal Navy)
          ============================================================ */}
      <group position={[0, height / 2, backWallZ + 0.05]}>
        {/* Navy Wall Wainscoting Panel Frame */}
        <mesh position={[0, 0, 0.02]} receiveShadow>
          <boxGeometry args={[halfW * 2 - 0.2, height - 0.4, 0.04]} />
          <primitive object={materials.navyWallPanel} attach="material" />
        </mesh>

        {/* Lower Wainscot Dado Rail (Teak & Gold) */}
        <mesh position={[0, -height / 2 + 1.15, 0.05]}>
          <boxGeometry args={[halfW * 2 - 0.1, 0.12, 0.05]} />
          <primitive object={materials.teakWood} attach="material" />
        </mesh>
        <mesh position={[0, -height / 2 + 1.22, 0.07]}>
          <boxGeometry args={[halfW * 2 - 0.1, 0.03, 0.03]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>

        {/* Upper Cornice Gold Molding */}
        <mesh position={[0, height / 2 - 0.25, 0.05]}>
          <boxGeometry args={[halfW * 2 - 0.1, 0.14, 0.06]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>

        {/* ============================================================
            INDIRECT LINEAR LIGHTING & RECESSED LED DOWNLIGHTS (CEILING CORNICE)
            "pakaikan lampu downlight soft warm cream, Recessed LED Downlight... Indirect Linear Lighting"
            ============================================================ */}
        {/* Top Indirect Linear Lighting Cove Strip (Washing upper wall & ceiling) */}
        <mesh position={[0, height / 2 - 0.18, 0.09]}>
          <boxGeometry args={[halfW * 2 - 0.4, 0.04, 0.04]} />
          <meshStandardMaterial
            color="#fff8ec"
            emissive="#ffeacc"
            emissiveIntensity={2.8}
            roughness={0.2}
          />
        </mesh>

        {/* Recessed Architectural LED Downlight Can Fixtures along the back ceiling */}
        {[-5.0, -3.2, -1.5, 0, 1.5, 3.2, 5.0].map((rx, ri) => (
          <group key={`recessed-can-${ri}`} position={[rx, height / 2 - 0.14, 0.35]}>
            {/* Outer Canister Bezel Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.06, 24]} />
              <primitive object={materials.goldTrim} attach="material" />
            </mesh>
            {/* Frosted Warm Cream LED Diode Lens */}
            <mesh position={[0, -0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.02, 24]} />
              <meshStandardMaterial
                color="#fffcf5"
                emissive="#ffedd0"
                emissiveIntensity={1.6}
                roughness={0.25}
              />
            </mesh>
          </group>
        ))}

        {/* Left & Right Flanking Gold Pilasters */}
        {[-halfW + 0.06, halfW - 0.06].map((cx, ci) => (
          <mesh key={ci} position={[cx, 0, 0.03]}>
            <boxGeometry args={[0.16, height, 0.08]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
        ))}

        {/* Interior Gold Pilasters Framing the Center Dais */}
        {[-5.1, 5.1].map((px, pi) => (
          <group key={`pila-${pi}`} position={[px, 0, 0.03]}>
            <mesh>
              <boxGeometry args={[0.14, height - 0.5, 0.04]} />
              <primitive object={materials.goldTrim} attach="material" />
            </mesh>
            <mesh position={[0, height / 2 - 0.4, 0.02]}>
              <boxGeometry args={[0.22, 0.15, 0.06]} />
              <primitive object={materials.goldBright} attach="material" />
            </mesh>
            <mesh position={[0, -height / 2 + 0.35, 0.02]}>
              <boxGeometry args={[0.22, 0.15, 0.06]} />
              <primitive object={materials.goldBright} attach="material" />
            </mesh>
          </group>
        ))}

        {/* ============================================================
            LAYER 1 (BASE BACKGROUND): DEEP ROYAL NAVY BLUE WALL
            (Navy wall paneling spans the entire background at z=0.02)
            ============================================================ */}

        {/* ============================================================
            LAYER 2: FUTURISTIC ARCHITECTURAL TIMBER & WOOD SLAT FEATURE
            (Overlays Layer 1 in the Center, wide horizontal rectangle: 9.0m x 5.2m)
            ============================================================ */}
        <group position={[0, 0.05, 0.07]}>
          {/* Main Architectural Wood Backing Frame (Rectangle: 9.0m x 5.2m) */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[9.0, 5.2, 0.06]} />
            <primitive object={materials.futuristicWood} attach="material" />
          </mesh>

          {/* Left Wing Futuristic Vertical Wood Slats */}
          {Array.from({ length: 6 }).map((_, i) => {
            const slatX = -4.25 + i * 0.16
            return (
              <group key={`l-slat-${i}`} position={[slatX, 0, 0.04]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.08, 4.8, 0.04]} />
                  <primitive object={materials.woodSlat} attach="material" />
                </mesh>
                <mesh position={[0, 0, 0.022]}>
                  <boxGeometry args={[0.02, 4.7, 0.01]} />
                  <primitive object={materials.goldTrim} attach="material" />
                </mesh>
              </group>
            )
          })}

          {/* Right Wing Futuristic Vertical Wood Slats */}
          {Array.from({ length: 6 }).map((_, i) => {
            const slatX = 3.45 + i * 0.16
            return (
              <group key={`r-slat-${i}`} position={[slatX, 0, 0.04]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.08, 4.8, 0.04]} />
                  <primitive object={materials.woodSlat} attach="material" />
                </mesh>
                <mesh position={[0, 0, 0.022]}>
                  <boxGeometry args={[0.02, 4.7, 0.01]} />
                  <primitive object={materials.goldTrim} attach="material" />
                </mesh>
              </group>
            )
          })}

          {/* Modern Architectural Vertical Linear Light Droplets */}
          {[-4.35, -3.4, 3.4, 4.35].map((lx, li) => (
            <mesh key={`v-glow-${li}`} position={[lx, 1.2 - (li % 2) * 0.35, 0.065]}>
              <cylinderGeometry args={[0.014, 0.014, 1.6 + (li % 2) * 0.4, 12]} />
              <primitive object={materials.warmCoveLightGlow} attach="material" />
            </mesh>
          ))}

          {/* ============================================================
              LED OREN FAJAR EMAS: MENGELILINGI BINGKAI MONUMEN
              ============================================================ */}
          {/* Top LED Strip */}
          <mesh position={[0, 2.35, 0.08]}>
            <boxGeometry args={[8.44, 0.06, 0.05]} />
            <meshStandardMaterial color="#ffcc66" emissive="#ff8c1a" emissiveIntensity={5.2} roughness={0.2} />
          </mesh>
          {/* Bottom LED Strip */}
          <mesh position={[0, -2.35, 0.08]}>
            <boxGeometry args={[8.44, 0.06, 0.05]} />
            <meshStandardMaterial color="#ffcc66" emissive="#ff8c1a" emissiveIntensity={5.2} roughness={0.2} />
          </mesh>
          {/* Left LED Strip */}
          <mesh position={[-4.12, 0, 0.08]}>
            <boxGeometry args={[0.06, 4.74, 0.05]} />
            <meshStandardMaterial color="#ffcc66" emissive="#ff8c1a" emissiveIntensity={5.2} roughness={0.2} />
          </mesh>
          {/* Right LED Strip */}
          <mesh position={[4.12, 0, 0.08]}>
            <boxGeometry args={[0.06, 4.74, 0.05]} />
            <meshStandardMaterial color="#ffcc66" emissive="#ff8c1a" emissiveIntensity={5.2} roughness={0.2} />
          </mesh>

          {/* Pendar Soft Light Warm di Tengah Papan & Cahaya Oren Fajar Emas */}
          {!isMobile && (
            <>
              <pointLight position={[0, 0.35, 2.2]} color="#ffdfa8" intensity={9} distance={8.5} decay={1.7} />
              <pointLight position={[-2.8, 0, 1.0]} color="#ff9429" intensity={6.5} distance={7.5} decay={1.7} />
              <pointLight position={[2.8, 0, 1.0]} color="#ff9429" intensity={6.5} distance={7.5} decay={1.7} />
            </>
          )}

          {/* ============================================================
              LAYER 3: POLISHED IVORY GRANITE RECTANGULAR MONOLITH
              ============================================================ */}
          <group position={[0, 0, 0.12]}>
            {/* Architectural Indirect Dawn-Orange-Gold Backlight behind Layer 3 */}
            <mesh position={[0, 0, -0.015]}>
              <boxGeometry args={[7.98, 4.38, 0.03]} />
              <meshStandardMaterial
                color="#ffcc66"
                emissive="#ff8811"
                emissiveIntensity={4.2}
                roughness={0.25}
              />
            </mesh>

            {/* Garis LED Oren Fajar Emas Tampak Depan di Sekeliling Bingkai */}
            <mesh position={[0, 2.15, 0.032]}>
              <boxGeometry args={[7.92, 0.045, 0.025]} />
              <meshStandardMaterial color="#ffd175" emissive="#ff921f" emissiveIntensity={4.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, -2.15, 0.032]}>
              <boxGeometry args={[7.92, 0.045, 0.025]} />
              <meshStandardMaterial color="#ffd175" emissive="#ff921f" emissiveIntensity={4.8} roughness={0.2} />
            </mesh>
            <mesh position={[-3.94, 0, 0.032]}>
              <boxGeometry args={[0.045, 4.34, 0.025]} />
              <meshStandardMaterial color="#ffd175" emissive="#ff921f" emissiveIntensity={4.8} roughness={0.2} />
            </mesh>
            <mesh position={[3.94, 0, 0.032]}>
              <boxGeometry args={[0.045, 4.34, 0.025]} />
              <meshStandardMaterial color="#ffd175" emissive="#ff921f" emissiveIntensity={4.8} roughness={0.2} />
            </mesh>

            {/* Gilded Bevel Perimeter Trim for Granite Slab */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[7.86, 4.26, 0.055]} />
              <primitive object={materials.goldTrim} attach="material" />
            </mesh>

            {/* Main Pure Ivory Granite Slab (Soft Warm Light Wash) */}
            <mesh position={[0, 0, 0.015]} castShadow receiveShadow>
              <boxGeometry args={[7.8, 4.2, 0.05]} />
              <primitive object={materials.ivoryGraniteMaterial} attach="material" />
            </mesh>
            {/* Lapisan Pendar Soft Warm Light Tipis di Permukaan Papan */}
            <mesh position={[0, 0, 0.042]}>
              <planeGeometry args={[7.74, 4.14]} />
              <meshStandardMaterial
                color="#fff3db"
                emissive="#ffdca3"
                emissiveIntensity={0.24}
                transparent
                opacity={0.22}
                roughness={0.95}
                metalness={0}
              />
            </mesh>

            {/* ============================================================
                ON LAYER 3:
                1. PROMINENT OFFICIAL UNDIP SHIELD LOGO (Perfectly Centered, Clean Shield Face)
                2. PURE BLUE NAVY TYPOGRAPHY: "UNIVERSITAS DIPONEGORO" (Wide, Uncropped, No background boxes!)
                ============================================================ */}

            {/* 1. OFFICIAL UNDIP SHIELD LOGO (CENTERED & MATTE DIFFUSE) */}
            <mesh position={[0, 0.65, 0.045]}>
              <planeGeometry args={[1.65, 1.95]} />
              <meshStandardMaterial
                map={officialLogoTexture}
                transparent
                roughness={0.88}
                metalness={0.0}
              />
            </mesh>

            {/* 2. GRAND ARCHITECTURAL TYPOGRAPHY: "UNIVERSITAS DIPONEGORO" (MATTE NAVY) */}
            <mesh position={[0, -0.92, 0.045]}>
              <planeGeometry args={[6.6, 1.65]} />
              <meshStandardMaterial
                map={wallTitleTexture}
                transparent
                roughness={0.88}
                metalness={0.0}
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* ============================================================
          MODERN ARCHITECTURAL LED RING PENDANT CHANDELIER
          Suspended gracefully from the ceiling above the stage dais
          ============================================================ */}
      <LedRingPendantChandelier position={[0, 4.8, 0.4]} isMobile={isMobile} />

      {/* ============================================================
          CEREMONIAL FLAGS (RIGHT FLANK)
          ============================================================ */}
      <group position={[4.0, 0, -1.8]}>
        {/* Polished Teakwood Stand (Clean architectural timber, no clashing brass front) */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.16, 0.7]} />
          <primitive object={materials.teakWood} attach="material" />
        </mesh>
        <mesh position={[0, 0.162, 0]} receiveShadow>
          <boxGeometry args={[1.84, 0.015, 0.64]} />
          <primitive object={materials.darkTeakCarved} attach="material" />
        </mesh>

        {/* Recessed Brass Sockets for flagpoles */}
        {[-0.45, 0.45].map((sx, si) => (
          <mesh key={si} position={[sx, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.065, 0.06, 16]} />
            <primitive object={materials.goldBrass} attach="material" />
          </mesh>
        ))}

        {/* BENDERA MERAH PUTIH */}
        <group position={[-0.45, 0.18, 0]}>
          {/* Brass Flagpole */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 3.6, 16]} />
            <primitive object={materials.goldBrass} attach="material" />
          </mesh>
          <mesh position={[0, 3.65, 0]}>
            <coneGeometry args={[0.055, 0.18, 12]} />
            <primitive object={materials.goldBrass} attach="material" />
          </mesh>
          {/* Static Curved Fabric Mesh */}
          <StaticCurvedFlag
            position={[0.54, 2.7, 0]}
            width={1.08}
            height={0.72}
            texture={indoFlagTexture}
          />
        </group>

        {/* BENDERA PATAKA UNDIP */}
        <group position={[0.45, 0.18, 0]}>
          {/* Brass Flagpole */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 3.6, 16]} />
            <primitive object={materials.goldBrass} attach="material" />
          </mesh>
          <mesh position={[0, 3.65, 0]}>
            <coneGeometry args={[0.055, 0.18, 12]} />
            <primitive object={materials.goldBrass} attach="material" />
          </mesh>
          {/* Static Curved Fabric Mesh */}
          <StaticCurvedFlag
            position={[0.54, 2.7, 0]}
            width={1.08}
            height={0.72}
            texture={undipFlagTexture}
          />
        </group>
      </group>
    </group>
  )
}
