import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import type { SelectedExhibit, SectionType } from './types'
import type { Founder, HistoryExhibit } from './data/exhibits'
import { UNDIP_LEADERSHIP_13, HISTORY_EXHIBITS } from './data/exhibits'
import {
  PODIUM_POS,
  SECTION_TARGETS,
  START_POSITION,
} from './layout'
import { GalleryEnvironment } from './GalleryEnvironment'
import { GalleryLighting } from './GalleryLighting'
import { FoundersWing } from './FoundersWing'
import { HistoryArchivesWing } from './HistoryArchivesWing'
import { CeremonialPodium } from './CeremonialPodium'
import { FirstPersonControls } from './FirstPersonControls'
import { DesktopHints } from './DesktopHints'
import { MobileControls } from './MobileControls'
import { ExhibitInformationPanel } from './ExhibitInformationPanel'
import { WayfindingPrompt } from './WayfindingPrompt'
import { ZoneGraphicsController } from '../graphics'
import {
  CaptionUI,
  CHAPTERS,
  CinematicIntro,
  GoldenDustParticles,
  INTRO_STORAGE_KEY,
  NARRATIVE_SLIDES,
  type CinematicStateUpdate,
  type IntroPhase,
} from '../cinematic'
import './gallery.css'

const checkIsFirstVisit = (): boolean => {
  try {
    return window.localStorage.getItem(INTRO_STORAGE_KEY) !== 'true'
  } catch {
    return true
  }
}

const markIntroSeen = () => {
  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, 'true')
  } catch {
    // Ignore storage restriction errors
  }
}

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

/**
 * Museum Virtual Undip - Master 3D Gallery Scene
 * Requirements implemented:
 * - Minimal-space large area divided into side sections
 * - 13 Photos of founders on the left, UNDIP history & archives on the right
 * - Red carpet, miniature map of Undip, and ceremonial podium on the center axis
 * - Rectangular ceiling roof with alternating large and small rectangular gaps
 * - Palette: Navy Blue, Gold, Ivory, Heritage Brown
 * - Sidebar preserved on right with expand/contract button (diagonal arrows)
 *   to expand into a large centered modal with clear text
 * - Proximity-based directory board: "Mau kemana??" appears when near the board
 * - Added 3D assets: Archival bookshelves, glass tables, visitor armchairs
 * - Aesthetic museum mood lighting & warm downlights
 */
interface Zone1Props {
  onSwitchZone?: (zoneId: any) => void
  onIntroStateChange?: (isActive: boolean) => void
}

export function Zone1({
  onSwitchZone: _onSwitchZone,
  onIntroStateChange,
}: Zone1Props = {}) {
  const isMobile = useIsMobile()
  const [selectedExhibit, setSelectedExhibit] = useState<SelectedExhibit | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null)
  const [isNearDirectory, setIsNearDirectory] = useState(false)
  const [introPhase, setIntroPhase] = useState<IntroPhase>(() =>
    checkIsFirstVisit() ? 'title' : 'done',
  )
  const [narrativeSlideIndex, setNarrativeSlideIndex] = useState(0)
  const [isIntroFading, setIsIntroFading] = useState(false)
  const isIntroActive = introPhase !== 'done'
  const isTourPlaying = introPhase === 'tour'

  useEffect(() => {
    onIntroStateChange?.(isIntroActive)
  }, [isIntroActive, onIntroStateChange])
  const [cinematicState, setCinematicState] = useState<CinematicStateUpdate>({
    chapter: CHAPTERS[0],
    telemetry: {
      chapterId: CHAPTERS[0].id,
      primaryValue: 'Initializing...',
      secondaryValue: 'Checking runtime assets',
    },
    progressPercent: 0,
  })

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

  const handleSelectFounder = useCallback((founder: Founder) => {
    if (draggedRef.current) return
    setSelectedExhibit({ type: 'founder', data: founder })
  }, [])

  const handleSelectHistory = useCallback((exhibit: HistoryExhibit) => {
    if (draggedRef.current) return
    setSelectedExhibit({ type: 'history', data: exhibit })
  }, [])

  const handleSelectPodium = useCallback(() => {
    if (draggedRef.current) return
    setSelectedExhibit({
      type: 'podium',
      data: {
        id: 'ceremonial-podium',
        title: 'Podium Kehormatan Universitas Diponegoro',
        subtitle: 'Simbol Wibawa & Tradisi Dies Natalis',
        description: 'Podium resmi upacara akademik dan orasi ilmiah universitas.',
      },
    })
  }, [])

  const handleSelectPrasasti = useCallback(() => {
    if (draggedRef.current) return
    setSelectedExhibit({
      type: 'prasasti',
      data: {
        id: 'prasasti-undip',
        title: 'Prasasti Pendirian & Peresmian Universitas Diponegoro',
        subtitle: 'Batu Marmer Hitam Obsidian • 9 Januari 1957',
        description: 'Prasasti bersejarah peresmian Universitas Diponegoro oleh Presiden Sukarno.',
      },
    })
  }, [])

  const handleHover = useCallback((id: string | null) => setHoveredId(id), [])
  const handleReset = useCallback(() => {
    setResetSignal((signal) => signal + 1)
    setTargetPosition(null)
  }, [])
  const handleClose = useCallback(() => setSelectedExhibit(null), [])

  const finishIntro = useCallback(() => {
    markIntroSeen()
    setIsIntroFading(true)
    setTimeout(() => {
      setIntroPhase('done')
      setIsIntroFading(false)
    }, 550)
  }, [])

  const handleAdvancePhase = useCallback(() => {
    if (introPhase === 'title') {
      setNarrativeSlideIndex(0)
      setIntroPhase('statement')
      return
    }
    if (introPhase === 'statement') {
      if (narrativeSlideIndex < NARRATIVE_SLIDES.length - 1) {
        setNarrativeSlideIndex((idx) => idx + 1)
      } else {
        // Hilangkan blur lalu kamera dolly masuk ke ruangan
        setIsIntroFading(true)
        setTimeout(() => {
          setIsIntroFading(false)
          setIntroPhase('tour')
        }, 550)
      }
    }
  }, [introPhase, narrativeSlideIndex])

  const handleReplayIntro = useCallback(() => {
    setSelectedExhibit(null)
    setTargetPosition(null)
    setIsIntroFading(false)
    setNarrativeSlideIndex(0)
    setCinematicState({
      chapter: CHAPTERS[0],
      telemetry: {
        chapterId: CHAPTERS[0].id,
        primaryValue: 'Initializing...',
        secondaryValue: 'Replaying engine showcase',
      },
      progressPercent: 0,
    })
    setIntroPhase('title')
  }, [])

  const handleTeleport = useCallback((section: SectionType) => {
    setTargetPosition(SECTION_TARGETS[section])
  }, [])

  const selectedFounderId =
    selectedExhibit?.type === 'founder' ? (selectedExhibit.data as Founder).id : null
  const selectedHistoryId =
    selectedExhibit?.type === 'history' ? (selectedExhibit.data as HistoryExhibit).id : null

  return (
    <div className={`gr-root${isMobile ? ' is-mobile' : ''}`}>
      {/* Accessible Screen-Reader & Keyboard Traversal for 3D Exhibits */}
      <nav aria-label="Navigasi Aksesibilitas Koleksi Pameran Zona 1" className="gr-sr-only-nav">
        <a href="#zone1-exhibits" className="gr-skip-nav">
          Loncat ke Daftar Aksesibel Koleksi Pameran Zona 1
        </a>
        <div id="zone1-exhibits" className="sr-only">
          <h3>Daftar Pameran Tokoh Pendiri & Dokumen Sejarah Undip</h3>
          <ul>
            {UNDIP_LEADERSHIP_13.map((founder) => (
              <li key={founder.id}>
                <button
                  type="button"
                  onClick={() => handleSelectFounder(founder)}
                >
                  Buka Informasi Tokoh: {founder.name} ({founder.title})
                </button>
              </li>
            ))}
            {HISTORY_EXHIBITS.map((hist) => (
              <li key={hist.id}>
                <button
                  type="button"
                  onClick={() => handleSelectHistory(hist)}
                >
                  Buka Arsip Sejarah: {hist.title} ({hist.period})
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={handleSelectPodium}>
                Buka Informasi Podium Kehormatan Universitas Diponegoro
              </button>
            </li>
            <li>
              <button type="button" onClick={handleSelectPrasasti}>
                Buka Informasi Prasasti Pendirian 1957
              </button>
            </li>
          </ul>
        </div>
      </nav>


      <Canvas
        dpr={[1, isMobile ? 1.0 : 1.5]}
        gl={{
          antialias: !isMobile,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        onPointerMissed={() => setSelectedExhibit(null)}
      >
        <ZoneGraphicsController zone="zone1" />
        <color attach="background" args={['#0e1724']} />
        <fog attach="fog" args={['#0e1724', 15, 60]} />

        <PerspectiveCamera
          makeDefault
          position={START_POSITION}
          fov={isMobile ? 66 : 56}
          near={0.1}
          far={55}
        />

        <Suspense fallback={null}>
          <group>
            <GoldenDustParticles active={isIntroActive} />
            <GalleryLighting castShadows={!isMobile} isMobile={isMobile} />
            <GalleryEnvironment isNearDirectory={isNearDirectory} isMobile={isMobile} />

            {/* Section 1 (Left Side): 13 Photos of UNDIP Founders */}
            <FoundersWing
              selectedFounderId={selectedFounderId}
              hoveredId={hoveredId}
              isMobile={isMobile}
              onSelectFounder={handleSelectFounder}
              onHover={handleHover}
            />

            {/* Section 2 (Right Side): UNDIP's History, Early Photos, Founding Decree, & Archives */}
            <HistoryArchivesWing
              selectedExhibitId={selectedHistoryId}
              hoveredId={hoveredId}
              isMobile={isMobile}
              onSelectExhibit={handleSelectHistory}
              onHover={handleHover}
            />

            {/* Center End: Ceremonial Dais & Podium with Inscription Plaque (Prasasti) */}
            <CeremonialPodium
              position={PODIUM_POS}
              isSelected={selectedExhibit?.type === 'podium'}
              isHovered={hoveredId === 'podium'}
              isMobile={isMobile}
              onSelect={handleSelectPodium}
              onSelectPrasasti={handleSelectPrasasti}
              onHover={handleHover}
            />

            <CinematicIntro
              active={isTourPlaying}
              isIntroOpen={isIntroActive}
              baseFov={isMobile ? 66 : 56}
              onStateUpdate={setCinematicState}
              onComplete={finishIntro}
            />
          </group>
        </Suspense>

        <FirstPersonControls
          resetSignal={resetSignal}
          targetPosition={targetPosition}
          moveInputRef={moveInputRef}
          hoveredRef={hoveredRef}
          panelOpenRef={panelOpenRef}
          draggedRef={draggedRef}
          onProximityChange={setIsNearDirectory}
          disabled={isIntroActive}
        />
      </Canvas>


      {/* Cinematic Intro Title, Editorial Statement, Letterbox & Captions */}
      <CaptionUI
        phase={introPhase}
        narrativeSlideIndex={narrativeSlideIndex}
        chapter={cinematicState.chapter}
        telemetry={cinematicState.telemetry}
        progressPercent={cinematicState.progressPercent}
        isFadingOut={isIntroFading}
        onAdvancePhase={handleAdvancePhase}
        onSkip={finishIntro}
      />

      {/* Replay Intro Button (Top-Right when in active gameplay) */}
      {!isIntroActive && (
        <button
          type="button"
          className="cinematic-replay-btn"
          onClick={handleReplayIntro}
          title="Putar Ulang Intro Sinematik Engine"
        >
          <span className="cinematic-replay-icon">▶</span>
          <span>Replay Intro</span>
        </button>
      )}

      {/* Subtle Desktop Hints */}
      {!isIntroActive && !isMobile && <DesktopHints />}

      {/* Mobile Touch Controls */}
      {!isIntroActive && isMobile && (
        <MobileControls
          moveInputRef={moveInputRef}
          visible={selectedExhibit === null}
          onReset={handleReset}
          onTeleport={handleTeleport}
        />
      )}

      {/* Interactive Wayfinding Prompt: Appears ONLY when near the Directory Board */}
      {!isIntroActive && (
        <WayfindingPrompt
          visible={isNearDirectory && selectedExhibit === null}
          onTeleport={handleTeleport}
        />
      )}

      {/* Information Panel: Default right sidebar, expandable to large center modal */}
      <ExhibitInformationPanel
        selected={selectedExhibit}
        onClose={handleClose}
      />
    </div>
  )
}

export { Zone1 as Zone1Scene, Zone1 as GalleryScene }
