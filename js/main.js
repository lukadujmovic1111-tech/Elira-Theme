/* ELIRA — Main JS */
(function () {
  'use strict';

  /* ── Sticky header ── */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ── Hero Slider ── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  document.getElementById('hero-prev').addEventListener('click', () => { goTo(current - 1); startAuto(); });
  document.getElementById('hero-next').addEventListener('click', () => { goTo(current + 1); startAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); startAuto(); }));
  startAuto();

  /* ── Search bar ── */
  const searchBar   = document.getElementById('search-bar');
  const searchInput = document.getElementById('search-input');

  document.getElementById('search-btn').addEventListener('click', () => {
    searchBar.classList.toggle('open');
    if (searchBar.classList.contains('open')) searchInput.focus();
  });
  document.getElementById('search-close').addEventListener('click', () => {
    searchBar.classList.remove('open');
  });

  /* ── Mobile drawer ── */
  const overlay = document.getElementById('mobile-overlay');
  const drawer  = document.getElementById('mobile-drawer');
  const hamburger = document.getElementById('hamburger');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('show');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  /* Drawer accordion */
  document.querySelectorAll('.drawer-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      const open = sub.classList.contains('open');
      document.querySelectorAll('.drawer-sub').forEach(s => s.classList.remove('open'));
      document.querySelectorAll('.drawer-toggle').forEach(b => b.classList.remove('open'));
      if (!open) { sub.classList.add('open'); btn.classList.add('open'); }
    });
  });

  /* ── Cart drawer ── */
  const cartOverlay = document.getElementById('cart-overlay');
  const cartDrawer  = document.getElementById('cart-drawer');
  const cartBadge   = document.getElementById('cart-badge');
  let cartCount = 0;

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  /* Quick Add → increment cart badge */
  document.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      cartCount++;
      cartBadge.textContent = cartCount;
      cartBadge.classList.add('show');
      document.getElementById('cart-count').textContent = `(${cartCount})`;
      btn.textContent = 'Hinzugefügt ✓';
      btn.style.background = '#000';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = 'Schnell hinzufügen';
        btn.style.background = '';
        btn.style.color = '';
      }, 1800);
    });
  });

  /* ── Newsletter form ── */
  document.getElementById('nl-form').addEventListener('submit', e => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const btn   = e.target.querySelector('button');
    btn.textContent = 'Angemeldet ✓';
    btn.disabled = true;
    input.value = '';
    setTimeout(() => { btn.textContent = 'Anmelden'; btn.disabled = false; }, 3000);
  });

  /* ── Cookie banner ── */
  const cookieBanner = document.getElementById('cookie-banner');
  if (!localStorage.getItem('elira-cookies')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1200);
  }
  function dismissCookie() {
    cookieBanner.classList.remove('show');
    localStorage.setItem('elira-cookies', '1');
  }
  document.getElementById('cookie-accept').addEventListener('click', dismissCookie);
  document.getElementById('cookie-decline').addEventListener('click', dismissCookie);

  /* ── Wishlist toggle ── */
  document.querySelectorAll('.wish-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const svg = btn.querySelector('svg path');
      const active = btn.getAttribute('data-active') === '1';
      if (active) {
        svg.setAttribute('fill', 'none');
        btn.removeAttribute('data-active');
      } else {
        svg.setAttribute('fill', 'currentColor');
        btn.setAttribute('data-active', '1');
      }
    });
  });

  /* ── Smooth reveal on scroll ── */
  const revealEls = document.querySelectorAll('.prod-card, .cat-card, .value-item, .ig-item');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) {
          el.target.style.opacity = '1';
          el.target.style.transform = 'translateY(0)';
          io.unobserve(el.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = `opacity 0.45s ease ${(i % 4) * 0.07}s, transform 0.45s ease ${(i % 4) * 0.07}s`;
      io.observe(el);
    });
  }

})();
