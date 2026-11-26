import { useState, useCallback, lazy, Suspense } from 'react'
import type { ZoneId, ZoneMeta } from './Zone2/types'
import { ZoneSidebar } from './common/ZoneSidebar'
import { ZonePreviewModal } from './common/ZonePreviewModal'
import './Zone1/gallery.css'
import './MuladiDome/showcase.css'

// Dynamic code-splitting for each 3D zone to eliminate monolithic chunk warnings
const Zone1 = lazy(() => import('./Zone1/Zone1').then((m) => ({ default: m.Zone1 })))
const Zone2 = lazy(() => import('./Zone2/Zone2').then((m) => ({ default: m.Zone2 })))
const Zone3 = lazy(() => import('./Zone3/Zone3').then((m) => ({ default: m.Zone3 })))
const MuladiDomeShowcase = lazy(() =>
  import('./MuladiDome/MuladiDomeShowcase').then((m) => ({ default: m.MuladiDomeShowcase }))
)

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
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false)
  const [isIntroActive, setIsIntroActive] = useState(false)

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
      {/* Scalable Left Sidebar Navigation (hidden during cinematic intro) */}
      {!isIntroActive && (
        <ZoneSidebar
          currentZone={currentZone}
          onSelectZone={handleSelectZone}
          onOpenZonePreview={handleOpenPreview}
        />
      )}

      {/* Render Boundary: Selectively renders active zone only with lazy loading */}
      <main className={`gr-zone-viewport ${isSwitching ? 'is-switching' : ''}`}>
        <Suspense fallback={<div className="gr-zone-loader">Memuat Zona Museum...</div>}>
          {currentZone === 'zone1' && (
            <Zone1 onSwitchZone={handleSelectZone} onIntroStateChange={setIsIntroActive} />
          )}
          {currentZone === 'zone2' && <Zone2 onSwitchZone={handleSelectZone} />}
          {currentZone === 'zone3' && <Zone3 onSwitchZone={handleSelectZone} />}
        </Suspense>
      </main>

      {/* Upcoming Zone Preview Modal */}
      <ZonePreviewModal
        zone={previewZone}
        onClose={handleClosePreview}
      />

      {/* Modal Showcase Inspeksi 5 Sudut & Overlay Foto */}
      {isShowcaseOpen && (
        <Suspense fallback={<div className="gr-zone-loader">Memuat Maket 4K...</div>}>
          <MuladiDomeShowcase onClose={() => setIsShowcaseOpen(false)} />
        </Suspense>
      )}
    </div>
  )
}
