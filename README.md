# Pembuatan Kontrak Jual Beli — Tim KKN Kaliancar UNDIP 2026

Aplikasi web **statis** (client-side only) untuk membuat kontrak jual-beli
secara otomatis lewat wizard 5 langkah. Tidak ada backend/server dan tidak
ada data yang disimpan di mana pun — semua isian hanya hidup di memori
browser selama sesi berlangsung, dan langsung hilang begitu file diunduh,
halaman ditutup, atau tombol **Hapus** ditekan.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan (biasanya `http://localhost:5173`).

## Build untuk produksi

```bash
npm run build
```

Hasil build statis ada di folder `dist/` — bisa di-hosting di mana saja
(Netlify, Vercel, GitHub Pages, cPanel, dst.) karena tidak butuh server.

```bash
npm run preview   # untuk mencoba hasil build secara lokal
```

## Alur aplikasi

1. **Dashboard** — isi judul kontrak (dipakai sebagai judul dokumen & nama file).
2. **Tahap 1** — Data diri Penjual & Pembeli + tanggal pembuatan (kalender,
   hari otomatis terisi berdasarkan tanggal yang dipilih).
3. **Tahap 2** — Ketentuan barang: jumlah keseluruhan barang & harga per satuan
   (bisa tambah baris sebanyak apapun).
4. **Tahap 3** — Ketentuan umum (definisi istilah), dengan tombol
   **Perbaiki Penulisan** — lihat penjelasan di bawah.
5. **Tahap 4** — Metode pembayaran: Transfer (perlu detail rekening) atau
   Tunai.
6. **Tahap 5** — Alamat pengantaran/peresmian & nama saksi, lalu **Simpan**
   untuk mengunduh dokumen sekaligus dalam format **.docx** dan **.pdf**
   dengan nama file sesuai judul kontrak. Setelah unduhan berhasil, seluruh
   isian otomatis dikosongkan dan kembali ke Dashboard.

Tombol **Hapus** di pojok kanan atas menampilkan modal konfirmasi; jika
dikonfirmasi, semua isian dihapus dan kembali ke Dashboard.

Semua angka yang diinput (harga, jumlah, umur, dsb.) otomatis ditampilkan
juga dalam bentuk terbilang bahasa Indonesia (mis. `5.000.000 (lima juta)`),
lihat `src/utils/terbilang.js`.

## Tentang tombol "Perbaiki Penulisan" (Tahap 3)

Fitur ini bisa berjalan dengan dua mode:

- **Default (gratis & tidak pernah kedaluwarsa)** — perbaikan berbasis aturan
  sederhana: merapikan spasi ganda, tanda baca, dan kapitalisasi awal
  kalimat. Tidak butuh API/koneksi apa pun, jadi selalu berfungsi.
- **Opsional (lebih pintar, tetap gratis)** — jika ingin perbaikan tata
  bahasa yang lebih halus, buka "Pengaturan AI (opsional)" di Tahap 3 dan
  masukkan API key **Gemini** gratis (bisa dibuat di
  [Google AI Studio](https://aistudio.google.com/apikey), model
  `gemini-2.0-flash` punya kuota gratis harian yang cukup besar untuk
  pemakaian pribadi/organisasi kecil). API key ini **tidak pernah dikirim
  ke server mana pun selain langsung ke Google**, tidak disimpan di
  penyimpanan browser (localStorage/cookie), dan hilang begitu halaman
  ditutup — konsisten dengan sifat aplikasi yang statis.

  Kalau suatu saat ingin mengganti ke provider AI gratis lain (mis.
  OpenRouter, Groq, atau model open-source), cukup ubah fungsi
  `perbaikiDenganGemini` di `src/utils/perbaikiPenulisan.js` — struktur
  kodenya sudah dipisah supaya gampang diganti tanpa menyentuh bagian lain.

## Struktur proyek

```
src/
  components/
    steps/Step1.jsx ... Step5.jsx   # form tiap tahap
    Dashboard.jsx                   # halaman judul awal
    StepIndicator.jsx               # navigasi angka 1-5 + tombol Hapus
    DeleteModal.jsx                 # modal konfirmasi hapus
    DocumentPreview.jsx             # preview dokumen sisi kanan (live)
    FormInput.jsx / StepNav.jsx     # komponen form reusable
  context/
    ContractContext.jsx             # state global wizard (in-memory saja)
  utils/
    documentModel.js     # "otak" dokumen: 1 sumber data dipakai preview + docx + pdf
    generateDocx.js       # export .docx (pakai library `docx`)
    generatePdf.js         # export .pdf (screenshot elemen preview -> PDF)
    terbilang.js            # angka -> teks bahasa Indonesia
    dayName.js               # tanggal -> nama hari/bulan Indonesia
    perbaikiPenulisan.js     # logika tombol "Perbaiki Penulisan"
```

`documentModel.js` adalah satu-satunya tempat yang tahu susunan isi kontrak
(pasal, ayat, dst. — mengikuti struktur `TEMPLATE_KONTRAK_TRANSFER_NEW.docx`
dan `TEMPLATE_KONTRAK_CASH_NEW.docx`). Baik preview di layar, file `.docx`,
maupun `.pdf` yang diunduh semuanya dibangun dari model yang sama, jadi
ketiganya dijamin selalu konsisten.

## Menyesuaikan isi pasal-pasal

Kalau ingin mengubah redaksi kalimat kontrak (mis. menambah pasal baru atau
mengubah kalimat baku), edit di satu tempat saja: `src/utils/documentModel.js`.
Perubahan di sana otomatis berlaku untuk preview, docx, maupun pdf.
