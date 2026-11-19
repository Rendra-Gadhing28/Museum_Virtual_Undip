import { useEffect, useMemo, useRef, useState } from 'react'
import type { SelectedExhibit } from './types'
import type { Founder, HistoryExhibit } from './data/exhibits'
import {
  createFounderDataURL,
  createHistoryDataURL,
} from './textures'

interface ExhibitInformationPanelProps {
  selected: SelectedExhibit | null
  onClose: () => void
}

/**
 * Museum Virtual Undip - Exhibition Information Panel
 * Dual Mode:
 * 1. Default: Classic Right-Hand Sidebar (preserving the original layout requested by user).
 * 2. Expanded Mode: Grand Centered Modal with enlarged text, full transcriptions,
 *    and clear readability, toggled by the diagonal expand button (top-right & bottom-left arrows).
 */
export function ExhibitInformationPanel({
  selected,
  onClose,
}: ExhibitInformationPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (selected) {
      closeRef.current?.focus()
      // Default to right sidebar when newly opened
      setIsExpanded(false)
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

  // Generate preview image based on exhibit type
  const previewSrc = useMemo(() => {
    if (!selected) return ''
    if (selected.type === 'founder') {
      const f = selected.data as Founder
      return f.imagePath && failedSrc !== f.imagePath
        ? f.imagePath
        : createFounderDataURL(f, 0)
    }
    if (selected.type === 'history') {
      const h = selected.data as HistoryExhibit
      return h.imagePath && failedSrc !== h.imagePath
        ? h.imagePath
        : createHistoryDataURL(h)
    }
    return ''
  }, [selected, failedSrc])

  if (!selected) return null

  const isFounder = selected.type === 'founder'
  const isHistory = selected.type === 'history'
  const isMap = selected.type === 'miniature-map'
  const isPodium = selected.type === 'podium'

  const founderData = isFounder ? (selected.data as Founder) : null
  const historyData = isHistory ? (selected.data as HistoryExhibit) : null

  return (
    <>
      {/* Scrim only shown when expanded to center modal, or on mobile */}
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
            <span className="gr-badge">
              {isFounder && '🏛️ 13 Tokoh Pendiri Undip'}
              {isHistory && `📜 ${historyData?.shortLabel || 'Arsip Sejarah'}`}
              {isMap && '🗺️ Maket Arsitektural'}
              {isPodium && '🎙️ Podium Kehormatan'}
            </span>

            <h2 className="gr-name">
              {isFounder && founderData?.name}
              {isHistory && historyData?.title}
              {isMap && 'Maket 3D Kampus Terpadu Universitas Diponegoro'}
              {isPodium && 'Podium Kehormatan Universitas Diponegoro'}
            </h2>

            <p className="gr-years">
              {isFounder && `${founderData?.title} • (${founderData?.years})`}
              {isHistory && historyData?.period}
              {isMap && 'Kawasan Tembalang & Pleburan, Semarang'}
              {isPodium && 'Simbol Wibawa & Nilai Perjuangan Diponegoro'}
            </p>
          </div>

          <div className="gr-panel-actions">
            {/* Button Luas: Panah Kanan Pojok Atas & Kiri Pojok Bawah (Diagonal Expand/Contract) */}
            <button
              type="button"
              className={`gr-btn-expand${isExpanded ? ' is-active' : ''}`}
              onClick={() => setIsExpanded((prev) => !prev)}
              title={isExpanded ? 'Perkecil ke bilah kanan' : 'Perluas tampilan (Modal Tengah)'}
              aria-label={isExpanded ? 'Perkecil modal' : 'Perluas modal ke tengah'}
            >
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isExpanded ? (
                  // Contract icon (inward arrows)
                  <>
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" y1="10" x2="21" y2="3" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </>
                ) : (
                  // Expand icon: diagonal arrows to top-right and bottom-left
                  <>
                    {/* Top-Right Arrow */}
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    {/* Bottom-Left Arrow */}
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </>
                )}
              </svg>
            </button>

            {/* Close Button */}
            <button
              ref={closeRef}
              type="button"
              className="gr-close"
              onClick={onClose}
              aria-label="Tutup panel informasi"
            >
              ×
            </button>
          </div>
        </header>

        <div className={`gr-panel-body${isExpanded ? ' gr-body-expanded' : ''}`}>
          {/* Visual Exhibition Media Preview */}
          {previewSrc && (
            <div className={`gr-media-wrap${isExpanded ? ' gr-media-expanded' : ''}`}>
              <img
                className="gr-portrait"
                src={previewSrc}
                alt={isFounder ? founderData?.name : historyData?.title}
                onError={() => {
                  if (isFounder) setFailedSrc(founderData?.imagePath ?? null)
                  if (isHistory) setFailedSrc(historyData?.imagePath ?? null)
                }}
              />
            </div>
          )}

          <div className="gr-content-wrap">
            {/* Founder Specific Description */}
            {isFounder && founderData && (
              <div className="gr-exhibit-text">
                <h4 className="gr-sec-title">Peran Sejarah Pendirian</h4>
                <p className="gr-desc-lead">{founderData.role}</p>

                <h4 className="gr-sec-title">Biografi & Dedikasi</h4>
                <p className="gr-desc-text">{founderData.description}</p>

                {founderData.quote && (
                  <blockquote className="gr-quote">
                    "{founderData.quote}"
                  </blockquote>
                )}
              </div>
            )}

            {/* History Specific Description */}
            {isHistory && historyData && (
              <div className="gr-exhibit-text">
                <h4 className="gr-sec-title">Ringkasan Koleksi</h4>
                <p className="gr-desc-lead">{historyData.description}</p>

                <h4 className="gr-sec-title">Naskah Dokumen & Catatan Sejarah</h4>
                <div className="gr-desc-content">
                  {historyData.fullContent.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {historyData.highlights && (
                  <div className="gr-highlights-box">
                    <h4 className="gr-sec-title">Poin Penting Dokumen:</h4>
                    <ul className="gr-highlights-list">
                      {historyData.highlights.map((hl, i) => (
                        <li key={i}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Miniature Map Specific Description */}
            {isMap && (
              <div className="gr-exhibit-text">
                <h4 className="gr-sec-title">Tentang Maket Kawasan Kampus</h4>
                <p className="gr-desc-lead">
                  Maket arsitektural 3D ini merepresentasikan tata ruang Kampus Terpadu
                  Universitas Diponegoro di Tembalang seluas lebih dari 180 hektar serta
                  kampus legendaris Pleburan di pusat kota Semarang.
                </p>

                <h4 className="gr-sec-title">Landmark & Fasilitas Utama:</h4>
                <ul className="gr-highlights-list">
                  <li><strong>Gedung Widya Puraya:</strong> Simbol monumental berbentuk piramida bertingkat yang menaungi rektorat dan sidang senat guru besar.</li>
                  <li><strong>Kompleks 11 Fakultas:</strong> Fakultas Hukum, Kedokteran, Teknik, Ekonomika & Bisnis, FSM, FISIP, FIB, FPIK, FPP, FKM, dan Psikologi.</li>
                  <li><strong>Sekolah Vokasi & Sekolah Pascasarjana:</strong> Pusat keahlian terapan dan riset doktoral terdepan.</li>
                  <li><strong>Waduk Undip & Hutan Kampus:</strong> Sistem penampungan air ramah lingkungan dan ruang terbuka hijau ekologis.</li>
                  <li><strong>Stadion & Pusat Kegiatan Mahasiswa:</strong> Sarana olahraga, seni, dan pengembangan kepemimpinan mahasiswa.</li>
                </ul>
              </div>
            )}

            {/* Ceremonial Podium Specific Description */}
            {isPodium && (
              <div className="gr-exhibit-text">
                <h4 className="gr-sec-title">Podium Kehormatan Universitas</h4>
                <p className="gr-desc-lead">
                  Podium berukir jati klasik dengan lambang emas Universitas Diponegoro ini
                  digunakan dalam sidang terbuka senat akademik, upacara Dies Natalis, orasi ilmiah
                  pengukuhan guru besar, serta wisuda sarjana.
                </p>

                <h4 className="gr-sec-title">Motto & Nilai-Nilai Luhur:</h4>
                <blockquote className="gr-quote">
                  "Pernah Jaya, Tetap Jaya, Makin Jaya"
                </blockquote>
                <p className="gr-desc-text">
                  Semangat kepahlawanan Pangeran Diponegoro menjadi teladan abadi sivitas akademika
                  dalam menjunjung tinggi kejujuran ilmiah, keberanian membela kebenaran,
                  kemandirian bangsa, dan pengabdian tulus bagi kesejahteraan rakyat Indonesia.
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="gr-panel-foot">
          <button type="button" className="gr-continue" onClick={onClose}>
            Kembali Menjelajah Museum
          </button>
        </footer>
      </aside>
    </>
  )
}
