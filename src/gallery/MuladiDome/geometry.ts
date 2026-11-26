import * as THREE from 'three'
import type { MuladiDomeConfig } from './config'

/**
 * Membuat Geometri Permukaan Atap "Bantal" (Pillow Roof Dome)
 * Bentuk dasar persegi membulat cembung landai dengan UV mapping 1:1 ke kanvas atap 4096px.
 */
export function createPillowRoofGeometry(
  cfg: MuladiDomeConfig,
  segmentsX: number = 80,
  segmentsZ: number = 100
): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry()
  const w = cfg.dimensions.width
  const l = cfg.dimensions.length
  const peakH = cfg.dimensions.roofPeakHeight

  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  // Grid vertex traversal
  for (let j = 0; j <= segmentsZ; j++) {
    const v = j / segmentsZ // 0..1
    const z = (v - 0.5) * l
    const normZ = Math.abs(2 * v - 1) // 0 di tengah, 1 di tepi

    for (let i = 0; i <= segmentsX; i++) {
      const u = i / segmentsX // 0..1
      const x = (u - 0.5) * w
      const normX = Math.abs(2 * u - 1) // 0 di tengah, 1 di tepi

      // Profil elevasi atap cembung landai (Pillow dome function)
      // Menggunakan kombinasi perpangkatan superelliptical halus agar bagian tengah
      // lapang/landai lalu melengkung manis di tepi sesuai foto
      const dropX = Math.pow(normX, 2.4)
      const dropZ = Math.pow(normZ, 2.4)
      const combinedDrop = Math.min(1.0, dropX + dropZ - dropX * dropZ)
      const y = peakH * (1.0 - combinedDrop)

      positions.push(x, y, z)
      uvs.push(u, v)

      // Estimasi normal awal (akan di-recompute otomatis di akhir)
      normals.push(0, 1, 0)
    }
  }

  // Generate face indices (Triangles)
  for (let j = 0; j < segmentsZ; j++) {
    for (let i = 0; i < segmentsX; i++) {
      const a = j * (segmentsX + 1) + i
      const b = (j + 1) * (segmentsX + 1) + i
      const c = (j + 1) * (segmentsX + 1) + (i + 1)
      const d = j * (segmentsX + 1) + (i + 1)

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geom.setIndex(indices)
  geom.computeVertexNormals()

  return geom
}

/**
 * Membuat Cincin Overhang / Lis Tepi Atap (Rounded Rectangular Overhang)
 */
export function createOverhangGeometry(cfg: MuladiDomeConfig): THREE.BufferGeometry {
  const w = cfg.dimensions.width + cfg.dimensions.overhangLip * 2
  const l = cfg.dimensions.length + cfg.dimensions.overhangLip * 2
  const r = cfg.dimensions.roofCornerRadius + cfg.dimensions.overhangLip
  const th = cfg.dimensions.overhangThickness

  // Membuat bentuk 2D rounded rectangle
  const shape = new THREE.Shape()
  const hw = w / 2
  const hl = l / 2

  shape.moveTo(-hw + r, -hl)
  shape.lineTo(hw - r, -hl)
  shape.quadraticCurveTo(hw, -hl, hw, -hl + r)
  shape.lineTo(hw, hl - r)
  shape.quadraticCurveTo(hw, hl, hw - r, hl)
  shape.lineTo(-hw + r, hl)
  shape.quadraticCurveTo(-hw, hl, -hw, hl - r)
  shape.lineTo(-hw, -hl + r)
  shape.quadraticCurveTo(-hw, -hl, -hw + r, -hl)

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: th,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  }

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geom.rotateX(Math.PI / 2) // Orientasi horizontal
  return geom
}

/**
 * Membuat Geometri Kanopi Pintu Masuk Berbentuk Lensa/Elips
 */
export function createEntranceCanopyGeometry(cfg: MuladiDomeConfig): THREE.BufferGeometry {
  const cw = cfg.groundFloor.entranceCanopyWidth
  const cl = cfg.groundFloor.entranceCanopyLength
  const th = 0.04

  // Buat kurva elips/lensa
  const shape = new THREE.Shape()
  const segments = 32

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    const x = Math.cos(theta) * (cw / 2)
    const z = Math.sin(theta) * (cl / 2)
    if (i === 0) shape.moveTo(x, z)
    else shape.lineTo(x, z)
  }

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: th,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  })
  geom.rotateX(Math.PI / 2)
  return geom
}
