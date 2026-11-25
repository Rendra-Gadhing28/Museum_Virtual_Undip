import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { CanvasStatsCollector, CullingDebugOverlay, type CullingStats } from '../../perf/culling'
import type { SelectedExhibit, SectionType } from '../Zone1/types'
import { FirstPersonControls } from '../Zone1/FirstPersonControls'
import { DesktopHints } from '../Zone1/DesktopHints'
import { MobileControls } from '../Zone1/MobileControls'
import { ExhibitInformationPanel } from '../Zone1/ExhibitInformationPanel'
import { WayfindingPrompt } from '../Zone1/WayfindingPrompt'
import { Zone2Lighting } from './Zone2Lighting'
import { Zone2Environment } from './Zone2Environment'
import { CampusTransformationDiorama } from './CampusTransformationDiorama'
import { FacultyWing } from './FacultyWing'
import { ResearchContributionWing } from './ResearchContributionWing'
import {
  DIORAMA_POS,
  ZONE2_START_POSITION,
  ZONE2_TARGETS,
} from './layout'
import type { Zone2Exhibit, ZoneId } from './types'
import '../Zone1/gallery.css'

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

interface Zone2Props {
  onSwitchZone?: (zoneId: ZoneId) => void
}

/**
 * Museum Virtual Undip — Zone 2: The Growth of Knowledge
 * Implements:
 * 1. Warm Golden Gallery Light (Strictly no cold white light)
 * 2. Perkembangan Fakultas (Left Wing)
 * 3. Transformasi Kampus Undip (Center Tiered 3D Diorama)
 * 4. Perkembangan Pendidikan & Penelitian (Right Wing - Section A)
 * 5. Prestasi Akademik & Kontribusi Kepada Masyarakat (Right Wing - Section B)
 * 6. High-Performance Memory Caching & Render Boundary
 * 7. Information Modal identical to Zone 1 in structure, but customized for Zone 2 content.
 */
export function Zone2({ onSwitchZone: _onSwitchZone }: Zone2Props) {
  const isMobile = useIsMobile()
  const [selectedExhibit, setSelectedExhibit] = useState<SelectedExhibit | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null)
  const [isNearDirectory, setIsNearDirectory] = useState(false)
  const [cullingStats, setCullingStats] = useState<CullingStats | null>(null)

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

  const handleSelectExhibit = useCallback((exhibit: Zone2Exhibit) => {
    if (draggedRef.current) return
    setSelectedExhibit({
      type: exhibit.category as any,
      data: exhibit,
    })
  }, [])

  const handleHover = useCallback((id: string | null) => setHoveredId(id), [])

  const handleReset = useCallback(() => {
    setResetSignal((s) => s + 1)
    setTargetPosition(null)
  }, [])

  const handleClose = useCallback(() => setSelectedExhibit(null), [])

  const handleTeleport = useCallback((section: SectionType) => {
    if (section === 'entrance') setTargetPosition(ZONE2_TARGETS.entrance)
    else if (section === 'founders' || section === 'history') setTargetPosition(ZONE2_TARGETS.faculties)
    else if (section === 'map') setTargetPosition(ZONE2_TARGETS.transformation)
    else if (section === 'podium' || section === 'prasasti') setTargetPosition(ZONE2_TARGETS.monument)
  }, [])

  const selectedExhibitId = selectedExhibit?.data?.id ?? null

  return (
    <div className={`gr-root${isMobile ? ' is-mobile' : ''}`}>
      <Canvas
        shadows={false}
        dpr={[1, isMobile ? 1.0 : 1.5]}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
        onPointerMissed={() => setSelectedExhibit(null)}
      >
        {/* Warm Gallery Horizon Color */}
        <color attach="background" args={['#100d08']} />
        <fog attach="fog" args={['#100d08', 35, 75]} />

        <PerspectiveCamera
          makeDefault
          position={ZONE2_START_POSITION}
          fov={isMobile ? 66 : 56}
          near={0.1}
          far={80}
        />

        <Suspense fallback={null}>
          <CanvasStatsCollector onStatsUpdate={setCullingStats} />
          {/* Strictly Warm Golden/Amber Lighting (2700K - 3000K) */}
          <Zone2Lighting />

          {/* Master Architectural Space */}
          <Zone2Environment
            onSelectMonument={handleSelectExhibit}
            onHover={handleHover}
            isMobile={isMobile}
          />

          {/* Centerpiece 3D Diorama: Transformasi Kampus Undip */}
          <CampusTransformationDiorama
            position={DIORAMA_POS}
            isSelected={selectedExhibitId === 'zone2-centerpiece-diorama'}
            isHovered={hoveredId === 'centerpiece-diorama'}
            onSelect={handleSelectExhibit}
            onHover={handleHover}
          />

          {/* Left Wing: Perkembangan Fakultas (FH, FEB, FT, FK, FPIK, Vokasi) */}
          <FacultyWing
            selectedId={selectedExhibitId}
            hoveredId={hoveredId}
            onSelectExhibit={handleSelectExhibit}
            onHover={handleHover}
          />

          {/* Right Wing: Riset Kelautan, Paten, KKN & Reputasi Dunia */}
          <ResearchContributionWing
            selectedId={selectedExhibitId}
            hoveredId={hoveredId}
            onSelectExhibit={handleSelectExhibit}
            onHover={handleHover}
          />
        </Suspense>

        <FirstPersonControls
          resetSignal={resetSignal}
          targetPosition={targetPosition}
          moveInputRef={moveInputRef}
          hoveredRef={hoveredRef}
          panelOpenRef={panelOpenRef}
          draggedRef={draggedRef}
          onProximityChange={setIsNearDirectory}
        />
      </Canvas>

      {/* Subtle Desktop Navigation Hints */}
      {!isMobile && <DesktopHints />}

      {/* Mobile Touch Controls */}
      {isMobile && (
        <MobileControls
          moveInputRef={moveInputRef}
          visible={selectedExhibit === null}
          onReset={handleReset}
          onTeleport={handleTeleport}
        />
      )}

      {/* Interactive Wayfinding Prompt when near directory */}
      <WayfindingPrompt
        visible={isNearDirectory && selectedExhibit === null}
        onTeleport={handleTeleport}
      />

      {/* Information Panel Modal */}
      <ExhibitInformationPanel
        selected={selectedExhibit}
        onClose={handleClose}
      />

      {/* Real-time F3 Debug Diagnostics HUD */}
      {cullingStats && <CullingDebugOverlay stats={cullingStats} />}
    </div>
  )
}
