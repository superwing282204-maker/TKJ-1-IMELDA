# Website Sekolah — TKJ 1 (SMK Imelda Medan)

Website profil kelas/jurusan TKJ 1, dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework atau build tool). Bisa langsung dibuka di browser atau dideploy sebagai situs statis (Vercel, GitHub Pages, dll).

## Struktur Folder

```
.
├── index.html                          # Halaman beranda
├── style.css                           # Semua styling
├── script.js                           # Jam, tanggal, dan interaksi umum
├── chat.js                             # Fitur chat anonim (Firebase Realtime Database)
├── vercel.json                         # Konfigurasi deploy Vercel
├── ppdb.html                           # Info PPDB
│
├── images/                             # Semua foto, video, dan favicon
│   └── vidio/                          # Video (vid1.mp4, vid2.mp4)
│
├── profil/                             # Profil sekolah
│   ├── sejarah.html
│   ├── visi-misi.html
│   ├── logo-sekolah.html
│   ├── struktur-organisasi.html
│   ├── prakata-kepala-sekolah.html
│   ├── pengembangan-sekolah.html
│   ├── program-sekolah.html
│   ├── kesiswaan.html
│   ├── kontak.html
│   └── teknik-komputer-jaringan.html   # ⚠️ nama mirip dengan tkj/teknik-komputer-jaringan.html, lihat catatan di bawah
│
├── tkj/
│   └── teknik-komputer-jaringan.html   # Halaman jurusan TKJ (kompetensi, karir, dll)
│
├── kurikulum/
│   ├── kurikulum.html
│   └── kalender-akademik.html
│
├── gtk/
│   └── informasi-guru.html             # Guru & Tenaga Kependidikan
│
├── kesiswaan/
│   └── informasi-peserta-didik.html
│
├── sarpras/
│   ├── peta-sekolah.html
│   ├── sarana-infrastruktur.html
│   └── sarana-pembelajaran.html
│
├── hubin/
│   ├── bursa-kerja.html
│   └── career-center.html
│
├── program/
│   ├── ekstrakulikuler.html
│   ├── laporan-kegiatan.html
│   ├── penjelasan.html
│   └── program-kerja.html
│
├── program sekolah/                    # ⚠️ nama folder pakai spasi, lihat catatan di bawah
│   ├── cerita.html
│   ├── galeri.html
│   ├── galeri-foto.html
│   ├── galeri-video.html
│   └── liburan.html
│
├── fitur/
│   ├── galeri.html
│   └── galeri-video.html
│
├── berita-sekolah/
│   ├── berita-sekolah-1.html … berita-sekolah-5.html
│
└── Wali kelas/                         # ⚠️ nama folder pakai huruf kapital + spasi, lihat catatan di bawah
    └── walikelas.html
```

## Fitur

- **Beranda dinamis**: jam & tanggal live di topbar (`script.js`).
- **Chat anonim** (`chat.js`) di halaman beranda, pakai **Firebase Realtime Database** supaya pesan tersimpan online dan bisa dilihat semua pengunjung, bukan cuma di browser masing-masing. Config Firebase sudah terisi (project `tkj1-chat-a1f8e`) — kalau mau pindah ke project Firebase sendiri, tinggal ganti object `firebaseConfig` di awal `chat.js`. Pastikan **Realtime Database Rules** di Firebase Console dibatasi (misal hanya bisa tulis pesan pendek) supaya tidak disalahgunakan orang luar.
- Halaman profil sekolah, kurikulum, guru, sarana-prasarana, hubungan industri, kesiswaan, program kerja/ekstrakurikuler, galeri foto/video, dan berita sekolah.

## Menjalankan di Lokal

Karena situs statis, cukup buka `index.html` di browser. Untuk menghindari isu path relatif di beberapa browser, jalankan local server sederhana dari folder ini:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Deploy ke Vercel

**Drag & drop (tanpa GitHub):**
1. Buka https://vercel.com/new
2. Drag & drop seluruh folder project ini (atau upload file .zip-nya).
3. Vercel otomatis mendeteksi sebagai static site — biarkan Build Command & Output Directory kosong/default.
4. Klik Deploy.

**Via GitHub (disarankan untuk update berkelanjutan):**
1. Push folder ini ke GitHub (lihat "Cara Push ke GitHub" di bawah).
2. Buka https://vercel.com/new → Import Git Repository → pilih repo ini.
3. Framework Preset: **Other**. Build Command & Output Directory dikosongkan.
4. Deploy — setiap push ke `main` otomatis re-deploy.

## Deploy ke GitHub Pages

1. Push folder ini ke GitHub.
2. **Settings → Pages** pada repository.
3. Pilih branch `main`, folder `/ (root)`, simpan.
4. Situs tersedia di `https://<username>.github.io/<nama-repo>/`.

> ⚠️ GitHub Pages (server Linux) itu **case-sensitive** dan tidak selalu ramah dengan nama folder berspasi. Lihat catatan di bawah sebelum deploy ke sana.

## Catatan / Yang Perlu Diperhatikan

Beberapa hal ditemukan saat pengecekan struktur project ini — belum diperbaiki, cuma dicatat supaya kamu yang putuskan:

- **Link rusak di `index.html`**: menu "Wali Kelas" mengarah ke `../website.real/Wali kelas/walikelas.html` (path keluar dari folder project, ke folder yang kemungkinan tidak ada di server). File aslinya justru ada di dalam project ini, di `Wali kelas/walikelas.html`. Perlu diganti jadi `Wali kelas/walikelas.html`.
- **Nama folder berspasi/berkapital**: `Wali kelas/` dan `program sekolah/` memakai spasi (dan `Wali kelas` juga huruf kapital di awal kata). Ini bisa menyebabkan masalah saat diakses lewat URL atau saat deploy ke server yang case-sensitive. Sebaiknya diganti jadi `wali-kelas/` dan `program-sekolah/`, lalu semua `href` yang menunjuk ke sana disesuaikan.
- **Dua folder mirip fungsi**: `program/` dan `program sekolah/` isinya beda-beda tapi namanya membingungkan — kemungkinan salah satu peninggalan versi lama. Perlu dicek mana yang masih dipakai di menu navigasi sebelum salah satunya dihapus/digabung.
- **Dua file dengan topik mirip**: `tkj/teknik-komputer-jaringan.html` (halaman jurusan TKJ) dan `profil/teknik-komputer-jaringan.html` (ternyata isinya halaman "Kurikulum", judul filenya menyesatkan). Sebaiknya file di `profil/` diganti nama sesuai isinya biar tidak salah paham.
- **Link internal rusak** di `profil/struktur-organisasi.html`: ada dua link submenu, `struktur-organisasi-kelas.html` dan `struktur-organisasi-sekolah.html`, yang filenya belum dibuat (yang ada cuma `struktur-organisasi.html`).
- **Video cukup besar**: `images/vidio/vid2.mp4` sekitar 24MB. Total folder `images/` sekitar 33MB — untuk loading lebih cepat, pertimbangkan kompres video/foto atau pakai hosting video eksternal (YouTube/Vimeo, embed saja).

## Cara Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit: website sekolah TKJ 1"
git branch -M main
git remote add origin https://github.com/<username>/<nama-repo>.git
git push -u origin main
```