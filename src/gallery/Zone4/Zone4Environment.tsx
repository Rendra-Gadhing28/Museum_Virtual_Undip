import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { createFloorTexture } from '../Zone1/textures'
import { VisitorLounge } from '../Zone1/MuseumFurniture'
import { CeilingRoof } from '../Zone1/CeilingRoof'
import {
  ZONE4_HALL,
  ZONE4_HALL_CENTER_Z,
  ZONE4_HALL_LENGTH,
  ZONE4_DIRECTORY_POS,
  ZONE4_DIRECTORY_PROXIMITY_RADIUS,
} from './layout'
import type { Zone4Exhibit } from './types'

interface Zone4EnvironmentProps {
  onSelectMonument?: (exhibit: Zone4Exhibit) => void
  onHover?: (id: string | null) => void
  isNearDirectory?: boolean
  isMobile?: boolean
}

/**
 * Ruangan Galeri Arsitektural Zona 4 — Undip Today
 * Menjaga DNA monumental ruangan museum galeri seperti Zona 1 & 2:
 * - Lantai marmer Crema Marfil dengan pantulan halus & lis emas
 * - Karpet runner navy mewah berpinggir emas di sepanjang lorong tengah
 * - Dinding panel kayu jati gelap & wainscoting navy berlis kuningan emas
 * - Plafon megah berundak (coffered ceiling) 99% mirip Zona 1
 * - Dinding Belakang: Monumen Kehormatan Prestasi Dunia Universitas Diponegoro
 * - Papan Direktori Navigasi "Mau Menuju ke Mana?"
 */
export function Zone4Environment({
  onSelectMonument,
  onHover,
  isNearDirectory,
  isMobile = false,
}: Zone4EnvironmentProps) {
  const floorTexture = useMemo(() => {
    const tex = createFloorTexture()
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(8, 20)
    return tex
  }, [])

  const halfW = ZONE4_HALL.halfWidth
  const height = ZONE4_HALL.height
  const length = ZONE4_HALL_LENGTH
  const centerZ = ZONE4_HALL_CENTER_Z

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
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Grid Inlay Garis Emas di Lantai Galeri */}
      {[-halfW + 1.2, -3.2, 3.2, halfW - 1.2].map((gx, gi) => (
        <mesh key={`floor-gold-x-${gi}`} position={[gx, 0.002, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, length]} />
          <meshBasicMaterial color="#c9a24b" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* ==============================================================
          2. KARPET RUNNER NAVY MEWAH BERPINGGIR EMAS DI LORONG TENGAH
          ============================================================== */}
      <group position={[0, 0.006, centerZ]}>
        {/* Karpet Beludru Royal Navy */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.8, length - 2.0]} />
          <meshStandardMaterial color="#112d56" roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
        {/* Border Emas Kiri & Kanan Karpet */}
        {[-1.9, 1.9].map((bx, bi) => (
          <mesh key={`runner-border-${bi}`} position={[bx, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, length - 2.0]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ==============================================================
          3. DINDING RUANGAN GALERI (Kiri, Kanan, Depan, & Belakang)
          Mengadopsi DNA Ruangan Galeri Museum Hangat Megah (Zona 1 & 2)
          ============================================================== */}
      {/* Dinding Kiri (Sayap Laboratorium & Riset) */}
      <mesh
        position={[-halfW, height / 2, centerZ]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
      </mesh>

      {/* Dinding Kanan (Sayap Perpustakaan & Pengetahuan) */}
      <mesh
        position={[halfW, height / 2, centerZ]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
      </mesh>

      {/* Dinding Depan (Gerbang Masuk dari Zona Sebelumnya) */}
      <mesh
        position={[0, height / 2, ZONE4_HALL.zFront]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <planeGeometry args={[halfW * 2, height]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.92} />
      </mesh>

      {/* Dinding Belakang (Dinding Monumental Prestasi Dunia - Royal Navy Blue) */}
      <mesh
        position={[0, height / 2, ZONE4_HALL.zBack]}
        receiveShadow
      >
        <planeGeometry args={[halfW * 2, height]} />
        <meshStandardMaterial color="#142e56" roughness={0.7} />
      </mesh>

      {/* Wainscoting Kayu Dark Brown & Lis Kuningan di Sepanjang Dasar Dinding */}
      {[-halfW + 0.15, halfW - 0.15].map((wx, wi) => (
        <group key={`wainscot-${wi}`} position={[wx, 0.7, centerZ]}>
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

      {/* Pilar-Pilar Arsitektural Galeri Klasik-Modern */}
      {[-28, -20, -12, -4, 4, 12].map((pz, pi) => (
        <group key={`arch-pillar-${pi}`}>
          {/* Pilar Sisi Kiri */}
          <mesh position={[-halfW + 0.35, height / 2, pz]} castShadow receiveShadow>
            <boxGeometry args={[0.7, height, 0.7]} />
            <meshStandardMaterial color="#0B1F3A" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Pilar Sisi Kanan */}
          <mesh position={[halfW - 0.35, height / 2, pz]} castShadow receiveShadow>
            <boxGeometry args={[0.7, height, 0.7]} />
            <meshStandardMaterial color="#0B1F3A" roughness={0.4} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ==============================================================
          4. MONUMEN KEHORMATAN PRESTASI DI DINDING BELAKANG
          ============================================================== */}
      <group
        position={[0, 4.2, ZONE4_HALL.zBack + 0.4]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectMonument?.({
            id: 'zone4-monument',
            title: 'Monumen Kehormatan Undip Today — Global Excellence',
            category: 'monument',
            subtitle: 'Integrasi Riset Unggul, Kampus Modern, & Reputasi Internasional',
            description: 'Monumen pengakuan atas dedikasi dan lonjakan prestasi Universitas Diponegoro di kancah nasional dan global. Mencerminkan kampus modern yang bergerak dinamis, menghasilkan inovasi terapan, dan mencetak lulusan berdaya saing global tertinggi di Indonesia.',
            highlights: [
              'Peringkat 1 Nasional Kecepatan Lulusan Bekerja (QS Graduate Employability)',
              'Peringkat 2 Nasional & 25 Dunia Kampus Berkelanjutan (UI GreenMetric)',
              '1.340+ Paten HKI & 4.120+ Publikasi Terindeks Scopus Tahunan',
              'Jejaring Kemitraan Strategis dengan Universitas Terbaik di 45 Negara',
            ],
          })
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover?.('zone4-monument')
        }}
        onPointerOut={() => onHover?.(null)}
      >
        {/* Panel Plat Emas Monumen */}
        <mesh castShadow>
          <boxGeometry args={[11.5, 5.2, 0.16]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.88} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[11.1, 4.8, 0.02]} />
          <meshStandardMaterial color="#0B1F3A" roughness={0.4} />
        </mesh>

        {/* Teks Monumen Emas */}
        <Text position={[0, 1.8, 0.12]} fontSize={0.36} color="#ffd700" anchorX="center">
          UNIVERSITAS DIPONEGORO
        </Text>
        <Text position={[0, 1.3, 0.12]} fontSize={0.24} color="#f5efe0" anchorX="center">
          ZONA 4: UNDIP TODAY — KAMPUS MODERN & SMART INNOVATION
        </Text>
        <Text position={[0, 0.6, 0.12]} fontSize={0.16} color="#e2e8f0" anchorX="center" maxWidth={9.5} textAlign="center">
          "Menghubungkan warisan kejuangan masa lalu dengan inovasi terdepan masa kini. Bergerak maju membina riset unggul pesisir dan laut tropis, kecerdasan buatan, teknologi energi baru terbarukan, dan integritas lulusan bagi kemajuan martabat bangsa."
        </Text>
        <Text position={[0, -0.6, 0.12]} fontSize={0.18} color="#c9a24b" anchorX="center">
          ✦ WORLD CLASS UNIVERSITY & SUSTAINABLE CAMPUS ✦
        </Text>
        <Text position={[0, -1.6, 0.12]} fontSize={0.14} color="#7fd1e8" anchorX="center">
          (Klik monumen untuk membaca naskah kuratorial lengkap)
        </Text>
      </group>

      {/* ==============================================================
          5. PLAFON BERUNDAK MEGAH (COFFERED CEILING) IDENTIK 99% ZONA 1
          ============================================================== */}
      <CeilingRoof
        halfWidth={halfW}
        height={height}
        length={length}
        centerZ={centerZ}
        zFront={ZONE4_HALL.zFront}
        zBack={ZONE4_HALL.zBack}
        isMobile={isMobile}
      />

      {/* ==============================================================
          6. KURSI LOUNGE PENGUNJUNG DI SUDUT GALERI
          ============================================================== */}
      <VisitorLounge position={[-halfW + 2.4, 0, centerZ + 12]} />
      <VisitorLounge position={[halfW - 2.4, 0, centerZ + 12]} rotationY={Math.PI} />

      {/* ==============================================================
          7. PAPAN DIREKTORI "MAU KE MANA??" DENGAN WAYFINDING PROMPT
          ============================================================== */}
      <group position={ZONE4_DIRECTORY_POS}>
        {/* Tiang Papan Direktori Marmer-Emas */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.4, 2.2, 0.14]} />
          <meshStandardMaterial color="#0B1F3A" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.1, 0.08]}>
          <boxGeometry args={[1.32, 2.1, 0.02]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.9} />
        </mesh>

        <Text position={[0, 1.85, 0.1]} fontSize={0.11} color="#0b1f3a" anchorX="center">
          DIREKTORI ZONA 4
        </Text>
        <Text position={[0, 1.55, 0.1]} fontSize={0.08} color="#0b1f3a" anchorX="center">
          UNDIP TODAY
        </Text>
        <Text position={[0, 1.25, 0.1]} fontSize={0.065} color="#0b1f3a" anchorX="center">
          ● Maket Kampus Modern
        </Text>
        <Text position={[0, 1.05, 0.1]} fontSize={0.065} color="#0b1f3a" anchorX="center">
          ◄ Sayap Lab & Riset
        </Text>
        <Text position={[0, 0.85, 0.1]} fontSize={0.065} color="#0b1f3a" anchorX="center">
          ► Sayap Perpustakaan
        </Text>
        <Text position={[0, 0.65, 0.1]} fontSize={0.065} color="#0b1f3a" anchorX="center">
          ▲ Prestasi Internasional
        </Text>

        {/* Proximity Ring: Muncul saat dekat direktori */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ZONE4_DIRECTORY_PROXIMITY_RADIUS - 0.05, ZONE4_DIRECTORY_PROXIMITY_RADIUS, 32]} />
          <meshBasicMaterial color="#c9a24b" transparent opacity={isNearDirectory ? 0.7 : 0.2} />
        </mesh>
      </group>
    </group>
  )
}
