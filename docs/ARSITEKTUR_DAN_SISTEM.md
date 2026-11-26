# Dokumentasi Arsitektur dan Struktur Sistem
Museum Virtual Universitas Diponegoro (Versi 1.0)

Dokumen ini disusun untuk memberikan pemahaman menyeluruh kepada para pengembang selanjutnya (*next developers*), arsitek sistem, dan pengelola teknis mengenai struktur kode sumber, alur kerja sistem, hierarki komponen, dan tumpukan teknologi yang membangun Museum Virtual Universitas Diponegoro (Undip).

---

## 1. Tumpukan Teknologi Utama (*Core Technology Stack*)

Aplikasi ini dibangun menggunakan arsitektur antarmuka modern yang berfokus pada kecepatan, stabilitas memori, dan kemudahan perawatan:

* **Kerangka Kerja Inti (*Core Framework*)**: React 19 (berbasis komponen deklaratif dengan React Hooks).
* **Alat Pembangun (*Build Tool & Bundler*)**: Vite 8 (pembongkaran modul instan / *Hot Module Replacement* secepat kilat).
* **Bahasa Pemrograman**: TypeScript 6 (pemberian tipe data statis ketat untuk mencegah galat saat waktu jalan).
* **Mesin Grafis 3D (*3D Graphics Engine*)**: Three.js (r187) melalui jembatan **React Three Fiber (@react-three/fiber v9)**.
* **Pustaka Pembantu 3D (*3D Utility Ecosystem*)**: **@react-three/drei (v10)** (pengendali kamera, *loaders*, geometri bantu, *billboard*, *environment*).
* **Mesin Fisika & Tabrakan (*Physics & Collision Engine*)**: **@react-three/rapier** (mesin simulasi fisika rigid body berbasis *WebAssembly / WASM*).
* **Penyimpanan Lokal & PWA**: IndexedDB murni berbobot ringan didukung *Service Worker* untuk *caching* aset statis.
* **Format Model 3D**: GLTF / GLB terkompresi Draco (`draco_decoder.wasm`).
* **Format Citra / Tekstur**: WebP terkompresi dan KTX2 / Basis Universal.
* **Aksesibilitas Suara (*Audio Accessibility*)**: Cloud Text-to-Speech (TTS) dengan *fallback* ke peramban Web Speech API.

---

## 2. Diagram Arsitektur Tiga Lapisan (*Three-Layer Architecture*)

Sistem dibagi secara tegas menjadi tiga lapisan mandiri:

flowchart TD
    subgraph Layer_1_DOM [Lapisan 1: Antarmuka Pengguna / React DOM Layer]
        SplashGate["Layar Sambutan (Splash Gate)"]
        SidebarNav["Bilah Sisi (Navigasi Zona 1-3)"]
        BottomBarTour["Bilah Bawah (Panduan & Tutorial)"]
        ModalHistory["Modal Diorama & Biografi Rektor"]
        GraphicsMenu["Menu Pengalih Grafis Real-Time"]
        AudioController["Pengontrol Audio (BGM & SFX)"]
    end

    subgraph Layer_2_State [Lapisan 2: Pengelola Status / Application State Layer]
        ZoneManager["Pengelola Zona Aktif (ZoneManager)"]
        RoomLoader["Pengelola Pemuatan Ruangan Dinamis (RoomLoader)"]
        PerfContext["Konteks Performa & Kualitas Grafis (Low/Med/High)"]
        AudioContext["Konteks Audio & TTS Player"]
        AssetCache["Manajer Aset & Antrean Prioritas (CentralAssetManager)"]
    end

    subgraph Layer_3_Canvas [Lapisan 3: Dunia 3D / WebGL R3F Canvas Layer]
        PhysicsWorld["Rapier Physics World (WASM)"]
        
        subgraph PlayerGroup [Hierarki Karakter Pemain]
            PlayerRigidBody["Capsule Collider (RigidBody)"]
            RobloxMesh["Avatar Roblox Low-Poly Modular"]
            FollowCamera["Kamera Orang Ketiga (Spring Arm)"]
        end

        subgraph EnvironmentGroup [Hierarki Lingkungan & Diorama]
            MuladiDomeGLB["Gedung Muladi Dome (Draco Compressed)"]
            ZoneHubHall["Aula Utama Zona Aktif"]
            PortalTriggers["Pintu Portal Berkontras Tinggi (5 Pintu)"]
            ActiveSubRoom["Ruangan Sub-Bab Terpilih (Dynamic Mount)"]
        end
    end

    %% Relasi Alur
    SplashGate -->|"Mulai Eksplorasi (Buka Kunci Audio)"| AudioController
    SplashGate -->|"Inisialisasi Titik Mulai"| ZoneManager
    GraphicsMenu <-->|"Ubah Level Grafis"| PerfContext
    PerfContext -->|"Aktifkan / Nonaktifkan Komponen"| EnvironmentGroup

    SidebarNav -->|"Pindah Zona"| ZoneManager
    ZoneManager -->|"Render Aula Zona"| ZoneHubHall
    
    PortalTriggers -->|"Pemain Masuk Area Sensor"| RoomLoader
    RoomLoader -->|"Unmount Ruang Lama & Mount Ruang Baru"| ActiveSubRoom

    PlayerGroup -->|"Berinteraksi [E]"| ModalHistory
    ModalHistory -->|"Putar Narasi"| AudioContext


---

## 3. Struktur Direktori Kode Sumber (*Source Code Structure*)

Berikut adalah peta struktur berkas di dalam folder `src/`:


d:/pkl/Museum_Virtual_Undip/src/
├── assets/                  # Berkas gambar statis dan foto biografi rektor (.webp)
├── docs/                    # Dokumentasi lengkap proyek (arsitektur, kebahasaan, dsb.)
├── gallery/                 # Komponen utama museum dan diorama 3D
│   ├── cinematic/           # Pengendali sinematik kamera (intro dan fokus bingkai foto)
│   ├── common/              # Komponen 3D pakai ulang (lantai, dinding, pintu, pencahayaan)
│   ├── graphics/            # Efek visual khusus (partikel debu, shader marmer, pantulan)
│   ├── MuladiDome/          # Pemuat model 3D gedung Muladi Dome (kompresi Draco)
│   ├── quality/             # Komponen pembungkus kualitas grafis (Primer/Sekunder/Tersier)
│   ├── Zone1/               # Aula Zona 1 dan 5 ruangan sub-bab diorama sejarah
│   ├── Zone2/               # Aula Zona 2 (pameran capaian akademik dan penelitian)
│   ├── Zone3/               # Aula Zona 3 (visi masa depan dan pameran interaktif)
│   ├── MasterMuseum.tsx     # Komponen kanvas induk penggabung seluruh ekosistem 3D
│   └── index.ts             # Ekspor titik masuk modul galeri
├── perf/                    # Modul optimasi performa dan sistem PWA
│   ├── config/              # Konfigurasi batas toleransi performa dan profil perangkat
│   │   └── performance.ts   # Konfigurasi single-source-of-truth (DeviceTier, DPR, kuota cache)
│   ├── core/                # Modul inti optimasi
│   │   ├── assetManager.ts  # Antrean prioritas pengunduhan dan deduplikasi aset
│   │   ├── deviceProfile.ts # Deteksi otomatis spesifikasi perangkat keras (GPU/RAM)
│   │   ├── EntityCulling.tsx# Pemangkas komponen di luar jangkauan pandang
│   │   └── memoryGuard.ts   # Penjaga kebocoran memori (VRAM disposal guard)
│   ├── culling/             # Algoritma pemangkasan ruang (ChunkGrid & LODController)
│   ├── debug/               # Panel indikator performa (FPS, Draw Calls, Poligon)
│   └── pwa/                 # PWA Service Worker & IndexedDB StorageManager
├── App.tsx                  # Titik temu antarmuka DOM (Splash, Sidebar, Modal) dan Kanvas 3D
├── main.tsx                 # Titik masuk aplikasi React
└── index.css                # Gaya dasar CSS, tipografi baku, dan reset gaya


---

## 4. Panduan untuk Pengembang Selanjutnya (*Developer Guidelines*)

Bagi pengembang yang akan melanjutkan atau memelihara kode sumber ini:

1. **Menambahkan Objek atau Diorama Baru**:
   - Selalu bungkus objek 3D baru ke dalam komponen klasifikasi kualitas grafis:
     - Jika objek adalah struktur esensial: tandai sebagai **Primer** (selalu tampil).
     - Jika objek adalah lampu sorot atau ornamen pelengkap: tandai sebagai **Sekunder**.
     - Jika objek adalah efek partikel atau pantulan mewah: tandai sebagai **Tersier**.
2. **Menjaga Pembersihan Memori (*Memory Disposal*)**:
   - Jika membuat komponen 3D kustom yang memuat geometri atau tekstur secara mandiri, pastikan menambahkan fungsi pembersihan pada `useEffect`:
     typescript
     useEffect(() => {
       return () => {
         geometry.dispose()
         material.dispose()
       }
     }, [])
    
3. **Pemuatan Berkas 3D**:
   - Jangan pernah memasukkan berkas `.glb` mentah yang belum dikompresi. Gunakan perintah `gltf-transform optimize` dengan opsi Draco atau Meshopt sebelum menaruh berkas di folder `public/assets/models/`.
4. **Kepatuhan Bahasa**:
   - Konsultasikan setiap teks baru dengan dokumen `docs/PEDOMAN_KEBAHASAAN.md` sebelum melakukan *commit* kode.
