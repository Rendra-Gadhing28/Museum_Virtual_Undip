import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { createFloorTexture } from '../Zone1/textures'
import { CeilingRoof } from '../Zone1/CeilingRoof'
import { RedCarpet } from '../Zone1/RedCarpet'
import { Bookshelf, VisitorLounge } from '../Zone1/MuseumFurniture'
import {
  ZONE2_HALL,
  ZONE2_HALL_CENTER_Z,
  ZONE2_HALL_LENGTH,
} from './layout'
import { createZone2MonumentTexture } from './textures'
import { ZONE2_MONUMENT } from './data/zone2Exhibits'
import type { Zone2Exhibit } from './types'

interface Zone2EnvironmentProps {
  onSelectMonument?: (exhibit: Zone2Exhibit) => void
  onHover?: (id: string | null) => void
  isMobile?: boolean
}

/**
 * Zone 2 Architectural Environment — The Growth of Knowledge
 * Retains the monumental architectural DNA of Zone 1:
 * - Italian Crema Marfil marble floor (cached)
 * - Deep navy wainscoting with gold trim
 * - Heavy partition walls framing Zone 2 (strict render boundary isolation)
 * - Back Wall: Grand "The Growth of Knowledge" Bronze-Gold Monument
 * - Coffered ceiling with warm cove illumination
 */
export function Zone2Environment({
  onSelectMonument,
  onHover,
  isMobile = false,
}: Zone2EnvironmentProps) {
  const floorTexture = useMemo(() => {
    const tex = createFloorTexture()
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(6, 16)
    return tex
  }, [])

  const monumentTexture = useMemo(() => createZone2MonumentTexture(), [])

  const halfW = ZONE2_HALL.halfWidth
  const height = ZONE2_HALL.height
  const length = ZONE2_HALL_LENGTH
  const centerZ = ZONE2_HALL_CENTER_Z

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

      {/* 2. Left Wall (Faculty Wing Side) */}
      <mesh
        position={[-halfW, height / 2, centerZ]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
      </mesh>

      {/* 3. Right Wall (Research & Community Wing Side) */}
      <mesh
        position={[halfW, height / 2, centerZ]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
      </mesh>

      {/* 4. Front Partition Wall (Dividing Zone 2 from Adjacent Zones) */}
      <group position={[0, height / 2, ZONE2_HALL.zFront]}>
        <mesh rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[halfW * 2, height]} />
          <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
        </mesh>

        {/* Grand Partition Archway Frame */}
        <group position={[0, -1.2, -0.05]} rotation={[0, Math.PI, 0]}>
          <mesh>
            <boxGeometry args={[4.4, 5.8, 0.16]} />
            <meshStandardMaterial color="#0b1d3a" metalness={0.3} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.09]}>
            <boxGeometry args={[4.2, 5.6, 0.02]} />
            <meshStandardMaterial color="#142e56" />
          </mesh>
          <Text
            position={[0, 2.4, 0.12]}
            fontSize={0.24}
            color="#ffd700"
            anchorX="center"
            anchorY="middle"
          >
            SELAMAT DATANG DI ZONA 2
          </Text>
          <Text
            position={[0, 2.05, 0.12]}
            fontSize={0.16}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            THE GROWTH OF KNOWLEDGE
          </Text>
        </group>
      </group>

      {/* 5. Back Focal Wall — Royal Navy Blue with Monument */}
      <mesh position={[0, height / 2, ZONE2_HALL.zBack]} receiveShadow>
        <planeGeometry args={[halfW * 2, height]} />
        <meshStandardMaterial color="#142e56" roughness={0.7} />
      </mesh>

      {/* 6. Back Wall: Grand "The Growth of Knowledge" Monument Plaque */}
      <group
        position={[0, 4.2, ZONE2_HALL.zBack + 0.18]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectMonument?.(ZONE2_MONUMENT)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover?.('zone2-monument')
        }}
        onPointerOut={() => onHover?.(null)}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[11.8, 5.8, 0.16]} />
          <meshStandardMaterial color="#101a2b" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[11.9, 5.9, 0.04]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <planeGeometry args={[11.6, 5.6]} />
          <meshStandardMaterial map={monumentTexture} roughness={0.3} metalness={0.2} />
        </mesh>
      </group>

      {/* 7. Wainscoting along Left & Right Walls */}
      <mesh
        position={[-halfW + 0.08, 0.65, centerZ]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[length, 1.3, 0.15]} />
        <meshStandardMaterial color="#0b1d3a" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh
        position={[halfW - 0.08, 0.65, centerZ]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[length, 1.3, 0.15]} />
        <meshStandardMaterial color="#0b1d3a" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* 8. Gold Crown Molding along the Walls */}
      <mesh
        position={[-halfW + 0.08, 1.32, centerZ]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <boxGeometry args={[length, 0.05, 0.18]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh
        position={[halfW - 0.08, 1.32, centerZ]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <boxGeometry args={[length, 0.05, 0.18]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 9. Master Central Red Carpet Runner */}
      <RedCarpet />

      {/* 10. Monumental Coffered Ceiling Roof with Alternating Rectangular Gaps */}
      <CeilingRoof
        halfWidth={halfW}
        height={height}
        length={length}
        centerZ={centerZ}
        zFront={ZONE2_HALL.zFront}
        zBack={ZONE2_HALL.zBack}
        isMobile={isMobile}
      />

      {/* 11. Museum Furniture: Visitor Lounges & Archival Bookshelves */}
      <VisitorLounge position={[-3.8, 0, 4.0]} rotationY={Math.PI / 2} />
      <VisitorLounge position={[3.8, 0, 4.0]} rotationY={-Math.PI / 2} />
      <VisitorLounge position={[-3.8, 0, -13.0]} rotationY={Math.PI / 2} />
      <VisitorLounge position={[3.8, 0, -13.0]} rotationY={-Math.PI / 2} />

      {/* Left-wall bookshelves moved to the front/back corners so the
          11 faculty panels can span the full left wall of Zone 2 */}
      <Bookshelf position={[-6.4, 0, 11.4]} rotationY={Math.PI} />
      <Bookshelf position={[halfW - 0.5, 0, 9.8]} rotationY={-Math.PI / 2} />
      <Bookshelf position={[-6.4, 0, -25.3]} rotationY={0} />
      <Bookshelf position={[halfW - 0.5, 0, -19.5]} rotationY={-Math.PI / 2} />
    </group>
  )
}
