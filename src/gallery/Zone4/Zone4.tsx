import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { CanvasStatsCollector, CullingDebugOverlay, type CullingStats } from '../../perf/culling'

import { Zone4Environment } from './Zone4Environment'
import { Zone4Lighting } from './Zone4Lighting'
import { Zone4Controls } from './Zone4Controls'
import { CampusLivingDiorama } from './CampusLivingDiorama'
import { ResearchWing } from './ResearchWing'
import { LibraryKnowledgeWing } from './LibraryKnowledgeWing'
import { GlobalHonorsStage } from './GlobalHonorsStage'
import { Zone4InfoPanel } from './Zone4InfoPanel'
import { Zone4OverlayUI } from './Zone4OverlayUI'
import { DesktopHints } from '../Zone1/DesktopHints'
import { MobileControls } from '../Zone1/MobileControls'
import { WayfindingPrompt } from '../Zone1/WayfindingPrompt'
import {
  MAKET_POS,
  ZONE4_START_POSITION,
  ZONE4_TARGETS,
} from './layout'
import type { SelectedZone4Exhibit, Zone4Exhibit } from './types'
import '../Zone1/gallery.css'
import './zone4.css'

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth <= 820 || window.matchMedia('(pointer: coarse)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

interface Zone4Props {
  onSwitchZone?: (zoneId: 'zone1' | 'zone2' | 'zone3' | 'zone4' | 'zone5') => void
}

/**
 * Museum Virtual Undip — Zone 4: Undip Today
 *
 * Menggabungkan kehangatan arsitektural ruangan galeri museum Zone 1 & 2
 * dengan dinamika pameran kontemporer kampus modern:
 * 1. Ruangan Galeri Megah (Indoor Exhibition Hall) berplafon tinggi, marmer Crema Marfil,
 *    dan karpet runner navy berpinggir emas.
 * 2. Pencahayaan Galeri Hangat (Warm Golden Downlights 2800K - 3000K).
 * 3. Sumbu Tengah Depan: Maket Kampus Modern Tembalang & Smart Campus.
 * 4. Sayap Kiri: Laboratorium Terpadu & Riset Unggulan (Robotika, Bioprinting, AI).
 * 5. Sayap Kanan: Perpustakaan Digital & Repositori Pengetahuan.
 * 6. Sumbu Tengah Belakang: Panggung Prestasi Internasional & Pengakuan Global.
 * 7. Navigasi Hibrida:
 *    - Mode Bebas: First-Person walking (WASD/panah/mouse/touch)
 *    - Mode Guided Tour: Kamera bergerak otomatis sinematik mengunjungi tiap sayap pameran
 * 8. Panel Informasi Konsisten dengan Zona 1 & 2 (expandable ke tengah layar).
 */
export function Zone4({ onSwitchZone }: Zone4Props) {
  const isMobile = useIsMobile()
  const [selectedExhibit, setSelectedExhibit] = useState<SelectedZone4Exhibit | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null)
  const [isNearDirectory, setIsNearDirectory] = useState(false)
  const [cullingStats, setCullingStats] = useState<CullingStats | null>(null)

  // Kontrol Waktu Pencahayaan Maket (0: Siang, 0.65: Senja, 1.0: Malam)
  const [timeOfDay, setTimeOfDay] = useState<number>(0.65)

  // Guided Tour State
  const [isTouring, setIsTouring] = useState<boolean>(false)
  const [tourIndex, setTourIndex] = useState<number | null>(null)

  const moveInputRef = useRef<{ forward: number; strafe: number }>({ forward: 0, strafe: 0 })
  const hoveredRef = useRef<string | null>(null)
  const panelOpenRef = useRef(false)
  const draggedRef = useRef(false)

  useEffect(() => {
    hoveredRef.current = hoveredId
    document.body.style.cursor = hoveredId ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hoveredId])

  useEffect(() => {
    panelOpenRef.current = selectedExhibit !== null
  }, [selectedExhibit])

  const handleSelectExhibit = useCallback((exhibit: Zone4Exhibit) => {
    if (draggedRef.current) return
    setSelectedExhibit({
      type: exhibit.category,
      data: exhibit,
    })
  }, [])

  const handleHover = useCallback((id: string | null) => setHoveredId(id), [])

  const handleReset = useCallback(() => {
    setIsTouring(false)
    setTourIndex(null)
    setResetSignal((s) => s + 1)
    setTargetPosition(null)
  }, [])

  const handleClose = useCallback(() => setSelectedExhibit(null), [])

  // Teleportasi Waypoint
  const handleTeleport = useCallback((targetKey: 'entrance' | 'campusMaket' | 'labs' | 'library' | 'achievements') => {
    setIsTouring(false)
    setTourIndex(null)
    setTargetPosition(ZONE4_TARGETS[targetKey])
    setTimeout(() => setTargetPosition(null), 1200)
  }, [])

  // Toggle Mode Guided Tour Sinematik
  const handleToggleTour = useCallback(() => {
    setIsTouring((prev) => {
      const next = !prev
      if (next) {
        setTourIndex(0)
      } else {
        setTourIndex(null)
      }
      return next
    })
  }, [])

  // Tour Station Auto-Advancement
  const handleTourStationArrived = useCallback(() => {
    if (isTouring && tourIndex !== null) {
      setTimeout(() => {
        setTourIndex((prev) => {
          if (prev === null) return null
          return (prev + 1) % 4
        })
      }, 7000) // Diam 7 detik per stasiun untuk menikmati penjelasan
    }
  }, [isTouring, tourIndex])

  const selectedExhibitId = selectedExhibit?.data?.id ?? null

  return (
    <div className={`gr-root gr-zone4-root${isMobile ? ' is-mobile' : ''}`}>
      <Canvas
        shadows={false}
        dpr={[1, isMobile ? 1.0 : 1.5]}
        gl={{
          antialias: !isMobile,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        onPointerDown={() => {
          draggedRef.current = false
        }}
        onPointerMissed={() => setSelectedExhibit(null)}
      >
        <color attach="background" args={['#0e1724']} />
        <fog attach="fog" args={['#0e1724', 40, 85]} />
        <PerspectiveCamera
          makeDefault
          fov={isMobile ? 66 : 56}
          near={0.1}
          far={95}
          position={ZONE4_START_POSITION}
        />

        <Suspense fallback={null}>
          <CanvasStatsCollector onStatsUpdate={setCullingStats} />
          {/* 1. Pencahayaan Galeri Museum Hangat Kuning */}
          <Zone4Lighting />

          {/* 2. Kontrol Hibrida (First-Person Walking & Guided Tour) */}
          <Zone4Controls
            resetSignal={resetSignal}
            targetPosition={targetPosition}
            moveInputRef={moveInputRef}
            hoveredRef={hoveredRef}
            panelOpenRef={panelOpenRef}
            draggedRef={draggedRef}
            onProximityChange={setIsNearDirectory}
            isTouring={isTouring}
            tourStationIndex={tourIndex}
            onTourStationArrived={handleTourStationArrived}
          />

          {/* 3. Ruangan Arsitektural Galeri Museum (Dinding, Lantai Marmer, Plafon) */}
          <Zone4Environment
            onSelectMonument={handleSelectExhibit}
            onHover={handleHover}
            isNearDirectory={isNearDirectory}
            isMobile={isMobile}
          />

          {/* 4. Sumbu Tengah Depan: Maket Kampus Modern Tembalang */}
          <CampusLivingDiorama
            position={MAKET_POS}
            isSelected={selectedExhibitId === 'campus-master-diorama'}
            isHovered={hoveredId === 'campus-master-diorama'}
            onSelect={handleSelectExhibit}
            onHover={handleHover}
            timeOfDay={timeOfDay}
          />

          {/* 5. Sayap Kiri: Laboratorium & Pusat Penelitian */}
          <ResearchWing
            selectedId={selectedExhibitId}
            onSelect={handleSelectExhibit}
            onHover={handleHover}
          />

          {/* 6. Sayap Kanan: Perpustakaan & Pusat Pengetahuan Digital */}
          <LibraryKnowledgeWing
            selectedId={selectedExhibitId}
            onSelect={handleSelectExhibit}
            onHover={handleHover}
          />

          {/* 7. Sumbu Tengah Belakang: Panggung Prestasi Internasional */}
          <GlobalHonorsStage
            selectedId={selectedExhibitId}
            onSelect={handleSelectExhibit}
            onHover={handleHover}
          />
        </Suspense>
      </Canvas>

      {/* Kontrol Desktop & Mobile Identik dengan Zona 1 & 2 */}
      {!isMobile && !isTouring && <DesktopHints />}
      {isMobile && !isTouring && (
        <MobileControls
          moveInputRef={moveInputRef}
          visible={selectedExhibit === null}
          onReset={handleReset}
          onTeleport={(sec) => {
            if (sec === 'entrance') handleTeleport('entrance')
            else if (sec === 'founders') handleTeleport('labs')
            else if (sec === 'history') handleTeleport('library')
            else if (sec === 'map') handleTeleport('campusMaket')
            else if (sec === 'podium' || sec === 'prasasti') handleTeleport('achievements')
          }}
        />
      )}

      {/* Wayfinding Prompt saat Dekat Direktori */}
      <WayfindingPrompt
        visible={isNearDirectory && !isTouring && selectedExhibit === null}
        onTeleport={(sec) => {
          if (sec === 'entrance') handleTeleport('entrance')
          else if (sec === 'founders') handleTeleport('labs')
          else if (sec === 'history') handleTeleport('library')
          else if (sec === 'map') handleTeleport('campusMaket')
          else if (sec === 'podium' || sec === 'prasasti') handleTeleport('achievements')
        }}
      />

      {/* Top Header & Overlay UI Zona 4 */}
      <Zone4OverlayUI
        timeOfDay={timeOfDay}
        onChangeTimeOfDay={setTimeOfDay}
        isTouring={isTouring}
        onToggleTour={handleToggleTour}
        currentTourIndex={tourIndex}
        onResetPosition={handleReset}
        onTeleport={handleTeleport}
        isNearDirectory={isNearDirectory}
        onSwitchZone={onSwitchZone}
      />

      {/* Panel Informasi Pameran (Konsisten dengan Zona 1 & 2) */}
      <Zone4InfoPanel
        selected={selectedExhibit}
        onClose={handleClose}
      />

      {/* Real-time F3 Debug Diagnostics HUD */}
      {cullingStats && <CullingDebugOverlay stats={cullingStats} />}
    </div>
  )
}
