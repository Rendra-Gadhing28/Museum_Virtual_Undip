import { useState, useEffect } from 'react'
import { ZoneGraphicsManager, type GfxMetrics } from './ZoneGraphicsManager'
import type { GFXMode } from './zoneGfxConfig'
import './debugHud.css'

export function GraphicsDebugHUD() {
  const [metrics, setMetrics] = useState<GfxMetrics>(ZoneGraphicsManager.getMetrics())
  const [isOpen, setIsOpen] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const unsub = ZoneGraphicsManager.subscribe((m) => {
      setMetrics(m)
    })
    return () => unsub()
  }, [])

  // Shortcut keyboard 'G' untuk toggle HUD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'g' || e.key === 'G') {
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSetMode = (mode: GFXMode) => {
    ZoneGraphicsManager.setMode(mode)
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        className="gfx-hud-reopen-btn"
        onClick={() => setIsOpen(true)}
        title="Buka Graphics Diagnostic HUD (Shortcut 'G')"
      >
        <span>GFX HUD</span>
        <span className={`gfx-badge mode-${metrics.mode.toLowerCase()}`}>{metrics.mode}</span>
      </button>
    )
  }

  return (
    <div className={`gfx-hud-container ${isMinimized ? 'minimized' : ''}`}>
      {/* Header Bar */}
      <div className="gfx-hud-header">
        <div className="gfx-hud-title">
          <span className="gfx-dot" />
          <strong>ZONE GRAPHICS ENGINE</strong>
          <span className={`gfx-badge mode-${metrics.mode.toLowerCase()}`}>{metrics.mode}</span>
        </div>
        <div className="gfx-hud-actions">
          <button
            type="button"
            className="gfx-icon-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Perluas HUD' : 'Perkecil HUD'}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button
            type="button"
            className="gfx-icon-btn"
            onClick={() => setIsOpen(false)}
            title="Tutup HUD (Tekan 'G' untuk buka kembali)"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="gfx-hud-body">
          {/* Mode Switcher Buttons */}
          <div className="gfx-mode-selector">
            <button
              type="button"
              className={`gfx-mode-btn ${metrics.mode === 'ORIGINAL' ? 'active-original' : ''}`}
              onClick={() => handleSetMode('ORIGINAL')}
            >
              ORIGINAL
              <small>Flat / Shadows Off</small>
            </button>
            <button
              type="button"
              className={`gfx-mode-btn ${metrics.mode === 'ULTRA' ? 'active-ultra' : ''}`}
              onClick={() => handleSetMode('ULTRA')}
            >
              ULTRA HD
              <small>PCFSoft + PMREM</small>
            </button>
            <button
              type="button"
              className={`gfx-mode-btn ${metrics.mode === 'EXAGGERATE' ? 'active-exaggerate' : ''}`}
              onClick={() => handleSetMode('EXAGGERATE')}
            >
              EXAGGERATE 3X
              <small>Dramatic Boost</small>
            </button>
          </div>

          {/* Telemetry Data Grid */}
          <div className="gfx-telemetry-grid">
            <div className="gfx-cell">
              <span className="gfx-label">Zona Aktif:</span>
              <span className="gfx-val highlight">{metrics.activeZone.toUpperCase()}</span>
            </div>
            <div className="gfx-cell">
              <span className="gfx-label">Framerate:</span>
              <span className="gfx-val fps">{metrics.fps} FPS</span>
            </div>
            <div className="gfx-cell">
              <span className="gfx-label">Jumlah Lampu:</span>
              <span className="gfx-val">{metrics.lightCount} Unit</span>
            </div>
            <div className="gfx-cell">
              <span className="gfx-label">Shadow Filter:</span>
              <span className="gfx-val">{metrics.shadowFilterType}</span>
            </div>
            <div className="gfx-cell">
              <span className="gfx-label">Shadow Casters:</span>
              <span className="gfx-val">{metrics.shadowCastersCount} Mesh</span>
            </div>
            <div className="gfx-cell">
              <span className="gfx-label">Shadow Map:</span>
              <span className="gfx-val">{metrics.shadowMapSize > 0 ? `${metrics.shadowMapSize}² px` : 'OFF'}</span>
            </div>
            <div className="gfx-cell">
              <span className="gfx-label">Material PBR:</span>
              <span className="gfx-val">{metrics.pbrMaterialsCount} Mat</span>
            </div>
            <div className="gfx-cell">
              <span className="gfx-label">VRAM Textures:</span>
              <span className="gfx-val">{metrics.textureCount} Tex</span>
            </div>
            <div className="gfx-cell">
              <span className="gfx-label">Draw Calls:</span>
              <span className="gfx-val">{metrics.drawCalls}</span>
            </div>
            <div className="gfx-cell">
              <span className="gfx-label">Triangles:</span>
              <span className="gfx-val">{metrics.triangles.toLocaleString()}</span>
            </div>
            <div className="gfx-cell">
              <span className="gfx-label">Tone Exposure:</span>
              <span className="gfx-val">{metrics.exposure.toFixed(2)}x</span>
            </div>
            <div className="gfx-cell">
              <span className="gfx-label">Pixel Ratio (DPR):</span>
              <span className="gfx-val">{metrics.pixelRatio.toFixed(2)}</span>
            </div>
          </div>

          <div className="gfx-hud-footer">
            <small>
              <em>Klik <strong>EXAGGERATE 3X</strong> untuk pembuktian visual seketika. Tekan <strong>'G'</strong> untuk sembunyikan.</em>
            </small>
          </div>
        </div>
      )}
    </div>
  )
}
