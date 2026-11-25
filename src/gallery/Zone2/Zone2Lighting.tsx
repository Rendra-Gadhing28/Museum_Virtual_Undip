/**
 * Zone 2 Lighting — Strictly Warm Golden / Amber Mood (2700K - 3000K)
 * User Requirement:
 * "3. cahaya yang dipakai adalah warm light kuning tidak cahaya warna putih."
 *
 * Palette:
 * - Ambient: #fff2d6 (Warm Sunlight Reflection)
 * - Key Light: #ffdf94 (Golden Gallery Key)
 * - Spotlights: #ffd573 (Warm Amber Beam)
 * - Downlights: #ffe4a0 (Incandescent Museum Glow)
 * - Monument Wash: #ffca58 (Rich Gold Architectural Flood)
 * ZERO cold white or blue lights.
 *
 * Shadows are intentionally disabled: the gallery is lit by many small warm
 * fixtures, so shadow-map rendering cost far more than it added.
 */
export function Zone2Lighting() {
  return (
    <group>
      {/* 1. Ambient Warm Fill Light (Warm Yellowish Honey) */}
      <ambientLight color="#fff2d6" intensity={0.82} />

      {/* 2. Primary Architectural Overhead Key Light (Warm Amber) */}
      <directionalLight
        position={[0.4, 14.5, -7.0]}
        target-position={[0, 0, -7.0]}
        color="#ffdf94"
        intensity={1.1}
      />

      {/* 3. Warm Downlights along the Central Corridor Axis (2 streamlined spots) */}
      {[2.0, -8.0].map((az, ai) => (
        <spotLight
          key={`zone2-downlight-${ai}`}
          position={[0, 6.8, az]}
          target-position={[0, 0, az]}
          color="#ffe4a0"
          intensity={38}
          angle={0.65}
          penumbra={0.8}
          distance={12.0}
          decay={2}
        />
      ))}

      {/* 4. Dramatic Centerpiece Spotlight on the Campus Transformation Diorama */}
      <spotLight
        position={[0, 7.8, -2.5]}
        target-position={[0, 0.8, -4.5]}
        color="#ffd266"
        intensity={55}
        angle={0.6}
        penumbra={0.7}
        distance={14.0}
        decay={2}
      />

      {/* 5. Grand Monument Focal Back Wall Illumination (Warm Golden Bronze) */}
      <spotLight
        position={[0, 7.5, -19.5]}
        target-position={[0, 4.2, -25.8]}
        color="#ffd566"
        intensity={34}
        angle={0.68}
        penumbra={0.85}
        distance={16.0}
        decay={2}
      />
    </group>
  )
}
