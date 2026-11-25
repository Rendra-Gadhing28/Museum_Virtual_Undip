/**
 * Museum Virtual Undip — Layout Spasial Galeri Zona 5 (Undip Future)
 *
 * Mengadopsi arsitektur galeri monumental yang elegan, stabil, dan ringan (seperti Zona 1, 2, 3, 4):
 * - Aula Galeri Indoor Berplafon Tinggi: Lebar 18.0m, Tinggi 9.4m, Panjang 48.0m
 * - Sumbu Tengah Depan: Pusat AI Nexus & Neural Brain
 * - Sumbu Tengah Belakang: HERO Vision Beacon & Horizon Gate 2050
 * - Sayap Barat (Kiri): Digital Twin Plaza & Command Deck Smart Campus
 * - Sayap Timur (Kanan): The Summit World Class University & The Living Grove (SDGs)
 */

export const ZONE5_HALL = {
  halfWidth: 9.0, // 18.0m lebar interior aula galeri
  height: 9.4,    // 9.4m tinggi plafon berundak megah
  zFront: 13.0,   // Dinding gerbang masuk depan
  zBack: -35.0,   // Dinding monumen Horizon Gate belakang
} as const

export const ZONE5_HALL_LENGTH = ZONE5_HALL.zFront - ZONE5_HALL.zBack // 48.0m
export const ZONE5_HALL_CENTER_Z = (ZONE5_HALL.zFront + ZONE5_HALL.zBack) / 2 // -11.0m

export const ZONE5_EYE_HEIGHT = 1.65
export const ZONE5_START_POSITION: [number, number, number] = [0, ZONE5_EYE_HEIGHT, 9.5]
export const ZONE5_WALK_SPEED = 3.6
export const ZONE5_RUN_SPEED = 7.2

export const ZONE5_BOUNDS = {
  minX: -(ZONE5_HALL.halfWidth - 1.2),
  maxX: ZONE5_HALL.halfWidth - 1.2,
  minZ: ZONE5_HALL.zBack + 2.0,
  maxZ: ZONE5_HALL.zFront - 2.0,
} as const

/** Waypoints Teleportasi & Navigasi */
export const ZONE5_TARGETS = {
  entrance: [0, ZONE5_EYE_HEIGHT, 10.0] as [number, number, number],
  neuralCore: [0, ZONE5_EYE_HEIGHT, 2.0] as [number, number, number],
  visionBeacon: [0, ZONE5_EYE_HEIGHT, -17.0] as [number, number, number],
  digitalCampus: [-5.6, ZONE5_EYE_HEIGHT, 4.0] as [number, number, number],
  commandDeck: [-5.6, ZONE5_EYE_HEIGHT, -5.0] as [number, number, number],
  theSummit: [5.6, ZONE5_EYE_HEIGHT, 4.0] as [number, number, number],
  livingGrove: [5.6, ZONE5_EYE_HEIGHT, -5.0] as [number, number, number],
} as const

/** Koordinat Penempatan Sumbu Pameran */
export const VISION_BEACON_POS: [number, number, number] = [0, 0, -23.0]
export const NEURAL_CORE_POS: [number, number, number] = [0, 0, -2.5]
export const ZONE5_DIRECTORY_POS: [number, number, number] = [3.8, 0, 8.5]
export const ZONE5_DIRECTORY_PROXIMITY_RADIUS = 3.2
