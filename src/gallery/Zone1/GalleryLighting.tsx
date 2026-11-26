interface GalleryLightingProps {
  castShadows?: boolean
  isMobile?: boolean
}

/**
 * Pencahayaan Ambient Terang & Merata Satu Ruangan (Ringan & 60 FPS)
 * Tanpa SpotLight / PointLight / ShadowMap berat.
 */
export function GalleryLighting(_props: GalleryLightingProps) {
  return (
    <group>
      <ambientLight color="#fff9f0" intensity={1.85} />
      <hemisphereLight args={['#fffdf8', '#d6cbb8', 0.9]} />
      <directionalLight position={[4, 14, 6]} color="#fffaf0" intensity={0.65} />
    </group>
  )
}
