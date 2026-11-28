import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import type { HistoryExhibit } from './data/exhibits'
import { SalonItem } from './HistoryArchivesWing'
import { PortalDoor } from './PortalDoor'
import { DiponegoroStatue } from './DiponegoroStatue'
import { assetCache } from './cache'

interface GalleryRoom02Props {
  histories: HistoryExhibit[]
  selectedHistoryId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelectHistory: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
  onExitRoom: () => void
}

const C = {
  navy: '#1b2a3d',
  deepNavy: '#141f2d',
  ivory: '#E9E1D3',
  warmIvory: '#F4ECE1',
  taupe: '#655447',
  gold: '#B2935D',
  brightGold: '#d4af37',
  stone: '#D8CDBB',
  floor: '#261912',
  walnut: '#392D25',
  glass: '#d6edf0',
  warmLight: '#fff6e4',
}

/**
 * GabledArchivalVitrine: Meja Etalase Kaca Memanjang dengan Tudung Prisma Segitiga (Gabled Glass Case)
 * Persis seperti foto referensi galeri arsip nasional:
 * - Badan kabinet kayu walnut & navy berlist emas antik
 * - Tudung kaca segitiga memanjang dengan bingkai perunggu gelap
 * - Alas pameran dalam dengan pencahayaan LED internal lembut
 * - Naskah replika pidato Bung Karno dan dekrit penegerian di dalamnya
 */
function GabledArchivalVitrine({
  position,
  length = 5.6,
  width = 1.3,
  height = 0.9,
  onSelect,
  onHover,
}: {
  position: [number, number, number]
  length?: number
  width?: number
  height?: number
  onSelect?: () => void
  onHover?: (id: string | null) => void
}) {
  const mats = useMemo(() => {
    return {
      walnut: assetCache.getMaterial('r2-vit-walnut', () => new THREE.MeshStandardMaterial({ color: C.walnut, roughness: 0.7 })),
      navyBase: assetCache.getMaterial('r2-vit-navy', () => new THREE.MeshStandardMaterial({ color: C.navy, roughness: 0.8 })),
      goldTrim: assetCache.getMaterial('r2-vit-gold', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.35, metalness: 0.85 })),
      glass: assetCache.getMaterial('r2-vit-glass', () => new THREE.MeshStandardMaterial({
        color: C.glass,
        transparent: true,
        opacity: 0.28,
        roughness: 0.05,
        metalness: 0.1,
      })),
      internalBed: assetCache.getMaterial('r2-vit-bed', () => new THREE.MeshStandardMaterial({
        color: '#f8f4e6',
        emissive: '#fffae8',
        emissiveIntensity: 0.5,
        roughness: 0.9,
      })),
      documentParchment: assetCache.getMaterial('r2-vit-doc', () => new THREE.MeshStandardMaterial({
        color: '#ede3cf',
        roughness: 0.85,
      })),
      darkBronzeFrame: assetCache.getMaterial('r2-vit-bronze', () => new THREE.MeshStandardMaterial({
        color: '#221e1a',
        roughness: 0.4,
        metalness: 0.7,
      })),
    }
  }, [])

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover?.('gabled-vitrine')
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {/* 1. Base Plinth Walnut */}
      <mesh position={[0, 0.08, 0]} material={mats.walnut}>
        <boxGeometry args={[width + 0.16, 0.16, length + 0.16]} />
      </mesh>

      {/* 2. Badan Kabinet Utama Navy */}
      <mesh position={[0, height / 2 + 0.08, 0]} material={mats.navyBase}>
        <boxGeometry args={[width, height - 0.16, length]} />
      </mesh>

      {/* 3. Lis Profil Emas Antik */}
      <mesh position={[0, height + 0.01, 0]} material={mats.goldTrim}>
        <boxGeometry args={[width + 0.04, 0.02, length + 0.04]} />
      </mesh>

      {/* 4. Lapisan Pameran Dalam Bercahaya Lembut */}
      <mesh position={[0, height + 0.03, 0]} material={mats.internalBed}>
        <boxGeometry args={[width - 0.08, 0.02, length - 0.08]} />
      </mesh>

      {/* 5. Dokumen-dokumen Arsip Terbuka di Atas Bantalan */}
      {[-1.8, -0.6, 0.6, 1.8].map((offsetZ, i) => (
        <group key={i} position={[0, height + 0.05, offsetZ]}>
          <mesh rotation={[-0.15, 0, 0]} material={mats.documentParchment}>
            <boxGeometry args={[width * 0.65, 0.015, 0.55]} />
          </mesh>
          <mesh position={[0, 0.012, 0]} rotation={[-0.15, 0, 0]}>
            <planeGeometry args={[width * 0.6, 0.5]} />
            <meshStandardMaterial color="#3a2f26" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 6. Tudung Kaca Prisma Segitiga (Gabled Glass Case) */}
      <group position={[0, height + 0.04, 0]}>
        {/* Dinding Kaca Sisi Miring Kiri */}
        <mesh
          position={[-width / 4, 0.22, 0]}
          rotation={[0, 0, Math.PI / 5.2]}
          material={mats.glass}
        >
          <boxGeometry args={[width * 0.64, 0.015, length - 0.04]} />
        </mesh>
        {/* Dinding Kaca Sisi Miring Kanan */}
        <mesh
          position={[width / 4, 0.22, 0]}
          rotation={[0, 0, -Math.PI / 5.2]}
          material={mats.glass}
        >
          <boxGeometry args={[width * 0.64, 0.015, length - 0.04]} />
        </mesh>

        {/* Tulang Bubungan Kaca Atas Perunggu */}
        <mesh position={[0, 0.44, 0]} material={mats.darkBronzeFrame}>
          <boxGeometry args={[0.04, 0.04, length]} />
        </mesh>

        {/* Kaca Tutup Ujung Depan & Belakang */}
        <mesh position={[0, 0.22, length / 2]} material={mats.glass}>
          <boxGeometry args={[width - 0.02, 0.42, 0.015]} />
        </mesh>
        <mesh position={[0, 0.22, -length / 2]} material={mats.glass}>
          <boxGeometry args={[width - 0.02, 0.42, 0.015]} />
        </mesh>
      </group>

      {/* Pendar Cahaya Lembut Dalam Etalase */}
      <pointLight position={[0, height + 0.28, 0]} color="#fff7e6" intensity={2.0} distance={4.5} decay={1.8} />
    </group>
  )
}

/**
 * InteractiveAudiovisualKiosk: Kios Audiovisual Interaktif Pidato Presiden Soekarno
 * Menyajikan kutipan audio & naskah transkrip bersejarah 9 Januari 1960.
 */
function InteractiveAudiovisualKiosk({
  position,
  rotationY = 0,
  isSelected = false,
  isHovered = false,
  onClick,
  onHover,
}: {
  position: [number, number, number]
  rotationY?: number
  isSelected?: boolean
  isHovered?: boolean
  onClick?: () => void
  onHover?: (id: string | null) => void
}) {
  const mats = useMemo(() => {
    return {
      walnut: assetCache.getMaterial('kiosk-walnut', () => new THREE.MeshStandardMaterial({ color: C.walnut, roughness: 0.65 })),
      goldTrim: assetCache.getMaterial('kiosk-gold', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.3, metalness: 0.85 })),
      screenGlow: assetCache.getMaterial('kiosk-screen', () => new THREE.MeshStandardMaterial({
        color: '#16283d',
        emissive: '#1a3350',
        emissiveIntensity: 0.8,
        roughness: 0.2,
      })),
      accentLight: assetCache.getMaterial('kiosk-accent', () => new THREE.MeshStandardMaterial({
        color: '#ffd56b',
        emissive: '#ffbe3b',
        emissiveIntensity: 2.2,
      })),
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
        onHover?.('kiosk-soekarno')
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {/* 1. Kaki Pedestal Kayu Walnut */}
      <mesh position={[0, 0.5, 0]} material={mats.walnut}>
        <boxGeometry args={[1.4, 1.0, 0.5]} />
      </mesh>
      {/* Ring Emas */}
      <mesh position={[0, 0.98, 0]} material={mats.goldTrim}>
        <boxGeometry args={[1.44, 0.04, 0.54]} />
      </mesh>

      {/* 2. Layar Konsol Miring */}
      <group position={[0, 1.1, 0.05]} rotation={[-0.45, 0, 0]}>
        <mesh material={mats.walnut}>
          <boxGeometry args={[1.36, 0.8, 0.08]} />
        </mesh>
        <mesh position={[0, 0, 0.045]} material={mats.goldTrim}>
          <boxGeometry args={[1.32, 0.76, 0.02]} />
        </mesh>
        <mesh position={[0, 0, 0.056]} material={mats.screenGlow}>
          <planeGeometry args={[1.26, 0.7]} />
        </mesh>

        {/* Tipografi Layar Audiovisual */}
        <Text position={[0, 0.24, 0.06]} fontSize={0.065} color={C.gold} anchorX="center" anchorY="middle">
          ARSIP AUDIOVISUAL PIDATO BUNG KARNO (1960)
        </Text>
        <Text position={[0, 0.12, 0.06]} fontSize={0.045} color={C.ivory} anchorX="center" anchorY="middle">
          "Peringatan Dies Natalis III Universitas Semarang"
        </Text>
        <Text position={[0, -0.04, 0.06]} fontSize={0.042} color="#ffffff" maxWidth={1.15} textAlign="center" anchorX="center" anchorY="middle">
          "Jadikanlah Universitas Diponegoro ini benteng kecerdasan dan nyala api patriotisme bangsa!"
        </Text>

        {/* Tombol Interaktif Play Audio / Baca Transkrip */}
        <group position={[0, -0.22, 0.06]}>
          <mesh material={isSelected || isHovered ? mats.accentLight : mats.goldTrim}>
            <boxGeometry args={[0.7, 0.1, 0.02]} />
          </mesh>
          <Text position={[0, 0, 0.015]} fontSize={0.042} color={C.deepNavy} anchorX="center" anchorY="middle">
            {isHovered ? 'KLIK UNTUK MEMBUKA ARSIP' : '▶ BUKA TRANSKRIP DOKUMEN'}
          </Text>
        </group>
      </group>

      {/* Pendar Lampu Aksen Layar */}
      <pointLight position={[0, 1.3, 0.3]} color="#ffecc2" intensity={1.5} distance={3.0} decay={2.0} />
    </group>
  )
}

/**
 * MonumentalRecessedPortal: Fitur Arsitektur Monumental di Ujung Ruang 02
 * Membingkai patung Diponegoro / lukisan induk monumental penegerian:
 * - Dinding navy megah berpigmen Prussian Blue
 * - Kusen bertingkat lengkung klasik Warm Ivory & Antique Gold
 * - Patung Pangeran Diponegoro di atas pedestal marmer
 * - Plakat perunggu keemasan berisi amanat Presiden Soekarno 9 Januari 1960
 */
function MonumentalRecessedPortal({
  length,
  halfWidth,
  diponegoroExhibit,
  selectedHistoryId,
  hoveredId,
  isMobile,
  onSelectHistory,
  onHover,
}: {
  length: number
  halfWidth: number
  diponegoroExhibit?: HistoryExhibit
  selectedHistoryId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelectHistory: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
}) {
  const zBack = -length / 2 + 0.15

  const mats = useMemo(() => {
    return {
      navyWall: assetCache.getMaterial('mon-navy-wall', () => new THREE.MeshStandardMaterial({ color: C.deepNavy, roughness: 0.85 })),
      ivoryArch: assetCache.getMaterial('mon-ivory-arch', () => new THREE.MeshStandardMaterial({ color: C.warmIvory, roughness: 0.65 })),
      walnutArch: assetCache.getMaterial('mon-walnut-arch', () => new THREE.MeshStandardMaterial({ color: C.walnut, roughness: 0.7 })),
      goldTrim: assetCache.getMaterial('mon-gold-trim', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.3, metalness: 0.85 })),
      marblePedestal: assetCache.getMaterial('mon-marble', () => new THREE.MeshStandardMaterial({ color: '#eee7d8', roughness: 0.3, metalness: 0.1 })),
      plaqueBrass: assetCache.getMaterial('mon-brass', () => new THREE.MeshStandardMaterial({ color: '#cf9e38', roughness: 0.35, metalness: 0.85 })),
    }
  }, [])

  return (
    <group position={[0, 0, zBack]}>
      {/* 1. Dinding Belakang Navy Monumental */}
      <mesh position={[0, 2.9, 0]} material={mats.navyWall}>
        <planeGeometry args={[halfWidth * 2, 5.8]} />
      </mesh>

      {/* 2. Portal Lengkung Klasik Berlapis (Layered Monumental Portal) */}
      <group position={[0, 0, 0.05]}>
        {/* Pilar Luar Kiri & Kanan Ivory */}
        <mesh position={[-3.6, 2.9, 0]} material={mats.ivoryArch}>
          <boxGeometry args={[0.7, 5.6, 0.35]} />
        </mesh>
        <mesh position={[3.6, 2.9, 0]} material={mats.ivoryArch}>
          <boxGeometry args={[0.7, 5.6, 0.35]} />
        </mesh>

        {/* Balok Architrave Atas Ivory */}
        <mesh position={[0, 5.2, 0]} material={mats.ivoryArch}>
          <boxGeometry args={[7.9, 0.65, 0.4]} />
        </mesh>
        {/* Lis Profil Emas Architrave */}
        <mesh position={[0, 4.85, 0.18]} material={mats.goldTrim}>
          <boxGeometry args={[7.8, 0.06, 0.05]} />
        </mesh>
        <mesh position={[0, 5.5, 0.18]} material={mats.goldTrim}>
          <boxGeometry args={[8.0, 0.08, 0.05]} />
        </mesh>

        {/* Bingkai Dalam Kayu Walnut & Lis Emas */}
        <mesh position={[-3.05, 2.7, 0.08]} material={mats.walnutArch}>
          <boxGeometry args={[0.25, 4.8, 0.2]} />
        </mesh>
        <mesh position={[3.05, 2.7, 0.08]} material={mats.walnutArch}>
          <boxGeometry args={[0.25, 4.8, 0.2]} />
        </mesh>
        <mesh position={[0, 4.6, 0.08]} material={mats.walnutArch}>
          <boxGeometry args={[6.35, 0.25, 0.2]} />
        </mesh>

        {/* Niche Relung Dinding Tersembunyi (Recessed Niche) */}
        <mesh position={[0, 2.7, 0.02]} material={mats.navyWall}>
          <boxGeometry args={[6.0, 4.6, 0.08]} />
        </mesh>
      </group>

      {/* 3. Inskripsi Monumental Emas di Atas Portal */}
      <group position={[0, 5.2, 0.22]}>
        <Text fontSize={0.24} color={C.gold} anchorX="center" anchorY="middle">
          AMANAT PRESIDEN SOEKARNO &amp; PENEGERIAN UNIVERSITAS DIPONEGORO (1960)
        </Text>
      </group>

      {/* 4. Pedestal Marmer & Patung Pangeran Diponegoro */}
      <group position={[0, 0, 1.2]}>
        <mesh position={[0, 0.45, 0]} material={mats.marblePedestal}>
          <boxGeometry args={[1.8, 0.9, 1.4]} />
        </mesh>
        <mesh position={[0, 0.92, 0]} material={mats.goldTrim}>
          <boxGeometry args={[1.86, 0.04, 1.46]} />
        </mesh>

        {/* Patung Monumental Diponegoro */}
        <DiponegoroStatue
          position={[0, 0.94, 0]}
          rotationY={0}
          scale={0.95}
          isSelected={selectedHistoryId === 'artwork-diponegoro-center'}
          isHovered={hoveredId === 'subroom-statue'}
          onSelect={() => {
            if (diponegoroExhibit) onSelectHistory(diponegoroExhibit)
          }}
          onHover={onHover}
        />

        {/* Plakat Emas Inskripsi Pidato Soekarno */}
        <group position={[0, 0.45, 0.72]}>
          <mesh material={mats.plaqueBrass}>
            <boxGeometry args={[1.4, 0.55, 0.02]} />
          </mesh>
          <Text position={[0, 0.16, 0.02]} fontSize={0.062} color={C.deepNavy} anchorX="center" anchorY="middle">
            "KOBARKAN API PERJUANGAN DIPONEGORO"
          </Text>
          <Text position={[0, 0.04, 0.02]} fontSize={0.042} color="#1f180d" maxWidth={1.25} textAlign="center" anchorX="center" anchorY="middle">
            "Universitas Diponegoro harus menjadi universitas pejuang kemerdekaan dan benteng ilmu pengetahuan."
          </Text>
          <Text position={[0, -0.16, 0.02]} fontSize={0.038} color="#2b2011" anchorX="center" anchorY="middle">
            — Ir. Soekarno, Dies Natalis III Undip, 9 Januari 1960
          </Text>
        </group>
      </group>

      {/* 5. Pencahayaan Sorot Monumental (Dramatic Spotlighting) */}
      {!isMobile && (
        <>
          <spotLight
            position={[0, 5.4, 3.2]}
            target-position={[0, 2.2, 1.2]}
            color="#fff8ed"
            intensity={18}
            angle={0.65}
            penumbra={0.55}
            decay={1.6}
            distance={16}
          />
          <pointLight position={[-2.4, 4.2, 1.5]} color="#ffdca8" intensity={3.5} distance={7} decay={1.8} />
          <pointLight position={[2.4, 4.2, 1.5]} color="#ffdca8" intensity={3.5} distance={7} decay={1.8} />
        </>
      )}
    </group>
  )
}

/**
 * GalleryRoom02: Transformasi Total Ruang 02
 * "Historical Milestone Gallery: Penegerian & Pidato Soekarno"
 * Desain ruang pameran monumental berarsitektur klasik modern:
 * - Dinding dominan Navy Prussian Blue (#1b2a3d) dengan arsitektur Ivory & Gold
 * - Koridor tengah dengan Meja Etalase Kaca Prisma (Gabled Vitrine Case)
 * - Relung Portal Monumental Penegerian Soekarno & Diponegoro di dinding belakang
 * - Dinding Kiri: Arsip PP No. 7 Tahun 1961 & Lembaran Negara
 * - Dinding Kanan: Dokumentasi Foto Kunjungan & Naskah Pidato Presiden Soekarno 1960
 * - Plafon kubah berusuk klasik dengan suspended track spotlights
 */
export function GalleryRoom02({
  histories,
  selectedHistoryId,
  hoveredId,
  isMobile = false,
  onSelectHistory,
  onHover,
  onExitRoom,
}: GalleryRoom02Props) {
  const roomW = 15.0
  const roomL = 18.0
  const roomH = 5.8
  const halfW = roomW / 2
  const zFront = roomL / 2

  // Ambil data spesifik koleksi Ruang 02
  const dipoExhibit = useMemo(
    () => histories.find((h) => h.id === 'artwork-diponegoro-center'),
    [histories],
  )
  const leftExhibits = useMemo(
    () => histories.filter((h) => h.id === 'decree-sk-1961' || h.id === 'decree-lembaran-negara'),
    [histories],
  )
  const rightExhibits = useMemo(
    () => histories.filter((h) => h.id === 'early-photo-soekarno-visit' || h.id === 'archives-soekarno-1960'),
    [histories],
  )

  const mats = useMemo(() => {
    return {
      navyWall: assetCache.getMaterial('r2-navy-wall', () => new THREE.MeshStandardMaterial({ color: C.navy, roughness: 0.88 })),
      ivoryTrim: assetCache.getMaterial('r2-ivory-trim', () => new THREE.MeshStandardMaterial({ color: C.ivory, roughness: 0.7 })),
      goldTrim: assetCache.getMaterial('r2-gold-trim', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.35, metalness: 0.85 })),
      walnutWainscot: assetCache.getMaterial('r2-walnut-wainscot', () => new THREE.MeshStandardMaterial({ color: C.walnut, roughness: 0.75 })),
      parquetFloor: assetCache.getMaterial('r2-parquet-floor', () => new THREE.MeshStandardMaterial({ color: C.floor, roughness: 0.65 })),
      ceilingRib: assetCache.getMaterial('r2-ceiling-rib', () => new THREE.MeshStandardMaterial({ color: C.warmIvory, roughness: 0.85 })),
      canisterDark: assetCache.getMaterial('r2-canister-dark', () => new THREE.MeshStandardMaterial({ color: '#1a1917', roughness: 0.4, metalness: 0.7 })),
      lensGlow: assetCache.getMaterial('r2-lens-glow', () => new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff6e0', emissiveIntensity: 5.0 })),
    }
  }, [])

  return (
    <group>
      {/* 1. Lantai Kayu Parket Gelap Mewah */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={mats.parquetFloor}>
        <planeGeometry args={[roomW, roomL]} />
      </mesh>

      {/* Lis Tepi Marmer Travertine Pembatas Lantai */}
      <mesh position={[-halfW + 0.15, 0.01, 0]} material={mats.ivoryTrim}>
        <boxGeometry args={[0.3, 0.02, roomL]} />
      </mesh>
      <mesh position={[halfW - 0.15, 0.01, 0]} material={mats.ivoryTrim}>
        <boxGeometry args={[0.3, 0.02, roomL]} />
      </mesh>

      {/* 2. Dinding Utama Navy Prussian Blue (Kiri, Kanan, Depan) */}
      {/* Dinding Kiri */}
      <mesh position={[-halfW, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.navyWall}>
        <planeGeometry args={[roomL, roomH]} />
      </mesh>
      {/* Wainscoting Bawah Kayu Walnut Dinding Kiri */}
      <mesh position={[-halfW + 0.04, 0.6, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.walnutWainscot}>
        <boxGeometry args={[roomL, 1.2, 0.06]} />
      </mesh>
      <mesh position={[-halfW + 0.08, 1.22, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.goldTrim}>
        <boxGeometry args={[roomL, 0.04, 0.03]} />
      </mesh>

      {/* Dinding Kanan */}
      <mesh position={[halfW, roomH / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={mats.navyWall}>
        <planeGeometry args={[roomL, roomH]} />
      </mesh>
      {/* Wainscoting Bawah Kayu Walnut Dinding Kanan */}
      <mesh position={[halfW - 0.04, 0.6, 0]} rotation={[0, -Math.PI / 2, 0]} material={mats.walnutWainscot}>
        <boxGeometry args={[roomL, 1.2, 0.06]} />
      </mesh>
      <mesh position={[halfW - 0.08, 1.22, 0]} rotation={[0, -Math.PI / 2, 0]} material={mats.goldTrim}>
        <boxGeometry args={[roomL, 0.04, 0.03]} />
      </mesh>

      {/* Dinding Depan (Arah Pintu Keluar) */}
      <mesh position={[0, roomH / 2, zFront]} rotation={[0, Math.PI, 0]} material={mats.navyWall}>
        <planeGeometry args={[roomW, roomH]} />
      </mesh>
      <mesh position={[0, 0.6, zFront - 0.04]} rotation={[0, Math.PI, 0]} material={mats.walnutWainscot}>
        <boxGeometry args={[roomW, 1.2, 0.06]} />
      </mesh>
      <mesh position={[0, 1.22, zFront - 0.08]} rotation={[0, Math.PI, 0]} material={mats.goldTrim}>
        <boxGeometry args={[roomW, 0.04, 0.03]} />
      </mesh>

      {/* 3. Plafon Kubah Berusuk Lengkung Klasik & Balok Cornice */}
      <mesh position={[0, roomH, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.ceilingRib}>
        <planeGeometry args={[roomW, roomL]} />
      </mesh>
      {/* Balok Cornice Sepanjang Dinding Kiri & Kanan */}
      <mesh position={[-halfW + 0.35, roomH - 0.2, 0]} material={mats.ivoryTrim}>
        <boxGeometry args={[0.7, 0.4, roomL]} />
      </mesh>
      <mesh position={[halfW - 0.35, roomH - 0.2, 0]} material={mats.ivoryTrim}>
        <boxGeometry args={[0.7, 0.4, roomL]} />
      </mesh>
      {/* Rusuk Melintang Plafon Ivory (Classical Ribs) */}
      {[-6, -3, 0, 3, 6].map((rz) => (
        <group key={rz} position={[0, roomH - 0.15, rz]}>
          <mesh material={mats.ceilingRib}>
            <boxGeometry args={[roomW - 1.4, 0.28, 0.35]} />
          </mesh>
          <mesh position={[0, -0.15, 0]} material={mats.goldTrim}>
            <boxGeometry args={[roomW - 1.4, 0.02, 0.38]} />
          </mesh>
        </group>
      ))}

      {/* 4. Suspended Track Lighting di Koridor Tengah */}
      <group position={[0, roomH - 0.9, 0]}>
        {/* Batang Trek Suspensi */}
        <mesh material={mats.canisterDark}>
          <boxGeometry args={[0.06, 0.06, roomL - 4]} />
        </mesh>
        {/* Deretan Lampu Canister Menghadap ke Bawah */}
        {[-5, -3.2, -1.4, 0.4, 2.2, 4].map((zPos) => (
          <group key={zPos} position={[0, -0.1, zPos]}>
            <mesh material={mats.canisterDark}>
              <cylinderGeometry args={[0.06, 0.07, 0.16, 16]} />
            </mesh>
            <mesh position={[0, -0.09, 0]} material={mats.lensGlow}>
              <circleGeometry args={[0.055, 16]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. FITUR SENTRAL KORIDOR: Meja Etalase Kaca Prisma (Gabled Archival Vitrine) */}
      <GabledArchivalVitrine
        position={[0, 0, -1.0]}
        length={5.2}
        width={1.4}
        height={0.92}
        onSelect={() => {
          const doc = histories.find((h) => h.id === 'decree-sk-1961')
          if (doc) onSelectHistory(doc)
        }}
        onHover={onHover}
      />

      {/* Kios Audiovisual Interaktif Pidato Soekarno */}
      <InteractiveAudiovisualKiosk
        position={[0, 0, 2.8]}
        rotationY={0}
        isSelected={selectedHistoryId === 'archives-soekarno-1960'}
        isHovered={hoveredId === 'kiosk-soekarno'}
        onClick={() => {
          const soekarno = histories.find((h) => h.id === 'archives-soekarno-1960')
          if (soekarno) onSelectHistory(soekarno)
        }}
        onHover={onHover}
      />

      {/* 6. DINDING BELAKANG MONUMENTAL: Recessed Portal Diponegoro & Amanat Penegerian */}
      <MonumentalRecessedPortal
        length={roomL}
        halfWidth={halfW}
        diponegoroExhibit={dipoExhibit}
        selectedHistoryId={selectedHistoryId}
        hoveredId={hoveredId}
        isMobile={isMobile}
        onSelectHistory={onSelectHistory}
        onHover={onHover}
      />

      {/* 7. DINDING KIRI: Arsip Penegerian & Surat Keputusan Pemerintah (1960–1961) */}
      <group>
        {/* Banner Header Dinding Kiri */}
        <group position={[-halfW + 0.15, 4.3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[roomL - 4, 0.55, 0.06]} />
            <meshStandardMaterial color={C.navy} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.25} color={C.gold} anchorX="center" anchorY="middle">
            DOKUMEN HUKUM PENEGERIAN UNIVERSITAS DIPONEGORO (PP NO. 7 / 1961)
          </Text>
        </group>

        {/* Koleksi Pameran Kiri */}
        {leftExhibits.map((item, idx) => {
          const itemZ = -2.5 + idx * 4.6
          return (
            <group key={item.id}>
              {/* Lampu Sorot Sconce Aksen di Atas Bingkai */}
              <group position={[-halfW + 0.35, 3.8, itemZ]} rotation={[0, Math.PI / 2, 0]}>
                <mesh>
                  <boxGeometry args={[0.5, 0.04, 0.14]} />
                  <meshStandardMaterial color={C.gold} metalness={0.7} roughness={0.3} />
                </mesh>
                <mesh position={[0, -0.03, 0]}>
                  <planeGeometry args={[0.42, 0.08]} />
                  <meshStandardMaterial color="#fffbe8" emissive="#ffdd8f" emissiveIntensity={4} />
                </mesh>
                {!isMobile && (
                  <pointLight position={[0, -0.22, 0.22]} color="#ffe9be" intensity={2.8} distance={4.0} decay={1.8} />
                )}
              </group>

              <SalonItem
                config={{
                  exhibitId: item.id,
                  z: itemZ,
                  y: 2.5,
                  width: 2.1,
                  height: 1.6,
                  frameColor: C.gold,
                }}
                exhibit={item}
                position={[-halfW + 0.08, 2.5, itemZ]}
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

      {/* 8. DINDING KANAN: Dokumentasi Foto Kunjungan & Pidato Presiden Soekarno */}
      <group>
        {/* Banner Header Dinding Kanan */}
        <group position={[halfW - 0.15, 4.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[roomL - 4, 0.55, 0.06]} />
            <meshStandardMaterial color={C.navy} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.25} color={C.gold} anchorX="center" anchorY="middle">
            DOKUMENTASI KUNJUNGAN BUNG KARNO — DIES NATALIS III (9 JANUARI 1960)
          </Text>
        </group>

        {/* Koleksi Pameran Kanan */}
        {rightExhibits.map((item, idx) => {
          const itemZ = -2.5 + idx * 4.6
          return (
            <group key={item.id}>
              {/* Lampu Sorot Sconce Aksen di Atas Bingkai */}
              <group position={[halfW - 0.35, 3.8, itemZ]} rotation={[0, -Math.PI / 2, 0]}>
                <mesh>
                  <boxGeometry args={[0.5, 0.04, 0.14]} />
                  <meshStandardMaterial color={C.gold} metalness={0.7} roughness={0.3} />
                </mesh>
                <mesh position={[0, -0.03, 0]}>
                  <planeGeometry args={[0.42, 0.08]} />
                  <meshStandardMaterial color="#fffbe8" emissive="#ffdd8f" emissiveIntensity={4} />
                </mesh>
                {!isMobile && (
                  <pointLight position={[0, -0.22, 0.22]} color="#ffe9be" intensity={2.8} distance={4.0} decay={1.8} />
                )}
              </group>

              <SalonItem
                config={{
                  exhibitId: item.id,
                  z: itemZ,
                  y: 2.5,
                  width: 2.1,
                  height: 1.6,
                  frameColor: C.gold,
                }}
                exhibit={item}
                position={[halfW - 0.08, 2.5, itemZ]}
                rotationY={-Math.PI / 2}
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

      {/* 9. Pintu Keluar Menuju Base Zone (Dinding Depan) */}
      <PortalDoor
        id="exit-to-base-zone-02"
        doorNumber="KELUAR"
        title="Kembali ke Aula Utama"
        subtitle="Base Zone 1"
        position={[0, 0, zFront - 0.04]}
        rotationY={Math.PI}
        isHovered={hoveredId === 'exit-to-base-zone-02'}
        onSelect={onExitRoom}
        onHover={onHover}
        variant="exit"
      />

      {/* 10. Pencahayaan Galeri Terarah & Berwibawa */}
      <ambientLight color="#fff6eb" intensity={1.15} />
      <directionalLight position={[2, roomH - 0.5, 3]} color="#fffcf5" intensity={0.55} />
      {!isMobile && (
        <>
          <pointLight position={[0, roomH - 1.2, -4.0]} color="#fff7ec" intensity={4.0} distance={14} decay={1.7} />
          <pointLight position={[0, roomH - 1.2, 1.5]} color="#fff7ec" intensity={4.0} distance={14} decay={1.7} />
        </>
      )}
    </group>
  )
}
