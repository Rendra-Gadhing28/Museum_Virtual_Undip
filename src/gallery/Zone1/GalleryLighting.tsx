import { DIRECTORY_BOARD_POS, HALL } from './layout'
import { museumPalette } from '../graphics'

interface GalleryLightingProps {
  castShadows?: boolean
  isMobile?: boolean
}

/**
 * Pencahayaan 3000-3500K (Warm White Netral, Tidak Terlalu Kuning)
 * Menjaga Warm Ivory (#E9E1D3) tetap cerah elegan, tidak terlihat krem kusam.
 */
export function GalleryLighting({ isMobile = false }: GalleryLightingProps) {
  return (
    <group>
      {/* Ambient & Hemisphere 3200-3400K Warm White */}
      <ambientLight color="#fff8ee" intensity={1.15} />
      <hemisphereLight args={['#fffaf2', museumPalette.floor, 0.85]} />
      <directionalLight position={[4, 16, 6]} color="#fff9ee" intensity={0.75} />

      {/* Lampu Plafon Warm White di Sepanjang Aula Base Zone & Pantulan Marmer */}
      {!isMobile && (
        <>
          <pointLight position={[0, HALL.height - 1.2, 5.0]} color="#fff6e8" intensity={12.0} distance={26} decay={1.7} />
          <pointLight position={[0, HALL.height - 1.2, -5.0]} color="#fff6e8" intensity={12.0} distance={26} decay={1.7} />
          <pointLight position={[0, HALL.height - 1.2, -15.0]} color="#fff6e8" intensity={12.0} distance={26} decay={1.7} />

          {/* Low Specular Reflection Lights yang menciptakan pendar kilap marmer mewah di lantai */}
          <pointLight position={[-4.5, 0.8, -2.0]} color="#fff4dc" intensity={2.8} distance={8} decay={2.0} />
          <pointLight position={[4.5, 0.8, -2.0]} color="#fff4dc" intensity={2.8} distance={8} decay={2.0} />
          <pointLight position={[0, 0.8, 3.5]} color="#fff4dc" intensity={2.8} distance={8} decay={2.0} />

          {/* Soft Spotlight untuk Signage / Directory Board */}
          <pointLight
            position={[DIRECTORY_BOARD_POS[0] - 0.6, 3.1, DIRECTORY_BOARD_POS[2] + 0.6]}
            color="#fff7ea"
            intensity={2.2}
            distance={5}
            decay={2}
          />
        </>
      )}
    </group>
  )
}
