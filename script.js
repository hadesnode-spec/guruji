/* ══════════════════════════════════════════════════════════════
   Sri Guruji Yoga & Spiritual Center — JavaScript
   Handles: sticky nav highlight, testimonial slider,
            mobile nav toggle, scroll animations
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Mobile Nav Toggle ─────────────────────────────────── */
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    // Close nav on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.textContent = '☰';
      });
    });
  }

  /* ─── Active Nav on Scroll ──────────────────────────────── */
  const sections = document.querySelectorAll('main section[id], main [id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink () {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 100) current = section.getAttribute('id');
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) link.classList.add('active');
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ─── Sticky Nav Shadow on Scroll ───────────────────────── */
  const stickyNav = document.getElementById('sticky-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      stickyNav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.10)';
    } else {
      stickyNav.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
    }
  }, { passive: true });

  /* ─── Testimonial Slider ────────────────────────────────── */
  const track      = document.getElementById('testimonial-track');
  const dotsWrap   = document.getElementById('slider-dots');
  const prevBtn    = document.getElementById('slider-prev');
  const nextBtn    = document.getElementById('slider-next');

  if (track && dotsWrap && prevBtn && nextBtn) {
    const cards    = Array.from(track.querySelectorAll('.testimonial-card'));
    let current    = 0;
    let visibleCount = 3;
    let autoPlay;

    function getVisibleCount () {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1100) return 2;
      return 3;
    }

    function totalSlides () {
      return Math.max(1, cards.length - visibleCount + 1);
    }

    function buildDots () {
      dotsWrap.innerHTML = '';
      const n = totalSlides();
      for (let i = 0; i < n; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots () {
      dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function getCardWidth () {
      if (cards.length === 0) return 0;
      const gap = 24;
      const trackWidth = track.parentElement.offsetWidth;
      return (trackWidth - gap * (visibleCount - 1)) / visibleCount + gap;
    }

    function goTo (index) {
      const n = totalSlides();
      current = Math.max(0, Math.min(index, n - 1));
      const offset = current * getCardWidth();
      track.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    function next () { goTo(current + 1 < totalSlides() ? current + 1 : 0); }
    function prev () { goTo(current - 1 >= 0 ? current - 1 : totalSlides() - 1); }

    function init () {
      visibleCount = getVisibleCount();
      current = 0;
      buildDots();
      goTo(0);
    }

    nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });
    prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });

    function resetAutoPlay () {
      clearInterval(autoPlay);
      autoPlay = setInterval(next, 5000);
    }

    window.addEventListener('resize', () => { init(); }, { passive: true });

    init();
    autoPlay = setInterval(next, 5000);

    // Pause on hover
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.parentElement.addEventListener('mouseleave', () => { autoPlay = setInterval(next, 5000); });

    // Touch/swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    }, { passive: true });
  }

  /* ─── Scroll Reveal Animation ───────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.card, .section-header, .center-feature, .hero-trust, .contact-item'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
      observer.observe(el);
    });
  }

  /* ─── Smooth scroll offset for sticky nav ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = stickyNav ? stickyNav.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
