/**
 * MASTER PALETTE — Museum Virtual Undip
 * 
 * Satu konstanta tunggal yang DIKUNCI dan dipakai di seluruh 5 zona.
 * Nilai diambil langsung dari elemen arsitektural master galeri yang sudah ada.
 * Perbedaan antar zona HANYA pada: pencahayaan, shadow, finishing permukaan,
 * detail prop, dan post-processing.
 */

export const PALETTE = {
  // Dinding Utama & Marmer Gading (Dominan Interior Aula)
  ivoryCremaMarfil: '#f7f4ec',
  ivoryWallSoft: '#f0ede4',

  // Dinding Aksen Kehormatan Universitas (Royal Undip Navy Blue)
  royalUndipNavy: '#142e56',
  deepNavyAccent: '#0b1d3a',
  navyShadowTrench: '#081426',

  // Lis & Aksentuasi Emas Monumental (Kuningan / Emas Adipradana)
  royalGoldMonument: '#d4af37',
  antiqueBrass: '#c9a24b',
  brightGoldHighlight: '#ffd700',

  // Kayu Wainscoting & Mebel Mahoni / Jati Jawa Klasik
  teakMahoganyDark: '#2c1a0e',
  teakMahoganyMedium: '#3d2516',
  hardwoodWarm: '#24150b',

  // Lantai & Horizon
  marbleFloorBase: '#100d08',
  galleryHorizonDark: '#0e1724',

  // Karpet Runner Upacara & Karpet Selasar
  ceremonialRedCarpet: '#8b1e22',
  navyRunnerCarpet: '#162b4d',

  // Elemen Modern & Teks
  pureWhite: '#ffffff',
  matteModelWhite: '#ededea',
  textMutedSlate: '#94a3b8',
  textGoldTitle: '#ffd700',
  textNavyTitle: '#0b1f3a',
} as const

export type MuseumPalette = typeof PALETTE
