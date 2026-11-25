import { useState } from 'react'
import type { ZONE5_TARGETS } from './layout'

interface Zone5OverlayUIProps {
  dawnFactor: number
  onChangeDawnFactor: (val: number) => void
  isTouring: boolean
  onToggleTour: () => void
  currentTourIndex: number | null
  onResetPosition: () => void
  onTeleport: (target: keyof typeof ZONE5_TARGETS) => void
  onAddLantern: (text: string, author: string) => void
  onSwitchZone?: (zoneId: 'zone1' | 'zone2' | 'zone3' | 'zone4') => void
}

/**
 * Overlay Antarmuka Pengguna Zona 5: Undip Future
 * - Top Header Bar dengan status pameran & slider suasana fajar
 * - Subnav Quick Teleport docked di atas (top: 76px) agar area bawah 100% bersih untuk hints WASD
 * - Dialog interaktif Lentera Harapan 2050
 */
export function Zone5OverlayUI({
  dawnFactor,
  onChangeDawnFactor,
  isTouring,
  onToggleTour,
  currentTourIndex,
  onResetPosition,
  onTeleport,
  onAddLantern,
  onSwitchZone,
}: Zone5OverlayUIProps) {
  const [isLanternModalOpen, setIsLanternModalOpen] = useState(false)
  const [lanternText, setLanternText] = useState('')
  const [lanternAuthor, setLanternAuthor] = useState('')

  const tourStationNames = [
    'Gerbang Masuk Aula Futuristik',
    'Sayap Digital Campus & Metaverse',
    'Pusat AI Nexus & The Neural Brain',
    'Sayap The Summit & Inovasi SDGs',
    'Vision Beacon & Horizon Gate 2050',
  ]

  const getAtmosphereLabel = (val: number) => {
    if (val < 0.35) return '🌌 Blue Hour (Hologram)'
    if (val < 0.75) return '🌅 Menjelang Fajar (Aurora)'
    return '✨ Fajar Emas 2050 (Klimaks)'
  }

  const handleSendLantern = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lanternText.trim()) return
    onAddLantern(lanternText.trim(), lanternAuthor.trim() || 'Pengunjung Museum')
    setLanternText('')
    setLanternAuthor('')
    setIsLanternModalOpen(false)
  }

  return (
    <div className="z5-ui-container">
      {/* 1. Header Bar Zona 5 */}
      <header className="z5-header-bar">
        <div className="z5-header-left">
          <span className="z5-header-badge">ZONA 5 • PENUTUP</span>
          <h1 className="z5-header-title">UNDIP FUTURE — KAMPUS DIGITAL, AI & PERADABAN 2050</h1>
        </div>

        <div className="z5-header-right">
          {/* Tombol Tur Terpandu Sinematik */}
          <button
            type="button"
            className={`z5-tour-btn ${isTouring ? 'is-touring' : ''}`}
            onClick={onToggleTour}
            title={isTouring ? 'Jeda Tur Kamera' : 'Jalankan Tur Sinematik Otomatis'}
          >
            {isTouring ? '⏸️ Jeda Tur Sinematik' : '🎬 Mulai Tur Sinematik'}
          </button>

          {/* Slider Suasana Fajar Emas */}
          <div className="z5-time-control">
            <span className="z5-time-label">{getAtmosphereLabel(dawnFactor)}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={dawnFactor}
              onChange={(e) => onChangeDawnFactor(parseFloat(e.target.value))}
              className="z5-time-slider"
              title="Atur Suasana Fajar Emas 2050"
            />
          </div>

          {/* Tombol Lentera Harapan */}
          <button
            type="button"
            className="z5-lantern-btn"
            onClick={() => setIsLanternModalOpen(true)}
            title="Kirim Pesan Lentera Harapan ke Horizon Gate 2050"
          >
            🏮 Lentera Harapan
          </button>

          {/* Tombol Reset Posisi */}
          <button
            type="button"
            className="z5-reset-btn"
            onClick={onResetPosition}
            title="Kembali ke Titik Masuk"
          >
            ↺ Reset
          </button>
        </div>
      </header>

      {/* 2. Banner Indikator Tur Sinematik */}
      {isTouring && currentTourIndex !== null && (
        <div className="z5-tour-indicator-banner">
          <span className="z5-tour-pulse" />
          <span className="z5-tour-banner-text">
            MENJELAJAH STASIUN {currentTourIndex + 1}/5: <strong>{tourStationNames[currentTourIndex]}</strong>
          </span>
          <button type="button" className="z5-tour-exit-pill" onClick={onToggleTour}>
            Keluar dari Tur (Jalan Bebas)
          </button>
        </div>
      )}

      {/* 3. Subnav Quick Teleport & Portal Antar-Zona (Top Docked, bebas tumpang tindih dengan WASD hints) */}
      {!isTouring && (
        <div className="z5-subnav-bar">
          <div className="z5-nav-pills">
            <button type="button" className="z5-pill-btn" onClick={() => onTeleport('digitalCampus')}>
              🌐 Digital Twin
            </button>
            <button type="button" className="z5-pill-btn" onClick={() => onTeleport('neuralCore')}>
              🧠 AI Nexus
            </button>
            <button type="button" className="z5-pill-btn" onClick={() => onTeleport('commandDeck')}>
              🕹️ Command Deck
            </button>
            <button type="button" className="z5-pill-btn" onClick={() => onTeleport('theSummit')}>
              🏆 The Summit
            </button>
            <button type="button" className="z5-pill-btn" onClick={() => onTeleport('livingGrove')}>
              🌱 Living Grove
            </button>
            <button type="button" className="z5-pill-btn" onClick={() => onTeleport('visionBeacon')}>
              🌅 Vision Beacon
            </button>
          </div>

          <div className="z5-zone-portal-pills">
            <button
              type="button"
              className="z5-portal-pill"
              onClick={() => onSwitchZone?.('zone4')}
              title="Kembali ke Zona 4"
            >
              ◄ Ke Zona 4 (Undip Today)
            </button>
          </div>
        </div>
      )}

      {/* 4. Modal Dialog Lentera Harapan 2050 */}
      {isLanternModalOpen && (
        <div className="z5-modal-scrim" onClick={() => setIsLanternModalOpen(false)}>
          <div className="z5-modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="z5-modal-head">
              <span className="z5-modal-badge">🏮 HORIZON GATE 2050</span>
              <h3 className="z5-modal-title">Kirim Lentera Harapan & Doa Masa Depan</h3>
              <p className="z5-modal-sub">
                Pesan Anda akan melayang sebagai lentera cahaya emas di atas Horizon Gate 2050.
              </p>
            </header>

            <form onSubmit={handleSendLantern} className="z5-modal-form">
              <label className="z5-form-label">
                Pesan / Harapan Anda untuk Masa Depan Undip:
                <textarea
                  className="z5-form-textarea"
                  rows={4}
                  required
                  placeholder="Tuliskan harapan, doa, atau aspirasi Anda untuk kemajuan Universitas Diponegoro di masa depan..."
                  value={lanternText}
                  onChange={(e) => setLanternText(e.target.value)}
                />
              </label>

              <label className="z5-form-label">
                Nama / Identitas Anda (opsional):
                <input
                  type="text"
                  className="z5-form-input"
                  placeholder="Misal: Mahasiswa FSM / Alumni / Pengunjung"
                  value={lanternAuthor}
                  onChange={(e) => setLanternAuthor(e.target.value)}
                />
              </label>

              <div className="z5-modal-actions">
                <button
                  type="button"
                  className="z5-btn-cancel"
                  onClick={() => setIsLanternModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="z5-btn-submit">
                  ✨ Terbangkan Lentera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
