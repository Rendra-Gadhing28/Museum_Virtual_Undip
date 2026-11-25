import { useEffect, useRef, useState } from 'react'
import type { SelectedZone4Exhibit } from './types'
import { DOMEntityCuller } from '../../perf/core/useDOMEntityCulling'

interface Zone4InfoPanelProps {
  selected: SelectedZone4Exhibit | null
  onClose: () => void
}

/**
 * Panel Informasi Pameran Zona 4
 * Memakai struktur arsitektural dan CSS classes yang identik dengan Zona 1 & 2:
 * - Scrim backdrop modal
 * - Panel expandable (bisa mode sidebar atau expanded center modal)
 * - Skema warna Royal Navy & Warm Gold
 * - Highlights list dengan icon dan tipografi berwibawa
 * - DOM Entity Culling untuk performa rendering tinggi
 */
export function Zone4InfoPanel({ selected, onClose }: Zone4InfoPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    if (selected) {
      closeRef.current?.focus()
      setIsExpanded(true)
    }
  }, [selected])

  useEffect(() => {
    if (!selected) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, onClose])

  if (!selected) return null

  const data = selected.data

  const getBadgeLabel = () => {
    switch (selected.type) {
      case 'campus':
        return '🏛️ Kampus Modern & Maket Tembalang'
      case 'lab':
        return '🔬 Laboratorium Terpadu & Riset Unggulan'
      case 'library':
        return '📚 Perpustakaan Digital & Repositori'
      case 'achievement':
        return '🏆 Panggung Prestasi & Pengakuan Global'
      default:
        return '✨ Inovasi & Kontribusi Terkini'
    }
  }

  return (
    <>
      {/* Modal Scrim Backdrop */}
      <div
        className={`gr-scrim${isExpanded ? ' gr-scrim-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`gr-panel ${isExpanded ? 'gr-panel-expanded' : 'gr-panel-sidebar'}`}
        role="dialog"
        aria-label="Exhibition Details"
      >
        <header className="gr-panel-head">
          <div className="gr-panel-title">
            <span className="gr-badge">{getBadgeLabel()}</span>
            <h2 className="gr-name">{data.title}</h2>
            {data.subtitle && <p className="gr-role">{data.subtitle}</p>}
          </div>

          <div className="gr-panel-actions">
            {/* Toggle Expand Modal */}
            <button
              type="button"
              className="gr-btn-expand"
              onClick={() => setIsExpanded((prev) => !prev)}
              title={isExpanded ? 'Perkecil ke Sidebar' : 'Perbesar ke Tengah Layar'}
              aria-label={isExpanded ? 'Perkecil' : 'Perbesar'}
            >
              {isExpanded ? '⤢' : '⤡'}
            </button>

            {/* Tombol Tutup */}
            <button
              ref={closeRef}
              type="button"
              className="gr-btn-close"
              onClick={onClose}
              title="Tutup Panel (Esc)"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>
        </header>

        <DOMEntityCuller className="gr-panel-body" minHeight={200} once>
          {/* Metadata Grid */}
          <div className="gr-meta-grid">
            {data.year && (
              <div className="gr-meta-item">
                <span className="gr-meta-k">Tahun / Periode</span>
                <span className="gr-meta-v">{data.year}</span>
              </div>
            )}
            {data.leadScientist && (
              <div className="gr-meta-item">
                <span className="gr-meta-k">Ketua Peneliti / Tim</span>
                <span className="gr-meta-v">{data.leadScientist}</span>
              </div>
            )}
            {data.journal && (
              <div className="gr-meta-item">
                <span className="gr-meta-k">Jurnal / Publikasi</span>
                <span className="gr-meta-v">{data.journal}</span>
              </div>
            )}
            {data.rank && (
              <div className="gr-meta-item">
                <span className="gr-meta-k">Peringkat / Capaian</span>
                <span className="gr-meta-v" style={{ color: '#ffd700', fontWeight: 700 }}>
                  {data.rank}
                </span>
              </div>
            )}
          </div>

          {/* Deskripsi Lengkap Kuratorial */}
          <div className="gr-bio-text">
            <p>{data.description}</p>
            {data.fullContent && <p>{data.fullContent}</p>}
          </div>

          {/* Sorotan Utama / Inovasi */}
          {((data.highlights && data.highlights.length > 0) ||
            (data.innovations && data.innovations.length > 0)) && (
            <div className="gr-highlights-card">
              <h4 className="gr-highlights-title">SOROTAN UTAMA & INOVASI:</h4>
              <ul className="gr-highlights-list">
                {(data.highlights || data.innovations || []).map((h, i) => (
                  <li key={i} className="gr-highlight-item">
                    <span className="gr-bullet">✦</span> {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DOMEntityCuller>
      </aside>
    </>
  )
}
