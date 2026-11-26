interface Zone3LightingProps {
  castShadows?: boolean
  isMobile?: boolean
}

/**
 * Pencahayaan Galeri Museum Zona 3 — Ambient Terang & Merata Satu Ruangan (Ringan & 60 FPS)
 * Tanpa SpotLight / PointLight / ShadowMap berat.
 */
export function Zone3Lighting(_props: Zone3LightingProps) {
  return (
    <group>
      <ambientLight color="#fff9f0" intensity={1.85} />
      <hemisphereLight args={['#fffdf8', '#d6cbb8', 0.9]} />
      <directionalLight position={[4, 14, 6]} color="#fffaf0" intensity={0.65} />
    </group>
  )
}
