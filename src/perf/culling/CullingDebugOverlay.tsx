import { useState, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { CullingStats } from './CullingManager'

export function CanvasStatsCollector({
  onStatsUpdate,
}: {
  onStatsUpdate: (stats: CullingStats) => void
}) {
  const { gl } = useThree()
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fpsHistory = useRef<number[]>([])

  useFrame(() => {
    frameCount.current++
    const now = performance.now()
    const delta = now - lastTime.current

    if (delta >= 250) {
      const curFps = Math.round((frameCount.current * 1000) / delta)
      fpsHistory.current.push(curFps)
      if (fpsHistory.current.length > 20) fpsHistory.current.shift()
      const avgFps = Math.round(
        fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length,
      )

      frameCount.current = 0
      lastTime.current = now

      const render = gl.info.render
      const mem = gl.info.memory

      onStatsUpdate({
        fps: curFps,
        avgFps,
        drawCalls: render.calls,
        triangles: render.triangles,
        geometries: mem.geometries,
        textures: mem.textures,
        totalChunks: 1,
        activeChunks: 1,
        totalEntities: render.calls,
        visibleEntities: render.calls,
        dprScale: gl.getPixelRatio(),
        isThrottled: false,
      })
    }
  })

  return null
}

interface CullingDebugOverlayProps {
  stats: CullingStats
  visible?: boolean
}

export function CullingDebugOverlay({ stats, visible = false }: CullingDebugOverlayProps) {
  const [isOpen, setIsOpen] = useState(visible)

  // Toggle with F3 key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 12,
          right: 12,
          zIndex: 9999,
          background: 'rgba(14, 23, 36, 0.85)',
          color: '#d4af37',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '11px',
          fontFamily: 'monospace',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
        }}
      >
        ⚙️ F3: {stats.fps} FPS | {stats.drawCalls} DC
      </button>
    )
  }

  const fpsColor = stats.fps >= 50 ? '#4ade80' : stats.fps >= 30 ? '#facc15' : '#f87171'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 12,
        right: 12,
        zIndex: 9999,
        background: 'rgba(10, 16, 26, 0.92)',
        color: '#e2e8f0',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '12px',
        fontFamily: 'Consolas, monospace',
        minWidth: '240px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '4px',
        }}
      >
        <span style={{ fontWeight: 'bold', color: '#d4af37', letterSpacing: '0.5px' }}>
          ENGINE CULLING HUD
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '0 4px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 12px' }}>
        <span style={{ color: '#94a3b8' }}>Framerate:</span>
        <span style={{ color: fpsColor, fontWeight: 'bold' }}>
          {stats.fps} FPS (avg {stats.avgFps})
        </span>

        <span style={{ color: '#94a3b8' }}>Draw Calls:</span>
        <span style={{ color: stats.drawCalls > 100 ? '#f87171' : '#38bdf8', fontWeight: 'bold' }}>
          {stats.drawCalls}
        </span>

        <span style={{ color: '#94a3b8' }}>Triangles:</span>
        <span style={{ color: '#e2e8f0' }}>{stats.triangles.toLocaleString()}</span>

        <span style={{ color: '#94a3b8' }}>Entities Culled:</span>
        <span style={{ color: '#38bdf8' }}>
          {stats.visibleEntities} / {stats.totalEntities} visible
        </span>

        <span style={{ color: '#94a3b8' }}>Active Chunks:</span>
        <span style={{ color: '#a78bfa' }}>
          {stats.activeChunks} / {stats.totalChunks}
        </span>

        <span style={{ color: '#94a3b8' }}>GPU Memory:</span>
        <span style={{ color: '#e2e8f0' }}>
          {stats.geometries} geom | {stats.textures} tex
        </span>

        <span style={{ color: '#94a3b8' }}>DPR Scale:</span>
        <span style={{ color: stats.isThrottled ? '#facc15' : '#4ade80' }}>
          {stats.dprScale.toFixed(2)}x {stats.isThrottled ? '(Adaptive)' : ''}
        </span>
      </div>

      <div
        style={{
          marginTop: '8px',
          fontSize: '10px',
          color: '#64748b',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '4px',
        }}
      >
        Press F3 to toggle this overlay
      </div>
    </div>
  )
}
