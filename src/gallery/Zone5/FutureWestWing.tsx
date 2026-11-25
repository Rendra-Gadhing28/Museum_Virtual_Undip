import { useMemo } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { ZONE5_HALL } from './layout'
import zone5Data from './data/zone5.json'
import type { Zone5Exhibit } from './types'

interface FutureWestWingProps {
  onSelect: (exhibit: Zone5Exhibit) => void
  onHover: (id: string | null) => void
  selectedId: string | null
}

/**
 * Sayap Barat (Kiri) Galeri Zona 5:
 * 1. Bagian Depan: Digital Twin Plaza (Metaverse Hall, Hybrid Classroom, Sovereign Cloud)
 * 2. Bagian Belakang: Command Deck Smart Campus (KTM Digital, Smart Parking, Energi, EV Shuttle, Telemedisin)
 */
export function FutureWestWing({ onSelect, onHover, selectedId }: FutureWestWingProps) {
  const wallX = -(ZONE5_HALL.halfWidth - 0.4)

  const materials = useMemo(() => {
    return {
      pedestalBase: new THREE.MeshStandardMaterial({
        color: '#0B1F3A',
        roughness: 0.4,
        metalness: 0.3,
      }),
      pedestalActive: new THREE.MeshStandardMaterial({
        color: '#1a365d',
        roughness: 0.3,
        metalness: 0.5,
      }),
      goldTrim: new THREE.MeshStandardMaterial({
        color: '#c9a24b',
        metalness: 0.85,
        roughness: 0.2,
      }),
      iceBlueTrim: new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        metalness: 0.8,
        roughness: 0.2,
      }),
      holoScreen: new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.1,
        emissive: '#0284c7',
        emissiveIntensity: 0.2,
      }),
    }
  }, [])

  return (
    <group position={[wallX, 0, 0]}>
      {/* ==============================================================
          1. HEADER SAYAP BARAT DI DINDING
          ============================================================== */}
      <group position={[0.3, 6.2, -8.0]} rotation={[0, Math.PI / 2, 0]}>
        <Text fontSize={0.34} color="#ffd700" anchorX="center">
          SAYAP KAMPUS DIGITAL & SMART UNIVERSITY
        </Text>
        <Text position={[0, -0.42, 0]} fontSize={0.17} color="#38bdf8" anchorX="center">
          Digital Twin Plaza • Metaverse Academic Hall • Mission Control Command Deck
        </Text>
      </group>

      {/* ==============================================================
          2. KLUSTER 1: DIGITAL TWIN PLAZA (3 STASIUN UTAMA)
          Z = 6.0 s.d. -2.0
          ============================================================== */}
      {zone5Data.digitalCampus.services.map((svc, i) => {
        const lz = 6.0 - i * 3.8
        const isSelected = selectedId === svc.id

        return (
          <group
            key={svc.id}
            position={[1.5, 0, lz]}
            rotation={[0, Math.PI / 2, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({
                id: svc.id,
                title: svc.title,
                category: 'digitalCampus',
                subtitle: svc.subtitle,
                description: svc.description,
                stats: svc.stats,
                highlights: [
                  svc.stats,
                  'Simulasi 3D Real-time Terintegrasi Sovereign Cloud',
                  'Aksesibilitas Multi-platform (Desktop, Mobile, VR/AR)',
                ],
              })
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHover(svc.id)
            }}
            onPointerOut={() => onHover(null)}
          >
            {/* Meja Pedestal Futuristik Navy-Gold */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.8, 0.9, 1.3]} />
              <primitive object={isSelected ? materials.pedestalActive : materials.pedestalBase} attach="material" />
            </mesh>
            <mesh position={[0, 0.91, 0]}>
              <boxGeometry args={[2.84, 0.02, 1.34]} />
              <primitive object={materials.goldTrim} attach="material" />
            </mesh>
            <mesh position={[0, 0.925, 0]}>
              <boxGeometry args={[2.86, 0.01, 1.36]} />
              <primitive object={materials.iceBlueTrim} attach="material" />
            </mesh>

            {/* Layar Hologram Melayang */}
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[2.5, 1.0, 0.04]} />
              <primitive object={materials.holoScreen} attach="material" />
            </mesh>

            {/* Border Emas Layar */}
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[2.54, 1.04, 0.02]} />
              <meshBasicMaterial color="#38bdf8" wireframe />
            </mesh>

            {/* Teks Label Layar */}
            <Text position={[0, 1.75, 0.03]} fontSize={0.13} color="#ffffff" anchorX="center">
              {svc.title}
            </Text>
            <Text position={[0, 1.52, 0.03]} fontSize={0.095} color="#ffd700" anchorX="center">
              {svc.subtitle}
            </Text>
            <Text position={[0, 1.3, 0.03]} fontSize={0.08} color="#e0f2fe" anchorX="center" maxWidth={2.3} textAlign="center">
              {svc.stats}
            </Text>

            {/* Prompt Klik */}
            <Text position={[0, 0.98, 0.55]} fontSize={0.075} color="#38bdf8" anchorX="center">
              ✦ Klik untuk detail layanan ✦
            </Text>
          </group>
        )
      })}

      {/* ==============================================================
          3. KLUSTER 2: SMART UNIVERSITY COMMAND DECK (6 KIOSK)
          Z = -7.0 s.d. -25.0
          ============================================================== */}
      {zone5Data.smartUniversity.kiosks.map((kiosk, ki) => {
        const lz = -7.0 - ki * 3.2
        const isSelected = selectedId === kiosk.id

        return (
          <group
            key={kiosk.id}
            position={[1.5, 0, lz]}
            rotation={[0, Math.PI / 2, 0]}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({
                id: kiosk.id,
                title: kiosk.title,
                category: 'smartUniversity',
                subtitle: 'Mission Control Smart Campus Undip',
                description: kiosk.desc,
                metric: kiosk.metric,
                highlights: [
                  kiosk.metric,
                  'Monitoring Terpusat IoT & Sensor Real-Time',
                  'Efisiensi Energi & Keberlanjutan Lingkungan Kampus',
                ],
              })
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHover(kiosk.id)
            }}
            onPointerOut={() => onHover(null)}
          >
            {/* Pedestal Terminal */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.4, 0.9, 1.1]} />
              <primitive object={isSelected ? materials.pedestalActive : materials.pedestalBase} attach="material" />
            </mesh>
            <mesh position={[0, 0.91, 0]}>
              <boxGeometry args={[2.44, 0.02, 1.14]} />
              <primitive object={materials.goldTrim} attach="material" />
            </mesh>

            {/* Display Kiosk Vertikal Miring */}
            <group position={[0, 1.35, -0.1]} rotation={[-0.2, 0, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2.0, 0.8, 0.05]} />
                <primitive object={materials.holoScreen} attach="material" />
              </mesh>
              <Text position={[0, 0.22, 0.04]} fontSize={0.12} color="#ffffff" anchorX="center">
                {kiosk.title}
              </Text>
              <Text position={[0, 0.02, 0.04]} fontSize={0.095} color="#38bdf8" anchorX="center">
                {kiosk.metric}
              </Text>
              <Text position={[0, -0.2, 0.04]} fontSize={0.075} color="#e2e8f0" anchorX="center" maxWidth={1.8} textAlign="center">
                {kiosk.desc.slice(0, 55)}...
              </Text>
            </group>
          </group>
        )
      })}
    </group>
  )
}
