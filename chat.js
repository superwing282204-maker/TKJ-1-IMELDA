// ===================================================
// CHAT ANONIM - TKJ 1
// Menggunakan Firebase Realtime Database (gratis)
// supaya chat bisa dilihat & dipakai SEMUA pengunjung,
// bukan cuma tersimpan di browser masing-masing.
//
// CARA SETUP (sekali saja):
// 1. Buka https://console.firebase.google.com
// 2. Buat project baru (gratis, tidak perlu kartu kredit)
// 3. Di menu kiri klik "Build" > "Realtime Database" > "Create Database"
//    - Pilih lokasi server (asia-southeast1 misalnya)
//    - Pilih mode "Start in test mode" (biar bisa dicoba dulu)
// 4. Klik ikon gerigi (Project settings) > scroll ke bawah > "Add app" > pilih Web (</>)
// 5. Copy object firebaseConfig yang muncul, lalu tempel/ganti di bawah ini
// ===================================================

const firebaseConfig = {
  apiKey: "AIzaSyAHrrszkHS6PCUwbBPGEvUmGOmtkPQMjJY",
  authDomain: "tkj1-chat-a1f8e.firebaseapp.com",
  databaseURL: "https://tkj1-chat-a1f8e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tkj1-chat-a1f8e",
  storageBucket: "tkj1-chat-a1f8e.firebasestorage.app",
  messagingSenderId: "62388081598",
  appId: "1:62388081598:web:c2fe65eaa9f18f8785dfef"
};

// ===================================================
// MODE ADMIN
// ===================================================
// Ganti password di bawah ini sesuka kamu.
// CATATAN PENTING: ini hanya password "gerbang" di sisi tampilan
// (biar orang iseng nggak asal klik hapus). Ini BUKAN keamanan
// sungguhan, karena semua kode JS bisa dilihat & diubah lewat
// DevTools browser siapa pun. Supaya benar-benar aman (orang lain
// tidak bisa hapus pesan walau lewat DevTools/console), atur juga
// Firebase Realtime Database Rules di Firebase Console, misalnya:
//
// {
//   "rules": {
//     "chat-anonim-tkj1": {
//       ".read": true,
//       ".write": true,
//       "$msgId": { ".write": "!data.exists() || newData.val() === null" }
//     }
//   }
// }
// (Baris terakhir itu artinya: siapapun boleh kirim pesan baru,
// tapi untuk MENGHAPUS/MENGUBAH pesan yang sudah ada, itu tetap
// diizinkan di rules dasar ini — kalau mau benar-benar dikunci
// hanya admin, perlu Firebase Authentication. Untuk chat kelas
// sederhana, password gerbang ini biasanya sudah cukup.)
const ADMIN_CONFIG = {
  password: "tkj1admin", // <-- ganti password ini
  sessionKey: "chat-admin-mode"
};

// ===================================================
// FILTER KATA KOTOR (moderasi otomatis, tanpa server)
// ===================================================
// Kalau pesan mengandung salah satu kata di bawah ini, pesan tetap
// terkirim & sempat muncul sebentar, lalu OTOMATIS terhapus sendiri
// setelah beberapa detik (lihat AUTO_MOD_DELAY).
//
// CATATAN: karena situs ini tidak punya server (cuma HTML/JS + Firebase
// gratis), pengecekan & penghapusan ini dijalankan lewat browser siapa pun
// yang sedang membuka halaman chat ini (termasuk pengirimnya sendiri).
// Jadi paling ampuh selama minimal ada satu orang yang tab chat-nya
// terbuka. Ini cukup untuk moderasi santai chat kelas, tapi bukan
// sistem anti-spam/anti-kata-kotor tingkat server yang 100% pasti.
//
// Tambah/hapus kata sesuka kamu di daftar ini (huruf kecil semua):
const BAD_WORDS = [
  'anjing', 'cuki', 'anjrit', 'asu', 'babi', 'bangsat', 'bego', 'goblok',
  'tolol', 'idiot', 'kontol', 'memek', 'pepek', 'ngentot', 'ngewe',
  'pukimak', 'kampret', 'sialan', 'brengsek', 'tai', 'kunyuk', 'jancok',
  'jancuk', 'bajingan', 'keparat', 'lonte', 'pelacur',
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'slut', 'whore','anj','lol'
];
const AUTO_MOD_DELAY = 4000; // jeda (ms) sebelum pesan kotor dihapus otomatis

// Membersihkan teks sebelum dicek, biar akal-akalan seperti
// "b4ngs4t" atau "b a n g s a t" tetap kena filter.
function normalizeForFilter(str) {
  return str
    .toLowerCase()
    .replace(/4/g, 'a').replace(/3/g, 'e').replace(/1/g, 'i')
    .replace(/0/g, 'o').replace(/5/g, 's')
    .replace(/[^a-z0-9]/g, '');
}

function containsBadWord(text) {
  const clean = normalizeForFilter(text || '');
  return BAD_WORDS.some(function (w) { return clean.indexOf(w) !== -1; });
}

document.addEventListener('DOMContentLoaded', function () {

  const messagesEl  = document.getElementById('chat-messages');
  const loadingEl   = document.getElementById('chat-loading');
  const formEl      = document.getElementById('chat-form');
  const inputEl     = document.getElementById('chat-input');
  const myNameEl    = document.getElementById('chat-my-name');
  const sendBtn     = document.getElementById('chat-send-btn');
  const charCountEl = document.getElementById('chat-char-count');
  const jumpBtn     = document.getElementById('chat-jump-btn');
  const adminBtn    = document.getElementById('chat-admin-btn');
  const adminBadge  = document.getElementById('chat-admin-badge');
  const adminOverlay   = document.getElementById('admin-modal-overlay');
  const adminModalForm = document.getElementById('admin-modal-form');
  const adminInput     = document.getElementById('admin-modal-input');
  const adminErrorEl   = document.getElementById('admin-modal-error');
  const adminCloseBtn  = document.getElementById('admin-modal-close');
  const adminPassToggle = document.getElementById('admin-pass-toggle');
  const adminPassField  = adminInput ? adminInput.closest('.admin-pass-field') : null;
  const deleteOverlay  = document.getElementById('delete-confirm-overlay');
  const deletePreview  = document.getElementById('delete-confirm-preview');
  const deleteCancel   = document.getElementById('delete-confirm-cancel');
  const deleteYesBtn   = document.getElementById('delete-confirm-yes');
  const chatToast      = document.getElementById('chat-toast');
  const chatToastText  = document.getElementById('chat-toast-text');

  if (!formEl || !messagesEl) return; // bukan halaman chat

  // ===== STATUS ADMIN =====
  let isAdmin = sessionStorage.getItem(ADMIN_CONFIG.sessionKey) === 'yes';

  // Menyimpan key pesan yang sedang "dihitung mundur" untuk dihapus
  // otomatis karena kena filter kata kotor.
  const flaggedKeys = new Set();

  function updateAdminUI() {
    document.body.classList.toggle('admin-mode', isAdmin);
    if (adminBadge) adminBadge.style.display = isAdmin ? 'inline-flex' : 'none';
    if (adminBtn) {
      adminBtn.innerHTML = isAdmin
        ? '<i class="fas fa-user-shield"></i> Keluar Admin'
        : '<i class="fas fa-user-shield"></i> Admin';
      adminBtn.classList.toggle('is-admin', isAdmin);
    }
    // Tombol hapus di tiap pesan ditampilkan/disembunyikan otomatis lewat CSS
    // berdasarkan class "admin-mode" di <body> (lihat style.css).
  }

  function loginAdmin() {
    if (!adminOverlay || !adminInput) return;
    adminErrorEl.classList.remove('show');
    adminInput.value = '';
    adminPassField.classList.remove('shake');
    adminOverlay.classList.add('show');
    setTimeout(function () { adminInput.focus(); }, 50);
  }

  function closeAdminModal() {
    if (adminOverlay) adminOverlay.classList.remove('show');
  }

  function attemptAdminLogin() {
    const pass = adminInput.value;
    if (pass === ADMIN_CONFIG.password) {
      isAdmin = true;
      sessionStorage.setItem(ADMIN_CONFIG.sessionKey, 'yes');
      updateAdminUI();
      closeAdminModal();
    } else {
      adminErrorEl.classList.add('show');
      adminPassField.classList.remove('shake');
      void adminPassField.offsetWidth; // restart animasi
      adminPassField.classList.add('shake');
      adminInput.value = '';
      adminInput.focus();
    }
  }

  function logoutAdmin() {
    isAdmin = false;
    sessionStorage.removeItem(ADMIN_CONFIG.sessionKey);
    updateAdminUI();
  }

  if (adminBtn) {
    adminBtn.addEventListener('click', function () {
      isAdmin ? logoutAdmin() : loginAdmin();
    });
  }

  if (adminModalForm) {
    adminModalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      attemptAdminLogin();
    });
  }
  if (adminCloseBtn) adminCloseBtn.addEventListener('click', closeAdminModal);
  if (adminOverlay) {
    adminOverlay.addEventListener('click', function (e) {
      if (e.target === adminOverlay) closeAdminModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && adminOverlay && adminOverlay.classList.contains('show')) closeAdminModal();
  });
  if (adminPassToggle && adminInput) {
    adminPassToggle.addEventListener('click', function () {
      const showing = adminInput.type === 'text';
      adminInput.type = showing ? 'password' : 'text';
      adminPassToggle.innerHTML = showing ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
  }
  if (adminInput) {
    adminInput.addEventListener('input', function () {
      adminErrorEl.classList.remove('show');
    });
  }

  // ===== KONFIRMASI HAPUS PESAN (modal custom, bukan confirm() bawaan) =====
  let pendingDeleteKey = null;

  function truncate(str, max) {
    return str.length > max ? str.slice(0, max) + '…' : str;
  }

  function showToast(msg) {
    if (!chatToast) return;
    chatToastText.textContent = msg;
    chatToast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { chatToast.classList.remove('show'); }, 2400);
  }

  function openDeleteConfirm(key, previewText) {
    pendingDeleteKey = key;
    if (deletePreview) deletePreview.textContent = '"' + truncate(previewText || '', 90) + '"';
    if (deleteYesBtn) {
      deleteYesBtn.disabled = false;
      deleteYesBtn.innerHTML = '<i class="fas fa-trash"></i> <span>Hapus</span>';
    }
    if (deleteOverlay) deleteOverlay.classList.add('show');
  }

  function closeDeleteConfirm() {
    pendingDeleteKey = null;
    if (deleteOverlay) deleteOverlay.classList.remove('show');
  }

  if (deleteCancel) deleteCancel.addEventListener('click', closeDeleteConfirm);
  if (deleteOverlay) {
    deleteOverlay.addEventListener('click', function (e) {
      if (e.target === deleteOverlay) closeDeleteConfirm();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && deleteOverlay && deleteOverlay.classList.contains('show')) closeDeleteConfirm();
  });

  if (deleteYesBtn) {
    deleteYesBtn.addEventListener('click', function () {
      if (!pendingDeleteKey) return;
      const key = pendingDeleteKey;
      deleteYesBtn.disabled = true;
      deleteYesBtn.innerHTML = '<i class="fas fa-spinner"></i> <span>Menghapus...</span>';

      chatRef.child(key).remove().then(function () {
        closeDeleteConfirm();
        showToast('Pesan berhasil dihapus');
        // Elemen pesan akan hilang dengan animasi lewat listener 'child_removed' di bawah.
      }).catch(function (err) {
        console.error('Gagal menghapus pesan:', err);
        deleteYesBtn.disabled = false;
        deleteYesBtn.innerHTML = '<i class="fas fa-trash"></i> <span>Hapus</span>';
        showToast('Gagal menghapus pesan, coba lagi');
      });
    });
  }

  // Animasi elegan saat sebuah pesan hilang dari layar (collapse + fade)
  function animateRemoveMessage(el) {
    if (!el) return;
    const height = el.getBoundingClientRect().height;
    el.style.maxHeight = height + 'px';
    el.style.overflow = 'hidden';
    void el.offsetHeight; // paksa reflow supaya transisi berikutnya kepakai
    el.classList.add('chat-msg-removing');

    requestAnimationFrame(function () {
      el.style.maxHeight = '0px';
      el.style.marginTop = '0px';
      el.style.marginBottom = '0px';
      el.style.paddingTop = '0px';
      el.style.paddingBottom = '0px';
    });

    let done = false;
    function finish() {
      if (done) return;
      done = true;
      el.remove();
    }
    el.addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'max-height') {
        el.removeEventListener('transitionend', handler);
        finish();
      }
    });
    setTimeout(finish, 500); // jaring pengaman kalau transitionend tidak terpicu
  }

  function hapusPesan(key, btn, previewText) {
    openDeleteConfirm(key, previewText);
  }

  // Kalau config belum diganti, kasih tahu di halaman (bukan cuma di console)
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "GANTI_DENGAN_API_KEY_ANDA") {
    loadingEl.innerHTML =
      '<div class="chat-setup-warning">' +
      '⚠️ Chat belum aktif. Admin website perlu memasukkan konfigurasi Firebase ' +
      'di file <code>chat.js</code> (lihat komentar di bagian atas file tersebut).' +
      '</div>';
    return;
  }

  // Kalau library Firebase gagal dimuat (CDN diblokir, koneksi bermasalah, dll)
  if (typeof firebase === 'undefined') {
    loadingEl.innerHTML =
      '<div class="chat-setup-warning">' +
      '⚠️ Gagal memuat layanan chat. Periksa koneksi internet kamu, lalu muat ulang halaman ini.' +
      '</div>';
    return;
  }

  // ===== INIT FIREBASE =====
  let db, chatRef;
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    chatRef = db.ref('chat-anonim-tkj1');
  } catch (err) {
    console.error('Gagal menginisialisasi Firebase:', err);
    loadingEl.innerHTML = '<div class="chat-setup-warning">⚠️ Chat sedang bermasalah. Coba lagi beberapa saat lagi.</div>';
    return;
  }

  // ===== NAMA ANONIM PER SESI BROWSER =====
  let myName = sessionStorage.getItem('chat-anon-name');
  if (!myName) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    myName = 'Anon-' + rand;
    sessionStorage.setItem('chat-anon-name', myName);
  }
  if (myNameEl) myNameEl.textContent = myName;

  // Warna avatar konsisten berdasarkan nama
  function nameToColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return 'hsl(' + hue + ', 60%, 45%)';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  // Cek apakah user sedang berada (atau dekat) di bagian paling bawah chat.
  // Kalau ya, auto-scroll boleh jalan. Kalau user lagi baca chat lama di atas,
  // jangan paksa geser layarnya.
  function isNearBottom() {
    return messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 80;
  }

  function scrollToBottom(smooth) {
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    if (jumpBtn) jumpBtn.classList.remove('show');
  }

  function renderMessage(key, data) {
    const wrap = document.createElement('div');
    const isAdminMsg = !!data.admin;
    wrap.className = 'chat-msg' + (data.name === myName ? ' me' : '') + (isAdminMsg ? ' admin' : '');
    wrap.dataset.key = key;

    const initials = data.name.replace('Anon-', '').slice(0, 2);

    // Pesan dari admin (dikirim saat mode admin aktif) tampil beda:
    // avatar berbentuk perisai + label "Admin" di sebelah nama pengirim.
    const avatarInner = isAdminMsg
      ? '<i class="fas fa-shield-halved"></i>'
      : escapeHtml(initials);
    const avatarAttr = isAdminMsg
      ? ' class="chat-avatar chat-avatar-admin"'
      : ' class="chat-avatar" style="background:' + nameToColor(data.name) + '"';
    // Pesan admin tidak memakai nama anonim aslinya, tapi ditampilkan sebagai "SISTEM"
    const displayName = isAdminMsg ? 'SISTEM' : escapeHtml(data.name);

    wrap.innerHTML =
      '<div' + avatarAttr + '>' + avatarInner + '</div>' +
      '<div class="chat-bubble">' +
        '<div class="chat-meta"><span class="chat-name">' + displayName + '</span>' +
        '<span class="chat-time">' + formatTime(data.time) + '</span></div>' +
        '<div class="chat-text"></div>' +
      '</div>' +
      '<button type="button" class="chat-delete-btn" title="Hapus pesan (admin)"><i class="fas fa-trash"></i></button>';

    wrap.querySelector('.chat-text').textContent = data.text;

    const delBtn = wrap.querySelector('.chat-delete-btn');
    delBtn.addEventListener('click', function () { hapusPesan(key, delBtn, data.text); });

    return wrap;
  }

  // ===== AUTO-MOD: tandai & jadwalkan hapus pesan yang kena filter =====
  function flagAndScheduleRemoval(key, el) {
    if (flaggedKeys.has(key)) return; // sudah dijadwalkan, jangan dobel
    flaggedKeys.add(key);

    if (el) {
      el.classList.add('chat-msg-flagged');
      const bubble = el.querySelector('.chat-bubble');
      if (bubble) {
        const warn = document.createElement('div');
        warn.className = 'chat-flag-note';
        warn.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Terdeteksi kata tidak pantas, pesan akan dihapus otomatis…';
        bubble.appendChild(warn);
      }
    }

    setTimeout(function () {
      chatRef.child(key).remove().catch(function (err) {
        console.error('Gagal menghapus otomatis pesan bermasalah:', err);
      });
    }, AUTO_MOD_DELAY);
  }

  // ===== TAMPILKAN PESAN (LIVE) =====
  let firstLoad = true;
  const last200 = chatRef.limitToLast(200);

  last200.on('child_added', function (snapshot) {
    const wasNearBottom = isNearBottom();
    if (firstLoad && loadingEl && loadingEl.parentNode) loadingEl.remove();

    const key  = snapshot.key;
    const data = snapshot.val();
    const el   = renderMessage(key, data);
    messagesEl.appendChild(el);

    const isMyOwnMessage = data.name === myName;

    if (firstLoad || wasNearBottom || isMyOwnMessage) {
      scrollToBottom(!firstLoad);
    } else if (jumpBtn) {
      // Ada pesan baru masuk tapi user sedang scroll ke atas — kasih tombol pemberitahuan
      jumpBtn.classList.add('show');
    }

    // Kalau pesan mengandung kata kotor, tandai dan jadwalkan hapus otomatis.
    if (containsBadWord(data.text)) {
      flagAndScheduleRemoval(key, el);
    }
  });

  last200.once('value', function () {
    firstLoad = false;
    if (loadingEl && loadingEl.parentNode) loadingEl.remove();
    scrollToBottom(false);
  });

  // Saat pesan dihapus (oleh admin ini atau admin lain di sesi lain, ATAU
  // otomatis oleh filter kata kotor), elemen pesannya hilang dengan animasi
  // halus di layar semua orang secara real-time.
  chatRef.on('child_removed', function (snapshot) {
    const el = messagesEl.querySelector('.chat-msg[data-key="' + snapshot.key + '"]');
    animateRemoveMessage(el);
    if (flaggedKeys.has(snapshot.key)) {
      flaggedKeys.delete(snapshot.key);
      showToast('Pesan dihapus otomatis karena mengandung kata tidak pantas');
    }
  });

  // Kalau koneksi ke database bermasalah setelah halaman terbuka
  chatRef.on('value', function () {}, function (error) {
    console.error('Firebase error:', error);
    if (loadingEl && !loadingEl.parentNode) {
      messagesEl.insertAdjacentHTML('afterbegin',
        '<div class="chat-setup-warning">⚠️ Koneksi chat terputus. Pesan baru mungkin tidak muncul otomatis — coba muat ulang halaman.</div>');
    }
  });

  if (jumpBtn) {
    jumpBtn.addEventListener('click', function () { scrollToBottom(true); });
  }

  updateAdminUI();

  // ===== PENGHITUNG KARAKTER =====
  function updateCharCount() {
    if (!charCountEl) return;
    const remaining = 300 - inputEl.value.length;
    charCountEl.textContent = remaining;
    charCountEl.classList.toggle('warn', remaining <= 30);
  }
  if (inputEl) {
    inputEl.addEventListener('input', updateCharCount);
    updateCharCount();
  }

  // ===== KIRIM PESAN =====
  let lastSent = 0;
  let sending  = false;

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text || sending) return;

    // Batas sederhana anti-spam: 1 pesan per 2 detik
    const now = Date.now();
    if (now - lastSent < 2000) {
      inputEl.classList.add('shake');
      setTimeout(() => inputEl.classList.remove('shake'), 400);
      return;
    }

    sending = true;
    if (sendBtn) sendBtn.disabled = true;

    chatRef.push({
      name: myName,
      text: text.slice(0, 300),
      time: now,
      admin: isAdmin // true kalau pesan ini dikirim saat mode admin aktif
    }).then(function () {
      lastSent = now;
      inputEl.value = '';
      updateCharCount();
      inputEl.focus();
    }).catch(function (err) {
      console.error('Gagal mengirim pesan:', err);
      inputEl.classList.add('shake');
      setTimeout(() => inputEl.classList.remove('shake'), 400);
    }).finally(function () {
      sending = false;
      if (sendBtn) sendBtn.disabled = false;
    });
  });

});