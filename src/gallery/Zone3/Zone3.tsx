import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { CanvasStatsCollector, CullingDebugOverlay, type CullingStats } from '../../perf/culling'

import { Zone3Environment } from './Zone3Environment'
import { Zone3Lighting } from './Zone3Lighting'
import { Zone3Controls } from './Zone3Controls'
import { HeritageCenterpiece } from './HeritageCenterpiece'
import { HeritagePhotoWall } from './HeritagePhotoWall'
import { HeritageWestWing } from './HeritageWestWing'
import { HeritageEastWing } from './HeritageEastWing'
import { Zone3InfoPanel } from './Zone3InfoPanel'
import { Zone3OverlayUI } from './Zone3OverlayUI'
import { DesktopHints } from '../Zone1/DesktopHints'
import { MobileControls } from '../Zone1/MobileControls'
import { WayfindingPrompt } from '../Zone1/WayfindingPrompt'
import {
  ZONE3_START_POSITION,
  ZONE3_TARGETS,
} from './layout'
import type { ZoneId } from '../Zone2/types'
import { LightingRig, DetailPass, PostFX, QUALITY } from '../quality'
import { ZoneGraphicsController } from '../graphics'
import '../Zone1/gallery.css'
import './zone3.css'

const checkIsMobile = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth <= 820 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches))

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(checkIsMobile)
  useEffect(() => {
    const check = () => setIsMobile(checkIsMobile())
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

interface Zone3Props {
  onSwitchZone?: (zoneId: ZoneId) => void
}

/**
 * Museum Virtual Undip — Zone 3: The Heritage of Undip
 *
 * Mengusung arsitektur galeri museum indoor yang megah, khidmat, berwibawa,
 * dan sangat stabil (60 FPS di laptop & HP) seperti Zona 1:
 * 1. Ruangan Galeri Monumental: Marmer Crema Marfil, lis kuningan emas, dan karpet runner navy.
 * 2. Sumbu Tengah Depan: Meja Pusaka & Lambang Kehormatan Pangeran Diponegoro.
 * 3. Sumbu Tengah Belakang (Hero Centerpiece): Plaza Prasasti Monumental Peresmian 1957 & 1960.
 * 4. Dinding Belakang: Galeri Monumental 28 Foto Sejarah Perjalanan Kampus.
 * 5. Sayap Barat (Kiri): 12 Vitrine Artefak Akademik & 8 Pilar Tokoh Pendiri (Hall of Legacy).
 * 6. Sayap Timur (Kanan): 10 Dokumen Piagam Penting & Paviliun Audiovisual Mini-Cinema.
 * 7. Navigasi Hibrida:
 *    - First-Person walking bebas (WASD / Panah / Shift lari / Mouse look / Virtual joystick)
 *    - Mode Tur Sinematik otomatis berkeliling ke 5 stasiun utama
 * 8. Panel Informasi Konsisten & Expandable dengan transkrip lengkap.
 */
export function Zone3({ onSwitchZone }: Zone3Props) {
  const isMobile = useIsMobile()
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null)
  const [isNearDirectory, setIsNearDirectory] = useState(false)
  const [cullingStats, setCullingStats] = useState<CullingStats | null>(null)

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
    panelOpenRef.current = selectedItem !== null
  }, [selectedItem])

  const handleSelectItem = useCallback((item: any) => {
    if (draggedRef.current) return
    setSelectedItem(item)
  }, [])

  const handleHover = useCallback((id: string | null) => setHoveredId(id), [])

  const handleReset = useCallback(() => {
    setIsTouring(false)
    setTourIndex(null)
    setResetSignal((s) => s + 1)
    setTargetPosition(null)
  }, [])

  const handleClose = useCallback(() => setSelectedItem(null), [])

  // Teleportasi Waypoint
  const handleTeleport = useCallback((targetKey: keyof typeof ZONE3_TARGETS) => {
    setIsTouring(false)
    setTourIndex(null)
    setTargetPosition(ZONE3_TARGETS[targetKey])
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
          return (prev + 1) % 5
        })
      }, 7000)
    }
  }, [isTouring, tourIndex])

  const selectedItemId = selectedItem?.data?.id ?? null

  return (
    <div className={`gr-root gr-zone3-root${isMobile ? ' is-mobile' : ''}`}>
      <Canvas
        dpr={[1, isMobile ? 1.0 : Math.min(QUALITY.current.pixelRatioMax, 1.5)]}
        gl={{
          antialias: !isMobile,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        onPointerDown={() => {
          draggedRef.current = false
        }}
        onPointerMissed={() => setSelectedItem(null)}
      >
        <ZoneGraphicsController zone="zone3" />
        <color attach="background" args={['#0e1724']} />
        <fog attach="fog" args={['#0e1724', 40, 85]} />
        <PerspectiveCamera
          makeDefault
          fov={isMobile ? 66 : 56}
          near={0.1}
          far={85}
          position={ZONE3_START_POSITION}
        />

        <Suspense fallback={null}>
          <CanvasStatsCollector onStatsUpdate={setCullingStats} />

          {/* Ringan Quality Passes */}
          <LightingRig zone="zone3" />
          <DetailPass zone="zone3" />
          <PostFX zone="zone3" />

          {/* 1. Pencahayaan Galeri Museum Hangat Kuning */}
          <Zone3Lighting castShadows={!isMobile} isMobile={isMobile} />

          {/* 2. Kontrol Hibrida (First-Person Walking & Guided Tour) */}
          <Zone3Controls
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
          <Zone3Environment
            isNearDirectory={isNearDirectory}
            isMobile={isMobile}
          />

          {/* 4. Sumbu Tengah: Meja Pusaka Diponegoro & HERO Plaza Prasasti */}
          <HeritageCenterpiece
            selectedId={selectedItemId}
            hoveredId={hoveredId}
            isMobile={isMobile}
            onSelect={handleSelectItem}
            onHover={handleHover}
          />

          {/* 5. Dinding Belakang: Galeri 28 Foto Sejarah */}
          <HeritagePhotoWall
            selectedId={selectedItemId}
            hoveredId={hoveredId}
            onSelect={handleSelectItem}
            onHover={handleHover}
          />

          {/* 6. Sayap Barat (Kiri): 12 Vitrine Artefak & 8 Tokoh Hall of Legacy */}
          <HeritageWestWing
            selectedId={selectedItemId}
            hoveredId={hoveredId}
            isMobile={isMobile}
            onSelect={handleSelectItem}
            onHover={handleHover}
          />

          {/* 7. Sayap Timur (Kanan): 10 Dokumen Piagam & Paviliun Audiovisual */}
          <HeritageEastWing
            selectedId={selectedItemId}
            hoveredId={hoveredId}
            isMobile={isMobile}
            onSelect={handleSelectItem}
            onHover={handleHover}
          />
        </Suspense>
      </Canvas>

      {/* Kontrol Desktop & Mobile Identik dengan Zona 1 & 4 */}
      {!isMobile && !isTouring && <DesktopHints />}
      {isMobile && !isTouring && (
        <MobileControls
          moveInputRef={moveInputRef}
          visible={selectedItem === null}
          onReset={handleReset}
          onTeleport={(sec) => {
            if (sec === 'entrance') handleTeleport('entrance')
            else if (sec === 'founders') handleTeleport('legacy')
            else if (sec === 'history') handleTeleport('photos')
            else if (sec === 'map') handleTeleport('artifacts')
            else if (sec === 'podium' || sec === 'prasasti') handleTeleport('prasasti')
          }}
        />
      )}

      {/* Wayfinding Prompt saat Dekat Direktori */}
      <WayfindingPrompt
        visible={isNearDirectory && !isTouring && selectedItem === null}
        onTeleport={(sec) => {
          if (sec === 'entrance') handleTeleport('entrance')
          else if (sec === 'founders') handleTeleport('legacy')
          else if (sec === 'history') handleTeleport('photos')
          else if (sec === 'map') handleTeleport('artifacts')
          else if (sec === 'podium' || sec === 'prasasti') handleTeleport('prasasti')
        }}
      />

      {/* Top Header & Overlay UI Zona 3 */}
      <Zone3OverlayUI
        isTouring={isTouring}
        onToggleTour={handleToggleTour}
        currentTourIndex={tourIndex}
        onResetPosition={handleReset}
        onTeleport={handleTeleport}
        isNearDirectory={isNearDirectory}
        onSwitchZone={onSwitchZone}
      />

      {/* Slide-In Modal Detail Informasi Koleksi */}
      <Zone3InfoPanel
        selectedItem={selectedItem}
        onClose={handleClose}
      />

      {/* Real-time F3 Debug Diagnostics HUD */}
      {cullingStats && <CullingDebugOverlay stats={cullingStats} />}
    </div>
  )
}
