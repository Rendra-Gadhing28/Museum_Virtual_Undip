import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import type { HistoryExhibit } from './data/exhibits'
import { HISTORY_EXHIBITS } from './data/exhibits'
import { HISTORY_WALL_X } from './layout'
import { createHistoryPanelTexture } from './textures'
import { assetCache } from './cache'

interface SalonFrameConfig {
  exhibitId: string
  z: number
  y: number
  width: number
  height: number
  frameColor?: string
}

// Salon-style curated gallery wall layout coordinates inspired directly by the reference image
const SALON_LAYOUT: SalonFrameConfig[] = [
  // --- CLUSTER 1: 5 TOKOH PELOPOR & PERINTIS AWAL YAYASAN 1956 (Z = +8.2 down to Z = +5.2) ---
  { exhibitId: 'pioneer-dr-soemardi', z: 8.0, y: 3.75, width: 1.05, height: 1.35, frameColor: '#d4af37' },
  { exhibitId: 'pioneer-prof-sunario', z: 8.0, y: 1.95, width: 1.05, height: 1.35, frameColor: '#3d2516' },
  { exhibitId: 'pioneer-ir-goenoeng', z: 6.7, y: 3.75, width: 1.05, height: 1.35, frameColor: '#3d2516' },
  { exhibitId: 'pioneer-mr-ali-boediardjo', z: 6.7, y: 1.95, width: 1.05, height: 1.35, frameColor: '#d4af37' },
  { exhibitId: 'pioneer-r-soenarto', z: 5.4, y: 2.85, width: 1.1, height: 1.45, frameColor: '#d4af37' },

  // --- CLUSTER 2: ERA PRAKARSA, DOKUMEN & KAMPUS AWAL (Z = +3.8 down to Z = -5.0) ---
  // Mid Left Upper: Akta Notaris 1956
  { exhibitId: 'archives-notary-1956', z: 3.6, y: 3.75, width: 1.18, height: 1.42, frameColor: '#d4af37' },
  // Mid Left Lower: Statuta Perdana 1957
  { exhibitId: 'archives-statuta-1957', z: 3.6, y: 1.95, width: 1.18, height: 1.18, frameColor: '#3d2516' },

  // CENTERPIECE 1: Lukisan Induk Api Perjuangan Diponegoro (Prominent Center)
  { exhibitId: 'artwork-diponegoro-center', z: 0.2, y: 2.85, width: 2.5, height: 1.68, frameColor: '#d4af37' },

  // Far Left Upper: Foto Gedung Panti Budaya
  { exhibitId: 'early-photo-panti-budaya', z: -2.3, y: 3.7, width: 1.55, height: 1.18, frameColor: '#3d2516' },
  // Far Left Lower: Foto Mahasiswa Angkatan 1957
  { exhibitId: 'early-photo-students-1957', z: -2.3, y: 1.95, width: 1.55, height: 1.08, frameColor: '#2b1a10' },

  // Mid Right Upper: SK Presiden & PP No. 7 Tahun 1961
  { exhibitId: 'decree-sk-1961', z: -5.2, y: 3.75, width: 1.2, height: 1.45, frameColor: '#d4af37' },
  // Mid Right Lower: Lembaran Negara 1961
  { exhibitId: 'decree-lembaran-negara', z: -5.2, y: 1.95, width: 1.2, height: 1.18, frameColor: '#3d2516' },

  // --- CLUSTER 3: ERA TRANSFORMASI, SOEKARNO & TEMBALANG (Z = -8.5 down to Z = -20.0) ---
  // Mid Left Upper: Foto Kunjungan Bung Karno
  { exhibitId: 'early-photo-soekarno-visit', z: -8.5, y: 3.7, width: 1.55, height: 1.18, frameColor: '#3d2516' },
  // Mid Left Lower: Foto Kampus Pleburan Lama
  { exhibitId: 'early-campus-pleburan', z: -8.5, y: 1.95, width: 1.55, height: 1.1, frameColor: '#2b1a10' },

  // CENTERPIECE 2: Naskah Pidato Presiden Soekarno 1960
  { exhibitId: 'archives-soekarno-1960', z: -12.4, y: 2.85, width: 2.4, height: 1.65, frameColor: '#d4af37' },

  // Mid Right Upper: Masterplan Kampus Tembalang
  { exhibitId: 'history-masterplan-tembalang', z: -15.5, y: 3.75, width: 1.25, height: 1.42, frameColor: '#3d2516' },
  // Mid Right Lower: Transformasi PTN-BH
  { exhibitId: 'history-transformation', z: -15.5, y: 1.95, width: 1.7, height: 1.15, frameColor: '#d4af37' },
]

interface SalonItemProps {
  config: SalonFrameConfig
  exhibit: HistoryExhibit
  isSelected: boolean
  isHovered: boolean
  onSelect: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
}

function SalonItem({
  config,
  exhibit,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: SalonItemProps) {
  const generatedTexture = useMemo(() => createHistoryPanelTexture(exhibit), [exhibit])
  const [loadedTexture, setLoadedTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!exhibit.imagePath) return
    let active = true
    const cached = assetCache.loadExternalTexture(exhibit.imagePath, (tex) => {
      if (active) setLoadedTexture(tex)
    })
    if (cached) setLoadedTexture(cached)
    return () => {
      active = false
    }
  }, [exhibit.imagePath])

  const texture = loadedTexture ?? generatedTexture
  const { width: fw, height: fh, frameColor = '#d4af37' } = config

  return (
    <group
      position={[HISTORY_WALL_X, config.y, config.z]}
      rotation={[0, -Math.PI / 2, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(exhibit.id)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onHover(null)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(exhibit)
      }}
    >
      {/* 1. Dark Wood Backboard */}
      <mesh position={[0, 0, -0.04]} castShadow>
        <boxGeometry args={[fw + 0.08, fh + 0.08, 0.04]} />
        <meshStandardMaterial color="#1a110a" roughness={0.7} />
      </mesh>

      {/* 2. Outer Moulded Frame (Gold or Heritage Teak) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[fw, fh, 0.09]} />
        <meshStandardMaterial
          color={isSelected ? '#ffd966' : isHovered ? '#f5cf65' : frameColor}
          emissive={isSelected ? 0xd4af37 : isHovered ? 0xb58a22 : 0x000000}
          emissiveIntensity={isSelected ? 0.45 : isHovered ? 0.22 : 0}
          roughness={0.32}
          metalness={frameColor === '#d4af37' ? 0.85 : 0.2}
        />
      </mesh>

      {/* 3. Passe-Partout Matboard (Ivory/White museum matboard) */}
      <mesh position={[0, 0, 0.035]} receiveShadow>
        <boxGeometry args={[fw - 0.12, fh - 0.12, 0.04]} />
        <meshStandardMaterial color="#f8f5ee" roughness={0.9} />
      </mesh>

      {/* 4. Fine Inset Gold Foil Trim */}
      <mesh position={[0, 0, 0.048]}>
        <boxGeometry args={[fw - 0.2, fh - 0.2, 0.015]} />
        <meshStandardMaterial color="#d4af37" roughness={0.25} metalness={0.85} />
      </mesh>

      {/* 5. Exhibition Canvas */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[fw - 0.26, fh - 0.26]} />
        <meshStandardMaterial map={texture} roughness={0.65} />
      </mesh>

      {/* 6. Subtle Plaque Label Below Frame */}
      <group position={[0, -fh / 2 - 0.1, 0.02]}>
        <mesh>
          <boxGeometry args={[Math.min(fw * 0.7, 1.2), 0.09, 0.015]} />
          <meshStandardMaterial color="#f7f4eb" roughness={0.8} />
        </mesh>
      </group>

      {/* 7. Hover Line */}
      {(isHovered || isSelected) && (
        <mesh position={[0, -fh / 2 - 0.18, 0.02]}>
          <boxGeometry args={[fw * 0.9, 0.03, 0.01]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
      )}
    </group>
  )
}

interface HistoryArchivesWingProps {
  selectedExhibitId: string | null
  hoveredId: string | null
  onSelectExhibit: (exhibit: HistoryExhibit) => void
  onHover: (id: string | null) => void
}

/**
 * Sayap Sejarah & Arsip Resmi Undip (Salon-Style Clustered Hang Layout)
 * Matched meticulously to the user's reference photograph, completely filling the right wall.
 */
export function HistoryArchivesWing({
  selectedExhibitId,
  hoveredId,
  onSelectExhibit,
  onHover,
}: HistoryArchivesWingProps) {
  // Map exhibits by ID for fast lookup
  const exhibitMap = useMemo(() => {
    const map = new Map<string, HistoryExhibit>()
    HISTORY_EXHIBITS.forEach((ex) => map.set(ex.id, ex))
    return map
  }, [])

  return (
    <group>
      {/* Aesthetic Museum Track-Lighting Beam running above the entire gallery wall */}
      <mesh position={[HISTORY_WALL_X - 0.8, 5.2, -6.0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.08, 30.0]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Rhythmic Focused Track Spotlights on the Clusters */}
      {[6.2, 3.6, 0.2, -3.3, -7.5, -11.6, -15.5].map((spotZ, sIdx) => (
        <group key={`track-spot-${sIdx}`} position={[HISTORY_WALL_X - 0.8, 5.15, spotZ]}>
          {/* Spotlight Fixture Canister */}
          <mesh rotation={[0, 0, -0.45]}>
            <cylinderGeometry args={[0.05, 0.07, 0.18, 12]} />
            <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Focused Soft Wall Spotlight with Minimalist Falloff */}
          <spotLight
            position={[0, 0, 0]}
            target-position={[0.8, -2.6, 0]}
            color="#fff6e2"
            intensity={22}
            angle={0.65}
            penumbra={0.75}
            distance={7.5}
            decay={2}
          />
        </group>
      ))}

      {/* Salon Gallery Wall Items (Arranged exactly like the reference image) */}
      {SALON_LAYOUT.map((config) => {
        const exhibit = exhibitMap.get(config.exhibitId)
        if (!exhibit) return null
        return (
          <SalonItem
            key={config.exhibitId}
            config={config}
            exhibit={exhibit}
            isSelected={selectedExhibitId === exhibit.id}
            isHovered={hoveredId === exhibit.id}
            onSelect={onSelectExhibit}
            onHover={onHover}
          />
        )
      })}
    </group>
  )
}
