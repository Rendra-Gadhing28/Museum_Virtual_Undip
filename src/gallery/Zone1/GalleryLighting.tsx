import { HALL } from './layout'

interface GalleryLightingProps {
  castShadows?: boolean
  isMobile?: boolean
}

/**
 * Pencahayaan Terang & Merata dengan Pendar Lampu Plafon Nyala (60 FPS)
 */
export function GalleryLighting({ isMobile = false }: GalleryLightingProps) {
  return (
    <group>
      <ambientLight color="#fffdf8" intensity={1.35} />
      <hemisphereLight args={['#ffffff', '#cfc6b6', 0.85]} />
      <directionalLight position={[4, 14, 6]} color="#fffcf5" intensity={0.65} />

      {/* Lampu Plafon Nyala di Sepanjang Aula Base Zone */}
      {!isMobile && (
        <>
          <pointLight position={[0, HALL.height - 0.8, 3.5]} color="#fffdf7" intensity={12} distance={24} decay={1.5} />
          <pointLight position={[0, HALL.height - 0.8, -7.0]} color="#fffdf7" intensity={12} distance={24} decay={1.5} />
          <pointLight position={[0, HALL.height - 0.8, -17.5]} color="#fffdf7" intensity={12} distance={24} decay={1.5} />
        </>
      )}
    </group>
  )
}
