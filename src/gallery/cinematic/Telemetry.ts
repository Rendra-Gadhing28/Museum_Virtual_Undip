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

    case 'room1':
      return {
        chapterId,
        primaryValue: `5 Tokoh Pancamitra & Akta Yayasan 1956`,
        secondaryValue: `Dinding Kiri • Pintu 01`,
      }

    case 'room2':
      return {
        chapterId,
        primaryValue: `Keppres Penegerian 1960 & Pidato Soekarno`,
        secondaryValue: `Dinding Kiri • Pintu 02`,
      }

    case 'room3':
      return {
        chapterId,
        primaryValue: `13 Rektor Universitas Diponegoro`,
        secondaryValue: `Dinding Kiri • Pintu 03`,
      }

    case 'room4':
      return {
        chapterId,
        primaryValue: `Pleburan–Tembalang • Widya Puraya • RSND`,
        secondaryValue: `Dinding Kanan • Pintu 04`,
      }

    case 'room5':
      return {
        chapterId,
        primaryValue: `Cetak Biru & Linimasa Muladi Dome`,
        secondaryValue: `Dinding Kanan • Pintu 05`,
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
