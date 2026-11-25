import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { createFloorTexture } from '../Zone1/textures'
import { VisitorLounge } from '../Zone1/MuseumFurniture'
import { CeilingRoof } from '../Zone1/CeilingRoof'
import {
  ZONE3_HALL,
  ZONE3_HALL_CENTER_Z,
  ZONE3_HALL_LENGTH,
  ZONE3_DIRECTORY_POS,
  ZONE3_DIRECTORY_PROXIMITY_RADIUS,
} from './layout'

interface Zone3EnvironmentProps {
  isNearDirectory?: boolean
  isMobile?: boolean
}

/**
 * Lingkungan Galeri Arsitektural Megah Zona 3 — The Heritage of Undip
 * Mengadopsi standar visual ruangan galeri museum Zone 1 & 2:
 * - Lantai Marmer Crema Marfil dengan inlay emas
 * - Karpet runner navy mewah berpinggir emas di lorong tengah
 * - Dinding panel kayu jati gelap & wainscoting navy berlis kuningan emas
 * - Plafon megah berundak dengan pencahayaan chandelier kristal hangat
 * - Papan direktori wayfinding interaktif
 */
export function Zone3Environment({
  isNearDirectory = false,
  isMobile = false,
}: Zone3EnvironmentProps) {
  const floorTexture = useMemo(() => {
    const tex = createFloorTexture()
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(6, 16)
    return tex
  }, [])

  const halfW = ZONE3_HALL.halfWidth
  const height = ZONE3_HALL.height
  const length = ZONE3_HALL_LENGTH
  const centerZ = ZONE3_HALL_CENTER_Z

  return (
    <group>
      {/* ==============================================================
          1. LANTAI MARMER CREMA MARFIL UTAMA
          ============================================================== */}
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

      {/* Grid Inlay Garis Emas di Lantai Galeri */}
      {[-halfW + 1.2, -3.2, 3.2, halfW - 1.2].map((gx, gi) => (
        <mesh key={`z3-gold-x-${gi}`} position={[gx, 0.002, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, length]} />
          <meshBasicMaterial color="#c9a24b" />
        </mesh>
      ))}

      {/* ==============================================================
          2. KARPET RUNNER NAVY MEWAH BERPINGGIR EMAS DI LORONG TENGAH
          ============================================================== */}
      <group position={[0, 0.006, centerZ]}>
        {/* Karpet Beludru Royal Navy */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.8, length - 2.0]} />
          <meshStandardMaterial color="#112d56" roughness={0.8} />
        </mesh>
        {/* Border Emas Kiri & Kanan Karpet */}
        {[-1.9, 1.9].map((bx, bi) => (
          <mesh key={`z3-runner-border-${bi}`} position={[bx, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, length - 2.0]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ==============================================================
          3. DINDING RUANGAN GALERI (Kiri, Kanan, Depan, & Belakang)
          ============================================================== */}
      {/* Dinding Kiri (Sayap Artefak & Tokoh) */}
      <mesh
        position={[-halfW, height / 2, centerZ]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
      </mesh>

      {/* Dinding Kanan (Sayap Dokumen & Audiovisual) */}
      <mesh
        position={[halfW, height / 2, centerZ]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
      </mesh>

      {/* Dinding Depan (Gerbang Masuk dari Foyer / Zona 2) */}
      <mesh
        position={[0, height / 2, ZONE3_HALL.zFront]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <planeGeometry args={[halfW * 2, height]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
      </mesh>

      {/* Dinding Belakang (Monumental Royal Navy Blue untuk Latar Prasasti & Foto) */}
      <mesh
        position={[0, height / 2, ZONE3_HALL.zBack]}
        receiveShadow
      >
        <planeGeometry args={[halfW * 2, height]} />
        <meshStandardMaterial color="#142e56" roughness={0.7} />
      </mesh>

      {/* Wainscoting Kayu Jati Gelap & Lis Kuningan di Sepanjang Dasar Dinding */}
      {[-halfW + 0.15, halfW - 0.15].map((wx, wi) => (
        <group key={`z3-wainscot-${wi}`} position={[wx, 0.7, centerZ]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.3, 1.4, length]} />
            <meshStandardMaterial color="#3E2A1E" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.71, 0]}>
            <boxGeometry args={[0.32, 0.04, length]} />
            <meshStandardMaterial color="#c9a24b" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Pilar-Pilar Arsitektural Galeri Klasik Berwibawa */}
      {[-24, -14, -4, 6].map((pz, pi) => (
        <group key={`z3-arch-pillar-${pi}`}>
          {/* Pilar Kiri */}
          <mesh position={[-halfW + 0.35, height / 2, pz]} castShadow receiveShadow>
            <boxGeometry args={[0.7, height, 0.7]} />
            <meshStandardMaterial color="#0B1F3A" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Pilar Kanan */}
          <mesh position={[halfW - 0.35, height / 2, pz]} castShadow receiveShadow>
            <boxGeometry args={[0.7, height, 0.7]} />
            <meshStandardMaterial color="#0B1F3A" roughness={0.4} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ==============================================================
          4. PLAFON BERUNDAK MEGAH (COFFERED CEILING) IDENTIK 99% ZONA 1
          ============================================================== */}
      <CeilingRoof
        halfWidth={halfW}
        height={height}
        length={length}
        centerZ={centerZ}
        zFront={ZONE3_HALL.zFront}
        zBack={ZONE3_HALL.zBack}
        isMobile={isMobile}
      />

      {/* ==============================================================
          5. AREA DUDUK LOUNGE PENGUNJUNG
          ============================================================== */}
      <VisitorLounge position={[-halfW + 2.2, 0, centerZ + 12]} />
      <VisitorLounge position={[halfW - 2.2, 0, centerZ + 12]} rotationY={Math.PI} />

      {/* ==============================================================
          6. PAPAN DIREKTORI "MAU KE MANA?" WAYFINDING
          ============================================================== */}
      <group position={ZONE3_DIRECTORY_POS}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.4, 2.2, 0.14]} />
          <meshStandardMaterial color="#0B1F3A" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.1, 0.08]}>
          <boxGeometry args={[1.32, 2.1, 0.02]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.9} />
        </mesh>

        <Text position={[0, 1.85, 0.1]} fontSize={0.11} color="#0b1f3a" anchorX="center">
          DIREKTORI ZONA 3
        </Text>
        <Text position={[0, 1.55, 0.1]} fontSize={0.08} color="#0b1f3a" anchorX="center">
          THE HERITAGE OF UNDIP
        </Text>
        <Text position={[0, 1.25, 0.1]} fontSize={0.065} color="#0b1f3a" anchorX="center">
          ▲ Plaza Prasasti Monumental
        </Text>
        <Text position={[0, 1.05, 0.1]} fontSize={0.065} color="#0b1f3a" anchorX="center">
          ◄ Sayap Artefak & Tokoh
        </Text>
        <Text position={[0, 0.85, 0.1]} fontSize={0.065} color="#0b1f3a" anchorX="center">
          ► Sayap Dokumen & Cinema
        </Text>
        <Text position={[0, 0.65, 0.1]} fontSize={0.065} color="#0b1f3a" anchorX="center">
          ● Galeri Foto Sejarah
        </Text>

        {/* Proximity Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ZONE3_DIRECTORY_PROXIMITY_RADIUS - 0.05, ZONE3_DIRECTORY_PROXIMITY_RADIUS, 32]} />
          <meshBasicMaterial color="#c9a24b" transparent opacity={isNearDirectory ? 0.7 : 0.2} />
        </mesh>
      </group>
    </group>
  )
}
