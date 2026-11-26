/**
 * Real-Time Telemetry Collector for Cinematic Intro
 *
 * Extracts authentic runtime metrics directly from WebGLRenderer.info
 * paired with each Museum Zone's real architecture & metadata.
 */

import * as THREE from 'three'
import type { CullingStats } from '../../perf/culling'
import type { ChapterId } from './config'

export interface TelemetrySnapshot {
  chapterId: ChapterId
  primaryValue: string
  secondaryValue: string
}

export interface LiveEngineMetrics {
  culling: CullingStats
}

export function formatTelemetryForChapter(
  chapterId: ChapterId,
  gl: THREE.WebGLRenderer,
  metrics: LiveEngineMetrics,
): TelemetrySnapshot {
  const render = gl.info.render
  const mem = gl.info.memory

  switch (chapterId) {
    case 'prologue':
      return {
        chapterId,
        primaryValue: `5 Zona Sejarah & Masa Depan`,
        secondaryValue: `${mem.geometries} geometries • ${mem.textures} textures`,
      }

    case 'zone1':
      return {
        chapterId,
        primaryValue: `13 Tokoh Pendiri & Prasasti 1957`,
        secondaryValue: `${render.calls} draw calls • ${metrics.culling.fps} FPS`,
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
        primaryValue: `3 Vitrine Artefak & Foto Sepia`,
        secondaryValue: `Diorama Isometrik Warisan Akademik`,
      }

    case 'zone4':
      return {
        chapterId,
        primaryValue: `Maket Kampus 90×70m • 6 Smart Labs`,
        secondaryValue: `Research Dome & Menara Book Helix`,
      }

    case 'zone5':
      return {
        chapterId,
        primaryValue: `Digital Twin • AI Brain • 17 SDGs`,
        secondaryValue: `Kompleks Futuristik 100×80m`,
      }

    case 'epilogue':
      return {
        chapterId,
        primaryValue: `Posisi Awal [0.0, 1.65, 9.5]`,
        secondaryValue: `100% Procedural • ${render.triangles.toLocaleString()} tris`,
      }
  }
}
