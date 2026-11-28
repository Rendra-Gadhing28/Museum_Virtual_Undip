import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import type { SelectedExhibit, SectionType } from './types'
import type { Founder, HistoryExhibit } from './data/exhibits'
import { UNDIP_LEADERSHIP_13, HISTORY_EXHIBITS } from './data/exhibits'
import {
  BOUNDS,
  PODIUM_POS,
  SECTION_TARGETS,
  START_POSITION,
} from './layout'
import { GalleryEnvironment } from './GalleryEnvironment'
import { GalleryLighting } from './GalleryLighting'
import { CeremonialPodium } from './CeremonialPodium'
import { ThirdPersonControls } from './ThirdPersonControls'
import { DesktopHints } from './DesktopHints'
import { MobileControls } from './MobileControls'
import { ExhibitInformationPanel } from './ExhibitInformationPanel'
import { ZoneGraphicsController } from '../graphics'
import { AudioToggleButton, museumAudio } from '../audio'
import { Zone1SubRoom } from './Zone1SubRoom'
import {
  ZONE1_PORTAL_DOORS,
  computeSubRoomDimensions,
  getRoomExhibits,
  type Zone1RoomId,
} from './subRooms'
import {
  CaptionUI,
  CHAPTERS,
  CinematicIntro,
  GoldenDustParticles,
  INTRO_STORAGE_KEY,
  type CinematicStateUpdate,
  type IntroPhase,
} from '../cinematic'
import { MuseumInteractivePreloader } from '../cinematic/MuseumInteractivePreloader'
import './gallery.css'

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
 * Menandakan bahwa Suspense 3D di dalam <Canvas> telah selesai dimuat
 * dan siap menampilkan frame pertama sebelum animasi judul dimulai.
 */
function CanvasReadyNotifier({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    let raf2 = 0
    let timer = 0
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        timer = window.setTimeout(() => {
          onReady()
        }, 400)
      })
    })
    return () => {
      window.cancelAnimationFrame(raf1)
      if (raf2) window.cancelAnimationFrame(raf2)
      if (timer) window.clearTimeout(timer)
    }
  }, [onReady])
  return null
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
  const [activeRoomId, setActiveRoomId] = useState<Zone1RoomId | null>(null)
  const [spawnPosition, setSpawnPosition] = useState<[number, number, number]>(START_POSITION)
  const [resetSignal, setResetSignal] = useState(0)
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null)
  const [isNearDirectory, setIsNearDirectory] = useState(false)
  const [hasVisitedInitial, setHasVisitedInitial] = useState(false)
  const [introPhase, setIntroPhase] = useState<IntroPhase>('title')
  const [narrativeSlideIndex, setNarrativeSlideIndex] = useState(0)
  const [isIntroFading, setIsIntroFading] = useState(false)
  const [isCanvasReady, setIsCanvasReady] = useState(false)
  const handleCanvasReady = useCallback(() => setIsCanvasReady(true), [])
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

  useEffect(() => {
    return () => {
      museumAudio.stopBgm()
    }
  }, [])

  const handleSelectFounder = useCallback((founder: Founder) => {
    if (draggedRef.current) return
    museumAudio.unlock()
    museumAudio.playModalOpen()
    setSelectedExhibit({ type: 'founder', data: founder })
  }, [])

  const handleSelectHistory = useCallback((exhibit: HistoryExhibit) => {
    if (draggedRef.current) return
    museumAudio.unlock()
    museumAudio.playModalOpen()
    setSelectedExhibit({ type: 'history', data: exhibit })
  }, [])

  const handleSelectPodium = useCallback(() => {
    if (draggedRef.current) return
    museumAudio.unlock()
    museumAudio.playModalOpen()
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
    museumAudio.unlock()
    museumAudio.playModalOpen()
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

  const handleSelectStatue = useCallback((_statueId = 'diponegoro-statue') => {
    if (draggedRef.current) return
    museumAudio.unlock()
    museumAudio.playModalOpen()
    const diponegoroData = HISTORY_EXHIBITS.find((e) => e.id === 'artwork-diponegoro-center')
    setSelectedExhibit({
      type: 'monument',
      data: {
        id: 'monumen-pangeran-diponegoro',
        title: 'Monumen Agung Pangeran Diponegoro & Kuda Putih',
        category: 'Monumen Bersejarah',
        period: 'Simbol Kejuangan Undip',
        description:
          diponegoroData?.description ||
          'Patung ikonik Pangeran Diponegoro menunggangi kuda putih perkasa sebagai perlambang kejujuran, keberanian, dan keadilan.',
        fullContent:
          diponegoroData?.fullContent ||
          'Pangeran Diponegoro adalah pahlawan nasional yang memimpin Perang Jawa (1825–1830) melawan penindasan kolonialisme. Kepribadian beliau yang jujur, berani, adil, dan membela rakyat kecil menjadi teladan luhur bagi seluruh sivitas akademika Universitas Diponegoro.\n\nMonumen ini menggambarkan sang Pangeran menunggangi kuda putih perkasa di tengah kancah perjuangan, melambangkan kepemimpinan yang pantang menyerah dan berakar kuat pada nilai spiritual bangsa.',
        highlights: diponegoroData?.highlights || [
          'Simbol kepahlawanan patriotik bagi sivitas akademika',
          'Pemberian nama langsung oleh Presiden Sukarno pada 9 Januari 1960',
          'Nilai luhur: Kejujuran, Keberanian, dan Kepedulian Sosial',
        ],
        imagePath: '/textures/undip-emblem.webp',
      },
    })
  }, [])
  void handleSelectStatue

  const handleHover = useCallback((id: string | null) => {
    if (id && id !== hoveredRef.current) {
      museumAudio.playHover()
    }
    setHoveredId(id)
  }, [])
  const handleReset = useCallback(() => {
    setResetSignal((signal) => signal + 1)
    setTargetPosition(null)
  }, [])
  const handleClose = useCallback(() => {
    museumAudio.playModalClose()
    setSelectedExhibit(null)
  }, [])

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
      setIsIntroFading(false)
      setIntroPhase('tour')
    }
  }, [introPhase])

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

  const activePortal = useMemo(
    () => ZONE1_PORTAL_DOORS.find((p) => p.id === activeRoomId) ?? null,
    [activeRoomId],
  )

  const activeRoomDims = useMemo(() => {
    if (!activePortal) return null
    const { founders, histories } = getRoomExhibits(activePortal)
    return computeSubRoomDimensions(founders.length + histories.length, activePortal.id)
  }, [activePortal])

  const handleEnterRoom = useCallback((roomId: Zone1RoomId) => {
    if (draggedRef.current) return
    const portal = ZONE1_PORTAL_DOORS.find((p) => p.id === roomId)
    if (!portal) return
    museumAudio.unlock()
    museumAudio.playDoorTransition()
    const { founders, histories } = getRoomExhibits(portal)
    const dims = computeSubRoomDimensions(founders.length + histories.length, portal.id)
    setSelectedExhibit(null)
    setHoveredId(null)
    setActiveRoomId(roomId)
    setSpawnPosition(dims.spawnPosition)
    setTargetPosition(null)
  }, [])

  const handleExitRoom = useCallback(() => {
    if (draggedRef.current) return
    museumAudio.playDoorTransition()
    const lastPortal = ZONE1_PORTAL_DOORS.find((p) => p.id === activeRoomId)
    setSelectedExhibit(null)
    setHoveredId(null)
    setActiveRoomId(null)
    setSpawnPosition(lastPortal?.returnPosition ?? START_POSITION)
    setTargetPosition(null)
  }, [activeRoomId])

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
          {activePortal ? (
            <Zone1SubRoom
              portal={activePortal}
              selectedFounderId={selectedFounderId}
              selectedHistoryId={selectedHistoryId}
              hoveredId={hoveredId}
              isMobile={isMobile}
              onSelectFounder={handleSelectFounder}
              onSelectHistory={handleSelectHistory}
              onHover={handleHover}
              onExitRoom={handleExitRoom}
            />
          ) : (
            <group>
              <GoldenDustParticles active={isIntroActive} />
              <GalleryLighting castShadows={!isMobile} isMobile={isMobile} />
              <GalleryEnvironment
                isNearDirectory={isNearDirectory}
                hoveredId={hoveredId}
                isMobile={isMobile}
                portals={ZONE1_PORTAL_DOORS}
                onSelectPortal={handleEnterRoom}
                onHover={handleHover}
              />

              {/* Dinding Monumen Logo UNDIP dengan Lapisan Kayu Futuristik, Garis LED & Bendera */}
              <CeremonialPodium
                position={PODIUM_POS}
                isSelected={selectedExhibit?.type === 'podium'}
                isHovered={hoveredId === 'podium'}
                isMobile={isMobile}
                onSelect={() => {}}
                onSelectPrasasti={() => {}}
                onHover={handleHover}
              />

              <CinematicIntro
                active={isTourPlaying}
                isIntroOpen={isIntroActive}
                baseFov={isMobile ? 66 : 56}
                onStateUpdate={setCinematicState}
                onComplete={finishIntro}
              />
              <CanvasReadyNotifier onReady={handleCanvasReady} />
            </group>
          )}
        </Suspense>

        <Suspense fallback={null}>
          <ThirdPersonControls
            resetSignal={resetSignal}
            targetPosition={targetPosition}
            spawnPosition={spawnPosition}
            bounds={activeRoomDims?.bounds ?? BOUNDS}
            moveInputRef={moveInputRef}
            hoveredRef={hoveredRef}
            panelOpenRef={panelOpenRef}
            draggedRef={draggedRef}
            onProximityChange={setIsNearDirectory}
            disabled={isIntroActive}
          />
        </Suspense>
      </Canvas>


      {/* Interactive Heritage Preloader: Hanya saat awal pertama memuat halaman */}
      {introPhase === 'title' && !hasVisitedInitial && (
        <MuseumInteractivePreloader
          isReady={isCanvasReady}
          onLoaded={() => {
            setHasVisitedInitial(true)
            // Tetap di introPhase === 'title' agar masuk ke Canvas Judul Museum Virtual Undip!
          }}
        />
      )}

      {/* Cinematic Intro Title, Editorial Statement, Letterbox & Captions (Canvas Judul & Tur Kamera) */}
      {introPhase !== 'done' && (hasVisitedInitial || introPhase !== 'title') && (
        <CaptionUI
          phase={introPhase}
          isCanvasReady={isCanvasReady}
          narrativeSlideIndex={narrativeSlideIndex}
          chapter={cinematicState.chapter}
          telemetry={cinematicState.telemetry}
          progressPercent={cinematicState.progressPercent}
          isFadingOut={isIntroFading}
          onAdvancePhase={handleAdvancePhase}
          onSkip={finishIntro}
        />
      )}

      {/* Tombol Kembali ke Base Zone saat berada di dalam sub-ruangan */}
      {!isIntroActive && activePortal && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 95,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(10, 14, 23, 0.88)',
            backdropFilter: 'blur(12px)',
            padding: '8px 16px',
            borderRadius: '999px',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            color: '#fdfbf7',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
          }}
        >
          <button
            type="button"
            onClick={handleExitRoom}
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid #d4af37',
              color: '#ffd700',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Kembali ke Base Zone
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#e2e8f0' }}>
            {activePortal.doorNumber}: {activePortal.title}
          </span>
        </div>
      )}

      {/* Tombol Suara (BGM & SFX) + Replay Intro di Pojok Kanan Atas */}
      {!isIntroActive && (
        <>
          <AudioToggleButton />
          <button
            type="button"
            className="cinematic-replay-btn"
            onClick={() => {
              museumAudio.playUiClick()
              handleReplayIntro()
            }}
            title="Putar Ulang Intro Sinematik Engine"
          >
            <span className="cinematic-replay-icon">▶</span>
            <span>Replay Intro</span>
          </button>
        </>
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

      {/* Information Panel: Default right sidebar, expandable to large center modal */}
      <ExhibitInformationPanel
        selected={selectedExhibit}
        onClose={handleClose}
      />
    </div>
  )
}

export { Zone1 as Zone1Scene, Zone1 as GalleryScene }
