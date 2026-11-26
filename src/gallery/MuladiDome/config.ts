/**
 * MULADI DOME MAKET — Konfigurasi Utama & Parameter Prosedural
 * 
 * Semua dimensi, proporsi, warna palet maket fisik, parameter pola chevron atap,
 * fasad kolom, bukaan atap, dan lingkungan diorama terpusat di sini.
 */

export interface MuladiDomeConfig {
  // --- DIMENSI UTAMA BANGUNAN MAKET (Skala Model Diorama) ---
  dimensions: {
    width: number        // Lebar sumbu X (misal 5.6 satuan maket)
    length: number       // Panjang sumbu Z (misal 7.6 satuan maket - rasio ~1:1.36)
    heightGround: number // Tinggi lantai dasar (misal 0.55)
    heightUpper: number  // Tinggi lantai atas kisi-kisi (misal 0.95)
    roofPeakHeight: number // Tinggi lengkung puncak kubah bantal dari cincin atap (misal 1.15)
    roofCornerRadius: number // Radius sudut membulat atap & overhang (misal 1.35)
    overhangLip: number  // Tonjolan overhang cincin tepi atap (misal 0.32)
    overhangThickness: number // Ketebalan vertikal bibir atap (misal 0.16)
  }

  // --- ATAP "BANTAL" & POLA CHEVRON ---
  roof: {
    textureResolution: number // 4096 untuk ketajaman ultra-high
    tileCountX: number        // Jumlah petak ubin grid sumbu X (misal 96)
    tileCountY: number        // Jumlah petak ubin grid sumbu Y/Z (misal 128)
    groutWidthPx: number      // Lebar garis nat ubin dalam pixel (misal 2px)
    
    // Parameter Chevron Prosedural
    periodP: number           // Periode pengulangan chevron dalam unit ubin (misal 7 ubin)
    ribW: number              // Lebar rusuk putih menonjol dalam unit ubin (misal 2 ubin)
    fadeStart: number         // Jarak normalisasi (0 tepi s.d 1 pusat) mulai memudar (misal 0.18)
    fadeEnd: number           // Jarak normalisasi pola berhenti murni putih (misal 0.44)
    stairStepMode: boolean    // true = mengunci undakan sesuai grid ubin 1:1 fisik
    dotInterval: number       // Interval titik putih kecil di lajur abu-abu (misal setiap 3 unit)
    
    // 12 Bukaan Atap (Skylights)
    skylightGridCols: number  // 4 kolom bukaan
    skylightGridRows: number  // 3 baris bukaan
    skylightWidthRatio: number  // Lebar bukaan relatif terhadap ubin
    skylightLengthRatio: number // Panjang bukaan (rasio ~1:3.5 vertikal)
    skylightFrameWidthPx: number // Lebar lis bingkai putih bukaan (misal 4px)
    skylightInsetDepth: number   // Kedalaman relief inset kaca (0..1)
  }

  // --- FASAD & KOLOM ---
  facade: {
    columnCountFront: number   // 12 kolom silinder di sisi depan
    columnRadius: number       // Radius kolom (0.05)
    columnRoughness: number    // Roughness cat satin putih maket (0.45)
    bayCount: number           // 11 bay di antara 12 kolom
    cornerLouverLayers: number // 7 lapis sirip horizontal melengkung di sudut
    cornerLouverThickness: number
    cornerLouverGap: number
    
    // Panel Kisi Anyaman Gelombang (Woven Lattice Screen)
    latticeTextureWidth: number  // 2048 px
    latticeTextureHeight: number // 1024 px
    latticeWaveFreq: number      // Frekuensi gelombang anyaman
    latticeWaveAmp: number       // Amplitudo gelombang pembentuk lubang lensa almond
    latticeStrutThickness: number // Ketebalan kisi anyaman
    interiorBackingGap: number   // Jarak bidang gelap interior di balik kisi (0.08)
    interiorLightStrip: boolean  // Lampu strip tipis samar di balik kisi
  }

  // --- LANTAI DASAR & PINTU MASUK ---
  groundFloor: {
    wallRoughness: number        // 0.50 (cat matte akrilik)
    windowGridCount: number      // Jumlah jendela kecil sejajar
    windowWidth: number
    windowHeight: number
    entranceCanopyWidth: number  // Kanopi elips melengkung
    entranceCanopyLength: number
    entranceStepCount: number    // Tangga berundak di bawah kanopi
  }

  // --- LINGKUNGAN DIORAMA (MAKET SHOWCASE) ---
  diorama: {
    tableWidth: number           // Meja dasar maket (11.0)
    tableLength: number          // Panjang meja (14.0)
    tableHeight: number          // Ketinggian plinth meja (0.50)
    acrylicCaseHeight: number    // Ketinggian kotak kaca etalase (3.8)
    acrylicRoughness: number     // 0.04 (kaca sangat jernih)
    acrylicTransmission: number  // 0.96 (transmisi tinggi)
    showcaseGlassVisible: boolean // Toggle tampilan kaca etalase
    treeCount: number            // Jumlah miniatur pohon
    carCount: number             // Jumlah miniatur mobil
    streetLightCount: number     // Tiang lampu jalan
  }

  // --- PALET WARNA RESMI MAKET FISIK (Sesuai Foto Referensi) ---
  colors: {
    whiteModelPaint: string   // #EDEDEA - Cat putih maket matte/satin (akrilik/foam)
    whitePure: string         // #F5F5F3 - Garis rusuk & bingkai bukaan
    groutLight: string        // #D8DBD9 - Nat ubin atap
    greyLight: string         // #BFC2C4 - Abu-abu terang berundak
    greyMedium: string        // #8F949A - Abu-abu sedang chevron
    greyDark: string          // #646A70 - Abu-abu resesif
    skylightGlass: string     // #7A7870 - Kaca asap bukaan atap
    steelBlueLattice: string  // #6E7A88 - Warna anyaman kisi fasad
    steelBlueLight: string    // #A9B4BF - Sorot tepi kisi
    interiorDark: string      // #2B3138 - Rongga gelap di balik kisi
    groundWallMatte: string   // #D8D9D6 - Dinding lantai dasar
    plazaPavers: string       // #8D97A3 - Paving blok plaza
    plazaGrout: string        // #757F8B - Garis nat paving
    grassFlockBright: string  // #3E9B32 - Rumput maket hijau cerah
    grassFlockDark: string    // #2F7F2A - Variasi rumput gelap
    grassFlockHighlight: string // #58B23F - Variasi rumput terang
    roadAsphalt: string       // #70747A - Aspal jalan
    roadMarking: string       // #E5E7EB - Marka putih jalan
    woodVeneer: string        // #8A4B2E - Meja kayu veneer cokelat kemerahan
    plinthBlack: string       // #1A1C1E - Lis plinth hitam bawah
    foliageCanopy: string     // #3A7232 - Daun pohon miniatur
    trunkWood: string         // #7A6A58 - Batang kawat cokelat-abu
  }
}

export const DEFAULT_MULADI_DOME_CONFIG: MuladiDomeConfig = {
  dimensions: {
    width: 6.4,
    length: 8.8,
    heightGround: 0.52,
    heightUpper: 0.88,
    roofPeakHeight: 1.18,
    roofCornerRadius: 1.38,
    overhangLip: 0.34,
    overhangThickness: 0.16,
  },
  roof: {
    textureResolution: 4096,
    tileCountX: 96,
    tileCountY: 132,
    groutWidthPx: 2,
    periodP: 7,
    ribW: 2,
    fadeStart: 0.20,
    fadeEnd: 0.46,
    stairStepMode: true,
    dotInterval: 3,
    skylightGridCols: 4,
    skylightGridRows: 3,
    skylightWidthRatio: 1.8,
    skylightLengthRatio: 6.2,
    skylightFrameWidthPx: 5,
    skylightInsetDepth: 0.22,
  },
  facade: {
    columnCountFront: 12,
    columnRadius: 0.055,
    columnRoughness: 0.45,
    bayCount: 11,
    cornerLouverLayers: 7,
    cornerLouverThickness: 0.035,
    cornerLouverGap: 0.045,
    latticeTextureWidth: 2048,
    latticeTextureHeight: 1024,
    latticeWaveFreq: 8.0,
    latticeWaveAmp: 0.35,
    latticeStrutThickness: 0.16,
    interiorBackingGap: 0.08,
    interiorLightStrip: true,
  },
  groundFloor: {
    wallRoughness: 0.50,
    windowGridCount: 10,
    windowWidth: 0.18,
    windowHeight: 0.24,
    entranceCanopyWidth: 1.6,
    entranceCanopyLength: 0.8,
    entranceStepCount: 3,
  },
  diorama: {
    tableWidth: 12.0,
    tableLength: 15.0,
    tableHeight: 0.45,
    acrylicCaseHeight: 4.2,
    acrylicRoughness: 0.03,
    acrylicTransmission: 0.97,
    showcaseGlassVisible: true,
    treeCount: 36,
    carCount: 8,
    streetLightCount: 14,
  },
  colors: {
    whiteModelPaint: '#EDEDEA',
    whitePure: '#F6F6F4',
    groutLight: '#D8DBD9',
    greyLight: '#BFC2C4',
    greyMedium: '#8F949A',
    greyDark: '#646A70',
    skylightGlass: '#7A7870',
    steelBlueLattice: '#6E7A88',
    steelBlueLight: '#A9B4BF',
    interiorDark: '#2B3138',
    groundWallMatte: '#D8D9D6',
    plazaPavers: '#8D97A3',
    plazaGrout: '#757F8B',
    grassFlockBright: '#3E9B32',
    grassFlockDark: '#2F7F2A',
    grassFlockHighlight: '#58B23F',
    roadAsphalt: '#70747A',
    roadMarking: '#E5E7EB',
    woodVeneer: '#8A4B2E',
    plinthBlack: '#1A1C1E',
    foliageCanopy: '#3A7232',
    trunkWood: '#7A6A58',
  },
}

/**
 * Konfigurasi Ringan untuk Miniatur Meja Diorama (Resolusi Cepat 512px, 0ms latency)
 */
export const MINIATURE_DOME_CONFIG: MuladiDomeConfig = {
  ...DEFAULT_MULADI_DOME_CONFIG,
  roof: {
    ...DEFAULT_MULADI_DOME_CONFIG.roof,
    textureResolution: 512,
  },
  facade: {
    ...DEFAULT_MULADI_DOME_CONFIG.facade,
    latticeTextureWidth: 512,
    latticeTextureHeight: 256,
  },
}
