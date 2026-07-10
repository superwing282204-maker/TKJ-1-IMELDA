# Website Sekolah — TKJ 1

Website profil sekolah/kelas TKJ 1, dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework/build tool). Bisa langsung dijalankan di browser atau dideploy sebagai situs statis (misalnya GitHub Pages).

## Struktur Folder

```
.
├── index.html                  # Halaman utama
├── style.css
├── script.js
├── images/                     # Semua foto & video
├── profil/                     # Profil sekolah (sejarah, visi-misi, dll)
├── kurikulum/                  # Info kurikulum & kalender akademik
├── gtk/                        # Guru & Tenaga Kependidikan
├── fitur/                      # Galeri foto & video
├── berita-sekolah/             # Berita/artikel sekolah
├── kesiswaan/                  # (placeholder, belum ada konten)
├── sarpras/                    # (placeholder, belum ada konten)
├── hubin/                      # (placeholder, belum ada konten)
├── program/                    # (placeholder, belum ada konten)
└── ppdb.html                   # (placeholder, belum ada konten)
```

## Menjalankan di Lokal

Karena ini situs statis, cukup buka `index.html` di browser. Untuk pengalaman yang lebih mirip hosting sungguhan (menghindari isu path relatif/CORS pada beberapa browser), jalankan local server sederhana dari folder ini:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000` di browser.

## Deploy ke GitHub Pages

1. Push folder ini ke repository GitHub (lihat langkah di bawah).
2. Buka **Settings → Pages** pada repository.
3. Pilih branch `main` dan folder `/ (root)`, lalu simpan.
4. Situs akan tersedia di `https://<username>.github.io/<nama-repo>/`.

## Catatan Perbaikan yang Sudah Dilakukan

- **Perbaikan bug besar:** folder `Profil`, `Kurikulum`, `GTK`, `Fitur` sebelumnya memakai huruf kapital, padahal semua tautan (`href`) di HTML menulisnya huruf kecil. Ini tidak masalah di Windows/Mac (case-insensitive), **tapi akan menyebabkan semua tautan 404 di GitHub Pages** (server Linux bersifat case-sensitive). Semua folder sudah diganti ke huruf kecil agar konsisten dengan tautannya.
- Menghapus file gambar duplikat yang tidak terpakai dan mengandung spasi di nama file (`penatapan 1.jpeg`, `ss 1.png`, dll) — spasi pada nama file bermasalah saat diakses lewat URL.
- Menghapus folder `kontak/` kosong (0 byte, tidak direferensikan di mana pun; kontak sekolah sudah ada di `profil/kontak.html`).
- Menambahkan halaman placeholder ("Halaman ini sedang dalam proses pembuatan") untuk 20 tautan menu yang sebelumnya menuju halaman yang belum dibuat (`program/`, `kesiswaan/`, `sarpras/`, `hubin/`, `ppdb.html`, dll), supaya pengunjung tidak melihat error 404. **Silakan isi halaman-halaman ini dengan konten aslinya.**
- Menambahkan `.gitignore` dan `README.md` ini.

## Yang Masih Perlu Dikerjakan

Folder/halaman berikut baru berisi placeholder dan perlu diisi kontennya:
`program/`, `kesiswaan/`, `sarpras/`, `hubin/`, `kurikulum/program-keahlian.html`, `gtk/prestasi-guru.html`, `gtk/tugas-fungsi.html`, `profil/struktur-organisasi-kelas.html`, `ppdb.html`.

## Cara Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit: website sekolah"
git branch -M main
git remote add origin https://github.com/<username>/<nama-repo>.git
git push -u origin main
```
