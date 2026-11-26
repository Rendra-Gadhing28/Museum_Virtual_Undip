# Pedoman Kaidah Kebahasaan Indonesia (KBBI & EYD Edisi V)
Museum Virtual Universitas Diponegoro

Dokumen ini merupakan standar acuan kebahasaan resmi bagi seluruh pengembang (*developers*), perancang konten (*content designers*), dan penyusun teks narasi dalam proyek Museum Virtual Universitas Diponegoro (Undip). Seluruh teks antarmuka (*UI*), dialog informasi, keterangan artefak sejarah, dan biografi profil tokoh wajib mematuhi ketentuan di dalam dokumen ini.

---

## 1. Prinsip Utama Penggunaan Bahasa

1. **Baku dan Formal**: Seluruh teks menggunakan ragam bahasa Indonesia baku yang mengacu pada **Kamus Besar Bahasa Indonesia (KBBI)** dan **Ejaan yang Disempurnakan (EYD) Edisi V**.
2. **Bebas Bahasa Cakapan**: Dilarang menggunakan singkatan informal media sosial atau ragam cakapan (misalnya: *gak*, *udah*, *bgt*, *klo*, *yg*, *dgn*, *dll*). Gunakan bentuk lengkap: *tidak*, *sudah*, *sangat*, *kalau/apabila*, *yang*, *dengan*, *dan lain-lain*.
3. **Objektif dan Edukatif**: Nada bahasa bersifat informatif, santun, lugas, dan mencerminkan marwah akademik perguruan tinggi negeri.

---

## 2. Aturan Tanda Baca dan Tipografi

### A. Tanda Garis Miring (`/`)
* **Aturan Ketat**: Garis miring **TIDAK BOLEH** digunakan sebagai pengganti konjungsi "atau" maupun "dan" dalam narasi formal.
* **Penggunaan Khusus Garis Miring**: Hanya digunakan untuk membatasi istilah bahasa asing terhadap istilah padanan bahasa Indonesianya, atau pada penomoran surat resmi.
  * **Contoh Salah**: *"Klik pintu zona 1/zona 2 untuk berpindah ruangan."*
  * **Contoh Benar**: *"Pilih pintu Zona 1 atau Zona 2 untuk berpindah ruangan."*
  * **Contoh Diperbolehkan**: *"Pemuatan Ruangan Dinamis / Dynamic Room Loading"*

### B. Istilah Asing dan Penulisan Cetak Miring (*Italics*)
* Setiap kata, istilah teknis, atau frasa yang berasal dari bahasa asing dan belum diserap secara resmi ke dalam KBBI **wajib dicetak miring (*italic*)**.
* Daftar istilah teknis baku dan padanan:
  * *render* / pemrosesan grafis (cetak miring jika ditulis *render*)
  * *viewport* (cetak miring)
  * *sidebar* -> gunakan padanan: **bilah sisi** atau tulis *sidebar* jika merujuk istilah teknis.
  * *bottom bar* -> gunakan padanan: **bilah bawah** atau tulis *bottom bar*.
  * *third-person perspective* -> gunakan padanan: **sudut pandang orang ketiga**.
  * *spawn point* -> gunakan padanan: **titik pemunculan**.
  * *soundtrack* / *background music* -> gunakan padanan: **musik latar belakang** (*BGM*).
  * *Text-to-Speech* -> gunakan padanan: **alih teks ke suara** (*Text-to-Speech / TTS*).

### C. Tanda Kurung (`()`)
Tanda kurung digunakan secara proporsional untuk:
1. Mengapit akronim atau singkatan resmi yang baru pertama kali diperkenalkan.
   * Contoh: *Universitas Diponegoro (Undip)*, *Kamus Besar Bahasa Indonesia (KBBI)*, *WebAssembly (WASM)*.
2. Mengapit keterangan penjelas tahun atau masa bakti.
   * Contoh: *Prof. Dr. Muladi, S.H. (1943–2020)*
   * Contoh: *Rektor Undip Periode 1994–1998 (Masa Bakti Ke-9)*
3. Mengapit istilah asing sebagai penjelas istilah padanan resmi bahasa Indonesia.
   * Contoh: *pemangkasan jarak pandang (distance culling)*

---

## 3. Format Penulisan Biografi Profil Tokoh & Rektor

Penulisan biografi profil tokoh pendiri dan rektor Undip harus mengikuti susunan baku berikut:

1. **Nama Lengkap dan Gelar Akademik**:
   * Penulisan gelar mematuhi EYD (pemisahan tanda koma dan spasi).
   * Contoh: `Prof. Dr. Yos Johan Utama, S.H., M.Hum.`
2. **Keterangan Jabatan & Masa Bakti**:
   * Ditulis formal di bawah nama.
   * Contoh: `Rektor Universitas Diponegoro (Periode 2015–2024)`
3. **Paragraf Pembuka**:
   * Merangkum riwayat kelahiran, latar belakang kepemimpinan, dan bidang keilmuan secara ringkas dan terhormat.
4. **Paragraf Capaian & Warisan Institusional**:
   * Menguraikan kontribusi nyata sang tokoh terhadap perkembangan fisik, akademik, dan reputasi Undip (misalnya peralihan status menjadi PTN-BH, pembangunan fasilitas riset terpadu, dsb.).
5. **Gaya Penulisan**:
   * Menggunakan sudut pandang orang ketiga (*beliau*, *ia*, atau menyebut nama tokoh), tanpa ungkapan hiperbolis yang tidak berbasis fakta sejarah.

---

## 4. Daftar Periksa Kebahasaan (*Linguistic Quality Checklist*)

Sebelum suatu teks dimasukkan ke dalam basis data kode (*codebase*), periksa daftar berikut:

- [ ] Apakah tidak ada singkatan tidak baku (*tp*, *yg*, *dgn*, *dll*)?
- [ ] Apakah seluruh istilah bahasa asing telah dicetak miring (*italic*)?
- [ ] Apakah garis miring (`/`) tidak menggantikan kata "atau" / "dan"?
- [ ] Apakah tanda kurung digunakan sesuai fungsinya (keterangan formal/akronim)?
- [ ] Apakah gelar akademik tokoh telah ditulis sesuai standar PUEBI/EYD V?
- [ ] Apakah tanda baca titik (`.`) dan koma (`,`) telah diberi spasi setelahnya, bukan sebelumnya?
