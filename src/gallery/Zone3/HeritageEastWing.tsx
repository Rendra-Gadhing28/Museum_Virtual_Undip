import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import { createRetroFilmTexture } from './textures'
import zone3Data from './data/zone3.json'

interface HeritageEastWingProps {
  selectedId: string | null
  hoveredId: string | null
  isMobile?: boolean
  onSelect: (item: any) => void
  onHover: (id: string | null) => void
}

/**
 * SAYAP TIMUR (KANAN) ZONA 3:
 * 1. Bagian Dokumen Penting: 10 Dokumen Hukum, Piagam & Dekrit Penegerian Undip
 * 2. Paviliun Audiovisual: Layar Utama Restorasi Pidato Bung Karno 1960, TV Wall & Listening Station
 */
export function HeritageEastWing({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: HeritageEastWingProps) {
  const documents = zone3Data.documents
  const cinemaData = zone3Data.audiovisual.mainCinema
  const tvClips = zone3Data.audiovisual.tvWall
  const filmTexture = useMemo(() => createRetroFilmTexture(), [])

  // 10 Dokumen disusun di sepanjang sisi kanan dari Z = 6.0 s.d. Z = -12.0
  const docSpacing = 2.0
  const docStartZ = 6.0

  return (
    <group position={[7.2, 0, 0]}>
      {/* Header Sayap Kanan */}
      <group position={[0, 5.8, -5.0]} rotation={[0, -Math.PI / 2, 0]}>
        <Text fontSize={0.34} color="#ffd700" anchorX="center">
          SAYAP DOKUMEN PENTING & PAVILIUN AUDIOVISUAL SEJARAH
        </Text>
        <Text position={[0, -0.38, 0]} fontSize={0.18} color="#cbd5e1" anchorX="center">
          Akta Pendirian 1956, Dekrit Presiden, Rekaman Pidato Bung Karno & Arsip Suara
        </Text>
      </group>

      {/* ==============================================================
          A. 10 DISPLAY DOKUMEN PENTING BERKACA MIRING
          ============================================================== */}
      {documents.map((doc, idx) => {
        const pz = docStartZ - idx * docSpacing
        const isSelected = selectedId === doc.id
        const isHovered = hoveredId === doc.id

        return (
          <group
            key={doc.id}
            position={[0, 0, pz]}
            rotation={[0, -Math.PI / 2, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({ type: 'document', data: doc })
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHover(doc.id)
            }}
            onPointerOut={() => onHover(null)}
          >
            {/* Meja Plinth Marmer Miring */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 1.0, 0.8]} />
              <meshStandardMaterial
                color={isSelected ? '#2e2515' : isHovered ? '#1f1b14' : '#141416'}
                roughness={0.4}
              />
            </mesh>
            {/* Lis Emas Meja */}
            <mesh position={[0, 1.01, 0]}>
              <boxGeometry args={[1.54, 0.02, 0.84]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Kotak Kaca Pelindung Miring */}
            <mesh position={[0, 1.25, 0]} rotation={[-Math.PI / 8, 0, 0]}>
              <boxGeometry args={[1.4, 0.08, 0.7]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.25}
                roughness={0.1}
              />
            </mesh>

            {/* Replika Lembaran Dokumen Bersejarah */}
            <mesh position={[0, 1.22, 0]} rotation={[-Math.PI / 8, 0, 0]}>
              <planeGeometry args={[1.2, 0.55]} />
              <meshStandardMaterial color="#f4eedb" roughness={0.8} />
            </mesh>

            {/* Plat Nama Kuningan Dokumen */}
            <mesh position={[0, 0.55, 0.41]}>
              <boxGeometry args={[1.2, 0.22, 0.02]} />
              <meshStandardMaterial color="#c9a24b" metalness={0.85} roughness={0.2} />
            </mesh>
            <Text
              position={[0, 0.59, 0.43]}
              fontSize={0.065}
              color="#0b1f3a"
              anchorX="center"
              maxWidth={1.15}
              textAlign="center"
            >
              {doc.title}
            </Text>
            <Text position={[0, 0.48, 0.43]} fontSize={0.052} color="#1e3a5f" anchorX="center">
              {doc.year} • {doc.type}
            </Text>
          </group>
        )
      })}

      {/* ==============================================================
          B. PAVILIUN AUDIOVISUAL & MINI-CINEMA RESTORASI
          Diposisikan di sisi timur bagian belakang (Z = -18.5)
          ============================================================== */}
      <group position={[0.4, 0, -18.5]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Panggung Mini Cinema Marmer Gelap */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 0.4, 4.2]} />
          <meshStandardMaterial color="#0B1F3A" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.41, 0]}>
          <boxGeometry args={[6.26, 0.02, 4.26]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Layar Sinema Utama Berbingkai Emas */}
        <group
          position={[0, 2.8, -1.8]}
          onClick={(e) => {
            e.stopPropagation()
            onSelect({ type: 'audiovisual', data: cinemaData })
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            onHover('cinema-main-screen')
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Bingkai Emas */}
          <mesh castShadow>
            <boxGeometry args={[4.8, 2.8, 0.1]} />
            <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Layar Film Dokumen */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[4.6, 2.6]} />
            <meshStandardMaterial
              map={filmTexture}
              color="#ffffff"
              roughness={0.3}
              emissive="#ffffff"
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Teks Penjelasan di Bawah Layar */}
          <Text position={[0, -1.6, 0.08]} fontSize={0.11} color="#ffd700" anchorX="center">
            RESTORASI DIGITAL FILM 16MM • DIES NATALIS 1960
          </Text>
          <Text position={[0, -1.8, 0.08]} fontSize={0.08} color="#7fd1e8" anchorX="center">
            (Klik layar untuk memutar rekaman & orasi Bung Karno)
          </Text>
        </group>

        {/* Baris Kursi Bioskop Vintage Jati & Beludru */}
        {[-1.2, 0, 1.2].map((kx, ki) => (
          <group key={`cinema-seat-${ki}`} position={[kx, 0.4, 0.6]}>
            {/* Dudukan Kursi */}
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[0.7, 0.45, 0.6]} />
              <meshStandardMaterial color="#112d56" roughness={0.7} />
            </mesh>
            {/* Sandaran Kursi */}
            <mesh position={[0, 0.85, -0.25]} castShadow>
              <boxGeometry args={[0.7, 0.55, 0.12]} />
              <meshStandardMaterial color="#112d56" roughness={0.7} />
            </mesh>
            {/* Lengan Kayu Jati */}
            <mesh position={[-0.38, 0.6, 0]}>
              <boxGeometry args={[0.06, 0.3, 0.6]} />
              <meshStandardMaterial color="#3E2A1E" roughness={0.4} />
            </mesh>
            <mesh position={[0.38, 0.6, 0]}>
              <boxGeometry args={[0.06, 0.3, 0.6]} />
              <meshStandardMaterial color="#3E2A1E" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* TV Wall 4 Klip TV Tabung Vintage di Samping Layar */}
        <group position={[2.7, 2.2, 0]}>
          {tvClips.slice(0, 4).map((clip, ci) => (
            <mesh key={clip.id} position={[0, (ci % 2) * 0.9, (Math.floor(ci / 2) - 0.5) * 1.1]} castShadow>
              <boxGeometry args={[0.15, 0.7, 0.9]} />
              <meshStandardMaterial color="#222" roughness={0.5} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}
