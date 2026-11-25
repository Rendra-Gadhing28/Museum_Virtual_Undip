import { useRef } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { LIBRARY_WALL_X } from './layout'
import zone4Data from './data/zone4.json'
import type { Zone4Exhibit } from './types'

interface LibraryKnowledgeWingProps {
  onSelect: (exhibit: Zone4Exhibit) => void
  onHover: (id: string | null) => void
  selectedId: string | null
}

/**
 * Sayap Kanan: Perpustakaan & Pusat Pengetahuan Digital
 * Menghadirkan atmosfer perpustakaan akademik bertaraf dunia:
 * - Jajaran rak buku kayu jati klasik berbingkai emas di dinding timur
 * - Meja baca panjang dengan banker's lamp hijau emerald
 * - Display Repositori Institusi Undip, E-Books, & Naskah Kuno Digital
 * - Panel bintang sitasi dan statistik publikasi Scopus Q1
 */
export function LibraryKnowledgeWing({
  onSelect,
  onHover,
  selectedId,
}: LibraryKnowledgeWingProps) {
  const miniHelixRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (miniHelixRef.current) {
      miniHelixRef.current.rotation.y = state.clock.elapsedTime * 0.25
    }
  })

  return (
    <group position={[LIBRARY_WALL_X, 0, 0]}>
      {/* ==============================================================
          1. HEADER SAYAP PERPUSTAKAAN DI DINDING TIMUR
          ============================================================== */}
      <group position={[-0.35, 6.2, -10.0]} rotation={[0, -Math.PI / 2, 0]}>
        <Text fontSize={0.34} color="#ffd700" anchorX="center">
          SAYAP PERPUSTAKAAN DIGITAL & PUSAT SUMBER PENGETAHUAN
        </Text>
        <Text position={[0, -0.4, 0]} fontSize={0.18} color="#e2e8f0" anchorX="center">
          210.000+ Dokumen Repositori Digital, E-Prints, & Layanan Jurnal Global
        </Text>
      </group>

      {/* ==============================================================
          2. RAK BUKU KAYU JATI & DISPLAY REPOSITORI DIGITAL (4 SECTION)
          ============================================================== */}
      {zone4Data.library.collections.map((col, ci) => {
        const cz = 4.0 - ci * 7.5
        const isSelected = selectedId === col.id

        return (
          <group
            key={col.id}
            position={[-1.6, 0, cz]}
            rotation={[0, -Math.PI / 2, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({
                id: col.id,
                title: col.title,
                category: 'library',
                subtitle: col.items,
                description: col.desc,
                highlights: [
                  'Akses Digital Terbuka untuk Publik dan Sivitas Akademika',
                  'Terintegrasi dengan Jaringan Perpustakaan Nasional & Dunia',
                  'Preservasi Arsip Akademik & Karya Ilmiah Sejak 1957',
                ],
              })
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHover(col.id)
            }}
            onPointerOut={() => onHover(null)}
          >
            {/* a) Rak Buku Jati Solid */}
            <mesh position={[0, 1.8, -0.4]} castShadow receiveShadow>
              <boxGeometry args={[4.2, 3.6, 0.8]} />
              <meshStandardMaterial
                color={isSelected ? '#2e1c12' : '#3E2A1E'}
                roughness={0.5}
              />
            </mesh>
            <mesh position={[0, 3.61, -0.4]}>
              <boxGeometry args={[4.26, 0.04, 0.84]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.85} />
            </mesh>

            {/* Barisan Buku di Rak (Instanced Box Geometry) */}
            {[0.8, 1.6, 2.4, 3.0].map((shelfY, si) => (
              <mesh key={`shelf-books-${si}`} position={[0, shelfY, -0.05]}>
                <boxGeometry args={[3.8, 0.42, 0.35]} />
                <meshStandardMaterial color={['#0B1F3A', '#c9a24b', '#f5efe0', '#4a3020'][si % 4]} />
              </mesh>
            ))}

            {/* b) Meja Display Konsol di Depan Rak */}
            <mesh position={[0, 0.5, 0.5]} castShadow receiveShadow>
              <boxGeometry args={[3.6, 1.0, 0.9]} />
              <meshStandardMaterial color="#0B1F3A" roughness={0.4} metalness={0.2} />
            </mesh>
            <mesh position={[0, 1.02, 0.5]}>
              <boxGeometry args={[3.64, 0.02, 0.94]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.9} />
            </mesh>

            {/* c) Label & Layar Tablet Digital Catalog */}
            <mesh position={[0, 1.15, 0.5]} rotation={[-0.4, 0, 0]}>
              <boxGeometry args={[1.2, 0.7, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0, 1.16, 0.51]} rotation={[-0.4, 0, 0]}>
              <planeGeometry args={[1.1, 0.6]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>

            {/* d) Label Kuningan di Depan Meja */}
            <group position={[0, 0.6, 0.96]}>
              <mesh>
                <boxGeometry args={[2.8, 0.22, 0.02]} />
                <meshStandardMaterial color="#c9a24b" metalness={0.9} />
              </mesh>
              <Text position={[0, 0.02, 0.015]} fontSize={0.095} color="#0B1F3A" anchorX="center">
                📖 {col.title.slice(0, 32)}
              </Text>
              <Text position={[0, -0.06, 0.015]} fontSize={0.07} color="#3E2A1E" anchorX="center">
                {col.items}
              </Text>
            </group>

            {/* Lampu Downlight Galeri Hangat */}
            <pointLight position={[0, 4.0, 0.5]} color="#fff3db" intensity={18} distance={5} />
          </group>
        )
      })}

      {/* ==============================================================
          3. MEJA BACA PANJANG BANKER'S LAMP DI DEKAT KORIDOR
          ============================================================== */}
      <group position={[-2.4, 0, -10.0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.2, 0.9, 1.6]} />
          <meshStandardMaterial color="#3E2A1E" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.91, 0]}>
          <boxGeometry args={[7.25, 0.02, 1.65]} />
          <meshStandardMaterial color="#f5efe0" roughness={0.3} />
        </mesh>
        {/* Lampu Baca Banker's Lamp Hijau */}
        {[-2.4, 0, 2.4].map((bx, bi) => (
          <group key={`banker-${bi}`} position={[bx, 0.92, 0]}>
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.22, 12]} />
              <meshStandardMaterial color="#047857" roughness={0.2} />
            </mesh>
            <pointLight position={[0, 0.3, 0]} color="#fff8dc" intensity={8} distance={2.5} />
          </group>
        ))}
      </group>

      {/* ==============================================================
          4. HERO MINI: BOOK HELIX SPIRAL BUKU LITERASI MELAYANG
          ============================================================== */}
      <group ref={miniHelixRef} position={[-2.4, 1.4, -20.0]}>
        {Array.from({ length: 24 }).map((_, bi) => {
          const ang = (bi / 24) * Math.PI * 4
          const y = (bi / 24) * 2.8
          const r = 0.9
          return (
            <mesh key={`mini-book-${bi}`} position={[Math.sin(ang) * r, y, Math.cos(ang) * r]} rotation={[0.2, ang, 0]}>
              <boxGeometry args={[0.32, 0.06, 0.44]} />
              <meshStandardMaterial color={['#0B1F3A', '#c9a24b', '#f5efe0', '#3E2A1E'][bi % 4]} />
            </mesh>
          )
        })}
        <pointLight position={[0, 3.2, 0]} color="#ffd700" intensity={15} distance={4} />
      </group>
    </group>
  )
}
