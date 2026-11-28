import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import type { Founder, HistoryExhibit } from './data/exhibits'
import { FounderCard } from './FoundersWing'
import { SalonItem } from './HistoryArchivesWing'
import { PortalDoor } from './PortalDoor'
import { assetCache } from './cache'

interface GalleryRoom01Props {
  founders: Founder[]
  histories: HistoryExhibit[]
  selectedFounderId: string | null
  selectedHistoryId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelectFounder: (founder: Founder) => void
  onSelectHistory: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
  onExitRoom: () => void
}

const C = {
  navy: '#23364F',
  ivory: '#E9E1D3',
  taupe: '#655447',
  gold: '#B2935D',
  stone: '#D8CDBB',
  floor: '#CFC4B2',
  walnut: '#392D25',
  darkWalnutFloor: '#302219',
  glass: '#d6edf0',
  warmLight: '#fff5e0',
}


/**
 * Historical Archive Glass Vitrine Table (Meja Etalase Kaca Miring / Datar Arsip)
 * Terinspirasi langsung dari referensi foto museum arsip:
 * - Dudukan kabinet kayu walnut & ivory wainscoting
 * - Tudung kaca museum (glass vitrine cover)
 * - Naskah manuskrip / akta kuno terbuka di atas dudukan miring
 */
function ArchivalVitrine({
  position,
  rotationY = 0,
  title,
  subtitle,
  isSelected = false,
  isHovered = false,
  onClick,
  onHover,
}: {
  position: [number, number, number]
  rotationY?: number
  title: string
  subtitle: string
  isSelected?: boolean
  isHovered?: boolean
  onClick?: () => void
  onHover?: (id: string | null) => void
}) {
  const materials = useMemo(() => {
    return {
      walnut: assetCache.getMaterial('vit-walnut', () => new THREE.MeshStandardMaterial({ color: C.walnut, roughness: 0.72 })),
      ivoryPedestal: assetCache.getMaterial('vit-ivory', () => new THREE.MeshStandardMaterial({ color: '#f5efe4', roughness: 0.85 })),
      goldTrim: assetCache.getMaterial('vit-gold', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.35, metalness: 0.8 })),
      glass: assetCache.getMaterial('vit-glass', () => new THREE.MeshStandardMaterial({ color: C.glass, transparent: true, opacity: 0.28, roughness: 0.08, metalness: 0.1 })),
      parchment: assetCache.getMaterial('vit-parchment', () => new THREE.MeshStandardMaterial({ color: '#f7f1de', roughness: 0.9 })),
      spotGlow: assetCache.getMaterial('vit-spot-glow', () => new THREE.MeshStandardMaterial({ color: '#fffdf5', emissive: '#ffecbe', emissiveIntensity: 2.2 })),
    }
  }, [])

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover?.(title)
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {/* 1. Base Plinth Walnut */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow material={materials.walnut}>
        <boxGeometry args={[2.5, 0.16, 1.4]} />
      </mesh>

      {/* 2. Badan Kabinet Putih Gading (Ivory Plinth) */}
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow material={materials.ivoryPedestal}>
        <boxGeometry args={[2.36, 0.72, 1.26]} />
      </mesh>

      {/* 3. Trim Emas Pemisah Kaca */}
      <mesh position={[0, 0.89, 0]} material={materials.goldTrim}>
        <boxGeometry args={[2.42, 0.02, 1.32]} />
      </mesh>

      {/* 4. Tudung Kaca Bening (Glass Vitrine Case) */}
      <mesh position={[0, 1.18, 0]} material={materials.glass}>
        <boxGeometry args={[2.36, 0.56, 1.26]} />
      </mesh>

      {/* 5. Dudukan Miring Naskah Kuno di Dalam Vitrine */}
      {[-0.55, 0.55].map((dx, di) => (
        <group key={di} position={[dx, 0.92, 0]}>
          {/* Dudukan V-wedge akrilik/kayu */}
          <mesh position={[0, 0.08, 0]} rotation={[0.2, 0, 0]} material={materials.walnut}>
            <boxGeometry args={[0.82, 0.05, 0.65]} />
          </mesh>
          {/* Lembaran Manuskrip / Naskah Akta Notaris Terbuka */}
          <mesh position={[0, 0.12, 0]} rotation={[0.2, 0, 0]} material={materials.parchment}>
            <boxGeometry args={[0.76, 0.02, 0.58]} />
          </mesh>
          {/* Teks Mini Dokumen */}
          <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2 + 0.2, 0, 0]}>
            <planeGeometry args={[0.7, 0.5]} />
            <meshBasicMaterial color="#3d2c1d" wireframe transparent opacity={0.35} />
          </mesh>
        </group>
      ))}

      {/* 6. Plakat Informasi Kuningan di Bagian Depan Kabinet */}
      <group position={[0, 0.58, 0.64]}>
        <mesh material={materials.goldTrim}>
          <boxGeometry args={[1.2, 0.24, 0.02]} />
        </mesh>
        <Text position={[0, 0.04, 0.015]} fontSize={0.065} color="#23364F" anchorX="center" anchorY="middle">
          {title.toUpperCase()}
        </Text>
        <Text position={[0, -0.05, 0.015]} fontSize={0.045} color="#655447" anchorX="center" anchorY="middle">
          {subtitle}
        </Text>
      </group>

      {/* 7. Sorotan Lembut Pencahayaan Vitrine (Internal Soft Lighting) */}
      <pointLight position={[0, 1.4, 0]} color="#fff3db" intensity={2.2} distance={4} decay={2} />

      {/* Indikator Hover / Seleksi */}
      {(isHovered || isSelected) && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.62, 32]} />
          <meshBasicMaterial color={C.gold} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  )
}

/**
 * Historical Timeline Panel di Dinding Kiri (Left Wall)
 * Menampilkan linimasa otentik pendirian Yayasan Universitas Semarang (1956) hingga perkuliahan 1957.
 */
function HistoricalTimelineWall({
  length,
  halfWidth,
  histories,
  selectedHistoryId,
  hoveredId,
  isMobile,
  onSelectHistory,
  onHover,
}: {
  length: number
  halfWidth: number
  histories: HistoryExhibit[]
  selectedHistoryId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelectHistory: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
}) {
  const wallX = -halfWidth + 0.12

  return (
    <group>
      {/* Header Linimasa */}
      <group position={[wallX, 4.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[length - 3, 0.6, 0.06]} />
          <meshStandardMaterial color={C.navy} />
        </mesh>
        <Text position={[0, 0, 0.04]} fontSize={0.28} color={C.gold} anchorX="center" anchorY="middle">
          LINIMASA SEJARAH PENDIRIAN YAYASAN UNIVERSITAS SEMARANG (1956–1957)
        </Text>
      </group>

      {/* Bingkai-bingkai Arsip Terkurasi Berjejer dengan Rapi */}
      {histories.map((item, idx) => {
        const itemZ = -length / 2 + 3.2 + idx * 3.8
        return (
          <group key={item.id}>
            {/* Lampu Sorot Aksen di Atas Bingkai */}
            <group position={[wallX + 0.2, 3.8, itemZ]} rotation={[0, Math.PI / 2, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.5, 0.04, 0.12]} />
                <meshStandardMaterial color={C.gold} metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0, -0.03, 0]}>
                <planeGeometry args={[0.42, 0.08]} />
                <meshStandardMaterial color="#fffbe8" emissive="#ffdd8f" emissiveIntensity={4} />
              </mesh>
              {!isMobile && (
                <pointLight
                  position={[0, -0.2, 0.2]}
                  color="#ffe9be"
                  intensity={2.6}
                  distance={3.8}
                  decay={1.8}
                />
              )}
            </group>

            <SalonItem
              config={{
                exhibitId: item.id,
                z: itemZ,
                y: 2.5,
                width: 1.8,
                height: 1.5,
                frameColor: C.gold,
              }}
              exhibit={item}
              position={[wallX + 0.04, 2.5, itemZ]}
              rotationY={Math.PI / 2}
              isSelected={selectedHistoryId === item.id}
              isHovered={hoveredId === item.id}
              isMobile={isMobile}
              onSelect={onSelectHistory}
              onHover={onHover}
            />
          </group>
        )
      })}
    </group>
  )
}

/**
 * Founders Wall di Dinding Kanan (Right Wall)
 * Menampilkan dokumentasi dan potret Pancamitra Pendiri Utama Undip 1956.
 */
function FoundersGalleryWall({
  length,
  halfWidth,
  founders,
  selectedFounderId,
  hoveredId,
  isMobile,
  onSelectFounder,
  onHover,
}: {
  length: number
  halfWidth: number
  founders: Founder[]
  selectedFounderId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelectFounder: (founder: Founder) => void
  onHover: (id: string | null) => void
}) {
  const wallX = halfWidth - 0.12

  return (
    <group>
      {/* Header Sayap Pendiri */}
      <group position={[wallX, 4.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[length - 3, 0.6, 0.06]} />
          <meshStandardMaterial color={C.navy} />
        </mesh>
        <Text position={[0, 0, 0.04]} fontSize={0.28} color={C.gold} anchorX="center" anchorY="middle">
          PANCAMITRA PERINTIS &amp; TOKOH PENDIRI UTAMA UNDIP (1956)
        </Text>
      </group>

      {/* Potret Tokoh Pendiri Berbingkai Kayu Walnut & Emas */}
      {founders.slice(0, 5).map((founder, idx) => {
        const itemZ = -length / 2 + 2.8 + idx * 3.4
        return (
          <group key={founder.id}>
            <FounderCard
              founder={founder}
              index={idx}
              position={[wallX - 0.04, 2.5, itemZ]}
              rotationY={-Math.PI / 2}
              isMainFounder={true}
              isSelected={selectedFounderId === founder.id}
              isHovered={hoveredId === founder.id}
              isMobile={isMobile}
              onSelect={onSelectFounder}
              onHover={onHover}
            />
          </group>
        )
      })}
    </group>
  )
}

/**
 * GalleryRoom01: Transformasi Lengkap Ruang 01 menjadi
 * "Historical Archive Gallery (Arsip Pendiri & Yayasan)"
 * Berdasarkan referensi foto pameran arsip museum & Master Project Directive:
 * - Dimensi: 14m (lebar) x 18m (panjang) x 5.4m (tinggi)
 * - Komposisi dinding 3 lapis (Ivory, Wainscot Walnut, Lis Emas)
 * - Lantai Travertine / Dark Walnut Parket halus
 * - Sumbu tengah: Barisan Meja Vitrine Kaca (Archival Vitrines) untuk Akta Notaris & Statuta
 * - Dinding Kiri: Linimasa Bersejarah (Timeline & Dokumen)
 * - Dinding Kanan: Potret Pancamitra Pendiri
 * - Dinding Belakang: Mural Monumental & Panel Introduksi Sejarah Pendirian
 */
export function GalleryRoom01({
  founders,
  histories,
  selectedFounderId,
  selectedHistoryId,
  hoveredId,
  isMobile = false,
  onSelectFounder,
  onSelectHistory,
  onHover,
  onExitRoom,
}: GalleryRoom01Props) {
  // Dimensi terkalibrasi proporsional (14m x 18m x 5.4m)
  const roomW = 14.0
  const roomL = 18.0
  const roomH = 5.4
  const halfW = roomW / 2
  const zFront = roomL / 2
  const zBack = -roomL / 2

  const mats = useMemo(() => {
    return {
      wallIvory: assetCache.getMaterial('r1-ivory', () => new THREE.MeshStandardMaterial({ color: C.ivory, roughness: 0.92 })),
      wainscotWalnut: assetCache.getMaterial('r1-wainscot', () => new THREE.MeshStandardMaterial({ color: C.walnut, roughness: 0.75 })),
      goldTrim: assetCache.getMaterial('r1-gold', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.35, metalness: 0.8 })),
      floorTravertine: assetCache.getMaterial('r1-floor', () => new THREE.MeshStandardMaterial({ color: C.floor, roughness: 0.78, metalness: 0.04 })),
      woodParquet: assetCache.getMaterial('r1-parquet', () => new THREE.MeshStandardMaterial({ color: C.darkWalnutFloor, roughness: 0.65 })),
      ceilingBeams: assetCache.getMaterial('r1-beams', () => new THREE.MeshStandardMaterial({ color: '#f0ece1', roughness: 0.9 })),
      downlightBulb: assetCache.getMaterial('r1-bulb', () => new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff6e4', emissiveIntensity: 2.8 })),
      benchGrey: assetCache.getMaterial('r1-bench', () => new THREE.MeshStandardMaterial({ color: '#736d67', roughness: 0.95 })),
    }
  }, [])

  return (
    <group>
      {/* 1. Lantai: Travertine Perimeter dengan Tengah Parket Kayu Walnut Mewah (Foto 4 & Foto Upload) */}
      {/* Lapisan Luar Travertine */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow material={mats.floorTravertine}>
        <planeGeometry args={[roomW, roomL]} />
      </mesh>
      {/* Lapisan Tengah Kayu Parket Arsip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow material={mats.woodParquet}>
        <planeGeometry args={[roomW - 2.8, roomL - 2.8]} />
      </mesh>
      {/* Border Kuningan Membatasi Parket */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[roomW - 2.76, 0.015, roomL - 2.76]} />
        <meshBasicMaterial color={C.gold} wireframe />
      </mesh>

      {/* 2. Dinding Komposisi Tiga Lapis (Lower Wainscot Walnut 1.1m + Upper Warm Ivory) */}
      {/* Dinding Kiri */}
      <group position={[-halfW, 0, 0]}>
        <mesh position={[0, 0.55, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={mats.wainscotWalnut}>
          <planeGeometry args={[roomL, 1.1]} />
        </mesh>
        <mesh position={[0, 1.12, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.goldTrim}>
          <boxGeometry args={[roomL, 0.04, 0.05]} />
        </mesh>
        <mesh position={[0, 1.1 + (roomH - 1.1) / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={mats.wallIvory}>
          <planeGeometry args={[roomL, roomH - 1.1]} />
        </mesh>
      </group>

      {/* Dinding Kanan */}
      <group position={[halfW, 0, 0]}>
        <mesh position={[0, 0.55, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow material={mats.wainscotWalnut}>
          <planeGeometry args={[roomL, 1.1]} />
        </mesh>
        <mesh position={[0, 1.12, 0]} rotation={[0, -Math.PI / 2, 0]} material={mats.goldTrim}>
          <boxGeometry args={[roomL, 0.04, 0.05]} />
        </mesh>
        <mesh position={[0, 1.1 + (roomH - 1.1) / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow material={mats.wallIvory}>
          <planeGeometry args={[roomL, roomH - 1.1]} />
        </mesh>
      </group>

      {/* Dinding Depan Entrance */}
      <group position={[0, 0, zFront]}>
        <mesh position={[0, 0.55, 0]} rotation={[0, Math.PI, 0]} receiveShadow material={mats.wainscotWalnut}>
          <planeGeometry args={[roomW, 1.1]} />
        </mesh>
        <mesh position={[0, 1.12, 0]} rotation={[0, Math.PI, 0]} material={mats.goldTrim}>
          <boxGeometry args={[roomW, 0.04, 0.05]} />
        </mesh>
        <mesh position={[0, 1.1 + (roomH - 1.1) / 2, 0]} rotation={[0, Math.PI, 0]} receiveShadow material={mats.wallIvory}>
          <planeGeometry args={[roomW, roomH - 1.1]} />
        </mesh>
      </group>

      {/* Dinding Belakang (Rear Feature Wall) */}
      <group position={[0, 0, zBack]}>
        <mesh position={[0, 0.55, 0]} receiveShadow material={mats.wainscotWalnut}>
          <planeGeometry args={[roomW, 1.1]} />
        </mesh>
        <mesh position={[0, 1.12, 0]} material={mats.goldTrim}>
          <boxGeometry args={[roomW, 0.04, 0.05]} />
        </mesh>
        <mesh position={[0, 1.1 + (roomH - 1.1) / 2, 0]} receiveShadow material={mats.wallIvory}>
          <planeGeometry args={[roomW, roomH - 1.1]} />
        </mesh>

        {/* Monumental Mural & Akta Introduction Panel */}
        <group position={[0, 3.1, 0.08]}>
          <mesh material={mats.goldTrim}>
            <boxGeometry args={[8.4, 2.6, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[8.2, 2.4, 0.05]} />
            <meshStandardMaterial color="#213248" roughness={0.7} />
          </mesh>
          <Text position={[0, 0.72, 0.06]} fontSize={0.24} color={C.gold} anchorX="center">
            PANCAMITRA &amp; AKTA PENDIRIAN YAYASAN UNIVERSITAS SEMARANG
          </Text>
          <Text position={[0, 0.32, 0.06]} fontSize={0.16} color="#ffffff" anchorX="center">
            21 DESEMBER 1956 • NOTARIS R.M. SOEPRAPTO NOMOR 59
          </Text>
          <Text position={[0, -0.22, 0.06]} fontSize={0.11} maxWidth={7.4} color="#e5ded0" textAlign="center" anchorX="center">
            "Berdirinya Yayasan Universitas Semarang menjadi tonggak pertama pendidikan tinggi berdaulat di Jawa Tengah, digerakkan oleh para praktisi hukum dan cendekiawan pejuang untuk mencerdaskan kehidupan bangsa."
          </Text>
        </group>
      </group>

      {/* 3. Plafon Coffered Restrained dengan Recessed Downlights (Sesuai Spesifikasi) */}
      <group position={[0, roomH, 0]}>
        {/* Panel Plafon Atas */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[roomW, 0.2, roomL]} />
          <meshStandardMaterial color="#f7f3eb" roughness={0.9} />
        </mesh>
        {/* Balok Grid Coffered Sederhana */}
        {[-3.5, 0, 3.5].map((bx, bi) => (
          <mesh key={`grid-x-${bi}`} position={[bx, -0.1, 0]} material={mats.ceilingBeams}>
            <boxGeometry args={[0.3, 0.22, roomL]} />
          </mesh>
        ))}
        {[-6, -2, 2, 6].map((bz, bzi) => (
          <mesh key={`grid-z-${bzi}`} position={[0, -0.1, bz]} material={mats.ceilingBeams}>
            <boxGeometry args={[roomW, 0.22, 0.3]} />
          </mesh>
        ))}

        {/* Titik Lampu Recessed LED Downlights (Soft Warm Museum Lighting) */}
        {[-3.5, 3.5].flatMap((lx) =>
          [-5, -1, 3].map((lz, li) => (
            <mesh key={`down-${lx}-${li}`} position={[lx, -0.02, lz]} material={mats.downlightBulb}>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
            </mesh>
          )),
        )}
      </group>

      {/* 4. Sumbu Tengah (Center Axis): Tiga Meja Vitrine Kaca Otentik (Foto Upload) */}
      {/* Vitrine 1: Akta Notaris Pendirian 1956 */}
      <ArchivalVitrine
        position={[0, 0, -3.2]}
        title="Akta Notaris No. 59 (1956)"
        subtitle="Akta Notaris R.M. Soeprapto"
        isSelected={selectedHistoryId === 'archives-notary-1956'}
        isHovered={hoveredId === 'archives-notary-1956'}
        onClick={() => {
          const doc = histories.find((h) => h.id === 'archives-notary-1956')
          if (doc) onSelectHistory(doc)
        }}
        onHover={onHover}
      />

      {/* Vitrine 2: Naskah Statuta & Kurikulum Pertama 1957 */}
      <ArchivalVitrine
        position={[0, 0, 1.2]}
        title="Statuta & Kurikulum 1957"
        subtitle="Fakultas Hukum & Masyarakat"
        isSelected={selectedHistoryId === 'archives-statuta-1957'}
        isHovered={hoveredId === 'archives-statuta-1957'}
        onClick={() => {
          const doc = histories.find((h) => h.id === 'archives-statuta-1957')
          if (doc) onSelectHistory(doc)
        }}
        onHover={onHover}
      />

      {/* Bangku Pengunjung di Sudut Ruang */}
      <mesh position={[0, 0.24, -6.5]} material={mats.benchGrey}>
        <boxGeometry args={[4.2, 0.48, 1.1]} />
      </mesh>

      {/* 5. Dinding Kiri: Historical Timeline */}
      <HistoricalTimelineWall
        length={roomL}
        halfWidth={halfW}
        histories={histories}
        selectedHistoryId={selectedHistoryId}
        hoveredId={hoveredId}
        isMobile={isMobile}
        onSelectHistory={onSelectHistory}
        onHover={onHover}
      />

      {/* 6. Dinding Kanan: Founders & Documentation Gallery */}
      <FoundersGalleryWall
        length={roomL}
        halfWidth={halfW}
        founders={founders}
        selectedFounderId={selectedFounderId}
        hoveredId={hoveredId}
        isMobile={isMobile}
        onSelectFounder={onSelectFounder}
        onHover={onHover}
      />

      {/* 7. Pintu Keluar Kembali ke Aula Utama Base Zone */}
      <PortalDoor
        id="exit-to-base-zone"
        doorNumber="KELUAR"
        title="Kembali ke Aula Utama"
        subtitle="Base Zone 1"
        position={[0, 0, zFront - 0.04]}
        rotationY={Math.PI}
        isHovered={hoveredId === 'exit-to-base-zone'}
        onSelect={onExitRoom}
        onHover={onHover}
        variant="exit"
      />

      {/* 8. Pencahayaan Ruangan 3000K Hangat Berwibawa */}
      <ambientLight color="#fff7ec" intensity={1.2} />
      <directionalLight position={[2, roomH - 0.5, 2]} color="#fffcf2" intensity={0.5} />
      {!isMobile && (
        <>
          <pointLight position={[0, roomH - 1.0, -3.2]} color="#fff8ee" intensity={3.5} distance={12} decay={1.8} />
          <pointLight position={[0, roomH - 1.0, 1.2]} color="#fff8ee" intensity={3.5} distance={12} decay={1.8} />
        </>
      )}
    </group>
  )
}
