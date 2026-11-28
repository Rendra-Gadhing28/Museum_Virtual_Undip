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
 * Penataan 5 pintu di Base Zone 1 secara Simetris sesuai Bab 3.3 Dokumen Acuan:
 * - Dinding Kiri (x = -HALL.halfWidth): Pintu 01 & Pintu 02
 * - Dinding Kanan (x = +HALL.halfWidth): Pintu 03 & Pintu 04
 * - Dinding Belakang (z = HALL.zBack, Sumbu Tengah x = 0): Pintu 05 membingkai Feature Wall UNDIP
 */
export const ZONE1_PORTAL_DOORS: Zone1PortalDoor[] = [
  {
    id: 'yayasan-pendiri',
    doorNumber: 'RUANG 01',
    title: 'Arsip Pendiri & Yayasan',
    subtitle: 'Pancamitra & Akta Pendirian 1956',
    wall: 'left',
    position: [-(HALL.halfWidth - 0.04), 0, 4.0],
    rotationY: Math.PI / 2,
    returnPosition: [-(HALL.halfWidth - 2.6), EYE_HEIGHT, 4.0],
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
    position: [-(HALL.halfWidth - 0.04), 0, -4.0],
    rotationY: Math.PI / 2,
    returnPosition: [-(HALL.halfWidth - 2.6), EYE_HEIGHT, -4.0],
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
    wall: 'right',
    position: [HALL.halfWidth - 0.04, 0, 4.0],
    rotationY: -Math.PI / 2,
    returnPosition: [HALL.halfWidth - 2.6, EYE_HEIGHT, 4.0],
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
    position: [HALL.halfWidth - 0.04, 0, -4.0],
    rotationY: -Math.PI / 2,
    returnPosition: [HALL.halfWidth - 2.6, EYE_HEIGHT, -4.0],
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
    position: [HALL.halfWidth - 0.04, 4.8, -18.0],
    rotationY: -Math.PI / 2,
    returnPosition: [HALL.halfWidth - 2.6, 4.8 + EYE_HEIGHT, -18.0],
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
 * Menghitung dimensi ruangan sub-bab secara dinamis menyesuaikan ID ruang atau jumlah konten/arsip.
 * Khusus Ruang 01 (yayasan-pendiri) memakai proporsi galeri arsip klasik terkurasi (14m x 18m x 5.4m).
 */
export function computeSubRoomDimensions(
  totalItems: number,
  roomId?: Zone1RoomId,
): SubRoomDimensions {
  if (roomId === 'yayasan-pendiri') {
    const halfWidth = 7.0
    const length = 18.0
    const height = 5.4
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

  if (roomId === 'penegerian-soekarno') {
    const halfWidth = 7.5
    const length = 18.0
    const height = 5.8
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

  if (roomId === 'rektorat-pimpinan') {
    const halfWidth = 8.0
    const length = 17.0
    const height = 5.8
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

  if (roomId === 'pembangunan-kampus') {
    const halfWidth = 8.5
    const length = 19.0
    const height = 5.8
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

  if (roomId === 'muladi-dome') {
    const halfWidth = 7.5
    const length = 18.0
    const height = 5.8
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
