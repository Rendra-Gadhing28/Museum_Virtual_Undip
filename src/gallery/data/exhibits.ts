export interface Founder {
  id: string
  name: string
  title: string
  years: string
  role: string
  description: string
  quote?: string
  imagePath?: string
}

export interface HistoryExhibit {
  id: string
  title: string
  category: 'history' | 'campus-photo' | 'decree' | 'archive'
  period: string
  shortLabel: string
  description: string
  fullContent: string
  imagePath?: string
  highlights?: string[]
  // Layout metadata for salon-style arrangement
  orientation?: 'landscape' | 'portrait' | 'square'
  size?: 'large' | 'medium' | 'small'
}

/**
 * 13 Tokoh Pendiri Universitas Diponegoro
 */
export const UNDIP_FOUNDERS: Founder[] = [
  {
    id: 'mr-soedarto',
    name: 'Mr. Soedarto',
    title: 'Ketua Presidium Yayasan & Rektor Pembangun',
    years: '1913–1986',
    role: 'Pelopor pendirian Yayasan Universitas Semarang dan peletak dasar akademik utama Undip.',
    description: 'Mr. Soedarto adalah tokoh sentral di balik pendirian Yayasan Universitas Semarang pada 1956. Sebagai Jaksa Tinggi Jawa Tengah dan kemudian Rektor Universitas Diponegoro, beliau mendedikasikan hidupnya untuk mentransformasikan perguruan tinggi swasta lokal menjadi universitas negeri bereputasi tinggi.',
    quote: 'Pendidikan tinggi adalah jembatan emas pembangun karakter bangsa yang berdaulat.',
  },
  {
    id: 'mr-imam-bardjo',
    name: 'Mr. Imam Bardjo',
    title: 'Presiden (Rektor) Pertama Universitas Semarang',
    years: '1902–1959',
    role: 'Ketua Pengadilan Tinggi Jawa Tengah dan Rektor pertama yang meresmikan perkuliahan perdana tahun 1957.',
    description: 'Mr. Imam Bardjo memimpin universitas di masa-masa awal yang penuh keterbatasan. Dengan wibawa kepemimpinannya, beliau berhasil menyatukan para akademisi dan praktisi hukum untuk mendirikan Fakultas Hukum dan Masyarakat serta Akademi Administrasi Negara.',
    quote: 'Bermula dari cita-cita luhur di Kota Semarang untuk mencerdaskan generasi penerus bangsa.',
  },
  {
    id: 'mr-dan-sulaiman',
    name: 'Mr. Dan Sulaiman',
    title: 'Prakarsa & Pengurus Inti Yayasan',
    years: '1908–1983',
    role: 'Penyusun kerangka organisasi dan konseptor kurikulum awal pendidikan tinggi Semarang.',
    description: 'Mr. Dan Sulaiman berperan penting dalam merumuskan anggaran dasar dan statuta pertama universitas, menjamin legalitas serta keberlanjutan institusi dalam masa transisi pascakemerdekaan.',
    quote: 'Integritas dan kepastian hukum adalah pilar utama kemajuan universitas.',
  },
  {
    id: 'mr-soesanto-kartoatmodjo',
    name: 'Mr. Soesanto Kartoatmodjo',
    title: 'Perintis Fakultas & Pembina Yayasan',
    years: '1910–1988',
    role: 'Tokoh hukum terkemuka yang menggalang dukungan masyarakat intelektual Jawa Tengah.',
    description: 'Aktif merintis pembentukan jurusan-jurusan baru dan mengupayakan sarana fisik perkuliahan perdana di kawasan Bodjong dan Pleburan Semarang.',
  },
  {
    id: 'mr-goenawan-goetomo',
    name: 'Mr. Goenawan Goetomo',
    title: 'Dekan Pertama Akademi Administrasi Negara',
    years: '1915–1992',
    role: 'Pelopor pendidikan administrasi dan tata kelola pemerintahan di Jawa Tengah.',
    description: 'Sebagai dekan pertama, beliau meletakkan fondasi kurikulum administrasi niaga dan negara yang kemudian berkembang menjadi Fakultas Ilmu Sosial dan Ilmu Politik (FISIP).',
  },
  {
    id: 'mr-tan-tjing-hak',
    name: 'Mr. Tan Tjing Hak',
    title: 'Cendekiawan Hukum & Pendiri Yayasan',
    years: '1912–1985',
    role: 'Praktisi hukum yang mewujudkan semangat inklusivitas dan kebhinekaan dalam pendirian Undip.',
    description: 'Kehadiran Mr. Tan Tjing Hak mencerminkan bahwa sejak awal kelahirannya, Universitas Diponegoro terbuka untuk semua etnis dan golongan masyarakat demi kemajuan ilmu pengetahuan.',
  },
  {
    id: 'mr-koo-swan-ik',
    name: 'Mr. Koo Swan Ik',
    title: 'Tokoh Perintis & Pengurus Yayasan',
    years: '1914–1990',
    role: 'Membidani penguatan jejaring akademik dan kerja sama pendanaan awal pendirian universitas.',
    description: 'Berperan besar dalam menggalang partisipasi komunitas profesional Semarang untuk mendukung pendirian gedung dan perpustakaan rintisan.',
  },
  {
    id: 'tuan-achmad-tjokrokusumo',
    name: 'Tuan Achmad Tjokrokusumo',
    title: 'Tokoh Pengusaha & Donatur Perintis',
    years: '1905–1978',
    role: 'Menyediakan sarana fisik awal dan membiayai operasional perkuliahan pertama universitas.',
    description: 'Kedermawanan dan visi kebangsaan Tuan Achmad Tjokrokusumo menjadi penopang nyata terlaksananya kuliah perdana mahasiswa angkatan 1957 tanpa kendala finansial yayasan.',
  },
  {
    id: 'rm-soeprapto',
    name: 'R.M. Soeprapto',
    title: 'Gubernur Jawa Tengah & Pelindung Yayasan',
    years: '1914–1998',
    role: 'Pemberi legitimasi negara dan fasilitator fasilitas umum bagi kampus rintisan.',
    description: 'Selaku Kepala Daerah Swatantra I Jawa Tengah, beliau memfasilitasi gedung perkuliahan di Panti Budaya dan mengesahkan akta pendirian yayasan pada 4 Desember 1956.',
  },
  {
    id: 'prof-mr-sunario',
    name: 'Prof. Mr. Sunario Sastrowardoyo',
    title: 'Guru Besar & Perintis Fakultas Hukum',
    years: '1902–1997',
    role: 'Tokoh Sumpah Pemuda 1928, mantan Menlu RI, dan pembina akademis awal Undip.',
    description: 'Memberikan kuliah umum perdana serta membina para dosen muda dalam mengajar hukum internasional dan hukum tata negara di Semarang.',
  },
  {
    id: 'dr-heyder-bin-heyder',
    name: 'dr. Heyder bin Heyder',
    title: 'Direktur R.S. Semarang & Perintis Kedokteran',
    years: '1909–1982',
    role: 'Memprakarsai pendirian Fakultas Kedokteran Undip bekerjasama dengan RSUP Kariadi.',
    description: 'Dedikasinya membawa dunia medis Semarang menjadi pusat pendidikan dokter yang berdedikasi tinggi bagi masyarakat Jawa Tengah.',
  },
  {
    id: 'prof-soediman',
    name: 'Prof. Soediman Kartohadiprodjo',
    title: 'Pakar Hukum Adat & Penata Statuta',
    years: '1912–1970',
    role: 'Menyusun naskah akademis serta pedoman dasar penyelenggaraan universitas.',
    description: 'Ahli hukum adat terkemuka Indonesia yang memastikan universitas memiliki kepribadian nasional berlandaskan Pancasila.',
  },
  {
    id: 'ir-soemarman',
    name: 'Ir. Soemarman',
    title: 'Perintis Fakultas Teknik Semarang',
    years: '1916–1989',
    role: 'Insinyur sipil perintis pendidikan teknik dan pengembangan masterplan fisik kampus.',
    description: 'Merancang tata ruang fasilitas laboratorium awal dan menjadi dekan pertama yang merintis cikal bakal Fakultas Teknik Undip yang disegani.',
  },
]

/**
 * Historical exhibits for the History & Archives Wing:
 * Comprehensive collection organized for the salon-style multi-frame gallery wall layout
 * as requested from the user's reference photograph.
 */
export const HISTORY_EXHIBITS: HistoryExhibit[] = [
  // 1. Central Grand Painting: Perjuangan Pangeran Diponegoro & Api Cita-Cita Kampus
  {
    id: 'artwork-diponegoro-center',
    title: 'Lukisan Sejarah: Api Perjuangan Pangeran Diponegoro (1825–1830)',
    category: 'history',
    period: 'Karya Bersejarah',
    shortLabel: 'Lukisan Induk Perjuangan',
    description: 'Karya seni monumental yang merefleksikan keberanian Pangeran Diponegoro yang menjadi sumber inspirasi nama dan jiwa Universitas Diponegoro.',
    fullContent: 'Pangeran Diponegoro adalah pahlawan nasional yang memimpin Perang Jawa (1825–1830) melawan penindasan kolonialisme. Kepribadian beliau yang jujur, berani, adil, dan membela rakyat kecil menjadi teladan luhur bagi seluruh sivitas akademika Universitas Diponegoro.\n\nLukisan ini menggambarkan sang Pangeran menunggangi kuda di tengah kancah perjuangan, melambangkan kepemimpinan yang pantang menyerah dan berakar kuat pada nilai spiritual bangsa.',
    highlights: [
      'Simbol kepahlawanan patriotik bagi sivitas akademika',
      'Pemberian nama oleh Presiden Sukarno pada 9 Januari 1960',
      'Nilai luhur: Kejujuran, Keberanian, dan Kepedulian Sosial',
    ],
    orientation: 'landscape',
    size: 'large',
  },

  // 2. Akta Notaris No. 59 Tahun 1956
  {
    id: 'archives-notary-1956',
    title: 'Akta Pendirian Yayasan No. 59 Tahun 1956',
    category: 'archive',
    period: '4 Desember 1956',
    shortLabel: 'Akta Notaris 1956',
    description: 'Lembar otentik Notaris R.M. Soeprapto yang memuat nama para pendiri dan susunan pengurus pertama Yayasan Universitas Semarang.',
    fullContent: 'Dokumen akta otentik bertanggal 4 Desember 1956 ini membuktikan landasan hukum berdirinya "Yayasan Universitas Semarang". Dalam akta tertulis komitmen bersama para pendiri untuk mendirikan sekolah tinggi yang mencakup bidang hukum, ekonomi, ketatanegaraan, dan teknik.\n\nAkta ini merupakan titik tolak formal seluruh kiprah Universitas Diponegoro hingga masa kini.',
    highlights: [
      'Akta Notaris R.M. Soeprapto Nomor 59',
      'Pernyataan kehendak para tokoh untuk mencerdaskan rakyat Jawa Tengah',
      'Bukti sejarah hukum kepemilikan dan legalitas awal yayasan',
    ],
    orientation: 'portrait',
    size: 'medium',
  },

  // 3. Statuta & Kurikulum Pertama 1957
  {
    id: 'archives-statuta-1957',
    title: 'Naskah Statuta & Kurikulum Perdana (1957)',
    category: 'archive',
    period: '9 Januari 1957',
    shortLabel: 'Statuta Perdana 1957',
    description: 'Buku pedoman perkuliahan dan kurikulum Fakultas Hukum dan Masyarakat serta Akademi Administrasi Negara.',
    fullContent: 'Naskah statuta pertama yang dirumuskan oleh Mr. Dan Sulaiman dan Prof. Soediman Kartohadiprodjo menetapkan pedoman pengajaran modern berlandaskan Pancasila.\n\nDokumen ini merinci mata kuliah hukum tata negara, hukum adat, ekonomi moneter, dan pengantar ilmu politik yang diasuh para cendekiawan terkemuka.',
    highlights: [
      'Pedoman akademik pertama universitas di Semarang',
      'Integrasi hukum adat nusantara dan hukum modern',
      'Ditetapkan saat pembukaan kuliah perdana 9 Januari 1957',
    ],
    orientation: 'portrait',
    size: 'medium',
  },

  // 4. Foto Gedung Panti Budaya (Bodjong)
  {
    id: 'early-photo-panti-budaya',
    title: 'Foto Bersejarah: Gedung Panti Budaya di Jl. Pemuda (1957)',
    category: 'campus-photo',
    period: 'Tahun 1957',
    shortLabel: 'Gedung Kuliah Pertama',
    description: 'Dokumentasi otentik gedung tempat peresmian dan ruang kuliah angkatan pertama Universitas Semarang.',
    fullContent: 'Gedung Panti Budaya di Jalan Pemuda (dahulu Bodjong) menjadi saksi bisu hari bersejarah tanggal 9 Januari 1957 saat Presiden Universitas Mr. Imam Bardjo membuka kuliah perdana.\n\nDengan arsitektur kolonial tropis yang megah, gedung ini dipinjamkan oleh pemerintah daerah untuk memulai perkuliahan yang diikuti oleh ratusan pemuda antusias dari seantero Jawa Tengah.',
    highlights: [
      'Lokasi perkuliahan angkatan pertama tahun 1957',
      'Kerjasama erat dengan Pemerintah Kotapraja Semarang',
      'Embrio lahirnya kampus hukum dan administrasi negara',
    ],
    orientation: 'landscape',
    size: 'medium',
  },

  // 5. Foto Mahasiswa Angkatan Pertama
  {
    id: 'early-photo-students-1957',
    title: 'Foto Angkatan Pertama Mahasiswa Undip (1957)',
    category: 'campus-photo',
    period: 'Tahun 1957',
    shortLabel: 'Mahasiswa Angkatan 1957',
    description: 'Potret para mahasiswa angkatan pertama mengenakan pakaian resmi jas dan kebaya di halaman kampus.',
    fullContent: 'Koleksi foto hitam-putih bersejarah memperlihatkan antusiasme mahasiswa angkatan perdana. Berpakaian necis dengan dasi dan kebaya tradisional, para mahasiswa mencerminkan semangat tinggi menuntut ilmu di tengah keterbatasan sarana pascaperang kemerdekaan.',
    highlights: [
      'Mahasiswa angkatan 1957 dari berbagai daerah',
      'Pakaian resmi perkuliahan tradisi meester',
      'Banyak melahirkan tokoh bangsa, hakim agung, dan menteri',
    ],
    orientation: 'landscape',
    size: 'small',
  },

  // 6. SK Presiden & PP No. 7 Tahun 1961
  {
    id: 'decree-sk-1961',
    title: 'Surat Keputusan & PP No. 7 Tahun 1961 (SK Penegerian)',
    category: 'decree',
    period: 'Tahun 1961',
    shortLabel: 'SK Penegerian / PP',
    description: 'Payung hukum penegerian Universitas Diponegoro oleh Pemerintah Republik Indonesia.',
    fullContent: 'Keberhasilan penyelenggaraan Universitas Semarang menarik perhatian Pemerintah Pusat. Pada upacara Dies Natalis ke-3 tanggal 9 Januari 1960, Presiden Republik Indonesia Ir. Soekarno menyatakan penghargaan setinggi-tingginya dan mengubah nama universitas menjadi UNIVERSITAS DIPONEGORO.\n\nPenegerian secara resmi dikukuhkan melalui Peraturan Pemerintah No. 7 Tahun 1961 tertanggal 15 Oktober 1960 yang mulai berlaku 15 Oktober 1957 (ditetapkan sebagai tanggal Dies Natalis resmi Undip). Surat keputusan ini menandai babak baru Undip sebagai PTN kebanggaan Indonesia.',
    highlights: [
      'PP No. 7 Tahun 1961 tentang Penegerian Universitas Diponegoro',
      '15 Oktober 1957 ditetapkan sebagai tanggal Dies Natalis',
      'Ditandatangani oleh Presiden RI Sukarno dan Menteri PP&K Prof. Dr. Prijono',
    ],
    orientation: 'portrait',
    size: 'medium',
  },

  // 7. Salinan Lembaran Negara 1961
  {
    id: 'decree-lembaran-negara',
    title: 'Salinan Lembaran Berita Negara Penegerian Undip',
    category: 'decree',
    period: 'Tahun 1961',
    shortLabel: 'Lembaran Negara 1961',
    description: 'Publikasi resmi Lembaran Negara RI No. 21 Tahun 1961 tentang pendirian universitas negeri di Semarang.',
    fullContent: 'Lembaran Negara ini mengesahkan pengalihan seluruh aset, fakultas, dan tenaga pengajar Yayasan Universitas Semarang menjadi Perguruan Tinggi Negeri di bawah naungan Departemen Perguruan Tinggi dan Ilmu Pengetahuan (PTIP).',
    highlights: [
      'Lembaran Negara RI Nomor 21 Tahun 1961',
      'Kepastian status hukum sebagai Perguruan Tinggi Negeri',
      'Hak dan kewenangan penuh menyelenggarakan gelar kesarjanaan',
    ],
    orientation: 'portrait',
    size: 'small',
  },

  // 8. Naskah Pidato Presiden Soekarno 1960
  {
    id: 'archives-soekarno-1960',
    title: 'Arsip Pidato Presiden Soekarno (9 Jan 1960)',
    category: 'archive',
    period: '9 Januari 1960',
    shortLabel: 'Pidato Bung Karno',
    description: 'Naskah bersejarah penganugerahan nama agung Pangeran Diponegoro sebagai identitas abadi kampus.',
    fullContent: 'Dalam amanatnya pada 9 Januari 1960 di hadapan para sivitas akademika di Semarang, Bung Karno berpesan:\n\n"Semoga Universitas Diponegoro mendjadi benteng pelopor revolusi bangsa, meneladani api djiwa kepahlawanan Pangeran Diponegoro jang berani, djudjur, dan membela rakjat ketjil!"\n\nNaskah arsip ini tersimpan sebagai salah satu pusaka dokumenter paling berharga di Museum Undip.',
    highlights: [
      'Pemberian nama Pangeran Diponegoro sebagai simbol patriotisme',
      'Amanat karakter pejuang kebenaran dan kemandirian bangsa',
      'Tersimpan dalam lembaran arsip kepresidenan dan universitas',
    ],
    orientation: 'landscape',
    size: 'large',
  },

  // 9. Foto Kunjungan Bung Karno di Semarang
  {
    id: 'early-photo-soekarno-visit',
    title: 'Dokumentasi Kunjungan Bung Karno di Dies Natalis III',
    category: 'campus-photo',
    period: '9 Januari 1960',
    shortLabel: 'Kunjungan Presiden 1960',
    description: 'Foto Presiden Sukarno didampingi Mr. Soedarto dan pimpinan universitas saat meresmikan nama Universitas Diponegoro.',
    fullContent: 'Momen monumental ketika Bung Karno disambut ribuan mahasiswa dan warga Semarang di auditorium, memancarkan kehangatan dan kebanggaan atas lahirnya universitas negeri di jantung Jawa Tengah.',
    highlights: [
      'Dihadiri puluhan ribu sivitas akademika dan masyarakat',
      'Penyematan nama Pangeran Diponegoro secara aklamasi',
      'Titik tolak pengakuan nasional atas mutu pendidikan Semarang',
    ],
    orientation: 'landscape',
    size: 'medium',
  },

  // 10. Foto Kampus Pleburan & Gedung Rektorat Lama
  {
    id: 'early-campus-pleburan',
    title: 'Foto Kampus Pleburan & Gedung Rektorat (1960–1975)',
    category: 'campus-photo',
    period: '1960–1975',
    shortLabel: 'Kampus Pleburan Lama',
    description: 'Gedung Rektorat lama dan Auditorium di Jalan Imam Bardjo Pleburan Semarang.',
    fullContent: 'Kawasan Pleburan berkembang pesat menjadi pusat aktivitas mahasiswa pada era 1960 hingga 1980-an. Dengan deretan pohon rindang di Jalan Imam Bardjo, kompleks ini menaungi Fakultas Hukum, Ekonomi, dan Pascasarjana.',
    highlights: [
      'Gedung Rektorat Pleburan di Jl. Imam Bardjo',
      'Pusat kegiatan Dies Natalis dan wisuda era 1970-an',
      'Kini menjadi kampus program pascasarjana dan riset',
    ],
    orientation: 'landscape',
    size: 'medium',
  },

  // 11. Masterplan Kampus Tembalang
  {
    id: 'history-masterplan-tembalang',
    title: 'Masterplan & Pembangunan Kampus Tembalang (1980–1990)',
    category: 'history',
    period: '1980–1990-an',
    shortLabel: 'Masterplan Tembalang',
    description: 'Peta cetak biru pembebasan lahan 180 hektar dan perintisan Kampus Terpadu Tembalang.',
    fullContent: 'Dibawah kepemimpinan Rektor Prof. Dr. dr. R. Moeljono S. Trastotenojo dan para penerusnya, Undip memulai megaproyek pemindahan kampus ke perbukitan Tembalang. Masterplan ini mengintegrasikan fungsi akademis, riset, konservasi hutan kampus, dan danau buatan.',
    highlights: [
      'Pembebasan lahan perbukitan Tembalang seluas 180+ hektar',
      'Konsep Eco-Campus terpadu ramah lingkungan',
      'Pembangunan Gedung Widya Puraya dan danau penampung air',
    ],
    orientation: 'portrait',
    size: 'medium',
  },

  // 12. Linimasa Transformasi Menuju PTN-BH
  {
    id: 'history-transformation',
    title: 'Transformasi Menuju PTN-BH & World Class University',
    category: 'history',
    period: '2015–Sekarang',
    shortLabel: 'Transformasi PTN-BH',
    description: 'Perjalanan panjang penetapan status Perguruan Tinggi Negeri Berbadan Hukum berdasarkan PP No. 52/2015.',
    fullContent: 'Pada tahun 2015, Pemerintah Republik Indonesia menetapkan Universitas Diponegoro sebagai PTN-BH. Dengan otonomi akademik dan finansial penuh, Undip kini melesat maju dalam pemeringkatan QS World University Rankings, menghasilkan riset-riset inovatif yang berdampak global.',
    highlights: [
      'PP No. 52 Tahun 2015 tentang Statuta PTN-BH Undip',
      'Peringkat teratas lulusan tercepat mendapat kerja (Employability)',
      '11 Fakultas, 2 Sekolah, dan 60.000+ mahasiswa aktif',
    ],
    orientation: 'landscape',
    size: 'large',
  },

  // --- 5 FOTO TOKOH PERINTIS & PENDIRI AWAL YAYASAN 1956 ---
  // (Prakarsa Awal Berdirinya Universitas Semarang sebelum penegerian)
  {
    id: 'pioneer-dr-soemardi',
    title: 'dr. R. Soemardi (Perintis Yayasan & Layanan Medis)',
    category: 'archive',
    period: 'Perintis 1956',
    shortLabel: 'Tokoh Perintis Medis',
    description: 'Dokter senior perintis yang memprakarsai keterlibatan tenaga medis dalam pembentukan yayasan universitas.',
    fullContent: 'dr. R. Soemardi bersama para dokter di Rumah Sakit Semarang menggalang dukungan bagi pembentukan perguruan tinggi lokal untuk melahirkan tenaga medis dan hukum yang mandiri bagi rakyat Jawa Tengah.',
    highlights: [
      'Anggota Dewan Kurator Awal Yayasan 1956',
      'Penyedia sarana laboratorium rintisan awal',
      'Pelopor jejaring rumah sakit pendidikan di Semarang',
    ],
    orientation: 'portrait',
    size: 'small',
  },
  {
    id: 'pioneer-prof-sunario',
    title: 'Prof. Mr. Sunario (Perintis Kuliah Umum Perdana)',
    category: 'archive',
    period: 'Perintis 1956–1957',
    shortLabel: 'Perintis Kuliah Umum',
    description: 'Tokoh Sumpah Pemuda 1928 yang memberikan orasi ilmiah pertama pada pembukaan kuliah 1957.',
    fullContent: 'Prof. Mr. Sunario memompa semangat kebangsaan ratusan pemuda saat peresmian universitas di Gedung Panti Budaya. Dedikasinya memastikan standar mutu akademik Fakultas Hukum sejajar dengan universitas di kota besar lainnya.',
    highlights: [
      'Pemberi kuliah umum perdana 9 Januari 1957',
      'Mantan Menteri Luar Negeri dan diplomat ulung',
      'Peletak dasar kurikulum hukum internasional Undip',
    ],
    orientation: 'portrait',
    size: 'small',
  },
  {
    id: 'pioneer-ir-goenoeng',
    title: 'Ir. Goenoeng Prodjodiningrat (Perintis Teknik)',
    category: 'archive',
    period: 'Perintis 1956',
    shortLabel: 'Perintis Keteknikan',
    description: 'Insinyur senior yang merumuskan pentingnya fakultas keteknikan dalam yayasan perguruan tinggi Semarang.',
    fullContent: 'Ir. Goenoeng Prodjodiningrat mendorong bahwa Semarang sebagai kota pelabuhan dan industri membutuhkan insinyur-insinyur handal. Pemikirannya menjadi fondasi pendirian Fakultas Teknik Undip yang kini tersohor.',
    highlights: [
      'Perumus arah pendidikan teknik Jawa Tengah',
      'Penggagas sarana bengkel kerja mahasiswa awal',
      'Anggota badan penasihat teknis yayasan 1956',
    ],
    orientation: 'portrait',
    size: 'small',
  },
  {
    id: 'pioneer-mr-ali-boediardjo',
    title: 'Mr. Ali Boediardjo (Intelektual Administrasi Negara)',
    category: 'archive',
    period: 'Perintis 1956',
    shortLabel: 'Perintis Tata Kelola',
    description: 'Cendekiawan hukum dan birokrat senior pendukung pembentukan Akademi Administrasi Negara.',
    fullContent: 'Mr. Ali Boediardjo menyumbangkan pemikiran strategis mengenai tata pamong dan administrasi modern. Bersama Mr. Goenawan, beliau merancang sistem pendidikan birokrasi profesional yang menjadi cikal bakal FISIP Undip.',
    highlights: [
      'Konseptor tata kelola kelembagaan universitas',
      'Penggerak dukungan aparatur pemerintah daerah',
      'Pelindung mahasiswa angkatan perintis 1957',
    ],
    orientation: 'portrait',
    size: 'small',
  },
  {
    id: 'pioneer-r-soenarto',
    title: 'R. Soenarto (Ketua Dewan Pertimbangan Yayasan 1956)',
    category: 'archive',
    period: 'Perintis 1956',
    shortLabel: 'Ketua Dewan Pertimbangan',
    description: 'Tokoh senior pamong praja yang memimpin Dewan Pertimbangan Yayasan Universitas Semarang pertama.',
    fullContent: 'R. Soenarto memimpin rapat-rapat pertimbangan strategis pembentukan universitas pada November–Desember 1956. Beliau menjembatani komunikasi antara para praktisi hukum swasta dan otoritas pemerintah provinsi.',
    highlights: [
      'Ketua Dewan Pertimbangan Yayasan pertama 1956',
      'Penasihat utama Presiden Universitas Mr. Imam Bardjo',
      'Penyelaras aspirasi masyarakat Jawa Tengah',
    ],
    orientation: 'portrait',
    size: 'small',
  },
]
