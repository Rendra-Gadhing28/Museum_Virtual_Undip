interface Zone4OverlayUIProps {
  timeOfDay: number
  onChangeTimeOfDay: (val: number) => void
  isTouring: boolean
  onToggleTour: () => void
  currentTourIndex: number | null
  onResetPosition: () => void
  onTeleport: (target: 'entrance' | 'campusMaket' | 'labs' | 'library' | 'achievements') => void
  isNearDirectory?: boolean
  onSwitchZone?: (zoneId: 'zone1' | 'zone2' | 'zone3' | 'zone5') => void
}

/**
 * Overlay Antarmuka Pengguna Zona 4 (Undip Today)
 * Menggabungkan kenyamanan navigasi Zona 1 & 2 dengan fitur Tur Sinematik
 */
export function Zone4OverlayUI({
  timeOfDay,
  onChangeTimeOfDay,
  isTouring,
  onToggleTour,
  currentTourIndex,
  onResetPosition,
  onTeleport,
  onSwitchZone,
}: Zone4OverlayUIProps) {
  const tourStationNames = [
    'Maket Kampus Terpadu Tembalang',
    'Sayap Laboratorium & Riset Unggulan',
    'Sayap Perpustakaan & Repositori Digital',
    'Panggung Prestasi & Pengakuan Global',
  ]

  const getTimeLabel = (val: number) => {
    if (val < 0.3) return '☀️ Siang (Natural)'
    if (val < 0.7) return '🌇 Senja (Golden Hour)'
    return '🌌 Malam (Warm Lights)'
  }

  return (
    <div className="z4-ui-container">
      {/* 1. Header Atas Zona 4 */}
      <header className="z4-header-bar">
        <div className="z4-header-left">
          <span className="z4-header-badge">ZONA 4</span>
          <h1 className="z4-header-title">UNDIP TODAY — KAMPUS MODERN & SMART INNOVATION</h1>
        </div>

        <div className="z4-header-right">
          {/* Tombol Tur Terpandu Sinematik */}
          <button
            type="button"
            className={`z4-tour-btn ${isTouring ? 'is-touring' : ''}`}
            onClick={onToggleTour}
            title={isTouring ? 'Jeda Tur Kamera' : 'Jalankan Tur Sinematik Otomatis'}
          >
            {isTouring ? '⏸️ Jeda Tur Sinematik' : '🎬 Mulai Tur Sinematik'}
          </button>

          {/* Slider Waktu Pencahayaan Maket */}
          <div className="z4-time-control">
            <span className="z4-time-label">{getTimeLabel(timeOfDay)}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={timeOfDay}
              onChange={(e) => onChangeTimeOfDay(parseFloat(e.target.value))}
              className="z4-time-slider"
              title="Atur Suasana Waktu Galeri Maket"
            />
          </div>

          {/* Tombol Reset Posisi */}
          <button
            type="button"
            className="z4-reset-btn"
            onClick={onResetPosition}
            title="Kembali ke Titik Masuk"
          >
            ↺ Reset
          </button>
        </div>
      </header>

      {/* 2. Banner Notifikasi Saat Sedang Berada di Dalam Tur Sinematik */}
      {isTouring && currentTourIndex !== null && (
        <div className="z4-tour-indicator-banner">
          <span className="z4-tour-pulse" />
          <span className="z4-tour-banner-text">
            MENJELAJAH STASIUN {currentTourIndex + 1}/4: <strong>{tourStationNames[currentTourIndex]}</strong>
          </span>
          <button type="button" className="z4-tour-exit-pill" onClick={onToggleTour}>
            Keluar dari Tur (Jalan Bebas)
          </button>
        </div>
      )}

      {/* 3. Subnav Quick Teleport & Portal Antar-Zona (Top Docked, bebas tumpang tindih dengan WASD hints) */}
      {!isTouring && (
        <div className="z4-subnav-bar">
          <div className="z4-nav-pills">
            <button type="button" className="z4-pill-btn" onClick={() => onTeleport('campusMaket')}>
              🏛️ Maket Kampus
            </button>
            <button type="button" className="z4-pill-btn" onClick={() => onTeleport('labs')}>
              🔬 Lab & Riset
            </button>
            <button type="button" className="z4-pill-btn" onClick={() => onTeleport('library')}>
              📖 Perpustakaan
            </button>
            <button type="button" className="z4-pill-btn" onClick={() => onTeleport('achievements')}>
              🏆 Prestasi Dunia
            </button>
          </div>

          <div className="z4-zone-portal-pills">
            <button
              type="button"
              className="z4-portal-pill"
              onClick={() => onSwitchZone?.('zone3')}
              title="Kembali ke Zona 3"
            >
              ◄ Ke Zona 3 (Heritage)
            </button>
            <button
              type="button"
              className="z4-portal-pill"
              onClick={() => onSwitchZone?.('zone5')}
              title="Lanjut ke Zona 5"
            >
              Ke Zona 5 (Future) ►
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
