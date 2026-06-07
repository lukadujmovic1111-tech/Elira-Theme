/* ===========================================
   ELIRA — Premium Interactions v3.0
   =========================================== */
(function () {
  'use strict';

  /* ─────────────────────────────────────────
     HEADER: hide on scroll-down, show on scroll-up
  ───────────────────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    let lastY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          header.classList.toggle('is-scrolled', y > 10);
          if (y > 80) {
            header.classList.toggle('is-hidden', y > lastY);
          }
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     HERO SLIDER
  ───────────────────────────────────────── */
  (function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.slider-dot');
    if (!slides.length) return;

    let current = 0;
    let timer;

    function goTo(n) {
      slides[current].classList.remove('is-active');
      if (dots[current]) dots[current].classList.remove('is-active');
      current = ((n % slides.length) + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (dots[current]) dots[current].classList.add('is-active');
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 5500);
    }

    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));

    startAuto();

    // Touch/swipe
    const sliderEl = document.querySelector('.hero-slider');
    if (sliderEl) {
      let sx = 0;
      sliderEl.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
      sliderEl.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 48) { goTo(dx < 0 ? current + 1 : current - 1); startAuto(); }
      }, { passive: true });
    }
  })();

  /* ─────────────────────────────────────────
     SEARCH
  ───────────────────────────────────────── */
  (function initSearch() {
    const bar   = document.getElementById('search-bar');
    const input = document.getElementById('search-input');
    const btn   = document.getElementById('search-btn');
    const close = document.getElementById('search-close');
    if (!bar) return;

    btn.addEventListener('click', () => {
      bar.classList.toggle('is-open');
      if (bar.classList.contains('is-open')) setTimeout(() => input && input.focus(), 50);
    });
    close && close.addEventListener('click', () => bar.classList.remove('is-open'));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') bar.classList.remove('is-open');
    });
  })();

  /* ─────────────────────────────────────────
     MOBILE DRAWER
  ───────────────────────────────────────── */
  (function initMobileDrawer() {
    const overlay   = document.getElementById('mobile-overlay');
    const drawer    = document.getElementById('mobile-drawer');
    const hamburger = document.getElementById('hamburger');
    const closeBtn  = document.getElementById('drawer-close');
    if (!drawer) return;

    function open() {
      drawer.classList.add('is-open');
      overlay && overlay.classList.add('is-show');
      hamburger && hamburger.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      drawer.classList.remove('is-open');
      overlay && overlay.classList.remove('is-show');
      hamburger && hamburger.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    hamburger && hamburger.addEventListener('click', () =>
      drawer.classList.contains('is-open') ? close() : open()
    );
    closeBtn && closeBtn.addEventListener('click', close);
    overlay  && overlay.addEventListener('click', close);

    // Accordion
    document.querySelectorAll('.drawer-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub  = btn.nextElementSibling;
        const open = sub && sub.classList.contains('is-open');
        document.querySelectorAll('.drawer-sub').forEach(s => s.classList.remove('is-open'));
        document.querySelectorAll('.drawer-toggle').forEach(b => b.classList.remove('is-open'));
        if (!open && sub) { sub.classList.add('is-open'); btn.classList.add('is-open'); }
      });
    });
  })();

  /* ─────────────────────────────────────────
     CART DRAWER
  ───────────────────────────────────────── */
  (function initCartDrawer() {
    const overlay  = document.getElementById('cart-overlay');
    const drawer   = document.getElementById('cart-drawer');
    const openBtn  = document.getElementById('cart-btn');
    const closeBtn = document.getElementById('cart-close');
    const badge    = document.getElementById('cart-badge');
    if (!drawer) return;

    function openCart() {
      drawer.classList.add('is-open');
      overlay && overlay.classList.add('is-show');
      document.body.style.overflow = 'hidden';
    }
    function closeCart() {
      drawer.classList.remove('is-open');
      overlay && overlay.classList.remove('is-show');
      document.body.style.overflow = '';
    }

    openBtn  && openBtn.addEventListener('click', openCart);
    closeBtn && closeBtn.addEventListener('click', closeCart);
    overlay  && overlay.addEventListener('click', closeCart);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

    // Cart quantity buttons
    document.addEventListener('click', async e => {
      const btn = e.target.closest('.qty-btn');
      if (!btn) return;
      const key = btn.dataset.id;
      const qty = parseInt(btn.dataset.qty, 10);
      if (!key) return;
      try {
        await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: key, quantity: Math.max(0, qty) })
        });
        refreshCart();
      } catch (_) {}
    });

    async function refreshCart() {
      try {
        const res  = await fetch('/cart.js');
        const data = await res.json();
        const count = data.item_count || 0;
        if (badge) {
          badge.textContent = count;
          badge.classList.toggle('show', count > 0);
        }
        const countEl = document.getElementById('cart-count');
        if (countEl) countEl.textContent = `(${count})`;
      } catch (_) {}
    }

    // Quick-add (product grid)
    document.addEventListener('click', async e => {
      const btn = e.target.closest('.quick-add');
      if (!btn) return;
      const variantId = btn.dataset.variantId;
      if (!variantId) return;

      const orig = btn.textContent;
      btn.textContent = '…';
      btn.disabled = true;

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });
        if (res.ok) {
          btn.textContent = 'Hinzugefügt ✓';
          refreshCart();
          setTimeout(() => openCart(), 400);
        } else {
          btn.textContent = 'Nicht verfügbar';
        }
      } catch (_) {
        btn.textContent = 'Fehler';
      } finally {
        btn.disabled = false;
        setTimeout(() => { btn.textContent = orig; }, 2200);
      }
    });

    // Expose refreshCart globally for the product form
    window.eliraRefreshCart = refreshCart;
  })();

  /* ─────────────────────────────────────────
     PRODUCT PAGE
  ───────────────────────────────────────── */
  (function initProductPage() {
    // Gallery thumbnails
    const mainImg = document.getElementById('pdp-main-img');
    document.querySelectorAll('.pdp-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.src;
        const src2x = thumb.dataset.src2x || src;
        if (mainImg) {
          mainImg.src = src2x;
          mainImg.srcset = '';
        }
        document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
    });

    // Variant selection
    const variantInput  = document.getElementById('variant-id');
    const variantData   = window.__eliraVariants;
    const optionEls     = document.querySelectorAll('[data-option-index]');

    if (!variantInput || !variantData) return;

    let selectedOptions = Array.from(document.querySelectorAll('.size-btn.is-active, .swatch.is-active'))
      .map(el => el.dataset.value);

    function updateSelectedOption(index, value) {
      selectedOptions[index] = value;
    }

    function findVariant() {
      return variantData.find(v =>
        v.options.every((o, i) => o === selectedOptions[i])
      );
    }

    function applyVariant(variant) {
      if (!variant) return;
      variantInput.value = variant.id;

      // Price
      const priceEl = document.getElementById('pdp-price');
      const origEl  = document.getElementById('pdp-compare-price');
      if (priceEl) priceEl.textContent = formatMoney(variant.price);
      if (origEl) {
        if (variant.compare_at_price > variant.price) {
          origEl.textContent = formatMoney(variant.compare_at_price);
          origEl.style.display = '';
        } else {
          origEl.style.display = 'none';
        }
      }

      // ATC state
      const atcBtn   = document.getElementById('atc-btn');
      const stickyBtn = document.getElementById('sticky-atc-btn');
      const available = variant.available;
      [atcBtn, stickyBtn].forEach(btn => {
        if (!btn) return;
        btn.disabled = !available;
        btn.textContent = available ? 'In den Warenkorb' : 'Ausverkauft';
      });

      // Image
      if (variant.featured_image && mainImg) {
        const src = variant.featured_image.src;
        mainImg.src = src.replace(/\.jpg|\.png|\.webp/, '_900x.$&'.split('.').pop());
      }
    }

    // Size button clicks
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('oos')) return;
        const idx = parseInt(btn.dataset.optionIndex, 10);
        const val = btn.dataset.value;

        document.querySelectorAll(`.size-btn[data-option-index="${idx}"]`)
          .forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        updateSelectedOption(idx, val);
        const optValEl = document.getElementById(`opt-val-${idx}`);
        if (optValEl) optValEl.textContent = val;

        applyVariant(findVariant());
      });
    });

    // Swatch clicks
    document.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        if (sw.classList.contains('swatch--oos')) return;
        const idx = parseInt(sw.dataset.optionIndex, 10);
        const val = sw.dataset.value;

        document.querySelectorAll(`.swatch[data-option-index="${idx}"]`)
          .forEach(s => s.classList.remove('is-active'));
        sw.classList.add('is-active');

        updateSelectedOption(idx, val);
        const optValEl = document.getElementById(`opt-val-${idx}`);
        if (optValEl) optValEl.textContent = val;

        applyVariant(findVariant());
      });
    });

    // Product form submit
    const form = document.getElementById('product-form');
    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const atcBtn = document.getElementById('atc-btn');
        if (atcBtn) { atcBtn.disabled = true; atcBtn.textContent = 'Wird hinzugefügt…'; }

        try {
          const res = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: variantInput.value,
              quantity: parseInt(document.getElementById('pdp-qty')?.value || '1', 10)
            })
          });
          if (res.ok) {
            if (atcBtn) atcBtn.textContent = 'Hinzugefügt ✓';
            if (window.eliraRefreshCart) window.eliraRefreshCart();
            setTimeout(() => {
              const cartDrawer = document.getElementById('cart-drawer');
              const cartOverlay = document.getElementById('cart-overlay');
              if (cartDrawer) cartDrawer.classList.add('is-open');
              if (cartOverlay) cartOverlay.classList.add('is-show');
              document.body.style.overflow = 'hidden';
              if (atcBtn) { atcBtn.disabled = false; atcBtn.textContent = 'In den Warenkorb'; }
            }, 600);
          }
        } catch (_) {
          if (atcBtn) { atcBtn.disabled = false; atcBtn.textContent = 'Fehler – erneut versuchen'; }
        }
      });
    }

    // Sticky ATC
    const stickyAtc  = document.getElementById('sticky-atc');
    const formAnchor = document.getElementById('pdp-form-anchor');
    if (stickyAtc && formAnchor) {
      const io = new IntersectionObserver(([entry]) => {
        stickyAtc.classList.toggle('is-visible', !entry.isIntersecting);
      });
      io.observe(formAnchor);

      const stickySubmit = document.getElementById('sticky-atc-submit');
      stickySubmit && stickySubmit.addEventListener('click', () => {
        document.getElementById('atc-btn')?.click();
      });
    }

    // Quantity control
    const qtyInput = document.getElementById('pdp-qty');
    document.querySelectorAll('.pdp-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!qtyInput) return;
        const delta = btn.dataset.delta === '+' ? 1 : -1;
        const next  = Math.max(1, parseInt(qtyInput.value, 10) + delta);
        qtyInput.value = next;
      });
    });
  })();

  /* ─────────────────────────────────────────
     PRODUCT PAGE TABS
  ───────────────────────────────────────── */
  (function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const parent = btn.closest('.pdp-tabs');
        if (!parent) return;
        parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('is-active'));
        parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));
        btn.classList.add('is-active');
        const panel = parent.querySelector(`[data-panel="${target}"]`);
        if (panel) panel.classList.add('is-active');
      });
    });
  })();

  /* ─────────────────────────────────────────
     SIZE GUIDE MODAL
  ───────────────────────────────────────── */
  (function initSizeGuide() {
    const modal   = document.getElementById('size-guide-modal');
    const overlay = document.getElementById('size-guide-overlay');
    if (!modal) return;

    document.querySelectorAll('[data-open-size-guide]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        modal.classList.add('is-open');
        overlay.classList.add('is-show');
        document.body.style.overflow = 'hidden';
      });
    });
    function close() {
      modal.classList.remove('is-open');
      overlay.classList.remove('is-show');
      document.body.style.overflow = '';
    }
    overlay.addEventListener('click', close);
    modal.querySelector('.modal-close')?.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  })();

  /* ─────────────────────────────────────────
     TESTIMONIALS SLIDER
  ───────────────────────────────────────── */
  (function initTestimonialsSlider() {
    const track   = document.querySelector('.testimonials-track');
    const prevBtn = document.getElementById('t-prev');
    const nextBtn = document.getElementById('t-next');
    if (!track) return;

    let pos = 0;

    function slide(dir) {
      const card    = track.querySelector('.testimonial-card');
      if (!card) return;
      const cardW   = card.offsetWidth + 24; // card + gap
      const maxPos  = track.scrollWidth - track.parentElement.offsetWidth;
      pos = Math.max(0, Math.min(pos + dir * cardW, maxPos));
      track.style.transform = `translateX(-${pos}px)`;
    }

    prevBtn && prevBtn.addEventListener('click', () => slide(-1));
    nextBtn && nextBtn.addEventListener('click', () => slide(1));

    // Touch swipe
    let sx = 0;
    track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 48) slide(dx < 0 ? 1 : -1);
    }, { passive: true });
  })();

  /* ─────────────────────────────────────────
     FILTER ACCORDION (Collection)
  ───────────────────────────────────────── */
  (function initFilters() {
    document.querySelectorAll('.filter-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('is-open');
        const opts = btn.nextElementSibling;
        if (opts) {
          opts.style.display = opts.style.display === 'none' ? '' : 'none';
        }
      });
    });
  })();

  /* ─────────────────────────────────────────
     NEWSLETTER FORM
  ───────────────────────────────────────── */
  (function initNewsletter() {
    document.querySelectorAll('.nl-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('.nl-input');
        const btn   = form.querySelector('.nl-btn');
        if (!btn) return;
        btn.textContent = 'Angemeldet ✓';
        btn.disabled = true;
        if (input) input.value = '';
        setTimeout(() => { btn.textContent = 'Anmelden'; btn.disabled = false; }, 4000);
      });
    });
  })();

  /* ─────────────────────────────────────────
     COOKIE BANNER
  ───────────────────────────────────────── */
  (function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner || localStorage.getItem('elira-consent')) return;
    setTimeout(() => banner.classList.add('is-show'), 1400);
    function dismiss() {
      banner.classList.remove('is-show');
      localStorage.setItem('elira-consent', '1');
    }
    document.getElementById('cookie-accept')?.addEventListener('click', dismiss);
    document.getElementById('cookie-decline')?.addEventListener('click', dismiss);
  })();

  /* ─────────────────────────────────────────
     WISHLIST TOGGLE
  ───────────────────────────────────────── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.wish-btn');
    if (!btn) return;
    e.preventDefault();
    const active = btn.dataset.active === '1';
    if (active) {
      delete btn.dataset.active;
      btn.removeAttribute('data-active');
    } else {
      btn.dataset.active = '1';
    }
  });

  /* ─────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────── */
  (function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  })();

  /* ─────────────────────────────────────────
     UTILITY: format money (Shopify cents → EUR)
  ───────────────────────────────────────── */
  function formatMoney(cents) {
    return (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  }

})();
