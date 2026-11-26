import { useState, useEffect } from 'react'
import { QUALITY, type QualityPreset, type QualitySettings } from './QualityConfig'

export function QualityOverlay() {
  const [settings, setSettings] = useState<QualitySettings>(QUALITY.current)
  const [isOpen, setIsOpen] = useState(false)
  const [fps, setFps] = useState(60)

  useEffect(() => {
    const unsub = QUALITY.subscribe((s) => setSettings({ ...s }))
    return () => unsub()
  }, [])

  // Listen for 'Q' keyboard shortcut to toggle overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'q' || e.key === 'Q') {
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Approximate FPS counter
  useEffect(() => {
    let frames = 0
    let lastTime = performance.now()
    let handle: number

    const tick = (now: number) => {
      frames++
      if (now - lastTime >= 1000) {
        setFps(Math.round((frames * 1000) / (now - lastTime)))
        frames = 0
        lastTime = now
      }
      handle = requestAnimationFrame(tick)
    }
    handle = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(handle)
  }, [])

  const handleSelectPreset = (preset: QualityPreset) => {
    QUALITY.setPreset(preset)
  }

  const handleToggle = (key: keyof QualitySettings) => {
    QUALITY.update({ [key]: !settings[key] })
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Floating Pill Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            color: settings.enabled ? '#38bdf8' : '#94a3b8',
            border: `1px solid ${settings.enabled ? 'rgba(56, 189, 248, 0.4)' : 'rgba(148, 163, 184, 0.2)'}`,
            padding: '8px 16px',
            borderRadius: 24,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease',
          }}
          title="Tekan 'Q' untuk membuka Panel Kualitas Grafis Ultra HD"
        >
          <span style={{ fontSize: 16 }}>🎨</span>
          <span>{settings.preset === 'Ultra' ? 'Ultra HD' : settings.preset}</span>
          <span
            style={{
              fontSize: 11,
              color: fps >= 50 ? '#4ade80' : fps >= 30 ? '#facc15' : '#f87171',
              paddingLeft: 4,
              borderLeft: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {fps} FPS
          </span>
        </button>
      )}

      {/* Expanded Glassmorphic Panel */}
      {isOpen && (
        <div
          style={{
            background: 'rgba(10, 15, 29, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 16,
            padding: '20px',
            width: 320,
            color: '#f8fafc',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🏛️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#38bdf8' }}>
                  GRAFIS DIORAMA
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  {fps} FPS • Tekan 'Q' untuk tutup
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: 18,
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Master Before / After Comparison Presets */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>
              Preset Kualitas (Bandingkan Before/After):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {(['Ultra', 'High', 'Medium', 'Vanilla'] as QualityPreset[]).map((p) => {
                const isActive = settings.preset === p
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                        : 'rgba(30, 41, 59, 0.6)',
                      border: `1px solid ${isActive ? '#38bdf8' : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? '#ffffff' : '#94a3b8',
                      padding: '8px 10px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {p === 'Ultra' ? '✨ Ultra HD' : p === 'Vanilla' ? '⏪ Vanilla (Off)' : p}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Granular Feature Toggles */}
          <div style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 8 }}>
            Fitur Grafis Aktif:
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              maxHeight: 220,
              overflowY: 'auto',
              paddingRight: 4,
            }}
          >
            {[
              { key: 'postProcessing', label: 'Post-Processing (Cinematic)' },
              { key: 'smaa', label: 'SMAA Anti-Aliasing' },
              { key: 'bloom', label: 'Subtle Bloom (Sorot Emisif)' },
              { key: 'filmGrain', label: 'Micro Film Grain (Non-Particle)' },
              { key: 'vignette', label: 'Cinematic Vignette' },
              { key: 'physicalMaterials', label: 'PBR Physical Materials (Peta Normal)' },
              { key: 'clearcoat', label: 'Clearcoat (Kayu Pernis & Marmer)' },
              { key: 'transmission', label: 'Transmission (Kaca Etalase & Air)' },
              { key: 'sheen', label: 'Sheen (Kain Beludru Runner)' },
              { key: 'hdrEnvironment', label: 'HDR Environment Map (IBL)' },
              { key: 'contactShadows', label: 'Ground Contact Shadows (AO)' },
              { key: 'volumetricShafts', label: 'Faux Volumetric Cones (Non-Particle)' },
              { key: 'detailProps', label: 'Diorama Props (Stanchion & Bevels)' },
              { key: 'softShadows', label: 'Soft Shadow Maps (Experimental)' },
            ].map(({ key, label }) => {
              const checked = !!settings[key as keyof QualitySettings]
              return (
                <label
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: checked ? '#e2e8f0' : '#64748b',
                    padding: '4px 6px',
                    borderRadius: 6,
                    background: checked ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggle(key as keyof QualitySettings)}
                    style={{ cursor: 'pointer', accentColor: '#38bdf8' }}
                  />
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
