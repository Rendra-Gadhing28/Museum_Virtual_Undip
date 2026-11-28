import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import type { HistoryExhibit } from './data/exhibits'
import { SalonItem } from './HistoryArchivesWing'
import { PortalDoor } from './PortalDoor'
import { assetCache } from './cache'

interface GalleryRoom04Props {
  histories: HistoryExhibit[]
  selectedHistoryId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelectHistory: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
  onExitRoom: () => void
}

const C = {
  greige: '#B8AA96',
  warmIvory: '#ECE6DC',
  lightWall: '#F4EFE6',
  navy: '#23364F',
  deepNavy: '#172435',
  gold: '#B2935D',
  brightGold: '#d4af37',
  pedestalBlack: '#1c1c1c',
  floorLightOak: '#cfc4b2',
  glass: '#d6edf0',
  gridBlack: '#141414',
  modelWhite: '#fafafa',
  modelRoof: '#eceae6',
}

/**
 * ArchitecturalMaquettePedestal: Meja Pedestal Maket Arsitektur Kampus
 * Persis seperti foto referensi pameran arsitektur museum:
 * - Pedestal hitam solid minimalis (*matte black exhibition plinth*)
 * - Tudung kaca kubus transparan museum
 * - Maket arsitektur putih bersih (*white architectural massing model*)
 * - Plakat label tipografi di tepi kaca
 */
function ArchitecturalMaquettePedestal({
  position,
  rotationY = 0,
  title,
  subtitle,
  modelType = 'widya-puraya',
  isSelected = false,
  isHovered = false,
  onClick,
  onHover,
}: {
  position: [number, number, number]
  rotationY?: number
  title: string
  subtitle: string
  modelType?: 'pleburan' | 'widya-puraya' | 'rsnd-waduk'
  isSelected?: boolean
  isHovered?: boolean
  onClick?: () => void
  onHover?: (id: string | null) => void
}) {
  const mats = useMemo(() => {
    return {
      blackPlinth: assetCache.getMaterial('r4-plinth-black', () => new THREE.MeshStandardMaterial({
        color: C.pedestalBlack,
        roughness: 0.85,
        metalness: 0.1,
      })),
      goldTrim: assetCache.getMaterial('r4-plinth-gold', () => new THREE.MeshStandardMaterial({
        color: C.gold,
        roughness: 0.35,
        metalness: 0.85,
      })),
      glass: assetCache.getMaterial('r4-vit-glass', () => new THREE.MeshStandardMaterial({
        color: C.glass,
        transparent: true,
        opacity: 0.25,
        roughness: 0.05,
        metalness: 0.1,
      })),
      modelBase: assetCache.getMaterial('r4-model-base', () => new THREE.MeshStandardMaterial({
        color: '#f0ede6',
        roughness: 0.9,
      })),
      modelWhite: assetCache.getMaterial('r4-model-white', () => new THREE.MeshStandardMaterial({
        color: C.modelWhite,
        roughness: 0.8,
      })),
      modelRoof: assetCache.getMaterial('r4-model-roof', () => new THREE.MeshStandardMaterial({
        color: C.modelRoof,
        roughness: 0.75,
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
        onHover?.(title)
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {/* 1. Pedestal Hitam Minimalis */}
      <mesh position={[0, 0.42, 0]} material={mats.blackPlinth}>
        <boxGeometry args={[1.7, 0.84, 1.5]} />
      </mesh>
      {/* Garis Aksen Emas Bawah */}
      <mesh position={[0, 0.845, 0]} material={mats.goldTrim}>
        <boxGeometry args={[1.72, 0.015, 1.52]} />
      </mesh>

      {/* 2. Pelat Dasar Maket Arsitektur */}
      <mesh position={[0, 0.865, 0]} material={mats.modelBase}>
        <boxGeometry args={[1.6, 0.025, 1.4]} />
      </mesh>

      {/* 3. Maket Arsitektur 3D Berdasarkan Jenis Bangunan */}
      <group position={[0, 0.88, 0]}>
        {modelType === 'pleburan' && (
          /* Maket Kampus Pleburan: Bangunan Beratap Pelana Tropis & Koridor */
          <group>
            {/* Bangunan Utama Kiri */}
            <mesh position={[-0.32, 0.1, -0.1]} material={mats.modelWhite}>
              <boxGeometry args={[0.55, 0.2, 0.75]} />
            </mesh>
            <mesh position={[-0.32, 0.25, -0.1]} rotation={[0, 0, 0]} material={mats.modelRoof}>
              <coneGeometry args={[0.38, 0.14, 4]} />
            </mesh>

            {/* Bangunan Sayap Kanan */}
            <mesh position={[0.32, 0.1, 0.1]} material={mats.modelWhite}>
              <boxGeometry args={[0.55, 0.2, 0.65]} />
            </mesh>
            <mesh position={[0.32, 0.25, 0.1]} material={mats.modelRoof}>
              <coneGeometry args={[0.36, 0.14, 4]} />
            </mesh>

            {/* Koridor Penghubung */}
            <mesh position={[0, 0.06, 0]} material={mats.modelWhite}>
              <boxGeometry args={[0.25, 0.12, 0.2]} />
            </mesh>
          </group>
        )}

        {modelType === 'widya-puraya' && (
          /* Maket Menara Rektorat Widya Puraya Tembalang */
          <group>
            {/* Podium Gedung Rektorat Bertingkat */}
            <mesh position={[0, 0.08, 0]} material={mats.modelWhite}>
              <boxGeometry args={[1.1, 0.16, 0.9]} />
            </mesh>
            <mesh position={[0, 0.2, 0]} material={mats.modelWhite}>
              <boxGeometry args={[0.85, 0.1, 0.7]} />
            </mesh>

            {/* Menara Jam Pusat Ikonik Widya Puraya */}
            <mesh position={[0, 0.38, 0]} material={mats.modelWhite}>
              <boxGeometry args={[0.26, 0.32, 0.26]} />
            </mesh>
            {/* Atap Limas Emas Khas Widya Puraya */}
            <mesh position={[0, 0.58, 0]} rotation={[0, Math.PI / 4, 0]} material={mats.goldTrim}>
              <coneGeometry args={[0.24, 0.18, 4]} />
            </mesh>
          </group>
        )}

        {modelType === 'rsnd-waduk' && (
          /* Maket Kompleks RSND & Waduk Pendidikan */
          <group>
            {/* Blok Rumah Sakit Modern */}
            <mesh position={[-0.35, 0.14, -0.1]} material={mats.modelWhite}>
              <boxGeometry args={[0.5, 0.28, 0.8]} />
            </mesh>
            <mesh position={[-0.35, 0.3, -0.1]} material={mats.modelRoof}>
              <boxGeometry args={[0.42, 0.04, 0.72]} />
            </mesh>

            {/* Danau / Waduk Retensi Undip (Biru Kehijauan Konservasi) */}
            <mesh position={[0.35, 0.02, 0.1]}>
              <cylinderGeometry args={[0.38, 0.38, 0.03, 24]} />
              <meshStandardMaterial color="#306b7a" roughness={0.2} metalness={0.6} />
            </mesh>
            {/* Jembatan Ikonik Waduk */}
            <mesh position={[0.35, 0.045, 0.1]}>
              <boxGeometry args={[0.1, 0.02, 0.78]} />
              <meshStandardMaterial color={C.modelWhite} />
            </mesh>
          </group>
        )}
      </group>

      {/* 4. Tudung Kaca Kubus Minimalis */}
      <mesh position={[0, 1.18, 0]} material={mats.glass}>
        <boxGeometry args={[1.64, 0.62, 1.44]} />
      </mesh>

      {/* 5. Plakat Label Tipografi di Kaki Pedestal */}
      <group position={[0, 0.85, 0.76]}>
        <mesh material={mats.blackPlinth}>
          <boxGeometry args={[1.3, 0.2, 0.02]} />
        </mesh>
        <Text position={[0, 0.04, 0.015]} fontSize={0.045} color={isSelected || isHovered ? C.brightGold : C.gold} anchorX="center" anchorY="middle">
          {title}
        </Text>
        <Text position={[0, -0.04, 0.015]} fontSize={0.034} color="#d4cec5" anchorX="center" anchorY="middle">
          {subtitle}
        </Text>
      </group>

      {/* Pendar Lampu LED Dalam Maket */}
      <pointLight position={[0, 1.25, 0]} color="#fff7e4" intensity={1.8} distance={3.2} decay={2.0} />
    </group>
  )
}

/**
 * GalleryRoom04: Transformasi Total Ruang 04
 * "Architectural Evolution Gallery: Transformasi Kampus Fisik (Pleburan ke Tembalang)"
 * Mengadopsi arsitektur galeri museum kontemporer persis foto referensi:
 * - Plafon kisi-kisi industri modern (*exposed dark mesh grid ceiling*) dengan track spotlights
 * - Lantai kayu ek terang (*light oak flooring*)
 * - Dinding minimalis Warm Greige & Warm Ivory
 * - Pita gambar arsitektur horizontal (*panoramic blueprint ribbon*) di sepanjang dinding
 * - 3 unit meja pedestal maket arsitektur putih di koridor tengah (Pleburan, Widya Puraya, RSND/Waduk)
 * - Dinding Belakang: Masterplan & Garis Waktu Transformasi Kampus Tembalang 212 Hektare
 */
export function GalleryRoom04({
  histories,
  selectedHistoryId,
  hoveredId,
  isMobile = false,
  onSelectHistory,
  onHover,
  onExitRoom,
}: GalleryRoom04Props) {
  const roomW = 17.0
  const roomL = 19.0
  const roomH = 5.8
  const halfW = roomW / 2
  const zFront = roomL / 2
  const zBack = -roomL / 2

  // Pengelompokan 6 Koleksi Sejarah Transformasi Fisik
  const leftExhibits = useMemo(
    () => histories.filter((h) => h.id === 'early-campus-pleburan' || h.id === 'history-groundbreaking-tembalang' || h.id === 'history-masterplan-tembalang'),
    [histories],
  )
  const rightExhibits = useMemo(
    () => histories.filter((h) => h.id === 'history-widya-puraya' || h.id === 'history-rsnd' || h.id === 'history-waduk-undip'),
    [histories],
  )

  const mats = useMemo(() => {
    return {
      lightWall: assetCache.getMaterial('r4-light-wall', () => new THREE.MeshStandardMaterial({ color: C.lightWall, roughness: 0.88 })),
      greigePanel: assetCache.getMaterial('r4-greige-panel', () => new THREE.MeshStandardMaterial({ color: C.greige, roughness: 0.85 })),
      floorOak: assetCache.getMaterial('r4-floor-oak', () => new THREE.MeshStandardMaterial({ color: C.floorLightOak, roughness: 0.65 })),
      gridCeiling: assetCache.getMaterial('r4-grid-ceiling', () => new THREE.MeshStandardMaterial({ color: C.gridBlack, roughness: 0.95, wireframe: true })),
      ceilingBack: assetCache.getMaterial('r4-ceiling-back', () => new THREE.MeshStandardMaterial({ color: '#16181c', roughness: 0.9 })),
      blueprintRibbon: assetCache.getMaterial('r4-blueprint-ribbon', () => new THREE.MeshStandardMaterial({ color: '#f7f4ed', roughness: 0.7 })),
      goldTrim: assetCache.getMaterial('r4-gold-trim', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.35, metalness: 0.85 })),
      navyRibbon: assetCache.getMaterial('r4-navy-ribbon', () => new THREE.MeshStandardMaterial({ color: C.deepNavy, roughness: 0.8 })),
    }
  }, [])

  return (
    <group>
      {/* 1. Lantai Kayu Ek Terang Bersih (*Light Blond Oak*) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={mats.floorOak}>
        <planeGeometry args={[roomW, roomL]} />
      </mesh>

      {/* 2. Dinding Galeri Kontemporer Warm Greige & Ivory */}
      {/* Dinding Kiri */}
      <mesh position={[-halfW, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.lightWall}>
        <planeGeometry args={[roomL, roomH]} />
      </mesh>
      {/* Dinding Kanan */}
      <mesh position={[halfW, roomH / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={mats.lightWall}>
        <planeGeometry args={[roomL, roomH]} />
      </mesh>
      {/* Dinding Depan (Arah Pintu Keluar) */}
      <mesh position={[0, roomH / 2, zFront]} rotation={[0, Math.PI, 0]} material={mats.lightWall}>
        <planeGeometry args={[roomW, roomH]} />
      </mesh>

      {/* 3. DINDING BELAKANG: Masterplan Kawasan Kampus Tembalang (212 Hektar) */}
      <group position={[0, 0, zBack]}>
        <mesh position={[0, roomH / 2, 0]} material={mats.greigePanel}>
          <planeGeometry args={[roomW, roomH]} />
        </mesh>

        {/* Panel Peta Masterplan Raksasa di Dinding Belakang */}
        <mesh position={[0, 3.2, 0.08]} material={mats.blueprintRibbon}>
          <boxGeometry args={[roomW - 3.2, 2.8, 0.04]} />
        </mesh>
        <mesh position={[0, 4.62, 0.11]} material={mats.goldTrim}>
          <boxGeometry args={[roomW - 3.2, 0.04, 0.02]} />
        </mesh>
        <mesh position={[0, 1.78, 0.11]} material={mats.goldTrim}>
          <boxGeometry args={[roomW - 3.2, 0.04, 0.02]} />
        </mesh>

        {/* Header Teks Masterplan */}
        <group position={[0, 4.15, 0.14]}>
          <Text fontSize={0.28} color={C.deepNavy} anchorX="center" anchorY="middle">
            MASTERPLAN PENGEMBANGAN KAMPUS TERPADU TEMBALANG (1985–SEKARANG)
          </Text>
          <Text position={[0, -0.32, 0]} fontSize={0.16} color="#45382b" anchorX="center" anchorY="middle">
            Peralihan Bersejarah dari Kampus Pleburan Menuju Kawasan Terpadu Seluas 212 Hektare
          </Text>
        </group>

        {/* Diagram Garis Waktu Transformasi Fisik */}
        <group position={[0, 2.5, 0.14]}>
          <Text fontSize={0.13} color="#2b2015" maxWidth={roomW - 4.2} textAlign="center" anchorX="center" anchorY="middle">
            1957: Panti Budaya &amp; Pleburan • 1985: Six Universities Development Program (SUDRP) • 1987: Peletakan Batu Pertama Tembalang{'\n'}
            1993: Peresmian Widya Puraya • 2014: RSND &amp; Fakultas Kedokteran • 2016: Waduk Konservasi &amp; Eco-Campus Mandiri
          </Text>
        </group>
      </group>

      {/* 4. Pita Panel Arsitektur Horizontal (Panoramic Blueprint Ribbon) di Dinding Kiri & Kanan */}
      {/* Sisi Kiri: Pita Cetak Biru Pleburan & Peletakan Batu Pertama */}
      <mesh position={[-halfW + 0.08, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.blueprintRibbon}>
        <boxGeometry args={[roomL - 3.6, 2.2, 0.04]} />
      </mesh>
      <mesh position={[-halfW + 0.11, 3.62, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.goldTrim}>
        <boxGeometry args={[roomL - 3.6, 0.04, 0.02]} />
      </mesh>
      <mesh position={[-halfW + 0.11, 1.38, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.goldTrim}>
        <boxGeometry args={[roomL - 3.6, 0.04, 0.02]} />
      </mesh>

      {/* Sisi Kanan: Pita Cetak Biru Widya Puraya, RSND, & Waduk */}
      <mesh position={[halfW - 0.08, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} material={mats.blueprintRibbon}>
        <boxGeometry args={[roomL - 3.6, 2.2, 0.04]} />
      </mesh>
      <mesh position={[halfW - 0.11, 3.62, 0]} rotation={[0, -Math.PI / 2, 0]} material={mats.goldTrim}>
        <boxGeometry args={[roomL - 3.6, 0.04, 0.02]} />
      </mesh>
      <mesh position={[halfW - 0.11, 1.38, 0]} rotation={[0, -Math.PI / 2, 0]} material={mats.goldTrim}>
        <boxGeometry args={[roomL - 3.6, 0.04, 0.02]} />
      </mesh>

      {/* 5. Koleksi Pameran Dinding Kiri (Pleburan s.d. Masterplan) */}
      <group>
        <group position={[-halfW + 0.15, 4.4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh material={mats.navyRibbon}>
            <boxGeometry args={[roomL - 4.0, 0.52, 0.06]} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.24} color={C.gold} anchorX="center" anchorY="middle">
            DOKUMENTASI KAMPUS PLEBURAN &amp; PERINTISAN TEMBALANG (1969–1990)
          </Text>
        </group>

        {leftExhibits.map((item, idx) => {
          const itemZ = -4.2 + idx * 4.2
          return (
            <group key={item.id}>
              <SalonItem
                config={{
                  exhibitId: item.id,
                  z: itemZ,
                  y: 2.5,
                  width: 2.0,
                  height: 1.5,
                  frameColor: C.gold,
                }}
                exhibit={item}
                position={[-halfW + 0.14, 2.5, itemZ]}
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

      {/* 6. Koleksi Pameran Dinding Kanan (Widya Puraya s.d. Waduk) */}
      <group>
        <group position={[halfW - 0.15, 4.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh material={mats.navyRibbon}>
            <boxGeometry args={[roomL - 4.0, 0.52, 0.06]} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.24} color={C.gold} anchorX="center" anchorY="middle">
            TRANSFORMASI FISIK MODERN &amp; FASILITAS TERPADU TEMBALANG
          </Text>
        </group>

        {rightExhibits.map((item, idx) => {
          const itemZ = -4.2 + idx * 4.2
          return (
            <group key={item.id}>
              <SalonItem
                config={{
                  exhibitId: item.id,
                  z: itemZ,
                  y: 2.5,
                  width: 2.0,
                  height: 1.5,
                  frameColor: C.gold,
                }}
                exhibit={item}
                position={[halfW - 0.14, 2.5, itemZ]}
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

      {/* 7. FITUR SENTRAL RUANGAN: Barisan Meja Pedestal Maket Arsitektur Putih Minimalis */}
      {/* Maket 1: Kampus Pleburan & Rektorat Lama */}
      <ArchitecturalMaquettePedestal
        position={[0, 0, -4.2]}
        rotationY={0}
        title="MAKET KAMPUS PLEBURAN (1969)"
        subtitle="Kompleks Rektorat & Fakultas Hukum Jalan Imam Bardjo"
        modelType="pleburan"
        isSelected={selectedHistoryId === 'early-campus-pleburan'}
        isHovered={hoveredId === 'MAKET KAMPUS PLEBURAN (1969)'}
        onClick={() => {
          const ex = histories.find((h) => h.id === 'early-campus-pleburan')
          if (ex) onSelectHistory(ex)
        }}
        onHover={onHover}
      />

      {/* Maket 2: Masterplan Widya Puraya & Menara Jam Ikonik */}
      <ArchitecturalMaquettePedestal
        position={[0, 0, 0.2]}
        rotationY={0}
        title="MAKET GEDUNG WIDYA PURAYA (1993)"
        subtitle="Ikon Menara Jam & Pusat Administrasi Kampus Tembalang"
        modelType="widya-puraya"
        isSelected={selectedHistoryId === 'history-widya-puraya'}
        isHovered={hoveredId === 'MAKET GEDUNG WIDYA PURAYA (1993)'}
        onClick={() => {
          const ex = histories.find((h) => h.id === 'history-widya-puraya')
          if (ex) onSelectHistory(ex)
        }}
        onHover={onHover}
      />

      {/* Maket 3: Kawasan Terpadu RSND & Waduk Konservasi Undip */}
      <ArchitecturalMaquettePedestal
        position={[0, 0, 4.6]}
        rotationY={0}
        title="MAKET RSND &amp; WADUK KONSERVASI"
        subtitle="Fasilitas Rumah Sakit Pendidikan & Sabuk Hijau Eco-Campus"
        modelType="rsnd-waduk"
        isSelected={selectedHistoryId === 'history-rsnd' || selectedHistoryId === 'history-waduk-undip'}
        isHovered={hoveredId === 'MAKET RSND & WADUK KONSERVASI'}
        onClick={() => {
          const ex = histories.find((h) => h.id === 'history-rsnd' || h.id === 'history-waduk-undip')
          if (ex) onSelectHistory(ex)
        }}
        onHover={onHover}
      />

      {/* 8. Plafon Kisi-Kisi Industri Hitam Modern (*Industrial Wire Mesh Grid Ceiling*) */}
      <mesh position={[0, roomH, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.ceilingBack}>
        <planeGeometry args={[roomW, roomL]} />
      </mesh>
      {/* Kisi-kisi Mesh Hitam */}
      <mesh position={[0, roomH - 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.gridCeiling}>
        <planeGeometry args={[roomW, roomL, 34, 38]} />
      </mesh>

      {/* 9. Pintu Keluar ke Base Zone (Dinding Depan) */}
      <PortalDoor
        id="exit-to-base-zone-04"
        doorNumber="KELUAR"
        title="Kembali ke Aula Utama"
        subtitle="Base Zone 1"
        position={[0, 0, zFront - 0.04]}
        rotationY={Math.PI}
        isHovered={hoveredId === 'exit-to-base-zone-04'}
        onSelect={onExitRoom}
        onHover={onHover}
        variant="exit"
      />

      {/* 10. Pencahayaan Terang, Netral, & Teroptimasi 60 FPS */}
      <ambientLight color="#ffffff" intensity={1.35} />
      <directionalLight position={[2, roomH - 0.5, 2]} color="#fffaf0" intensity={0.65} />
      {!isMobile && (
        <>
          <pointLight position={[0, roomH - 1.2, -4.5]} color="#fffcf5" intensity={4.5} distance={14} decay={1.6} />
          <pointLight position={[0, roomH - 1.2, 0.2]} color="#fffcf5" intensity={5.0} distance={14} decay={1.6} />
          <pointLight position={[0, roomH - 1.2, 4.6]} color="#fffcf5" intensity={4.5} distance={14} decay={1.6} />
        </>
      )}
    </group>
  )
}
