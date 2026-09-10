// ===================================================
// DATABASE BERITA SEKOLAH - TKJ 1
// Menggunakan Firebase Realtime Database yang SAMA
// dengan yang sudah dipakai untuk chat.js (project
// tkj1-chat-a1f8e), tapi disimpan di node terpisah
// bernama "berita" supaya tidak tercampur dengan chat.
//
// KENAPA PAKAI FIREBASE (bukan MySQL/PHP)?
// Website ini di-hosting sebagai situs statis (Vercel /
// GitHub Pages), jadi tidak ada server PHP yang jalan.
// Firebase bisa diakses langsung dari browser tanpa
// server tambahan, dan project-nya sudah ada & aktif.
//
// KENAPA BUKAN "type=module" LAGI?
// Sebelumnya file ini pakai import module Firebase versi
// baru (modular SDK). Itu GAGAL kalau halaman dibuka
// langsung dari file di komputer (file:///C:/...) karena
// browser memblokir <script type="module"> di luar server
// (http/https). Sekarang file ini dipindah ke SDK "compat"
// yang sama seperti chat.js/stats.js -> bisa jalan langsung
// dobel-klik index.html, TIDAK perlu server lokal.
//
// CARA PAKAI DI HALAMAN LAIN:
// 1. Pasang 3 script ini SEBELUM script yang memakainya,
//    URUTANNYA HARUS SEPERTI INI:
//      <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
//      <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js"></script>
//      <script src="berita-db.js"></script>
//    (BUKAN type="module" lagi -- script biasa saja)
// 2. Tunggu event "beritadb-ready" sebelum memanggil
//    fungsi-fungsinya, contoh:
//      window.addEventListener('beritadb-ready', () => {
//        window.BeritaDB.getAllBerita(list => { ... });
//      });
// ===================================================
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAHrrszkHS6PCUwbBPGEvUmGOmtkPQMjJY",
    authDomain: "tkj1-chat-a1f8e.firebaseapp.com",
    databaseURL: "https://tkj1-chat-a1f8e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tkj1-chat-a1f8e",
    storageBucket: "tkj1-chat-a1f8e.firebasestorage.app",
    messagingSenderId: "62388081598",
    appId: "1:62388081598:web:c2fe65eaa9f18f8785dfef"
  };

  if (typeof firebase === 'undefined') {
    console.error('berita-db.js: Firebase SDK belum dimuat. Pastikan firebase-app-compat.js dan firebase-database-compat.js dipasang SEBELUM berita-db.js.');
    return;
  }

  // Pakai app Firebase yang sudah ada (misal dibuat chat.js)
  // supaya tidak error "Firebase App named '[DEFAULT]' already exists".
  let app;
  if (firebase.apps && firebase.apps.length > 0) {
    app = firebase.app();
  } else {
    app = firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database(app);
  const NODE = "berita"; // node terpisah dari "pesan_anonim" (chat)

  // ---------------------------------------------------
  // BACA (READ)
  // ---------------------------------------------------

  // Ambil SEMUA berita satu kali (bukan live-update).
  // callback menerima array, sudah diurutkan dari yang
  // TERBARU (dibuatPada terbesar / paling baru dibuat).
  function getAllBerita(callback) {
    db.ref(NODE).once('value').then(snap => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, v]) => ({ id, ...v }));
      list.sort((a, b) => (b.dibuatPada || 0) - (a.dibuatPada || 0));
      callback(list);
    }).catch(err => {
      console.error("Gagal mengambil daftar berita:", err);
      callback([]);
    });
  }

  // Pantau SEMUA berita secara live (real-time). Berguna
  // untuk halaman admin supaya daftar langsung update
  // begitu ada perubahan, tanpa perlu refresh halaman.
  function subscribeAllBerita(callback) {
    db.ref(NODE).on('value', snap => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, v]) => ({ id, ...v }));
      list.sort((a, b) => (b.dibuatPada || 0) - (a.dibuatPada || 0));
      callback(list);
    }, err => {
      console.error("Gagal memantau daftar berita:", err);
      callback([]);
    });
  }

  // Ambil SATU berita berdasarkan id.
  function getBeritaById(id, callback) {
    db.ref(NODE).child(id).once('value').then(snap => {
      if (snap.exists()) {
        callback({ id, ...snap.val() });
      } else {
        callback(null);
      }
    }).catch(err => {
      console.error("Gagal mengambil berita:", err);
      callback(null);
    });
  }

  // ---------------------------------------------------
  // TULIS (CREATE / UPDATE / DELETE)
  // ---------------------------------------------------

  // Tambah berita baru. `data` mengikuti bentuk config
  // artikel (lihat berita-template.html). Mengembalikan
  // Promise yang resolve dengan id berita baru.
  function addBerita(data) {
    const beritaRef = db.ref(NODE).push();
    const payload = Object.assign({}, data, { dibuatPada: Date.now() });
    return beritaRef.set(payload).then(() => beritaRef.key);
  }

  // Ubah berita yang sudah ada (tidak menghapus field lain
  // yang tidak disertakan di `data`, karena pakai update()).
  function updateBerita(id, data) {
    return db.ref(NODE).child(id).update(data);
  }

  // Ganti SELURUH isi berita (dipakai kalau mau memastikan
  // field lama yang sudah dihapus dari form ikut hilang).
  function replaceBerita(id, data) {
    return db.ref(NODE).child(id).set(data);
  }

  // Hapus berita.
  function deleteBerita(id) {
    return db.ref(NODE).child(id).remove();
  }

  // Import banyak berita sekaligus (dipakai admin-berita.html
  // untuk migrasi berita lama). Melewati berita yang sudah
  // pernah diimpor (ditandai lewat field migrasiId supaya
  // tidak dobel kalau tombol impor ditekan berkali-kali).
  async function importBeritaLama(daftarLama) {
    const existing = await new Promise(resolve => getAllBerita(resolve));
    const sudahAda = new Set(existing.map(b => b.migrasiId).filter(Boolean));
    let jumlahBaru = 0;
    for (const item of daftarLama) {
      if (sudahAda.has(item.migrasiId)) continue;
      await addBerita(item);
      jumlahBaru++;
    }
    return jumlahBaru;
  }

  // ---------------------------------------------------
  // Expose ke window supaya bisa dipakai dari script lain
  // ---------------------------------------------------
  window.BeritaDB = {
    getAllBerita,
    subscribeAllBerita,
    getBeritaById,
    addBerita,
    updateBerita,
    replaceBerita,
    deleteBerita,
    importBeritaLama
  };
  window.dispatchEvent(new Event("beritadb-ready"));
})();
