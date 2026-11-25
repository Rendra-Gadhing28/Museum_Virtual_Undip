
interface GalleryLightingProps {
  castShadows?: boolean
  isMobile?: boolean
}

/**
 * Museum Virtual Undip - Low-Light Cinematic Exhibition Lighting
 * Features:
 * - Moody, high-contrast cinematic atmosphere
 * - Soft warm wall-grazing track spotlights creating dramatic falloffs around artwork
 * - Rich shadows cast by objects and furniture onto the marble floor and carpet
 * - Ambient warm golden glow from the PVC cove lighting and crystal chandeliers
 * - Mobile-optimized lighting profile to ensure high 60fps framerate on smartphones
 */
export function GalleryLighting({ isMobile = false }: GalleryLightingProps) {
  return (
    <group>
      {/* 1. Ambient Fill Light - Warm, even museum illumination without per-pixel light loops */}
      <ambientLight color="#f6ece0" intensity={isMobile ? 0.95 : 0.82} />

      {/* 2. Primary Architectural Overhead Key Light (No shadow maps) */}
      <directionalLight
        position={[0.3, 14.8, -7.0]}
        target-position={[0, 0, -7.0]}
        color="#fffaf0"
        intensity={1.1}
        castShadow={false}
      />

      {/* 3. Central Red Carpet Aisle Accent Lights (Streamlined 2 spots) */}
      {[2.0, -8.0].map((az, ai) => (
        <spotLight
          key={`aisle-downlight-${ai}`}
          position={[0, 6.5, az]}
          target-position={[0, 0, az]}
          color="#fff5e4"
          intensity={38}
          angle={0.65}
          penumbra={0.8}
          distance={12.0}
          decay={2}
        />
      ))}

      {/* 4. Ceremonial Podium & Prasasti Accent Spotlight */}
      <spotLight
        position={[0, 7.2, -15.5]}
        target-position={[0, 1.8, -18.2]}
        color="#fff6e8"
        intensity={46}
        angle={0.6}
        penumbra={0.75}
        distance={14.0}
        decay={2}
      />

      {/* 5. Grand Focal Back Wall Illumination (Logo & Inscription) */}
      <spotLight
        position={[0, 7.4, -19.0]}
        target-position={[0, 4.6, -25.8]}
        color="#fff3e2"
        intensity={28}
        angle={0.7}
        penumbra={0.9}
        distance={16.0}
        decay={2}
      />
    </group>
  )
}
