/**
 * The Museum Engine — Cinematic Intro Configuration & Palette
 *
 * Memperkenalkan Base Zone 1 beserta 5 pintu ruangan sub-bab secara berurutan
 * dengan sudut kamera yang mengarah halus ke setiap pintu dan penjelasan
 * ringkas-padat di pojok kiri bawah.
 */

import { EYE_HEIGHT, HALL, PODIUM_POS, START_POSITION } from '../Zone1/layout'

export const INTRO_STORAGE_KEY = 'undip_cinematic_intro_seen'

export const CINEMATIC_PALETTE = {
  ink: '#09090B',
  inkPanel: 'rgba(9, 9, 11, 0.86)',
  paper: '#EDE6D6',
  accent: '#C8A25A',
  accentGlow: 'rgba(200, 162, 90, 0.35)',
  muted: '#8E877A',
  technical: '#5E9A93',
  technicalDim: 'rgba(94, 154, 147, 0.28)',
} as const

export type ChapterId =
  | 'prologue'
  | 'room1'
  | 'room2'
  | 'room3'
  | 'room4'
  | 'room5'
  | 'epilogue'

export interface ChapterConfig {
  id: ChapterId
  /** Nomor pintu (null untuk prolog/epilog, 1..5 untuk tiap pintu ruangan) */
  chapterNumber: number | null
  totalTechChapters: number
  title: string
  description: string
  telemetryLabel: string
  duration: number
  /** Titik kurva posisi kamera */
  cameraPoints: [number, number, number][]
  /** Titik kurva target pandang kamera (mengarah halus ke pintu) */
  lookAtPoints: [number, number, number][]
  fov: number
  reducedMotionPos: [number, number, number]
  reducedMotionLookAt: [number, number, number]
}

export const TOTAL_TECH_CHAPTERS = 5

const LEFT_DOOR_X = -(HALL.halfWidth - 0.04)
const RIGHT_DOOR_X = HALL.halfWidth - 0.04

export const CHAPTERS: ChapterConfig[] = [
  {
    id: 'prologue',
    chapterNumber: null,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Aula Utama — Base Zone 1',
    description:
      'Pusat orientasi Zona 1 (The Origin of Undip) yang menghubungkan lima ruangan arsip sejarah pendirian hingga transformasi fisik kampus.',
    telemetryLabel: 'BASE ZONE 1',
    duration: 4.0,
    cameraPoints: [
      [0, 5.4, -15.5],
      [0, 4.0, -7.0],
      [-0.8, 3.0, 2.5],
    ],
    lookAtPoints: [
      [0, 2.0, -3.0],
      [0, 2.2, 1.5],
      [-3.5, 2.6, 4.0],
    ],
    fov: 55,
    reducedMotionPos: [0, 4.0, -7.0],
    reducedMotionLookAt: [0, 2.0, 1.0],
  },
  {
    id: 'room1',
    chapterNumber: 1,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Ruang 01 — Arsip Pendiri & Yayasan',
    description:
      'Memuat Akta Notaris Yayasan Universitas Semarang 1956, Statuta 1957, foto kampus awal, dan biografi lima tokoh Pancamitra pendiri Undip.',
    telemetryLabel: 'PINTU 01 • ERA PRAKARSA (1956)',
    duration: 4.6,
    cameraPoints: [
      [-0.8, 3.0, 2.5],
      [-2.4, 2.6, 4.2],
      [-2.8, 2.6, 4.5],
    ],
    lookAtPoints: [
      [LEFT_DOOR_X, 2.6, 4.5],
      [LEFT_DOOR_X, 2.8, 4.5],
      [LEFT_DOOR_X, 2.75, 4.5],
    ],
    fov: 56,
    reducedMotionPos: [-2.6, 2.6, 4.5],
    reducedMotionLookAt: [LEFT_DOOR_X, 2.75, 4.5],
  },
  {
    id: 'room2',
    chapterNumber: 2,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Ruang 02 — Penegerian & Pidato Soekarno',
    description:
      'Menyajikan Keputusan Presiden tentang penegerian Undip, Lembaran Negara, dokumentasi pidato Presiden Soekarno, dan karya sejarah Diponegoro.',
    telemetryLabel: 'PINTU 02 • PENEGERIAN (1960)',
    duration: 4.6,
    cameraPoints: [
      [-2.8, 2.6, 4.5],
      [-2.4, 2.6, -1.0],
      [-2.8, 2.6, -6.5],
    ],
    lookAtPoints: [
      [LEFT_DOOR_X, 2.75, 4.5],
      [LEFT_DOOR_X, 2.7, -2.0],
      [LEFT_DOOR_X, 2.75, -6.5],
    ],
    fov: 56,
    reducedMotionPos: [-2.6, 2.6, -6.5],
    reducedMotionLookAt: [LEFT_DOOR_X, 2.75, -6.5],
  },
  {
    id: 'room3',
    chapterNumber: 3,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Ruang 03 — Galeri Rektorat & Pimpinan',
    description:
      'Menghimpun potret resmi dan rekam jejak pengabdian 13 rektor Universitas Diponegoro dari masa perintisan hingga kepemimpinan masa kini.',
    telemetryLabel: 'PINTU 03 • KEPEMIMPINAN',
    duration: 4.6,
    cameraPoints: [
      [-2.8, 2.6, -6.5],
      [-2.4, 2.6, -12.5],
      [-2.8, 2.6, -17.5],
    ],
    lookAtPoints: [
      [LEFT_DOOR_X, 2.75, -6.5],
      [LEFT_DOOR_X, 2.7, -13.0],
      [LEFT_DOOR_X, 2.75, -17.5],
    ],
    fov: 56,
    reducedMotionPos: [-2.6, 2.6, -17.5],
    reducedMotionLookAt: [LEFT_DOOR_X, 2.75, -17.5],
  },
  {
    id: 'room4',
    chapterNumber: 4,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Ruang 04 — Transformasi Kampus Fisik',
    description:
      'Merekam peralihan kampus Pleburan ke kawasan terpadu Tembalang (ADB/OECF), Gedung Widya Puraya, Rumah Sakit RSND, dan Waduk Edukasi.',
    telemetryLabel: 'PINTU 04 • PLEBURAN–TEMBALANG',
    duration: 4.8,
    cameraPoints: [
      [-2.8, 2.6, -17.5],
      [0.6, 2.8, -9.0],
      [2.8, 2.6, -1.0],
    ],
    lookAtPoints: [
      [0, 2.2, -11.0],
      [RIGHT_DOOR_X, 2.7, -3.5],
      [RIGHT_DOOR_X, 2.75, -1.0],
    ],
    fov: 56,
    reducedMotionPos: [2.6, 2.6, -1.0],
    reducedMotionLookAt: [RIGHT_DOOR_X, 2.75, -1.0],
  },
  {
    id: 'room5',
    chapterNumber: 5,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Ruang 05 — Cetak Biru Muladi Dome',
    description:
      'Menampilkan cetak biru, linimasa peresmian gedung konvensi ikonik Muladi Dome, wisuda perdana, serta transformasi menuju PTN-BH.',
    telemetryLabel: 'PINTU 05 • IKON & TRANSFORMASI',
    duration: 4.6,
    cameraPoints: [
      [2.8, 2.6, -1.0],
      [2.4, 2.6, -6.5],
      [2.8, 2.6, -12.0],
    ],
    lookAtPoints: [
      [RIGHT_DOOR_X, 2.75, -1.0],
      [RIGHT_DOOR_X, 2.7, -7.5],
      [RIGHT_DOOR_X, 2.75, -12.0],
    ],
    fov: 56,
    reducedMotionPos: [2.6, 2.6, -12.0],
    reducedMotionLookAt: [RIGHT_DOOR_X, 2.75, -12.0],
  },
  {
    id: 'epilogue',
    chapterNumber: null,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Selamat Menjelajah',
    description:
      'Klik pintu mana saja untuk memasuki ruangan arsip sejarah, atau gunakan bilah sisi kiri untuk berpindah antar zona.',
    telemetryLabel: 'SIAP MENJELAJAH',
    duration: 3.8,
    cameraPoints: [
      [2.8, 2.6, -12.0],
      [1.2, 2.2, -2.0],
      [START_POSITION[0], EYE_HEIGHT, START_POSITION[2]],
    ],
    lookAtPoints: [
      [PODIUM_POS[0], 1.8, PODIUM_POS[2]],
      [0, 1.8, -5.0],
      [0, EYE_HEIGHT, 0],
    ],
    fov: 56,
    reducedMotionPos: [START_POSITION[0], EYE_HEIGHT, START_POSITION[2]],
    reducedMotionLookAt: [0, EYE_HEIGHT, 0],
  },
]

export const TOTAL_INTRO_DURATION = CHAPTERS.reduce((sum, c) => sum + c.duration, 0)
