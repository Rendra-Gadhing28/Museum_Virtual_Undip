interface Zone3OverlayUIProps {
  isTouring: boolean
  onToggleTour: () => void
  currentTourIndex: number | null
  onResetPosition: () => void
  onTeleport: (target: 'entrance' | 'prasasti' | 'photos' | 'artifacts' | 'legacy' | 'documents' | 'cinema') => void
  isNearDirectory: boolean
  onSwitchZone?: (zoneId: 'zone1' | 'zone2' | 'zone4' | 'zone5') => void
}

/**
 * Overlay Antarmuka Pengguna Zona 3 — The Heritage of Undip
 * Mengikuti gaya arsitektural Royal Navy & Warm Gold seperti Zona 1, 2, & 4
 */
export function Zone3OverlayUI({
  isTouring,
  onToggleTour,
  currentTourIndex,
  onResetPosition,
  onTeleport,
  isNearDirectory,
  onSwitchZone,
}: Zone3OverlayUIProps) {
  const tourStationNames = [
    'Meja Pusaka & Lambang Diponegoro',
    'Sayap Artefak Akademik',
    'Aula Memorabilia Tokoh Perintis',
    'Sayap Dokumen Penting & Cinema',
    'Plaza Prasasti Monumental 1957',
  ]

  return (
    <div className="z3-ui-container">
      {/* 1. Header Atas Zona 3 */}
      <header className="z3-header-bar">
        <div className="z3-header-left">
          <span className="z3-header-badge">ZONA 3</span>
          <h1 className="z3-header-title">THE HERITAGE OF UNDIP — AULA WARISAN SEJARAH & PRASASTI</h1>
        </div>

        <div className="z3-header-right">
          {/* Tombol Tur Terpandu Sinematik */}
          <button
            type="button"
            className={`z3-tour-btn ${isTouring ? 'is-touring' : ''}`}
            onClick={onToggleTour}
            title={isTouring ? 'Jeda Tur Kamera' : 'Jalankan Tur Sinematik Otomatis'}
          >
            {isTouring ? '⏸️ Jeda Tur Sinematik' : '🎬 Mulai Tur Sinematik'}
          </button>

          {/* Tombol Reset Posisi */}
          <button
            type="button"
            className="z3-reset-btn"
            onClick={onResetPosition}
            title="Kembali ke Titik Masuk"
          >
            ↺ Reset
          </button>
        </div>
      </header>

      {/* 2. Banner Notifikasi Saat Sedang Berada di Dalam Tur Sinematik */}
      {isTouring && currentTourIndex !== null && (
        <div className="z3-tour-indicator-banner">
          <span className="z3-tour-pulse" />
          <span className="z3-tour-banner-text">
            MENJELAJAH STASIUN {currentTourIndex + 1}/5: <strong>{tourStationNames[currentTourIndex]}</strong>
          </span>
          <button type="button" className="z3-tour-exit-pill" onClick={onToggleTour}>
            Keluar dari Tur (Jalan Bebas)
          </button>
        </div>
      )}

      {/* 3. Prompt Wayfinding Direktori saat Mendekat */}
      {isNearDirectory && !isTouring && (
        <div className="z3-wayfinding-modal">
          <div className="z3-wayfinding-card">
            <h3 className="z3-wayfinding-title">Mau Menuju ke Mana?</h3>
            <p className="z3-wayfinding-subtitle">Pilih lokasi pameran di Zona 3 untuk berpindah langsung:</p>
            <div className="z3-wayfinding-btn-grid">
              <button
                type="button"
                className="z3-wf-btn"
                onClick={() => onTeleport('prasasti')}
              >
                🏛️ Plaza Prasasti Monumental (Pusat Belakang)
              </button>
              <button
                type="button"
                className="z3-wf-btn"
                onClick={() => onTeleport('photos')}
              >
                📷 Galeri 28 Foto Sejarah (Dinding Belakang)
              </button>
              <button
                type="button"
                className="z3-wf-btn"
                onClick={() => onTeleport('artifacts')}
              >
                🎓 Sayap Artefak Akademik (Barat)
              </button>
              <button
                type="button"
                className="z3-wf-btn"
                onClick={() => onTeleport('legacy')}
              >
                🏅 Hall of Legacy: Tokoh Perintis (Barat)
              </button>
              <button
                type="button"
                className="z3-wf-btn"
                onClick={() => onTeleport('documents')}
              >
                📜 Sayap Dokumen Piagam (Timur)
              </button>
              <button
                type="button"
                className="z3-wf-btn"
                onClick={() => onTeleport('cinema')}
              >
                📽️ Paviliun Audiovisual & Cinema (Timur)
              </button>
              <button
                type="button"
                className="z3-wf-btn z3-wf-btn-subtle"
                onClick={() => onTeleport('entrance')}
              >
                🚪 Pintu Masuk Zona 3
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Subnav Quick Teleport & Portal Antar-Zona (Top Docked, bebas tumpang tindih dengan WASD hints) */}
      {!isTouring && (
        <div className="z3-subnav-bar">
          <div className="z3-nav-pills">
            <button type="button" className="z3-pill-btn" onClick={() => onTeleport('prasasti')}>
              🏛️ Prasasti Peresmian
            </button>
            <button type="button" className="z3-pill-btn" onClick={() => onTeleport('photos')}>
              📷 28 Foto Sejarah
            </button>
            <button type="button" className="z3-pill-btn" onClick={() => onTeleport('artifacts')}>
              🎓 Artefak Akademik
            </button>
            <button type="button" className="z3-pill-btn" onClick={() => onTeleport('legacy')}>
              🏅 Tokoh Perintis
            </button>
            <button type="button" className="z3-pill-btn" onClick={() => onTeleport('documents')}>
              📜 Dokumen Piagam
            </button>
            <button type="button" className="z3-pill-btn" onClick={() => onTeleport('cinema')}>
              📽️ Paviliun Cinema
            </button>
          </div>

          <div className="z3-zone-portal-pills">
            <button
              type="button"
              className="z3-portal-pill"
              onClick={() => onSwitchZone?.('zone2')}
              title="Kembali ke Zona 2"
            >
              ◄ Ke Zona 2 (Growth)
            </button>
            <button
              type="button"
              className="z3-portal-pill"
              onClick={() => onSwitchZone?.('zone4')}
              title="Lanjut ke Zona 4"
            >
              Ke Zona 4 (Today) ►
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
