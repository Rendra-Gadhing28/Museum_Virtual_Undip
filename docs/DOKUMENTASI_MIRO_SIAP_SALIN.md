# DOKUMENTASI MIRO SIAP SALIN (TEMPLAT SESUAI PAPAN MIRO)
Museum Virtual Universitas Diponegoro (Versi 1.0.0)

---

# [DOKUMEN KARTU 4: Changelog & Keputusan - v1.0.0]
*(Salin seluruh isi di bawah ini ke kartu dokumen "Changelog & Keputusan - v1.0.0" di Miro)*

# Changelog & Keputusan - v1.0.0
*Jejak historis perubahan dan alasan di balik keputusan desain*

---

## 1. Decision Log
*Catatan keputusan arsitektural, tantangan teknis yang dihadapi, dan solusi pemecahan masalahnya (problem solving).*

| 🔖 Decision | ≡ Problems | ≡ Rationales | 📅 Date |
| :--- | :--- | :--- | :--- |
| **Standarisasi Mesin Grafis pada React Three Fiber (Three.js)** | Mencampurkan Three.js dan Babylon.js menyebabkan pembengkakan ukuran bundel aplikasi (>10 MB), duplikasi rendering loop, dan potensi konflik WebGL context. | Memangkas ukuran berkas hingga ~5 MB, memanfaatkan kematangan ekosistem @react-three/drei untuk kamera dan loader, serta memudahkan manajemen status deklaratif di React 19. | 26 Nov 2026 |
| **Penerapan Mesin Fisika Rapier (@react-three/rapier)** | Karakter avatar orang ketiga memerlukan simulasi tabrakan dinding (collision) yang presisi tanpa menembus dinding (wall-clipping) dan tanpa membebani CPU. | Komputasi fisika Rapier dikompilasi ke WebAssembly (WASM) yang berjalan mendekati kecepatan kode asli (native speed) sehingga peramban stabil pada 60 FPS. | 26 Nov 2026 |
| **Pemuatan Ruangan Dinamis (Dynamic Room Loading)** | Memuat seluruh 5 ruangan sub-bab diorama sekaligus ke dalam memori kanvas 3D memicu kebocoran memori kartu grafis (GPU VRAM leak) dan browser crash. | Hanya me-mount 1 ruangan sub-bab aktif saat portal dimasuki, sementara ruangan lain di-unmount dan dibersihkan dari VRAM menggunakan fungsi dispose(). | 26 Nov 2026 |
| **Penanganan Waktu Muat (Loading) Aset 3D yang Lama** | Berkas 3D mentah dan tekstur resolusi tinggi berukuran puluhan megabita memakan kuota, waktu tunggu >15 detik, dan memblokir browser saat diparsing. | Menerapkan kompresi geometri Draco & Meshopt (hemat ukuran 70-90%), tekstur GPU KTX2/Basis Universal (hemat VRAM 75%), serta CentralAssetManager dengan antrean prioritas. | 26 Nov 2026 |
| **Eliminasi Jeda Render / Layar Membeku (Shader Compilation Jank)** | WebGL mengompilasi shader secara sinkron saat objek baru pertama kali masuk ke sudut pandang kamera, menyebabkan layar membeku (freeze) selama 0,5–1,5 detik. | Menjalankan pemanasan awal shader (Shader Warmup via gl.compile & useGLTF.preload) di latar belakang saat Splash Gate aktif, serta menggabungkan draw calls dengan InstancedMesh. | 26 Nov 2026 |
| **Proteksi Peladen (Server) Konvensional Agar Tidak Jebol** | Lonjakan ribuan mahasiswa mengakses bersamaan dapat menenggelamkan bandwidth peladen kampus Undip dan menghabiskan soket I/O (HTTP 502/504 Down). | Mengaktifkan penyimpanan lokal persisten via IndexedDB (0 byte request pada kunjungan kedua), penyerapan 99% lalu lintas oleh Global Edge CDN, serta isolasi aset statis ke Object Storage. | 26 Nov 2026 |
| **Layar Sambutan Pembuka (Splash Gate) Berizin Audio** | Kebijakan keamanan peramban modern (Chrome/Edge/Safari Audio Autoplay Policy) memblokir pemutaran BGM dan suara otomatis tanpa interaksi aktif pengguna. | Tombol interaktif "Mulai Eksplorasi" pada layar pembuka menjadi pemicu sah untuk membuka AudioContext, memutar musik latar belakang (BGM), dan memicu tur awal. | 26 Nov 2026 |
| **Sistem Efek Suara Prosedural Tanpa Latensi (Web Audio API SFX)** | Pemuatan file audio MP3/WAV eksternal untuk efek klik/interaksi menambah beban jaringan, memakan memori, dan mengalami jeda suara (latency) saat dimainkan. | Membangun synthesizer audio prosedural langsung melalui Web Audio API murni: instan (0 ms latency), bekerja 100% offline, hemat memori, dan mengiringi setiap klik, hover, serta modal. | 26 Nov 2026 |
| **Penyempurnaan Biografi Terstruktur 6-Bagian Berhuruf Tegak** | Format biografi sebelumnya terlalu singkat, tidak memuat rekam jejak monumental, tahun dicetak miring (italic), dan sulit dibaca secara komprehensif. | Menyusun biografi mengalir di samping kanan foto (TTL, Pendidikan, Pengalaman, Inovasi, Predikat, Bangunan yang Diabadikan) dengan tabel ringkasan non-italic dan narasi KBBI. | 26 Nov 2026 |
| **Aksesibilitas Narator Suara (TTS) & Pengatur Ukuran Huruf (A-/A+)** | Pengunjung penyandang disabilitas netra (low-vision / tunanetra) kesulitan membaca teks narasi diorama yang panjang pada layar komputer/ponsel. | Mengintegrasikan suara narator otomatis bahasa Indonesia alami (Web Speech Synthesis) serta tombol zoom font (A-, Normal, A+) langsung di bilah aksesibilitas atas modal. | 26 Nov 2026 |
| **Penertiban Nomenklatur Menjadi 'Rektorat & Pendiri Undip'** | Terdapat kata 'Direktorat' yang kurang tepat serta takarir foto '✦ Potret Tokoh Pendiri' yang membingungkan pengunjung pameran kepemimpinan. | Mengubah seluruh label menjadi 'Rektorat Undip' dan 'Pendiri Undip', serta memperbarui takarir foto menjadi 'Pendiri Undip' demi kerapian standar pameran resmi. | 26 Nov 2026 |
| **Pembersihan Ikon Kuning dan Perbaikan Transisi Modal** | Blok kutipan sebelumnya memiliki aksen tanda kutip kuning mencolok (#ffd700) serta transisi modal terasa kaku/mendadak saat dibuka. | Menghilangkan ikon semu kuning demi tampilan editorial minimalis yang bersih, serta menerapkan kurva transisi halus spring easing cubic-bezier(0.16, 1, 0.3, 1). | 26 Nov 2026 |
| **Penyempurnaan Pencahayaan Sinematik Museum (Warm Lighting)** | Nilai ambientLight berlebih (1.85) memudarkan kontras visual, menghilangkan kedalaman normal map 3D, dan membuat material terlihat pucat/plastik. | Menurunkan ambientLight ke 0.75 dan menaikkan directionalLight ke 1.25 dengan warna warm ivory (#fffaf0) guna menghadirkan bayangan lembut arsitektural yang elegan. | 26 Nov 2026 |
| **Eliminasi Zona 4 & Zona 5 (Fokus Penuh Zona 1, 2, dan 3)** | Keberadaan Zona 4 dan 5 memperluas beban kerja tanpa fokus konten yang matang, berisiko mengorbankan kualitas penyelesaian proyek. | Memusatkan seluruh daya pengembangan pada 3 zona utama yang disetujui (Zona 1: Sejarah & Rektorat; Zona 2: Riset & Transformasi; Zona 3: Inovasi & Masa Depan). | 26 Nov 2026 |

---

## 2. Changelog
*Catatan histori tindakan perubahan (action), deskripsi tantangan & problem solving, tanggal, serta penanggung jawab perubahannya.*

| 🔖 Action | ≡ Description | 📅 Date | ≡ Changed by |
| :--- | :--- | :--- | :--- |
| **Added** | **Tantangan**: Gerakan avatar tembus dinding & lag CPU.<br>**Problem Solving**: Mengintegrasikan avatar Roblox berkolisi Rapier physics WASM (60 FPS stabil). | 26 Nov 2026 | 3D Graphics Dev |
| **Added** | **Tantangan**: Memuat 5 ruangan memicu VRAM leak.<br>**Problem Solving**: Menerapkan arsitektur Dynamic Room Loading pada pintu portal (hanya 1 ruangan aktif di memori). | 26 Nov 2026 | 3D Graphics Dev |
| **Added** | **Tantangan**: Peramban memblokir audio/BGM otomatis.<br>**Problem Solving**: Menerapkan Layar Sambutan (Splash Gate) sebagai pemicu sah AudioContext & BGM peramban. | 26 Nov 2026 | Frontend Dev |
| **Added** | **Tantangan**: Jeda latensi file MP3 saat diklik.<br>**Problem Solving**: Membangun synthesizer prosedural Web Audio API murni untuk efek suara klik, buka modal, dan zoom. | 26 Nov 2026 | Audio Engineer |
| **Added** | **Tantangan**: Informasi sejarah tokoh terlalu singkat.<br>**Problem Solving**: Menyusun format 6-bagian terstruktur (TTL, Pendidikan, Pengalaman, Inovasi, Predikat, Bangunan Diabadikan). | 26 Nov 2026 | Historical Curator |
| **Added** | **Tantangan**: Pengunjung disabilitas netra sulit membaca.<br>**Problem Solving**: Menambahkan tombol Narator Suara (TTS id-ID) dan pengubah ukuran font (A-/Normal/A+). | 26 Nov 2026 | Frontend Dev |
| **Added** | **Tantangan**: Lonjakan ribuan pengunjung dapat melumpuhkan server.<br>**Problem Solving**: Menerapkan IndexedDB client-side cache & distribusi aset via CDN edge. | 26 Nov 2026 | Systems Architect |
| **Fixed** | **Tantangan**: Transisi pembukaan modal kaku/mengagetkan.<br>**Problem Solving**: Menerapkan kurva spring easing cubic-bezier(0.16, 1, 0.3, 1) dan efek backdrop blur. | 26 Nov 2026 | UI/UX Designer |
| **Fixed** | **Tantangan**: Kata 'Direktorat' kurang tepat secara nomenklatur.<br>**Problem Solving**: Menghapus kata 'Direktorat', mengganti judul menjadi 'Rektorat Undip' & takarir foto 'Pendiri Undip'. | 26 Nov 2026 | Content Team |
| **Fixed** | **Tantangan**: Tanda kutip kuning (#ffd700) terlalu mencolok.<br>**Problem Solving**: Menghapus tanda kutip kuning menjadi gaya garis aksen editorial minimalis elegan. | 26 Nov 2026 | UI/UX Designer |
| **Fixed** | **Tantangan**: Tumpang tindih masa bakti rektor di basis data.<br>**Problem Solving**: Mengoreksi fakta sejarah resmi rektor (Prof. Suroyo 1966–1973 & Prof. Soedarto 1977–1986). | 26 Nov 2026 | Historical Curator |
| **Fixed** | **Tantangan**: Tampilan visual 3D pucat dan datar.<br>**Problem Solving**: Menyeimbangkan pencahayaan museum (ambient 0.75, directional 1.25 bernuansa warm ivory). | 26 Nov 2026 | 3D Lighting Dev |
| **Removed** | **Tantangan**: Pelebaran ruang lingkup yang mengaburkan fokus rilis.<br>**Problem Solving**: Menghapus seluruh kode konfigurasi dan rute Zona 4 dan Zona 5 dari sistem. | 26 Nov 2026 | Lead Architect |
