import ekoImg from '../../../assets/eko.webp'
import imamImg from '../../../assets/imam.webp'
import jacubImg from '../../../assets/jacub.webp'
import johanImg from '../../../assets/johan.webp'
import mochtarImg from '../../../assets/mochtar.webp'
import moeljonoImg from '../../../assets/moeljono.webp'
import muladiImg from '../../../assets/muladi.webp'
import sudartoImg from '../../../assets/sudarto.webp'
import sudhartoImg from '../../../assets/sudharto.webp'
import suharmonoImg from '../../../assets/suharmono.webp'
import sunarioImg from '../../../assets/sunario.webp'
import suroyoImg from '../../../assets/suroyo.webp'
import susiloImg from '../../../assets/susilo.webp'

export interface Founder {
  id: string
  name: string
  title: string
  years: string
  tenure?: string
  role: string
  description: string
  quote?: string
  imagePath?: string
  category?: 'pendiri-utama' | 'rektorat'
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
  orientation?: 'landscape' | 'portrait' | 'square'
  size?: 'large' | 'medium' | 'small'
}

/**
 * 5 TOKOH PENDIRI UTAMA UNIVERSITAS DIPONEGORO
 * (Pancamitra Pendiri Yayasan Universitas Semarang 1956)
 */
export const UNDIP_FOUNDERS_5: Founder[] = [
  {
    id: 'mr-soedarto',
    name: 'Mr. Sudarto',
    title: 'Ketua Yayasan Universitas Semarang dan Rektor Undip',
    years: '1913–1986',
    tenure: '1956–1962',
    role: 'Ketua pertama Yayasan Universitas Semarang (1956) yang merangkap sebagai Rektor sejak 1958 serta peletak dasar utama penegerian Undip.',
    description: 'Mr. Sudarto (1913–1986) adalah tokoh sentral di balik pendirian Yayasan Universitas Semarang pada tanggal 21 Desember 1956. Sejak tahun 1958, karena kepindahan Imam Bardjo, S.H. ke Jakarta, beliau merangkap sebagai pimpinan universitas dan bersama pimpinan Daerah Provinsi Jawa Tengah memperjuangkan penegerian Universitas Diponegoro.',
    quote: 'Pendidikan tinggi adalah jembatan emas pembangun karakter bangsa yang berdaulat.',
    imagePath: sudartoImg,
    category: 'pendiri-utama',
  },
  {
    id: 'mr-imam-bardjo',
    name: 'Mr. Imam Bardjo, S.H.',
    title: 'Rektor Pertama Universitas Semarang',
    years: '1902–1959',
    tenure: '1957–1958',
    role: 'Ketua Pengadilan Tinggi Jawa Tengah dan Rektor Pertama Universitas Semarang yang meresmikan perkuliahan perdana pada tahun 1957.',
    description: 'Mr. Imam Bardjo (1902–1959) memimpin universitas pada masa perintisan yang penuh keterbatasan. Dengan wibawa kepemimpinannya, beliau menyatukan para akademisi dan praktisi hukum hingga meresmikan perkuliahan perdana pada tahun 1957 sebelum berpindah tugas ke Jakarta pada tahun 1958.',
    quote: 'Bermula dari cita-cita luhur di Kota Semarang untuk mencerdaskan generasi penerus bangsa.',
    imagePath: imamImg,
    category: 'pendiri-utama',
  },
  {
    id: 'mr-goenawan-goetomo',
    name: 'Mr. Goenawan Goetomo',
    title: 'Pembantu II Yayasan dan Dekan Pertama Akademi Administrasi Negara',
    years: '1915–1992',
    tenure: '1956–1961',
    role: 'Pengurus pertama Yayasan Universitas Semarang dan pelopor pendidikan administrasi serta tata kelola pemerintahan di Jawa Tengah.',
    description: 'Mr. Goenawan Goetomo (1915–1992) berperan sebagai pengurus yayasan sekaligus dekan pertama yang meletakkan fondasi kurikulum administrasi negara, yang kelak digabungkan dengan Fakultas Hukum serta berkembang menjadi Fakultas Ilmu Sosial dan Ilmu Politik (FISIP).',
    category: 'pendiri-utama',
  },
  {
    id: 'mr-tan-tjing-hak',
    name: 'Mr. Tan Tjing Hak',
    title: 'Pembantu II Yayasan dan Cendekiawan Hukum',
    years: '1912–1985',
    tenure: '1956–1961',
    role: 'Pengurus pertama Yayasan Universitas Semarang dan praktisi hukum yang mewujudkan semangat inklusivitas dalam pendirian Undip.',
    description: 'Kehadiran Mr. Tan Tjing Hak (1912–1985) dalam jajaran pengurus pertama yayasan mencerminkan bahwa sejak awal kelahirannya, Universitas Diponegoro terbuka bagi seluruh golongan masyarakat demi kemajuan ilmu pengetahuan.',
    category: 'pendiri-utama',
  },
  {
    id: 'dr-heyder-bin-heyder',
    name: 'dr. Heyder bin Heyder',
    title: 'Direktur Rumah Sakit Semarang dan Perintis Kedokteran',
    years: '1909–1982',
    tenure: '1956–1961',
    role: 'Memprakarsai pendirian Fakultas Kedokteran Undip melalui kerja sama dengan Rumah Sakit Umum Pusat Dr. Kariadi pada tahun 1961.',
    description: 'Dedikasi dr. Heyder bin Heyder (1909–1982) membawa dunia medis Semarang menjadi pusat pendidikan dokter yang berdedikasi tinggi bagi masyarakat Jawa Tengah.',
    category: 'pendiri-utama',
  },
]

/**
 * 13 TOKOH REKTORAT UNIVERSITAS DIPONEGORO
 * (Jajaran Rektor dan Pimpinan Lembaga dari Masa ke Masa)
 */
export const UNDIP_LEADERSHIP_13: Founder[] = [
  {
    id: 'prof-mr-imam-bardjo',
    name: 'Mr. Imam Bardjo, S.H.',
    title: 'Rektor Pertama Universitas Semarang',
    years: '1902–1959',
    tenure: '1957–1958',
    role: 'Ketua Pengadilan Tinggi Jawa Tengah dan Rektor Pertama yang meresmikan perkuliahan perdana pada tahun 1957.',
    description: 'Mr. Imam Bardjo (1902–1959) memimpin universitas pada masa perintisan Yayasan Universitas Semarang hingga beralih kepemimpinan pada tahun 1958 saat beliau berpindah tugas ke Jakarta.',
    quote: 'Bermula dari cita-cita luhur di Kota Semarang untuk mencerdaskan generasi penerus bangsa.',
    imagePath: imamImg,
    category: 'rektorat',
  },
  {
    id: 'prof-soedarto',
    name: 'Prof. Mr. Soedarto, S.H.',
    title: 'Rektor Undip',
    years: '1913–1986',
    tenure: '1958–1962 dan 1977–1986',
    role: 'Peletak dasar akademik utama, pengawal penegerian universitas, serta perumus Pola Ilmiah Pokok Bina Kelautan.',
    description: 'Prof. Mr. Soedarto, S.H. (1913–1986) adalah Ketua Yayasan yang merangkap pimpinan universitas sejak 1958 dan kemudian menjabat sebagai Rektor. Beliau meletakkan fondasi keilmuan, kelembagaan hukum, dan integritas Tri Dharma Perguruan Tinggi di Universitas Diponegoro.',
    quote: 'Pendidikan tinggi adalah jembatan emas pembangun karakter bangsa yang berdaulat.',
    imagePath: sudartoImg,
    category: 'rektorat',
  },
  {
    id: 'prof-jakub-rais',
    name: 'Prof. Dr. Ir. Jakub Rais, M.Sc.',
    title: 'Caretaker Rektor Undip • Tokoh Geodesi Nasional',
    years: '1928–2020',
    tenure: '1965–1966',
    role: 'Perintis Fakultas Teknik Undip dan Kepala Badan Koordinasi Survei dan Pemetaan Nasional (Bakosurtanal).',
    description: 'Prof. Dr. Ir. Jakub Rais, M.Sc. (1928–2020) menjabat sebagai Caretaker Rektor pada masa transisi tahun 1965–1966 serta menjadi salah satu perintis utama pendidikan tinggi teknik dan ilmu geodesi di Jawa Tengah.',
    quote: 'Ketepatan pengukuran dan keteguhan integritas adalah fondasi pembangunan bangsa.',
    imagePath: jacubImg,
    category: 'rektorat',
  },
  {
    id: 'gubernur-mochtar',
    name: 'Mochtar',
    title: 'Gubernur Jawa Tengah • Dewan Pembina Undip',
    years: '1909–1985',
    tenure: '1960–1966',
    role: 'Pengawal penegerian Universitas Diponegoro menjadi Universitas Negeri pada 15 Oktober 1960 berdasarkan Peraturan Pemerintah Nomor 7 Tahun 1961.',
    description: 'Sebagai Gubernur Jawa Tengah dan Ketua Presidium Pelindung Universitas Diponegoro (1909–1985) pada masa krusial penegerian, beliau memberikan dukungan penuh bagi penyediaan sarana, fasilitas perkuliahan, dan dukungan pemerintah daerah.',
    quote: 'Kemajuan daerah Jawa Tengah bertumpu pada keunggulan intelektual generasi mudanya.',
    imagePath: mochtarImg,
    category: 'rektorat',
  },
  {
    id: 'prof-mr-sunario',
    name: 'Prof. Mr. Sunario Sastrowardoyo',
    title: 'Rektor Undip • Tokoh Sumpah Pemuda 1928',
    years: '1902–1997',
    tenure: '1973–1977',
    role: 'Tokoh Sumpah Pemuda 1928, mantan Menteri Luar Negeri Republik Indonesia, dan Rektor pemantap kurikulum hukum kebangsaan.',
    description: 'Prof. Mr. Sunario Sastrowardoyo (1902–1997) membawa reputasi diplomatik internasional ke dalam kepemimpinan akademik Universitas Diponegoro serta memperkuat kerja sama kelembagaan dan pendidikan hukum nasional berlandaskan Pancasila.',
    quote: 'Satu nusa, satu bangsa, satu bahasa: persatuan intelektual adalah kekuatan Indonesia.',
    imagePath: sunarioImg,
    category: 'rektorat',
  },
  {
    id: 'prof-suroyo',
    name: 'Prof. Dr. dr. A. Suroyo',
    title: 'Rektor Undip • Pemantap Keilmuan dan Biomedis',
    years: '1927–2005',
    tenure: '1966–1973',
    role: 'Meletakkan dasar riset biomedis serta penguatan kurikulum kedokteran berbasis kebutuhan masyarakat.',
    description: 'Prof. Dr. dr. A. Suroyo (1927–2005) menjabat pada periode 1966–1973, memperkuat reputasi akademik Fakultas Kedokteran, dan memperluas hubungan kerja sama dengan institusi pendidikan tinggi serta rumah sakit rujukan di dalam dan luar negeri.',
    quote: 'Pengabdian ilmu kedokteran adalah keikhlasan melayani kemanusiaan.',
    imagePath: suroyoImg,
    category: 'rektorat',
  },
  {
    id: 'prof-moeljono',
    name: 'Prof. Dr. dr. R. Moeljono S. Trastotenojo',
    title: 'Rektor Undip • Pelopor Kampus Terpadu Tembalang',
    years: '1931–2007',
    tenure: '1986–1994',
    role: 'Rektor visioner yang menginisiasi pembangunan kampus terpadu Tembalang seluas 212 hektare dan kampus kelautan Teluk Awur, Jepara.',
    description: 'Di bawah kepemimpinan Prof. Dr. dr. R. Moeljono S. Trastotenojo (1931–2007), pengembangan kampus Universitas Diponegoro di kawasan Tembalang seluas 212 hektare melalui program Six Universities Development and Rehabilitation Programme dan Marine Science di Teluk Awur terealisasi.',
    quote: 'Membangun kampus bukan sekadar menata batu bata, melainkan membangun peradaban.',
    imagePath: moeljonoImg,
    category: 'rektorat',
  },
  {
    id: 'prof-muladi',
    name: 'Prof. Dr. Muladi, S.H.',
    title: 'Rektor Undip • Menteri Kehakiman Republik Indonesia',
    years: '1943–2020',
    tenure: '1994–1998',
    role: 'Pakar hukum pidana terkemuka, Menteri Kehakiman Republik Indonesia, dan Gubernur Lembaga Ketahanan Nasional.',
    description: 'Prof. Dr. Muladi, S.H. (1943–2020) membawa Universitas Diponegoro menuju panggung nasional dan global serta memprakarsai modernisasi tata kelola universitas. Namanya diabadikan pada Gedung Pertemuan Muladi Dome.',
    quote: 'Hukum harus menjadi panglima yang mengayomi hak asasi dan martabat kemanusiaan.',
    imagePath: muladiImg,
    category: 'rektorat',
  },
  {
    id: 'prof-eko-budihardjo',
    name: 'Prof. Ir. Eko Budihardjo, M.Sc.',
    title: 'Rektor Undip • Rektor Humanis',
    years: '1944–2014',
    tenure: '1998–2006',
    role: 'Tokoh arsitektur nasional, budayawan, dan intelektual publik yang mempopulerkan jati diri Universitas Diponegoro.',
    description: 'Prof. Ir. Eko Budihardjo, M.Sc. (1944–2014) dikenal luas sebagai intelektual yang hangat dan arsitek berwawasan lingkungan. Beliau memimpin kampus pada era reformasi dengan pendekatan kultural dan dialogis.',
    quote: 'Ilmu tanpa nurani dan sentuhan seni akan kehilangan makna kemanusiaannya.',
    imagePath: ekoImg,
    category: 'rektorat',
  },
  {
    id: 'prof-susilo-wibowo',
    name: 'Prof. Dr. dr. Susilo Wibowo, M.S., Sp.And.',
    title: 'Rektor Undip • Penggerak Riset dan RSND',
    years: '1949–2022',
    tenure: '2006–2010',
    role: 'Mendorong pendirian Rumah Sakit Nasional Diponegoro (RSND) dan percepatan riset unggulan.',
    description: 'Prof. Dr. dr. Susilo Wibowo, M.S., Sp.And. (1949–2022) menjadikan Universitas Diponegoro sebagai salah satu universitas riset terkemuka di Indonesia serta memprakarsai berdirinya rumah sakit pendidikan di kawasan Tembalang.',
    quote: 'Riset bermutu tinggi adalah jantung universitas berkelas dunia.',
    imagePath: susiloImg,
    category: 'rektorat',
  },
  {
    id: 'prof-sudharto',
    name: 'Prof. Dr. Sudharto P. Hadi, M.E.S., Ph.D.',
    title: 'Rektor Undip • Pelopor Kampus Hijau dan PTN-BH',
    years: '1954–sekarang',
    tenure: '2010–2014',
    role: 'Membidani status kemandirian Perguruan Tinggi Negeri Berbadan Hukum (PTN-BH) dan mewujudkan kampus berkelanjutan.',
    description: 'Prof. Dr. Sudharto P. Hadi, M.E.S., Ph.D. (lahir 1954) adalah pakar manajemen lingkungan hidup terkemuka Indonesia yang mengantarkan Universitas Diponegoro menuju status Perguruan Tinggi Negeri Berbadan Hukum serta kampus ramah lingkungan berwawasan global.',
    quote: 'Kelestarian alam dan kemajuan ilmu pengetahuan harus senantiasa berjalan beriringan.',
    imagePath: sudhartoImg,
    category: 'rektorat',
  },
  {
    id: 'prof-yos-johan-utama',
    name: 'Prof. Dr. Yos Johan Utama, S.H., M.Hum.',
    title: 'Rektor Undip • Era PTN-BH dan Reputasi Global',
    years: '1962–sekarang',
    tenure: '2015–2024',
    role: 'Membawa Universitas Diponegoro melompat tinggi dalam pemeringkatan internasional QS World University Rankings.',
    description: 'Prof. Dr. Yos Johan Utama, S.H., M.Hum. (lahir 1962) memimpin era PTN-BH Universitas Diponegoro dengan memperkuat hilirisasi riset, modernisasi fasilitas kampus Tembalang termasuk Gedung Muladi Dome, serta peningkatan daya saing lulusan.',
    quote: 'Undip bermartabat, Undip bermanfaat bagi nusa dan bangsa.',
    imagePath: johanImg,
    category: 'rektorat',
  },
  {
    id: 'prof-suharnomo',
    name: 'Prof. Dr. Suharnomo, S.E., M.Si.',
    title: 'Rektor Undip • Undip Bermartabat, Undip Bermanfaat',
    years: '1970–sekarang',
    tenure: '2024–sekarang',
    role: 'Rektor yang mengusung visi kepemimpinan inklusif, riset berdampak, dan kemitraan global.',
    description: 'Prof. Dr. Suharnomo, S.E., M.Si. (lahir 1970) adalah Guru Besar Manajemen Fakultas Ekonomika dan Bisnis Universitas Diponegoro yang memimpin akselerasi digital, transformasi kurikulum masa depan, dan sinergi kampus dengan industri serta masyarakat.',
    quote: 'Perguruan tinggi harus menjadi mercusuar peradaban dan pemberi solusi nyata bagi rakyat.',
    imagePath: suharmonoImg,
    category: 'rektorat',
  },
]

/** Full combined founders list for backward compatibility */
export const UNDIP_FOUNDERS: Founder[] = [...UNDIP_FOUNDERS_5, ...UNDIP_LEADERSHIP_13]

/**
 * Historical exhibits for the History & Archives Wing:
 * Comprehensive dense collection organized for the authentic Masonry gallery wall layout
 * flanking the 3D Miniature Map of Universitas Diponegoro.
 */
export const HISTORY_EXHIBITS: HistoryExhibit[] = [
  // 1. Centerpiece Monumental Art
  {
    id: 'artwork-diponegoro-center',
    title: 'Lukisan Induk: Api Perjuangan Pangeran Diponegoro (1825–1830)',
    category: 'history',
    period: 'Karya Bersejarah',
    shortLabel: 'Lukisan Induk Diponegoro',
    description: 'Karya seni monumental yang merefleksikan keberanian Pangeran Diponegoro sebagai sumber inspirasi nama dan jiwa Universitas Diponegoro.',
    fullContent: 'Pangeran Diponegoro adalah pahlawan nasional yang memimpin Perang Jawa (1825–1830) melawan penindasan kolonialisme. Kepribadian beliau yang jujur, berani, adil, dan membela rakyat kecil menjadi teladan luhur bagi seluruh sivitas akademika Universitas Diponegoro.\n\nLukisan ini menggambarkan sang Pangeran menunggangi kuda putih perkasa di tengah kancah perjuangan, melambangkan kepemimpinan yang pantang menyerah dan berakar kuat pada nilai spiritual bangsa.',
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
    title: 'Akta Pendirian Yayasan Nomor 59 Tahun 1956',
    category: 'archive',
    period: '21 Desember 1956',
    shortLabel: 'Akta Notaris 1956',
    description: 'Lembar autentik Akta Notaris R.M. Soeprapto tanggal 21 Desember 1956 Nomor 59 yang memuat susunan pengurus pertama Yayasan Universitas Semarang.',
    fullContent: 'Dokumen akta autentik bertanggal 21 Desember 1956 Nomor 59 (dimuat dalam Berita Negara tanggal 18 Januari 1957 Nomor 59) ini menjadi landasan hukum berdirinya Yayasan Universitas Semarang.\n\nSusunan pengurus pertama yayasan tersebut terdiri atas Mr. Sudarto (Ketua), Mr. Dan Soelaiman (Wakil Ketua), Mr. Soesanto Kartoatmodjo (Sekretaris), Achmad Tjokrokoesoemo (Bendahara), serta Pembantu II yang meliputi Mr. Imam Bardjo, Mr. Goenawan Goetomo, Mr. Tan Tjing Hak, dan Koo Swan Ik. Adapun Dewan Kurator beranggotakan Hadi Soebeno Sosrowardoyo, Dr. Marzuki, Dr. V. Soedjito, Mr. Abdulmadjid Djojodhiningrat, dan R.M. Soeprapto.',
    highlights: [
      'Akta Notaris R.M. Soeprapto tanggal 21 Desember 1956 Nomor 59',
      'Berita Negara tanggal 18 Januari 1957 Nomor 59',
      'Susunan lengkap pengurus pertama Yayasan Universitas Semarang',
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

  // 4. Foto Gedung Perkuliahan Awal (Wisma Perdamaian & Jalan Pemuda)
  {
    id: 'early-photo-panti-budaya',
    title: 'Foto Bersejarah: Lokasi Perkuliahan Awal di Semarang (1957–1966)',
    category: 'campus-photo',
    period: 'Tahun 1957–1966',
    shortLabel: 'Gedung Kuliah Pertama',
    description: 'Dokumentasi autentik gedung perkuliahan awal Universitas Semarang hingga masa perintisan Fakultas Hukum Universitas Diponegoro.',
    fullContent: 'Untuk menunjang kegiatan operasional perkuliahan, yayasan menerima fasilitas ruangan dan perlengkapan dari pemerintah daerah serta masyarakat. Dalam penyelenggaraan pendidikan awal, Fakultas Hukum Universitas Diponegoro (swasta) pernah menggunakan rumah bekas kediaman Gouverneur van Midden Java (yang pernah menjadi gedung Akademi Pemerintahan Dalam Negeri dan Balai Kota, kini dikenal sebagai Wisma Perdamaian).\n\nPada tahun 1966 atas petunjuk Penguasa Perang Daerah, Fakultas Hukum memperoleh kantor dan ruang kuliah di Jalan MT Haryono Nomor 427, lalu berpindah ke tempat yang lebih luas di Jalan Pemuda Nomor 63.',
    highlights: [
      'Bekas kediaman Gouverneur van Midden Java (Wisma Perdamaian)',
      'Kerja sama erat dengan pemerintah daerah dan masyarakat',
      'Perpindahan ke Jalan MT Haryono Nomor 427 dan Jalan Pemuda Nomor 63 (1966)',
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
    title: 'Peraturan Pemerintah Nomor 7 Tahun 1961 (Penegerian Undip)',
    category: 'decree',
    period: 'Tahun 1960–1961',
    shortLabel: 'PP Penegerian 1961',
    description: 'Payung hukum penegerian Universitas Negeri Diponegoro oleh Pemerintah Republik Indonesia.',
    fullContent: 'Ketua Yayasan Universitas Semarang, Mr. Sudarto—yang sejak tahun 1958 merangkap sebagai Presiden Universitas karena kepindahan Imam Bardjo, S.H. ke Jakarta—bersama pimpinan Daerah Provinsi Jawa Tengah memperjuangkan agar Universitas Diponegoro (swasta) dijadikan universitas negeri. Pada pertengahan tahun 1960, Sudarto, S.H. ditetapkan sebagai pegawai tinggi yang diperbantukan pada Fakultas Hukum.\n\nSetelah ditinjau langsung oleh Kepala Badan Koordinasi Perguruan Tinggi, Prof. Dr. Soegiyono Djoenoet Poesponegoro, universitas ini diresmikan sebagai universitas negeri pada tanggal 15 Oktober 1960 dan dikukuhkan melalui Peraturan Pemerintah Nomor 7 Tahun 1961. Fakultas tertua dijadikan Fakultas Hukum dan Pengetahuan Masyarakat melalui penggabungan dengan Akademi Administrasi Negara.',
    highlights: [
      'Diresmikan sebagai universitas negeri pada 15 Oktober 1960',
      'Peraturan Pemerintah Nomor 7 Tahun 1961 tentang Penegerian Undip',
      'Penggabungan Fakultas Hukum dan Akademi Administrasi Negara',
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
    title: 'Arsip Pidato Presiden Soekarno (9 Januari 1960)',
    category: 'archive',
    period: '9 Januari 1960',
    shortLabel: 'Pidato Presiden Soekarno',
    description: 'Naskah bersejarah penganugerahan nama Universitas Diponegoro pada peringatan Dies Natalis ke-3.',
    fullContent: 'Pada kesempatan peringatan Dies Natalis ke-3 Universitas Semarang tanggal 9 Januari 1960, Presiden Republik Indonesia Ir. Soekarno berkenan menganugerahkan nama baru bagi Universitas Semarang, yaitu Universitas Diponegoro (yang saat itu masih berstatus universitas swasta).\n\nNaskah arsip amanat kepresidenan ini tersimpan sebagai salah satu pusaka dokumenter terpenting yang menjiwai semangat perjuangan sivitas akademika.',
    highlights: [
      'Penganugerahan nama Universitas Diponegoro pada 9 Januari 1960',
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
    title: 'Foto Kampus Pleburan & Gedung Rektorat (1969–1985)',
    category: 'campus-photo',
    period: '1969–1985',
    shortLabel: 'Kampus Pleburan Lama',
    description: 'Kompleks kampus Pleburan di Jalan Imam Bardjo, S.H. Nomor 1, Semarang yang menjadi pusat kegiatan akademik sejak tahun 1969.',
    fullContent: 'Pada tahun 1969, Fakultas Hukum beserta pusat kegiatan universitas berpindah ke kompleks Pleburan di Jalan Imam Bardjo, S.H. Nomor 1, Semarang. Kawasan ini berkembang pesat menjadi pusat aktivitas akademik, Dies Natalis, dan wisuda pada era 1970 hingga 1980-an.\n\nDengan deretan pohon rindang di sepanjang Jalan Imam Bardjo, kompleks Pleburan hingga kini tetap menjadi bagian bersejarah bagi program pascasarjana dan pusat kegiatan Universitas Diponegoro.',
    highlights: [
      'Kompleks Pleburan di Jalan Imam Bardjo, S.H. Nomor 1, Semarang (1969)',
      'Pusat kegiatan Dies Natalis dan wisuda era 1970-an',
      'Kini menjadi kawasan program pascasarjana dan riset',
    ],
    orientation: 'landscape',
    size: 'medium',
  },

  // 11. Masterplan Kampus Tembalang
  {
    id: 'history-masterplan-tembalang',
    title: 'Masterplan & Pembangunan Kampus Tembalang (1985–1990)',
    category: 'history',
    period: '1985–1990-an',
    shortLabel: 'Masterplan Tembalang',
    description: 'Cetak biru pembangunan kampus terpadu Tembalang di atas lahan seluas 212 hektare serta kampus kelautan di Teluk Awur, Jepara.',
    fullContent: 'Di bawah kepemimpinan rektor dan dukungan Departemen Pendidikan dan Kebudayaan, Universitas Diponegoro mengikuti program Six Universities Development and Rehabilitation Programme (1985) yang menghasilkan kampus baru Tembalang di atas tanah seluas 212 hektare dengan dukungan Pemerintah Daerah Kotamadya Semarang.\n\nSelain itu, keikutsertaan dalam Marine Science Education Project (1987) melahirkan kampus ilmu kelautan di Teluk Awur, Jepara.',
    highlights: [
      'Lahan Kampus Tembalang seluas 212 hektare (program SUDR 1985)',
      'Dukungan penyediaan lahan oleh Pemerintah Daerah Kotamadya Semarang',
      'Pembangunan kampus Marine Science di Teluk Awur, Jepara (1987)',
    ],
    orientation: 'portrait',
    size: 'medium',
  },

  // 12. Peletakan Batu Pertama Tembalang 1987 (NEW)
  {
    id: 'history-groundbreaking-tembalang',
    title: 'Foto Peletakan Batu Pertama Kampus Tembalang (1987)',
    category: 'campus-photo',
    period: 'Tahun 1987',
    shortLabel: 'Batu Pertama Tembalang',
    description: 'Upacara bersejarah peletakan batu pertama pengembangan Kampus Terpadu Tembalang.',
    fullContent: 'Dokumentasi penting saat pimpinan rektorat, menteri pendidikan, dan sesepuh universitas secara simbolis meletakkan batu pertama di puncak bukit Tembalang, menandai era transisi fisik modern universitas.',
    highlights: [
      'Titik awal pembangunan kampus terpadu Tembalang',
      'Dihadiri perwakilan Bank Dunia dan pemerintah pusat',
      'Menjadi cikal bakal berdirinya kompleks fakultas modern',
    ],
    orientation: 'landscape',
    size: 'medium',
  },

  // 13. Pembangunan Widya Puraya & Rektorat (1993) (NEW)
  {
    id: 'history-widya-puraya',
    title: 'Foto Pembangunan Menara Rektorat Widya Puraya (1993)',
    category: 'campus-photo',
    period: 'Tahun 1993',
    shortLabel: 'Pembangunan Widya Puraya',
    description: 'Pembangunan gedung ikonik Widya Puraya dengan menara jam khas yang menjadi simbol kampus Tembalang.',
    fullContent: 'Gedung Widya Puraya dirancang sebagai jantung administratif dan seremonial kampus Tembalang. Foto ini merekam tahap penyelesaian atap limas emas dan menara jam yang gagah menjulang.',
    highlights: [
      'Landmark sentral kawasan Kampus Tembalang',
      'Lokasi lapangan upacara dan penerimaan mahasiswa baru',
      'Pusat layanan administrasi akademik terpadu',
    ],
    orientation: 'portrait',
    size: 'medium',
  },

  // 14. Gedung Muladi Dome (NEW)
  {
    id: 'history-muladi-dome',
    title: 'Gedung Muladi Dome: Mahakarya Convention & Expo Hall',
    category: 'history',
    period: '2024–Modern',
    shortLabel: 'Gedung Muladi Dome',
    description: 'Arsitektur mahakarya dome berteknologi tinggi untuk konferensi internasional, wisuda akbar, dan expo riset.',
    fullContent: 'Gedung Muladi Dome dinamai untuk menghormati jasa Prof. Dr. Muladi, S.H., mantan Rektor Undip dan Menteri Kehakiman RI. Gedung berkapasitas ribuan orang dengan kubah champagne gold megah ini merupakan salah satu convention hall universitas terbesar dan termodern di Asia Tenggara.',
    highlights: [
      'Pusat utama maket kampus dan kegiatan internasional Undip',
      'Kapasitas 4.000+ delegasi dengan teknologi akustik mutakhir',
      'Ikon kebanggaan baru arsitektur modern Jawa Tengah',
    ],
    orientation: 'landscape',
    size: 'large',
  },

  // 15. Rumah Sakit Nasional Diponegoro (RSND) (NEW)
  {
    id: 'history-rsnd',
    title: 'Rumah Sakit Nasional Diponegoro (RSND) & FK Tembalang',
    category: 'campus-photo',
    period: '2014–Modern',
    shortLabel: 'RSND & Kedokteran',
    description: 'Pusat layanan kesehatan modern, riset klinis, dan rumah sakit pendidikan utama mahasiswa kedokteran.',
    fullContent: 'RSND berdiri megah di kawasan timur Tembalang sebagai bukti komitmen Undip dalam memberikan pelayanan kesehatan terbaik kepada masyarakat serta wadah riset medis translational bertaraf internasional.',
    highlights: [
      'Rumah Sakit Pendidikan Utama Tipe B terakreditasi paripurna',
      'Pusat keunggulan riset onkologi, kardiovaskular, dan rehabilitasi',
      'Mendukung tridharma perguruan tinggi bidang kesehatan',
    ],
    orientation: 'landscape',
    size: 'medium',
  },

  // 16. Waduk Undip & Konservasi Hijau (NEW)
  {
    id: 'history-waduk-undip',
    title: 'Waduk Pendidikan Undip & Sabuk Hijau Konservasi',
    category: 'campus-photo',
    period: '2016–Sekarang',
    shortLabel: 'Waduk & Eco-Campus',
    description: 'Danau retensi air, laboratorium alam perikanan, dan kawasan konservasi biodiversitas kampus.',
    fullContent: 'Waduk Undip berfungsi ganda sebagai pengendali hidrologi perbukitan Tembalang sekaligus sarana olahraga dayung dan rekreasi edukatif. Dilengkapi jembatan ikonik dan arboretum pepohonan langka.',
    highlights: [
      'Kapasitas tampung air jutaan meter kubik pengendali banjir',
      'Pusat pengamatan burung dan keanekaragaman hayati',
      'Mendukung pemeringkatan UI GreenMetric World University',
    ],
    orientation: 'landscape',
    size: 'small',
  },

  // 17. Wisuda Perdana di Pleburan (NEW)
  {
    id: 'history-wisuda-perdana',
    title: 'Foto Wisuda Sarjana Perdana Universitas Diponegoro (1962)',
    category: 'campus-photo',
    period: 'Tahun 1962',
    shortLabel: 'Wisuda Perdana 1962',
    description: 'Prosesi khidmat pelantikan sarjana angkatan pertama berstatus universitas negeri.',
    fullContent: 'Potret langka saat Rektor pertama Undip memindahkan kuncir toga wisudawan pertama lulusan Fakultas Hukum dan Ekonomi. Kebanggaan terpancar dari para wisudawan yang kelak menjadi perintis pembangunan nasional.',
    highlights: [
      'Pelantikan sarjana negeri angkatan pertama di Semarang',
      'Tradisi toga hitam dan samir biru navy Undip',
      'Meluluskan para tokoh hukum, diplomat, dan ekonom bangsa',
    ],
    orientation: 'portrait',
    size: 'medium',
  },

  // 18. Transformasi Menuju PTN-BH
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
]
