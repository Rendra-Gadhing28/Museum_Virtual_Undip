export interface Zone5Exhibit {
  id: string
  title: string
  category: 'digitalCampus' | 'aiNexus' | 'smartUniversity' | 'worldClass' | 'sustainability' | 'vision'
  subtitle?: string
  description: string
  stats?: string
  highlights?: string[]
  level?: number
  metric?: string
  targetYear?: string
}

export interface SelectedZone5Exhibit {
  type: string
  data: Zone5Exhibit
}

export interface TourWaypoint {
  id: string
  title: string
  subtitle: string
  position: [number, number, number]
  lookAt: [number, number, number]
  duration: number
}

export interface FutureLantern {
  id: string
  text: string
  author: string
  timestamp: string
  position: [number, number, number]
}
