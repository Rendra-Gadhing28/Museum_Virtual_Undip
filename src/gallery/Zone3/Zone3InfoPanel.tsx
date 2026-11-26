import { useEffect, useRef } from 'react'
import { ZONE3_CONFIG } from './zone3Config'
import { DOMEntityCuller } from '../../perf/core/useDOMEntityCulling'

interface Zone3InfoPanelProps {
  selectedItem: {
    type: 'inscription' | 'artifact' | 'memorabilia' | 'photo' | 'document' | 'audiovisual' | 'heritage-table' | 'muladi-dome'
    data: any
  } | null
  onClose: () => void
}

/**
 * Slide-In Glassmorphism Information Panel for Zone 3
 * Desain: Navy blue transparan (#0B1F3A), border emas (#C9A24B),
 * font serif klasik untuk judul, sans-serif tajam untuk isi, dengan opsi audio narasi.
 */
export function Zone3InfoPanel({ selectedItem, onClose }: Zone3InfoPanelProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (selectedItem) {
      closeBtnRef.current?.focus()
    }
  }, [selectedItem])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!selectedItem) return null

  const { type, data } = selectedItem
  const isInscription = type === 'inscription'
  const isArtifact = type === 'artifact'
  const isMemorabilia = type === 'memorabilia'
  const isPhoto = type === 'photo'
  const isDocument = type === 'document'
  const isAudiovisual = type === 'audiovisual'

  return (
    <>
      {/* Scrim Overlay Backdrop */}
      <div className="gr-scrim gr-scrim-visible" onClick={onClose} aria-hidden="true" />

      <aside className="gr-zone3-modal" role="dialog" aria-modal="true">
        {/* Modal Header */}
        <header className="gr-zone3-modal-header">
          <div className="gr-zone3-badge-wrap">
            <span className="gr-badge" style={{ borderColor: ZONE3_CONFIG.palette.gold }}>
              {isInscription && '🏛️ KOLEKSI UTAMA: PRASASTI PERESMIAN'}
              {isArtifact && '🎓 ARTEFAK AKADEMIK RESMI'}
              {isMemorabilia && '🏅 MEMORABILIA TOKOH PENDIRI'}
              {isPhoto && '📷 ARSIP FOTO SEJARAH (1956–1971)'}
              {isDocument && '📜 DOKUMEN & PIAGAM PENEGERIAN'}
              {isAudiovisual && '📽️ REKAMAN AUDIOVISUAL VINTAGE'}
              {type === 'muladi-dome' && '🏛️ MAKET AKBAR: MULADI DOME UNDIP'}
              {type === 'heritage-table' && '⚔️ PUSAKA KEHORMATAN DIPONEGORO'}
            </span>
            <span className="gr-zone3-era-tag">
              Era: {data.year || '1957'}
            </span>
          </div>

          <h2 className="gr-zone3-modal-title">
            {data.title || data.shortTitle}
          </h2>

          {data.subtitle && (
            <p className="gr-zone3-modal-subtitle">{data.subtitle}</p>
          )}

          <button
            ref={closeBtnRef}
            type="button"
            className="gr-close"
            onClick={onClose}
            aria-label="Tutup panel"
          >
            ×
          </button>
        </header>

        {/* Modal Body */}
        <DOMEntityCuller className="gr-zone3-modal-body" minHeight={200} once>
          {/* Section 1: Hero Prasasti Berdiri Detail */}
          {isInscription && (
            <div className="gr-zone3-inscription-detail">
              <div className="gr-zone3-stele-quote-box">
                <h4 className="gr-sec-title">Teks Ukiran Prasasti Asli (Pahat Emas)</h4>
                <blockquote className="gr-quote">
                  "{data.text}"
                </blockquote>
              </div>

              <div className="gr-zone3-meta-grid">
                <div className="gr-zone3-meta-item">
                  <span className="gr-meta-label">Bahan & Dimensi</span>
                  <strong className="gr-meta-val">{data.material} ({data.dimensions})</strong>
                </div>
                <div className="gr-zone3-meta-item">
                  <span className="gr-meta-label">Penandatangan</span>
                  <strong className="gr-meta-val">{data.signedBy}</strong>
                </div>
                <div className="gr-zone3-meta-item">
                  <span className="gr-meta-label">Sumber Arsip</span>
                  <strong className="gr-meta-val">{data.source}</strong>
                </div>
              </div>

              <div className="gr-highlights-box" style={{ marginTop: '16px' }}>
                <h4 className="gr-sec-title">Transkripsi & Nilai Luhur:</h4>
                <p className="gr-desc-text">{data.transcript}</p>
                <p className="gr-desc-text" style={{ marginTop: '8px', color: '#ffd700' }}>
                  ★ {data.translation}
                </p>
              </div>

              {/* Audio Narasi Bar */}
              <div className="gr-audio-narration-bar">
                <span className="gr-audio-icon">🎧</span>
                <div className="gr-audio-info">
                  <strong>Narasi Suara Sejarah Prasasti</strong>
                  <span>Kisah pembacaan prasasti & Dies Natalis Undip 1960</span>
                </div>
                <button
                  type="button"
                  className="gr-audio-play-pill"
                  onClick={() => alert('Memutar audio narasi arsip sejarah...')}
                >
                  ▶ Putar Suara
                </button>
              </div>
            </div>
          )}

          {/* Section 2: Artefak Akademik */}
          {isArtifact && (
            <div className="gr-zone3-artifact-detail">
              <p className="gr-desc-lead">{data.description}</p>
              <div className="gr-highlights-box">
                <h4 className="gr-sec-title">Karakteristik & Konservasi:</h4>
                <ul className="gr-highlights-list">
                  <li><strong>Kategori:</strong> {data.category}</li>
                  <li><strong>Tahun Akuisisi:</strong> {data.year}</li>
                  <li><strong>Kondisi Fisik:</strong> Terawat Sempurna (Ruang Beriklim Khusus)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Section 3: Memorabilia Tokoh */}
          {isMemorabilia && (
            <div className="gr-zone3-memorabilia-detail">
              <p className="gr-desc-lead">{data.description}</p>
              <div className="gr-highlights-box">
                <h4 className="gr-sec-title">Kaitan Historis Tokoh:</h4>
                <p className="gr-desc-text">{data.historicalSignificance}</p>
              </div>
            </div>
          )}

          {/* Section 4: Galeri Foto Sejarah */}
          {isPhoto && (
            <div className="gr-zone3-photo-detail">
              <p className="gr-desc-lead">{data.description}</p>
              <div className="gr-highlights-box">
                <h4 className="gr-sec-title">Informasi Arsip Foto:</h4>
                <ul className="gr-highlights-list">
                  <li><strong>Subjek:</strong> {data.subject}</li>
                  <li><strong>Tahun:</strong> {data.year}</li>
                  <li><strong>Lokasi Pengambilan:</strong> {data.location}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Section 5: Dokumen Penting */}
          {isDocument && (
            <div className="gr-zone3-document-detail">
              <p className="gr-desc-lead">{data.description}</p>
              <div className="gr-highlights-box">
                <h4 className="gr-sec-title">Autentisitas Naskah:</h4>
                <ul className="gr-highlights-list">
                  <li><strong>Bentuk Naskah:</strong> {data.type}</li>
                  <li><strong>Penetapan:</strong> {data.year}</li>
                  <li><strong>Status Hukum:</strong> {data.source}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Section 6: Koleksi Audiovisual */}
          {isAudiovisual && (
            <div className="gr-zone3-audiovisual-detail">
              <p className="gr-desc-lead">{data.description}</p>
              <div className="gr-highlights-box">
                <h4 className="gr-sec-title">Metadata Rekaman Vintage:</h4>
                <ul className="gr-highlights-list">
                  <li><strong>Format Media:</strong> {data.format}</li>
                  <li><strong>Perekaman:</strong> {data.year}</li>
                  <li><strong>Repositori:</strong> {data.source}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Section 7: Maket Muladi Dome & Meja Pusaka */}
          {(type === 'muladi-dome' || type === 'heritage-table') && (
            <div className="gr-zone3-heritage-detail">
              <p className="gr-desc-lead">{data.description}</p>
              {data.highlights && (
                <div className="gr-highlights-box">
                  <h4 className="gr-sec-title">
                    {type === 'muladi-dome' ? 'Keunggulan Arsitektur & Fasilitas:' : 'Nilai Historis & Pusaka:'}
                  </h4>
                  <ul className="gr-highlights-list">
                    {data.highlights.map((hl: string, hli: number) => (
                      <li key={hli}>{hl}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DOMEntityCuller>

        {/* Modal Footer */}
        <footer className="gr-zone3-modal-footer">
          <button type="button" className="gr-continue" onClick={onClose}>
            Kembali Menjelajah Zona 3
          </button>
        </footer>
      </aside>
    </>
  )
}
