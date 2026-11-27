# Standar Operasional Prosedur: Optimalisasi dan Integrasi Aset 3D
## Alur Kerja Terpadu Blender ke Web (Three.js / React Three Fiber)
### Museum Virtual Universitas Diponegoro

---

## 1. Pendahuluan dan Pembagian Tanggung Jawab

Dokumen ini merupakan panduan teknis operasional baku bagi tim pengembang Museum Virtual Universitas Diponegoro. Dokumen ini mengatur pembagian tugas secara tegas antara perancang 3D (*3D designer*) dan pemrogram web (*web developer*) guna memastikan performa rendering optimal (target 60 bingkai per detik / *frames per second*), efisiensi alokasi memori kartu grafis (*VRAM*), serta kualitas visual pameran virtual yang realistis.

### Matriks Tanggung Jawab Kerja

| Tahapan Alur Kerja | Penanggung Jawab | Perangkat Lunak / Lingkungan |
| :--- | :--- | :--- |
| Pemodelan, Retopologi, dan Reduksi Poligon | Perancang 3D | Blender |
| Pemetaan Saluran UV Ganda (*Dual UV Mapping*) | Perancang 3D | Blender |
| Pemanggangan Tekstur (*Cycles Baking*): Cahaya, Bayangan, AO, dan *Normal* | Perancang 3D | Blender |
| Penggabungan Tekstur (*Texture Atlas*) | Perancang 3D | Blender |
| Ekspor Model Standar glTF 2.0 (*.glb*) | Perancang 3D | Blender |
| Kompresi Geometri (*Meshopt*) dan Tekstur (*KTX2 / WebP*) | Pemrogram Web | Terminal / Antarmuka Baris Perintah (*CLI*) |
| Pencahayaan Lingkungan (*HDRI / Environment Lighting*) | Pemrogram Web | Three.js / React Three Fiber |
| Integrasi Peta Cahaya (*Lightmap*) Saluran UV Kedua | Pemrogram Web | Three.js / React Three Fiber |
| Penataan *Level of Detail* (LOD) dan *Instancing* | Pemrogram Web | Three.js / React Three Fiber |
| Efek Pascapemrosesan (*Bloom*, *Tone Mapping*) | Pemrogram Web | Three.js / React Three Fiber |
| Pemuatan Bertahap (*Progressive Loading*) dan *Caching* | Pemrogram Web | Sisi Klien Peramban dan Peladen Web |

---

## 2. Bagian I: Panduan Kerja Perancang 3D (Dikerjakan di Blender)

Bagian ini sepenuhnya menjadi tanggung jawab perancang 3D. Seluruh aset arsitektur ruangan, etalase, dan artefak wajib dipersiapkan mengikuti langkah-langkah berikut sebelum diserahkan ke bagian pengembangan web.

### 2.1. Reduksi Poligon (*Polygon Optimization*)
Peramban web memiliki batasan komputasi segitiga (*triangles/polygons*). Target batas poligon per model pameran adalah sebagai berikut:
* **Model Arsitektur Ruangan / Dinding**: Maksimal 5.000 hingga 15.000 segitiga.
* **Maket dan Artefak Berukuran Besar**: Maksimal 10.000 hingga 30.000 segitiga.
* **Artefak Kecil (Bingkai, Patung, Jam, Meja)**: Maksimal 2.000 hingga 8.000 segitiga.

**Instruksi Teknis:**
1. Gunakan modifikasi *Decimate* dengan mode *Collapse* untuk mengurangi kerapatan kisi (*mesh*) tanpa merusak siluet utama objek.
2. Untuk objek dengan lengkungan organik atau detail patung yang sangat padat, lakukan retopologi manual atau gunakan teknik *re-mesh* topologi kuadran (*quads*) yang dilanjutkan dengan triangulasi bersih.
3. Hapus seluruh geometri internal yang tidak akan pernah terlihat oleh kamera pengunjung (misalnya bagian bawah alas kaki meja, bagian belakang lemari yang menempel pada dinding, atau bagian dalam pilar tertutup).
4. Terapkan seluruh transformasi sebelum memulai pemetaan UV dengan menekan kombinasi tombol `Ctrl + A` lalu memilih opsi *All Transforms*.

### 2.2. Pemetaan Saluran UV Ganda (*Dual UV Channel Setup*)
Model yang memanfaatkan pemanggangan cahaya (*baked lighting*) wajib memiliki dua saluran UV terpisah:

1. **Saluran UV Pertama (`UVMap` / Indeks 0)**:
   * Digunakan untuk memetakan tekstur material PBR (*Albedo / Base Color*, *Normal Map*, *Roughness*, dan *Metallic*).
   * Pada saluran ini, pulau UV (*UV islands*) diperbolehkan saling tumpang tindih (*overlapping*) atau memanfaatkan pencerminan (*mirroring*) untuk menghemat resolusi tekstur repetitif (misalnya motif kayu lantai atau marmer dinding).
2. **Saluran UV Kedua (`UVMap_Lightmap` / Indeks 1)**:
   * Dikhususkan untuk menerima data pemanggangan pencahayaan (*baked lightmap*) dan bayangan halus (*ambient occlusion*).
   * **Syarat Mutlak**: Tidak boleh ada pulau UV yang saling tumpang tindih (*strictly non-overlapping*). Seluruh permukaan poligon harus terbentang secara proporsional.
   * Sisipkan batas jarak antarpulau (*island margin*) minimal sebesar `0,01` hingga `0,02` agar piksel bayangan tidak bocor (*bleeding*) ke permukaan bidang di sebelahnya.

### 2.3. Pemanggangan Pencahayaan dan Bayangan (*Cycles Baking*)
Proses pemanggangan dilakukan menggunakan mesin render *Cycles* dengan memanfaatkan kartu grafis (*GPU Compute*).

**Langkah Penyiapan:**
1. Ubah *Render Engine* ke *Cycles*, pilih *Device*: *GPU Compute*.
2. Pada panel *Sampling*, atur *Render Samples* antara 128 hingga 512 sampel. Aktifkan fitur penekan derau (*Denoise*) menggunakan *OpenImageDenoise* atau *OptiX*.
3. Pada editor material (*Shader Editor*), buat simpul (*node*) baru berupa *Image Texture* kosong beresolusi 1024x1024 atau 2048x2048 piksel (format 32-bit float untuk rentang pencahayaan halus). Pastikan simpul tersebut dalam keadaan terpilih (*active selected*) namun tidak perlu dihubungkan ke keluaran material saat proses memanggang.
4. Pastikan saluran UV target pemanggangan pada panel *Object Data Properties* -> *UV Maps* diarahkan ke saluran kedua (`UVMap_Lightmap`).

**Tipe Pemanggangan yang Digunakan:**
* **Pemanggangan Cahaya Campuran (*Combined / Diffuse Bake*)**:
  * Menghasilkan citra raster yang berisi interaksi jatuhnya cahaya langsung (*direct light*), pantulan cahaya antardinding (*bounce light*), dan bayangan statis.
  * Pilih menu *Render* -> *Bake*, atur *Bake Type* ke *Diffuse* (centang *Direct* dan *Indirect*, hilangkan centang *Color* jika ingin memisahkan warna dasar dengan bayangan, atau pilih *Combined* jika ingin membakar bayangan permanen).
* **Peta Oklusi Ambien (*Ambient Occlusion / AO Map*)**:
  * Menghasilkan gradasi bayangan lembut pada sudut pertemuan dinding, celah furnitur, dan rongga objek.
  * Pada tab *Bake Type*, pilih *Ambient Occlusion*. Atur parameter jarak oklusi (*distance*) sesuai skala riil bangunan (umumnya 0,5 meter hingga 2 meter). Tekstur ini nantinya digunakan sebagai `occlusionTexture` atau dikombinasikan dengan saluran warna material.
* **Peta Normal dari Model Berdetail Tinggi (*High-Poly to Low-Poly Normal Bake*)**:
  * Digunakan untuk mentransfer detail ukiran atau lekukan rumit dari model berjuta poligon ke model versi ringan.
  * Tempatkan model berpoligon rendah (*low-poly*) tepat berimpit dengan model berpoligon tinggi (*high-poly*).
  * Pilih objek *high-poly* terlebih dahulu, kemudian tahan tombol *Shift* dan pilih objek *low-poly*.
  * Pada panel *Bake*, pilih *Bake Type: Normal*, centang opsi *Selected to Active*, atur nilai *Extrusion* (misalnya 0,02 meter) dan *Max Ray Distance* secukupnya untuk mencegah artefak garis batas terpotong.

### 2.4. Penggabungan Tekstur (*Texture Atlas*)
Untuk meminimalkan jumlah panggilan penggambaran (*draw calls*) pada peramban web:
1. Hindari penggunaan satu berkas material terpisah untuk setiap objek kecil.
2. Gabungkan pulau UV dari beberapa objek dekorasi interior yang sejenis ke dalam satu ruang koordinat tekstur terpadu (*texture atlas*).
3. Penggabungan dapat dilakukan secara manual menggunakan fitur *UV Pack Islands* (dengan margin terukur) atau memanfaatkan peralatan otomatisasi seperti *add-on SimpleBake*.

### 2.5. Prosedur Ekspor glTF 2.0 (.glb)
Setelah proses pemodelan, pemetaan UV, dan pemanggangan selesai, lakukan ekspor berkas dari Blender:
1. Klik menu **File > Export > glTF 2.0 (.glb/.gltf)**.
2. Tentukan format: **glTF Binary (.glb)**.
3. Pada panel pengaturan di sisi kanan, sesuaikan parameter berikut:
   * **Include**:
     * Centang *Selected Objects* (pilih hanya objek yang relevan).
     * Jangan centang *Cameras* dan *Punctual Lights* (lampu dan kamera akan diatur secara dinamis di kode Three.js).
   * **Transform**:
     * Centang *+Y Up* (standar orientasi koordinat Three.js).
   * **Geometry**:
     * Centang *Apply Modifiers*.
     * Centang *UVs* (pastikan kedua saluran UV disertakan).
     * Centang *Normals*.
     * Centang *Tangents* (wajib aktif jika model menyertakan *Normal Map*).
     * Centang *Vertex Colors* (hanya jika model menggunakan pewarnaan titik sudut).
   * **Materials**:
     * Pilih *Export* pada parameter *Materials*.
     * Atur format citra tekstur bawaan ke *Automatic* atau *JPEG/PNG*.
4. Simpan berkas dengan nama terstruktur (contoh: `aset_vitrine_gedung.glb`) dan serahkan kepada tim pengembang web.

---

## 3. Bagian II: Panduan Kerja Pemrosesan Berkas (Dikerjakan di Terminal / CLI)

Bagian ini dilakukan oleh pemrogram web segera setelah berkas `.glb` mentah diterima dari perancang 3D. Tahapan ini bertujuan mengompresi struktur geometri dan tekstur ke dalam format transmisi web modern sebelum diunggah ke peladen.

### 3.1. Kompresi Berkas Menggunakan gltf-transform
Gunakan pustaka `@gltf-transform/cli` untuk membersihkan struktur berkas internal dan mengompresi tekstur ke format GPU *Basis Universal* (*KTX2*).

**Langkah Pemrosesan Terminal:**
1. **Pembersihan Geometri (*Prune & Dedup*)**:
   Menghapus data titik sudut yang terduplikasi serta elemen yang tidak terpakai:
   ```bash
   npx @gltf-transform/cli dedup input.glb intermediate.glb
   npx @gltf-transform/cli prune intermediate.glb intermediate_clean.glb
   ```
2. **Kompresi Geometri (*Meshopt Compression*)**:
   Mengompresi data indeks, posisi titik sudut, dan vektor normal dengan rasio kompresi tinggi serta dekompresi instan:
   ```bash
   npx @gltf-transform/cli meshopt intermediate_clean.glb output_meshopt.glb --level medium
   ```
3. **Kompresi Tekstur GPU (*KTX2 / Basis Universal*)**:
   Mengubah tekstur PNG/JPEG di dalam berkas glTF menjadi format KTX2 berfitur ETC1S (untuk tekstur warna dengan ukuran sangat kecil) atau UASTC (untuk tekstur normal map berpresisi tinggi):
   ```bash
   npx @gltf-transform/cli uastc output_meshopt.glb output_final.glb --slots "normalTexture" --level 2
   npx @gltf-transform/cli etc1s output_final.glb public/assets/models/nama_model_terkompresi.glb --slots "baseColorTexture,occlusionTexture"
   ```

### 3.2. Alternatif Kompresi Ringkas Menggunakan gltfpack
Sebagai alternatif satu baris perintah yang efisien:
```bash
gltfpack -i input.glb -o public/assets/models/nama_model_terkompresi.glb -cc -tc -kn
```
*Keterangan parameter:*
* `-cc`: Mengaktifkan kompresi geometri Meshopt.
* `-tc`: Mengaktifkan kompresi tekstur KTX2 (*Basis Universal*).
* `-kn`: Mempertahankan nama-nama simpul objek penting (*keep nodes*).

---

## 4. Bagian III: Panduan Kerja Pemrogram Web (Dikerjakan di Tiga Dimensi Web / Three.js)

Bagian ini sepenuhnya dikerjakan oleh tim pengembang aplikasi web menggunakan React Three Fiber dan Three.js.

### 4.1. Pencahayaan Lingkungan (*HDRI / Environment Lighting*)
Pencahayaan lingkungan tidak dibakar ke dalam model geometri, melainkan dikonfigurasikan secara dinamis melalui Three.js menggunakan peta lingkungan berbasis HDR (*High Dynamic Range Image*) atau PMREM (*Prefiltered Mipmapped Radiance Environment Map*):
* Gunakan berkas tekstur berformat `.hdr` atau `.exr` beresolusi terukur (1024x512 piksel) yang dimuat via `RGBELoader`.
* Setel peta lingkungan ke `scene.environment` untuk memberikan pendaran refleksi logam (*specular reflection*) dan pencahayaan ambien natural pada material PBR.
* Jangan menaikkan intensitas HDRI secara berlebihan; gunakan intensitas antara `0,6` hingga `1,0` agar tidak menimpa bayangan yang telah dibakar (*baked shadows*).

### 4.2. Penerapan Peta Cahaya (*Lightmap*) dan Saluran UV Kedua
Pada saat model `.glb` dimuat ke dalam peramban, tautkan data tekstur pemanggangan ke material objek:
1. Pastikan atribut `uv2` pada geometri tersedia. Jika pemuat glTF hanya mendeteksi saluran `uv1`, salin referensinya ke `uv2`:
   ```javascript
   mesh.geometry.attributes.uv2 = mesh.geometry.attributes.uv1;
   ```
2. Pasangkan tekstur peta cahaya pada material standar:
   ```javascript
   mesh.material.lightMap = teksturLightmap;
   mesh.material.lightMapIntensity = 1.0;
   mesh.material.needsUpdate = true;
   ```
3. Pasangkan tekstur oklusi pada properti `aoMap`:
   ```javascript
   mesh.material.aoMap = teksturAo;
   mesh.material.aoMapIntensity = 0.85;
   ```

### 4.3. Penataan Tingkat Kedetailan (*Level of Detail / LOD*) dan *Instancing*
* **Instancing (`InstancedMesh`)**:
  Untuk elemen dekorasi berulang (seperti barisan kursi pameran, tiang pembatas antrean, lampu sorot langit-langit, atau bingkai foto berukuran identik), gunakan komponen `InstancedMesh`. Teknik ini mereduksi ratusan panggilan gambar (*draw calls*) menjadi satu kali pemrosesan GPU saja.
* **Level of Detail (`LOD`)**:
  Terapkan komponen `<Detailed>` atau kelas `THREE.LOD` untuk objek pameran berbobot tinggi. Ketika jarak kamera pengunjung melebihi jarak tertentu (misalnya lebih jauh dari 15 meter), ganti model berdetail penuh ke versi poligon rendah.

### 4.4. Efek Pascapemrosesan (*Post-Processing*)
Konfigurasikan efek pascapemrosesan secara terpusat pada kanvas Three.js:
* **Penyesuaian Nada Warna (*Tone Mapping*)**:
  Gunakan `THREE.ACESFilmicToneMapping` dengan nilai eksposur terkalibrasi (`gl.toneMappingExposure = 1.05`) untuk menghasilkan kontras pencahayaan yang natural dan mencegah warna putih terbakar (*clipping*).
* **Pendaran Cahaya (*Selective Bloom Pass*)**:
  Terapkan efek *bloom* hanya pada elemen bercahaya (*emissive meshes*) seperti lampu neon nama gedung, layar proyektor, atau lampu gantung dengan ambang batas luminesensi (*luminance threshold*) di atas `0,9`.

### 4.5. Strategi Pemuatan Bertahap (*Progressive Loading*) dan *Caching*
1. **Pemuatan Berbasis Ruangan (*Zone Partitioning*)**:
   Jangan memuat seluruh model museum secara sekaligus pada saat inisialisasi aplikasi. Terapkan pemuatan komponen berbasis kode terpisah (*lazy loading / React.lazy*) dan muat aset 3D hanya ketika pengunjung mendekati atau memasuki zona terkait.
2. **Transkoder Lokal Berbasis WebAssembly**:
   Simpan berkas pengurai KTX2 (`basis_transcoder.js` dan `basis_transcoder.wasm`) serta pengurai Draco (`draco_decoder.wasm`) pada direktori publik lokal (`public/basis/` dan `public/draco/`). Konfigurasikan pemuat agar membaca dari peladen lokal guna menjamin aplikasi dapat diakses tanpa koneksi internet luar (*offline-first*).
3. **Penyimpanan Singgah Peramban (*Browser Caching & Service Worker*)**:
   Konfigurasikan tajuk tanggapan HTTP (*HTTP Response Headers*) untuk seluruh berkas `.glb`, `.wasm`, dan tekstur dengan parameter `Cache-Control: public, max-age=31536000, immutable` sehingga pengunjung yang kembali tidak perlu mengunduh ulang aset 3D.

---

## 5. Ringkasan Alur Kerja Produksi

```
[ PERANCANG 3D - BLENDER ]
  1. Pemodelan & Reduksi Poligon (Decimate / Retopology)
  2. Pemetaan Saluran UV Ganda:
     - UV1: Tekstur Material PBR
     - UV2: Peta Cahaya Bersih (Non-overlapping)
  3. Pemanggangan Siklus (Cycles Baking):
     - Peta Bayangan & Pencahayaan Statis
     - Peta Oklusi Ambien (AO)
     - Peta Normal (High-poly ke Low-poly)
  4. Penggabungan Tekstur (Texture Atlas)
  5. Ekspor glTF 2.0 (.glb) dengan Tangents & UVs
         │
         ▼
[ PEMROGRAM WEB - TERMINAL / CLI ]
  6. Optimasi Struktur (Deduplikasi & Pruning)
  7. Kompresi Geometri (Meshopt Compression)
  8. Kompresi Tekstur GPU (KTX2 / Basis Universal)
         │
         ▼
[ PEMROGRAM WEB - THREE.JS ]
  9. Konfigurasi Transkoder Offline (KTX2 & Draco WASM)
 10. Pengaturan Pencahayaan Lingkungan HDRI
 11. Pengikatan Peta Cahaya UV2 & AO pada Material
 12. Implementasi InstancedMesh, LOD, & Post-Processing
 13. Pemuatan Ruangan Bertahap (Zone Lazy Loading)
```
