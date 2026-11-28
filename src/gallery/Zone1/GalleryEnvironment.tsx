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
import { Bookshelf } from './MuseumFurniture'
import { DirectoryBoard } from './DirectoryBoard'
import { PortalDoor } from './PortalDoor'
import type { Zone1PortalDoor, Zone1RoomId } from './subRooms'

interface GalleryEnvironmentProps {
  isNearDirectory?: boolean
  hoveredId?: string | null
  isMobile?: boolean
  portals?: Zone1PortalDoor[]
  onSelectPortal?: (roomId: Zone1RoomId) => void
  onHover?: (id: string | null) => void
}

/**
 * Museum Virtual Undip - Master Architectural Environment
 * Clean minimalist architectural space dividing left and right sides into sections:
 * - Left Side: Founders Wing (5 Main Founders & 13 Leadership)
 * - Right Side: History & Archives Wing (Dense Masonry Gallery)
 * - Center: Red Carpet, Miniature Map, and Ceremonial Podium
 * - Back Wall: Royal Navy Blue Wall with high contrast
 */
export function GalleryEnvironment({
  isNearDirectory = false,
  hoveredId = null,
  isMobile = false,
  portals = [],
  onSelectPortal,
  onHover,
}: GalleryEnvironmentProps) {
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
      {/* 1. Matte Limestone Floor (#CFC4B2 base, #D8CEBF tile var, #B8AA96 grout) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, centerZ]}
        receiveShadow
      >
        <planeGeometry args={[halfW * 2, length]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#ffffff"
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* 2. Left Wall (Heritage Taupe #655447 Bawah & Warm Ivory #E9E1D3 Atas) */}
      <group>
        <mesh
          position={[-halfW, 2.12, centerZ]}
          rotation={[0, Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[length, 4.24]} />
          <meshStandardMaterial color="#655447" roughness={0.96} metalness={0} />
        </mesh>
        <mesh
          position={[-halfW, 4.24 + (height - 4.24) / 2, centerZ]}
          rotation={[0, Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[length, height - 4.24]} />
          <meshStandardMaterial color="#E9E1D3" roughness={0.95} metalness={0} />
        </mesh>
      </group>

      {/* 3. Right Wall (Heritage Taupe #655447 Bawah & Warm Ivory #E9E1D3 Atas) */}
      <group>
        <mesh
          position={[halfW, 2.12, centerZ]}
          rotation={[0, -Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[length, 4.24]} />
          <meshStandardMaterial color="#655447" roughness={0.96} metalness={0} />
        </mesh>
        <mesh
          position={[halfW, 4.24 + (height - 4.24) / 2, centerZ]}
          rotation={[0, -Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[length, height - 4.24]} />
          <meshStandardMaterial color="#E9E1D3" roughness={0.95} metalness={0} />
        </mesh>
      </group>

      {/* 4. Front Entrance Wall (Behind Visitor - Heritage Taupe Bawah & Warm Ivory Atas) */}
      <group>
        <mesh
          position={[0, 2.12, HALL.zFront]}
          rotation={[0, Math.PI, 0]}
          receiveShadow
        >
          <planeGeometry args={[halfW * 2, 4.24]} />
          <meshStandardMaterial color="#655447" roughness={0.96} metalness={0} />
        </mesh>
        <mesh
          position={[0, 4.24 + (height - 4.24) / 2, HALL.zFront]}
          rotation={[0, Math.PI, 0]}
          receiveShadow
        >
          <planeGeometry args={[halfW * 2, height - 4.24]} />
          <meshStandardMaterial color="#E9E1D3" roughness={0.95} metalness={0} />
        </mesh>
      </group>

      {/* 5. Back Focal Wall (Heritage Taupe Bawah & Warm Ivory Atas + Panel Aksen Muted Navy #23364F) */}
      <group>
        <mesh
          position={[0, 2.12, HALL.zBack]}
          receiveShadow
        >
          <planeGeometry args={[halfW * 2, 4.24]} />
          <meshStandardMaterial color="#655447" roughness={0.96} metalness={0} />
        </mesh>
        <mesh
          position={[0, 4.24 + (height - 4.24) / 2, HALL.zBack]}
          receiveShadow
        >
          <planeGeometry args={[halfW * 2, height - 4.24]} />
          <meshStandardMaterial color="#E9E1D3" roughness={0.95} metalness={0} />
        </mesh>

        {/* Framed Muted Navy Focal Panel (#23364F) with Antique Gold Border (#B2935D) */}
        <mesh position={[0, 3.85, HALL.zBack + 0.03]} receiveShadow>
          <boxGeometry args={[6.4, 6.9, 0.04]} />
          <meshStandardMaterial color="#23364F" roughness={0.9} metalness={0.05} />
        </mesh>
        <mesh position={[0, 3.85, HALL.zBack + 0.015]}>
          <boxGeometry args={[6.58, 7.08, 0.02]} />
          <meshStandardMaterial color="#B2935D" roughness={0.36} metalness={0.78} />
        </mesh>
      </group>

      {/* 6. Architectural Wainscoting, Baseboards & Neoclassical Pilasters (Image 6 Concept) */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Baseboard (Dark Walnut #392D25) */}
          <mesh position={[side * (halfW - 0.05), 0.1, centerZ]}>
            <boxGeometry args={[0.1, 0.2, length]} />
            <meshStandardMaterial color="#392D25" roughness={0.52} />
          </mesh>
          {/* Antique Gold Inlay line on baseboard */}
          <mesh position={[side * (halfW - 0.09), 0.2, centerZ]}>
            <boxGeometry args={[0.02, 0.03, length]} />
            <meshStandardMaterial color="#B2935D" roughness={0.36} metalness={0.78} />
          </mesh>

          {/* Dark Walnut Wainscot Trim */}
          <mesh position={[side * (halfW - 0.04), 0.55, centerZ]} receiveShadow>
            <boxGeometry args={[0.08, 0.7, length]} />
            <meshStandardMaterial color="#392D25" roughness={0.54} metalness={0.1} />
          </mesh>

          {/* Antique Gold Chair Rail Molding */}
          <mesh position={[side * (halfW - 0.06), 0.92, centerZ]}>
            <boxGeometry args={[0.12, 0.06, length]} />
            <meshStandardMaterial color="#B2935D" roughness={0.36} metalness={0.78} />
          </mesh>

          {/* Greige / Ivory Divider Molding at 4.24m (separating Taupe lower & Ivory upper) */}
          <mesh position={[side * (halfW - 0.05), 4.24, centerZ]}>
            <boxGeometry args={[0.1, 0.12, length]} />
            <meshStandardMaterial color="#B8AA96" roughness={0.7} metalness={0.05} />
          </mesh>

          {/* Neoclassical Wall Pilasters (Image 6 rhythmic bays) */}
          {[7.0, -2.0, -11.0, -20.0].map((pz, pi) => (
            <mesh key={`pilaster-${side}-${pi}`} position={[side * (halfW - 0.06), height / 2, pz]} receiveShadow>
              <boxGeometry args={[0.14, height - 0.4, 0.48]} />
              <meshStandardMaterial color="#E9E1D3" roughness={0.85} metalness={0.02} />
            </mesh>
          ))}

          {/* Upper Cove Emissive Strip (3200K Warm White) */}
          <mesh position={[side * (halfW - 0.04), height - 0.6, centerZ]}>
            <boxGeometry args={[0.04, 0.04, length * 0.9]} />
            <meshStandardMaterial
              color="#fffaf2"
              emissive="#fff6e8"
              emissiveIntensity={0.65}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* 7. Grand Classical Entrance Double Doors & Archway (Dark Walnut #392D25, Muted Navy #23364F, Antique Gold #B2935D) */}
      <group position={[0, 0, HALL.zFront - 0.05]} rotation={[0, Math.PI, 0]}>
        {/* Outer Fluted Door Casing (Dark Walnut #392D25) */}
        <mesh position={[0, 2.2, 0.04]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 4.4, 0.14]} />
          <meshStandardMaterial color="#392D25" roughness={0.48} metalness={0.12} />
        </mesh>

        {/* Gilded Architrave / Pediment Header */}
        <mesh position={[0, 4.45, 0.08]} castShadow>
          <boxGeometry args={[4.1, 0.35, 0.18]} />
          <meshStandardMaterial color="#23364F" roughness={0.42} metalness={0.18} />
        </mesh>
        <mesh position={[0, 4.65, 0.1]}>
          <boxGeometry args={[4.2, 0.06, 0.22]} />
          <meshStandardMaterial color="#B2935D" roughness={0.36} metalness={0.78} />
        </mesh>
        <mesh position={[0, 4.25, 0.08]}>
          <boxGeometry args={[3.9, 0.04, 0.16]} />
          <meshStandardMaterial color="#B2935D" roughness={0.36} metalness={0.78} />
        </mesh>

        {/* Symmetrical Left & Right Door Leaves (Dark Walnut with Muted Navy & Antique Gold Insets) */}
        {[-0.9, 0.9].map((dx, di) => (
          <group key={di} position={[dx, 2.1, 0.08]}>
            {/* Door Leaf Body (Dark Walnut #392D25) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.7, 4.0, 0.08]} />
              <meshStandardMaterial color="#392D25" roughness={0.5} metalness={0.1} />
            </mesh>

            {/* Perimeter Antique Gold Molding on Door Leaf */}
            <mesh position={[0, 0, 0.042]}>
              <boxGeometry args={[1.5, 3.8, 0.01]} />
              <meshStandardMaterial color="#B2935D" roughness={0.36} metalness={0.78} />
            </mesh>

            {/* Upper Muted Navy Inset Panel (#23364F) */}
            <mesh position={[0, 0.7, 0.048]}>
              <boxGeometry args={[1.34, 2.0, 0.015]} />
              <meshStandardMaterial color="#23364F" roughness={0.44} metalness={0.16} />
            </mesh>

            {/* Lower Muted Navy Inset Panel (#23364F) */}
            <mesh position={[0, -0.9, 0.048]}>
              <boxGeometry args={[1.34, 1.4, 0.015]} />
              <meshStandardMaterial color="#23364F" roughness={0.44} metalness={0.16} />
            </mesh>

            {/* Antique Gold Vertical Bar Pull Handle */}
            <group position={[di === 0 ? 0.68 : -0.68, 0, 0.08]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.65, 16]} />
                <meshStandardMaterial color="#B2935D" roughness={0.32} metalness={0.82} />
              </mesh>
              {[-0.26, 0.26].map((hy, hi) => (
                <mesh key={hi} position={[0, hy, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.06, 12]} />
                  <meshStandardMaterial color="#B2935D" roughness={0.36} metalness={0.78} />
                </mesh>
              ))}
            </group>
          </group>
        ))}
      </group>

      {/* 8. Alternating Rectangular Gap Roof */}
      <CeilingRoof isMobile={isMobile} />

      {/* 10. Central Red Carpet */}
      <RedCarpet />

      {/* 11. EXTRA ASSETS: 3D Archival Bookshelves */}
      <Bookshelf position={[halfW - 0.35, 0, 10.6]} rotationY={-Math.PI / 2} />
      <Bookshelf position={[-halfW + 0.35, 0, 10.6]} rotationY={Math.PI / 2} />

      {/* 12. EXTRA ASSET: Standing Wayfinding Directory Board */}
      <DirectoryBoard
        position={DIRECTORY_BOARD_POS}
        rotationY={-Math.PI / 4}
        isNear={isNearDirectory}
      />

      {/* 13. 5 Pintu Portal Sub-Ruangan Zona 1 (Penataan | 3   2 |) */}
      {portals.map((portal) => (
        <PortalDoor
          key={portal.id}
          id={`portal-${portal.id}`}
          doorNumber={portal.doorNumber}
          title={portal.title}
          subtitle={portal.subtitle}
          position={portal.position}
          rotationY={portal.rotationY}
          isHovered={hoveredId === `portal-${portal.id}`}
          onSelect={() => onSelectPortal?.(portal.id)}
          onHover={(id) => onHover?.(id)}
        />
      ))}
    </group>
  )
}
