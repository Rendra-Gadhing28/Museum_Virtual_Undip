/**
 * CaptionUI — Editorial Title Screen, Single Description Screen, & Cinematic Letterbox HUD
 *
 * Phases:
 * - 'title': Fullscreen dark obsidian title screen ("Museum Virtual Undip") with 1.2s line-by-line enter/exit
 *            Waits for `isCanvasReady` before starting the entrance animation.
 * - 'statement': Single centered description screen about Museum Virtual Undip with 1.2s line-by-line enter/exit
 * - 'tour': Letterbox bars, bottom-left door caption, & Skip
 */

import { useEffect, useRef, useState } from 'react'
import type { ChapterConfig } from './config'
import type { TelemetrySnapshot } from './Telemetry'
import { museumAudio } from '../audio'
import './cinematic.css'

export type IntroPhase = 'title' | 'statement' | 'tour' | 'done'

export interface NarrativeSlide {
  heading: string
  body: string
}

export const NARRATIVE_SLIDES: NarrativeSlide[] = [
  {
    heading: 'Ruang Sejarah Digital Universitas Diponegoro',
    body: 'Menghadirkan perjalanan Universitas Diponegoro sejak prakarsa pendirian tahun 1956, kepemimpinan rektorat dari masa ke masa, hingga transformasi fisik menuju universitas riset berkelas dunia dalam diorama 3D interaktif.',
  },
]

interface CaptionUIProps {
  phase: IntroPhase
  isCanvasReady?: boolean
  narrativeSlideIndex?: number
  chapter: ChapterConfig
  telemetry: TelemetrySnapshot | null
  progressPercent: number
  isFadingOut: boolean
  onAdvancePhase: () => void
  onSkip: () => void
}

const EXIT_WAIT_MS = 1440

export function CaptionUI({
  phase,
  isCanvasReady = true,
  chapter,
  telemetry,
  progressPercent,
  isFadingOut,
  onAdvancePhase,
  onSkip,
}: CaptionUIProps) {
  const [exitingPhase, setExitingPhase] = useState<IntroPhase | null>(null)
  const exitTimerRef = useRef<number | null>(null)

  const isExitingLines = exitingPhase === phase

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current)
        exitTimerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (exitingPhase && exitingPhase !== phase) {
      setExitingPhase(null)
    }
  }, [phase, exitingPhase])

  const triggerLineExitAdvance = () => {
    if (!isCanvasReady || isExitingLines || isFadingOut) return
    museumAudio.unlock()
    museumAudio.startBgm()
    museumAudio.playUiClick()
    setExitingPhase(phase)
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current)
    }
    exitTimerRef.current = window.setTimeout(() => {
      exitTimerRef.current = null
      onAdvancePhase()
    }, EXIT_WAIT_MS)
  }

  useEffect(() => {
    if (phase === 'done') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onSkip()
        return
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        if (phase === 'title' || phase === 'statement') {
          triggerLineExitAdvance()
        } else if (phase === 'tour') {
          onSkip()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true })
  })

  if (phase === 'done') return null

  if (phase === 'title' || phase === 'statement') {
    const activeSlide = NARRATIVE_SLIDES[0]

    return (
      <div
        className={`cinematic-title-screen ${phase === 'title' ? 'cin-phase-title' : 'cin-phase-statement'} ${!isCanvasReady ? 'cin-waiting' : ''} ${isExitingLines ? 'is-exiting-lines' : ''} ${isFadingOut ? 'is-fading-out' : ''}`}
        onClick={triggerLineExitAdvance}
        role={phase === 'title' ? 'button' : 'dialog'}
        tabIndex={0}
        aria-label={
          phase === 'title'
            ? 'Museum Virtual Undip — Klik di mana saja untuk masuk'
            : 'Deskripsi Museum Virtual Undip'
        }
      >
        <div className="cinematic-ambient-glow" aria-hidden="true" />

        {phase === 'title' ? (
          <div key="text-title" style={{ display: 'contents' }}>
            <div className="cinematic-title-content">
              <span className="cinematic-eyebrow cin-line cin-line-1" style={{ letterSpacing: '6px', fontSize: '0.9rem', color: '#d4af37', fontWeight: 600 }}>
                WELCOME TO
              </span>
              <h1 className="cinematic-hero-title">
                <span className="cin-line cin-line-2" style={{ display: 'block', fontSize: '3.6rem', letterSpacing: '4px', textTransform: 'uppercase' }}>
                  Museum Virtual
                </span>
                <span className="cinematic-hero-italic cin-line cin-line-3" style={{ fontSize: '3.4rem', color: '#fae19c' }}>
                  Undip
                </span>
                <span className="cinematic-hero-gold-underline cin-line cin-line-3" aria-hidden="true" />
              </h1>
              <p className="cinematic-hero-sub cin-line cin-line-4" style={{ letterSpacing: '3px', marginTop: '12px', opacity: 0.85 }}>
                DIORAMA SEJARAH 3D INTERAKTIF BERBASIS WEB
              </p>
            </div>
            <div className="cinematic-enter-prompt cin-line cin-line-5">
              {isCanvasReady ? 'KLIK DI MANA SAJA UNTUK MASUK' : 'MEMUAT RUANG 3D...'}
            </div>
          </div>
        ) : (
          <div key="text-statement" style={{ display: 'contents' }}>
            <div className="cinematic-statement-content">
              <div className="cinematic-slide-counter cin-line cin-line-1" aria-hidden="true">
                TENTANG MUSEUM VIRTUAL
              </div>
              <h2 className="cinematic-statement-heading cin-line cin-line-2">
                {activeSlide.heading}
              </h2>
              <p className="cinematic-statement-body cin-line cin-line-3">
                {activeSlide.body}
              </p>
            </div>
            <div className="cinematic-statement-actions cin-line cin-line-4">
              <button
                type="button"
                className="cinematic-continue-prompt"
                onClick={(e) => {
                  e.stopPropagation()
                  triggerLineExitAdvance()
                }}
              >
                KLIK ATAU TEKAN SPACE UNTUK MULAI TUR SINEMATIK
              </button>
              <button
                type="button"
                className="cinematic-statement-skip"
                onClick={(e) => {
                  e.stopPropagation()
                  onSkip()
                }}
              >
                LEWATI KE GALERI [ESC]
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      key="phase-tour"
      className={`cinematic-overlay-root ${isFadingOut ? 'is-fading-out' : ''}`}
      role="region"
      aria-label="Sinematik Pembuka Museum Engine"
    >
      {/* Top & Bottom Letterbox Bars */}
      <div className="cinematic-letterbox-top" aria-hidden="true">
        <div
          className="cinematic-progress-line"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>
      <div className="cinematic-letterbox-bottom" aria-hidden="true" />

      {/* Top-right Skip Button (accessible, keyboard focusable) */}
      <button
        type="button"
        className="cinematic-skip-btn"
        onClick={onSkip}
        aria-label="Lewati intro sinematik (Spasi atau Escape)"
      >
        <span>SKIP INTRO</span>
        <kbd>ESC / SPACE</kbd>
      </button>

      {/* Bottom-left Consistent Caption Container (above letterbox) */}
      <div className="cinematic-caption-wrap" key={chapter.id}>
        <div className="cinematic-caption-meta">
          {chapter.chapterNumber !== null ? (
            <span className="cinematic-chapter-badge">
              RUANG 0{chapter.chapterNumber} / 0{chapter.totalTechChapters}
            </span>
          ) : (
            <span className="cinematic-chapter-badge">MUSEUM VIRTUAL UNDIP</span>
          )}
          <span className="cinematic-telemetry-label">{chapter.telemetryLabel}</span>
        </div>

        <h2 className="cinematic-caption-title">{chapter.title}</h2>
        <p className="cinematic-caption-desc">{chapter.description}</p>

        {telemetry && (
          <div className="cinematic-telemetry-readout">
            <span className="cinematic-telemetry-primary">{telemetry.primaryValue}</span>
            <span className="cinematic-telemetry-sep">•</span>
            <span className="cinematic-telemetry-secondary">{telemetry.secondaryValue}</span>
          </div>
        )}
      </div>
    </div>
  )
}
