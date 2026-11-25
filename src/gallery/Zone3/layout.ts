/**
 * Museum Virtual Undip — Layout & Dimensi Spasial Galeri Zona 3 (The Heritage of Undip)
 *
 * Mengadopsi arsitektur galeri monumental seperti Zona 1:
 * - Aula Galeri Indoor Berplafon Tinggi: Lebar 18.0m, Tinggi 9.2m, Panjang 46.0m
 * - Sumbu Tengah: Pintu Masuk -> Papan Direktori -> Meja Pusaka -> HERO: Plaza Prasasti Peresmian
 * - Dinding Belakang: Galeri Monumental 28 Foto Sejarah
 * - Sayap Barat (Kiri): Sayap 12 Vitrine Artefak Akademik & 8 Tokoh Memorabilia
 * - Sayap Timur (Kanan): Sayap 10 Dokumen Piagam Penting & Paviliun Audiovisual Mini-Cinema
 */

export const ZONE3_HALL = {
  halfWidth: 9.0, // 18.0m lebar interior aula galeri
  height: 9.2,    // 9.2m tinggi plafon berundak megah
  zFront: 13.0,   // Dinding gerbang masuk depan
  zBack: -33.0,   // Dinding monumen & galeri foto belakang
} as const

export const ZONE3_HALL_LENGTH = ZONE3_HALL.zFront - ZONE3_HALL.zBack // 46.0m
export const ZONE3_HALL_CENTER_Z = (ZONE3_HALL.zFront + ZONE3_HALL.zBack) / 2 // -10.0m

export const ZONE3_EYE_HEIGHT = 1.65
export const ZONE3_START_POSITION: [number, number, number] = [0, ZONE3_EYE_HEIGHT, 9.5]
export const ZONE3_WALK_SPEED = 3.6
export const ZONE3_RUN_SPEED = 7.2

export const ZONE3_BOUNDS = {
  minX: -(ZONE3_HALL.halfWidth - 1.2),
  maxX: ZONE3_HALL.halfWidth - 1.2,
  minZ: ZONE3_HALL.zBack + 2.0,
  maxZ: ZONE3_HALL.zFront - 2.0,
} as const

/** Waypoints Teleportasi & Navigasi */
export const ZONE3_TARGETS = {
  entrance: [0, ZONE3_EYE_HEIGHT, 10.0] as [number, number, number],
  prasasti: [0, ZONE3_EYE_HEIGHT, -16.0] as [number, number, number],
  photos: [0, ZONE3_EYE_HEIGHT, -25.5] as [number, number, number],
  artifacts: [-5.6, ZONE3_EYE_HEIGHT, -4.0] as [number, number, number],
  legacy: [-5.6, ZONE3_EYE_HEIGHT, 4.0] as [number, number, number],
  documents: [5.6, ZONE3_EYE_HEIGHT, -4.0] as [number, number, number],
  cinema: [5.6, ZONE3_EYE_HEIGHT, 4.0] as [number, number, number],
} as const

/** Koordinat Penempatan Sumbu Pameran */
export const PRASASTI_HERO_POS: [number, number, number] = [0, 0, -21.0]
export const PHOTO_WALL_Z = ZONE3_HALL.zBack + 0.3
export const HERITAGE_TABLE_POS: [number, number, number] = [0, 0, -2.5]
export const ZONE3_DIRECTORY_POS: [number, number, number] = [3.8, 0, 8.5]
export const ZONE3_DIRECTORY_PROXIMITY_RADIUS = 3.2

export const ARTIFACTS_WALL_X = -(ZONE3_HALL.halfWidth - 0.25)
export const DOCUMENTS_WALL_X = ZONE3_HALL.halfWidth - 0.25
