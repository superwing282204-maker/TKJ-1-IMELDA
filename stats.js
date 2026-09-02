/* ===================================================
   STATISTIK PENGUNJUNG SEDERHANA - TKJ 1
   Menebeng ke Firebase Realtime Database yang sama
   dengan chat.js, jadi tidak perlu setup project baru.

   Fitur:
   1. Total pengunjung situs (dihitung 1x per sesi browser)
      -> taruh <span id="total-pengunjung">0</span> di footer
   2. View counter per halaman berita (opsional)
      -> taruh <span id="page-views" data-page-id="NAMA-UNIK">0</span>
         di halaman berita yang mau dihitung
   =================================================== */
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
    console.warn('Statistik pengunjung: Firebase SDK belum dimuat. Pastikan stats.js dipasang setelah script firebase-app-compat.js dan firebase-database-compat.js.');
    return;
  }

  // Pakai app Firebase yang sudah diinisialisasi chat.js kalau ada,
  // supaya tidak error "Firebase App named '[DEFAULT]' already exists".
  let app;
  if (firebase.apps && firebase.apps.length > 0) {
    app = firebase.app();
  } else {
    app = firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database(app);

  // ===== 1. TOTAL PENGUNJUNG SITUS =====
  function initTotalPengunjung() {
    const el = document.getElementById('total-pengunjung');
    console.log('[stats.js] Elemen #total-pengunjung ditemukan?', !!el);
    if (!el) return;

    const badge = el.closest('.footer-visitor-count');
    let nilaiSebelumnya = null;
    const ref = db.ref('stats/total-pengunjung');

    // Tampilkan angka realtime + efek "kedip" saat berubah
    ref.on('value', function (snapshot) {
      const total = snapshot.val() || 0;
      console.log('[stats.js] Nilai total-pengunjung dari Firebase:', total);
      el.textContent = total.toLocaleString('id-ID');

      if (nilaiSebelumnya !== null && total !== nilaiSebelumnya && badge) {
        badge.classList.remove('pulse');
        // Trigger reflow supaya animasi bisa diulang
        void badge.offsetWidth;
        badge.classList.add('pulse');
      }
      nilaiSebelumnya = total;
    }, function (error) {
      console.error('[stats.js] GAGAL membaca stats/total-pengunjung:', error.message);
    });

    // Tambah 1 hanya kalau sesi browser ini belum dihitung
    // (biar refresh halaman berkali-kali tidak menggandakan hitungan)
    const sudahDihitung = sessionStorage.getItem('tkj1-sesi-dihitung');
    console.log('[stats.js] Sesi ini sudah dihitung sebelumnya?', !!sudahDihitung);
    if (!sudahDihitung) {
      ref.transaction(function (current) {
        return (current || 0) + 1;
      }, function (error, committed) {
        if (error) {
          console.error('[stats.js] GAGAL menambah total-pengunjung:', error.message);
        } else {
          console.log('[stats.js] Berhasil menambah total-pengunjung. Committed:', committed);
        }
      });
      sessionStorage.setItem('tkj1-sesi-dihitung', '1');
    }
  }

  // ===== 2. VIEW COUNTER PER HALAMAN BERITA (opsional) =====
  function initPageViews() {
    const el = document.getElementById('page-views');
    if (!el) return;

    const pageId = el.getAttribute('data-page-id') || location.pathname;
    const safeId = pageId.replace(/[.#$\[\]\/]/g, '_');
    const ref = db.ref('stats/views/' + safeId);

    ref.on('value', function (snapshot) {
      const total = snapshot.val() || 0;
      el.textContent = total.toLocaleString('id-ID');
    });

    const sessionKey = 'tkj1-view-' + safeId;
    if (!sessionStorage.getItem(sessionKey)) {
      ref.transaction(function (current) {
        return (current || 0) + 1;
      });
      sessionStorage.setItem(sessionKey, '1');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTotalPengunjung();
    initPageViews();
  });
})();
