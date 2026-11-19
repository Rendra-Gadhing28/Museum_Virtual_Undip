import { HALL } from './layout'

interface GalleryLightingProps {
  castShadows: boolean
}

/**
 * Museum Virtual Undip - Low-Light Cinematic Exhibition Lighting
 * Features:
 * - Moody, high-contrast cinematic atmosphere
 * - Soft warm wall-grazing track spotlights creating dramatic falloffs around artwork
 * - Rich shadows cast by objects and furniture onto the marble floor and carpet
 * - Ambient warm golden glow from the PVC cove lighting and crystal chandeliers
 * - Cinematic low light on walls (vignette-style darkness at corners)
 */
export function GalleryLighting({ castShadows }: GalleryLightingProps) {
  return (
    <group>
      {/* 1. Low-Light Cinematic Ambient Base (Moody & Deep) */}
      <ambientLight color="#e8d4b8" intensity={0.45} />

      {/* 2. Primary Architectural Sun/Skylight Ray with Crisp Soft Shadows */}
      <directionalLight
        position={[3.0, HALL.height + 2.0, -4]}
        target-position={[0, 0, -8]}
        color="#fff5db"
        intensity={1.0}
        castShadow={castShadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={32}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-bias={-0.0001}
      />

      {/* 3. Subtle Counter-Fill (Cooler to create depth contrast) */}
      <directionalLight
        position={[-3.0, HALL.height + 1.0, -14]}
        color="#c8d8f0"
        intensity={0.22}
      />

      {/* 4. Left Wall (13 Founders) - Low-Light Cinematic Wall-Grazing Track Spotlights
          Positioned to create dramatic pools of light on artwork, dark vignette between */}
      {[-20, -15.5, -10, -4.5, 0.5, 5.5].map((z, i) => (
        <group key={`left-spot-${i}`} position={[-5.0, 5.8, z]}>
          <spotLight
            position={[0, 0, 0]}
            target-position={[-2.4, -3.5, 0]}
            color="#ffe8c8"
            intensity={20}
            angle={0.6}
            penumbra={0.85}
            distance={10.5}
            decay={2}
          />
        </group>
      ))}

      {/* 5. Right Wall (History & Archives Salon) - Low-Light Cinematic Track Spotlights */}
      {[-20, -15.5, -10, -4.5, 0.5, 5.5].map((z, i) => (
        <group key={`right-spot-${i}`} position={[5.0, 5.8, z]}>
          <spotLight
            position={[0, 0, 0]}
            target-position={[2.4, -3.5, 0]}
            color="#ffe8c8"
            intensity={20}
            angle={0.6}
            penumbra={0.85}
            distance={10.5}
            decay={2}
          />
        </group>
      ))}

      {/* 6. Dramatic Spotlight on the Pangeran Diponegoro Horse Statue at the Back */}
      <spotLight
        position={[3.8, 6.2, -15.5]}
        target-position={[3.8, 1.2, -18.2]}
        color="#ffeec2"
        intensity={42}
        angle={0.48}
        penumbra={0.65}
        distance={12.0}
        decay={2}
      />

      {/* 7. Dedicated Highlight on Miniature Map Vitrine */}
      <spotLight
        position={[0, 5.8, -3.5]}
        target-position={[0, 0.8, -3.5]}
        color="#fff6dd"
        intensity={36}
        angle={0.52}
        penumbra={0.65}
        distance={10.0}
        decay={2}
      />

      {/* 8. Ceremonial Podium & Garuda Pancasila Spotlight (Primary Stage Accent) */}
      <spotLight
        position={[0, 6.4, -15.0]}
        target-position={[0, 2.5, -18.2]}
        color="#fff2d0"
        intensity={50}
        angle={0.58}
        penumbra={0.72}
        distance={13.0}
        decay={2}
        castShadow={castShadows}
        shadow-bias={-0.0002}
      />

      {/* 9. Flag Area Accent Light (Left side of podium) */}
      <spotLight
        position={[-3.2, 5.5, -19.5]}
        target-position={[-3.2, 1.5, -20.6]}
        color="#fff4d6"
        intensity={28}
        angle={0.55}
        penumbra={0.8}
        distance={9.0}
        decay={2}
      />

      {/* 10. Cinematic Wall Vignette: Dark fill lights at room corners to deepen the mood */}
      {/* Front corners - subtle warm fill */}
      <pointLight position={[-7.0, 2.5, 10.0]} color="#201505" intensity={0} distance={6} decay={2} />
      <pointLight position={[7.0, 2.5, 10.0]} color="#201505" intensity={0} distance={6} decay={2} />
      {/* Back corners - create depth darkness */}
      <pointLight position={[-7.0, 3.0, -24.0]} color="#0a1020" intensity={3} distance={8} decay={2} />
      <pointLight position={[7.0, 3.0, -24.0]} color="#0a1020" intensity={3} distance={8} decay={2} />

      {/* 11. Entrance Area Welcome Warm Light */}
      <pointLight
        position={[0, 5.5, 10.5]}
        color="#ffeedd"
        intensity={18}
        distance={12}
        decay={2}
      />
    </group>
  )
}
