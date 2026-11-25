import { useState, useCallback, lazy, Suspense } from 'react'
import type { ZoneId, ZoneMeta } from './Zone2/types'
import { ZoneSidebar } from './common/ZoneSidebar'
import { ZonePreviewModal } from './common/ZonePreviewModal'
import './Zone1/gallery.css'

// Dynamic code-splitting for each 3D zone to eliminate monolithic chunk warnings
const Zone1 = lazy(() => import('./Zone1/Zone1').then((m) => ({ default: m.Zone1 })))
const Zone2 = lazy(() => import('./Zone2/Zone2').then((m) => ({ default: m.Zone2 })))
const Zone3 = lazy(() => import('./Zone3/Zone3').then((m) => ({ default: m.Zone3 })))
const Zone4 = lazy(() => import('./Zone4/Zone4').then((m) => ({ default: m.Zone4 })))
const Zone5 = lazy(() => import('./Zone5/Zone5').then((m) => ({ default: m.Zone5 })))

/**
 * Museum Virtual Undip — Master Multi-Zone Orchestrator
 *
 * Implements code-splitting with dynamic import() & lazy chunking:
 * - Only the active zone bundle is loaded on demand.
 * - Prevents GPU memory overhead and reduces initial JS bundle size.
 */
export function MasterMuseum() {
  const [currentZone, setCurrentZone] = useState<ZoneId>('zone1')
  const [previewZone, setPreviewZone] = useState<ZoneMeta | null>(null)
  const [isSwitching, setIsSwitching] = useState(false)

  const handleSelectZone = useCallback((zoneId: ZoneId) => {
    if (zoneId === currentZone) return
    setIsSwitching(true)
    setTimeout(() => {
      setCurrentZone(zoneId)
      setIsSwitching(false)
    }, 250)
  }, [currentZone])

  const handleOpenPreview = useCallback((zone: ZoneMeta) => {
    setPreviewZone(zone)
  }, [])

  const handleClosePreview = useCallback(() => {
    setPreviewZone(null)
  }, [])

  return (
    <div className="gr-master-museum-root">
      {/* Scalable Left Sidebar Navigation */}
      <ZoneSidebar
        currentZone={currentZone}
        onSelectZone={handleSelectZone}
        onOpenZonePreview={handleOpenPreview}
      />

      {/* Render Boundary: Selectively renders active zone only with lazy loading */}
      <main className={`gr-zone-viewport ${isSwitching ? 'is-switching' : ''}`}>
        <Suspense fallback={<div className="gr-zone-loader">Memuat Zona Museum...</div>}>
          {currentZone === 'zone1' && <Zone1 onSwitchZone={handleSelectZone} />}
          {currentZone === 'zone2' && <Zone2 onSwitchZone={handleSelectZone} />}
          {currentZone === 'zone3' && <Zone3 onSwitchZone={handleSelectZone} />}
          {currentZone === 'zone4' && <Zone4 onSwitchZone={handleSelectZone} />}
          {currentZone === 'zone5' && <Zone5 onSwitchZone={handleSelectZone} />}
        </Suspense>
      </main>

      {/* Upcoming Zone Preview Modal */}
      <ZonePreviewModal
        zone={previewZone}
        onClose={handleClosePreview}
      />
    </div>
  )
}
