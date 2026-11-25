/**
 * Type Definitions for Zone 4: Undip Today
 */

export interface Zone4Exhibit {
  id: string
  title: string
  category: 'campus' | 'lab' | 'library' | 'achievement' | 'monument'
  subtitle?: string
  year?: string
  period?: string
  description: string
  fullContent?: string
  highlights?: string[]
  innovations?: string[]
  leadScientist?: string
  journal?: string
  rank?: string
  institution?: string
  partnerCountry?: string
  stats?: { label: string; value: string | number }[]
  image?: string
}

export interface SelectedZone4Exhibit {
  type: 'campus' | 'lab' | 'library' | 'achievement' | 'monument'
  data: Zone4Exhibit
}
