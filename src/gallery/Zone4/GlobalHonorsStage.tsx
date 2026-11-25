import { useRef } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEntityVisibility } from '../../perf/core/EntityCulling'
import { STAGE_POS } from './layout'
import zone4Data from './data/zone4.json'
import type { Zone4Exhibit } from './types'

interface GlobalHonorsStageProps {
  onSelect: (exhibit: Zone4Exhibit) => void
  onHover: (id: string | null) => void
  selectedId: string | null
}

/**
 * Panggung Utama: Prestasi Internasional & Pengakuan Global
 * Berdiri megah di sumbu tengah belakang aula galeri (Z = -26.0):
 * - Panggung marmer bertingkat emas (Tiered Podium of Honors)
 * - Hero "Globe of Recognition": Bola dunia berputar pelan dengan busur kemitraan emas
 * - Podium of Champions 1-2-3 & piala kejuaraan melayang di pedestal kaca
 * - Dinding medali kehormatan & pilar tiang pemeringkatan internasional QS / GreenMetric
 */
export function GlobalHonorsStage({
  onSelect,
  onHover,
  selectedId: _selectedId,
}: GlobalHonorsStageProps) {
  const globeRef = useRef<THREE.Group>(null)
  const trophiesRef = useRef<THREE.Group>(null)

  const isVisible = useEntityVisibility()

  useFrame((state) => {
    if (!isVisible) return
    const time = state.clock.elapsedTime
    if (globeRef.current) {
      globeRef.current.rotation.y = time * 0.2
    }
    if (trophiesRef.current) {
      trophiesRef.current.rotation.y = time * 0.4
    }
  })

  return (
    <group position={STAGE_POS}>
      {/* ==============================================================
          1. PANGGUNG MARMER BERTINGKAT ELEVASI +0.7 METER
          ============================================================== */}
      {/* Tingkat 1 Panggung */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[12.0, 0.5, 8.0]} />
        <meshStandardMaterial color="#0B1F3A" roughness={0.35} metalness={0.4} />
      </mesh>
      {/* Lis Emas Panggung */}
      <mesh position={[0, 0.51, 0]}>
        <boxGeometry args={[12.08, 0.02, 8.08]} />
        <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Tingkat 2 Marmer Ivory */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[10.8, 0.28, 6.8]} />
        <meshStandardMaterial color="#f4efe4" roughness={0.25} metalness={0.1} />
      </mesh>

      {/* ==============================================================
          2. HERO: GLOBE OF RECOGNITION (Ø 3.2 METER)
          ============================================================== */}
      <group
        position={[0, 2.8, -1.2]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect({
            id: 'globe-recognition',
            title: 'Globe of Recognition — Jejaring Prestasi Global',
            category: 'achievement',
            subtitle: 'Kemitraan Pendidikan & Riset dengan Universitas Terkemuka Dunia',
            description:
              'Visualisasi hubungan kolaborasi akademik dan pengakuan internasional Universitas Diponegoro. Membentang dari kampus utama di Semarang hingga universitas top di Jepang, Belanda, Australia, Singapura, Jerman, dan Amerika Serikat dalam bentuk student exchange, joint research, dan dual degree program.',
            highlights: [
              'Kerja sama riset aktif dengan Kyoto University & Leiden University',
              'Program Pertukaran Mahasiswa IISMA & International Exposure',
              'Akreditasi Internasional ABEST21, ASIIN, IABEE, & FIBAA',
            ],
          })
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover('globe-recognition')
        }}
        onPointerOut={() => onHover(null)}
      >
        <group ref={globeRef}>
          {/* Bola Bumi Biru Tua */}
          <mesh castShadow>
            <sphereGeometry args={[1.6, 32, 24]} />
            <meshStandardMaterial color="#0f2b48" roughness={0.3} metalness={0.5} />
          </mesh>

          {/* Garis Lintang & Bujur Emas */}
          <mesh>
            <sphereGeometry args={[1.61, 16, 12]} />
            <meshBasicMaterial color="#c9a24b" wireframe transparent opacity={0.35} />
          </mesh>

          {/* Cincin Khatulistiwa Emas */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.75, 1.85, 32]} />
            <meshBasicMaterial color="#ffd700" side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Spotlight Emas Terpusat ke Globe */}
        <pointLight position={[0, 2.5, 1.2]} color="#fff3db" intensity={35} distance={8} />

        <Text position={[0, -2.0, 1.8]} fontSize={0.18} color="#ffd700" anchorX="center">
          ✦ GLOBE OF GLOBAL RECOGNITION ✦
        </Text>
      </group>

      {/* ==============================================================
          3. PODIUM OF CHAMPIONS 1-2-3 & TROFI EMAS MELAYANG
          ============================================================== */}
      <group position={[0, 0.79, 2.2]}>
        {/* Juara 1 (Tengah, Tinggi 0.85m) */}
        <mesh position={[0, 0.425, 0]} castShadow>
          <boxGeometry args={[1.5, 0.85, 1.2]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.85} roughness={0.2} />
        </mesh>
        <Text position={[0, 0.45, 0.62]} fontSize={0.4} color="#0B1F3A" anchorX="center">
          1
        </Text>

        {/* Juara 2 (Kiri, Tinggi 0.6m) */}
        <mesh position={[-1.6, 0.3, 0]} castShadow>
          <boxGeometry args={[1.4, 0.6, 1.2]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
        <Text position={[-1.6, 0.3, 0.62]} fontSize={0.32} color="#0B1F3A" anchorX="center">
          2
        </Text>

        {/* Juara 3 (Kanan, Tinggi 0.42m) */}
        <mesh position={[1.6, 0.21, 0]} castShadow>
          <boxGeometry args={[1.4, 0.42, 1.2]} />
          <meshStandardMaterial color="#b45309" metalness={0.6} />
        </mesh>
        <Text position={[1.6, 0.21, 0.62]} fontSize={0.32} color="#0B1F3A" anchorX="center">
          3
        </Text>

        {/* Trofi Emas Juara 1 */}
        <group position={[0, 1.1, 0]}>
          <mesh castShadow>
            <coneGeometry args={[0.22, 0.45, 16]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ==============================================================
          4. PILAR PEMERINGKATAN INTERNASIONAL (QS & GREENMETRIC)
          ============================================================== */}
      {[-4.2, 4.2].map((px, pi) => {
        const rnk = zone4Data.achievements.rankings[pi]
        return (
          <group
            key={`pillar-rank-${pi}`}
            position={[px, 0.79, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({
                id: rnk.id,
                title: rnk.institution,
                category: 'achievement',
                subtitle: rnk.year,
                rank: rnk.rank,
                description: rnk.desc,
                highlights: [
                  'Metodologi Penilaian Standar Lembaga Pemeringkat Dunia',
                  'Peningkatan Signifikan Indikator Reputasi Alumni & Sitasi Riset',
                  'Komitmen Berkelanjutan Menuju Top World Class University',
                ],
              })
            }}
          >
            {/* Pilar Marmer Vertikal */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <boxGeometry args={[1.2, 2.4, 1.2]} />
              <meshStandardMaterial color="#0B1F3A" roughness={0.3} />
            </mesh>
            <mesh position={[0, 2.42, 0]}>
              <boxGeometry args={[1.24, 0.04, 1.24]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.9} />
            </mesh>

            {/* Plakat Kuningan Informasi Peringkat */}
            <Text position={[0, 1.8, 0.62]} fontSize={0.18} color="#ffd700" anchorX="center">
              {rnk.rank.split(' ')[0]} {rnk.rank.split(' ')[1]}
            </Text>
            <Text position={[0, 1.4, 0.62]} fontSize={0.11} color="#f5efe0" anchorX="center">
              {rnk.institution.slice(0, 22)}
            </Text>
            <Text position={[0, 1.0, 0.62]} fontSize={0.09} color="#7fd1e8" anchorX="center">
              {rnk.year}
            </Text>
          </group>
        )
      })}

      {/* ==============================================================
          5. MEDAL WALL: BARISAN MEDALI EMAS KEJUARAAN MAHASISWA
          ============================================================== */}
      <group position={[0, 0.79, -3.2]}>
        {zone4Data.achievements.medals.slice(0, 4).map((med, mi) => {
          const mx = -3.6 + mi * 2.4
          return (
            <group
              key={med.id}
              position={[mx, 1.2, 0]}
              onClick={(e) => {
                e.stopPropagation()
                onSelect({
                  id: med.id,
                  title: med.competition,
                  category: 'achievement',
                  subtitle: `${med.rank} (${med.year})`,
                  description: `Prestasi membanggakan delegasi mahasiswa Undip pada kompetisi ${med.competition} kategori ${med.category}. Membuktikan daya saing inovasi generasi muda Undip di tingkat nasional dan internasional.`,
                  highlights: [
                    `Kategori Lomba: ${med.category}`,
                    `Pencapaian: ${med.rank}`,
                    `Tahun: ${med.year}`,
                  ],
                })
              }}
            >
              {/* Medali Emas Bundar */}
              <mesh castShadow>
                <cylinderGeometry args={[0.32, 0.32, 0.06, 24]} />
                <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.15} />
              </mesh>
              <Text position={[0, -0.45, 0.04]} fontSize={0.09} color="#ffd700" anchorX="center">
                {med.competition.slice(0, 18)}
              </Text>
              <Text position={[0, -0.6, 0.04]} fontSize={0.075} color="#e2e8f0" anchorX="center">
                {med.rank}
              </Text>
            </group>
          )
        })}
      </group>
    </group>
  )
}
