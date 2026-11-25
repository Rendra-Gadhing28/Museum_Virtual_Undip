import { useEffect, useState, useRef } from 'react'
import { deviceProfile } from '../core/deviceProfile'
import { memoryGuard } from '../core/memoryGuard'
import { zoneManager } from '../core/zoneManager'

interface PerfOverlayProps {
  visible?: boolean
}

/**
 * Museum Virtual Undip — Real-Time Performance & Diagnostics HUD
 *
 * Provides developers and curators instant visibility into:
 * - Current FPS & frame delta (color-coded: green >= 50, yellow >= 30, red < 30)
 * - Active GPU Hardware Tier & Adaptive Settings
 * - Live VRAM Usage vs Safety Threshold
 * - Active Zone & LRU In-Memory Cache
 */
export function PerfOverlay({ visible: initialVisible = false }: PerfOverlayProps) {
  const [isOpen, setIsOpen] = useState(initialVisible)
  const [fps, setFps] = useState(60)
  const [frameTime, setFrameTime] = useState(16.6)
  const [memReport, setMemReport] = useState(() => memoryGuard.getMemoryReport())
  const [activeZone, setActiveZone] = useState(() => zoneManager.getActiveZoneId())
  const [loadedZones, setLoadedZones] = useState(() => zoneManager.getLoadedZones())
  const [profile, setProfile] = useState(() => deviceProfile.getProfile())

  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useEffect(() => {
    let animId: number
    const updateStats = () => {
      frameCount.current += 1
      const now = performance.now()
      const delta = now - lastTime.current

      if (delta >= 600) {
        const curFps = Math.round((frameCount.current * 1000) / delta)
        const ms = (delta / frameCount.current).toFixed(1)
        setFps(curFps)
        setFrameTime(parseFloat(ms))
        frameCount.current = 0
        lastTime.current = now

        setMemReport(memoryGuard.getMemoryReport())
        setActiveZone(zoneManager.getActiveZoneId())
        setLoadedZones(zoneManager.getLoadedZones())
        setProfile(deviceProfile.getProfile())
      }
      animId = requestAnimationFrame(updateStats)
    }
    animId = requestAnimationFrame(updateStats)
    return () => cancelAnimationFrame(animId)
  }, [])

  const fpsColor = fps >= 48 ? '#22c55e' : fps >= 28 ? '#eab308' : '#ef4444'

  return (
    <div style={{ position: 'fixed', bottom: 16, left: 16, zIndex: 9999, fontFamily: 'monospace' }}>
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            background: 'rgba(11, 31, 58, 0.85)',
            border: '1px solid rgba(201, 162, 75, 0.4)',
            color: '#f5efe0',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: '11px',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: fpsColor }} />
          <span>{fps} FPS</span>
          <span style={{ color: '#c9a24b' }}>[Stats]</span>
        </button>
      ) : (
        <div
          style={{
            background: 'rgba(6, 19, 36, 0.94)',
            border: '1px solid #c9a24b',
            borderRadius: 8,
            padding: '12px 16px',
            width: 260,
            color: '#f5efe0',
            fontSize: '11px',
            lineHeight: 1.6,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color: '#ffd700' }}>UNDIP PERF HUD</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>Framerate:</span>
            <span style={{ color: fpsColor, fontWeight: 700 }}>{fps} FPS ({frameTime}ms)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>GPU Tier:</span>
            <span style={{ color: '#38bdf8', textTransform: 'uppercase', fontWeight: 600 }}>{profile.tier}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>Texture Spec:</span>
            <span style={{ color: '#f5efe0' }}>{profile.textureQuality.toUpperCase()} (DPR {profile.maxPixelRatio})</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>VRAM Usage:</span>
            <span style={{ color: memReport.usagePercent > 80 ? '#ef4444' : '#22c55e' }}>
              {memReport.estimatedVRAMMB} / {memReport.budgetMB} MB ({memReport.usagePercent}%)
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>Active Zone:</span>
            <span style={{ color: '#ffd700', textTransform: 'uppercase' }}>{activeZone || 'None'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Loaded (LRU):</span>
            <span style={{ color: '#cbd5e1' }}>{loadedZones.join(', ') || 'None'}</span>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 6, display: 'flex', gap: 4 }}>
            {(['lite', 'standard', 'high'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  deviceProfile.setManualOverride(t)
                  setProfile(deviceProfile.getProfile())
                }}
                style={{
                  flex: 1,
                  padding: '3px 0',
                  fontSize: '9px',
                  borderRadius: 4,
                  border: '1px solid #c9a24b',
                  background: profile.tier === t ? '#c9a24b' : 'transparent',
                  color: profile.tier === t ? '#0b1f3a' : '#f5efe0',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
