/**
 * The Museum Engine — Cinematic Intro Configuration & Palette
 *
 * Introduces the 5 spatial zones of Museum Virtual Undip (Zona 1–5)
 * during a smooth, unobstructed 3D camera tour of the main hall.
 */

import { EYE_HEIGHT, MINIATURE_MAP_POS, PODIUM_POS, START_POSITION } from '../Zone1/layout'

export const INTRO_STORAGE_KEY = 'undip_cinematic_intro_seen'

export const CINEMATIC_PALETTE = {
  // Main (ink): warm dark obsidian for letterbox, panels, and backgrounds
  ink: '#09090B',
  inkPanel: 'rgba(9, 9, 11, 0.86)',

  // Paper: warm museum parchment for headings and primary text
  paper: '#EDE6D6',

  // Accent: warm antique gold for subtle highlights and indicators
  accent: '#C8A25A',
  accentGlow: 'rgba(200, 162, 90, 0.35)',

  // Muted: warm slate-cream for secondary labels and descriptions
  muted: '#8E877A',

  // Technical: kept for palette completeness
  technical: '#5E9A93',
  technicalDim: 'rgba(94, 154, 147, 0.28)',
} as const

export type ChapterId =
  | 'prologue'
  | 'zone1'
  | 'zone2'
  | 'zone3'
  | 'zone4'
  | 'zone5'
  | 'epilogue'

export interface ChapterConfig {
  id: ChapterId
  /** Display index (null for prologue/epilogue, 1..5 for zones) */
  chapterNumber: number | null
  totalTechChapters: number
  title: string
  description: string
  telemetryLabel: string
  duration: number
  /** Control points for CatmullRomCurve3 camera position */
  cameraPoints: [number, number, number][]
  /** Control points for CatmullRomCurve3 lookAt target */
  lookAtPoints: [number, number, number][]
  /** Target FOV for gentle breathing */
  fov: number
  /** Static fallback for prefers-reduced-motion */
  reducedMotionPos: [number, number, number]
  reducedMotionLookAt: [number, number, number]
}

export const TOTAL_TECH_CHAPTERS = 5

export const CHAPTERS: ChapterConfig[] = [
  {
    id: 'prologue',
    chapterNumber: null,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Museum Virtual Undip',
    description: 'Sebuah pameran digital interaktif yang merangkum perjalanan Universitas Diponegoro dalam lima zona waktu.',
    telemetryLabel: 'THE MUSEUM ENGINE',
    duration: 4.5,
    cameraPoints: [
      [0, 6.6, -22.5],
      [0, 5.4, -15.0],
      [0, 4.2, -8.5],
    ],
    lookAtPoints: [
      [0, 2.2, -5.0],
      [0, 1.8, -2.0],
      [0, 1.6, 2.0],
    ],
    fov: 54,
    reducedMotionPos: [0, 5.2, -15.0],
    reducedMotionLookAt: [0, 1.8, -2.0],
  },
  {
    id: 'zone1',
    chapterNumber: 1,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Zona 1 — The Origin of Undip',
    description: 'Ruang kehormatan sejarah pendirian 1956–1960: 13 tokoh pendiri & rektor awal, prasasti peresmian Presiden Soekarno, dan arsip bersejarah.',
    telemetryLabel: 'FOUNDING ERA (1956–1960)',
    duration: 5.5,
    cameraPoints: [
      [0, 4.2, -8.5],
      [-3.8, 2.8, -2.0],
      [-2.5, 2.4, 4.0],
    ],
    lookAtPoints: [
      [0, 1.6, 2.0],
      [-6.5, 2.6, 0.0],
      [-6.5, 2.5, 4.5],
    ],
    fov: 56,
    reducedMotionPos: [-3.2, 2.6, 1.0],
    reducedMotionLookAt: [-6.5, 2.5, 2.0],
  },
  {
    id: 'zone2',
    chapterNumber: 2,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Zona 2 — The Growth of Knowledge',
    description: 'Mekarnya 11+ fakultas & sekolah vokasi, transformasi kampus Pleburan ke Tembalang & Jepara, riset kelautan (PIP), serta pengabdian KKN.',
    telemetryLabel: 'EXPANSION & INNOVATION',
    duration: 5.5,
    cameraPoints: [
      [-2.5, 2.4, 4.0],
      [2.6, 2.7, 3.5],
      [3.8, 2.8, -3.5],
    ],
    lookAtPoints: [
      [-6.5, 2.5, 4.5],
      [6.5, 2.5, 2.5],
      [6.5, 2.5, -4.5],
    ],
    fov: 56,
    reducedMotionPos: [3.2, 2.7, 0.5],
    reducedMotionLookAt: [6.5, 2.5, -1.0],
  },
  {
    id: 'zone3',
    chapterNumber: 3,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Zona 3 — The Heritage of Undip',
    description: 'Warisan akademik dalam diorama isometrik: prasasti batu andesit, 3 vitrine artefak sejarah, memorabilia tokoh, dinding foto sepia, dan proyektor vintage.',
    telemetryLabel: 'ACADEMIC MEMORABILIA',
    duration: 5.5,
    cameraPoints: [
      [3.8, 2.8, -3.5],
      [1.8, 2.3, -1.5],
      [-1.8, 2.1, -1.0],
    ],
    lookAtPoints: [
      [6.5, 2.5, -4.5],
      [MINIATURE_MAP_POS[0], 1.1, MINIATURE_MAP_POS[2]],
      [MINIATURE_MAP_POS[0], 1.1, MINIATURE_MAP_POS[2]],
    ],
    fov: 55,
    reducedMotionPos: [0, 2.2, -0.5],
    reducedMotionLookAt: [MINIATURE_MAP_POS[0], 1.1, MINIATURE_MAP_POS[2]],
  },
  {
    id: 'zone4',
    chapterNumber: 4,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Zona 4 — Undip Today',
    description: 'Kampus modern & smart labs: maket kampus hidup 90×70m, Research Dome DNA helix & 6 lab mutakhir, Menara Book Helix 5 lantai, dan Global Stage.',
    telemetryLabel: 'CONTEMPORARY EXCELLENCE',
    duration: 5.5,
    cameraPoints: [
      [-1.8, 2.1, -1.0],
      [-2.2, 2.5, -9.5],
      [0, 2.4, -13.5],
    ],
    lookAtPoints: [
      [MINIATURE_MAP_POS[0], 1.1, MINIATURE_MAP_POS[2]],
      [PODIUM_POS[0], 1.6, PODIUM_POS[2]],
      [PODIUM_POS[0], 1.8, PODIUM_POS[2]],
    ],
    fov: 56,
    reducedMotionPos: [0, 2.4, -12.5],
    reducedMotionLookAt: [PODIUM_POS[0], 1.7, PODIUM_POS[2]],
  },
  {
    id: 'zone5',
    chapterNumber: 5,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Zona 5 — Undip Future',
    description: 'Visi peradaban 2050: Digital Twin Plaza, Neural Atrium AI Brain, Command Deck Smart Campus, Menara Spiral 7 Tingkat, dan Living Grove 17 SDGs.',
    telemetryLabel: 'DIGITAL & AI 2050',
    duration: 5.5,
    cameraPoints: [
      [0, 2.4, -13.5],
      [2.6, 2.9, -14.5],
      [1.8, 2.2, -10.0],
    ],
    lookAtPoints: [
      [PODIUM_POS[0], 1.8, PODIUM_POS[2]],
      [PODIUM_POS[0], 2.0, PODIUM_POS[2] - 2.0],
      [0, 1.8, -14.0],
    ],
    fov: 55,
    reducedMotionPos: [2.2, 2.6, -13.0],
    reducedMotionLookAt: [PODIUM_POS[0], 1.8, PODIUM_POS[2]],
  },
  {
    id: 'epilogue',
    chapterNumber: null,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Walk in.',
    description: 'Seluruh arsitektur dan koleksi dihasilkan secara real-time. Jelajahi kelima zona melalui panel navigasi.',
    telemetryLabel: 'SPAWN HANDOFF',
    duration: 4.5,
    cameraPoints: [
      [1.8, 2.2, -10.0],
      [1.0, 2.1, -1.0],
      [0.3, 1.8, 6.0],
      [START_POSITION[0], EYE_HEIGHT, START_POSITION[2]],
    ],
    lookAtPoints: [
      [0, 1.8, -14.0],
      [0, 1.65, -8.0],
      [0, 1.65, -4.0],
      [0, EYE_HEIGHT, 0],
    ],
    fov: 56,
    reducedMotionPos: [START_POSITION[0], EYE_HEIGHT, START_POSITION[2]],
    reducedMotionLookAt: [0, EYE_HEIGHT, 0],
  },
]

export const TOTAL_INTRO_DURATION = CHAPTERS.reduce((sum, c) => sum + c.duration, 0)
