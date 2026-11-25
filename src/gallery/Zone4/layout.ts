/**
 * Museum Virtual Undip — Layout & Dimensi Zona 4: Undip Today
 *
 * Mengusung DNA arsitektural ruangan galeri museum megah seperti Zona 1 & 2,
 * dengan proporsi aula kontemporer yang lapang dan berwibawa:
 * - Aula Galeri Indoor: Lebar 21.0m, Tinggi 9.6m, Panjang 50.0m
 * - Sayap Kiri: Laboratorium & Pusat Penelitian (Teknologi & Sains)
 * - Sayap Kanan: Perpustakaan & Pusat Pengetahuan (Literasi & Repositori Digital)
 * - Sumbu Tengah Depan: Maket Kampus Modern Tembalang & Smart Campus
 * - Sumbu Tengah Belakang: Panggung Prestasi Internasional & Pengakuan Global
 */

export const ZONE4_HALL = {
  halfWidth: 10.5, // 21.0m lebar interior aula galeri
  height: 9.6,     // 9.6m tinggi plafon berundak megah
  zFront: 14.0,    // Dinding gerbang masuk depan
  zBack: -36.0,    // Dinding monumen prestasi internasional belakang
} as const

export const ZONE4_HALL_LENGTH = ZONE4_HALL.zFront - ZONE4_HALL.zBack // 50.0m
export const ZONE4_HALL_CENTER_Z = (ZONE4_HALL.zFront + ZONE4_HALL.zBack) / 2 // -11.0m

export const ZONE4_EYE_HEIGHT = 1.65
export const ZONE4_START_POSITION: [number, number, number] = [0, ZONE4_EYE_HEIGHT, 9.0]
export const ZONE4_WALK_SPEED = 3.8
export const ZONE4_RUN_SPEED = 7.5

export const ZONE4_BOUNDS = {
  minX: -(ZONE4_HALL.halfWidth - 1.2),
  maxX: ZONE4_HALL.halfWidth - 1.2,
  minZ: ZONE4_HALL.zBack + 2.5,
  maxZ: ZONE4_HALL.zFront - 2.5,
} as const

/** Koordinat Waypoint Navigasi Teleport */
export const ZONE4_TARGETS = {
  entrance: [0, ZONE4_EYE_HEIGHT, 11.0] as [number, number, number],
  campusMaket: [0, ZONE4_EYE_HEIGHT, 3.5] as [number, number, number],
  labs: [-6.5, ZONE4_EYE_HEIGHT, -8.0] as [number, number, number],
  library: [6.5, ZONE4_EYE_HEIGHT, -8.0] as [number, number, number],
  achievements: [0, ZONE4_EYE_HEIGHT, -24.0] as [number, number, number],
} as const

/** Sumbu Pameran Galeri */
export const MAKET_POS: [number, number, number] = [0, 0, -2.5]
export const STAGE_POS: [number, number, number] = [0, 0, -26.0]
export const LABS_WALL_X = -(ZONE4_HALL.halfWidth - 0.3)
export const LIBRARY_WALL_X = ZONE4_HALL.halfWidth - 0.3
export const ZONE4_DIRECTORY_POS: [number, number, number] = [4.2, 0, 9.5]
export const ZONE4_DIRECTORY_PROXIMITY_RADIUS = 3.2
