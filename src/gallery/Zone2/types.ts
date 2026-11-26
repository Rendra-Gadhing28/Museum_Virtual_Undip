import type { RefObject } from 'react'

export type ZoneId = 'zone1' | 'zone2' | 'zone3'

export interface ZoneMeta {
  id: ZoneId
  number: number
  title: string
  subtitle: string
  theme: string
  description: string
  isAvailable: boolean
  badge: string
  accentColor: string
}

export type Zone2Category =
  | 'faculty'
  | 'transformation'
  | 'research'
  | 'achievement'
  | 'monument'

export interface Zone2Exhibit {
  id: string
  title: string
  category: Zone2Category
  period: string
  shortLabel: string
  subtitle: string
  description: string
  fullContent: string
  imagePath?: string
  highlights?: string[]
  stats?: { label: string; value: string }[]
  badge?: string
}

export interface Zone2SelectedExhibit {
  type: 'faculty' | 'transformation' | 'research' | 'achievement' | 'monument' | 'founder' | 'history' | 'podium' | 'prasasti'
  data: Zone2Exhibit | any
}

export type Zone2SectionType =
  | 'entrance'
  | 'faculties'
  | 'transformation'
  | 'research'
  | 'achievements'
  | 'monument'

export interface Zone2ControlsProps {
  resetSignal: number
  targetPosition?: [number, number, number] | null
  moveInputRef: RefObject<{ forward: number; strafe: number }>
  hoveredRef: RefObject<string | null>
  panelOpenRef: RefObject<boolean>
  draggedRef: RefObject<boolean>
  onProximityChange?: (isNear: boolean) => void
}
