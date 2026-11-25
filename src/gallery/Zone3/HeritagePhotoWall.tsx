import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import { createHistoricalPhotoTexture } from './textures'
import { PHOTO_WALL_Z } from './layout'
import zone3Data from './data/zone3.json'

interface HeritagePhotoWallProps {
  selectedId: string | null
  hoveredId: string | null
  onSelect: (item: any) => void
  onHover: (id: string | null) => void
}

/**
 * GALERI MONUMENTAL 28 FOTO SEJARAH PERJALANAN UNIVERSITAS DIPONEGORO
 * Diposisikan di Dinding Belakang Monumental (Z = -32.7)
 * Membentang rapi dalam susunan salon hang berirama dengan bingkai kuningan emas
 */
export function HeritagePhotoWall({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: HeritagePhotoWallProps) {
  const photos = zone3Data.photos

  // Tata letak 28 Foto dalam 3 baris:
  // Baris Atas (10 foto), Baris Tengah (9 foto), Baris Bawah (9 foto)
  const photoSlots = useMemo(() => {
    return photos.map((photo, i) => {
      let row = 0
      let col = 0
      let totalInRow = 10

      if (i < 10) {
        row = 2 // Baris Atas (Y = 6.8)
        col = i
        totalInRow = 10
      } else if (i < 19) {
        row = 1 // Baris Tengah (Y = 4.8)
        col = i - 10
        totalInRow = 9
      } else {
        row = 0 // Baris Bawah (Y = 2.8)
        col = i - 19
        totalInRow = 9
      }

      // X berkisar dari -7.5 s.d. +7.5
      const spanX = 15.0
      const startX = -spanX / 2
      const stepX = spanX / (totalInRow - 1)
      const px = startX + col * stepX
      const py = 2.6 + row * 1.9

      return {
        photo,
        x: px,
        y: py,
        w: 1.35,
        h: 0.95,
      }
    })
  }, [photos])

  return (
    <group position={[0, 0, PHOTO_WALL_Z]}>
      {/* Header Galeri Foto */}
      <group position={[0, 8.2, 0]}>
        <Text fontSize={0.34} color="#ffd700" anchorX="center">
          GALERI 28 FOTO SEJARAH PERJALANAN UNIVERSITAS DIPONEGORO
        </Text>
        <Text position={[0, -0.32, 0]} fontSize={0.16} color="#cbd5e1" anchorX="center">
          Rekaman Momen Kuliah Perdana 1957, Amanat Bung Karno 1960, Kampus Pleburan, hingga Tembalang
        </Text>
      </group>

      {/* Grid 28 Bingkai Foto Sejarah */}
      {photoSlots.map((slot) => {
        const { photo, x, y, w, h } = slot
        const isSelected = selectedId === photo.id
        const isHovered = hoveredId === photo.id

        return (
          <group
            key={photo.id}
            position={[x, y, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({ type: 'photo', data: photo })
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHover(photo.id)
            }}
            onPointerOut={() => onHover(null)}
          >
            {/* Bingkai Emas Foto */}
            <mesh castShadow>
              <boxGeometry args={[w + 0.08, h + 0.08, 0.03]} />
              <meshStandardMaterial
                color={isSelected ? '#ffd700' : isHovered ? '#e8c56e' : '#c9a24b'}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>

            {/* Kanvas Foto (Tekstur Kanvas Sepia/Monokrom) */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[w, h]} />
              <meshStandardMaterial
                map={createHistoricalPhotoTexture(photo)}
                color="#ffffff"
                roughness={0.4}
              />
            </mesh>

            {/* Label Tahun di Bawah Bingkai */}
            <mesh position={[0, -h / 2 - 0.12, 0.01]}>
              <boxGeometry args={[w * 0.9, 0.14, 0.01]} />
              <meshStandardMaterial color="#0B1F3A" roughness={0.5} />
            </mesh>
            <Text
              position={[0, -h / 2 - 0.12, 0.02]}
              fontSize={0.065}
              color="#ffd700"
              anchorX="center"
              anchorY="middle"
              maxWidth={w * 0.85}
            >
              {photo.year}
            </Text>
          </group>
        )
      })}
    </group>
  )
}
