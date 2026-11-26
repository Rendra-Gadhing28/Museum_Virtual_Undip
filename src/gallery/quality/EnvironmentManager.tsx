import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { QUALITY, type QualitySettings } from './QualityConfig'

export interface EnvironmentManagerProps {
  zone: 'zone1' | 'zone2' | 'zone3' | 'zone4' | 'zone5'
}

/**
 * Procedural High Dynamic Range Environment Map Generator
 * Uses PMREMGenerator to bake a tailored 360° museum reflection sphere per zone:
 * - Zone 1: Warm Classical Founding Hall (2800K, Deep Mahogany, Golden Chandeliers)
 * - Zone 2: Golden Knowledge & Maritime Exposition (3000K, Amber Glow, Warm Sand)
 * - Zone 3: Sacred Heritage & Andesite Stone Sanctum (2700K Chiaroscuro Low-Key)
 * - Zone 4: Contemporary Architectural Hall (3500K Neutral Crisp, Carrara White)
 * - Zone 5: Solar-Dawn & Digital Twin Nexus (4000K + Golden Dawn Horizon + Ice-Blue Cyan)
 */
function createZoneEnvironmentCanvas(zone: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  // 1. Sky & Horizon Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512)
  if (zone === 'zone1') {
    grad.addColorStop(0, '#1c1712') // Dark coffered ceiling
    grad.addColorStop(0.45, '#3a2b1d') // Warm gallery ambient
    grad.addColorStop(0.55, '#d4af37') // Gold wainscoting line
    grad.addColorStop(1, '#0e0b08') // Dark polished floor reflection
  } else if (zone === 'zone2') {
    grad.addColorStop(0, '#22190f')
    grad.addColorStop(0.45, '#45331e')
    grad.addColorStop(0.55, '#f59e0b')
    grad.addColorStop(1, '#110d08')
  } else if (zone === 'zone3') {
    grad.addColorStop(0, '#141210')
    grad.addColorStop(0.45, '#2e261a')
    grad.addColorStop(0.55, '#c9a24b')
    grad.addColorStop(1, '#0a0907')
  } else if (zone === 'zone4') {
    grad.addColorStop(0, '#161d26')
    grad.addColorStop(0.45, '#2c3947')
    grad.addColorStop(0.55, '#7fd1e8')
    grad.addColorStop(1, '#0f141a')
  } else {
    // zone5: Solar Dawn & Ice-Blue
    grad.addColorStop(0, '#0a1626')
    grad.addColorStop(0.42, '#1e385c')
    grad.addColorStop(0.52, '#ffd700') // Golden Dawn
    grad.addColorStop(0.65, '#38bdf8') // Ice-Blue line
    grad.addColorStop(1, '#060e17')
  }
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1024, 512)

  // 2. Simulated Museum Ceiling Track Spotlights & Chandeliers (Hotspot reflections)
  const drawLightSpot = (x: number, y: number, r: number, color: string) => {
    const spot = ctx.createRadialGradient(x, y, 0, x, y, r)
    spot.addColorStop(0, '#ffffff')
    spot.addColorStop(0.25, color)
    spot.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = spot
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Overhead Key Track Lights in Museum
  const spotColor = zone === 'zone5' ? '#ffd700' : zone === 'zone4' ? '#fffaf0' : '#ffe8b3'
  drawLightSpot(256, 120, 90, spotColor)
  drawLightSpot(512, 90, 120, '#ffffff')
  drawLightSpot(768, 120, 90, spotColor)

  // Subtle Secondary Fill Lights
  const fillColor = zone === 'zone5' ? '#38bdf8' : '#e6be8a'
  drawLightSpot(160, 240, 60, fillColor)
  drawLightSpot(864, 240, 60, fillColor)

  return canvas
}

export function EnvironmentManager({ zone }: EnvironmentManagerProps) {
  const { gl, scene } = useThree()
  const currentEnvTexture = useRef<THREE.WebGLRenderTarget | null>(null)

  useEffect(() => {
    let pmremGenerator: THREE.PMREMGenerator | null = new THREE.PMREMGenerator(gl)
    pmremGenerator.compileEquirectangularShader()

    const applyEnvironment = (settings: QualitySettings) => {
      if (!settings.hdrEnvironment || !settings.enabled) {
        scene.environment = null
        if (currentEnvTexture.current) {
          currentEnvTexture.current.dispose()
          currentEnvTexture.current = null
        }
        return
      }

      // Generate Equirectangular Canvas
      const canvas = createZoneEnvironmentCanvas(zone)
      const texture = new THREE.CanvasTexture(canvas)
      texture.mapping = THREE.EquirectangularReflectionMapping
      texture.colorSpace = THREE.SRGBColorSpace

      if (pmremGenerator) {
        if (currentEnvTexture.current) {
          currentEnvTexture.current.dispose()
        }
        const renderTarget = pmremGenerator.fromEquirectangular(texture)
        currentEnvTexture.current = renderTarget
        scene.environment = renderTarget.texture
        scene.environmentIntensity = 0.15
      }

      texture.dispose()
    }

    // Subscribe to Quality Config changes
    const unsubscribe = QUALITY.subscribe(applyEnvironment)

    return () => {
      unsubscribe()
      if (currentEnvTexture.current) {
        currentEnvTexture.current.dispose()
        currentEnvTexture.current = null
      }
      if (pmremGenerator) {
        pmremGenerator.dispose()
        pmremGenerator = null
      }
      scene.environment = null
    }
  }, [gl, scene, zone])

  return null
}
