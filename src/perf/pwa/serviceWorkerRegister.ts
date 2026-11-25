/**
 * Museum Virtual Undip — Service Worker Registration & Lifecycle Controller
 *
 * Handles PWA registration, update prompts, and cache synchronization.
 */

export interface SWRegistrationCallbacks {
  onSuccess?: () => void
  onUpdateAvailable?: (reload: () => void) => void
  onError?: (err: Error) => void
}

export function registerServiceWorker(callbacks?: SWRegistrationCallbacks): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  // Register only in production builds or when service workers are enabled
  window.addEventListener('load', () => {
    const swUrl = '/sw.js'

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        // Cek update pada interval
        setInterval(() => {
          registration.update().catch(() => {})
        }, 1000 * 60 * 60) // Cek setiap 1 jam

        registration.onupdatefound = () => {
          const installingWorker = registration.installing
          if (!installingWorker) return

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                console.info('[PWA] Versi baru Museum Virtual Undip tersedia.')
                callbacks?.onUpdateAvailable?.(() => {
                  installingWorker.postMessage({ type: 'SKIP_WAITING' })
                  window.location.reload()
                })
              } else {
                // Content cached for offline use
                console.info('[PWA] Konten siap untuk kunjungan offline.')
                callbacks?.onSuccess?.()
              }
            }
          }
        }
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err)
        callbacks?.onError?.(err)
      })

    // Auto-reload saat controller baru mengambil alih
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })
  })
}
