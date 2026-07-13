# Panduan Kolaborasi Prototype GroApp

Dokumen ini dipakai sebagai arahan untuk manusia dan Codex saat mengedit prototype Pembelian dan Penjualan.

## Struktur Folder

```txt
ON-Pembelian dan Penjualan/
  index.html
  pembelian/
    index.html
  penjualan/
    index.html
  assets/
    styles.css
  js/
    modules/
      pembelian.js
      penjualan.js
    shared/
      transaction-prototype.js
```

Route utama:

- `index.html` redirect ke `pembelian/`
- `pembelian/index.html` untuk prototype Pembelian
- `penjualan/index.html` untuk prototype Penjualan

## Pembagian Area Kerja

Disarankan:

- Dimas: daftar transaksi, filter, search, tab, statistik, bulk action, export, sidebar.
- Teman: form tambah/edit transaksi, detail transaksi, item transaksi, pembayaran/pelunasan.

Jika mengedit area yang bukan milik sendiri, baca dulu perubahan terbaru dan jangan refactor besar tanpa koordinasi.

## Aturan Penting untuk Codex

Saat meminta Codex mengedit prototype ini, selalu tempel konteks ini:

```txt
Kamu sedang mengedit prototype statis GroApp di folder "ON-Pembelian dan Penjualan".
Jangan ubah struktur folder utama kecuali diminta.
Pertahankan behavior Pembelian dan Penjualan agar tetap konsisten.
Pembelian dan Penjualan memakai shared JS di js/shared/transaction-prototype.js.
Perbedaan modul ditentukan oleh js/modules/pembelian.js dan js/modules/penjualan.js.
Jangan menghapus fitur yang sudah ada.
Jangan mengganti seluruh file jika perubahan bisa dilakukan secara scoped.
Setelah edit, validasi bahwa pembelian/index.html dan penjualan/index.html masih tidak punya missing ID/handler.
```

## Cara Mengedit

Untuk perubahan tampilan global:

- Edit `assets/styles.css`
- Pastikan hasilnya masih cocok untuk Pembelian dan Penjualan.

Untuk perubahan behavior daftar/filter/export/statistik:

- Edit `js/shared/transaction-prototype.js`
- Pastikan istilah modul tetap benar:
  - Pembelian: Vendor, Hutang, Tambah Pembelian
  - Penjualan: Pelanggan, Piutang, Tambah Penjualan

Untuk perubahan khusus modul:

- Edit `js/modules/pembelian.js` atau `js/modules/penjualan.js`
- Jangan hardcode perbedaan modul di HTML jika bisa dikontrol dari config.

Untuk perubahan layout HTML:

- Edit `pembelian/index.html` dan `penjualan/index.html` secara paralel jika layout harus sama.
- Jika hanya modul tertentu yang berubah, edit modul itu saja.

## Checklist Sebelum Commit

Pastikan:

- Sidebar bisa collapse.
- Sidebar bisa pindah Pembelian dan Penjualan.
- Menu selain Pembelian/Penjualan tetap disabled.
- Search daftar bekerja:
  - Pembelian: nomor transaksi dan vendor.
  - Penjualan: nomor transaksi dan pelanggan.
- Filter multi-select masih bisa search dan menampilkan jumlah pilihan.
- Export modal masih punya scope `Semua Data` dan `Sesuai Filter dan Search`.
- Export format Excel dan PDF masih tersedia.
- Tab data masih ada `Semua`, `Terbit`, `Draft`, `Void`.

## Validasi Teknis yang Bisa Diminta ke Codex

Minta Codex menjalankan validasi ini setelah edit:

```txt
Validasi shared script JS tidak error.
Validasi semua getElementById di shared JS punya ID di pembelian/index.html dan penjualan/index.html.
Validasi semua onclick/onchange/oninput punya function di shared JS.
```

## Hal yang Jangan Dilakukan

- Jangan membuat halaman pilih prototype lagi.
- Jangan menaruh file baru di root repo luar folder `ON-Pembelian dan Penjualan`.
- Jangan menduplikasi seluruh shared JS ke masing-masing modul.
- Jangan menghapus route `pembelian/` dan `penjualan/`.
- Jangan mengembalikan tombol OCR di Penjualan.

## Catatan Deploy

Jika folder ini dipakai sebagai root project Vercel, route yang diharapkan:

- `/` redirect ke `/pembelian/`
- `/pembelian/`
- `/penjualan/`

