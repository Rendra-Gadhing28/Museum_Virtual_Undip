import { ZONE4_HALL, ZONE4_HALL_CENTER_Z } from './layout'

/**
 * Pencahayaan Galeri Museum Zona 4 (Warm Golden Gallery Light)
 * Konsisten dengan estetika pencahayaan Zona 1 & 2:
 * - Nuansa cahaya hangat keemasan (2800K - 3000K) yang ramah & berwibawa
 * - TIDAK menggunakan cahaya putih dingin / dark sci-fi
 * - Downlight terarah di atas maket kampus, sayap lab, perpustakaan, dan panggung prestasi
 * - Maksimal 3 shadow casters untuk menjaga 60 FPS
 */
export function Zone4Lighting() {
  const centerZ = ZONE4_HALL_CENTER_Z
  const height = ZONE4_HALL.height

  return (
    <>
      {/* 1. Ambient Warm Museum Glow (Hangat, Lapang & Terang Merata) */}
      <ambientLight color="#fdf6ea" intensity={0.82} />

      {/* 2. Key Gallery Directional Light Hangat */}
      <directionalLight
        position={[0.5, height + 5, centerZ]}
        target-position={[0, 0, centerZ]}
        color="#fffaf0"
        intensity={1.1}
        castShadow={false}
      />

      {/* 3. Downlight Hangat Terarah di Sepanjang Lorong Karpet Tengah */}
      {[6.0, -8.0, -20.0].map((az, ai) => (
        <spotLight
          key={`aisle-spot-${ai}`}
          position={[0, height - 1.2, az]}
          target-position={[0, 0, az]}
          color="#fff5e4"
          intensity={48}
          distance={16}
          angle={Math.PI / 3.6}
          penumbra={0.7}
          decay={1.8}
        />
      ))}

      {/* 4. Spotlight Terpusat di Atas Maket Kampus */}
      <spotLight
        position={[0, height - 1.0, -2.5]}
        target-position={[0, 0.7, -2.5]}
        color="#fff0cc"
        intensity={70}
        distance={20}
        angle={Math.PI / 4.0}
        penumbra={0.6}
        castShadow={false}
      />

      {/* 5. Spotlight Terpusat di Atas Panggung Prestasi */}
      <spotLight
        position={[0, height - 1.0, -26.0]}
        target-position={[0, 2.0, -26.0]}
        color="#ffe6a3"
        intensity={75}
        distance={22}
        angle={Math.PI / 3.6}
        penumbra={0.6}
        castShadow={false}
      />
    </>
  )
}
