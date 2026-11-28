import { useMemo } from 'react'
import * as THREE from 'three'
import { HALL, HALL_CENTER_Z, HALL_LENGTH } from './layout'
import { PortalDoor } from './PortalDoor'
import { Bookshelf } from './MuseumFurniture'
import { DirectoryBoard } from './DirectoryBoard'
import { CeilingRoof } from './CeilingRoof'
import { assetCache } from './cache'
import { AtriumGrandStaircase } from './AtriumGrandStaircase'
import { AtriumChandeliers } from './AtriumChandeliers'
import type { Zone1PortalDoor, Zone1RoomId } from './subRooms'

// Palette warna resmi arsitektur museum
const C = {
  navy: '#23364F',
  ivory: '#E9E1D3',
  taupe: '#655447',
  gold: '#B2935D',
  stone: '#D8CDBB',
  floor: '#CFC4B2',
  walnut: '#392D25',
  greige: '#B9AE9C',
  grey: '#7d7a78',
  brass: '#B08D4A',
  green: '#3d7a3a',
  clerestoryGlow: '#cfe4ff',
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

interface BaseZoneHallProps {
  isNearDirectory?: boolean
  hoveredId?: string | null
  isMobile?: boolean
  portals?: Zone1PortalDoor[]
  onSelectPortal?: (roomId: Zone1RoomId) => void
  onHover?: (id: string | null) => void
}

/**
 * BaseZoneHall: Arsitektur Utama Base Zone (Central Orientation Hall)
 * Performa Teroptimasi:
 * - Menggunakan Central AssetCache untuk seluruh material (Zero material churn per frame)
 * - Shadow casting dimatikan untuk dekorasi kecil sekunder untuk menghemat fill rate GPU
 * - Geometri silinder Ionic & Medallion disederhanakan segmennya (16-20 seg)
 * - Menggunakan CeilingRoof bawaan untuk visual megah tanpa stuttering
 */
export function BaseZoneHall({
  isNearDirectory = false,
  hoveredId = null,
  isMobile = false,
  portals = [],
  onSelectPortal,
  onHover,
}: BaseZoneHallProps) {
  const halfW = HALL.halfWidth
  const height = HALL.height
  const length = HALL_LENGTH
  const centerZ = HALL_CENTER_Z

  // Centralized cached materials (shared instances)
  const mats = useMemo(() => {
    return {
      floor: assetCache.getMaterial('bzh-floor-reflective', () => new THREE.MeshStandardMaterial({
        color: '#ebe5d8',
        roughness: 0.14, // High-gloss polished marble reflection
        metalness: 0.12,
      })),
      taupeWall: assetCache.getMaterial('bzh-taupe-wall', () => new THREE.MeshStandardMaterial({ color: C.taupe, roughness: 0.88 })),
      ivoryWall: assetCache.getMaterial('bzh-ivory-wall', () => new THREE.MeshStandardMaterial({ color: C.ivory, roughness: 0.92 })),
      stone: assetCache.getMaterial('bzh-stone', () => new THREE.MeshStandardMaterial({ color: C.stone, roughness: 0.22, metalness: 0.1 })),
      goldTrim: assetCache.getMaterial('bzh-gold', () => new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.25, metalness: 0.88 })),
      walnut: assetCache.getMaterial('bzh-walnut', () => new THREE.MeshStandardMaterial({ color: C.walnut, roughness: 0.65, metalness: 0.08 })),
      navy: assetCache.getMaterial('bzh-navy', () => new THREE.MeshStandardMaterial({ color: C.navy, roughness: 0.35, metalness: 0.15 })),
      greige: assetCache.getMaterial('bzh-greige', () => new THREE.MeshStandardMaterial({ color: C.greige, roughness: 0.85 })),
      greyBench: assetCache.getMaterial('bzh-grey-bench', () => new THREE.MeshStandardMaterial({ color: C.grey, roughness: 0.95 })),
      brassMetal: assetCache.getMaterial('bzh-brass', () => new THREE.MeshStandardMaterial({ color: C.brass, roughness: 0.35, metalness: 0.8 })),
      greenFoliage: assetCache.getMaterial('bzh-green', () => new THREE.MeshStandardMaterial({ color: C.green, roughness: 0.9 })),
      clerestory: assetCache.getMaterial('bzh-clerestory', () => new THREE.MeshStandardMaterial({ color: '#eaf3ff', emissive: C.clerestoryGlow, emissiveIntensity: 1.0 })),
      pictureFace: assetCache.getMaterial('bzh-pic-face', () => new THREE.MeshStandardMaterial({ color: '#5e5343', roughness: 0.8 })),
    }
  }, [])

  // Geometri terbagi (Shared Geometries) untuk menghemat VRAM dan alokasi memori CPU
  const sharedGeoms = useMemo(() => {
    const r = 0.46
    const colHeight = height
    return {
      sunburstRingOuter: new THREE.CylinderGeometry(5.2, 5.2, 0.008, 36),
      sunburstRingMid: new THREE.CylinderGeometry(4.8, 4.8, 0.008, 36),
      sunburstRay: new THREE.CylinderGeometry(4.3, 4.3, 0.008, 3, 1, false, 0, Math.PI / 16),
      medallionCoreNavy: new THREE.CylinderGeometry(1.5, 1.5, 0.01, 24),
      medallionCoreGold: new THREE.CylinderGeometry(0.9, 0.9, 0.012, 24),
      ionicBase: new THREE.BoxGeometry(r * 2.6, 0.4, r * 2.6),
      ionicShaft: new THREE.CylinderGeometry(r * 0.88, r, colHeight - 1.2, 16),
      ionicVolute: new THREE.CylinderGeometry(r * 0.32, r * 0.32, r * 1.8, 12),
      ionicCapital: new THREE.BoxGeometry(r * 2.6, 0.3, r * 2.6),
      pilaster: new THREE.BoxGeometry(0.14, height - 0.4, 0.6),
      clerestory: new THREE.BoxGeometry(0.08, 1.8, 3.2),
      benchSide: new THREE.BoxGeometry(1.4, 0.48, 3.2),
      benchEnd: new THREE.BoxGeometry(3.2, 0.48, 1.4),
      planterBox: new THREE.BoxGeometry(1.8, 0.9, 1.8),
      planterBush: new THREE.SphereGeometry(0.7, 8, 8),
      bustPedestal: new THREE.BoxGeometry(0.9, 1.2, 0.9),
      bustTorso: new THREE.BoxGeometry(0.45, 0.45, 0.32),
      bustHead: new THREE.SphereGeometry(0.22, 8, 8),
      pictureFrame: new THREE.BoxGeometry(3.4, 2.4, 0.1),
      pictureCanvas: new THREE.BoxGeometry(3.2, 2.2, 0.12),
    }
  }, [height])

  return (
    <group>
      {/* 1. Lantai Limestone Matte (#CFC4B2) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, centerZ]}
        receiveShadow
        material={mats.floor}
      >
        <planeGeometry args={[halfW * 2, length]} />
      </mesh>

      {/* 2. Lantai Medallion Sunburst Marmer Raksasa (Persis Gambar Referensi 1) */}
      <group position={[0, 0.005, 0]}>
        {/* Lingkaran Luar Marmer Abu-abu Gelap (Outer Dark Ring) */}
        <mesh position={[0, 0.004, 0]} receiveShadow material={mats.greyBench} geometry={sharedGeoms.sunburstRingOuter} />
        {/* Ring Tengah Marmer Krem */}
        <mesh position={[0, 0.007, 0]} receiveShadow material={mats.stone} geometry={sharedGeoms.sunburstRingMid} />
        {/* Jari-jari Sunburst Terakota & Marmer Emas */}
        {Array.from({ length: 16 }).map((_, i) => {
          const ang = (i / 16) * Math.PI * 2
          return (
            <mesh
              key={`sunburst-${i}`}
              position={[0, 0.009, 0]}
              rotation={[0, ang, 0]}
              receiveShadow
              material={i % 2 === 0 ? mats.taupeWall : mats.goldTrim}
              geometry={sharedGeoms.sunburstRay}
            />
          )
        })}
        {/* Medallion Lingkaran Inti Pusat Marmer */}
        <mesh position={[0, 0.012, 0]} receiveShadow material={mats.navy} geometry={sharedGeoms.medallionCoreNavy} />
        <mesh position={[0, 0.015, 0]} receiveShadow material={mats.goldTrim} geometry={sharedGeoms.medallionCoreGold} />
      </group>

      {/* 3. Dinding Kiri (Heritage Taupe Bawah & Warm Ivory Atas) */}
      <group>
        <mesh position={[-halfW, 2.12, centerZ]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={mats.taupeWall}>
          <planeGeometry args={[length, 4.24]} />
        </mesh>
        <mesh position={[-halfW, 4.24 + (height - 4.24) / 2, centerZ]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={mats.ivoryWall}>
          <planeGeometry args={[length, height - 4.24]} />
        </mesh>
      </group>

      {/* 4. Dinding Kanan (Heritage Taupe Bawah & Warm Ivory Atas) */}
      <group>
        <mesh position={[halfW, 2.12, centerZ]} rotation={[0, -Math.PI / 2, 0]} receiveShadow material={mats.taupeWall}>
          <planeGeometry args={[length, 4.24]} />
        </mesh>
        <mesh position={[halfW, 4.24 + (height - 4.24) / 2, centerZ]} rotation={[0, -Math.PI / 2, 0]} receiveShadow material={mats.ivoryWall}>
          <planeGeometry args={[length, height - 4.24]} />
        </mesh>
      </group>

      {/* 5. Dinding Depan Entrance */}
      <group>
        <mesh position={[0, 2.12, HALL.zFront]} rotation={[0, Math.PI, 0]} receiveShadow material={mats.taupeWall}>
          <planeGeometry args={[halfW * 2, 4.24]} />
        </mesh>
        <mesh position={[0, 4.24 + (height - 4.24) / 2, HALL.zFront]} rotation={[0, Math.PI, 0]} receiveShadow material={mats.ivoryWall}>
          <planeGeometry args={[halfW * 2, height - 4.24]} />
        </mesh>
      </group>

      {/* 6. Dinding Belakang */}
      <group>
        <mesh position={[0, 2.12, HALL.zBack]} receiveShadow material={mats.taupeWall}>
          <planeGeometry args={[halfW * 2, 4.24]} />
        </mesh>
        <mesh position={[0, 4.24 + (height - 4.24) / 2, HALL.zBack]} receiveShadow material={mats.ivoryWall}>
          <planeGeometry args={[halfW * 2, height - 4.24]} />
        </mesh>
      </group>

      {/* 7. Barisan Kolom Ionic Monumental Sisi Kiri & Kanan */}
      {[-12.2, 12.2].flatMap((x) =>
        [-3.0, 3.8, 10.2].map((z, idx) => {
          const r = 0.46
          const colHeight = height
          return (
            <group key={`ionic-${x}-${idx}`} position={[x, 0, z]}>
              <mesh position={[0, 0.2, 0]} material={mats.stone} geometry={sharedGeoms.ionicBase} />
              <mesh position={[0, 0.4 + (colHeight - 1.2) / 2, 0]} material={mats.stone} geometry={sharedGeoms.ionicShaft} />
              {/* Volutes Capital */}
              <mesh position={[r * 0.85, colHeight - 0.7, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.stone} geometry={sharedGeoms.ionicVolute} />
              <mesh position={[-r * 0.85, colHeight - 0.7, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.stone} geometry={sharedGeoms.ionicVolute} />
              <mesh position={[0, colHeight - 0.15, 0]} material={mats.stone} geometry={sharedGeoms.ionicCapital} />
            </group>
          )
        }),
      )}

      {/* 8. Pilaster Dinding & Mouldings */}
      {[-1, 1].map((s) => (
        <group key={`moulding-${s}`}>
          {/* Baseboard Walnut */}
          <mesh position={[s * (halfW - 0.05), 0.11, centerZ]} material={mats.walnut}>
            <boxGeometry args={[0.1, 0.22, length]} />
          </mesh>
          {/* Chair Rail Gold */}
          <mesh position={[s * (halfW - 0.06), 0.95, centerZ]} material={mats.goldTrim}>
            <boxGeometry args={[0.12, 0.06, length]} />
          </mesh>
          {/* Cornice Divider */}
          <mesh position={[s * (halfW - 0.05), 4.24, centerZ]} material={mats.greige}>
            <boxGeometry args={[0.1, 0.12, length]} />
          </mesh>
          {/* Pilaster Dinding Ritmis */}
          {[-20.0, -13.0, -4.0, 7.0].map((pz, pi) => (
            <mesh key={`pilaster-${s}-${pi}`} position={[s * (halfW - 0.07), height / 2, pz]} material={mats.stone} geometry={sharedGeoms.pilaster} />
          ))}
          {/* Clerestory Windows Emisif di Atas Dinding */}
          {range(4).map((ci) => (
            <mesh key={`clere-${s}-${ci}`} position={[s * (halfW - 0.04), height - 1.4, -16 + ci * 8]} material={mats.clerestory} geometry={sharedGeoms.clerestory} />
          ))}
        </group>
      ))}

      {/* 9. Pintu Masuk Entrance Monumental di Sisi Depan */}
      <group position={[0, 0, HALL.zFront - 0.05]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 2.2, 0.04]} material={mats.walnut}>
          <boxGeometry args={[3.6, 4.4, 0.15]} />
        </mesh>
        <mesh position={[0, 4.45, 0.08]} material={mats.navy}>
          <boxGeometry args={[4.0, 0.35, 0.18]} />
        </mesh>
        <mesh position={[0, 4.65, 0.1]} material={mats.goldTrim}>
          <boxGeometry args={[4.1, 0.06, 0.22]} />
        </mesh>
        {[-0.85, 0.85].map((dx, di) => (
          <group key={di} position={[dx, 2.1, 0.08]}>
            <mesh material={mats.walnut}>
              <boxGeometry args={[1.6, 3.9, 0.08]} />
            </mesh>
            <mesh position={[0, 0, 0.042]} material={mats.goldTrim}>
              <boxGeometry args={[1.4, 3.7, 0.01]} />
            </mesh>
            <mesh position={[0, 0.7, 0.048]} material={mats.navy}>
              <boxGeometry args={[1.25, 1.9, 0.015]} />
            </mesh>
            <mesh position={[0, -0.9, 0.048]} material={mats.navy}>
              <boxGeometry args={[1.25, 1.3, 0.015]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 10. Bangku Abu-abu & Planter Tengah di Area Medallion */}
      <group position={[0, 0, -5.5]}>
        <mesh position={[0, 0.45, 0]} material={mats.stone} geometry={sharedGeoms.planterBox} />
        <mesh position={[0, 1.3, 0]} material={mats.greenFoliage} geometry={sharedGeoms.planterBush} />
        <mesh position={[-2.8, 0.28, 0]} material={mats.greyBench} geometry={sharedGeoms.benchSide} />
        <mesh position={[2.8, 0.28, 0]} material={mats.greyBench} geometry={sharedGeoms.benchSide} />
        <mesh position={[0, 0.28, -2.6]} material={mats.greyBench} geometry={sharedGeoms.benchEnd} />
        <mesh position={[0, 0.28, 2.6]} material={mats.greyBench} geometry={sharedGeoms.benchEnd} />
      </group>

      {/* 11. Meja Informasi Bundar dekat Pintu Masuk */}
      <group position={[-4.2, 0, 7.8]}>
        <mesh position={[0, 0.5, 0]} material={mats.ivoryWall}>
          <cylinderGeometry args={[1.6, 1.6, 1.0, 20]} />
        </mesh>
        <mesh position={[0, 1.05, 0]} material={mats.walnut}>
          <cylinderGeometry args={[1.72, 1.72, 0.1, 20]} />
        </mesh>
        <mesh position={[0, 1.3, 0]} material={mats.brassMetal}>
          <cylinderGeometry args={[0.9, 0.9, 0.4, 16]} />
        </mesh>
      </group>

      {/* 12. Lukisan & Pedestal Busts di Dinding */}
      <group position={[-halfW + 0.08, 3.8, 8.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={mats.goldTrim} geometry={sharedGeoms.pictureFrame} />
        <mesh position={[0, 0, 0.02]} material={mats.pictureFace} geometry={sharedGeoms.pictureCanvas} />
      </group>
      <group position={[halfW - 0.08, 3.8, 8.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh material={mats.goldTrim} geometry={sharedGeoms.pictureFrame} />
        <mesh position={[0, 0, 0.02]} material={mats.pictureFace} geometry={sharedGeoms.pictureCanvas} />
      </group>

      {/* Pedestal Busts */}
      {[-halfW + 0.8, halfW - 0.8].map((px, pxi) => (
        <group key={`bust-${pxi}`} position={[px, 0, 10.5]}>
          <mesh position={[0, 0.6, 0]} material={mats.stone} geometry={sharedGeoms.bustPedestal} />
          <mesh position={[0, 1.45, 0]} material={mats.ivoryWall} geometry={sharedGeoms.bustTorso} />
          <mesh position={[0, 1.88, 0]} material={mats.ivoryWall} geometry={sharedGeoms.bustHead} />
        </group>
      ))}

      {/* 13. Tangga Marmer Kembar & Mezzanine Lantai 2 (Sesuai Foto Referensi 1) */}
      <AtriumGrandStaircase />

      {/* 14. 3 Chandelier Kristal Bertingkat Mewah Menggantung di Plafon */}
      <AtriumChandeliers isMobile={isMobile} />

      {/* 15. Plafon PVC Coffered Drop Ceiling (Sama seperti desain sebelumnya) */}
      <CeilingRoof isMobile={isMobile} showChandeliers={false} />

      {/* 16. Fasilitas & Papan Direktori Museum (Signage atas pintu dihapus karena sudah ada di PortalDoor) */}
      <Bookshelf position={[halfW - 0.35, 0, 11.5]} rotationY={-Math.PI / 2} />
      <Bookshelf position={[-halfW + 0.35, 0, 11.5]} rotationY={Math.PI / 2} />
      <DirectoryBoard
        position={[4.5, 0, 9.5]}
        rotationY={-Math.PI / 4}
        isNear={isNearDirectory}
      />

      {/* 18. 5 Portal Pintu Masuk Interaktif ke Sub-Ruang Galeri */}
      {portals.map((portal) => (
        <PortalDoor
          key={portal.id}
          id={`portal-${portal.id}`}
          doorNumber={portal.doorNumber}
          title={portal.title}
          subtitle={portal.subtitle}
          position={portal.position}
          rotationY={portal.rotationY}
          isHovered={hoveredId === `portal-${portal.id}`}
          onSelect={() => onSelectPortal?.(portal.id)}
          onHover={(id) => onHover?.(id)}
        />
      ))}
    </group>
  )
}
