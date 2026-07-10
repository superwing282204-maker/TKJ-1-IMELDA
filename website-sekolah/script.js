// ===================================================
// SCRIPT WEBSITE SEKOLAH
// ===================================================

document.addEventListener('DOMContentLoaded', function () {

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
      navMenu.classList.toggle('open');
    });
    // Mobile: dropdown toggle on click
    navMenu.querySelectorAll('.has-dropdown > a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = this.parentElement;
          parent.classList.toggle('open');
        }
      });
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
    function resetAuto() { clearInterval(autoSlide); startAuto(); }
    startAuto();
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

  // ===== KALENDER WIDGET =====
  const calEl = document.getElementById('calendar-widget');
  if (calEl) {
    const now     = new Date();
    const year    = now.getFullYear();
    const month   = now.getMonth();
    const today   = now.getDate();
    const months  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const days    = ['M','T','W','T','F','S','S'];

    const firstDay   = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth= new Date(year, month + 1, 0).getDate();

    // Adjust: week starts Monday
    const startOffset = (firstDay === 0) ? 6 : firstDay - 1;

    let html = '<div class="cal-header"><span>&laquo;</span><span>' + months[month] + ' ' + year + '</span><span>&raquo;</span></div>';
    html += '<div class="cal-grid">';
    days.forEach(d => { html += '<span class="cal-day-head">' + d + '</span>'; });

    for (let i = 0; i < startOffset; i++) {
      html += '<span class="cal-day other-month"></span>';
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = (d === today) ? ' today' : '';
      html += '<span class="cal-day' + isToday + '">' + d + '</span>';
    }
    html += '</div>';
    calEl.innerHTML = html;
  }

});