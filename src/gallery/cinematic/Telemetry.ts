/**
 * Real-Time Telemetry Collector for Cinematic Intro
 *
 * Extracts authentic runtime metrics directly from WebGLRenderer.info
 * paired with each Museum Zone's real architecture & metadata.
 */

import * as THREE from 'three'
import type { ChapterId } from './config'

export interface TelemetrySnapshot {
  chapterId: ChapterId
  primaryValue: string
  secondaryValue: string
}

export interface LiveEngineMetrics {
  fps?: number
  drawCalls?: number
}

export function formatTelemetryForChapter(
  chapterId: ChapterId,
  gl: THREE.WebGLRenderer,
  _metrics?: LiveEngineMetrics,
): TelemetrySnapshot {
  const render = gl.info.render
  const mem = gl.info.memory

  switch (chapterId) {
    case 'prologue':
      return {
        chapterId,
        primaryValue: `3 Zona Sejarah & Masa Depan Undip`,
        secondaryValue: `${mem.geometries} geometries • ${mem.textures} textures`,
      }

    case 'zone1':
      return {
        chapterId,
        primaryValue: `Tokoh Pendiri & Rektorat Undip`,
        secondaryValue: `${render.calls} draw calls • Kampus Muladi Dome`,
      }

    case 'zone2':
      return {
        chapterId,
        primaryValue: `11+ Fakultas • Pleburan & Tembalang`,
        secondaryValue: `Riset Kelautan (PIP) & Pengabdian KKN`,
      }

    case 'zone3':
      return {
        chapterId,
        primaryValue: `Vitrine Artefak & Transformasi Inovasi`,
        secondaryValue: `Diorama Isometrik Warisan Akademik`,
      }

    case 'epilogue':
      return {
        chapterId,
        primaryValue: `Titik Pemunculan Karakter`,
        secondaryValue: `Model Teroptimasi • ${render.triangles.toLocaleString()} tris`,
      }

    default:
      return {
        chapterId,
        primaryValue: `Museum Virtual Undip`,
        secondaryValue: `Eksplorasi Interaktif 3D`,
      }
  }
}
