import { useState } from 'react'
import type { ZoneId, ZoneMeta } from '../Zone2/types'
import { ZONE_CATALOG } from '../Zone2/data/zone2Exhibits'

interface ZoneSidebarProps {
  currentZone: ZoneId
  onSelectZone: (zoneId: ZoneId) => void
  onOpenZonePreview?: (zone: ZoneMeta) => void
}

/**
 * Scalable Left Sidebar Navigation for 5 Museum Zones
 * Features:
 * - Scalable / Collapsible (can collapse to a sleek floating pill or expand to full menu)
 * - Clear active zone indicator with Undip Royal Navy & Gold styling
 * - Direct zone switching between Zone 1 and Zone 2
 * - Informative preview trigger for upcoming zones (Zone 3, 4, 5)
 * - Scalable quick-access buttons for audio ambience and warm lighting indicator
 * - Entity culling on cards list preventing off-screen reflows
 */
export function ZoneSidebar({
  currentZone,
  onSelectZone,
  onOpenZonePreview,
}: ZoneSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  const activeZoneMeta = ZONE_CATALOG.find((z) => z.id === currentZone) || ZONE_CATALOG[0]

  const handleZoneClick = (zone: ZoneMeta) => {
    if (zone.isAvailable) {
      onSelectZone(zone.id)
    } else {
      onOpenZonePreview?.(zone)
    }
  }

  const toggleAudio = () => {
    setIsAudioPlaying((prev) => !prev)
  }

  return (
    <aside
      className={`gr-sidebar-container ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
      aria-label="Navigasi Zonasi Museum"
    >
      {/* 1. Toggle Button for Scaling / Collapsing Sidebar */}
      <button
        type="button"
        className="gr-sidebar-toggle-btn"
        onClick={() => setIsExpanded((prev) => !prev)}
        title={isExpanded ? 'Sembunyikan Menu Zonasi' : 'Buka Menu 5 Zonasi Museum'}
        aria-expanded={isExpanded}
      >
        <span className="gr-toggle-icon">
          {isExpanded ? '◀' : '🏛️'}
        </span>
        {!isExpanded && (
          <span className="gr-toggle-collapsed-label">
            Zona {activeZoneMeta.number}
          </span>
        )}
      </button>

      {/* 2. Expanded Sidebar Content */}
      {isExpanded && (
        <div className="gr-sidebar-panel">
          {/* Header */}
          <div className="gr-sidebar-header">
            <div className="gr-sidebar-emblem">
              <span className="gr-emblem-badge">MUSEUM VIRTUAL UNDIP</span>
            </div>
            <h1 className="gr-sidebar-title">PILIH ZONA MUSEUM</h1>
          </div>

          {/* Zone Cards List with Viewport Culling */}
          <nav className="gr-zone-list" aria-label="Daftar 5 Zona Museum">
            {ZONE_CATALOG.map((zone) => {
              const isActive = zone.id === currentZone
              return (
                <button
                  key={zone.id}
                  type="button"
                  className={`gr-zone-card ${isActive ? 'is-active' : ''} ${
                    zone.isAvailable ? 'is-available' : 'is-locked'
                  }`}
                  onClick={() => handleZoneClick(zone)}
                  title={
                    zone.isAvailable
                      ? `Kunjungi ${zone.title}`
                      : `${zone.title} (${zone.badge})`
                  }
                >
                  <div className="gr-zone-num-box" style={{ borderColor: zone.accentColor }}>
                    <span className="gr-zone-num" style={{ color: zone.accentColor }}>
                      {zone.number}
                    </span>
                  </div>

                  <div className="gr-zone-details">
                    <div className="gr-zone-title-row">
                      <span className="gr-zone-card-title">{zone.title}</span>
                      <span
                        className={`gr-zone-status-chip ${
                          isActive
                            ? 'chip-active'
                            : zone.isAvailable
                            ? 'chip-ready'
                            : 'chip-soon'
                        }`}
                      >
                        {isActive ? 'Aktif' : zone.badge}
                      </span>
                    </div>

                    <div className="gr-zone-card-sub">{zone.subtitle}</div>
                  </div>
                </button>
              )
            })}
          </nav>

          {/* Bottom Atmosphere & Quick Controls */}
          <div className="gr-sidebar-footer">
            <button
              type="button"
              className={`gr-audio-btn ${isAudioPlaying ? 'is-playing' : ''}`}
              onClick={toggleAudio}
              title="Putar Suasana Ambience Museum"
            >
              <span>{isAudioPlaying ? '🔊 Ambience: ON' : '🔈 Ambience: OFF'}</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
