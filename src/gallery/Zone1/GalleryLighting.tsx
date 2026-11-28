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
      <ambientLight color="#fff8ee" intensity={1.1} />
      <hemisphereLight args={['#fffaf2', museumPalette.floor, 0.78]} />
      <directionalLight position={[4, 14, 6]} color="#fff7ea" intensity={0.62} />

      {/* Lampu Plafon Warm White di Sepanjang Aula Base Zone */}
      {!isMobile && (
        <>
          <pointLight position={[0, HALL.height - 0.8, 3.5]} color="#fff6e8" intensity={10.5} distance={24} decay={1.5} />
          <pointLight position={[0, HALL.height - 0.8, -7.0]} color="#fff6e8" intensity={10.5} distance={24} decay={1.5} />
          <pointLight position={[0, HALL.height - 0.8, -17.5]} color="#fff6e8" intensity={10.5} distance={24} decay={1.5} />

          {/* Wall Spotlights (Warm White lembut untuk panel dinding kiri & kanan) */}
          <pointLight position={[-4.8, 5.4, 2.0]} color="#fff7ec" intensity={3.2} distance={14} decay={1.7} />
          <pointLight position={[-4.8, 5.4, -12.0]} color="#fff7ec" intensity={3.2} distance={14} decay={1.7} />
          <pointLight position={[4.8, 5.4, 2.0]} color="#fff7ec" intensity={3.2} distance={14} decay={1.7} />
          <pointLight position={[4.8, 5.4, -12.0]} color="#fff7ec" intensity={3.2} distance={14} decay={1.7} />

          {/* Soft Spotlight untuk Signage / Directory Board */}
          <pointLight
            position={[DIRECTORY_BOARD_POS[0] - 0.6, 3.1, DIRECTORY_BOARD_POS[2] + 0.6]}
            color="#fff7ea"
            intensity={2.4}
            distance={6}
            decay={1.8}
          />
        </>
      )}
    </group>
  )
}
