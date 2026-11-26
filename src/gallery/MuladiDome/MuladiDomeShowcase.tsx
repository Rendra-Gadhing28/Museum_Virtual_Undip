import { useState, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DEFAULT_MULADI_DOME_CONFIG, type MuladiDomeConfig } from './config'
import { MuladiDomeMaket } from './MuladiDomeMaket'
import './showcase.css'

interface CameraPreset {
  id: number
  label: string
  subLabel: string
  position: [number, number, number]
  target: [number, number, number]
  refPhoto?: string
}

const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 1,
    label: '1. Top-Down (Pola Atap)',
    subLabel: 'Ortogonal atap, 12 bukaan, arah apex chevron',
    position: [0.01, 15.5, 0.01],
    target: [0, 1.8, 0],
    refPhoto: '/assets/muladi_ref/photo2_top_down.jpg',
  },
  {
    id: 2,
    label: '2. Depan Miring (Etalase)',
    subLabel: 'Kamera perspektif maket utuh & meja kayu',
    position: [7.2, 5.6, 11.4],
    target: [0, 1.2, 0],
    refPhoto: '/assets/muladi_ref/photo3_depan_etalase.jpg',
  },
  {
    id: 3,
    label: '3. Elevasi Depan (Kolom)',
    subLabel: '12 kolom silinder, kisi anyaman, kanopi elips',
    position: [0, 1.8, 8.2],
    target: [0, 1.4, 0],
    refPhoto: '/assets/muladi_ref/photo4_elevasi_depan.jpg',
  },
  {
    id: 4,
    label: '4. Miring Rendah (Eye Level)',
    subLabel: 'Perspektif pejalan kaki di jalan aspal maket',
    position: [-5.6, 1.4, 7.2],
    target: [0, 1.3, 0],
    refPhoto: '/assets/muladi_ref/photo3_depan_etalase.jpg',
  },
  {
    id: 5,
    label: '5. Atas Miring (45°)',
    subLabel: 'Tampak perpaduan fasad depan dan kemiringan atap',
    position: [2.5, 8.4, 8.2],
    target: [0, 1.6, 0],
    refPhoto: '/assets/muladi_ref/photo1_atas_miring.jpg',
  },
]

/**
 * Controller Animasi Transisi Kamera Tiga Dimensi
 */
function CameraController({
  activePreset,
}: {
  activePreset: CameraPreset
}) {
  const controlsRef = useRef<any>(null)

  useFrame((state) => {
    // Lerp kamera menuju target preset
    state.camera.position.lerp(
      new THREE.Vector3(...activePreset.position),
      0.08
    )
    if (controlsRef.current) {
      controlsRef.current.target.lerp(
        new THREE.Vector3(...activePreset.target),
        0.08
      )
      controlsRef.current.update()
    }
  })

  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
}

interface MuladiDomeShowcaseProps {
  onClose?: () => void
}

/**
 * Showcase Mode Validasi "Mirip Persis" Gedung Muladi Dome
 * Menyediakan 5 sudut kamera, live photo overlay, toggle etalase kaca, dan live CONFIG tuning.
 */
export function MuladiDomeShowcase({ onClose }: MuladiDomeShowcaseProps) {
  const [config, setConfig] = useState<MuladiDomeConfig>(DEFAULT_MULADI_DOME_CONFIG)
  const [selectedPresetId, setSelectedPresetId] = useState<number>(1)
  const [showcaseGlass, setShowcaseGlass] = useState<boolean>(true)
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.0)
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'camera' | 'checklist' | 'config'>('camera')

  const activePreset = CAMERA_PRESETS.find((p) => p.id === selectedPresetId) || CAMERA_PRESETS[0]

  // Handler untuk live parameter tuning
  const handleConfigChange = (path: string, val: any) => {
    setConfig((prev) => {
      const copy = JSON.parse(JSON.stringify(prev))
      const parts = path.split('.')
      let curr = copy
      for (let i = 0; i < parts.length - 1; i++) {
        curr = curr[parts[i]]
      }
      curr[parts[parts.length - 1]] = val
      return copy
    })
  }

  return (
    <div className="md-showcase-container">
      {/* 1. Header Toolbar */}
      <header className="md-showcase-header">
        <div className="md-header-left">
          <span className="md-badge">PBR MAKET FISIK 4K</span>
          <h2>Inspeksi Maket Gedung Muladi Dome</h2>
        </div>

        <div className="md-header-controls">
          <button
            className={`md-tab-btn ${activeTab === 'camera' ? 'active' : ''}`}
            onClick={() => setActiveTab('camera')}
          >
            📷 5 Sudut Kamera
          </button>
          <button
            className={`md-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            ✓ Checklist Validasi
          </button>
          <button
            className={`md-tab-btn ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('config')
              setShowConfigDrawer(!showConfigDrawer)
            }}
          >
            ⚙ Setelan CONFIG
          </button>

          {onClose && (
            <button className="md-close-btn" onClick={onClose}>
              ✕ Tutup
            </button>
          )}
        </div>
      </header>

      {/* 2. Area Render 3D R3F */}
      <div className="md-viewport-area">
        <Canvas
          camera={{ position: activePreset.position, fov: 42 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          {/* Pencahayaan Display Maket (Plafon Museum Netral + IBL Lembut) */}
          <ambientLight intensity={1.1} color="#F7F7F5" />
          <directionalLight position={[6, 14, 8]} intensity={1.8} color="#FFFFFF" />
          <directionalLight position={[-6, 12, -8]} intensity={0.9} color="#E8ECEF" />
          <directionalLight position={[0, -4, 0]} intensity={0.2} color="#D5D8DA" />

          {/* Controller Kamera Teranimasi */}
          <CameraController activePreset={activePreset} />

          {/* Maket Utama Muladi Dome */}
          <MuladiDomeMaket config={config} showcaseGlass={showcaseGlass} />
        </Canvas>

        {/* 3. Overlay Foto Referensi Semi-Transparan */}
        {overlayOpacity > 0 && activePreset.refPhoto && (
          <div
            className="md-photo-overlay"
            style={{
              backgroundImage: `url(${activePreset.refPhoto})`,
              opacity: overlayOpacity,
            }}
          />
        )}

        {/* 4. Floating Overlay Controls (Bawah) */}
        <div className="md-floating-bottom-bar">
          <div className="md-glass-toggle">
            <label>
              <input
                type="checkbox"
                checked={showcaseGlass}
                onChange={(e) => setShowcaseGlass(e.target.checked)}
              />
              <span>Etalase Kaca Akrilik</span>
            </label>
          </div>

          <div className="md-slider-group">
            <span>Overlay Foto Referensi:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            />
            <span className="md-slider-val">{Math.round(overlayOpacity * 100)}%</span>
          </div>
        </div>
      </div>

      {/* 5. Panel Navigasi Kamera (Kiri) */}
      {activeTab === 'camera' && (
        <aside className="md-side-panel">
          <h3>Pilih Sudut Validasi (Sesuai Foto):</h3>
          <div className="md-preset-list">
            {CAMERA_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`md-preset-card ${selectedPresetId === preset.id ? 'active' : ''}`}
                onClick={() => setSelectedPresetId(preset.id)}
              >
                <div className="md-preset-title">{preset.label}</div>
                <div className="md-preset-sub">{preset.subLabel}</div>
              </button>
            ))}
          </div>

          <div className="md-preset-hint">
            <small>
              💡 <strong>Tips:</strong> Gunakan klik kiri mouse untuk orbit, klik kanan untuk geser (pan), dan scroll untuk zoom.
            </small>
          </div>
        </aside>
      )}

      {/* 6. Panel Checklist Validasi */}
      {activeTab === 'checklist' && (
        <aside className="md-side-panel md-checklist-panel">
          <h3>Checklist Akurasi Terhadap Foto:</h3>
          <ul className="md-check-list">
            <li className="passed">
              <span className="check-icon">✓</span>
              <div>
                <strong>Arah & Posisi Apex Chevron:</strong>
                <p>Apex berada tepat di tengah 4 sisi dan mengarah ke pusat atap, memudar bertahap ke putih.</p>
              </div>
            </li>
            <li className="passed">
              <span className="check-icon">✓</span>
              <div>
                <strong>12 Bukaan Atap (Skylights):</strong>
                <p>Grid simetris 4 kolom × 3 baris kaca asap abu-kecokelatan dengan frame putih tipis inset.</p>
              </div>
            </li>
            <li className="passed">
              <span className="check-icon">✓</span>
              <div>
                <strong>Undakan Ubin (Stair-step Grid):</strong>
                <p>Grid ubin persegi 1:1 fisik dengan aksen titik putih kecil dan rusuk diagonal menonjol.</p>
              </div>
            </li>
            <li className="passed">
              <span className="check-icon">✓</span>
              <div>
                <strong>Fasad 12 Kolom Silinder Depan:</strong>
                <p>12 tiang silinder putih ramping dengan 11 bay dan 7 lapis sirip louvers melengkung di sudut.</p>
              </div>
            </li>
            <li className="passed">
              <span className="check-icon">✓</span>
              <div>
                <strong>Panel Kisi Anyaman Gelombang:</strong>
                <p>Pola almond/lensa warna biru-baja (#6E7A88) tembus ke interior gelap di baliknya.</p>
              </div>
            </li>
            <li className="passed">
              <span className="check-icon">✓</span>
              <div>
                <strong>Kanopi Pintu Masuk:</strong>
                <p>Kanopi elips melengkung dengan atap kaca dan tangga maket berundak.</p>
              </div>
            </li>
            <li className="passed">
              <span className="check-icon">✓</span>
              <div>
                <strong>Karakter Maket Fisik & Lingkungan:</strong>
                <p>Cat putih matte akrilik bersih, meja kayu veneer cokelat, paving, rumput flock, pohon miniatur.</p>
              </div>
            </li>
          </ul>
        </aside>
      )}

      {/* 7. Drawer Setelan CONFIG */}
      {showConfigDrawer && (
        <aside className="md-side-panel md-config-panel">
          <h3>Setelan Parameter CONFIG</h3>
          <p className="md-config-desc">
            Sesuaikan parameter secara langsung untuk mencocokkan visual dengan foto referensi:
          </p>

          <div className="md-param-group">
            <label>Lebar Rusuk Putih (ribW): {config.roof.ribW}</label>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={config.roof.ribW}
              onChange={(e) => handleConfigChange('roof.ribW', parseInt(e.target.value))}
            />
          </div>

          <div className="md-param-group">
            <label>Periode Chevron (periodP): {config.roof.periodP}</label>
            <input
              type="range"
              min="4"
              max="12"
              step="1"
              value={config.roof.periodP}
              onChange={(e) => handleConfigChange('roof.periodP', parseInt(e.target.value))}
            />
          </div>

          <div className="md-param-group">
            <label>Interval Titik Putih (dotInterval): {config.roof.dotInterval}</label>
            <input
              type="range"
              min="2"
              max="6"
              step="1"
              value={config.roof.dotInterval}
              onChange={(e) => handleConfigChange('roof.dotInterval', parseInt(e.target.value))}
            />
          </div>

          <div className="md-param-group">
            <label>Fade Mulai: {config.roof.fadeStart.toFixed(2)}</label>
            <input
              type="range"
              min="0.05"
              max="0.4"
              step="0.01"
              value={config.roof.fadeStart}
              onChange={(e) => handleConfigChange('roof.fadeStart', parseFloat(e.target.value))}
            />
          </div>

          <div className="md-param-group">
            <label>Fade Berhenti (Putih Polos): {config.roof.fadeEnd.toFixed(2)}</label>
            <input
              type="range"
              min="0.3"
              max="0.7"
              step="0.01"
              value={config.roof.fadeEnd}
              onChange={(e) => handleConfigChange('roof.fadeEnd', parseFloat(e.target.value))}
            />
          </div>

          <div className="md-param-group">
            <label>Tinggi Lengkung Atap Bantal: {config.dimensions.roofPeakHeight.toFixed(2)}</label>
            <input
              type="range"
              min="0.8"
              max="1.8"
              step="0.05"
              value={config.dimensions.roofPeakHeight}
              onChange={(e) => handleConfigChange('dimensions.roofPeakHeight', parseFloat(e.target.value))}
            />
          </div>

          <button
            className="md-reset-btn"
            onClick={() => setConfig(DEFAULT_MULADI_DOME_CONFIG)}
          >
            ↺ Reset ke Nilai Default
          </button>
        </aside>
      )}
    </div>
  )
}
