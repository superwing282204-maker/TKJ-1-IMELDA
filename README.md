# Website TKJ 1 — SMK Imelda Medan

Website profil kelas/jurusan **TKJ 1 (Teknik Komputer dan Jaringan)** di SMK Imelda Medan. Dibuat murni dengan HTML, CSS, dan JavaScript (tanpa framework atau build tool), jadi bisa langsung dibuka di browser atau di-deploy sebagai situs statis (Vercel, GitHub Pages, dll).

## Struktur Folder

```
.
├── index.html                          # Halaman beranda
├── style.css                           # Semua styling situs
├── script.js                           # Jam, tanggal, tema (gelap/terang), menu, dsb.
├── chat.js                             # Fitur "Chat Anonim" (Firebase Realtime Database)
├── stats.js                            # Penghitung "Sedang Online" (Firebase presence)
├── calendar.js                         # Widget kalender akademik sederhana di sidebar
├── berita-db.js                        # Ambil/simpan data berita sekolah dari Firebase
├── berita-seed.js                      # Data awal/contoh untuk berita sekolah
├── berita-template.html                # Template halaman satu berita
├── admin-berita.html                   # Panel admin sederhana untuk kelola berita
├── 404.html                            # Halaman "tidak ditemukan"
├── ppdb.html                           # Info PPDB (penerimaan siswa baru)
├── vercel.json                         # Konfigurasi deploy Vercel
├── googleb30a8424bee93ec8.html         # File verifikasi Google Search Console
│
├── images/                             # Semua foto & favicon situs
├── Vid/                                # Video (dipakai di Galeri Video)
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
│   └── teknik-komputer-jaringan.html   # ⚠️ isinya halaman "Kurikulum", judul file menyesatkan — lihat catatan
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
│   └── berita-sekolah-1.html … berita-sekolah-8.html
│
└── wali kelas/                         # ⚠️ nama folder pakai spasi, lihat catatan di bawah
    └── walikelas.html
```

## Fitur

- **Beranda dinamis**: jam & tanggal live di topbar, mode tampilan Terang/Gelap/Otomatis, dan slider foto (`script.js`).
- **Chat Anonim** (`chat.js`) — pesan tersimpan online lewat **Firebase Realtime Database** (project `tkj1-chat-a1f8e`, node `pesan_anonim`) supaya terlihat oleh semua pengunjung, bukan cuma di satu browser. Ada mode admin untuk hapus pesan (dilindungi password).
- **Penghitung "Sedang Online"** (`stats.js`) — pakai project Firebase terpisah (`tkj1-pengunjung`) dan fitur *presence*, jadi otomatis update tanpa server sendiri.
- **Berita sekolah dinamis** (`berita-db.js`, `berita-seed.js`, `admin-berita.html`) — data berita disimpan di Firebase Realtime Database juga (node terpisah `berita`, project sama dengan chat), dengan panel admin sederhana untuk tambah/kelola berita.
- **Widget kalender akademik** di sidebar beranda (`calendar.js`).
- Footer beranda dengan info sekolah, tautan cepat, dan daftar layanan.
- Halaman profil sekolah, kurikulum, guru, sarana-prasarana, hubungan industri, kesiswaan, program kerja/ekstrakurikuler, galeri foto/video, dan berita sekolah.
- Halaman 404 kustom dan file verifikasi Google Search Console.

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

Beberapa hal berikut belum diperbaiki, cuma dicatat supaya kamu yang putuskan:

- **Nama folder berspasi**: `wali kelas/` dan `program sekolah/` memakai spasi di namanya. Ini bisa menyebabkan masalah saat diakses lewat URL atau saat deploy ke server yang case-sensitive. Sebaiknya diganti jadi `wali-kelas/` dan `program-sekolah/`, lalu semua `href` yang menunjuk ke sana disesuaikan.
- **Dua folder mirip fungsi**: `program/` dan `program sekolah/` isinya beda-beda tapi namanya membingungkan — kemungkinan salah satu peninggalan versi lama. Perlu dicek mana yang masih dipakai di menu navigasi sebelum salah satunya dihapus/digabung.
- **Dua file dengan topik mirip**: `tkj/teknik-komputer-jaringan.html` (halaman jurusan TKJ) dan `profil/teknik-komputer-jaringan.html` (ternyata isinya halaman "Kurikulum", judul filenya menyesatkan). Sebaiknya file di `profil/` diganti nama sesuai isinya biar tidak salah paham.
- **Link internal rusak** di `profil/struktur-organisasi.html`: ada dua link submenu, `struktur-organisasi-kelas.html` dan `struktur-organisasi-sekolah.html`, yang filenya belum dibuat (yang ada cuma `struktur-organisasi.html`).
- **Video cukup besar**: `Vid/Mikasa x Starla.mp4` sekitar 7MB, dan folder `images/` sekitar 17MB total — untuk loading lebih cepat, pertimbangkan kompres foto/video atau pakai hosting eksternal (YouTube/Vimeo, embed saja).
- **Firebase API key terlihat di kode** (`chat.js`, `stats.js`, `berita-db.js`) — ini wajar untuk Firebase client-side, tapi pastikan **Realtime Database Rules** di Firebase Console dibatasi (misal validasi panjang pesan, rate limit sederhana) supaya tidak disalahgunakan orang luar.

## Update Terbaru

- Link Instagram di seluruh halaman (topbar, footer, kartu sosial) diperbarui ke akun `twelveclass_tkjone`. Link ke postingan Instagram spesifik di widget "Instagram Feed" beranda tetap dibiarkan apa adanya.
- Footer beranda (`index.html`) dirombak jadi 4 kolom: info sekolah & kontak, Tautan Berguna, Layanan Kami, dan kotak Buletin (form berlangganan masih tampilan statis, belum terhubung ke layanan email sungguhan).
- Label kategori (badge) di kartu berita kecil pada beranda dihapus — sebelumnya tampil sebagai kotak biru polos karena warna teksnya sama dengan warna latar belakangnya (navy-on-navy), jadi tidak terbaca.

## Cara Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit: website sekolah TKJ 1"
git branch -M main
git remote add origin https://github.com/<username>/<nama-repo>.git
git push -u origin main
```
