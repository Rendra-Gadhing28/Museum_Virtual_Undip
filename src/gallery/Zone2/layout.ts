/**
 * Zone 2 Layout & Dimensions — The Growth of Knowledge
 * Consistent with Zone 1's monumental proportions while featuring
 * a non-monotonous, tiered spatial arrangement for:
 * 1. Perkembangan Fakultas (Left Wing)
 * 2. Transformasi Kampus Undip (Center Tiered Diorama)
 * 3. Perkembangan Pendidikan & Penelitian (Right Wing - Section A)
 * 4. Prestasi Akademik & Kontribusi Masyarakat (Right Wing - Section B)
 * 5. Back Focal Wall: Monumen The Growth of Knowledge
 */

export const ZONE2_HALL = {
  halfWidth: 7.6, // 15.2m wide interior
  height: 8.8,    // 8.8m elevated grand monumental ceiling
  zFront: 12.0,   // Front partition wall
  zBack: -26.0,   // Back monumental focal wall
} as const

export const ZONE2_HALL_LENGTH = ZONE2_HALL.zFront - ZONE2_HALL.zBack // 38.0m
export const ZONE2_HALL_CENTER_Z = (ZONE2_HALL.zFront + ZONE2_HALL.zBack) / 2 // -7.0m

export const ZONE2_EYE_HEIGHT = 1.65
export const ZONE2_START_POSITION: [number, number, number] = [0, ZONE2_EYE_HEIGHT, 9.5]
export const ZONE2_WALK_SPEED = 3.6
export const ZONE2_RUN_SPEED = 7.2

export const ZONE2_BOUNDS = {
  minX: -(ZONE2_HALL.halfWidth - 1.2),
  maxX: ZONE2_HALL.halfWidth - 1.2,
  minZ: ZONE2_HALL.zBack + 1.8,
  maxZ: ZONE2_HALL.zFront - 1.8,
} as const

/** Left Side (Perkembangan Fakultas) — 11 panels, chronologically ordered */
export const FACULTY_WALL_X = -(ZONE2_HALL.halfWidth - 0.2)
export const FACULTY_START_Z = 8.8
export const FACULTY_SPACING = 3.1
export const FACULTY_PANEL_Y = 2.9

/** Right Side (Penelitian & Prestasi Kontribusi) */
export const RESEARCH_WALL_X = ZONE2_HALL.halfWidth - 0.2
export const RESEARCH_START_Z = 6.5
export const RESEARCH_SPACING = 6.2
export const RESEARCH_PANEL_Y = 2.8

/** Center Sumbu Diorama Transformasi */
export const DIORAMA_POS: [number, number, number] = [0, 0, -4.5]
export const MONUMENT_POS: [number, number, number] = [0, 0, -25.2]
export const ZONE2_DIRECTORY_POS: [number, number, number] = [3.8, 0, 8.5]
export const ZONE2_DIRECTORY_PROXIMITY_RADIUS = 3.2

/** Quick Waypoint Teleport Targets */
export const ZONE2_TARGETS = {
  entrance: [0, ZONE2_EYE_HEIGHT, 9.5] as [number, number, number],
  faculties: [-4.2, ZONE2_EYE_HEIGHT, 1.0] as [number, number, number],
  transformation: [0, ZONE2_EYE_HEIGHT, -1.0] as [number, number, number],
  research: [4.2, ZONE2_EYE_HEIGHT, 3.0] as [number, number, number],
  achievements: [4.2, ZONE2_EYE_HEIGHT, -9.0] as [number, number, number],
  monument: [0, ZONE2_EYE_HEIGHT, -20.0] as [number, number, number],
}
