# Museum Virtual Universitas Diponegoro (Undip)

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r187-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue.svg)](https://www.typescriptlang.org/)
[![Miro Board](https://img.shields.io/badge/Miro-Dokumentasi_Resmi-yellow.svg)](https://miro.com/app/board/uXjVEN0vw2Y=/?share_link_id=923640810152)

Situs web diorama dan pameran sejarah virtual 3D interaktif Universitas Diponegoro (Undip). Proyek ini menyajikan visualisasi gedung megah Muladi Dome, aula penjelajahan sejarah, etalase capaian universitas, serta biografi profil rektor Undip dari masa ke masa yang dapat dijelajahi menggunakan sudut pandang orang ketiga (*third-person perspective*) dengan karakter avatar bergaya *Roblox*.

---

## 🔗 Tautan Penting Proyek
* **Papan Kerja Dokumentasi Miro**: [Museum Virtual Undip di Miro](https://miro.com/app/board/uXjVEN0vw2Y=/?share_link_id=923640810152)
* **Dokumentasi Arsitektur Sistem**: [docs/ARSITEKTUR_DAN_SISTEM.md](file:///d:/pkl/Museum_Virtual_Undip/docs/ARSITEKTUR_DAN_SISTEM.md)
* **Pedoman Kebahasaan Baku (KBBI & EYD V)**: [docs/PEDOMAN_KEBAHASAAN.md](file:///d:/pkl/Museum_Virtual_Undip/docs/PEDOMAN_KEBAHASAAN.md)
* **Matriks Pemecahan Masalah & Keputusan**: [docs/PROBLEM_SOLVING_DAN_KEPUTUSAN.md](file:///d:/pkl/Museum_Virtual_Undip/docs/PROBLEM_SOLVING_DAN_KEPUTUSAN.md)
* **Standar Operasional Prosedur Aset 3D (Blender & Web)**: [docs/SOP_PIPELINE_ASET_3D_BLENDER_DAN_WEB.md](file:///d:/pkl/Museum_Virtual_Undip/docs/SOP_PIPELINE_ASET_3D_BLENDER_DAN_WEB.md)
* **Lembar Kendali Tugas 3D Designer (Baked Lighting)**: [docs/DAFTAR_TUGAS_3D_DESIGNER_BAKED_LIGHTING.md](file:///d:/pkl/Museum_Virtual_Undip/docs/DAFTAR_TUGAS_3D_DESIGNER_BAKED_LIGHTING.md)
* **Spesifikasi Miro**: [docs/MIRO_SPECIFICATION.md](file:///d:/pkl/Museum_Virtual_Undip/docs/MIRO_SPECIFICATION.md)

---

## 🌟 Fitur Utama Aplikasi

1. **Eksplorasi Karakter Orang Ketiga (*Roblox-Style Third-Person Avatar*)**:
   * Penjelajahan imersif menggunakan karakter modular dengan kamera pegas (*spring arm camera*) yang mengitari tubuh pemain secara luwes.
   * Kendali navigasi menggunakan papan ketik (WASD / tombol panah) untuk perangkat desktop dan kontrol sentuh untuk ponsel pintar.
2. **Aula 3 Zona & Pintu Portal Teleportasi Dinamis (*Dynamic Room Loading*)**:
   * **Zona 1**: Sejarah pendirian Undip dan kepemimpinan rektor masa awal, terbagi ke dalam 5 ruangan sub-bab.
   * **Zona 2**: Era transformasi akademik, riset terpadu, dan fasilitas kampus.
   * **Zona 3**: Visi masa depan, prestasi internasional, dan galeri interaktif.
   * Pintu portal dilengkapi teks berorientasi tegak lurus (*billboard*) dengan kontras warna tinggi. Memasuki pintu portal akan memuat (*mount*) ruangan sub-bab secara dinamis dan melepaskan (*unmount*) ruangan lain guna menghemat memori kartu grafis (GPU VRAM).
3. **Layar Sambutan Pembuka & Musik Latar Belakang (*Splash Gate & BGM*)**:
   * Mematuhi kebijakan peramban modern (*Web Audio API autoplay policy*) melalui tombol interaktif *"Mulai Eksplorasi"*.
   * Menyuguhkan musik latar belakang (*BGM*) syahdu, efek suara (*SFX*) transisi lembut (*whoosh / chime*), dan sinematik kamera pembuka.
4. **Bilah Navigasi & Panduan Tur Interaktif (*Onboarding Tour Guide*)**:
   * Bilah sisi (*sidebar*) untuk berpindah zona secara instan.
   * Bilah bawah (*bottom bar*) menyajikan petunjuk langkah demi langkah (*guide tour*) yang membimbing pengunjung yang baru pertama kali tiba.
5. **Transisi Sinematik Interaksi Bingkai Foto**:
   * Mendekati dan menekan tombol interaksi pada bingkai foto/artefak akan menggerakkan kamera 3D secara halus (*cinematic lerp*) membingkai objek terkait, diiringi efek suara lembut, sebelum modal informasi terbuka.
6. **Tingkatan Grafis Tiga Tingkat (*Low, Normal, High*)**:
   * **Primer (*Primary*)**: Komponen struktur penting (lantai, dinding, avatar, portal) selalu aktif di semua tingkatan.
   * **Sekunder (*Secondary*)**: Lampu sorot etalase, bayangan halus, dan partikel debu ringan aktif di tingkat Normal dan Tinggi.
   * **Tersier (*Tertiary*)**: Efek pascaproses *Bloom*, pantulan lantai, dan bayangan tajam beresolusi tinggi hanya aktif di tingkat Tinggi.
   * Pengaturan dapat diubah secara langsung (*real-time*) tanpa perlu memuat ulang (*reload*) halaman.
7. **Aksesibilitas Narator Suara (*Text-to-Speech / TTS*)**:
   * Tersedia tombol pembaca narasi otomatis pada setiap modal informasi sejarah untuk memfasilitasi pengunjung berkebutuhan khusus (*low vision* / disabilitas netra).
   * Didukung vokal bahasa Indonesia alami via Cloud TTS API dengan cadangan (*fallback*) otomatis ke Web Speech API bawaan peramban.
8. **Kaidah Kebahasaan Baku KBBI & EYD Edisi V**:
   * Seluruh teks dinarasikan secara formal, objektif, dan baku.
   * Istilah asing wajib dicetak miring (*italic*), tanda kurung digunakan untuk keterangan pelengkap/akronim, serta penulisan biografi profil rektor yang terstruktur rapi.

---

## 🏛️ Tangkapan Layar Aplikasi (*Application Screenshots*)

> *Bagian ini menyajikan tangkapan layar tampilan antarmuka dan visualisasi 3D museum.*

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                 [ TANGKAPAN LAYAR 1: SPLASH GATE ]              │
│       Tampilan layar pembuka dengan tombol "Mulai Eksplorasi"   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│             [ TANGKAPAN LAYAR 2: AULA ZONA 1 & AVATAR ]         │
│     Karakter Roblox orang ketiga berdiri di aula Muladi Dome    │
│     menghadap 5 pintu portal sub-bab berkontras tinggi          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│             [ TANGKAPAN LAYAR 3: DIORAMA & MODAL TTS ]          │
│   Kamera fokus ke bingkai foto rektor dengan modal narasi KBBI │
│   dan tombol pemutar suara narasi (Text-to-Speech)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 Panduan Pengembang: Cara Mengakses dan Menjalankan

### Kebutuhan Perangkat Lunak
* **Node.js**: Versi 20.x atau lebih baru
* **Pengelola Paket**: npm, pnpm, atau bun

### Langkah Instalasi
1. Gandakan repositori ini ke komputer lokal Anda:
   ```bash
   git clone https://github.com/username/Museum_Virtual_Undip.git
   cd Museum_Virtual_Undip
   ```
2. Pasang seluruh dependensi proyek:
   ```bash
   npm install
   ```
3. Pasang pustaka fisika Rapier (jika belum terpasang):
   ```bash
   npm install @react-three/rapier
   ```
4. Jalankan peladen pengembangan lokal:
   ```bash
   npm run dev
   ```
5. Buka peramban web Anda dan akses alamat:
   ```
   http://localhost:5173
   ```

### Pemeriksaan Kompilasi & Kode Bersih
Sebelum melakukan penggabungan kode (*merge*):
```bash
npm run build    # Kompilasi TypeScript dan bundler Vite
npm run lint     # Pemeriksaan kode bersih (ESLint)
```

---

## 🛡️ Arsitektur Proteksi Server Konvensional

Untuk mencegah server kampus Undip mengalami kelebihan beban (*server down / bandwidth spike*) saat diakses ribuan pengguna bersamaan:
1. **Penyimpanan Lokal Persisten (*Client-Side IndexedDB via StorageManager.ts*)**: Aset 3D dan audio yang diunduh pada kunjungan pertama disimpan ke dalam media penyimpanan lokal peramban pengguna. Kunjungan berikutnya menghasilkan **0 byte permintaan ke server**.
2. **Penyaluran Melalui CDN Tepi (*Global Edge CDN*)**: Aset statis disajikan melalui peladen tepi (Cloudflare / Vercel Edge) yang menyerap hingga 99% lalu lintas data.
3. **Pemuatan Bertingkat (*Throttled Concurrency*)**: Klien membatasi unduhan paralel maksimal 3–4 berkas dalam satu waktu untuk mencegah kemacetan soket jaringan.

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © 2026 Universitas Diponegoro (Undip). Seluruh materi sejarah, logo, dan foto pimpinan merupakan aset resmi Universitas Diponegoro.
