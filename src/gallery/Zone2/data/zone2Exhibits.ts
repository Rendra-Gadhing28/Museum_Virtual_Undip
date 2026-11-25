import type { Zone2Exhibit, ZoneMeta } from '../types'

export const ZONE_CATALOG: ZoneMeta[] = [
  {
    id: 'zone1',
    number: 1,
    title: 'The Origin of Undip',
    subtitle: 'Ruang Kehormatan & Sejarah Awal',
    theme: 'Founding Era (1956–1960)',
    description: 'Sejarah pendirian Universitas Semarang/Diponegoro, 13 tokoh pendiri & rektor awal, prasasti peresmian oleh Presiden Soekarno, dan arsip bersejarah.',
    isAvailable: true,
    badge: 'Tersedia',
    accentColor: '#d4af37',
  },
  {
    id: 'zone2',
    number: 2,
    title: 'The Growth of Knowledge',
    subtitle: 'Mekarnya Fakultas, Riset & Kampus',
    theme: 'Expansion & Innovation Era',
    description: 'Perkembangan 11+ fakultas dan sekolah vokasi, transformasi relokasi kampus Pleburan ke Tembalang & Jepara, riset unggulan kelautan (PIP), serta pengabdian masyarakat (KKN).',
    isAvailable: true,
    badge: 'Tersedia',
    accentColor: '#f59e0b',
  },
  {
    id: 'zone3',
    number: 3,
    title: 'The Heritage of Undip',
    subtitle: 'Ruang Kehormatan & Warisan Sejarah',
    theme: 'Academic Memorabilia & Archives',
    description: 'Diorama isometrik warisan kampus: prasasti peresmian batu andesit, 3 vitrine artefak akademik, memorabilia tokoh, dinding foto sepia, dan proyektor vintage.',
    isAvailable: true,
    badge: 'Tersedia',
    accentColor: '#C9A24B',
  },
  {
    id: 'zone4',
    number: 4,
    title: 'Undip Today',
    subtitle: 'Kampus Modern & Smart Labs',
    theme: 'Contemporary Excellence',
    description: 'Kompleks pameran maket kampus hidup 90x70m, Research Dome inovasi DNA helix & 6 lab mutakhir, Menara Atrium 5 lantai Book Helix, dan Global Stage pengakuan dunia.',
    isAvailable: true,
    badge: 'Tersedia',
    accentColor: '#7FD1E8',
  },
  {
    id: 'zone5',
    number: 5,
    title: 'Undip Future',
    subtitle: 'Kampus Digital, AI & Peradaban 2050',
    theme: 'World Class & Sustainability',
    description: 'Kompleks pameran futuristik 100x80m: Digital Twin Plaza, The Neural Atrium AI Brain, Command Deck Smart Campus, The Summit Menara Spiral 7 Tingkat, The Living Grove 17 SDGs, dan Vision Beacon Fajar 2050.',
    isAvailable: true,
    badge: 'Tersedia',
    accentColor: '#38BDF8',
  },
]

/**
 * 1. PERKEMBANGAN FAKULTAS (The Growth of Faculties)
 */
export const FACULTY_EXHIBITS: Zone2Exhibit[] = [
  {
    id: 'faculty-law',
    title: 'Fakultas Hukum (FH)',
    category: 'faculty',
    period: '1957',
    shortLabel: 'Fakultas Tertua Undip',
    subtitle: 'Tonggak Awal Pendidikan Tinggi Hukum di Jawa Tengah',
    description: 'Fakultas Hukum didirikan pada 1957 sebagai embrio Universitas Semarang. Melahirkan pakar hukum legendaris Prof. Satjipto Rahardjo dengan Mazhab Hukum Progresif yang diakui dunia.',
    fullContent: 'Fakultas Hukum Universitas Diponegoro merupakan fakultas tertua dan batu pijakan utama kelahiran Undip. Bermula dari inisiatif para praktisi hukum dan hakim terkemuka Semarang pada tahun 1956, FH resmi memulai perkuliahan pada awal 1957. Dari kampus inilah lahir konsep Hukum Progresif yang digagas oleh Guru Besar Prof. Dr. Satjipto Rahardjo, S.H., mengubah paradigma hukum Indonesia dari sekadar legalitas formal menjadi instrumen keadilan substantif yang memanusiakan manusia.',
    highlights: [
      'Pionir Mazhab Hukum Progresif Prof. Satjipto Rahardjo',
      'Terakreditasi Unggul & Sertifikasi Internasional FIBAA',
      'Mencetak ratusan hakim agung, jaksa agung, menteri, dan advokat terkemuka nasional',
    ],
    stats: [
      { label: 'Tahun Berdiri', value: '1957' },
      { label: 'Jenjang Studi', value: 'S1, S2, S3 & Profesi' },
      { label: 'Akreditasi', value: 'Unggul / FIBAA' },
    ],
    badge: 'Fakultas Tertua 1957',
  },
  {
    id: 'faculty-feb',
    title: 'Fakultas Ekonomika dan Bisnis (FEB)',
    category: 'faculty',
    period: '1958',
    shortLabel: 'Pelopor Ekonomi Maritim & Bisnis',
    subtitle: 'Kawah Candradimuka Pemimpin Ekonomi & Keuangan Nusantara',
    description: 'Didirikan tahun 1958, FEB Undip menjadi pusat rujukan kajian makroekonomi, akuntansi forensik, dan ekonomi kelautan di Indonesia.',
    fullContent: 'Fakultas Ekonomika dan Bisnis Undip berdiri pada 14 Maret 1958 untuk menjawab tantangan industrialisasi dan pembangunan ekonomi pasca-kemerdekaan. FEB Undip telah memperoleh akreditasi internasional bereputasi tinggi dan terus menghasilkan riset aplikatif di bidang ekonomi sirkular, bisnis digital, dan tata kelola keuangan negara.',
    highlights: [
      'Terakreditasi ABEST21 dan FIBAA Internasional',
      'Pusat studi ekonomi maritim dan perbankan syariah terkemuka',
      'Laboratorium Bloomberg Financial Market & Tax Center mandiri',
    ],
    stats: [
      { label: 'Tahun Berdiri', value: '1958' },
      { label: 'Departemen', value: 'Manajemen, Akuntansi, IESP' },
      { label: 'Akreditasi', value: 'Unggul / ABEST21' },
    ],
    badge: 'Akreditasi Global 1958',
  },
  {
    id: 'faculty-ft',
    title: 'Fakultas Teknik (FT)',
    category: 'faculty',
    period: '1958',
    shortLabel: 'Inovator Rekayasa & Teknologi',
    subtitle: 'Pilar Rekayasa Infrastruktur, Perkapalan, dan Teknologi Hijau',
    description: 'Resmi berdiri 20 Oktober 1958, FT Undip terkenal dengan keunggulan Teknik Perkapalan, Sipil, Arsitektur, Mesin, Kimia, Elektro, Lingkungan, dan Geologi.',
    fullContent: 'Fakultas Teknik Universitas Diponegoro diresmikan pada 20 Oktober 1958 dengan jurusan pertama Teknik Sipil, disusul Teknik Mesin dan Teknik Perkapalan. Departemen Teknik Perkapalan Undip adalah salah satu yang terbaik di Asia Tenggara, menopang visi Pola Ilmiah Pokok Bina Kelautan Undip. Insinyur FT Undip telah berkontribusi besar dalam pembangunan infrastruktur strategis nasional seperti jembatan bentang panjang, pelabuhan, dan transisi energi terbarukan.',
    highlights: [
      'Departemen Teknik Perkapalan & Kelautan tertua di Jawa Tengah',
      'Sertifikasi akreditasi internasional IABEE dan JABEE',
      'Inovator kapal nelayan bertenaga surya dan robot bawah air (ROV)',
    ],
    stats: [
      { label: 'Tahun Berdiri', value: '1958' },
      { label: 'Departemen', value: '12 Program Studi Rekayasa' },
      { label: 'Akreditasi', value: 'Unggul / IABEE' },
    ],
    badge: 'Riset Rekayasa 1958',
  },
  {
    id: 'faculty-fk',
    title: 'Fakultas Kedokteran (FK)',
    category: 'faculty',
    period: '1961',
    shortLabel: 'Pelayanan Medis Humanis',
    subtitle: 'Pusat Keunggulan Kedokteran Tropis, Gizi Klinik & Biomedis',
    description: 'Didirikan tahun 1961 melalui kerjasama dengan RSUP Dr. Kariadi, FK Undip kini didukung RS Nasional Diponegoro (RSND) bertaraf internasional.',
    fullContent: 'Fakultas Kedokteran Undip berdiri pada 1 Oktober 1961, menjawab kebutuhan mendesak akan tenaga dokter di Jawa Tengah dan kawasan timur Indonesia. Bermitra erat dengan RSUP Dr. Kariadi sebagai rumah sakit pendidikan utama, FK Undip melahirkan dokter-dokter berkarakter luhur. Kini FK Undip memiliki Rumah Sakit Nasional Diponegoro (RSND) di kampus Tembalang yang menjadi sentra riset stem cell, penanganan penyakit tropis, dan layanan kesehatan mutakhir.',
    highlights: [
      'Memiliki Rumah Sakit Perguruan Tinggi Negeri (RSND) Tipe B terakreditasi Paripurna',
      'Pusat Unggulan Riset Kedokteran Tropis dan Gizi Klinis',
      'Pendidikan spesialis dan subspesialis terlengkap di Jawa Tengah',
    ],
    stats: [
      { label: 'Tahun Berdiri', value: '1961' },
      { label: 'Fasilitas Utama', value: 'RSND & Laboratorium Biomedis' },
      { label: 'Akreditasi', value: 'Unggul / ASIIN' },
    ],
    badge: 'Medis & RSND 1961',
  },
  {
    id: 'faculty-fpp',
    title: 'Fakultas Peternakan dan Pertanian (FPP)',
    category: 'faculty',
    period: '1964',
    shortLabel: 'Peternakan & Pertanian',
    subtitle: 'Lumbung Ilmu Peternakan dan Agribisnis Nusantara',
    description: 'Berawal dari Fakultas Peternakan (1964), resmi menjadi Fakultas Peternakan dan Pertanian melalui SK Rektor No. 724/SK/UN7/2011.',
    fullContent: 'Fakultas Peternakan Universitas Diponegoro mulai berdiri pada 1964 dan menjadi salah satu fakultas tertua dalam sejarah Undip. Seiring berkembangnya kebutuhan ketahanan pangan nasional, dilakukan pengembangan ilmu pertanian sehingga Senat Undip menyetujui perubahan nama menjadi Fakultas Peternakan dan Pertanian melalui SK Rektor No. 724/SK/UN7/2011 tanggal 8 Desember 2011. Pada 2012 dibentuk Jurusan Pertanian, melengkapi Jurusan Peternakan yang telah ada sebelumnya.',
    highlights: [
      'Fakultas peternakan tertua di Jawa Tengah sejak 1964',
      'SK Rektor No. 724/SK/UN7/2011 (8 Desember 2011)',
      'Program studi Peternakan, Agroteknologi, dan Agribisnis',
    ],
    stats: [
      { label: 'Tahun Berdiri', value: '1964' },
      { label: 'Nama FPP Sejak', value: '2011' },
      { label: 'Jenjang Studi', value: 'S1 & S2' },
    ],
    badge: 'Peternakan 1964',
  },
  {
    id: 'faculty-fib',
    title: 'Fakultas Ilmu Budaya (FIB)',
    category: 'faculty',
    period: '1965',
    shortLabel: 'Bahasa, Sastra & Budaya',
    subtitle: 'Penjaga Warisan Bahasa dan Sastra Nusantara',
    description: 'Berakar dari panitia Fakultas Sastra dan Budaya yang dibentuk 25 Januari 1965, kini menaungi bahasa, sastra, dan kebudayaan.',
    fullContent: 'Usaha mendirikan fakultas sastra di Undip dimulai dengan pembentukan Panitia Fakultas Sastra dan Budaya berdasarkan SK Rektor No. 626/Sp/Adm/BUP/1965 tanggal 25 Januari 1965. Seiring waktu fakultas ini berkembang menjadi Fakultas Ilmu Budaya (FIB) yang menaungi program studi sastra Indonesia, Inggris, Jepang, Jerman, Arab, ilmu perpustakaan, dan sejarah. Sejak 1973 fakultas ini membuka tingkat doktoral, menjadikannya salah satu pusat kajian kebudayaan terkemuka di Indonesia.',
    highlights: [
      'Panitia Fakultas Sastra & Budaya dibentuk 25 Januari 1965',
      'Membuka program doktoral sastra sejak 1973',
      'Menjaga khazanah bahasa, sastra, dan kebudayaan Nusantara',
    ],
    stats: [
      { label: 'Tahun Berdiri', value: '1965' },
      { label: 'Jenjang Studi', value: 'S1 & S2' },
      { label: 'Akreditasi', value: 'Unggul' },
    ],
    badge: 'Sastra & Budaya 1965',
  },
  {
    id: 'faculty-fisip',
    title: 'Fakultas Ilmu Sosial dan Ilmu Politik (FISIP)',
    category: 'faculty',
    period: '1968',
    shortLabel: 'Sosial & Politik',
    subtitle: 'Kawah Candradimuka Pemimpin Sosial Politik',
    description: 'Resmi berdiri melalui SK Dirjen Perguruan Tinggi No. 116 tahun 1968 tentang pemecahan FHPM, efektif 1 Januari 1969.',
    fullContent: 'Fakultas Ilmu Sosial dan Ilmu Politik Undip lahir dari pemecahan Fakultas Hukum, Perikanan, dan Masyarakat (FHPM) melalui Keputusan Direktur Jenderal Perguruan Tinggi No. 116 tanggal 9 Desember 1968, dan efektif berdiri sendiri sejak 1 Januari 1969. FISIP menjadi rumah bagi ilmu politik, sosiologi, administrasi publik, hubungan internasional, dan ilmu komunikasi, serta mencetak tokoh nasional di dunia kebijakan publik dan diplomasi.',
    highlights: [
      'SK Dirjen Perguruan Tinggi No. 116 tahun 1968',
      'Program studi Politik, Sosiologi, Administrasi Publik & HI',
      'Mencetak pemimpin politik, birokrat, dan diplomat nasional',
    ],
    stats: [
      { label: 'Tahun Berdiri', value: '1968' },
      { label: 'Jenjang Studi', value: 'S1 & S2' },
      { label: 'Akreditasi', value: 'Unggul' },
    ],
    badge: 'Sosial Politik 1968',
  },
  {
    id: 'faculty-fpik',
    title: 'Fakultas Perikanan & Ilmu Kelautan (FPIK)',
    category: 'faculty',
    period: '1968',
    shortLabel: 'Jantung PIP Bina Kelautan',
    subtitle: 'Garda Terdepan Poros Maritim & Oseanografi Nusantara',
    description: 'Merupakan manifestasi langsung dari Pola Ilmiah Pokok (PIP) Bina Kelautan Undip, membawahi stasiun riset kelautan Teluk Awur Jepara.',
    fullContent: 'FPIK Undip berakar dari Jurusan Perikanan pada Fakultas Peternakan dan Perikanan tahun 1968, kemudian berkembang mandiri menjadi Fakultas Perikanan dan Ilmu Kelautan pada 1994. FPIK adalah ujung tombak Undip sebagai universitas berbasis riset kelautan. Memiliki fasilitas riset kelautan terlengkap di Indonesia, termasuk Marine Science Techno Park (MSTP) di Teluk Awur, Jepara, dan armada kapal riset oseanografi.',
    highlights: [
      'Sentra riset Oseanografi, Manajemen Sumberdaya Perairan, dan Akuakultur',
      'Pusat Marine Science Techno Park (MSTP) seluas 27 Ha di Jepara',
      'Laboratorium lapangan terumbu karang dan konservasi pesisir Karimunjawa',
    ],
    stats: [
      { label: 'Tahun Rintisan', value: '1968 / 1994' },
      { label: 'Stasiun Riset', value: 'Teluk Awur & Karimunjawa' },
      { label: 'Akreditasi', value: 'Unggul / ASIIN' },
    ],
    badge: 'Bina Kelautan 1968',
  },
  {
    id: 'faculty-fsm',
    title: 'Fakultas Sains dan Matematika (FSM)',
    category: 'faculty',
    period: '1993',
    shortLabel: 'Sains & Matematika',
    subtitle: 'Basis Riset Sains Dasar dan Matematika Terapan',
    description: 'Resmi menjadi fakultas melalui SK Mendikbud No. 0369/O/1993; berakar dari Program Studi Matematika yang dirintis sejak 1969.',
    fullContent: 'Fakultas Sains dan Matematika (FSM) Undip, sebelumnya dikenal sebagai FMIPA, resmi berdiri berdasarkan SK Menteri Pendidikan dan Kebudayaan No. 0369/O/1993 tanggal 21 Oktober 1993. Sejarahnya berawal dari Program Studi Matematika yang dirintis pada 1969, diikuti pembukaan program studi Biologi, Kimia, dan Fisika pada 1988 di bawah Badan Pengelola MIPA. Kini FSM menjadi pusat riset sains dasar, statistika, dan komputasi sains di Undip.',
    highlights: [
      'SK Mendikbud No. 0369/O/1993 tanggal 21 Oktober 1993',
      'Berakar dari Program Studi Matematika sejak 1969',
      'Matematika, Biologi, Kimia, Fisika, dan Statistika',
    ],
    stats: [
      { label: 'Tahun Berdiri', value: '1993' },
      { label: 'Jenjang Studi', value: 'S1 & S2' },
      { label: 'Akreditasi', value: 'Unggul' },
    ],
    badge: 'Sains & Matematika 1993',
  },
  {
    id: 'faculty-fkm',
    title: 'Fakultas Kesehatan Masyarakat (FKM)',
    category: 'faculty',
    period: '1993',
    shortLabel: 'Kesehatan Masyarakat',
    subtitle: 'Pelopor Kesehatan Preventif Jawa Tengah',
    description: 'Berdiri bersama FMIPA melalui SK Mendikbud No. 0369/O/1993; sebelumnya merupakan program studi Kesehatan Masyarakat Undip.',
    fullContent: 'Program Studi Kesehatan Masyarakat Undip dirintis sebelum akhirnya resmi menjadi fakultas sendiri. Pada 1993 terbit SK Menteri Pendidikan dan Kebudayaan No. 0369/O/1993 yang menetapkan berdirinya Fakultas Kesehatan Masyarakat di lingkungan Universitas Diponegoro. FKM kini mengembangkan kajian epidemiologi, gizi masyarakat, kesehatan lingkungan, dan manajemen kesehatan bekerja sama dengan RSND serta dinas kesehatan.',
    highlights: [
      'SK Mendikbud No. 0369/O/1993 tahun 1993',
      'Epidemiologi, gizi masyarakat, dan kesehatan lingkungan',
      'Kemitraan dengan RSND dan dinas kesehatan',
    ],
    stats: [
      { label: 'Tahun Berdiri', value: '1993' },
      { label: 'Jenjang Studi', value: 'S1 & S2' },
      { label: 'Akreditasi', value: 'Unggul' },
    ],
    badge: 'Kesehatan Masyarakat 1993',
  },
  {
    id: 'faculty-fpsi',
    title: 'Fakultas Psikologi (FPsi)',
    category: 'faculty',
    period: '2007',
    shortLabel: 'Psikologi',
    subtitle: 'Fakultas ke-11 Universitas Diponegoro',
    description: 'Program Studi Psikologi resmi menjadi fakultas melalui SK Rektor No. 28/SK/J07/2007 tanggal 24 April 2007.',
    fullContent: 'Rencana pendirian ilmu psikologi di Undip sudah dimulai sejak 1980 dengan menempatkan dosen psikologi di berbagai fakultas. Program Studi Psikologi kemudian resmi menjadi Fakultas Psikologi melalui SK Rektor No. 28/SK/J07/2007 tanggal 24 April 2007, diperkuat dengan SK Menteri Pendidikan Nasional No. 65 Tahun 2009. Terhitung 2 Oktober 2009, FPsi menjadi fakultas ke-11 di lingkungan Universitas Diponegoro.',
    highlights: [
      'SK Rektor No. 28/SK/J07/2007 tanggal 24 April 2007',
      'Fakultas ke-11 Universitas Diponegoro',
      'Psikologi klinis, industri, dan perkembangan',
    ],
    stats: [
      { label: 'Tahun Berdiri', value: '2007' },
      { label: 'Jenjang Studi', value: 'S1 & S2' },
      { label: 'Akreditasi', value: 'Unggul' },
    ],
    badge: 'Psikologi 2007',
  },
]

/**
 * 2. TRANSFORMASI KAMPUS UNDIP (Spatial Campus Transformation)
 */
export const TRANSFORMATION_EXHIBITS: Zone2Exhibit[] = [
  {
    id: 'transform-pleburan',
    title: 'Kampus Heritage Pleburan',
    category: 'transformation',
    period: '1956–1990an',
    shortLabel: 'Kampus Kota Penuh Kenangan',
    subtitle: 'Pusat Sejarah di Jl. Imam Bardjo & Jl. Hayam Wuruk',
    description: 'Kampus pertama di jantung Kota Semarang. Tempat berdirinya Gedung Rektorat lama, Auditorium Imam Bardjo, dan saksi lahirnya tradisi intelektual Undip.',
    fullContent: 'Selama lebih dari tiga dasawarsa, kegiatan administrasi dan perkuliahan Undip berpusat di kawasan Pleburan (Jl. Imam Bardjo, S.H. dan Jl. Hayam Wuruk). Dengan arsitektur kolonial tropis yang asri, Pleburan menjadi episentrum pergerakan mahasiswa dan orasi ilmiah. Meskipun sebagian besar fakultas telah pindah ke Tembalang, kampus Pleburan tetap lestari dan kini difungsikan sebagai kampus Sekolah Pascasarjana, pusat kegiatan alumni, dan cagar budaya intelektual kota Semarang.',
    highlights: [
      'Gedung bersejarah Auditorium Imam Bardjo & Rektorat Heritage',
      'Lokasi strategis di pusat kota Semarang dekat Lapangan Simpang Lima',
      'Kini menjadi Kampus Pascasarjana & Sentra Riset Kebijakan Publik',
    ],
    stats: [
      { label: 'Era Utama', value: '1956–1995' },
      { label: 'Luas Area', value: '± 9 Hektar' },
      { label: 'Fungsi Kini', value: 'Pascasarjana & Arsip Sejarah' },
    ],
    badge: 'Heritage Pleburan',
  },
  {
    id: 'transform-tembalang',
    title: 'Relokasi & Masterplan Kampus Tembalang',
    category: 'transformation',
    period: '1990an–Kini',
    shortLabel: 'Kampus Terpadu Modern (180+ Ha)',
    subtitle: 'Lompatan Raksasa Menuju Fasilitas Kampus Terbesar di Jawa Tengah',
    description: 'Proyek relokasi besar-besaran ke perbukitan Tembalang seluas 180 hektar, menghadirkan Gedung Widya Purabaya, RSND, laboratorium sentral, dan stadion.',
    fullContent: 'Untuk mengatasi keterbatasan ruang di Pleburan dan mewujudkan kampus riset terpadu, pada era 1980-an kepemimpinan Rektor Prof. Sudarto dan Prof. Moeljono S. Trastotenojo memulai pembebasan lahan di perbukitan Tembalang seluas lebih dari 180 hektar. Relokasi bertahap dimulai pada awal 1990-an dan tuntas di dekade 2000-an. Kampus Tembalang dirancang dengan tata ruang hijau terpadu: dilengkapi Danau Retensi, Stadion Utama, Masjid Kampus, Gedung Serbaguna Muladi Dome, dan Gedung Rektorat Widya Purabaya yang megah.',
    highlights: [
      'Luas wilayah terpadu 180+ hektar di dataran tinggi berhawa sejuk',
      'Gedung Ikonik: Gedung Widya Purabaya, ICT Center, RSND, Muladi Dome',
      'Komitmen Smart Eco-Campus dengan hutan kampus dan jalur sepeda',
    ],
    stats: [
      { label: 'Luas Lahan', value: '180 Hektar' },
      { label: 'Mulai Dibangun', value: '1987 / Diresmikan 1995' },
      { label: 'Kapasitas', value: '60.000+ Sivitas Akademika' },
    ],
    badge: 'Masterplan Tembalang',
  },
  {
    id: 'transform-jepara',
    title: 'Kampus & Marine Science Park Jepara',
    category: 'transformation',
    period: '1988–Kini',
    shortLabel: 'Stasiun Riset Laut Teluk Awur',
    subtitle: 'Laboratorium Alam Kelautan & Kemaritiman Terbesar di Pantai Utara',
    description: 'Kampus laboratorium kelautan seluas 27 hektar di Teluk Awur Jepara, dilengkapi dermaga kapal riset, tambak percontohan, dan asrama mahasiswa oseanografi.',
    fullContent: 'Sebagai komitmen terhadap Pola Ilmiah Pokok (PIP) Bina Kelautan, Undip mendirikan Kampus Teluk Awur di Kabupaten Jepara pada tahun 1988. Berada langsung di tepi Laut Jawa, kawasan ini berkembang menjadi Marine Science Techno Park (MSTP). Tempat ini menjadi laboratorium lapangan bagi mahasiswa oseanografi, perikanan, biologi laut, dan teknik perkapalan untuk melakukan riset oseanografi tropis, pembenihan udang vaname, serta budidaya mikroalga.',
    highlights: [
      'Fasilitas Marine Science Techno Park (MSTP) bertaraf internasional',
      'Dermaga dan laboratorium oseanografi berhadapan langsung dengan Laut Jawa',
      'Sentra pelatihan budidaya pesisir dan pembibitan mangrove nasional',
    ],
    stats: [
      { label: 'Luas Wilayah', value: '27 Hektar' },
      { label: 'Lokasi', value: 'Teluk Awur, Kabupaten Jepara' },
      { label: 'Fasilitas Unggulan', value: 'Hatchery, MSTP & Dermaga' },
    ],
    badge: 'Riset Laut Jepara',
  },
]

/**
 * 3. PERKEMBANGAN PENDIDIKAN & PENELITIAN (Education & Research Development)
 */
export const RESEARCH_EXHIBITS: Zone2Exhibit[] = [
  {
    id: 'research-pip-kelautan',
    title: 'Pola Ilmiah Pokok (PIP): Bina Kelautan',
    category: 'research',
    period: '1977–Kini',
    shortLabel: 'Identitas Riset Bahari Nasional',
    subtitle: 'Doktrin Akademik: Undip Sebagai Pelopor Keunggulan Maritim Nusantara',
    description: 'Ditetapkan sejak masa Rektor Prof. Dr. Moeljono S. Trastotenojo, PIP Bina Kelautan mengintegrasikan seluruh riset fakultas dalam kerangka pembangunan wilayah maritim.',
    fullContent: 'Pada tahun 1977, Senat Universitas menetapkan "Pengembangan Wilayah Pantai dan Laut" (dikenal sebagai Pola Ilmiah Pokok: Bina Kelautan) sebagai identitas riset khas Undip. Menyadari bahwa Indonesia adalah negara kepulauan terbesar di dunia, seluruh fakultas di Undip diarahkan untuk memiliki dimensi bahari: dari hukum laut di FH, ekonomi pesisir di FEB, kapal nelayan di FT, nutrisi hasil laut di FK, tata ruang pesisir di FPP, hingga sains kelautan di FPIK.',
    highlights: [
      'Doktrin riset strategis nasional yang diakui Ditjen Dikti sejak 1977',
      'Melatarbelakangi lahirnya jurnal internasional bertaraf Q1 di bidang kelautan',
      'Riset desalinasi air laut, turbin arus laut, dan obat antikanker berbasis spons karang',
    ],
    stats: [
      { label: 'Ditetapkan', value: '1977' },
      { label: 'Cakupan', value: '11 Fakultas Bersinergi' },
      { label: 'Publikasi Bahari', value: '3.500+ Artikel Terindeks' },
    ],
    badge: 'PIP Bina Kelautan',
  },
  {
    id: 'research-paten-inovasi',
    title: 'Laboratorium Terpadu & Hilirisasi Paten',
    category: 'research',
    period: 'Era PTN-BH',
    shortLabel: 'Inovasi Siap Pakai & Hak Paten',
    subtitle: 'Dari Meja Laboratorium Menuju Solusi Nyata Bangsa',
    description: 'Undip konsisten masuk jajaran universitas dengan pendaftaran paten terbanyak di Indonesia. Menghasilkan inovasi ozonizer penyimpan beras, tangan bionik, dan reaktor plasma.',
    fullContent: 'Peralihan Undip menjadi Perguruan Tinggi Negeri Berbadan Hukum (PTN-BH) pada 2015 memacu akselerasi komersialisasi riset. Laboratorium Terpadu (UPT Lab Terpadu) yang dilengkapi SEM, TEM, XRD, dan GC-MS mendukung riset kelas dunia. Inovasi monumental yang dihasilkan antara lain Tangan Bionik Asto Djiwo (Karya Dr. Rifky Ismail), Mesin Pengawet Hasil Tani Berbasis Ozon D-Ozone (Prof. Muhammad Nur), dan filter membran air bersih.',
    highlights: [
      'Inovasi Tangan Bionik Medis dengan harga terjangkau bagi difabel',
      'Teknologi Generator Ozon D-Ozone pengawet hasil panen hortikultura',
      'Peringkat 3 Besar Nasional dalam perolehan Paten Terdaftar dari Kemenkumham',
    ],
    stats: [
      { label: 'Hak Paten', value: '500+ Paten Terdaftar' },
      { label: 'Produk Komersial', value: '25+ Produk Industri' },
      { label: 'Fasilitas', value: 'UPT Laboratorium Terpadu' },
    ],
    badge: 'Inovasi & Paten',
  },
]

/**
 * 4. PRESTASI AKADEMIK & KONTRIBUSI KEPADA MASYARAKAT
 */
export const ACHIEVEMENT_EXHIBITS: Zone2Exhibit[] = [
  {
    id: 'achieve-kkn-tematik',
    title: 'Pelopor KKN Tematik & Pengabdian 3T',
    category: 'achievement',
    period: '1971–Kini',
    shortLabel: 'Pengabdian Terjun ke Desa',
    subtitle: 'Mahasiswa Menjadi Agen Transformasi Nyata di Pelosok Negeri',
    description: 'Kuliah Kerja Nyata (KKN) Undip menerjunkan ribuan mahasiswa setiap semester untuk memberdayakan UMKM pedesaan, sanitasi sehat, dan mitigasi bencana pesisir.',
    fullContent: 'Undip adalah salah satu perguruan tinggi perintis program Kuliah Kerja Nyata di Indonesia sejak awal 1970-an. Berbeda dengan KKN konvensional, Undip mengembangkan KKN Tematik Berkelanjutan yang diselaraskan dengan Target Pembangunan Berkelanjutan (SDGs). Puluhan ribu mahasiswa diterjunkan dari Kepulauan Karimunjawa, pegunungan Dieng, hingga wilayah 3T (Tertinggal, Terdepan, Terluar) di luar Jawa untuk mendirikan pembangkit mikrohidro desa, membina UMKM, dan mendampingi posyandu stunting.',
    highlights: [
      'Menerjunkan lebih dari 7.000 mahasiswa per tahun ke 200+ desa binaan',
      'Model KKN Kolaborasi Nasional bersama kementerian dan BUMN',
      'Membangun puluhan desa mandiri energi dan desa wisata pesisir',
    ],
    stats: [
      { label: 'Desa Dampingan', value: '1.200+ Desa' },
      { label: 'Peserta / Tahun', value: '7.500 Mahasiswa' },
      { label: 'Dampak Sosial', value: 'Juara Nasional Pengabdian' },
    ],
    badge: 'KKN Nusantara',
  },
  {
    id: 'achieve-reputasi-global',
    title: 'Lompatan Reputasi Akademik Global',
    category: 'achievement',
    period: '2015–Kini',
    shortLabel: 'World Class University Ranking',
    subtitle: 'Peringkat QS World Rankings & Capaian Lulusan Cepat Kerja',
    description: 'Undip dinobatkan sebagai perguruan tinggi nomor 1 di Indonesia dalam indikator Graduate Employability (Kecepatan Lulusan Memperoleh Pekerjaan) versi QS.',
    fullContent: 'Kualitas pendidikan Undip tercermin dari pengakuan lembaga internasional. Dalam QS Graduate Employability Rankings, lulusan Undip berhasil menempati peringkat ke-1 di Indonesia sebagai alumni yang paling cepat terserap di dunia kerja dan industri. Secara institusi, Undip berada di Top 200 Asia dan Top 700 Dunia versi QS World University Rankings. Selain itu, Undip menduduki peringkat Top 30 Dunia pada UI GreenMetric World University Rankings berkat komitmen pengelolaan kampus hijau rendah karbon.',
    highlights: [
      'Peringkat 1 Nasional QS Graduate Employability Rankings (Lulusan Tercepat Kerja)',
      'Top 200 QS Asian University Rankings & Top 750 Dunia',
      'Peringkat ke-2 Nasional & Top 30 Dunia UI GreenMetric Kampus Berkelanjutan',
    ],
    stats: [
      { label: 'Graduate Employability', value: '#1 di Indonesia' },
      { label: 'UI GreenMetric', value: 'Top 30 Dunia' },
      { label: 'Akreditasi Global', value: '45+ Prodi Terakreditasi Dunia' },
    ],
    badge: '#1 Lulusan Cepat Kerja',
  },
]

/**
 * CENTERPIECE DIORAMA & MONUMENT
 */
export const ZONE2_CENTERPIECE: Zone2Exhibit = {
  id: 'zone2-centerpiece-diorama',
  title: 'Diorama Transformasi Kampus Undip',
  category: 'transformation',
  period: '1956–Masa Depan',
  shortLabel: 'Diorama Sumbu Utama Kampus',
  subtitle: 'Representasi 3D Miniatur Evolusi Fisik Pleburan, Tembalang, dan Jepara',
  description: 'Maket bertingkat beriluminasi hangat yang menggambarkan transisi epik kampus Undip dari kompleks kota Pleburan ke megakampus perbukitan Tembalang seluas 180 Ha.',
  fullContent: 'Diorama 3D Transformasi Kampus Undip ini merupakan jantung pameran Zona 2. Didesain secara bertingkat di atas podium marmer beraksen emas dan diterangi lampu sorot warm gallery spotlight. Pengunjung dapat melihat secara langsung kontras manis antara Gedung Kolonial Pleburan tahun 1957 dengan masterplan modern Kampus Tembalang yang hijau dan monumental, lengkap dengan Gedung Widya Purabaya, Menara Fakultas, Rumah Sakit Nasional Diponegoro, dan kompleks riset kelautan Teluk Awur Jepara.',
  highlights: [
    'Penataan bertingkat (multi-tiered layout) mencerminkan filosofi tangga ilmu pengetahuan',
    'Miniatur akurat Gedung Widya Purabaya, Masjid Kampus, dan RSND',
    'Sentra informasi interaktif dengan visualisasi peta dan linimasa relokasi kampus',
  ],
  stats: [
    { label: 'Fokus Display', value: 'Pleburan • Tembalang • Jepara' },
    { label: 'Teknik Diorama', value: 'Multi-Tiered Architectural Display' },
    { label: 'Iluminasi', value: 'Warm Accent 2800K Gallery Spotlight' },
  ],
  badge: 'Diorama Utama 3D',
}

export const ZONE2_MONUMENT: Zone2Exhibit = {
  id: 'zone2-back-monument',
  title: 'Monumen "The Growth of Knowledge"',
  category: 'monument',
  period: '1957–Abadi',
  shortLabel: 'Prasasti Wibawa Akademik',
  subtitle: 'Pena Emas & Kitab Pengetahuan Berkelanjutan Undip',
  description: 'Monumen dinding relief perunggu dan marmer hitam berukir semboyan universitas: "Universitas Diponegoro Menuju Riset yang Unggul dan Berkarakter Luhur".',
  fullContent: 'Berada di dinding belakang megah Zona 2, Monumen "The Growth of Knowledge" berdiri sebagai mahakarya penghormatan kepada ribuan dosen, peneliti, dan mahasiswa yang telah membangun tradisi keilmuan Undip. Lambang Pangeran Diponegoro yang gagah dipadukan dengan ukiran relief pohon pengetahuan berdaun emas, melambangkan dedikasi universitas untuk terus menghasilkan riset yang tidak hanya unggul di tingkat dunia, namun juga membumi dan dirasakan manfaatnya oleh masyarakat luas.',
  highlights: [
    'Relief perunggu dan emas melambangkan 11 fakultas yang terus bertumbuh',
    'Diterangi oleh floodlight hangat berkontras tinggi tanpa silau',
    'Kutipan resmi visi Undip: "World Class University yang Berkelanjutan"',
  ],
  stats: [
    { label: 'Material', value: 'Marmer Hitam Obsidian & Kuningan' },
    { label: 'Semboyan', value: 'Unggul, Berkelanjutan, Bermanfaat' },
    { label: 'Simbol', value: 'Pohon Pengetahuan & Wibawa Undip' },
  ],
  badge: 'Monumen Kehormatan',
}

export const ALL_ZONE2_EXHIBITS: Zone2Exhibit[] = [
  ...FACULTY_EXHIBITS,
  ...TRANSFORMATION_EXHIBITS,
  ...RESEARCH_EXHIBITS,
  ...ACHIEVEMENT_EXHIBITS,
  ZONE2_CENTERPIECE,
  ZONE2_MONUMENT,
]
