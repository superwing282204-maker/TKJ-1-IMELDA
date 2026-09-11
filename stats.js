// ===================================================
// STATS.JS - Penghitung "Sedang Online"
// Menghitung berapa orang yang SEDANG membuka website ini
// sekarang juga (bukan total yang pernah buka sepanjang masa).
// Pakai fitur "presence" Firebase Realtime Database:
// - Saat browser terhubung, catat 1 entri unik di /statistik/online/{id}
// - Kalau tab ditutup / koneksi putus, entri itu OTOMATIS terhapus
//   sendiri oleh Firebase lewat onDisconnect() -- tidak perlu server.
// - Angka yang ditampilkan = jumlah entri yang sedang ada di situ.
// ===================================================

(function () {
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

  const onlineListRef = db.ref("statistik/online"); // daftar semua yang sedang online
  const connectedRef  = db.ref(".info/connected");   // status koneksi browser ini

  connectedRef.on("value", function (snap) {
    if (snap.val() === true) {
      // Bikin entri unik buat browser/tab ini
      const myEntryRef = onlineListRef.push();

      // Kalau koneksi ini putus (tab ditutup, internet mati, dll),
      // Firebase otomatis menghapus entri ini sendiri.
      myEntryRef.onDisconnect().remove();

      // Tandai entri ini "hadir" sekarang
      myEntryRef.set(true);
    }
  });

  // Tampilkan jumlah entri yang sedang online ke elemen #online-pengunjung
  onlineListRef.on("value", function (snapshot) {
    const jumlah = snapshot.numChildren();
    const elemen = document.getElementById("online-pengunjung");
    if (elemen) {
      elemen.textContent = jumlah.toLocaleString("id-ID");
    }
  });
})();