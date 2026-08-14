// ===================================================
// SCRIPT WEBSITE SEKOLAH
// ===================================================

document.addEventListener('DOMContentLoaded', function () {

  // ===== MODE GELAP / TERANG / OTOMATIS =====
  // (Tema awal sudah dipasang lewat inline script di <head> agar tak berkedip)
  const THEME_KEY   = 'tkj-theme';
  const systemDark  = window.matchMedia('(prefers-color-scheme: dark)');
  const themeToggle = document.getElementById('theme-toggle');
  const themeSwitch = document.getElementById('theme-switch');
  const themeMenu   = document.getElementById('theme-menu');
  const themeOpts   = document.querySelectorAll('.theme-option');

  function getMode() {
    const m = localStorage.getItem(THEME_KEY);
    return (m === 'light' || m === 'dark') ? m : 'auto';
  }

  function applyTheme(mode) {
    const dark = mode === 'dark' || (mode === 'auto' && systemDark.matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme-mode', mode);
    themeOpts.forEach(function (btn) {
      const active = btn.dataset.themeChoice === mode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
    });
    if (themeToggle) {
      themeToggle.title = 'Mode tampilan: ' +
        (mode === 'light' ? 'Terang' : mode === 'dark' ? 'Gelap' : 'Otomatis');
    }
  }

  function setMode(mode) {
    if (mode === 'auto') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, mode);
    applyTheme(mode);
  }

  // Ikuti setelan perangkat saat mode Otomatis
  const onSystemChange = function () { if (getMode() === 'auto') applyTheme('auto'); };
  if (systemDark.addEventListener) systemDark.addEventListener('change', onSystemChange);
  else if (systemDark.addListener) systemDark.addListener(onSystemChange);

  applyTheme(getMode());

  function closeThemeMenu() {
    if (!themeSwitch) return;
    themeSwitch.classList.remove('open');
    if (themeToggle) themeToggle.setAttribute('aria-expanded', 'false');
  }

  if (themeToggle && themeSwitch) {
    // Klik biasa = buka pilihan; klik lama / kanan = ganti cepat terang-gelap
    themeToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = themeSwitch.classList.toggle('open');
      themeToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    themeToggle.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setMode(isDark ? 'light' : 'dark');
      closeThemeMenu();
    });
    themeOpts.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        setMode(btn.dataset.themeChoice);
        closeThemeMenu();
      });
    });
    document.addEventListener('click', function (e) {
      if (themeMenu && !themeSwitch.contains(e.target)) closeThemeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeThemeMenu();
    });
  }

  // ===== TANGGAL HARI INI (TOPBAR) =====
  const dateEl = document.getElementById('today-date');
  if (dateEl) {
    const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const now    = new Date();
    dateEl.textContent = days[now.getDay()] + '. ' + months[now.getMonth()] + ' ' + now.getDate() + 'th, ' + now.getFullYear();
  }

  // ===== JAM BULAT + TEKS DI TOPBAR =====
  const hourHand   = document.getElementById('topbar-clock-hour');
  const minuteHand = document.getElementById('topbar-clock-minute');
  const secondHand = document.getElementById('topbar-clock-second');
  const clockText  = document.getElementById('topbar-clock-text');

  if (hourHand && minuteHand && secondHand) {
    function updateClock() {
      const now     = new Date();
      const hours   = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const hourDeg   = (hours * 30) + (minutes * 0.5);
      const minuteDeg = (minutes * 6) + (seconds * 0.1);
      const secondDeg = seconds * 6;

      hourHand.setAttribute('transform', 'rotate(' + hourDeg + ' 20 20)');
      minuteHand.setAttribute('transform', 'rotate(' + minuteDeg + ' 20 20)');
      secondHand.setAttribute('transform', 'rotate(' + secondDeg + ' 20 20)');

      if (clockText) {
        clockText.textContent = now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }) + ' WIB';
      }
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // ===== MOBILE NAV TOGGLE =====
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.innerHTML = isOpen ? '&times;' : '&#9776;';
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    // HP / tablet sentuh: dropdown dibuka lewat ketukan (hover tidak tersedia)
    const touchLike = function () {
      return window.innerWidth <= 1024 || window.matchMedia('(hover: none)').matches;
    };
    navMenu.querySelectorAll('.has-dropdown > a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (!touchLike()) return;
        const parent = this.parentElement;
        const href = this.getAttribute('href');
        // Ketukan pertama membuka submenu, ketukan kedua baru membuka tautan
        if (!parent.classList.contains('open')) {
          e.preventDefault();
          const scope = parent.parentElement;
          scope.querySelectorAll(':scope > .has-dropdown.open').forEach(function (el) {
            if (el !== parent) el.classList.remove('open');
          });
          parent.classList.add('open');
        } else if (!href || href === '#') {
          e.preventDefault();
          parent.classList.remove('open');
        }
      });
    });
    // Tutup menu saat layar diputar / diubah ukurannya ke mode laptop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) {
        navMenu.classList.remove('open');
        navToggle.innerHTML = '&#9776;';
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.querySelectorAll('.has-dropdown.open').forEach(function (el) {
          el.classList.remove('open');
        });
      }
    });
  }

  // ===== HERO SLIDER =====
  const slides     = document.querySelectorAll('.slide');
  const dotsEl     = document.getElementById('slider-dots');
  const prevBtn    = document.getElementById('slider-prev');
  const nextBtn    = document.getElementById('slider-next');
  let currentSlide = 0;
  let autoSlide;

  if (slides.length > 0) {
    // Build dots
    slides.forEach(function (_, i) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goToSlide(i); });
      dotsEl.appendChild(dot);
    });

    function goToSlide(n) {
      slides[currentSlide].classList.remove('active');
      dotsEl.children[currentSlide].classList.remove('active');
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dotsEl.children[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    if (nextBtn) nextBtn.addEventListener('click', function () { resetAuto(); nextSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { resetAuto(); prevSlide(); });

    function startAuto() { autoSlide = setInterval(nextSlide, 5000); }
    function stopAuto()  { clearInterval(autoSlide); }
    function resetAuto() { stopAuto(); startAuto(); }
    startAuto();

    // Jeda otomatis saat kursor di atas slider (biar enak dibaca)
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', stopAuto);
      heroEl.addEventListener('mouseleave', startAuto);

      // Swipe kiri/kanan untuk HP & tablet
      let touchStartX = 0;
      heroEl.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAuto();
      }, { passive: true });
      heroEl.addEventListener('touchend', function (e) {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          diff < 0 ? nextSlide() : prevSlide();
        }
        startAuto();
      }, { passive: true });
    }

    // Navigasi dengan tombol panah keyboard (dinonaktifkan saat user sedang mengetik di form/input)
    document.addEventListener('keydown', function (e) {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft')  { resetAuto(); prevSlide(); }
      if (e.key === 'ArrowRight') { resetAuto(); nextSlide(); }
    });
  }

  // ===== TAB BERITA =====
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const el = document.getElementById('tab-' + target);
      if (el) el.classList.add('active');
    });
  });

  // ===== KALENDER WIDGET (bisa navigasi bulan) =====
  const calEl = document.getElementById('calendar-widget');
  if (calEl) {
    const realNow  = new Date();
    const todayNum = realNow.getDate();
    const todayMon = realNow.getMonth();
    const todayYr  = realNow.getFullYear();

    // Bulan yang sedang ditampilkan (mulai dari bulan berjalan)
    let viewYear  = todayYr;
    let viewMonth = todayMon;

    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const days   = ['S','S','R','K','J','S','M']; // Senin..Minggu (inisial)

    function renderCalendar() {
      const firstDay    = new Date(viewYear, viewMonth, 1).getDay(); // 0=Minggu
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const startOffset = (firstDay === 0) ? 6 : firstDay - 1; // minggu mulai Senin

      let html = '<div class="cal-header">' +
        '<button type="button" class="cal-nav" id="cal-prev" aria-label="Bulan sebelumnya">&laquo;</button>' +
        '<span>' + months[viewMonth] + ' ' + viewYear + '</span>' +
        '<button type="button" class="cal-nav" id="cal-next" aria-label="Bulan berikutnya">&raquo;</button>' +
        '</div>';

      html += '<div class="cal-grid">';
      days.forEach(d => { html += '<span class="cal-day-head">' + d + '</span>'; });

      for (let i = 0; i < startOffset; i++) {
        html += '<span class="cal-day other-month"></span>';
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const isToday = (d === todayNum && viewMonth === todayMon && viewYear === todayYr) ? ' today' : '';
        html += '<span class="cal-day' + isToday + '">' + d + '</span>';
      }
      html += '</div>';
      calEl.innerHTML = html;

      // Pasang ulang event listener tiap kali kalender digambar ulang
      const prevBtn = document.getElementById('cal-prev');
      const nextBtn = document.getElementById('cal-next');
      if (prevBtn) prevBtn.addEventListener('click', function () {
        viewMonth--;
        if (viewMonth < 0) { viewMonth = 11; viewYear--; }
        renderCalendar();
      });
      if (nextBtn) nextBtn.addEventListener('click', function () {
        viewMonth++;
        if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        renderCalendar();
      });
    }

    renderCalendar();
  }

  // ===== TOMBOL KEMBALI KE ATAS =====
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      backToTopBtn.classList.toggle('show', window.scrollY > 400);
    });
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== ANIMASI MUNCUL SAAT DI-SCROLL (fade-in untuk kartu berita & widget) =====
  const revealTargets = document.querySelectorAll('.post-card-item, .post-card-small, .widget');
  if (revealTargets.length && 'IntersectionObserver' in window) {
    revealTargets.forEach(el => el.classList.add('reveal-on-scroll'));
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealTargets.forEach(el => observer.observe(el));
  }

});