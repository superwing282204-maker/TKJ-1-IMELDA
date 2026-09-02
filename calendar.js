/* ===================================================
   WIDGET KALENDER SEDERHANA - TKJ 1
   Mengisi <div id="calendar-widget"> di sidebar index.html
   Pakai class CSS yang sudah ada di style.css:
   .cal-header, .cal-nav, .cal-grid, .cal-day-head, .cal-day
   =================================================== */
(function () {
  const container = document.getElementById('calendar-widget');
  if (!container) return;

  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const namaHari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  function renderCalendar() {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    let html = '';

    // Header: nama bulan + tombol navigasi
    html += '<div class="cal-header">';
    html += '<button type="button" class="cal-nav" id="cal-prev" aria-label="Bulan sebelumnya">&laquo;</button>';
    html += '<span>' + namaBulan[viewMonth] + ' ' + viewYear + '</span>';
    html += '<button type="button" class="cal-nav" id="cal-next" aria-label="Bulan berikutnya">&raquo;</button>';
    html += '</div>';

    html += '<div class="cal-grid">';

    // Nama hari
    namaHari.forEach(function (hari) {
      html += '<div class="cal-day-head">' + hari + '</div>';
    });

    // Tanggal sisa bulan sebelumnya (pengisi kolom awal)
    for (let i = startWeekday - 1; i >= 0; i--) {
      const tanggal = daysInPrevMonth - i;
      html += '<div class="cal-day other-month">' + tanggal + '</div>';
    }

    // Tanggal bulan berjalan
    for (let tanggal = 1; tanggal <= daysInMonth; tanggal++) {
      const isToday =
        tanggal === today.getDate() &&
        viewMonth === today.getMonth() &&
        viewYear === today.getFullYear();
      html += '<div class="cal-day' + (isToday ? ' today' : '') + '">' + tanggal + '</div>';
    }

    // Tanggal awal bulan berikutnya (pengisi kolom akhir)
    const totalSel = startWeekday + daysInMonth;
    const sisa = (7 - (totalSel % 7)) % 7;
    for (let tanggal = 1; tanggal <= sisa; tanggal++) {
      html += '<div class="cal-day other-month">' + tanggal + '</div>';
    }

    html += '</div>'; // .cal-grid

    container.innerHTML = html;

    // Pasang event tombol navigasi (harus setelah innerHTML di-set)
    document.getElementById('cal-prev').addEventListener('click', function () {
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      renderCalendar();
    });

    document.getElementById('cal-next').addEventListener('click', function () {
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      renderCalendar();
    });
  }

  renderCalendar();
})();
