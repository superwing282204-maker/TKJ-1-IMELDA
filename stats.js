// ===================================================
// STATS.JS - Penghitung Total Pengunjung
// Pakai project Firebase terpisah: tkj1-pengunjung
// (beda dari project Firebase yang dipakai chat.js / berita-db.js)
// ===================================================

(function () {
  // Config khusus project "tkj1-pengunjung"
  const statsFirebaseConfig = {
    apiKey: "AIzaSyD5rtLPqJtP2XHLYvPDXwMtbZwy-2qmC8E",
    authDomain: "tkj1-pengunjung.firebaseapp.com",
    databaseURL: "https://tkj1-pengunjung-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tkj1-pengunjung",
    storageBucket: "tkj1-pengunjung.firebasestorage.app",
    messagingSenderId: "426695884338",
    appId: "1:426695884338:web:d6041c7cd062cef075462b"
  };

  // Inisialisasi sebagai app KEDUA dengan nama "statsApp",
  // supaya tidak bentrok dengan app default punya chat.js / berita-db.js
  const statsApp = firebase.initializeApp(statsFirebaseConfig, "statsApp");
  const db = statsApp.database();
  const counterRef = db.ref("statistik/total_pengunjung");

  // Biar 1 orang refresh berkali-kali nggak nambah hitungan berkali-kali dalam sesi yang sama
  const SESSION_KEY = "tkj1_sudah_dihitung";

  if (!sessionStorage.getItem(SESSION_KEY)) {
    counterRef.transaction(function (nilaiSekarang) {
      return (nilaiSekarang || 0) + 1;
    });
    sessionStorage.setItem(SESSION_KEY, "true");
  }

  // Tampilkan angkanya secara real-time ke elemen #total-pengunjung
  counterRef.on("value", function (snapshot) {
    const total = snapshot.val() || 0;
    const elemen = document.getElementById("total-pengunjung");
    if (elemen) {
      elemen.textContent = total.toLocaleString("id-ID");
    }
  });
})();
