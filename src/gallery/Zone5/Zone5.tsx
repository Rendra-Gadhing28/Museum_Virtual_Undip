import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { CanvasStatsCollector, CullingDebugOverlay, type CullingStats } from '../../perf/culling'

import {
  ZONE5_START_POSITION,
  ZONE5_TARGETS,
  NEURAL_CORE_POS,
  VISION_BEACON_POS,
} from './layout'
import { Zone5Lighting } from './Zone5Lighting'
import { Zone5Environment } from './Zone5Environment'
import { Zone5Controls } from './Zone5Controls'
import { FutureCenterpiece } from './FutureCenterpiece'
import { FutureWestWing } from './FutureWestWing'
import { FutureEastWing } from './FutureEastWing'
import { Zone5OverlayUI } from './Zone5OverlayUI'
import { Zone5InfoPanel } from './Zone5InfoPanel'
import { DesktopHints } from '../Zone1/DesktopHints'
import { MobileControls } from '../Zone1/MobileControls'
import { WayfindingPrompt } from '../Zone1/WayfindingPrompt'
import type { SelectedZone5Exhibit, Zone5Exhibit, FutureLantern } from './types'
import '../Zone1/gallery.css'
import './zone5.css'

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

interface Zone5Props {
  onSwitchZone?: (zoneId: 'zone1' | 'zone2' | 'zone3' | 'zone4' | 'zone5') => void
}

/**
 * Museum Virtual Undip — Zone 5: Undip Future
 *
 * AULA GALERI FUTURISTIK MONUMENTAL (Indoor Exhibition Hall)
 * Selaras dengan kemegahan arsitektural Zona 1, 2, 3, dan 4:
 * 1. Lantai Marmer Crema Marfil dengan Inlay Emas & Ice-Blue
 * 2. Karpet Runner Navy Mewah di Sumbu Tengah
 * 3. Plafon Berundak (Coffered Ceiling) dengan Warm Cove Light & Aksen Ice-Blue
 * 4. Sumbu Tengah Depan: Pusat AI Nexus & Neural Core
 * 5. Sayap Barat (Kiri): Digital Twin Plaza & Command Deck Smart Campus
 * 6. Sayap Timur (Kanan): The Summit World Class University & The Living Grove (SDGs)
 * 7. Sumbu Tengah Belakang: HERO Vision Beacon & Horizon Gate 2050 (Klimaks Fajar Emas & Lentera Doa)
 * 8. Navigasi Hibrida: First-Person walking + 5-Station Guided Tour Sinematik
 */
export function Zone5({ onSwitchZone }: Zone5Props) {
  const isMobile = useIsMobile()
  const [selectedExhibit, setSelectedExhibit] = useState<SelectedZone5Exhibit | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null)
  const [isNearDirectory, setIsNearDirectory] = useState(false)
  const [cullingStats, setCullingStats] = useState<CullingStats | null>(null)

  // Guided Tour State
  const [isTouring, setIsTouring] = useState<boolean>(false)
  const [tourIndex, setTourIndex] = useState<number | null>(null)

  // Faktor Fajar Emas (0.0 Blue Hour s.d. 1.0 Golden Dawn Sunrise)
  const [dawnFactor, setDawnFactor] = useState<number>(0.15)

  // Lentera Harapan 2050
  const [lanterns, setLanterns] = useState<FutureLantern[]>([
    {
      id: 'lantern-default-1',
      text: 'Semoga Undip menjadi pelopor energi baru terbarukan laut tropis nomor satu di dunia.',
      author: 'Prof. Tim Riset Kelautan Undip',
      timestamp: '2026',
      position: [0.8, 3.2, -22.5],
    },
    {
      id: 'lantern-default-2',
      text: 'Mencetak lulusan berjiwa ksatria Diponegoro yang memimpin peradaban digital dunia.',
      author: 'Alumni & Civitas Akademika',
      timestamp: '2026',
      position: [-0.9, 4.0, -23.5],
    },
  ])

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

  const handleSelectExhibit = useCallback((exhibit: Zone5Exhibit) => {
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

  const handleClosePanel = useCallback(() => setSelectedExhibit(null), [])

  // Teleportasi ke Titik Waypoint
  const handleTeleport = useCallback((targetKey: keyof typeof ZONE5_TARGETS) => {
    setIsTouring(false)
    setTourIndex(null)
    setTargetPosition(ZONE5_TARGETS[targetKey])
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

  // Tour Station Advancement
  const handleTourStationArrived = useCallback(() => {
    if (isTouring && tourIndex !== null) {
      setTimeout(() => {
        setTourIndex((prev) => {
          if (prev === null) return null
          const next = prev + 1
          if (next >= 5) {
            setDawnFactor(1.0) // Klimaks Fajar Emas tercapai di Horizon Gate
            return 4
          }
          return next
        })
      }, 7000)
    }
  }, [isTouring, tourIndex])

  // Tambah Lentera Harapan Baru
  const handleAddLantern = useCallback((text: string, author: string) => {
    const newLantern: FutureLantern = {
      id: `lantern-${Date.now()}`,
      text,
      author,
      timestamp: 'Hari Ini',
      position: [
        (Math.random() - 0.5) * 3.5,
        2.5 + Math.random() * 2.0,
        -23.0 + (Math.random() - 0.5) * 2.5,
      ],
    }
    setLanterns((prev) => [...prev, newLantern])
    setDawnFactor((d) => Math.min(1.0, d + 0.15))
  }, [])

  const selectedExhibitId = selectedExhibit?.data?.id ?? null

  return (
    <div className={`gr-root gr-zone5-root${isMobile ? ' is-mobile' : ''}`}>
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
        <color attach="background" args={['#081220']} />
        <fog attach="fog" args={['#081220', 40, 85]} />
        <PerspectiveCamera
          makeDefault
          fov={isMobile ? 66 : 56}
          near={0.1}
          far={90}
          position={ZONE5_START_POSITION}
        />

        <Suspense fallback={null}>
          <CanvasStatsCollector onStatsUpdate={setCullingStats} />
          {/* 1. Pencahayaan Galeri Emas & Ice-Blue */}
          <Zone5Lighting
            dawnFactor={dawnFactor}
            isMobile={isMobile}
          />

          {/* 2. Kontrol Hibrida (First-Person & Guided Tour) */}
          <Zone5Controls
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

          {/* 3. Ruangan Arsitektural Galeri (Lantai Marmer, Karpet Runner Navy, Plafon) */}
          <Zone5Environment
            dawnFactor={dawnFactor}
            isMobile={isMobile}
            isNearDirectory={isNearDirectory}
          />

          {/* 4. Sumbu Tengah: AI Neural Core & Hero Vision Beacon 2050 */}
          <FutureCenterpiece
            neuralPos={NEURAL_CORE_POS}
            beaconPos={VISION_BEACON_POS}
            dawnFactor={dawnFactor}
            selectedId={selectedExhibitId}
            hoveredId={hoveredId}
            onSelect={handleSelectExhibit}
            onHover={handleHover}
            lanterns={lanterns}
          />

          {/* 5. Sayap Barat (Kiri): Digital Campus & Command Deck */}
          <FutureWestWing
            selectedId={selectedExhibitId}
            onSelect={handleSelectExhibit}
            onHover={handleHover}
          />

          {/* 6. Sayap Timur (Kanan): The Summit & The Living Grove */}
          <FutureEastWing
            selectedId={selectedExhibitId}
            onSelect={handleSelectExhibit}
            onHover={handleHover}
          />
        </Suspense>
      </Canvas>

      {/* Kontrol Desktop & Mobile Konsisten dengan Zona 1, 2, 3, 4 */}
      {!isMobile && !isTouring && <DesktopHints />}
      {isMobile && !isTouring && (
        <MobileControls
          moveInputRef={moveInputRef}
          visible={selectedExhibit === null}
          onReset={handleReset}
          onTeleport={(sec) => {
            if (sec === 'entrance') handleTeleport('entrance')
            else if (sec === 'founders') handleTeleport('digitalCampus')
            else if (sec === 'history') handleTeleport('theSummit')
            else if (sec === 'map') handleTeleport('neuralCore')
            else if (sec === 'podium' || sec === 'prasasti') handleTeleport('visionBeacon')
          }}
        />
      )}

      {/* Wayfinding Prompt saat Mendekati Papan Direktori */}
      <WayfindingPrompt
        visible={isNearDirectory && !isTouring && selectedExhibit === null}
        onTeleport={(sec) => {
          if (sec === 'entrance') handleTeleport('entrance')
          else if (sec === 'founders') handleTeleport('digitalCampus')
          else if (sec === 'history') handleTeleport('theSummit')
          else if (sec === 'map') handleTeleport('neuralCore')
          else if (sec === 'podium' || sec === 'prasasti') handleTeleport('visionBeacon')
        }}
      />

      {/* Top Header & Subnav UI Zona 5 (Docked di atas, bebas tumpang tindih) */}
      <Zone5OverlayUI
        dawnFactor={dawnFactor}
        onChangeDawnFactor={setDawnFactor}
        isTouring={isTouring}
        onToggleTour={handleToggleTour}
        currentTourIndex={tourIndex}
        onResetPosition={handleReset}
        onTeleport={handleTeleport}
        onAddLantern={handleAddLantern}
        onSwitchZone={onSwitchZone}
      />

      {/* Panel Informasi Detail Pameran */}
      <Zone5InfoPanel
        selected={selectedExhibit}
        onClose={handleClosePanel}
      />

      {/* Real-time F3 Debug Diagnostics HUD */}
      {cullingStats && <CullingDebugOverlay stats={cullingStats} />}
    </div>
  )
}
