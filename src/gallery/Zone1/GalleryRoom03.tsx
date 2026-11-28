import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import type { Founder } from './data/exhibits'
import { FounderCard } from './FoundersWing'
import { PortalDoor } from './PortalDoor'
import { assetCache } from './cache'

interface GalleryRoom03Props {
  founders: Founder[]
  selectedFounderId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelectFounder: (founder: Founder) => void
  onHover: (id: string | null) => void
  onExitRoom: () => void
}

const C = {
  navy: '#192638',
  deepNavy: '#121c2b',
  ivory: '#E9E1D3',
  warmIvory: '#F5EEE4',
  taupe: '#655447',
  gold: '#B2935D',
  brightGold: '#d4af37',
  walnut: '#392D25',
  parquetFloor: '#2c1e15',
  ottomanNavy: '#1a2638',
  trackBlack: '#141414',
  warmLight: '#fff7e8',
}

/**
 * VelvetGalleryOttoman: Bangku Utsmaniyah Beludru Melengkung di Tengah Galeri Potret
 * Terinspirasi langsung dari foto referensi galeri potret nasional:
 * - Bentuk lonjong melengkung (*rounded rectangular ottoman*)
 * - Kain beludru Midnight Navy mewah (#1a2638)
 * - Lis piping kuningan emas di bagian bawah
 */
function VelvetGalleryOttoman({
  position,
  rotationY = 0,
  length = 2.4,
  width = 1.2,
  height = 0.52,
}: {
  position: [number, number, number]
  rotationY?: number
  length?: number
  width?: number
  height?: number
}) {
  const mats = useMemo(() => {
    return {
      velvet: assetCache.getMaterial('r3-ottoman-velvet', () => new THREE.MeshStandardMaterial({
        color: C.ottomanNavy,
        roughness: 0.85,
        metalness: 0.1,
      })),
      goldTrim: assetCache.getMaterial('r3-ottoman-gold', () => new THREE.MeshStandardMaterial({
        color: C.gold,
        roughness: 0.35,
        metalness: 0.85,
      })),
      basePlinth: assetCache.getMaterial('r3-ottoman-base', () => new THREE.MeshStandardMaterial({
        color: '#121418',
        roughness: 0.7,
      })),
    }
  }, [])

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Plinth Dasar Kaki Gelap */}
      <mesh position={[0, 0.04, 0]} material={mats.basePlinth}>
        <boxGeometry args={[width - 0.08, 0.08, length - 0.08]} />
      </mesh>
      {/* Lis Aksen Emas Bawah */}
      <mesh position={[0, 0.08, 0]} material={mats.goldTrim}>
        <boxGeometry args={[width - 0.04, 0.02, length - 0.04]} />
      </mesh>

      {/* 2. Bantalan Duduk Beludru Lonjong */}
      <mesh position={[0, height / 2 + 0.06, 0]} material={mats.velvet}>
        <boxGeometry args={[width, height - 0.08, length]} />
      </mesh>

      {/* 3. Rounded End Caps di Kedua Ujung (Silinder setengah) */}
      <mesh position={[0, height / 2 + 0.06, length / 2]} material={mats.velvet}>
        <cylinderGeometry args={[width / 2, width / 2, height - 0.08, 24]} />
      </mesh>
      <mesh position={[0, height / 2 + 0.06, -length / 2]} material={mats.velvet}>
        <cylinderGeometry args={[width / 2, width / 2, height - 0.08, 24]} />
      </mesh>

      {/* Lis Pipit Emas di Sepanjang Keliling Bawah Bantalan */}
      <mesh position={[0, 0.16, 0]} material={mats.goldTrim}>
        <boxGeometry args={[width + 0.02, 0.015, length + 0.02]} />
      </mesh>
    </group>
  )
}

/**
 * RectangularSuspendedLightRig: Kerangka Lampu Trek Gantung Hitam Minimalis
 * Persis seperti di foto referensi:
 * - Rangka persegi panjang hitam matte tersuspensi dari plafon
 * - Lampu kanister spotlight fokus yang menyorot ke dinding potret
 */
function RectangularSuspendedLightRig({
  position,
  length = 7.0,
  width = 3.6,
}: {
  position: [number, number, number]
  length?: number
  width?: number
}) {
  const mats = useMemo(() => {
    return {
      frame: assetCache.getMaterial('r3-rig-frame', () => new THREE.MeshStandardMaterial({
        color: C.trackBlack,
        roughness: 0.45,
        metalness: 0.8,
      })),
      lens: assetCache.getMaterial('r3-rig-lens', () => new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#fff4dc',
        emissiveIntensity: 4.5,
      })),
    }
  }, [])

  return (
    <group position={position}>
      {/* 4 Kabel Suspensi Halus ke Plafon */}
      {[-width / 2, width / 2].map((x, xi) =>
        [-length / 2, length / 2].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, 0.6, z]}>
            <cylinderGeometry args={[0.005, 0.005, 1.2, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.9} />
          </mesh>
        )),
      )}

      {/* Rangka Trek Persegi Panjang */}
      {/* Batang Panjang Kiri & Kanan */}
      <mesh position={[-width / 2, 0, 0]} material={mats.frame}>
        <boxGeometry args={[0.08, 0.08, length]} />
      </mesh>
      <mesh position={[width / 2, 0, 0]} material={mats.frame}>
        <boxGeometry args={[0.08, 0.08, length]} />
      </mesh>
      {/* Batang Pendek Depan & Belakang */}
      <mesh position={[0, 0, -length / 2]} material={mats.frame}>
        <boxGeometry args={[width, 0.08, 0.08]} />
      </mesh>
      <mesh position={[0, 0, length / 2]} material={mats.frame}>
        <boxGeometry args={[width, 0.08, 0.08]} />
      </mesh>

      {/* Spotlights Canister Mengarah ke Dinding Potret */}
      {[-2.4, -0.8, 0.8, 2.4].map((z, i) => (
        <group key={`l-spot-${i}`} position={[-width / 2, -0.1, z]} rotation={[0, 0, -0.35]}>
          <mesh material={mats.frame}>
            <cylinderGeometry args={[0.06, 0.08, 0.16, 16]} />
          </mesh>
          <mesh position={[0, -0.09, 0]} material={mats.lens}>
            <circleGeometry args={[0.055, 16]} />
          </mesh>
        </group>
      ))}
      {[-2.4, -0.8, 0.8, 2.4].map((z, i) => (
        <group key={`r-spot-${i}`} position={[width / 2, -0.1, z]} rotation={[0, 0, 0.35]}>
          <mesh material={mats.frame}>
            <cylinderGeometry args={[0.06, 0.08, 0.16, 16]} />
          </mesh>
          <mesh position={[0, -0.09, 0]} material={mats.lens}>
            <circleGeometry args={[0.055, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * InteractiveRectorDirectoryKiosk: Konsol Digital Interaktif Biografi 13 Rektor
 * Memungkinkan pengunjung menelusuri rekam jejak, masa bakti, dan kutipan para rektor.
 */
function InteractiveRectorDirectoryKiosk({
  position,
  rotationY = 0,
  onHover,
}: {
  position: [number, number, number]
  rotationY?: number
  onHover?: (id: string | null) => void
}) {
  const mats = useMemo(() => {
    return {
      walnut: assetCache.getMaterial('kiosk3-walnut', () => new THREE.MeshStandardMaterial({ color: C.walnut, roughness: 0.65 })),
      goldTrim: assetCache.getMaterial('kiosk3-gold', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.3, metalness: 0.85 })),
      screenGlow: assetCache.getMaterial('kiosk3-screen', () => new THREE.MeshStandardMaterial({
        color: '#132233',
        emissive: '#182b42',
        emissiveIntensity: 0.7,
        roughness: 0.2,
      })),
    }
  }, [])

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover?.('kiosk-rector-directory')
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {/* 1. Pedestal Kayu Walnut & Trim Emas */}
      <mesh position={[0, 0.5, 0]} material={mats.walnut}>
        <boxGeometry args={[1.5, 1.0, 0.5]} />
      </mesh>
      <mesh position={[0, 0.98, 0]} material={mats.goldTrim}>
        <boxGeometry args={[1.54, 0.04, 0.54]} />
      </mesh>

      {/* 2. Layar Konsol Miring */}
      <group position={[0, 1.12, 0.06]} rotation={[-0.45, 0, 0]}>
        <mesh material={mats.walnut}>
          <boxGeometry args={[1.44, 0.85, 0.08]} />
        </mesh>
        <mesh position={[0, 0, 0.045]} material={mats.goldTrim}>
          <boxGeometry args={[1.4, 0.81, 0.02]} />
        </mesh>
        <mesh position={[0, 0, 0.056]} material={mats.screenGlow}>
          <planeGeometry args={[1.34, 0.75]} />
        </mesh>

        <Text position={[0, 0.26, 0.06]} fontSize={0.065} color={C.gold} anchorX="center" anchorY="middle">
          DIREKTORI JEJAK KEPEMIMPINAN 13 REKTOR UNDIP
        </Text>
        <Text position={[0, 0.14, 0.06]} fontSize={0.045} color={C.ivory} anchorX="center" anchorY="middle">
          1957 — Sekarang • Dari Pleburan Menuju Reputasi Dunia
        </Text>
        <Text position={[0, -0.04, 0.06]} fontSize={0.038} color="#ffffff" maxWidth={1.22} textAlign="center" anchorX="center" anchorY="middle">
          "Kepemimpinan akademik berintegritas, berwawasan kelautan, dan humanis untuk kemajuan peradaban bangsa."
        </Text>
        <Text position={[0, -0.22, 0.06]} fontSize={0.036} color={C.brightGold} anchorX="center" anchorY="middle">
          ✦ KLIK SALAH SATU POTRET DI DINDING UNTUK PROFIL LENGKAP ✦
        </Text>
      </group>

      <pointLight position={[0, 1.3, 0.3]} color="#ffe9be" intensity={1.5} distance={3.0} decay={2.0} />
    </group>
  )
}

/**
 * GalleryRoom03: Transformasi Lengkap Ruang 03 menjadi
 * "Academic Figures Gallery: Galeri Rektorat & Pimpinan (13 Rektor Undip dari Masa ke Masa)"
 * Mengadopsi arsitektur galeri potret megah melengkung (Rotunda Portrait Gallery) dari referensi:
 * - Dinding lengkung/fasad simetris Midnight Prussian Navy (#192638)
 * - Lantai kayu parket gelap mewah dipadu lis marmer pembatas
 * - Sumbu tengah: Sepasang Sofa Utsmaniyah Beludru Navy (*velvet gallery ottomans*) & Kios Interaktif
 * - Dinding Belakang (Apse Rotunda): 3 Rektor Utama Penataan & Transisi Monumental (Ukuran frame lebih besar)
 * - Dinding Kiri: Era Perintisan & Pemantapan Awal (Mr. Imam Bardjo s.d. Prof. Suroyo)
 * - Dinding Kanan: Era Modernisasi, PTN-BH & Keberlanjutan (Prof. Susilo Wibowo s.d. Prof. Suharnomo)
 * - Pencahayaan: Suspended rectangular track lighting & sconce terarah pada tiap potret
 */
export function GalleryRoom03({
  founders,
  selectedFounderId,
  hoveredId,
  isMobile = false,
  onSelectFounder,
  onHover,
  onExitRoom,
}: GalleryRoom03Props) {
  const roomW = 16.0
  const roomL = 17.0
  const roomH = 5.8
  const halfW = roomW / 2
  const zFront = roomL / 2
  const zBack = -roomL / 2

  // Pembagian 13 Rektor berdasarkan hierarki & era sejarah:
  // 1. Dinding Kiri (5 Rektor Perintisan 1957-1977):
  //    Imam Bardjo, Jakub Rais, Mochtar, Sunario, Suroyo
  // 2. Dinding Belakang / Apse Rotunda (3 Rektor Monumental):
  //    Prof. Soedarto (Ketua Yayasan/Rektor Peletak Fondasi), Prof. Moeljono (Pelopor Tembalang), Prof. Muladi (Menteri Kehakiman/Guru Besar)
  // 3. Dinding Kanan (5 Rektor Modern & Kontemporer 1998-sekarang):
  //    Eko Budihardjo, Susilo Wibowo, Sudharto Hadi, Yos Johan Utama, Suharnomo
  const leftWingFounders = useMemo(() => {
    const ids = ['prof-mr-imam-bardjo', 'prof-jakub-rais', 'mochtar', 'prof-mr-sunario', 'prof-suroyo']
    return ids.map((id) => founders.find((f) => f.id === id)).filter((f): f is Founder => Boolean(f))
  }, [founders])

  const rearApseFounders = useMemo(() => {
    const ids = ['prof-soedarto', 'prof-moeljono', 'prof-muladi']
    return ids.map((id) => founders.find((f) => f.id === id)).filter((f): f is Founder => Boolean(f))
  }, [founders])

  const rightWingFounders = useMemo(() => {
    const ids = ['prof-eko-budihardjo', 'prof-susilo-wibowo', 'prof-sudharto', 'prof-yos-johan-utama', 'prof-suharnomo']
    return ids.map((id) => founders.find((f) => f.id === id)).filter((f): f is Founder => Boolean(f))
  }, [founders])

  const mats = useMemo(() => {
    return {
      navyWall: assetCache.getMaterial('r3-navy-wall', () => new THREE.MeshStandardMaterial({ color: C.navy, roughness: 0.88 })),
      deepNavyApse: assetCache.getMaterial('r3-deep-apse', () => new THREE.MeshStandardMaterial({ color: C.deepNavy, roughness: 0.85 })),
      ivoryCornice: assetCache.getMaterial('r3-ivory-cornice', () => new THREE.MeshStandardMaterial({ color: C.ivory, roughness: 0.7 })),
      goldTrim: assetCache.getMaterial('r3-gold-trim', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.35, metalness: 0.85 })),
      walnutWainscot: assetCache.getMaterial('r3-walnut-wainscot', () => new THREE.MeshStandardMaterial({ color: C.walnut, roughness: 0.75 })),
      parquetFloor: assetCache.getMaterial('r3-parquet-floor', () => new THREE.MeshStandardMaterial({ color: C.parquetFloor, roughness: 0.65 })),
      ceilingSurface: assetCache.getMaterial('r3-ceiling', () => new THREE.MeshStandardMaterial({ color: '#16191f', roughness: 0.9 })),
    }
  }, [])

  return (
    <group>
      {/* 1. Lantai Kayu Parket Gelap Mewah */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={mats.parquetFloor}>
        <planeGeometry args={[roomW, roomL]} />
      </mesh>

      {/* Lis Tepi Marmer Travertine Pembatas Lantai */}
      <mesh position={[-halfW + 0.15, 0.01, 0]} material={mats.ivoryCornice}>
        <boxGeometry args={[0.3, 0.02, roomL]} />
      </mesh>
      <mesh position={[halfW - 0.15, 0.01, 0]} material={mats.ivoryCornice}>
        <boxGeometry args={[0.3, 0.02, roomL]} />
      </mesh>

      {/* 2. Dinding Utama Midnight Prussian Navy */}
      {/* Dinding Kiri */}
      <mesh position={[-halfW, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.navyWall}>
        <planeGeometry args={[roomL, roomH]} />
      </mesh>
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

      {/* 3. DINDING BELAKANG: Apse Melengkung / Fasad Monumental Rotunda */}
      <group position={[0, 0, zBack]}>
        {/* Dinding Latar Apse */}
        <mesh position={[0, roomH / 2, 0]} material={mats.deepNavyApse}>
          <planeGeometry args={[roomW, roomH]} />
        </mesh>
        {/* Wainscoting Apse Belakang */}
        <mesh position={[0, 0.6, 0.04]} material={mats.walnutWainscot}>
          <boxGeometry args={[roomW, 1.2, 0.06]} />
        </mesh>
        <mesh position={[0, 1.22, 0.08]} material={mats.goldTrim}>
          <boxGeometry args={[roomW, 0.04, 0.03]} />
        </mesh>

        {/* Banner Header Monumental Apse Belakang */}
        <group position={[0, 4.7, 0.15]}>
          <mesh material={mats.deepNavyApse}>
            <boxGeometry args={[roomW - 3.0, 0.6, 0.08]} />
          </mesh>
          <mesh position={[0, 0.32, 0.04]} material={mats.goldTrim}>
            <boxGeometry args={[roomW - 2.8, 0.04, 0.02]} />
          </mesh>
          <mesh position={[0, -0.32, 0.04]} material={mats.goldTrim}>
            <boxGeometry args={[roomW - 2.8, 0.04, 0.02]} />
          </mesh>
          <Text position={[0, 0, 0.06]} fontSize={0.28} color={C.gold} anchorX="center" anchorY="middle">
            GALERI REKTORAT &amp; KEPEMIMPINAN AKADEMIK UNIVERSITAS DIPONEGORO
          </Text>
        </group>

        {/* 3 Potret Utama Rektor Penataan & Transisi Monumental */}
        {rearApseFounders.map((rector, idx) => {
          const rx = (idx - 1) * 3.6
          return (
            <FounderCard
              key={rector.id}
              founder={rector}
              index={idx}
              position={[rx, 2.5, 0.12]}
              rotationY={0}
              isMainFounder={true}
              isSelected={selectedFounderId === rector.id}
              isHovered={hoveredId === rector.id}
              isMobile={isMobile}
              onSelect={onSelectFounder}
              onHover={onHover}
            />
          )
        })}
      </group>

      {/* 4. DINDING KIRI: 5 Rektor Perintisan & Pemantapan (1957–1977) */}
      <group>
        {/* Banner Dinding Kiri */}
        <group position={[-halfW + 0.15, 4.4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh material={mats.navyWall}>
            <boxGeometry args={[roomL - 4, 0.52, 0.06]} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.24} color={C.gold} anchorX="center" anchorY="middle">
            ERA PERINTISAN &amp; PEMANTAPAN AKADEMIK (1957–1977)
          </Text>
        </group>

        {leftWingFounders.map((rector, idx) => {
          const itemZ = -zFront + 3.2 + idx * 2.6
          return (
            <FounderCard
              key={rector.id}
              founder={rector}
              index={idx + 3}
              position={[-halfW + 0.08, 2.5, itemZ]}
              rotationY={Math.PI / 2}
              isMainFounder={false}
              isSelected={selectedFounderId === rector.id}
              isHovered={hoveredId === rector.id}
              isMobile={isMobile}
              onSelect={onSelectFounder}
              onHover={onHover}
            />
          )
        })}
      </group>

      {/* 5. DINDING KANAN: 5 Rektor Modernisasi & Keberlanjutan (1998–sekarang) */}
      <group>
        {/* Banner Dinding Kanan */}
        <group position={[halfW - 0.15, 4.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh material={mats.navyWall}>
            <boxGeometry args={[roomL - 4, 0.52, 0.06]} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.24} color={C.gold} anchorX="center" anchorY="middle">
            ERA REPUTASI GLOBAL, PTN-BH &amp; KEBERLANJUTAN (1998–SEKARANG)
          </Text>
        </group>

        {rightWingFounders.map((rector, idx) => {
          const itemZ = -zFront + 3.2 + idx * 2.6
          return (
            <FounderCard
              key={rector.id}
              founder={rector}
              index={idx + 8}
              position={[halfW - 0.08, 2.5, itemZ]}
              rotationY={-Math.PI / 2}
              isMainFounder={false}
              isSelected={selectedFounderId === rector.id}
              isHovered={hoveredId === rector.id}
              isMobile={isMobile}
              onSelect={onSelectFounder}
              onHover={onHover}
            />
          )
        })}
      </group>

      {/* 6. PUSAT KORIDOR: Sepasang Sofa Utsmaniyah Beludru & Kios Direktori */}
      <VelvetGalleryOttoman
        position={[0, 0, -2.6]}
        rotationY={0}
        length={2.8}
        width={1.3}
        height={0.52}
      />
      <VelvetGalleryOttoman
        position={[0, 0, 1.2]}
        rotationY={0}
        length={2.8}
        width={1.3}
        height={0.52}
      />

      {/* Kios Direktori Digital Rekam Jejak 13 Rektor */}
      <InteractiveRectorDirectoryKiosk
        position={[0, 0, 4.4]}
        rotationY={0}
        onHover={onHover}
      />

      {/* 7. Plafon Elegan & Suspended Track Light Rig */}
      <mesh position={[0, roomH, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.ceilingSurface}>
        <planeGeometry args={[roomW, roomL]} />
      </mesh>
      {/* Cornice Sepanjang Sisi Kiri & Kanan */}
      <mesh position={[-halfW + 0.35, roomH - 0.2, 0]} material={mats.ivoryCornice}>
        <boxGeometry args={[0.7, 0.4, roomL]} />
      </mesh>
      <mesh position={[halfW - 0.35, roomH - 0.2, 0]} material={mats.ivoryCornice}>
        <boxGeometry args={[0.7, 0.4, roomL]} />
      </mesh>

      {/* Suspended Light Rig di Plafon (Sesuai Foto Referensi) */}
      <RectangularSuspendedLightRig
        position={[0, roomH - 1.1, -0.6]}
        length={7.6}
        width={4.2}
      />

      {/* 8. Pintu Keluar ke Base Zone (Dinding Depan) */}
      <PortalDoor
        id="exit-to-base-zone-03"
        doorNumber="KELUAR"
        title="Kembali ke Aula Utama"
        subtitle="Base Zone 1"
        position={[0, 0, zFront - 0.04]}
        rotationY={Math.PI}
        isHovered={hoveredId === 'exit-to-base-zone-03'}
        onSelect={onExitRoom}
        onHover={onHover}
        variant="exit"
      />

      {/* 9. Pencahayaan Teroptimasi 60 FPS (Consolidated Wall-Wash & Picture Lights) */}
      <ambientLight color="#fff7ec" intensity={1.35} />
      <directionalLight position={[0, roomH - 0.5, 2]} color="#fffcf2" intensity={0.65} />
      {!isMobile && (
        <>
          {/* Cahaya Lembut Terarah Merata untuk Dinding Belakang (Apse) */}
          <pointLight position={[0, 4.4, zBack + 2.0]} color="#fff0d0" intensity={6.5} distance={12} decay={1.5} />
          {/* Cahaya Sorot Merata untuk Deretan Dinding Kiri (5 Rektor Perintisan) */}
          <pointLight position={[-halfW + 1.8, 3.6, -1.5]} color="#fff0d0" intensity={6.0} distance={12} decay={1.5} />
          <pointLight position={[-halfW + 1.8, 3.6, 2.5]} color="#fff0d0" intensity={6.0} distance={12} decay={1.5} />
          {/* Cahaya Sorot Merata untuk Deretan Dinding Kanan (5 Rektor Modern) */}
          <pointLight position={[halfW - 1.8, 3.6, -1.5]} color="#fff0d0" intensity={6.0} distance={12} decay={1.5} />
          <pointLight position={[halfW - 1.8, 3.6, 2.5]} color="#fff0d0" intensity={6.0} distance={12} decay={1.5} />
        </>
      )}
    </group>
  )
}
