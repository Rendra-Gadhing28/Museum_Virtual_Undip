/**
 * Zone 2 Lighting — Pencahayaan Ambient Terang & Merata Satu Ruangan (Ringan & 60 FPS)
 * Tanpa SpotLight / PointLight / ShadowMap berat.
 */
export function Zone2Lighting() {
  return (
    <group>
      <ambientLight color="#fff8ed" intensity={1.85} />
      <hemisphereLight args={['#fffdf8', '#d8ccb4', 0.9]} />
      <directionalLight position={[4, 14, 6]} color="#fffaf0" intensity={0.65} />
    </group>
  )
}
