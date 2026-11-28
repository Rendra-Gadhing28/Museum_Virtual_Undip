import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import type { HistoryExhibit } from './data/exhibits'
import { SalonItem } from './HistoryArchivesWing'
import { PortalDoor } from './PortalDoor'
import { assetCache } from './cache'

interface GalleryRoom05Props {
  histories: HistoryExhibit[]
  selectedHistoryId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelectHistory: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
  onExitRoom: () => void
}

const C = {
  royalNavy: '#1b3a60',
  deepNavy: '#12243d',
  portalNavy: '#162e4d',
  ivory: '#E9E1D3',
  pureWhite: '#ffffff',
  greige: '#B8AA96',
  gold: '#B2935D',
  brightGold: '#d4af37',
  floorLight: '#e6ded4',
  screenBlue: '#13355c',
  screenGlow: '#1c4a80',
  glass: '#d6edf0',
  nicheRed: '#7c1d1d',
  nicheGlow: '#ff4d4d',
  ceilingDark: '#16191f',
}

/**
 * PanoramicPhotoRibbon: Pita Foto & Arsip Teriluminasi Sepanjang Dinding Kiri
 * Persis seperti di foto referensi 1:
 * - Deretan foto arsip sejarah berjejer di sepanjang dinding atas
 * - Kotak etalase tersembunyi dengan pendar biru di bawahnya
 */
function PanoramicPhotoRibbon({
  length,
  halfWidth,
  wisudaPerdana,
  selectedHistoryId,
  hoveredId,
  isMobile,
  onSelectHistory,
  onHover,
}: {
  length: number
  halfWidth: number
  wisudaPerdana?: HistoryExhibit
  selectedHistoryId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelectHistory: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
}) {
  const wallX = -halfWidth

  const mats = useMemo(() => {
    return {
      ribbonBackdrop: assetCache.getMaterial('r5-ribbon-back', () => new THREE.MeshStandardMaterial({ color: '#ede7de', roughness: 0.7 })),
      showcaseNavy: assetCache.getMaterial('r5-showcase-navy', () => new THREE.MeshStandardMaterial({
        color: '#133154',
        roughness: 0.6,
      })),
      photoFrame: assetCache.getMaterial('r5-photo-frame', () => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 })),
      photoSepia: assetCache.getMaterial('r5-photo-sepia', () => new THREE.MeshStandardMaterial({ color: '#3d3126', roughness: 0.8 })),
      photoColor: assetCache.getMaterial('r5-photo-color', () => new THREE.MeshStandardMaterial({ color: '#2d4b68', roughness: 0.8 })),
      goldTrim: assetCache.getMaterial('r5-ribbon-gold', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.35, metalness: 0.85 })),
      glass: assetCache.getMaterial('r5-ribbon-glass', () => new THREE.MeshStandardMaterial({
        color: C.glass,
        transparent: true,
        opacity: 0.25,
        roughness: 0.1,
      })),
    }
  }, [])

  return (
    <group position={[wallX, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      {/* 1. Panel Dinding Latar Belakang Putih Gading */}
      <mesh position={[0, 2.7, 0.04]} material={mats.ribbonBackdrop}>
        <boxGeometry args={[length - 2.0, 3.8, 0.06]} />
      </mesh>

      {/* 2. Pita Atas: Deretan Foto Arsip Berkelanjutan (Continuous Illuminated Photo Strip) */}
      <mesh position={[0, 3.85, 0.08]} material={mats.photoFrame}>
        <boxGeometry args={[length - 2.4, 0.95, 0.03]} />
      </mesh>
      {/* 10 Bingkai Foto Berjajar di Sepanjang Pita */}
      {[-6.2, -4.8, -3.4, -2.0, -0.6, 0.8, 2.2, 3.6, 5.0, 6.4].map((px, i) => (
        <group key={i} position={[px, 3.85, 0.1]}>
          <mesh material={i % 2 === 0 ? mats.photoSepia : mats.photoColor}>
            <planeGeometry args={[1.25, 0.82]} />
          </mesh>
          <mesh position={[0, 0, 0.005]} material={mats.goldTrim}>
            <boxGeometry args={[1.28, 0.02, 0.01]} />
          </mesh>
        </group>
      ))}

      {/* 3. Pita Tengah-Bawah: Niche Etalase Pameran Dokumen Biru Navy Bercahaya */}
      <mesh position={[0, 2.4, 0.08]} material={mats.showcaseNavy}>
        <boxGeometry args={[length - 2.4, 1.6, 0.14]} />
      </mesh>
      <mesh position={[0, 3.22, 0.16]} material={mats.goldTrim}>
        <boxGeometry args={[length - 2.4, 0.04, 0.02]} />
      </mesh>
      <mesh position={[0, 1.58, 0.16]} material={mats.goldTrim}>
        <boxGeometry args={[length - 2.4, 0.04, 0.02]} />
      </mesh>

      {/* Label Header Pameran */}
      <group position={[0, 4.5, 0.1]}>
        <Text fontSize={0.24} color={C.deepNavy} anchorX="center" anchorY="middle">
          LINIMASA HISTORIS &amp; REKAM PERJALANAN INSTITUSI UNIVERSITAS DIPONEGORO
        </Text>
      </group>

      {/* Dokumen Arsip Fisik & Ijazah Bersejarah di Dalam Etalase */}
      {[-5.0, -2.8, 2.8, 5.0].map((dx, i) => (
        <group key={i} position={[dx, 2.3, 0.16]}>
          <mesh rotation={[0, 0, 0]} material={mats.photoFrame}>
            <boxGeometry args={[1.4, 1.1, 0.02]} />
          </mesh>
          <mesh position={[0, 0, 0.012]} material={mats.photoSepia}>
            <planeGeometry args={[1.3, 1.0]} />
          </mesh>
          <Text position={[0, -0.62, 0.02]} fontSize={0.075} color={C.ivory} anchorX="center" anchorY="middle">
            {i === 0 ? 'Statuta Yayasan 1956' : i === 1 ? 'Akta Notaris No. 59' : i === 2 ? 'SK Menteri PTIP 1961' : 'Piagam Dies Natalis'}
          </Text>
        </group>
      ))}

      {/* Pusat Pameran Wisuda Perdana 1962 (Interaktif) */}
      {wisudaPerdana && (
        <group position={[0, 2.35, 0.18]}>
          <SalonItem
            config={{
              exhibitId: wisudaPerdana.id,
              z: 0,
              y: 2.35,
              width: 2.5,
              height: 1.6,
              frameColor: C.gold,
            }}
            exhibit={wisudaPerdana}
            position={[0, 0, 0]}
            rotationY={0}
            isSelected={selectedHistoryId === wisudaPerdana.id}
            isHovered={hoveredId === wisudaPerdana.id}
            isMobile={isMobile}
            onSelect={onSelectHistory}
            onHover={onHover}
          />
        </group>
      )}

      {/* 4. Strip Lampu LED Cove Bawah Dinding */}
      <mesh position={[0, 0.06, 0.1]}>
        <boxGeometry args={[length - 2.0, 0.06, 0.04]} />
        <meshStandardMaterial color="#ffffff" emissive="#dbeeff" emissiveIntensity={3.2} />
      </mesh>
    </group>
  )
}

/**
 * IlluminatedArtifactNiches: Niche Vertikal Teriluminasi Merah/Emas & Layar PTN-BH (Dinding Kanan)
 * Terinspirasi langsung dari foto referensi 3:
 * - Relung vertikal bercahaya warna hangat (red-orange/coral glow) menyimpan artefak seremonial
 * - Layar lebar digital menampilkan transformasi PTN-BH dan reputasi universitas
 */
function IlluminatedArtifactNiches({
  length,
  halfWidth,
  transformasiPtnBh,
  selectedHistoryId,
  hoveredId,
  isMobile,
  onSelectHistory,
  onHover,
}: {
  length: number
  halfWidth: number
  transformasiPtnBh?: HistoryExhibit
  selectedHistoryId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelectHistory: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
}) {
  const wallX = halfWidth

  const mats = useMemo(() => {
    return {
      wallNavy: assetCache.getMaterial('r5-niche-navy', () => new THREE.MeshStandardMaterial({ color: C.royalNavy, roughness: 0.85 })),
      nicheInterior: assetCache.getMaterial('r5-niche-red', () => new THREE.MeshStandardMaterial({
        color: C.nicheRed,
        emissive: '#991b1b',
        emissiveIntensity: 0.85,
        roughness: 0.4,
      })),
      artifactGold: assetCache.getMaterial('r5-niche-artifact', () => new THREE.MeshStandardMaterial({
        color: '#ffdd77',
        emissive: '#ffbe3b',
        emissiveIntensity: 0.4,
        roughness: 0.25,
        metalness: 0.9,
      })),
      goldTrim: assetCache.getMaterial('r5-niche-gold', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.35, metalness: 0.85 })),
      displayGlass: assetCache.getMaterial('r5-niche-glass', () => new THREE.MeshStandardMaterial({
        color: C.glass,
        transparent: true,
        opacity: 0.3,
        roughness: 0.05,
      })),
      screenSurface: assetCache.getMaterial('r5-niche-screen', () => new THREE.MeshStandardMaterial({
        color: '#102947',
        emissive: '#183e6b',
        emissiveIntensity: 0.7,
        roughness: 0.2,
      })),
    }
  }, [])

  return (
    <group position={[wallX, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* 1. Dinding Utama Royal Navy */}
      <mesh position={[0, 2.9, 0.04]} material={mats.wallNavy}>
        <boxGeometry args={[length - 1.0, 5.8, 0.08]} />
      </mesh>

      {/* 2. Tiga Relung Artefak Vertikal Menyala Merah/Coral (Illuminated Niches) */}
      {[-5.4, -3.8, -2.2].map((nx, i) => (
        <group key={i} position={[nx, 2.6, 0.08]}>
          {/* Relung Tembok */}
          <mesh material={mats.nicheInterior}>
            <boxGeometry args={[1.1, 2.6, 0.25]} />
          </mesh>
          {/* Bingkai Emas Sekeliling Relung */}
          <mesh position={[0, 0, 0.13]} material={mats.goldTrim}>
            <boxGeometry args={[1.14, 2.64, 0.02]} />
          </mesh>
          {/* Kaca Penutup Relung */}
          <mesh position={[0, 0, 0.12]} material={mats.displayGlass}>
            <planeGeometry args={[1.06, 2.56]} />
          </mesh>

          {/* Artefak 3D di Dalam Relung */}
          {i === 0 && (
            /* Tongkat Pedel Rektorat Emas */
            <group position={[0, 0, 0]}>
              <mesh material={mats.artifactGold}>
                <cylinderGeometry args={[0.025, 0.03, 1.8, 16]} />
              </mesh>
              <mesh position={[0, 0.95, 0]} material={mats.artifactGold}>
                <sphereGeometry args={[0.09, 16, 16]} />
              </mesh>
              <Text position={[0, -1.05, 0.05]} fontSize={0.065} color={C.ivory} anchorX="center" anchorY="middle">
                Tongkat Pedel Kehormatan
              </Text>
            </group>
          )}
          {i === 1 && (
            /* Piala Emas & Medali Prestasi */
            <group position={[0, -0.1, 0]}>
              <mesh position={[0, 0.35, 0]} material={mats.artifactGold}>
                <cylinderGeometry args={[0.18, 0.06, 0.5, 16]} />
              </mesh>
              <mesh position={[0, 0, 0]} material={mats.artifactGold}>
                <cylinderGeometry args={[0.14, 0.16, 0.2, 16]} />
              </mesh>
              <Text position={[0, -0.95, 0.05]} fontSize={0.065} color={C.ivory} anchorX="center" anchorY="middle">
                Trofi Keunggulan Riset
              </Text>
            </group>
          )}
          {i === 2 && (
            /* Patung Garuda / Simbol Integritas Akademik */
            <group position={[0, 0.1, 0]}>
              <mesh position={[0, 0.2, 0]} material={mats.artifactGold}>
                <boxGeometry args={[0.35, 0.45, 0.15]} />
              </mesh>
              <mesh position={[0, -0.2, 0]} material={mats.goldTrim}>
                <boxGeometry args={[0.45, 0.35, 0.2]} />
              </mesh>
              <Text position={[0, -1.15, 0.05]} fontSize={0.065} color={C.ivory} anchorX="center" anchorY="middle">
                Lencana Mahaguru Undip
              </Text>
            </group>
          )}
        </group>
      ))}

      {/* 3. Layar Digital Lebar: Transformasi PTN-BH & Capaian Kelas Dunia */}
      <group position={[2.5, 2.6, 0.1]}>
        <mesh material={mats.screenSurface}>
          <boxGeometry args={[6.8, 2.8, 0.06]} />
        </mesh>
        <mesh position={[0, 1.42, 0.04]} material={mats.goldTrim}>
          <boxGeometry args={[6.84, 0.04, 0.02]} />
        </mesh>
        <mesh position={[0, -1.42, 0.04]} material={mats.goldTrim}>
          <boxGeometry args={[6.84, 0.04, 0.02]} />
        </mesh>

        {/* Teks Informasi Capaian PTN-BH */}
        <group position={[0, 0.85, 0.05]}>
          <Text fontSize={0.22} color={C.brightGold} anchorX="center" anchorY="middle">
            TRANSFORMASI MENUJU PTN-BH &amp; REPUTASI GLOBAL (2015–SEKARANG)
          </Text>
          <Text position={[0, -0.32, 0]} fontSize={0.14} color={C.ivory} anchorX="center" anchorY="middle">
            Otonomi Akademik Penuh • Akreditasi Internasional • Keunggulan Riset Kelautan
          </Text>
        </group>

        {/* Koleksi Interaktif PTN-BH */}
        {transformasiPtnBh && (
          <group position={[0, -0.35, 0.06]}>
            <SalonItem
              config={{
                exhibitId: transformasiPtnBh.id,
                z: 0,
                y: 0,
                width: 3.2,
                height: 1.4,
                frameColor: C.gold,
              }}
              exhibit={transformasiPtnBh}
              position={[0, 0, 0]}
              rotationY={0}
              isSelected={selectedHistoryId === transformasiPtnBh.id}
              isHovered={hoveredId === transformasiPtnBh.id}
              isMobile={isMobile}
              onSelect={onSelectHistory}
              onHover={onHover}
            />
          </group>
        )}
      </group>

      {/* 4. Strip Pendar Cove Bawah Dinding Kanan */}
      <mesh position={[0, 0.06, 0.1]}>
        <boxGeometry args={[length - 1.0, 0.06, 0.04]} />
        <meshStandardMaterial color="#ffffff" emissive="#dbeeff" emissiveIntensity={3.2} />
      </mesh>
    </group>
  )
}

/**
 * RotundaInformationTotem: Pilar Totem Informasi Sirkular di Zona Depan
 * Persis seperti di foto referensi 2:
 * - Pilar arsitektural silinder putih bersih dengan pelat dudukan bundar di bawahnya
 * - Terbungkus panel grafis tipografi infografis nilai luhur & tonggak sejarah Undip
 */
function RotundaInformationTotem({
  position,
  radius = 0.65,
  height = 4.2,
  onHover,
}: {
  position: [number, number, number]
  radius?: number
  height?: number
  onHover?: (id: string | null) => void
}) {
  const mats = useMemo(() => {
    return {
      totemColumn: assetCache.getMaterial('r5-totem-col', () => new THREE.MeshStandardMaterial({
        color: '#fafafa',
        roughness: 0.4,
      })),
      totemPlinth: assetCache.getMaterial('r5-totem-plinth', () => new THREE.MeshStandardMaterial({
        color: '#f0ede6',
        roughness: 0.6,
      })),
      graphicNavy: assetCache.getMaterial('r5-totem-navy', () => new THREE.MeshStandardMaterial({
        color: '#132c4a',
        roughness: 0.5,
      })),
      goldRing: assetCache.getMaterial('r5-totem-gold', () => new THREE.MeshStandardMaterial({
        color: C.gold,
        roughness: 0.35,
        metalness: 0.85,
      })),
    }
  }, [])

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover?.('totem-informasi')
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {/* 1. Undakan Plinth Melingkar di Bawah Pilar (Circular Seating Plinth) */}
      <mesh position={[0, 0.2, 0]} material={mats.totemPlinth}>
        <cylinderGeometry args={[radius * 2.1, radius * 2.2, 0.4, 32]} />
      </mesh>
      <mesh position={[0, 0.41, 0]} material={mats.goldRing}>
        <cylinderGeometry args={[radius * 2.12, radius * 2.12, 0.02, 32]} />
      </mesh>

      {/* 2. Tiang Kolom Silinder Utama */}
      <mesh position={[0, height / 2 + 0.4, 0]} material={mats.totemColumn}>
        <cylinderGeometry args={[radius, radius, height, 32]} />
      </mesh>

      {/* 3. Panel Grafis Biru Membungkus Sisi Depan Pilar */}
      <mesh position={[0, 2.2, radius + 0.01]}>
        <planeGeometry args={[1.1, 2.2]} />
        <primitive object={mats.graphicNavy} attach="material" />
      </mesh>

      {/* Tipografi Pada Totem */}
      <group position={[0, 2.5, radius + 0.025]}>
        <Text fontSize={0.08} color={C.brightGold} anchorX="center" anchorY="middle">
          UNIVERSITAS DIPONEGORO
        </Text>
        <Text position={[0, -0.18, 0]} fontSize={0.06} color="#ffffff" anchorX="center" anchorY="middle">
          UNDIP BERMARTABAT
        </Text>
        <Text position={[0, -0.32, 0]} fontSize={0.06} color="#ffffff" anchorX="center" anchorY="middle">
          UNDIP BERMANFAAT
        </Text>
        <Text position={[0, -0.65, 0]} fontSize={0.045} color={C.ivory} maxWidth={0.95} textAlign="center" anchorX="center" anchorY="middle">
          "Pusat keunggulan riset, inovasi teknologi, dan pendidikan karakter bangsa."
        </Text>
      </group>

      {/* Ring Mahkota Atas Pilar */}
      <mesh position={[0, height + 0.35, 0]} material={mats.goldRing}>
        <cylinderGeometry args={[radius * 1.25, radius * 1.25, 0.08, 32]} />
      </mesh>
    </group>
  )
}

/**
 * InteractiveDigitalTouchTable: Meja Sentuh Digital Interaktif Monolitik Putih (Foto 1)
 */
function InteractiveDigitalTouchTable({
  position,
  rotationY = 0,
  length = 5.6,
  width = 1.45,
  height = 0.88,
  onSelect,
  onHover,
}: {
  position: [number, number, number]
  rotationY?: number
  length?: number
  width?: number
  height?: number
  onSelect?: () => void
  onHover?: (id: string | null) => void
}) {
  const mats = useMemo(() => {
    return {
      tableWhite: assetCache.getMaterial('r5-table-white', () => new THREE.MeshStandardMaterial({
        color: C.pureWhite,
        roughness: 0.35,
        metalness: 0.1,
      })),
      glass: assetCache.getMaterial('r5-table-glass', () => new THREE.MeshStandardMaterial({
        color: C.glass,
        transparent: true,
        opacity: 0.32,
        roughness: 0.05,
        metalness: 0.2,
      })),
      screenSurface: assetCache.getMaterial('r5-screen-surface', () => new THREE.MeshStandardMaterial({
        color: C.screenBlue,
        emissive: C.screenGlow,
        emissiveIntensity: 0.85,
        roughness: 0.2,
      })),
      goldRim: assetCache.getMaterial('r5-gold-rim', () => new THREE.MeshStandardMaterial({
        color: C.gold,
        roughness: 0.3,
        metalness: 0.85,
      })),
    }
  }, [])

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover?.('digital-touch-table')
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {/* 1. Kaki Meja Monolitik Putih Solid Minimalis */}
      <mesh position={[0, height / 2, 0]} material={mats.tableWhite}>
        <boxGeometry args={[width, height, length]} />
      </mesh>
      {/* Aksen Lis Bawah Meja */}
      <mesh position={[0, 0.02, 0]} material={mats.goldRim}>
        <boxGeometry args={[width + 0.02, 0.04, length + 0.02]} />
      </mesh>

      {/* 2. Permukaan Layar Multi-Touch Digital Terintegrasi */}
      <mesh position={[0, height + 0.005, 0]} material={mats.screenSurface}>
        <boxGeometry args={[width - 0.16, 0.02, length - 0.24]} />
      </mesh>
      {/* Lapisan Pelindung Kaca Datar Anti-Glare */}
      <mesh position={[0, height + 0.018, 0]} material={mats.glass}>
        <boxGeometry args={[width - 0.12, 0.015, length - 0.2]} />
      </mesh>

      {/* 3. Panel Grafis Teks Interaktif Pada Meja Sentuh */}
      {[-1.8, -0.6, 0.6, 1.8].map((zPos, idx) => (
        <group key={zPos} position={[0, height + 0.026, zPos]}>
          <Text
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.062}
            color={C.brightGold}
            anchorX="center"
            anchorY="middle"
          >
            {idx === 0
              ? '✦ MAKET DIGITAL MULADI DOME ✦'
              : idx === 1
                ? '✦ LINIMASA WISUDA PERDANA 1962 ✦'
                : idx === 2
                  ? '✦ STATUTA PTN-BH UNDIP ✦'
                  : '✦ CAPAIAN QS WORLD RANKINGS ✦'}
          </Text>
          <Text
            position={[0, 0, 0.09]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.038}
            color={C.pureWhite}
            anchorX="center"
            anchorY="middle"
          >
            SENTUH UNTUK MEMBUKA ARSIP
          </Text>
        </group>
      ))}

      {/* Pendar Cahaya Biru Lembut Meja Sentuh */}
      <pointLight position={[0, height + 0.45, 0]} color="#b8d8ff" intensity={2.4} distance={4.8} decay={1.8} />
    </group>
  )
}

/**
 * ModernArchitecturalFinPortal: Portal Bersudut Modern & Baffle Fins di Belakang (Foto 1 & 3)
 */
function ModernArchitecturalFinPortal({
  length,
  halfWidth,
  muladiDome,
  onSelectHistory,
  onHover,
}: {
  length: number
  halfWidth: number
  muladiDome?: HistoryExhibit
  onSelectHistory: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
}) {
  const zBack = -length / 2

  const mats = useMemo(() => {
    return {
      portalNavy: assetCache.getMaterial('r5-portal-navy', () => new THREE.MeshStandardMaterial({
        color: C.portalNavy,
        roughness: 0.75,
      })),
      finDark: assetCache.getMaterial('r5-fin-dark', () => new THREE.MeshStandardMaterial({
        color: '#0d1824',
        roughness: 0.6,
        metalness: 0.5,
      })),
      mediaScreen: assetCache.getMaterial('r5-media-screen', () => new THREE.MeshStandardMaterial({
        color: '#0b192b',
        emissive: '#13355c',
        emissiveIntensity: 0.9,
        roughness: 0.2,
      })),
      goldTrim: assetCache.getMaterial('r5-portal-gold', () => new THREE.MeshStandardMaterial({
        color: C.gold,
        roughness: 0.35,
        metalness: 0.85,
      })),
      ledStrip: assetCache.getMaterial('r5-portal-led', () => new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#cbe3ff',
        emissiveIntensity: 4.5,
      })),
    }
  }, [])

  return (
    <group position={[0, 0, zBack]}>
      {/* 1. Dinding Belakang Navy Utama */}
      <mesh position={[0, 2.9, 0.02]} material={mats.portalNavy}>
        <planeGeometry args={[halfWidth * 2, 5.8]} />
      </mesh>

      {/* 2. Sayap Baffle Fins Vertikal di Sisi Kiri & Kanan Belakang (Foto 1) */}
      {[-6.2, -5.2, -4.2].map((fx, i) => (
        <group key={`l-fin-${i}`} position={[fx, 2.9, 0.45]} rotation={[0, 0.45, 0]}>
          <mesh material={mats.finDark}>
            <boxGeometry args={[0.14, 5.4, 0.85]} />
          </mesh>
          <mesh position={[0.075, 0, 0.42]} material={mats.ledStrip}>
            <boxGeometry args={[0.02, 5.4, 0.03]} />
          </mesh>
        </group>
      ))}
      {[4.2, 5.2, 6.2].map((fx, i) => (
        <group key={`r-fin-${i}`} position={[fx, 2.9, 0.45]} rotation={[0, -0.45, 0]}>
          <mesh material={mats.finDark}>
            <boxGeometry args={[0.14, 5.4, 0.85]} />
          </mesh>
          <mesh position={[-0.075, 0, 0.42]} material={mats.ledStrip}>
            <boxGeometry args={[0.02, 5.4, 0.03]} />
          </mesh>
        </group>
      ))}

      {/* 3. Portal Bersudut Arsitektural (Angled Arch Portal di Tengah) */}
      <group position={[0, 2.9, 0.25]}>
        {/* Balok Portal Atas */}
        <mesh position={[0, 2.4, 0]} material={mats.portalNavy}>
          <boxGeometry args={[7.8, 0.7, 0.4]} />
        </mesh>
        <mesh position={[0, 2.02, 0.21]} material={mats.goldTrim}>
          <boxGeometry args={[7.8, 0.04, 0.02]} />
        </mesh>

        {/* Tiang Portal Kiri & Kanan */}
        <mesh position={[-3.7, 0, 0]} material={mats.portalNavy}>
          <boxGeometry args={[0.55, 4.8, 0.4]} />
        </mesh>
        <mesh position={[3.7, 0, 0]} material={mats.portalNavy}>
          <boxGeometry args={[0.55, 4.8, 0.4]} />
        </mesh>

        {/* Layar Digital Raksasa Muladi Dome di Tengah Portal */}
        <mesh
          position={[0, 0, 0.05]}
          material={mats.mediaScreen}
          onClick={(e) => {
            e.stopPropagation()
            if (muladiDome) onSelectHistory(muladiDome)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            onHover?.('media-wall-muladi-dome')
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <boxGeometry args={[6.8, 4.0, 0.06]} />
        </mesh>

        {/* Header Teks Monumental Layar Media */}
        <group position={[0, 1.25, 0.12]}>
          <Text fontSize={0.24} color={C.brightGold} anchorX="center" anchorY="middle">
            GEDUNG MULADI DOME: MAHEKARYA ARSITEKTUR KAMPUS UNDIP
          </Text>
          <Text position={[0, -0.28, 0]} fontSize={0.14} color={C.ivory} anchorX="center" anchorY="middle">
            Convention &amp; Expo Hall Megah Penunjang Prestasi &amp; Wisuda Akbar
          </Text>
        </group>

        {/* Kutipan & Tombol Interaktif */}
        <group position={[0, -0.4, 0.12]}>
          <Text fontSize={0.12} color="#ffffff" maxWidth={6.2} textAlign="center" anchorX="center" anchorY="middle">
            Dinamai untuk menghormati Prof. Dr. Muladi, S.H. (Mantan Rektor Undip &amp; Menteri Kehakiman RI).{'\n'}
            Salah satu gedung serbaguna beratap kubah terbesar dan termodern di Asia Tenggara.
          </Text>
          <Text position={[0, -0.75, 0]} fontSize={0.11} color={C.brightGold} anchorX="center" anchorY="middle">
            ✦ KLIK LAYAR UNTUK DOKUMEN CETAK BIRU MULADI DOME ✦
          </Text>
        </group>
      </group>
    </group>
  )
}

/**
 * GalleryRoom05: Transformasi Total Ruang 05
 * "Institutional Legacy Gallery: Transformasi Institusi dan Masa Depan"
 * Sesuai foto referensi 1, 2, dan 3:
 * - Dinding Kiri: Pita Foto & Etalase Arsip Panoramik Berkelanjutan (Foto 1)
 * - Dinding Kanan: Niche Artefak Menyala Merah/Coral & Layar PTN-BH (Foto 3)
 * - Dinding Belakang: Portal Bersudut Arsitektural, Baffle Fins & Video Wall Muladi Dome (Foto 1 & 3)
 * - Koridor Tengah: Meja Sentuh Digital Interaktif Monolitik (Foto 1) & Bangku Pita Gelombang (Foto 3)
 * - Zona Depan: Pilar Totem Informasi Sirkular Bertingkat (Foto 2)
 * - Plafon: Strip Lampu LED Linier Modern Bersudut
 */
export function GalleryRoom05({
  histories,
  selectedHistoryId,
  hoveredId,
  isMobile = false,
  onSelectHistory,
  onHover,
  onExitRoom,
}: GalleryRoom05Props) {
  const roomW = 15.0
  const roomL = 18.0
  const roomH = 5.8
  const halfW = roomW / 2
  const zFront = roomL / 2
  const zBack = -roomL / 2

  // Ambil 3 data spesifik Ruang 05
  const muladiDome = useMemo(
    () => histories.find((h) => h.id === 'history-muladi-dome'),
    [histories],
  )
  const wisudaPerdana = useMemo(
    () => histories.find((h) => h.id === 'history-wisuda-perdana'),
    [histories],
  )
  const transformasiPtnBh = useMemo(
    () => histories.find((h) => h.id === 'history-transformation'),
    [histories],
  )

  const mats = useMemo(() => {
    return {
      floorTile: assetCache.getMaterial('r5-floor-tile', () => new THREE.MeshStandardMaterial({ color: C.floorLight, roughness: 0.55 })),
      ceilingLinear: assetCache.getMaterial('r5-ceiling-linear', () => new THREE.MeshStandardMaterial({ color: C.ceilingDark, roughness: 0.9 })),
      ledLinearStrip: assetCache.getMaterial('r5-led-linear', () => new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#e6f1ff',
        emissiveIntensity: 4.8,
      })),
      greigeWall: assetCache.getMaterial('r5-front-wall', () => new THREE.MeshStandardMaterial({ color: C.greige, roughness: 0.85 })),
      benchWhite: assetCache.getMaterial('r5-bench-white', () => new THREE.MeshStandardMaterial({ color: '#f8f8fa', roughness: 0.35 })),
    }
  }, [])

  return (
    <group>
      {/* 1. Lantai Ubin Arsitektur Terang Bersih (*Light Blond Architectural Tile*) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={mats.floorTile}>
        <planeGeometry args={[roomW, roomL]} />
      </mesh>

      {/* 2. Dinding Depan (Arah Pintu Keluar) */}
      <mesh position={[0, roomH / 2, zFront]} rotation={[0, Math.PI, 0]} material={mats.greigeWall}>
        <planeGeometry args={[roomW, roomH]} />
      </mesh>

      {/* 3. DINDING KIRI: Pita Foto & Etalase Arsip Panoramik Berkelanjutan (Foto 1) */}
      <PanoramicPhotoRibbon
        length={roomL}
        halfWidth={halfW}
        wisudaPerdana={wisudaPerdana}
        selectedHistoryId={selectedHistoryId}
        hoveredId={hoveredId}
        isMobile={isMobile}
        onSelectHistory={onSelectHistory}
        onHover={onHover}
      />

      {/* 4. DINDING KANAN: Relung Vertikal Menyala Merah/Coral & Layar PTN-BH (Foto 3) */}
      <IlluminatedArtifactNiches
        length={roomL}
        halfWidth={halfW}
        transformasiPtnBh={transformasiPtnBh}
        selectedHistoryId={selectedHistoryId}
        hoveredId={hoveredId}
        isMobile={isMobile}
        onSelectHistory={onSelectHistory}
        onHover={onHover}
      />

      {/* 5. DINDING BELAKANG: Portal Arsitektural Bersudut, Baffle Fins & Video Wall Muladi Dome (Foto 1 & 3) */}
      <ModernArchitecturalFinPortal
        length={roomL}
        halfWidth={halfW}
        muladiDome={muladiDome}
        onSelectHistory={onSelectHistory}
        onHover={onHover}
      />

      {/* 6. PILAR TOTEM INFORMASI SIRKULAR DI ZONA DEPAN (Foto 2) */}
      <RotundaInformationTotem
        position={[2.6, 0, 4.6]}
        radius={0.62}
        height={4.2}
        onHover={onHover}
      />

      {/* 7. KORIDOR TENGAH: Meja Sentuh Digital Interaktif Monolitik (Foto 1) */}
      <InteractiveDigitalTouchTable
        position={[-0.8, 0, -1.0]}
        rotationY={0}
        length={5.6}
        width={1.45}
        height={0.88}
        onSelect={() => {
          if (muladiDome) onSelectHistory(muladiDome)
        }}
        onHover={onHover}
      />

      {/* Bangku Pita Gelombang Modern dengan Pendar Cahaya Bawah (Foto 3) */}
      <group position={[2.8, 0, -1.0]}>
        <mesh position={[0, 0.46, 0]} material={mats.benchWhite}>
          <boxGeometry args={[0.9, 0.12, 5.2]} />
        </mesh>
        {[-1.8, 0, 1.8].map((bz, i) => (
          <mesh key={i} position={[0, 0.2, bz]} material={mats.benchWhite}>
            <boxGeometry args={[0.65, 0.4, 0.18]} />
          </mesh>
        ))}
        {/* Underglow Strip */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.7, 0.04, 4.8]} />
          <meshStandardMaterial color="#ffffff" emissive="#d4e8ff" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* 8. Plafon dengan Jalur Lampu LED Linier Kontemporer Bersudut (Foto 1 & 3) */}
      <mesh position={[0, roomH, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.ceilingLinear}>
        <planeGeometry args={[roomW, roomL]} />
      </mesh>
      {/* 4 Strip Lampu LED Linier Memanjang Bersudut di Plafon */}
      {[-4.2, -1.4, 1.4, 4.2].map((lx) => (
        <mesh key={lx} position={[lx, roomH - 0.02, 0]} material={mats.ledLinearStrip}>
          <boxGeometry args={[0.14, 0.04, roomL - 2.5]} />
        </mesh>
      ))}

      {/* 9. Pintu Keluar ke Base Zone (Dinding Depan) */}
      <PortalDoor
        id="exit-to-base-zone-05"
        doorNumber="KELUAR"
        title="Kembali ke Aula Utama"
        subtitle="Base Zone 1"
        position={[0, 0, zFront - 0.04]}
        rotationY={Math.PI}
        isHovered={hoveredId === 'exit-to-base-zone-05'}
        onSelect={onExitRoom}
        onHover={onHover}
        variant="exit"
      />

      {/* 10. Tata Cahaya Galeri Terang Netral & Teroptimasi 60 FPS */}
      <ambientLight color="#ffffff" intensity={1.35} />
      <directionalLight position={[0, roomH - 0.5, 2]} color="#eef5ff" intensity={0.65} />
      {!isMobile && (
        <>
          {/* Spotlight Fokus ke Digital Media Wall Muladi Dome */}
          <spotLight
            position={[0, roomH - 0.8, zBack + 4.5]}
            target-position={[0, 2.9, zBack]}
            color="#e8f3ff"
            intensity={14}
            angle={0.68}
            penumbra={0.55}
            decay={1.6}
            distance={14}
          />
          {/* Cahaya Wash Merata Sisi Kiri (Pita Foto) */}
          <pointLight position={[-halfW + 2.5, 3.8, 0]} color="#f2f8ff" intensity={4.5} distance={13} decay={1.6} />
          {/* Cahaya Wash Merata Sisi Kanan (Niche Merah & Layar PTN-BH) */}
          <pointLight position={[halfW - 2.5, 3.8, 0]} color="#fff3ea" intensity={4.5} distance={13} decay={1.6} />
        </>
      )}
    </group>
  )
}
