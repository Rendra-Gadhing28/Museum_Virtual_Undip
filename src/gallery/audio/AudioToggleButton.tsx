import { useEffect, useState } from 'react'
import { museumAudio } from './MuseumAudioEngine'

/**
 * Tombol Mute / Unmute BGM & SFX bergaya Navy & Gold
 */
export function AudioToggleButton() {
  const [muted, setMuted] = useState(() => museumAudio.isMuted())

  useEffect(() => {
    return museumAudio.subscribe(setMuted)
  }, [])

  const handleToggle = () => {
    const nextMuted = museumAudio.toggleMute()
    if (!nextMuted) {
      museumAudio.startBgm()
      museumAudio.playUiClick()
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={muted ? 'Nyalakan Musik & Efek Suara' : 'Matikan Musik & Efek Suara'}
      aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}
      style={{
        position: 'fixed',
        top: '20px',
        right: '152px',
        zIndex: 92,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 14px',
        borderRadius: '999px',
        background: 'rgba(10, 14, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        border: muted
          ? '1px solid rgba(148, 163, 184, 0.4)'
          : '1px solid rgba(212, 175, 55, 0.5)',
        color: muted ? '#94a3b8' : '#ffd700',
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.2s ease',
      }}
    >
      <span>{muted ? 'MUTE' : 'AUDIO'}</span>
      <span>{muted ? 'SUARA MATI' : 'SUARA AKTIF'}</span>
    </button>
  )
}
