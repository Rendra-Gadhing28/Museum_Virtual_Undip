# Matriks Pemecahan Masalah Krusial & Catatan Keputusan (*Decision Log*)
Museum Virtual Universitas Diponegoro (Versi 1.0)

Dokumen ini mencatat keputusan arsitektur perangkat lunak (*Architectural Decision Records / ADR*), catatan perubahan (*changelog*), serta matriks pemecahan masalah (*problem solving*) untuk tantangan-tantangan teknis paling krusial dalam pengembangan Museum Virtual 3D Undip.

---

## 1. Matriks Pemecahan Masalah Krusial (*Crucial Problem Solving Matrix*)

### Tantangan 1: Waktu Muat (*Loading*) Objek 3D Terlalu Lama
* **Gejala / Masalah**: Berkas 3D aula dan diorama berukuran puluhan megabita; pengguna mengalami waktu tunggu (*loading screen*) lebih dari 15 detik pada koneksi internet rata-rata di Indonesia.
* **Tingkat Kekritisan**: **Sangat Tinggi (P0)** — Mengakibatkan pengguna meninggalkan situs (*bounce rate* tinggi).
* **Akar Masalah**: Geometri verteks mentah tidak dikompresi, dan tekstur berformat PNG/JPEG yang membutuhkan penguraian berat oleh CPU.
* **Solusi Terapan**:
  1. **Kompresi Geometri Draco & Meshopt**: Seluruh model 3D diproses menggunakan pipa pengoptimalan aset (`gltf-transform`), memampatkan ukuran berkas hingga 75%–90% (misal model gedung Muladi Dome terkompresi Draco hanya berukuran ~350 KB).
  2. **Tekstur GPU Terkompresi (KTX2 / Basis Universal)**: Tekstur diproses ke format yang terbaca langsung oleh perangkat keras kartu grafis, menghemat VRAM hingga 75% dan memangkas waktu dekompresi.
  3. **Antrean Pemuatan Bertingkat (*Priority Queue*)**: Menggunakan `CentralAssetManager` untuk mengunduh komponen primer terlebih dahulu, disusul komponen sekunder dan tersier.

---

### Tantangan 2: Jeda Pembekuan Layar Saat Render (*Shader Compilation Jank*)
* **Gejala / Masalah**: Layar peramban membeku (*freeze*) selama 0,5–1,5 detik saat karakter pertama kali berputar menghadap objek baru atau memasuki ruangan baru.
* **Tingkat Kekritisan**: **Tinggi (P1)** — Merusak pengalaman imersif pengguna.
* **Akar Masalah**: WebGL mengompilasi program grafis (*shader*) secara sinkron (*blocking main thread*) saat material baru pertama kali memasuki bidang kamera (*frustum*).
* **Solusi Terapan**:
  1. **Pemanasan Awal *Shader* (*Shader Pre-compilation / Warmup*)**: Menjalankan fungsi `gl.compile()` dan memanfaatkan `useGLTF.preload()` pada saat layar sambutan (*Splash Gate*) masih aktif di latar belakang. Saat transisi selesai, seluruh *shader* telah siap di GPU.
  2. **Penggabungan Instansi Geometri (*InstancedMesh*)**: Mengelompokkan objek statis berulang (seperti bingkai foto berukuran identik, pilar, dan pencahayaan) ke dalam satu panggilan gambar (*draw call* tunggal).

---

### Tantangan 3: Kebocoran Memori GPU (*VRAM Leak*) Saat Berpindah Ruangan
* **Gejala / Masalah**: Tab peramban mendadak keluar (*crash*) dengan galat *WebGL Context Lost* setelah pengguna menjelajahi beberapa ruangan diorama secara berturut-turut.
* **Tingkat Kekritisan**: **Sangat Tinggi (P0)** — Aplikasi berhenti berfungsi total.
* **Akar Masalah**: Komponen React yang di-*unmount* tidak secara otomatis menghapus memori GPU (geometri, material, dan tekstur Three.js tetap tersimpan di VRAM).
* **Solusi Terapan**:
  1. **Pelepasan Memori Otomatis (*Disposal Cleanup Hook*)**: Menerapkan fungsi pembersihan manual saat komponen sub-bab dilepas:
     ```typescript
     geometry.dispose()
     material.dispose()
     if (material.map) material.map.dispose()
     ```
  2. **Pemuatan Ruangan Dinamis (*Dynamic Room Loading*)**: Hanya me-mount 1 ruangan sub-bab aktif. Ruangan lain benar-benar di-*unmount* dari pohon komponen React Three Fiber.

---

### Tantangan 4: Perlindungan Server Konvensional Agar Tidak Jebol (*Server Protection*)
* **Gejala / Masalah**: Lonjakan ribuan mahasiswa atau pengunjung saat peluncuran pameran virtual dapat memicu *bandwidth limit exceeded* atau kehabisan antrean soket I/O pada peladen web kampus (*HTTP 502/504 Server Down*).
* **Tingkat Kekritisan**: **Sangat Tinggi (P0)** — Infrastruktur server kampus mati.
* **Akar Masalah**: Peladen aplikasi konvensional melayani pengunduhan berkas biner 3D statis berukuran besar secara langsung kepada ribuan klien simultan.
* **Solusi Terapan**:
  1. **Penyimpanan Lokal Persisten Klien (IndexedDB via `StorageManager.ts`)**: Setelah diunduh pertama kali, berkas 3D dan audio disimpan ke memori penyimpanan lokal pengguna. Kunjungan berulang menghasilkan **0 byte permintaan ke server (*Zero Network Requests*)**.
  2. **Jaringan Distribusi Konten Global (*Global Edge CDN*)**: Mengalihkan penyajian seluruh aset statis ke CDN (Cloudflare / Vercel Edge). Hingga 99% permintaan diserap oleh peladen tepi (*edge cache*).
  3. **Pemisahan Aset Statis (*Decoupled Object Storage*)**: Mengisolasi berkas 3D ke penyimpanan objek berskala elastis (Cloudflare R2 atau S3) sehingga CPU server aplikasi utama tetap dingin.

---

### Tantangan 5: Pembatasan *Autoplay Audio* pada Peramban Modern
* **Gejala / Masalah**: Musik latar belakang (*BGM*) dan efek suara tidak berbunyi secara otomatis saat situs dibuka, disertai peringatan galat di konsol peramban (*The AudioContext was not allowed to start*).
* **Tingkat Kekritisan**: **Sedang (P2)** — Mengurangi kedalaman pengalaman audio.
* **Akar Masalah**: Kebijakan keamanan peramban modern (Chrome, Edge, Firefox, Safari) melarang audio diputar tanpa interaksi aktif dari pengguna (*user gesture*).
* **Solusi Terapan**:
  - Menerapkan **Layar Sambutan Interaktif (*Splash Gate*)** dengan tombol *"Mulai Eksplorasi"*. Ketika pengguna menekan tombol tersebut, konteks audio (*AudioContext*) dibuka secara sah, dilanjutkan pemutaran BGM dan sinematik kamera menuju Zona 1.

---

## 2. Catatan Keputusan Arsitektur (*Decision Log*)

### Keputusan 1: Pemilihan React Three Fiber (Three.js) Menggantikan Babylon.js
* **Status**: **Disepakati (Versi 1.0)**
* **Konteks**: Diperlukan mesin rendering 3D berbasis web yang efisien dan modular.
* **Keputusan**: Menggunakan ekosistem **React 19 + Three.js (@react-three/fiber + @react-three/drei)** dan tidak mencampurkan Babylon.js ke dalam proyek.
* **Konsekuensi Positif**: Ukuran bundel aplikasi tetap ramping (menghemat ~5 MB), komponen deklaratif React Three Fiber memudahkan manajemen *state*, serta ekosistem komponen Drei sangat matang untuk kamera dan loader.

---

### Keputusan 2: Pemilihan Rapier Physics (@react-three/rapier) Menggantikan Cannon.js
* **Status**: **Disepakati (Versi 1.0)**
* **Konteks**: Karakter avatar bergaya Roblox membutuhkan perhitungan tabrakan (*collision*) yang akurat, tidak tembus dinding (*wall-clipping*), dan ringan di CPU.
* **Keputusan**: Menggunakan pustaka `@react-three/rapier`.
* **Konsekuensi Positif**: Perhitungan fisika dikompilasi ke WebAssembly (WASM), menghasilkan performa mendekati kode asli (*native speed*) tanpa membebani *main thread* JavaScript.

---

### Keputusan 3: Strategi Aksesibilitas Narator Suara (*Cloud TTS dengan Fallback Lokal*)
* **Status**: **Disepakati (Versi 1.0)**
* **Konteks**: Pengguna dengan kebutuhan khusus (disabilitas netra atau daya penglihatan rendah / *low vision*) memerlukan fitur pembacaan teks narasi diorama dan sejarah profil rektor.
* **Keputusan**: Mengintegrasikan layanan Cloud Text-to-Speech (Google Cloud TTS / ElevenLabs) untuk menghasilkan vokal berbahasa Indonesia yang fasih dan alami, disertai mekanisme pengalihan otomatis (*fallback*) ke Web Speech API bawaan peramban (`window.speechSynthesis`) saat kondisi jaringan luring (*offline*).
