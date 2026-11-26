/**
 * CaptionUI — Editorial Title Screen, Statement Screen, & Cinematic Letterbox HUD
 *
 * Phases:
 * - 'title': Fullscreen dark obsidian title screen ("Museum Virtual Undip")
 * - 'statement': Centered editorial statement over dimmed 3D gallery
 * - 'tour': Letterbox bars, bottom-left chapter caption, real telemetry, & Skip
 */

import { useEffect } from 'react'
import type { ChapterConfig } from './config'
import type { TelemetrySnapshot } from './Telemetry'
import './cinematic.css'

export type IntroPhase = 'title' | 'statement' | 'tour' | 'done'

export interface NarrativeSlide {
  heading: string
  body: string
}

export const NARRATIVE_SLIDES: NarrativeSlide[] = [
  {
    heading: 'Obor Keilmuan di Pesisir Utara Jawa',
    body: 'Dari gagasan lima pendiri pada tahun 1956, lahir Universitas Diponegoro—sebuah ikhtiar menjaga ilmu pengetahuan, watak ksatria, dan pengabdian bagi bangsa.',
  },
  {
    heading: 'Jejak yang Hidup dalam Cahaya',
    body: 'Setiap bingkai potret, arsip sejarah, prasasti batu, dan maket kampus di ruangan ini menyimpan kisah perjalanan dari Pleburan menuju Tembalang.',
  },
  {
    heading: 'Melangkah Masuk ke Ruang Pameran',
    body: 'Silakan melangkah masuk dan menyusuri galeri virtual interaktif ini—setiap koleksi terbuka untuk Anda dekati dan pelajari.',
  },
]

interface CaptionUIProps {
  phase: IntroPhase
  narrativeSlideIndex?: number
  chapter: ChapterConfig
  telemetry: TelemetrySnapshot | null
  progressPercent: number
  isFadingOut: boolean
  onAdvancePhase: () => void
  onSkip: () => void
}

export function CaptionUI({
  phase,
  narrativeSlideIndex = 0,
  chapter,
  telemetry,
  progressPercent,
  isFadingOut,
  onAdvancePhase,
  onSkip,
}: CaptionUIProps) {
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
          onAdvancePhase()
        } else if (phase === 'tour') {
          onSkip()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [phase, onAdvancePhase, onSkip])

  if (phase === 'done') return null

  if (phase === 'title') {
    return (
      <div
        className={`cinematic-title-screen ${isFadingOut ? 'is-fading-out' : ''}`}
        onClick={onAdvancePhase}
        role="button"
        tabIndex={0}
        aria-label="Museum Virtual Undip — Klik di mana saja untuk masuk"
      >
        <div className="cinematic-ambient-glow" aria-hidden="true" />
        <div className="cinematic-title-content">
          <span className="cinematic-eyebrow">A DIGITAL EXHIBITION • UNIVERSITAS DIPONEGORO</span>
          <h1 className="cinematic-hero-title">
            Museum Virtual
            <span className="cinematic-hero-italic">Undip</span>
          </h1>
          <p className="cinematic-hero-sub">
            A WALKABLE 3D GALLERY, BUILT IN THE BROWSER
          </p>
        </div>
        <div className="cinematic-enter-prompt">CLICK ANYWHERE TO ENTER</div>
      </div>
    )
  }

  if (phase === 'statement') {
    const safeIdx = Math.min(Math.max(0, narrativeSlideIndex), NARRATIVE_SLIDES.length - 1)
    const activeSlide = NARRATIVE_SLIDES[safeIdx]
    const isLastSlide = safeIdx >= NARRATIVE_SLIDES.length - 1

    return (
      <div
        className={`cinematic-statement-screen ${isFadingOut ? 'is-fading-out' : ''}`}
        onClick={onAdvancePhase}
        role="dialog"
        aria-label="Narasi Pembuka Museum Virtual Undip"
      >
        <div key={safeIdx} className="cinematic-statement-content cinematic-crossfade-slide">
          <div className="cinematic-slide-counter" aria-hidden="true">
            {String(safeIdx + 1).padStart(2, '0')} / {String(NARRATIVE_SLIDES.length).padStart(2, '0')}
          </div>
          <h2 className="cinematic-statement-heading">
            {activeSlide.heading}
          </h2>
          <p className="cinematic-statement-body">
            {activeSlide.body}
          </p>
        </div>
        <div className="cinematic-statement-actions">
          <button
            type="button"
            className="cinematic-continue-prompt"
            onClick={(e) => {
              e.stopPropagation()
              onAdvancePhase()
            }}
          >
            {isLastSlide
              ? 'TEKAN SPACE UNTUK MASUK KE RUANGAN'
              : 'TEKAN SPACE UNTUK LANJUT'}
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
    )
  }

  return (
    <div
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
              ZONA 0{chapter.chapterNumber} / 0{chapter.totalTechChapters}
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
