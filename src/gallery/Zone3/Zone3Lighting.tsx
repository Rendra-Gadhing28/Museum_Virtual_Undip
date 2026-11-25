import { ZONE3_HALL, ZONE3_HALL_CENTER_Z } from './layout'

interface Zone3LightingProps {
  castShadows?: boolean
  isMobile?: boolean
}

/**
 * Pencahayaan Galeri Museum Zona 3 — The Heritage of Undip
 * Mengikuti palet pencahayaan hangat galeri Zone 1 & 2:
 * - Nuansa cahaya hangat keemasan (2800K - 3000K) yang khidmat, agung & ramah
 * - Tanpa pencahayaan sci-fi dingin
 * - Spotlight terarah di atas Plaza Prasasti, Sayap Artefak, dan Sayap Dokumen
 * - Sangat optimal untuk menjaga 60 FPS stabil di mobile & laptop
 */
export function Zone3Lighting({
  castShadows = false,
  isMobile = false,
}: Zone3LightingProps) {
  const centerZ = ZONE3_HALL_CENTER_Z
  const height = ZONE3_HALL.height

  return (
    <>
      {/* 1. Ambient Warm Museum Glow (Hangat, Khidmat & Terang Merata) */}
      <ambientLight color="#fdf6ea" intensity={isMobile ? 0.85 : 0.76} />

      {/* 2. Key Gallery Directional Light Hangat (Shadow Caster 1) */}
      <directionalLight
        position={[0.5, height + 4, centerZ]}
        target-position={[0, 0, centerZ]}
        color="#fffaf0"
        intensity={1.2}
        castShadow={castShadows && !isMobile}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        shadow-camera-near={1}
        shadow-camera-far={45}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
      />

      {/* 3. Soft Counter Directional Light (Tanpa Shadow) */}
      <directionalLight
        position={[-2, height + 2, centerZ]}
        color="#ffe2b8"
        intensity={0.4}
      />

      {/* 4. Downlight Hangat Terarah di Sepanjang Lorong Tengah */}
      {[8.0, 0.0, -8.0, -16.0].map((az, ai) => (
        <spotLight
          key={`z3-aisle-spot-${ai}`}
          position={[0, height - 1.2, az]}
          target-position={[0, 0, az]}
          color="#fff5e4"
          intensity={isMobile ? 45 : 70}
          distance={16}
          angle={Math.PI / 3.6}
          penumbra={0.7}
          decay={1.8}
        />
      ))}

      {/* 5. Spotlight Terpusat di Atas HERO: Plaza Prasasti */}
      <spotLight
        position={[0, height - 1.0, -21.0]}
        target-position={[0, 2.0, -21.0]}
        color="#ffe6a3"
        intensity={isMobile ? 120 : 180}
        distance={22}
        angle={Math.PI / 3.4}
        penumbra={0.6}
        castShadow={castShadows && !isMobile}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* 6. Spotlight Aksen di Sayap Kiri (Artefak & Tokoh) */}
      <spotLight
        position={[-5.8, height - 1.2, -4.0]}
        target-position={[-8.5, 1.5, -4.0]}
        color="#fff2d6"
        intensity={isMobile ? 50 : 85}
        distance={16}
        angle={Math.PI / 3.2}
        penumbra={0.7}
        decay={1.8}
      />

      {/* 7. Spotlight Aksen di Sayap Kanan (Dokumen & Cinema) */}
      <spotLight
        position={[5.8, height - 1.2, -4.0]}
        target-position={[8.5, 1.5, -4.0]}
        color="#fff2d6"
        intensity={isMobile ? 50 : 85}
        distance={16}
        angle={Math.PI / 3.2}
        penumbra={0.7}
        decay={1.8}
      />
    </>
  )
}
