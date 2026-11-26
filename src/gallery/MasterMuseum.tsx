import { useState, useCallback, lazy, Suspense } from 'react'
import type { ZoneId } from './Zone2/types'
import './Zone1/gallery.css'

// Dynamic code-splitting for each 3D zone (Zona 1, Zona 2, Zona 3)
const Zone1 = lazy(() => import('./Zone1/Zone1').then((m) => ({ default: m.Zone1 })))
const Zone2 = lazy(() => import('./Zone2/Zone2').then((m) => ({ default: m.Zone2 })))
const Zone3 = lazy(() => import('./Zone3/Zone3').then((m) => ({ default: m.Zone3 })))

const ZONES_DATA: { id: ZoneId; title: string; subtitle: string; icon: string }[] = [
  { id: 'zone1', title: 'Zona 1', subtitle: 'Sejarah & Rektorat', icon: '🏛️' },
  { id: 'zone2', title: 'Zona 2', subtitle: 'Riset & Transformasi', icon: '🔬' },
  { id: 'zone3', title: 'Zona 3', subtitle: 'Inovasi & Masa Depan', icon: '🚀' },
]

/**
 * Museum Virtual Undip — Master Multi-Zone Orchestrator
 * Bersih, terpusat pada 3 Zona Utama (Zona 1, 2, 3), tanpa ketergantungan folder lama.
 */
export function MasterMuseum() {
  const [currentZone, setCurrentZone] = useState<ZoneId>('zone1')
  const [isSwitching, setIsSwitching] = useState(false)
  const [isIntroActive, setIsIntroActive] = useState(false)

  const handleSelectZone = useCallback((zoneId: ZoneId) => {
    if (zoneId === currentZone) return
    setIsSwitching(true)
    setTimeout(() => {
      setCurrentZone(zoneId)
      setIsSwitching(false)
    }, 250)
  }, [currentZone])

  return (
    <div className="gr-master-museum-root">
      {/* Bilah Sisi Navigasi 3 Zona (Tersembunyi saat sinematik intro) */}
      {!isIntroActive && (
        <aside className="gr-zone-sidebar-clean" style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'rgba(10, 14, 23, 0.85)',
          backdropFilter: 'blur(12px)',
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}>
          <div style={{
            color: '#d4af37',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '4px',
            paddingLeft: '4px',
          }}>
            Zona Museum
          </div>
          {ZONES_DATA.map((z) => {
            const isActive = currentZone === z.id
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => handleSelectZone(z.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  background: isActive ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: isActive ? '1px solid #d4af37' : '1px solid transparent',
                  borderRadius: '8px',
                  color: isActive ? '#fff' : '#c9d1d9',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
              >
                <span>{z.icon}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.2 }}>{z.title}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>{z.subtitle}</div>
                </div>
              </button>
            )
          })}
        </aside>
      )}

      {/* Render Viewport: Hanya memuat bundel zona yang aktif */}
      <main className={`gr-zone-viewport ${isSwitching ? 'is-switching' : ''}`}>
        <Suspense fallback={<div className="gr-zone-loader">Memuat Zona Museum...</div>}>
          {currentZone === 'zone1' && (
            <Zone1 onSwitchZone={handleSelectZone} onIntroStateChange={setIsIntroActive} />
          )}
          {currentZone === 'zone2' && <Zone2 onSwitchZone={handleSelectZone} />}
          {currentZone === 'zone3' && <Zone3 onSwitchZone={handleSelectZone} />}
        </Suspense>
      </main>
    </div>
  )
}
