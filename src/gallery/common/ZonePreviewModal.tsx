import type { ZoneMeta } from '../Zone2/types'
import { DOMEntityCuller } from '../../perf/core/useDOMEntityCulling'

interface ZonePreviewModalProps {
  zone: ZoneMeta | null
  onClose: () => void
}

/**
 * Preview Modal for Upcoming Museum Zones (Zone 3, 4, 5)
 * Optimized with DOM Entity Culling for lazy mounting and zero layout shift.
 */
export function ZonePreviewModal({ zone, onClose }: ZonePreviewModalProps) {
  if (!zone) return null

  return (
    <div className="gr-scrim gr-scrim-visible" onClick={onClose} role="dialog" aria-modal="true">
      <div className="gr-preview-dialog" onClick={(e) => e.stopPropagation()}>
        <header className="gr-preview-header">
          <div className="gr-badge">🏛️ PREVIEW ZONA MUSEUM VIRTUAL UNDIP</div>
          <h2 className="gr-preview-title" style={{ color: zone.accentColor }}>
            Zona {zone.number}: {zone.title}
          </h2>
          <p className="gr-preview-subtitle">{zone.subtitle}</p>
        </header>

        <DOMEntityCuller className="gr-preview-body" minHeight={250} once>
          <div className="gr-preview-badge-row">
            <span className="gr-preview-chip" style={{ borderColor: zone.accentColor, color: zone.accentColor }}>
              Status: {zone.badge}
            </span>
            <span className="gr-preview-era">Fokus Era: {zone.theme}</span>
          </div>

          <p className="gr-preview-desc">{zone.description}</p>

          <div className="gr-highlights-box" style={{ marginTop: '18px' }}>
            <h4 className="gr-sec-title">Rancangan Konten & Diorama:</h4>
            <ul className="gr-highlights-list">
              {zone.number === 3 && (
                <>
                  <li><strong>Artefak Akademik:</strong> Toga rektor pertama, lencana kehormatan, dan medali kebesaran universitas.</li>
                  <li><strong>Memorabilia Tokoh:</strong> Mesin ketik bersejarah Mr. Soedarto dan kacamata Mr. Imam Bardjo.</li>
                  <li><strong>Koleksi Audiovisual:</strong> Rekaman suara pidato Dies Natalis Presiden Soekarno 1960.</li>
                </>
              )}
              {zone.number === 4 && (
                <>
                  <li><strong>Kampus Modern Terpadu:</strong> Kompleks laboratorium robotika, biomedis, dan riset nano.</li>
                  <li><strong>Smart Library:</strong> Akses jutaan repositori digital dan jurnal bereputasi internasional.</li>
                  <li><strong>Prestasi Internasional:</strong> Medali kompetisi inovasi global di Jenewa, Tokyo, dan London.</li>
                </>
              )}
              {zone.number === 5 && (
                <>
                  <li><strong>Digital Campus & AI:</strong> Integrasi Artificial Intelligence dalam riset kelautan dan administrasi.</li>
                  <li><strong>Green & Sustainable Campus:</strong> Kampus nol emisi karbon dan konservasi energi terbarukan.</li>
                  <li><strong>World Class University:</strong> Kolaborasi 5 benua menuju peradaban dunia yang berkeadilan.</li>
                </>
              )}
            </ul>
          </div>

          <div className="gr-preview-notice">
            <span>ℹ️</span>
            <p>
              Zona ini sedang dalam tahap kurasi digital dan digitalisasi aset 3D.
              Silakan jelajahi <strong>Zona 1 (The Origin of Undip)</strong> dan <strong>Zona 2 (The Growth of Knowledge)</strong> yang sudah terbuka penuh!
            </p>
          </div>
        </DOMEntityCuller>

        <footer className="gr-preview-footer">
          <button type="button" className="gr-continue" onClick={onClose}>
            Tutup Pratinjau
          </button>
        </footer>
      </div>
    </div>
  )
}
