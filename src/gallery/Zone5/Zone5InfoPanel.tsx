import type { SelectedZone5Exhibit } from './types'
import { DOMEntityCuller } from '../../perf/core/useDOMEntityCulling'

interface Zone5InfoPanelProps {
  selected: SelectedZone5Exhibit | null
  onClose: () => void
}

/**
 * Panel Informasi Detail Pameran Zona 5: Undip Future
 * Glassmorphism Navy Blue (#0B1F3A) & Warm Gold (#C9A24B)
 */
export function Zone5InfoPanel({ selected, onClose }: Zone5InfoPanelProps) {
  if (!selected) return null

  const { data } = selected

  return (
    <div className="z5-panel-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="z5-panel-modal" onClick={(e) => e.stopPropagation()}>
        {/* Tombol Tutup */}
        <button type="button" className="z5-panel-close-btn" onClick={onClose} aria-label="Tutup Panel">
          ✕
        </button>

        {/* Badge Kategori */}
        <div className="z5-panel-badge-container">
          <span className="z5-panel-badge">ZONA 5 • UNDIP FUTURE</span>
          {data.stats && <span className="z5-panel-status-pill">{data.stats}</span>}
        </div>

        {/* Judul & Subtitle */}
        <h2 className="z5-panel-title">{data.title}</h2>
        {data.subtitle && <p className="z5-panel-subtitle">{data.subtitle}</p>}

        {/* Garis Aksen Emas */}
        <div className="z5-panel-gold-divider" />

        {/* Deskripsi Kuratorial */}
        <DOMEntityCuller className="z5-panel-body" minHeight={200} once>
          <p className="z5-panel-desc">{data.description}</p>

          {/* Highlights Inovasi / Target */}
          {data.highlights && data.highlights.length > 0 && (
            <div className="z5-panel-highlights">
              <h4 className="z5-highlights-title">Inisiatif & Capaian Unggulan:</h4>
              <ul className="z5-highlights-list">
                {data.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
        </DOMEntityCuller>

        {/* Footer Panel */}
        <div className="z5-panel-footer">
          <span className="z5-panel-note">
            Museum Virtual Universitas Diponegoro • Visi Peradaban 2050
          </span>
          <button type="button" className="z5-panel-action-btn" onClick={onClose}>
            Selesai Membaca
          </button>
        </div>
      </div>
    </div>
  )
}
