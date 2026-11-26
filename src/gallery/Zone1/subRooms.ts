import type { Founder, HistoryExhibit } from './data/exhibits'
import { HISTORY_EXHIBITS, UNDIP_FOUNDERS_5, UNDIP_LEADERSHIP_13 } from './data/exhibits'
import { EYE_HEIGHT, HALL } from './layout'

export type Zone1RoomId =
  | 'yayasan-pendiri'
  | 'penegerian-soekarno'
  | 'rektorat-pimpinan'
  | 'pembangunan-kampus'
  | 'muladi-dome'

export type RoofStyle =
  | 'coffered-skylight'
  | 'labyrinth-pvc'
  | 'octagon-dome'
  | 'coffered-pvc'
  | 'radial-dome'

export interface Zone1PortalDoor {
  id: Zone1RoomId
  doorNumber: string
  title: string
  subtitle: string
  wall: 'left' | 'right'
  position: [number, number, number]
  rotationY: number
  returnPosition: [number, number, number]
  roofStyle: RoofStyle
  founderIds: string[]
  historyIds: string[]
}

/**
 * Penataan 5 pintu di Base Zone 1 dengan formasi | 3   2 |:
 * - Dinding Kiri (x = -HALL.halfWidth): 3 pintu
 * - Dinding Kanan (x = +HALL.halfWidth): 2 pintu
 */
export const ZONE1_PORTAL_DOORS: Zone1PortalDoor[] = [
  {
    id: 'yayasan-pendiri',
    doorNumber: 'RUANG 01',
    title: 'Arsip Pendiri & Yayasan',
    subtitle: 'Pancamitra & Akta Pendirian 1956',
    wall: 'left',
    position: [-(HALL.halfWidth - 0.04), 0, 4.5],
    rotationY: Math.PI / 2,
    returnPosition: [-(HALL.halfWidth - 2.6), EYE_HEIGHT, 4.5],
    roofStyle: 'coffered-skylight',
    founderIds: UNDIP_FOUNDERS_5.map((f) => f.id),
    historyIds: [
      'archives-notary-1956',
      'archives-statuta-1957',
      'early-photo-panti-budaya',
      'early-photo-students-1957',
    ],
  },
  {
    id: 'penegerian-soekarno',
    doorNumber: 'RUANG 02',
    title: 'Penegerian & Pidato Soekarno',
    subtitle: 'Keppres 1960 & Peresmian Universitas',
    wall: 'left',
    position: [-(HALL.halfWidth - 0.04), 0, -6.5],
    rotationY: Math.PI / 2,
    returnPosition: [-(HALL.halfWidth - 2.6), EYE_HEIGHT, -6.5],
    roofStyle: 'labyrinth-pvc',
    founderIds: [],
    historyIds: [
      'artwork-diponegoro-center',
      'decree-sk-1961',
      'decree-lembaran-negara',
      'archives-soekarno-1960',
      'early-photo-soekarno-visit',
    ],
  },
  {
    id: 'rektorat-pimpinan',
    doorNumber: 'RUANG 03',
    title: 'Galeri Rektorat & Pimpinan',
    subtitle: '13 Rektor Undip dari Masa ke Masa',
    wall: 'left',
    position: [-(HALL.halfWidth - 0.04), 0, -17.5],
    rotationY: Math.PI / 2,
    returnPosition: [-(HALL.halfWidth - 2.6), EYE_HEIGHT, -17.5],
    roofStyle: 'octagon-dome',
    founderIds: UNDIP_LEADERSHIP_13.map((f) => f.id),
    historyIds: [],
  },
  {
    id: 'pembangunan-kampus',
    doorNumber: 'RUANG 04',
    title: 'Transformasi Kampus Fisik',
    subtitle: 'Pleburan ke Tembalang (ADB / OECF)',
    wall: 'right',
    position: [HALL.halfWidth - 0.04, 0, -1.0],
    rotationY: -Math.PI / 2,
    returnPosition: [HALL.halfWidth - 2.6, EYE_HEIGHT, -1.0],
    roofStyle: 'coffered-pvc',
    founderIds: [],
    historyIds: [
      'early-campus-pleburan',
      'history-masterplan-tembalang',
      'history-groundbreaking-tembalang',
      'history-widya-puraya',
      'history-rsnd',
      'history-waduk-undip',
    ],
  },
  {
    id: 'muladi-dome',
    doorNumber: 'RUANG 05',
    title: 'Cetak Biru Muladi Dome',
    subtitle: 'Linimasa Ikon & Transformasi Modern',
    wall: 'right',
    position: [HALL.halfWidth - 0.04, 0, -12.0],
    rotationY: -Math.PI / 2,
    returnPosition: [HALL.halfWidth - 2.6, EYE_HEIGHT, -12.0],
    roofStyle: 'radial-dome',
    founderIds: [],
    historyIds: [
      'history-muladi-dome',
      'history-wisuda-perdana',
      'history-transformation',
    ],
  },
]

export interface SubRoomDimensions {
  halfWidth: number
  length: number
  height: number
  zFront: number
  zBack: number
  spawnPosition: [number, number, number]
  bounds: {
    minX: number
    maxX: number
    minZ: number
    maxZ: number
  }
}

/**
 * Menghitung dimensi ruangan sub-bab secara dinamis menyesuaikan jumlah konten/arsip.
 * Semakin banyak koleksi di dalam ruangan, panjang dan lebar ruang menyesuaikan secara proporsional.
 */
export function computeSubRoomDimensions(totalItems: number): SubRoomDimensions {
  const perSideCount = Math.max(2, Math.ceil(totalItems / 2))
  const spacing = 3.2
  const length = Math.max(15, perSideCount * spacing + 7)
  const halfWidth = totalItems > 10 ? 6.8 : totalItems > 5 ? 6.0 : 5.4
  const height = 7.6
  const zFront = length / 2
  const zBack = -length / 2

  return {
    halfWidth,
    length,
    height,
    zFront,
    zBack,
    spawnPosition: [0, EYE_HEIGHT, zFront - 2.6],
    bounds: {
      minX: -(halfWidth - 1.1),
      maxX: halfWidth - 1.1,
      minZ: zBack + 1.6,
      maxZ: zFront - 1.6,
    },
  }
}

export function getRoomExhibits(portal: Zone1PortalDoor): {
  founders: Founder[]
  histories: HistoryExhibit[]
} {
  const allFounders = [...UNDIP_FOUNDERS_5, ...UNDIP_LEADERSHIP_13]
  const founders = portal.founderIds
    .map((id) => allFounders.find((f) => f.id === id))
    .filter((f): f is Founder => Boolean(f))

  const histories = portal.historyIds
    .map((id) => HISTORY_EXHIBITS.find((h) => h.id === id))
    .filter((h): h is HistoryExhibit => Boolean(h))

  return { founders, histories }
}
