/**
 * The Museum Engine — Cinematic Intro Configuration & Palette
 *
 * Memperkenalkan Base Zone 1 beserta 5 pintu ruangan sub-bab secara berurutan
 * dengan sudut kamera yang mengarah halus ke setiap pintu dan penjelasan
 * ringkas-padat di pojok kiri bawah.
 */

import { EYE_HEIGHT, HALL, START_POSITION } from '../Zone1/layout'

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
      'Pusat orientasi Zona 1 (The Origin of Undip). Atrium megah 2 lantai yang menghubungkan lima galeri arsip sejarah pendirian hingga transformasi fisik kampus.',
    telemetryLabel: 'BASE ZONE 1 • GRAND ATRIUM',
    duration: 5.5,
    cameraPoints: [
      [0, 9.6, -12.0],
      [0, 7.4, -5.0],
      [0, 4.2, 3.5],
      [0, 2.5, 9.0],
    ],
    lookAtPoints: [
      [0, 9.9, -21.88],
      [0, 7.2, -18.0],
      [0, 3.6, -6.0],
      [0, 2.4, -2.0],
    ],
    fov: 54,
    reducedMotionPos: [0, 9.6, -12.0],
    reducedMotionLookAt: [0, 9.9, -21.88],
  },
  {
    id: 'room1',
    chapterNumber: 1,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Ruang 01 — Arsip Pendiri & Yayasan',
    description:
      'Memuat Akta Notaris Yayasan Universitas Semarang 1956, Statuta 1957, foto kampus awal, dan biografi lima tokoh Pancamitra pendiri Undip.',
    telemetryLabel: 'PINTU 01 • ERA PRAKARSA (1956)',
    duration: 4.8,
    cameraPoints: [
      [0, 2.5, 9.0],
      [-7.5, 2.3, 6.8],
      [-14.2, 2.2, 4.0],
    ],
    lookAtPoints: [
      [-8.0, 2.2, 6.0],
      [LEFT_DOOR_X, 2.2, 4.0],
      [LEFT_DOOR_X, 2.2, 4.0],
    ],
    fov: 55,
    reducedMotionPos: [-14.2, 2.2, 4.0],
    reducedMotionLookAt: [LEFT_DOOR_X, 2.2, 4.0],
  },
  {
    id: 'room2',
    chapterNumber: 2,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Ruang 02 — Penegerian & Pidato Soekarno',
    description:
      'Menyajikan Keputusan Presiden tentang penegerian Undip, Lembaran Negara, dokumentasi pidato Presiden Soekarno, dan karya sejarah Diponegoro.',
    telemetryLabel: 'PINTU 02 • PENEGERIAN (1960)',
    duration: 4.8,
    cameraPoints: [
      [-14.2, 2.2, 4.0],
      [-14.2, 2.2, 0],
      [-14.2, 2.2, -4.0],
    ],
    lookAtPoints: [
      [LEFT_DOOR_X, 2.2, 4.0],
      [LEFT_DOOR_X, 2.2, -1.5],
      [LEFT_DOOR_X, 2.2, -4.0],
    ],
    fov: 55,
    reducedMotionPos: [-14.2, 2.2, -4.0],
    reducedMotionLookAt: [LEFT_DOOR_X, 2.2, -4.0],
  },
  {
    id: 'room3',
    chapterNumber: 3,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Ruang 03 — Galeri Rektorat & Pimpinan',
    description:
      'Menghimpun potret resmi dan rekam jejak pengabdian 13 rektor Universitas Diponegoro dari masa perintisan hingga kepemimpinan masa kini.',
    telemetryLabel: 'PINTU 03 • KEPEMIMPINAN REKTORAT',
    duration: 5.4,
    cameraPoints: [
      [-14.2, 2.2, -4.0],
      [-5.5, 2.4, 0.4],
      [5.5, 2.4, 0.5],
      [14.2, 2.2, 4.0],
    ],
    lookAtPoints: [
      [-4.0, 2.2, 0],
      [4.0, 2.2, 0.5],
      [RIGHT_DOOR_X, 2.2, 3.0],
      [RIGHT_DOOR_X, 2.2, 4.0],
    ],
    fov: 55,
    reducedMotionPos: [14.2, 2.2, 4.0],
    reducedMotionLookAt: [RIGHT_DOOR_X, 2.2, 4.0],
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
      [14.2, 2.2, 4.0],
      [14.2, 2.2, 0],
      [14.2, 2.2, -4.0],
    ],
    lookAtPoints: [
      [RIGHT_DOOR_X, 2.2, 4.0],
      [RIGHT_DOOR_X, 2.2, -1.5],
      [RIGHT_DOOR_X, 2.2, -4.0],
    ],
    fov: 55,
    reducedMotionPos: [14.2, 2.2, -4.0],
    reducedMotionLookAt: [RIGHT_DOOR_X, 2.2, -4.0],
  },
  {
    id: 'room5',
    chapterNumber: 5,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Ruang 05 — Cetak Biru Muladi Dome',
    description:
      'Terletak di balkon Mezzanine Lantai 2. Menampilkan cetak biru ikonik Muladi Dome, wisuda perdana, serta transformasi universitas.',
    telemetryLabel: 'PINTU 05 • BALKON MEZZANINE LANTAI 2',
    duration: 5.4,
    cameraPoints: [
      [14.2, 2.2, -4.0],
      [7.0, 4.5, -6.5],
      [6.0, 7.2, -12.0],
      [13.5, 6.8, -18.0],
    ],
    lookAtPoints: [
      [RIGHT_DOOR_X, 2.2, -4.0],
      [5.0, 5.5, -14.0],
      [RIGHT_DOOR_X, 6.8, -16.5],
      [RIGHT_DOOR_X, 6.8, -18.0],
    ],
    fov: 55,
    reducedMotionPos: [13.5, 6.8, -18.0],
    reducedMotionLookAt: [RIGHT_DOOR_X, 6.8, -18.0],
  },
  {
    id: 'epilogue',
    chapterNumber: null,
    totalTechChapters: TOTAL_TECH_CHAPTERS,
    title: 'Selamat Menjelajah',
    description:
      'Gunakan tangga kembar marmer untuk menuju balkon lantai 2 atau masuki galeri pameran di lantai dasar.',
    telemetryLabel: 'SIAP MENJELAJAH • ATRIUM UTAMA',
    duration: 5.0,
    cameraPoints: [
      [13.5, 6.8, -18.0],
      [4.5, 6.8, -10.0],
      [1.2, 3.6, 2.0],
      [START_POSITION[0], EYE_HEIGHT, START_POSITION[2]],
    ],
    lookAtPoints: [
      [0, 6.0, -14.0],
      [0, 4.0, -4.0],
      [0, 2.2, 0],
      [0, EYE_HEIGHT, 0],
    ],
    fov: 56,
    reducedMotionPos: [START_POSITION[0], EYE_HEIGHT, START_POSITION[2]],
    reducedMotionLookAt: [0, EYE_HEIGHT, 0],
  },
]

export const TOTAL_INTRO_DURATION = CHAPTERS.reduce((sum, c) => sum + c.duration, 0)
