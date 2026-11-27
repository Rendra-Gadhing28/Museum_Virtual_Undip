# Lembar Kendali Tugas Perancang 3D: Pemanggangan Cahaya (Baked Lighting)
## Museum Virtual Universitas Diponegoro

Dokumen ini merupakan daftar periksa operasional (*operational checklist*) bagi anggota tim perancang 3D (*3D designer*). Dokumen ini digunakan sebagai pedoman kerja langkah demi langkah untuk setiap objek 3D yang memerlukan pemanggangan pencahayaan (*baked lighting*), bayangan halus (*ambient occlusion*), dan peta normal (*normal map*) menggunakan perangkat lunak Blender sebelum diekspor ke format glTF 2.0 (.glb).

---

## 1. Tahap Persiapan dan Validasi Geometri Model

Sebelum menyentuh pencahayaan atau UV, geometri model harus dipastikan bersih dari kesalahan topologi:

- [ ] **Pemeriksaan Jumlah Poligon**:
  - [ ] Model arsitektur ruangan berada di bawah 15.000 segitiga (*triangles*).
  - [ ] Objek etalase dan maket besar berada di bawah 30.000 segitiga.
  - [ ] Objek furnitur atau artefak pameran kecil berada di bawah 8.000 segitiga.
- [ ] **Penerapan Transformasi (*Apply All Transforms*)**:
  - [ ] Pilih objek di *Object Mode*, tekan `Ctrl + A` lalu pilih *All Transforms* (pastikan nilai *Scale* bernilai `1.0, 1.0, 1.0` dan *Rotation* bernilai `0, 0, 0`).
- [ ] **Pembersihan Geometri Non-Manifold** :
  - [ ] Di *Edit Mode*, jalankan menu *Mesh > Clean Up > Merge by Distance* untuk menghapus titik ganda (*duplicate vertices*).
  - [ ] Periksa dan perbaiki arah orientasi permukaan bidang (*Face Orientation*). Seluruh permukaan luar harus berwarna biru (tidak boleh ada bidang terbalik berwarna merah).
- [ ] **Penghapusan Poligon Tersembunyi (*Hidden Geometry Culling*)**:
  - [ ] Seluruh permukaan yang tidak terlihat oleh mata pengunjung (misalnya dasar lantai lemari yang menyentuh lantai dasar, bidang belakang panel dinding yang menempel ke tembok luar) telah dihapus untuk menghemat ruang UV dan memori grafis.

---

## 2. Tahap Pemetaan Saluran UV (Dual UV Setup)

Setiap model yang memanfaatkan pencahayaan terpanggang wajib memiliki dua saluran UV pada panel *Object Data Properties > UV Maps*:

- [ ] **Saluran Pertama: `UVMap` (Indeks 0)**:
  - [ ] Berisi pemetaan koordinat untuk tekstur material PBR (*Base Color*, *Roughness*, *Metallic*, dan detail mikro).
  - [ ] Diperbolehkan menggunakan teknik tumpang tindih (*overlapping*) atau pencerminan (*mirroring*) untuk permukaan bermotif repetitif.
- [ ] **Pembuatan Saluran Kedua: `UVMap_Lightmap` (Indeks 1)**:
  - [ ] Tambahkan saluran UV baru melalui ikon tambah (`+`) pada subpanel *UV Maps* dan beri nama tepat: `UVMap_Lightmap`.
- [ ] **Proses Pemetaan Tanpa Tumpang Tindih (*Strictly Non-Overlapping*)**:
  - [ ] Di *Edit Mode*, pilih seluruh bidang geometri (`A`).
  - [ ] Buka editor UV (*UV Editor*), jalankan perintah *Smart UV Project* atau bentangkan manual dengan jahitan (*seams*).
  - [ ] Terapkan penataan pulau UV (*UV Packing*): jalankan *UV > Pack Islands*.
  - [ ] Atur batas margin antarpulau (*Margin*) antara `0,01` hingga `0,02` (minimal 4 hingga 8 piksel pada resolusi 1024x1024).
  - [ ] Validasi visual: Pastikan tidak ada pulau UV yang saling bersilangan, keluar dari batas kotak kanvas (ruang `0.0` sampai `1.0`), atau memiliki skala pulau yang terdistorsi (*stretch*).

---

## 3. Tahap Penataan Pencahayaan dan Material di Blender (Cycles)

Pencahayaan statis dan bayangan di-bake menggunakan mesin render *Cycles*:

- [ ] **Konfigurasi Mesin Render (*Render Engine*)**:
  - [ ] Ubah *Render Engine* ke **Cycles**.
  - [ ] Ubah *Device* ke **GPU Compute**.
  - [ ] Pada subpanel *Sampling > Render*, atur *Max Samples* antara 128 hingga 256 sampel.
  - [ ] Aktifkan opsi *Denoise* menggunakan *OpenImageDenoise* atau *OptiX* dengan *Passes: Prefiltered*.
- [ ] **Penataan Lampu Statis Pameran**:
  - [ ] Tempatkan sumber cahaya pameran (*Point Light*, *Spot Light*, atau *Area Light*) sesuai tata letak pencahayaan museum.
  - [ ] Atur kekuatan cahaya (*Power / Watt*) dan temperatur warna (lampu sorot hangat 3200K atau putih bersih 5000K).
  - [ ] Pastikan bayangan tajam (*cast shadow*) jatuh pada sudut yang dramatis dan estetik.
- [ ] **Penyiapan Simpul Target (*Target Texture Node Setup*)**:
  - [ ] Buka *Shader Editor* pada material objek yang akan di-bake.
  - [ ] Buat simpul baru: *Add > Texture > Image Texture*.
  - [ ] Klik tombol *New*, tentukan nama berkas (contoh: `T_Aset_Lightmap.png`), atur resolusi `1024 x 1024` atau `2048 x 2048` piksel, hilangkan centang *Alpha*, dan centang *32-bit Float* untuk gradasi pencahayaan halus tanpa garis patah (*color banding*).
  - [ ] Biarkan simpul tersebut dalam keadaan terpilih (*active selected / outline putih/kuning*). Jangan hubungkan simpul ini ke *Material Output* terlebih dahulu.
  - [ ] Jika objek menggunakan beberapa material berbeda, salin simpul *Image Texture* target yang sama ke dalam seluruh material objek tersebut.

---

## 4. Tahap Eksekusi Pemanggangan (Baking Execution)

Lakukan pemanggangan satu per satu sesuai kebutuhan komponen tekstur:

### 4.1. Pemanggangan Peta Cahaya & Bayangan (Baked Lightmap)
- [ ] Pada panel *Object Data Properties > UV Maps*, pastikan tanda kamera aktif atau seleksi aktif berada pada `UVMap_Lightmap`.
- [ ] Buka panel *Render Properties > Bake*.
- [ ] **Pilihan Mode**:
  - [ ] *Opsi A: Combined (Cahaya + Bayangan + Warna Dasar)*:
    - [ ] *Bake Type*: **Combined**.
    - [ ] Centang kontribusi: *Direct* dan *Indirect*. Hilangkan centang *Transmission* jika tidak ada kaca.
  - [ ] *Opsi B: Diffuse Lightmap (Khusus Intensitas Cahaya Saja)*:
    - [ ] *Bake Type*: **Diffuse**.
    - [ ] Centang kontribusi: *Direct* dan *Indirect*. **Wajib hilangkan centang Color** (agar warna tekstur PBR asli tidak ikut terbakar ganda).
- [ ] Atur nilai *Margin* pemanggangan ke **8 px** (mencegah tepi poligon berwarna hitam pada saat dimuat di Three.js).
- [ ] Klik tombol **Bake** dan tunggu bilah progres hingga 100%.
- [ ] Buka *Image Editor*, pilih citra hasil bake, lalu simpan berkas citra secara permanen melalui menu *Image > Save As* (format PNG 16-bit atau Float OpenEXR jika memerlukan rentang dinamis tinggi).

### 4.2. Pemanggangan Peta Oklusi Ambien (Ambient Occlusion / AO Map)
- [ ] Pada panel *Shader Editor*, buat simpul *Image Texture* baru (contoh: `T_Aset_AO.png`).
- [ ] Pada panel *Render Properties > Bake*, ubah *Bake Type* ke **Ambient Occlusion**.
- [ ] Atur parameter *Distance* sesuai dimensi objek (antara 0,5 meter untuk furnitur hingga 2,0 meter untuk ruangan).
- [ ] Pastikan simpul target AO dalam keadaan terpilih, lalu klik tombol **Bake**.
- [ ] Simpan citra hasil pemanggangan melalui menu *Image > Save As*.

### 4.3. Pemanggangan Peta Normal (High-Poly to Low-Poly Normal Map)
*(Hanya dilakukan jika objek memiliki detail pahatan rumit/organik)*
- [ ] Posisikan model versi *high-poly* berimpit sempurna di koordinat yang sama dengan model *low-poly*.
- [ ] Pilih objek *high-poly* terlebih dahulu, kemudian tekan tombol *Shift* dan klik objek *low-poly* (objek *low-poly* menjadi objek aktif).
- [ ] Pada panel *Render Properties > Bake*, atur *Bake Type* ke **Normal**.
- [ ] Centang opsi **Selected to Active**.
- [ ] Buka subpanel *Selected to Active*, isi nilai *Extrusion* (misalnya `0.02 m`) dan nilai *Max Ray Distance* secukupnya.
- [ ] Pastikan ruang normal (*Space*) disetel ke **Tangent**.
- [ ] Klik **Bake** dan periksa hasil gradasi warna ungu-kebiruan (*tangent space normal*). Simpan berkas citra.

---

## 5. Tahap Penggabungan Tekstur (Texture Atlas)

Untuk menghemat beban komputasi peramban web pada objek-objek kecil:

- [ ] Jika terdapat beberapa objek dekorasi interior kecil yang berada di satu area yang sama, gabungkan objek menggunakan menu *Join* (`Ctrl + J`) atau gunakan teknik *UV Packing* lintas objek.
- [ ] Pastikan pulau UV dari seluruh objek tergabung rapi dalam satu kanvas tekstur bersama (*Texture Atlas*).
- [ ] Resolusi *Texture Atlas* maksimal: **2048 x 2048 piksel**.

---

## 6. Tahap Pemeriksaan Mutu Visual (Quality Assurance)

Sebelum berkas diekspor, perancang 3D wajib melakukan verifikasi internal di Blender:

- [ ] **Uji Visual di Tampilan 3D (*Viewport Shading*)**:
  - [ ] Hubungkan simpul hasil bake (`T_Aset_Lightmap.png`) ke saluran *Emission* atau *Base Color* pada material sementara untuk memeriksa adanya artefak.
  - [ ] Pastikan tidak ada noda hitam (*black seams*) di sepanjang garis sambungan UV.
  - [ ] Pastikan bayangan pada sudut-sudut pertemuan dinding tampak menyatu halus tanpa derau berbintik (*noise grain*).
- [ ] **Penyatuan Material Akhir**:
  - [ ] Kembalikan struktur simpul material standar PBR.
  - [ ] Hapus lampu-lampu Blender sementara yang tadi digunakan khusus untuk proses bake (agar tidak ikut terbawa saat ekspor).
  - [ ] Hapus kamera Blender yang tidak diperlukan.

---

## 7. Tahap Ekspor glTF 2.0 (.glb)

Lakukan ekspor berkas 3D mengikuti parameter baku berikut:

- [ ] Pilih objek yang hendak diekspor di *3D Viewport*.
- [ ] Buka menu **File > Export > glTF 2.0 (.glb/.gltf)**.
- [ ] Tentukan format: **glTF Binary (.glb)**.
- [ ] Atur parameter ekspor pada panel samping kanan:
  - [ ] **Include**:
    - [ ] Centang: *Selected Objects* saja.
    - [ ] Hilangkan centang: *Cameras*.
    - [ ] Hilangkan centang: *Punctual Lights*.
  - [ ] **Transform**:
    - [ ] Centang: *+Y Up*.
  - [ ] **Geometry**:
    - [ ] Centang: *Apply Modifiers*.
    - [ ] Centang: *UVs* (sangat penting, memastikan kedua saluran UV1 dan UV2 tersimpan).
    - [ ] Centang: *Normals*.
    - [ ] Centang: *Tangents* (wajib jika menggunakan *Normal Map*).
    - [ ] Hilangkan centang: *Materials > Export vertex colors* (kecuali objek secara khusus memerlukan pewarnaan titik sudut).
  - [ ] **Materials**:
    - [ ] Atur *Materials* ke **Export**.
    - [ ] Atur *Images* ke **Automatic** atau **JPEG Format**.
- [ ] Simpan berkas dengan format penamaan baku: `nama_objek_mentah.glb`.

---

## 8. Berita Acara Serah Terima Aset ke Tim Pemrogram Web

Setelah seluruh tahapan selesai, serahkan paket aset kepada tim pemrogram web dengan melampirkan berkas dan keterangan berikut:

1. **Berkas Model 3D Mentah**: `nama_objek_mentah.glb`
2. **Berkas Tekstur Hasil Bake Terpisah (Resolusi Penuh)**:
   - `T_namaobjek_lightmap.png` (Peta cahaya saluran UV2)
   - `T_namaobjek_ao.png` (Peta bayangan celah/sudut)
   - `T_namaobjek_normal.png` (Peta normal, jika ada)
3. **Catatan Teknis Penyerahan**:
   - Jumlah segitiga (*triangle count*).
   - Dimensi skala objek riil (dalam meter).
   - Resolusi tekstur pemanggangan yang digunakan (1024 atau 2048 piksel).

---

## 9. Tabel Kendali Progres Pengerjaan Aset 3D

Gunakan tabel kendali di bawah ini untuk memantau status penyelesaian pemanggangan cahaya per objek pameran:

| No. | Nama Objek / Aset | Zona Target | Status Topologi (Triangles) | Status Saluran UV2 | Status Bake Lightmap | Status Bake AO | Status Ekspor .glb | Status Verifikasi Web | Catatan / Kendala |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 1 | Aula Gedung Muladi Dome | Zona 1 | Selesai | Selesai | Selesai | Selesai | Selesai | Dalam Pengujian | Resolusi lightmap 2048px |
| 2 | Jam Meja Sejarah | Zona 1 | Selesai | Belum | Belum | Belum | Belum | Belum | Menunggu UV2 unwrap |
| 3 | Patung Pangeran Diponegoro | Zona 1 | Selesai | Belum | Belum | Belum | Belum | Belum | Butuh high-to-low normal |
| 4 | Diorama Kampus Pleburan | Zona 2 | Belum | Belum | Belum | Belum | Belum | Belum | Menunggu perapian mesh |
| 5 | Etalase Vitrine Rektorat | Zona 3 | Belum | Belum | Belum | Belum | Belum | Belum | Menunggu penataan lampu |
