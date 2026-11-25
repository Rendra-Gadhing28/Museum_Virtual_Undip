/**
 * Zona 3 — The Heritage of Undip
 * Master Exhibition Configuration & Parameter Registry (Kompleks Besar 76 x 60 meter)
 */

export const ZONE3_CONFIG = {
  // Palet Warna Konsisten
  palette: {
    navy: '#0B1F3A',         // Dominan: latar, karpet, beludru vitrine
    navyDark: '#050E1A',     // Dasar bayangan & background jauh
    navyCinema: '#071526',   // Area mini-cinema
    gold: '#C9A24B',         // Aksen: garis inlay, bingkai, emblem, highlight
    goldBright: '#FFD700',   // Emissive hotspot & aksen cahaya
    goldHolo: '#E6C265',     // Hologram halus & ring cahaya
    ivory: '#F5EFE0',        // Lantai marmer, panel plakat, teks
    darkBrown: '#3E2A1E',    // Kayu bingkai foto, alas plinth, sisi bawah platform
    steleStone: '#2B2A28',   // Batu andesit prasasti (abu gelap hangat)
  },

  // Dimensi Platform Melayang Raksasa (Floating Island 76 x 60 unit)
  platform: {
    width: 76.0,             // Sumbu X: 76 meter
    length: 60.0,            // Sumbu Z: 60 meter
    marbleHeight: 0.8,       // Ketebalan lantai marmer ivory atas
    bevelSize: 0.45,         // Tepi berbevel megah
    woodBaseHeight: 1.2,     // Sisi bawah kayu solid dark brown
    goldInlayInset: 1.2,     // Jarak garis emas dari tepi luar
    entranceZ: 30.0,         // Pintu masuk selatan (0, +30)
    runnerWidth: 4.0,        // Karpet runner navy selebar 4 meter
  },

  // Koordinat 6 Area Utama Kompleks
  areas: {
    // 1. PLAZA PRASASTI (HERO) — Pusat (0, -2), Lingkaran Radius 10
    plaza: {
      position: [0, 0, -2.0] as [number, number, number],
      radius: 10.0,
      plinthDiameter: 8.0,
      plinthTiers: 5,
      steleWidth: 3.0,
      steleHeight: 7.0,
      steleThickness: 0.7,
    },

    // 2. GALERI FOTO SEJARAH — Utara (0, -22), Lebar 40, Tinggi 9
    photoGallery: {
      position: [0, 0, -22.0] as [number, number, number],
      width: 40.0,
      height: 9.0,
      radius: 26.0,          // Lengkungan dinding
      photoCount: 28,
    },

    // 3. SAYAP ARTEFAK AKADEMIK — Barat (-26, -2), Area 24 x 26
    artifactWing: {
      position: [-26.0, 0, -2.0] as [number, number, number],
      width: 24.0,
      length: 26.0,
      aisleWidth: 3.0,       // Lorong tengah lebar 3 meter
      vitrineCount: 12,
    },

    // 4. SAYAP DOKUMEN PENTING — Timur (+26, -2), Area 24 x 26
    documentWing: {
      position: [26.0, 0, -2.0] as [number, number, number],
      width: 24.0,
      length: 26.0,
      displayCount: 10,
    },

    // 5. AULA MEMORABILIA TOKOH ("Hall of Legacy") — Barat Daya (-22, +17), Lingkaran Diameter 20
    legacyHall: {
      position: [-22.0, 0, 17.0] as [number, number, number],
      diameter: 20.0,
      radius: 10.0,
      pillarCount: 8,
      pillarHeight: 5.0,
    },

    // 6. PAVILIUN AUDIOVISUAL (Mini-Cinema) — Tenggara (+22, +17), Area 24 x 16
    cinemaPavilion: {
      position: [22.0, 0, 17.0] as [number, number, number],
      width: 24.0,
      length: 16.0,
      screenWidth: 9.0,
      screenHeight: 5.0,
    },
  },

  // Pencahayaan Bertemperatur Khusus per Area
  lighting: {
    ambientColor: '#0a1d36',
    ambientIntensity: 0.28,

    // 1. Plaza: Emas Hangat (#FFD9A0)
    plazaKeyColor: '#FFD9A0',
    plazaKeyIntensity: 65,
    rakingLightColor: '#FFE0A8',
    rakingLightIntensity: 3.5,

    // 2. Artefak: Putih Lembut (#FFF8EE)
    artifactSpotColor: '#FFF8EE',
    artifactIntensity: 38,

    // 3. Memorabilia: Gelap Dramatis dengan Light Shafts
    legacyHaloColor: '#E6C265',
    legacyBeamIntensity: 32,

    // 4. Foto: Galeri Hangat Natural (#FFE2B8)
    photoSpotColor: '#FFE2B8',
    photoSpotIntensity: 26,

    // 5. Dokumen: Kuning Redup Iluminasi Naskah (#FFE8B0)
    docSpotColor: '#FFE8B0',
    docSpotIntensity: 34,

    // 6. Audiovisual: Biru Gelap Sinematik (#406899)
    cinemaGlowColor: '#5a82b8',
    cinemaIntensity: 24,

    // Rim & Fog
    rimLightColor: '#5888c0',
    rimLightIntensity: 1.5,
    fogColor: '#050E1A',
    fogNear: 45,
    fogFar: 140,
  },

  // Kamera Isometrik Kompleks Besar & Waypoints
  camera: {
    // Sudut Isometrik 45° azimuth, 35° elevasi, menjangkau seluruh 76 x 60 meter
    overviewPosition: [52.0, 44.0, 52.0] as [number, number, number],
    overviewLookAt: [0, 2.0, 0] as [number, number, number],
    fov: 36,
    minDistance: 12.0,
    maxDistance: 88.0,
    minPolarAngle: Math.PI / 4.5,
    maxPolarAngle: Math.PI / 2.65,
    azimuthConstraint: 0.88, // ±50° rotasi horizontal bebas
    dampingFactor: 0.05,
    introDuration: 5.5,
  },

  // Waypoints Guided Tour (6 Stasiun Lengkap)
  tourWaypoints: [
    {
      id: 'tour-plaza',
      title: 'Plaza Prasasti Monumental (Hero)',
      cameraPosition: [12.0, 10.0, 14.0] as [number, number, number],
      target: [0, 4.0, -2.0] as [number, number, number],
      duration: 5.0,
      areaKey: 'plaza',
    },
    {
      id: 'tour-artifacts',
      title: 'Sayap Artefak Akademik (12 Vitrine & Lab Antik)',
      cameraPosition: [-16.0, 9.0, 10.0] as [number, number, number],
      target: [-26.0, 2.0, -2.0] as [number, number, number],
      duration: 5.0,
      areaKey: 'artifacts',
    },
    {
      id: 'tour-legacy',
      title: 'Aula Memorabilia Tokoh ("Hall of Legacy")',
      cameraPosition: [-12.0, 11.0, 28.0] as [number, number, number],
      target: [-22.0, 3.0, 17.0] as [number, number, number],
      duration: 5.0,
      areaKey: 'legacy',
    },
    {
      id: 'tour-photos',
      title: 'Galeri Foto Sejarah (28 Foto Salon Hang)',
      cameraPosition: [0, 12.0, -6.0] as [number, number, number],
      target: [0, 5.0, -22.0] as [number, number, number],
      duration: 5.0,
      areaKey: 'photos',
    },
    {
      id: 'tour-documents',
      title: 'Sayap Dokumen Penting & Piagam SK Penegerian',
      cameraPosition: [16.0, 9.0, 10.0] as [number, number, number],
      target: [26.0, 2.0, -2.0] as [number, number, number],
      duration: 5.0,
      areaKey: 'documents',
    },
    {
      id: 'tour-cinema',
      title: 'Paviliun Audiovisual & Layar Mini-Cinema',
      cameraPosition: [12.0, 9.0, 28.0] as [number, number, number],
      target: [22.0, 2.5, 17.0] as [number, number, number],
      duration: 5.0,
      areaKey: 'cinema',
    },
  ],
} as const
