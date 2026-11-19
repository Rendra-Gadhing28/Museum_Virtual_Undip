import { useMemo } from 'react'
import * as THREE from 'three'
import {
  DIRECTORY_BOARD_POS,
  HALL,
  HALL_CENTER_Z,
  HALL_LENGTH,
} from './layout'
import { createFloorTexture } from './textures'
import { CeilingRoof } from './CeilingRoof'
import { RedCarpet } from './RedCarpet'
import { Bookshelf, VisitorLounge } from './MuseumFurniture'
import { DirectoryBoard } from './DirectoryBoard'
import { DiponegoroStatue } from './DiponegoroStatue'

interface GalleryEnvironmentProps {
  isNearDirectory?: boolean
}

/**
 * Museum Virtual Undip - Master Architectural Environment
 * Clean minimalist architectural space dividing left and right sides into sections:
 * - Left Side: Founders Wing
 * - Right Side: History & Archives Wing
 * - Center: Red Carpet, Miniature Map, and Ceremonial Podium
 * - Roof: Rectangular coffer with alternating large & small rectangular gaps
 * - Extra Assets: Archival bookshelves, glass tables, visitor armchairs, directory board
 * Palette: Navy Blue (#0B1D3A), Gold (#D4AF37), Ivory (#F7F4EB), Heritage Brown (#3D2516)
 */
export function GalleryEnvironment({ isNearDirectory = false }: GalleryEnvironmentProps) {
  const floorTexture = useMemo(() => {
    const tex = createFloorTexture()
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(6, 16)
    return tex
  }, [])

  const halfW = HALL.halfWidth
  const height = HALL.height
  const length = HALL_LENGTH
  const centerZ = HALL_CENTER_Z

  return (
    <group>
      {/* 1. Master Marble Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, centerZ]}
        receiveShadow
      >
        <planeGeometry args={[halfW * 2, length]} />
        <meshStandardMaterial
          map={floorTexture}
          roughness={0.28}
          metalness={0.12}
        />
      </mesh>

      {/* 2. Left Wall (Founders Side) */}
      <mesh
        position={[-halfW, height / 2, centerZ]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
      </mesh>

      {/* 3. Right Wall (History & Archives Side) */}
      <mesh
        position={[halfW, height / 2, centerZ]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
      </mesh>

      {/* 4. Front Entrance Wall (Behind Visitor) */}
      <mesh
        position={[0, height / 2, HALL.zFront]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <planeGeometry args={[halfW * 2, height]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
      </mesh>

      {/* 5. Back Focal Wall (Behind the Ceremonial Dais) */}
      <mesh
        position={[0, height / 2, HALL.zBack]}
        receiveShadow
      >
        <planeGeometry args={[halfW * 2, height]} />
        <meshStandardMaterial color="#0b1d3a" roughness={0.85} />
      </mesh>

      {/* 6. Grand Architectural Wainscoting & Baseboards along Left & Right Walls */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Baseboard (Dark Walnut Teak) */}
          <mesh position={[side * (halfW - 0.05), 0.1, centerZ]}>
            <boxGeometry args={[0.1, 0.2, length]} />
            <meshStandardMaterial color="#2c1a0e" roughness={0.5} />
          </mesh>
          {/* Gold Inlay line on baseboard */}
          <mesh position={[side * (halfW - 0.09), 0.2, centerZ]}>
            <boxGeometry args={[0.02, 0.03, length]} />
            <meshStandardMaterial color="#d4af37" roughness={0.28} metalness={0.85} />
          </mesh>

          {/* Heritage Brown Wainscot Panel */}
          <mesh position={[side * (halfW - 0.04), 0.55, centerZ]} receiveShadow>
            <boxGeometry args={[0.08, 0.7, length]} />
            <meshStandardMaterial color="#3d2516" roughness={0.52} metalness={0.12} />
          </mesh>

          {/* Gold Chair Rail Molding */}
          <mesh position={[side * (halfW - 0.06), 0.92, centerZ]}>
            <boxGeometry args={[0.12, 0.06, length]} />
            <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.85} />
          </mesh>

          {/* Cinematic Low-Light Emissive Accent Strip at upper wall (subtle cove glow) */}
          <mesh position={[side * (halfW - 0.04), height - 0.6, centerZ]}>
            <boxGeometry args={[0.04, 0.04, length * 0.9]} />
            <meshStandardMaterial
              color="#fff3db"
              emissive="#ffd999"
              emissiveIntensity={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* 7. Entrance Grand Double Doors & Archway */}
      <group position={[0, 0, HALL.zFront - 0.08]}>
        <mesh position={[0, 2.1, 0]}>
          <boxGeometry args={[3.6, 4.2, 0.16]} />
          <meshStandardMaterial color="#3d2516" roughness={0.5} metalness={0.15} />
        </mesh>
        <mesh position={[0, 4.25, 0]}>
          <boxGeometry args={[4.0, 0.35, 0.2]} />
          <meshStandardMaterial color="#0b1d3a" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 4.45, 0]}>
          <boxGeometry args={[4.2, 0.06, 0.24]} />
          <meshStandardMaterial color="#d4af37" roughness={0.25} metalness={0.88} />
        </mesh>

        {/* Double Doors */}
        {[-0.85, 0.85].map((dx, di) => (
          <group key={di} position={[dx, 1.9, 0.04]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.6, 3.7, 0.08]} />
              <meshStandardMaterial color="#2d190d" roughness={0.45} metalness={0.1} />
            </mesh>
            <mesh position={[di === 0 ? 0.65 : -0.65, 0, 0.06]}>
              <cylinderGeometry args={[0.02, 0.02, 0.45, 12]} />
              <meshStandardMaterial color="#d4af37" roughness={0.25} metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.5, 0.045]}>
              <boxGeometry args={[1.2, 1.3, 0.02]} />
              <meshStandardMaterial color="#0b1d3a" roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.9, 0.045]}>
              <boxGeometry args={[1.2, 1.1, 0.02]} />
              <meshStandardMaterial color="#0b1d3a" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 8. Alternating Rectangular Gap Roof */}
      <CeilingRoof />

      {/* 10. Central Red Carpet */}
      <RedCarpet />

      {/* 11. EXTRA ASSETS: 3D Archival Bookshelves (Placed in dedicated clear zones without frame collision) */}
      {/* Right Wall Bookshelves (Clear of all history exhibits) */}
      <Bookshelf position={[halfW - 0.35, 0, 10.6]} rotationY={-Math.PI / 2} />
      <Bookshelf position={[halfW - 0.35, 0, -23.2]} rotationY={-Math.PI / 2} />

      {/* Left Wall Bookshelves (Clear of all founder portraits) */}
      <Bookshelf position={[-halfW + 0.35, 0, 10.6]} rotationY={Math.PI / 2} />
      <Bookshelf position={[-halfW + 0.35, 0, -23.2]} rotationY={Math.PI / 2} />

      {/* 12. EXTRA ASSETS: Visitor Lounge (Glass Table & Two Armchairs) */}
      {/* Right Side Study & Reading Lounge */}
      <VisitorLounge position={[4.8, 0, 3.8]} rotationY={-Math.PI / 6} />

      {/* Left Side Study & Reading Lounge */}
      <VisitorLounge position={[-4.8, 0, 3.8]} rotationY={Math.PI / 6} />

      {/* 13. EXTRA ASSET: Standing Wayfinding Directory Board */}
      <DirectoryBoard
        position={DIRECTORY_BOARD_POS}
        rotationY={-Math.PI / 4}
        isNear={isNearDirectory}
      />

      {/* 14. MONUMENTAL 3D STATUE: PANGERAN DIPONEGORO ON HORSEBACK
          (Placed at the back, beside the ceremonial podium as requested) */}
      <DiponegoroStatue
        position={[3.8, 0, -18.2]}
        rotationY={-Math.PI / 4}
      />
    </group>
  )
}
