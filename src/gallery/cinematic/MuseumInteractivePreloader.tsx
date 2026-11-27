import React, { useState, useEffect, useMemo } from 'react'
import { useProgress } from '@react-three/drei'
import './heritagePreloader.css'

interface MuseumInteractivePreloaderProps {
  isReady?: boolean
  onLoaded?: () => void
  minimumDisplayTime?: number
}

export function MuseumInteractivePreloader({
  isReady = false,
  onLoaded,
  minimumDisplayTime = 800,
}: MuseumInteractivePreloaderProps) {
  const { progress } = useProgress()
  const [smoothProgress, setSmoothProgress] = useState(20)
  const [isDismissed, setIsDismissed] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [canEnter, setCanEnter] = useState(false)

  // Smooth progressive animation that climbs to 100% when ready or asset loads
  useEffect(() => {
    const interval = setInterval(() => {
      setSmoothProgress((prev) => {
        // Jika R3F melaporkan progress atau canvas sudah ready
        if (isReady || progress === 100) {
          const nextVal = prev + Math.ceil((100 - prev) * 0.3)
          return Math.min(nextVal, 100)
        }
        // Jika belum ready, naik perlahan sampai batas 90% (tidak pernah stuck di 20%)
        if (prev < 90) {
          return prev + 1
        }
        return prev
      })
    }, 50)
    return () => clearInterval(interval)
  }, [isReady, progress])

  // Ready gate check when reaches 100%
  useEffect(() => {
    if (smoothProgress >= 98 && isReady) {
      const timer = setTimeout(() => {
        setCanEnter(true)
      }, minimumDisplayTime)
      return () => clearTimeout(timer)
    }
  }, [smoothProgress, isReady, minimumDisplayTime])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    setCursorPos({
      x: (clientX - cx) / cx,
      y: (clientY - cy) / cy,
    })
  }

  const statusStep = useMemo(() => {
    if (smoothProgress < 35) return 'Menyiapkan Suasana Galeri Warisan...'
    if (smoothProgress < 70) return 'Mengalirkan Model Artefak & Tekstur Sejarah...'
    if (smoothProgress < 99) return 'Menata Tata Cahaya & Akustik Museum...'
    return 'Ruang Pameran Virtual Siap Dikunjungi!'
  }, [smoothProgress])

  const handleEnterMuseum = () => {
    setIsDismissed(true)
    setTimeout(() => {
      if (onLoaded) onLoaded()
    }, 700)
  }

  return (
    <div
      className={`heritage-preloader-root ${isDismissed ? 'fade-out' : ''}`}
      onMouseMove={handleMouseMove}
    >
      <div
        className="heritage-ambient-glow"
        style={{
          transform: `translate(${cursorPos.x * 40}px, ${cursorPos.y * 40}px)`,
        }}
      />

      <div className="heritage-title">Museum Virtual Undip</div>
      <div className="heritage-subtitle">Gerbang Warisan & Transformasi Sejarah</div>

      {/* Interactive Gyro Ring */}
      <div
        className="heritage-ring-container"
        style={{
          transform: `perspective(600px) rotateY(${cursorPos.x * 25}deg) rotateX(${-cursorPos.y * 25}deg)`,
        }}
      >
        <div className="heritage-outer-ring" />
        <div className="heritage-inner-ring" />
        <div className="heritage-compass-core">
          <span className="heritage-percent-text">{Math.round(smoothProgress)}%</span>
          <span className="heritage-percent-label">MEMUAT...</span>
        </div>
      </div>

      <div className="heritage-progress-wrapper">
        <div
          className="heritage-progress-bar"
          style={{ width: `${Math.round(smoothProgress)}%` }}
        />
      </div>

      <div className="heritage-status-step">{statusStep}</div>

      {canEnter && (
        <button
          type="button"
          className="heritage-enter-btn"
          onClick={handleEnterMuseum}
        >
          Masuk Museum 🏛️
        </button>
      )}
    </div>
  )
}
