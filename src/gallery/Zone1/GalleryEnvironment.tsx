import { BaseZoneHall } from './BaseZoneHall'
import type { Zone1PortalDoor, Zone1RoomId } from './subRooms'

interface GalleryEnvironmentProps {
  isNearDirectory?: boolean
  hoveredId?: string | null
  isMobile?: boolean
  portals?: Zone1PortalDoor[]
  onSelectPortal?: (roomId: Zone1RoomId) => void
  onHover?: (id: string | null) => void
}

/**
 * Museum Virtual Undip - Master Architectural Environment
 * Merupakan wrapper arsitektur Base Zone (Central Orientation Hall):
 * Menerapkan panduan master arsitektur Neoclassical Modern + Indonesian Heritage:
 * - Hall batu kapur monumental + coffered ceiling & skylight terang
 * - Symmetrical Ionic colonnade & pilasters
 * - Lantai Medallion konsentris (Navy, Stone, Gold)
 * - Bangku museum abu-abu, planter tengah, dan meja informasi bundar
 * - Menjaga DirectoryBoard & 5 Portal interaktif ke seluruh galeri
 */
export function GalleryEnvironment({
  isNearDirectory = false,
  hoveredId = null,
  isMobile = false,
  portals = [],
  onSelectPortal,
  onHover,
}: GalleryEnvironmentProps) {
  return (
    <BaseZoneHall
      isNearDirectory={isNearDirectory}
      hoveredId={hoveredId}
      isMobile={isMobile}
      portals={portals}
      onSelectPortal={onSelectPortal}
      onHover={onHover}
    />
  )
}
