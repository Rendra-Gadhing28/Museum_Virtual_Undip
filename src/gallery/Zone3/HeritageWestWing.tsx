import { Text } from '@react-three/drei'
import zone3Data from './data/zone3.json'

interface HeritageWestWingProps {
  selectedId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelect: (item: any) => void
  onHover: (id: string | null) => void
}

/**
 * SAYAP BARAT (KIRI) ZONA 3:
 * 1. Bagian Artefak Akademik: 12 Vitrine Kaca Berlis Kuningan Emas
 * 2. Bagian Memorabilia Tokoh ("Hall of Legacy"): 8 Pilar Kehormatan Tokoh Pendiri & Guru Besar
 */
export function HeritageWestWing({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: HeritageWestWingProps) {
  const artifacts = zone3Data.artifacts
  const tokohList = zone3Data.memorabilia

  // 12 Vitrine Artefak ditempatkan di X = -7.2 dari Z = 6.0 s.d. Z = -16.0
  const artifactSpacing = 1.9
  const artifactStartZ = 6.0

  return (
    <group position={[-7.2, 0, 0]}>
      {/* Header Sayap Kiri */}
      <group position={[0, 5.8, -5.0]} rotation={[0, Math.PI / 2, 0]}>
        <Text fontSize={0.34} color="#ffd700" anchorX="center">
          SAYAP ARTEFAK AKADEMIK & MEMORABILIA TOKOH PERINTIS
        </Text>
        <Text position={[0, -0.38, 0]} fontSize={0.18} color="#cbd5e1" anchorX="center">
          Warisan Instrumen Riset, Busana Kehormatan, dan Jejak Tokoh Pendiri Undip
        </Text>
      </group>

      {/* ==============================================================
          A. 12 VITRINE ARTEFAK AKADEMIK
          ============================================================== */}
      {artifacts.map((art, idx) => {
        const pz = artifactStartZ - idx * artifactSpacing
        const isSelected = selectedId === art.id
        const isHovered = hoveredId === art.id

        return (
          <group
            key={art.id}
            position={[0, 0, pz]}
            rotation={[0, Math.PI / 2, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({ type: 'artifact', data: art })
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHover(art.id)
            }}
            onPointerOut={() => onHover(null)}
          >
            {/* Meja Plinth Marmer Ivory Bertingkat */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.4, 0.9, 0.7]} />
              <meshStandardMaterial
                color={isSelected ? '#2e2515' : isHovered ? '#1f1b14' : '#141416'}
                roughness={0.4}
              />
            </mesh>
            {/* Lis Emas Meja */}
            <mesh position={[0, 0.91, 0]}>
              <boxGeometry args={[1.44, 0.02, 0.74]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Kotak Kaca Pelindung Vitrine */}
            <mesh position={[0, 1.45, 0]}>
              <boxGeometry args={[1.36, 1.05, 0.66]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.22}
                roughness={0.1}
                metalness={0.1}
              />
            </mesh>

            {/* Replika Simbolis Artefak di Dalam Kaca */}
            <mesh position={[0, 1.25, 0]} castShadow>
              {idx % 4 === 0 && <cylinderGeometry args={[0.2, 0.28, 0.5, 16]} />}
              {idx % 4 === 1 && <boxGeometry args={[0.42, 0.12, 0.32]} />}
              {idx % 4 === 2 && <sphereGeometry args={[0.22, 16, 16]} />}
              {idx % 4 === 3 && <cylinderGeometry args={[0.08, 0.12, 0.45, 12]} />}
              <meshStandardMaterial
                color={isSelected ? '#ffd700' : isHovered ? '#e8c56e' : '#c9a24b'}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* Plat Nama Kuningan di Depan Plinth */}
            <mesh position={[0, 0.5, 0.36]}>
              <boxGeometry args={[1.1, 0.22, 0.02]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.85} roughness={0.2} />
            </mesh>
            <Text
              position={[0, 0.54, 0.38]}
              fontSize={0.065}
              color="#0b1f3a"
              anchorX="center"
              maxWidth={1.05}
              textAlign="center"
            >
              {art.title}
            </Text>
            <Text position={[0, 0.44, 0.38]} fontSize={0.05} color="#1e3a5f" anchorX="center">
              {art.year} • {art.category}
            </Text>
          </group>
        )
      })}

      {/* ==============================================================
          B. 8 PILAR KEHORMATAN TOKOH ("HALL OF LEGACY")
          Diposisikan di dinding barat dengan relief kuningan & ring cahaya
          ============================================================== */}
      {tokohList.map((tokoh, tidx) => {
        // Disusun berdampingan rapi di dinding kiri
        const pz = 7.0 - tidx * 3.2
        const isSelected = selectedId === tokoh.id
        const isHovered = hoveredId === tokoh.id

        return (
          <group
            key={tokoh.id}
            position={[-0.8, 0, pz]}
            rotation={[0, Math.PI / 2, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({ type: 'memorabilia', data: tokoh })
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHover(tokoh.id)
            }}
            onPointerOut={() => onHover(null)}
          >
            {/* Pilar Panel Beludru Navy di Dinding */}
            <mesh position={[0, 2.7, -0.1]} receiveShadow>
              <boxGeometry args={[1.3, 3.8, 0.1]} />
              <meshStandardMaterial color="#0B1F3A" roughness={0.5} />
            </mesh>
            {/* Bingkai Emas Panel Tokoh */}
            <mesh position={[0, 2.7, -0.04]}>
              <boxGeometry args={[1.34, 3.84, 0.02]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Piringan Medali Relief Kuningan Emas Tokoh */}
            <mesh position={[0, 3.6, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.38, 0.38, 0.04, 32]} />
              <meshStandardMaterial
                color={isSelected ? '#ffd700' : isHovered ? '#f5efe0' : '#c9a24b'}
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>

            {/* Halo Ring Emas Tokoh */}
            <mesh position={[0, 3.6, 0.01]} rotation={[0, 0, 0]}>
              <ringGeometry args={[0.42, 0.46, 32]} />
              <meshBasicMaterial color="#ffd700" />
            </mesh>

            {/* Nama & Peran Tokoh */}
            <Text position={[0, 2.8, 0.02]} fontSize={0.095} color="#ffd700" anchorX="center">
              {tokoh.name}
            </Text>
            <Text position={[0, 2.58, 0.02]} fontSize={0.065} color="#e2e8f0" anchorX="center">
              ({tokoh.period})
            </Text>
            <Text
              position={[0, 2.32, 0.02]}
              fontSize={0.055}
              color="#cbd5e1"
              anchorX="center"
              maxWidth={1.15}
              textAlign="center"
            >
              {tokoh.role}
            </Text>
            <Text
              position={[0, 1.85, 0.02]}
              fontSize={0.05}
              color="#f5efe0"
              anchorX="center"
              maxWidth={1.1}
              textAlign="center"
            >
              "{tokoh.quote.slice(0, 75)}..."
            </Text>

            <Text position={[0, 1.25, 0.02]} fontSize={0.048} color="#7fd1e8" anchorX="center">
              (Klik untuk melihat profil lengkap & memorabilia)
            </Text>
          </group>
        )
      })}
    </group>
  )
}
