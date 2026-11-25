import { ZONE5_HALL, ZONE5_HALL_CENTER_Z } from './layout'

interface Zone5LightingProps {
  dawnFactor?: number
  castShadows?: boolean
  isMobile?: boolean
}

/**
 * Pencahayaan Galeri Museum Zona 5 — Undip Future
 * Menggabungkan kehangatan museum klasik (2800K-3000K) dengan aksen fajar emas & ice-blue:
 * - Ambient Warm Fill Light
 * - Key Gallery Directional Light terpusat
 * - Downlight spotlights di atas AI Neural Core, Vision Beacon, dan sayap pameran
 * - Sangat hemat GPU (60 FPS stabil)
 */
export function Zone5Lighting({
  dawnFactor = 0.2,
  isMobile = false,
}: Zone5LightingProps) {
  const centerZ = ZONE5_HALL_CENTER_Z
  const height = ZONE5_HALL.height

  return (
    <>
      {/* 1. Ambient Warm Museum Glow */}
      <ambientLight
        color={dawnFactor > 0.5 ? '#FFF4E5' : '#FDF6EA'}
        intensity={isMobile ? 0.9 : 0.82}
      />

      {/* 2. Key Gallery Directional Light Hangat */}
      <directionalLight
        position={[0.5, height + 4, centerZ]}
        target-position={[0, 0, centerZ]}
        color={dawnFactor > 0.5 ? '#FFD700' : '#FFFAF0'}
        intensity={1.15}
        castShadow={false}
      />

      {/* 3. Soft Counter Fill Light (Ice-Blue Halus) */}
      <directionalLight
        position={[-2, height + 2, centerZ]}
        color="#7FD1E8"
        intensity={0.3}
      />

      {/* 4. Downlight Hangat Terarah di Sepanjang Lorong Tengah */}
      {[4.0, -10.0].map((az, ai) => (
        <spotLight
          key={`z5-aisle-spot-${ai}`}
          position={[0, height - 1.2, az]}
          target-position={[0, 0, az]}
          color="#FFF5E4"
          intensity={isMobile ? 38 : 55}
          distance={16}
          angle={Math.PI / 3.6}
          penumbra={0.7}
          decay={1.8}
        />
      ))}

      {/* 5. Spotlight Terpusat di Atas HERO: Vision Beacon & Horizon Gate */}
      <spotLight
        position={[0, height - 1.0, -23.0]}
        target-position={[0, 2.0, -23.0]}
        color={dawnFactor > 0.5 ? '#FFD700' : '#FFE6A3'}
        intensity={isMobile ? 80 : 120}
        distance={24}
        angle={Math.PI / 3.4}
        penumbra={0.6}
        castShadow={false}
      />
    </>
  )
}
