/* ============================================================
   ELIRA — Theme JavaScript
   Vanilla JS, keine Abhängigkeiten.
   ============================================================ */
(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ──────────────────────────────────────────
     Announcement-Rotation
  ────────────────────────────────────────── */
  function initAnnouncement() {
    const msgs = $$('.ann-msg');
    if (msgs.length < 2) return;
    let i = 0;
    setInterval(() => {
      msgs[i].classList.remove('active');
      i = (i + 1) % msgs.length;
      msgs[i].classList.add('active');
    }, 4200);
  }

  /* ──────────────────────────────────────────
     Header: Schatten beim Scrollen
  ────────────────────────────────────────── */
  function initHeader() {
    const hdr = $('#SiteHeader');
    if (!hdr) return;
    const onScroll = () => hdr.classList.toggle('is-stuck', window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ──────────────────────────────────────────
     Overlay / Drawer-Verwaltung
  ────────────────────────────────────────── */
  const overlay = () => $('#PageOverlay');
  let openPanel = null;

  function openDrawer(panel) {
    if (!panel) return;
    closeDrawer();
    panel.classList.add('open');
    overlay() && overlay().classList.add('show');
    document.body.style.overflow = 'hidden';
    openPanel = panel;
  }
  function closeDrawer() {
    if (openPanel) openPanel.classList.remove('open');
    $$('.mdrawer.open, .cdrawer.open, .fdrawer.open, .search-ov.open').forEach(el => el.classList.remove('open'));
    overlay() && overlay().classList.remove('show');
    document.body.style.overflow = '';
    openPanel = null;
  }

  function initDrawers() {
    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-open-drawer]');
      if (opener) {
        e.preventDefault();
        const panel = $(opener.getAttribute('data-open-drawer'));
        if (panel && panel.classList.contains('search-ov')) {
          panel.classList.add('open');
          const inp = $('input', panel);
          inp && setTimeout(() => inp.focus(), 120);
          openPanel = panel;
          overlay() && overlay().classList.add('show');
        } else {
          openDrawer(panel);
        }
        return;
      }
      if (e.target.closest('[data-close-drawer]')) { e.preventDefault(); closeDrawer(); return; }
      if (e.target.id === 'PageOverlay') closeDrawer();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

    /* Mobile Untermenüs */
    document.addEventListener('click', (e) => {
      const tog = e.target.closest('.mdrawer__toggle');
      if (!tog) return;
      tog.classList.toggle('open');
      const sub = tog.nextElementSibling;
      sub && sub.classList.toggle('open');
    });
  }

  /* ──────────────────────────────────────────
     Hero-Slider (Fade, Autoplay)
  ────────────────────────────────────────── */
  function initHero() {
    $$('.hero').forEach((hero) => {
      const slides = $$('.hero__slide', hero);
      if (slides.length < 2) return;
      const dots = $$('.hero__dot', hero);
      const count = $('.hero__count', hero);
      let i = 0, timer = null;

      const go = (n) => {
        slides[i].classList.remove('active');
        dots[i] && dots[i].classList.remove('active');
        i = (n + slides.length) % slides.length;
        slides[i].classList.add('active');
        dots[i] && dots[i].classList.add('active');
        if (count) count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      };
      const play = () => { timer = setInterval(() => go(i + 1), 6000); };

      dots.forEach((d, n) => d.addEventListener('click', () => { clearInterval(timer); go(n); play(); }));
      play();
    });
  }

  /* ──────────────────────────────────────────
     Produkt-Carousel (Scroll-Snap + Pfeile + Fortschritt)
  ────────────────────────────────────────── */
  function initCarousels() {
    $$('[data-carousel]').forEach((root) => {
      const track = $('.carousel__track', root);
      if (!track) return;
      const prev = $('[data-car-prev]', root);
      const next = $('[data-car-next]', root);
      const bar  = $('.car-progress__bar', root);
      const count = $('.car-count', root);
      const items = $$('.carousel__item', track);

      const step = () => {
        const item = items[0];
        return item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 16) : 320;
      };

      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        const ratio = max > 0 ? track.scrollLeft / max : 0;
        if (bar) {
          const visible = Math.max(track.clientWidth / track.scrollWidth, 0.1);
          bar.style.width = (visible * 100) + '%';
          bar.style.transform = 'translateX(' + (ratio * (100 / visible - 100)) + '%)';
        }
        if (count && items.length) {
          const perView = Math.max(1, Math.round(track.clientWidth / step()));
          const idx = Math.min(items.length, Math.round(track.scrollLeft / step()) + perView);
          count.textContent = String(idx).padStart(2, '0') + ' — ' + String(items.length).padStart(2, '0');
        }
        if (prev) prev.toggleAttribute('disabled', track.scrollLeft <= 2);
        if (next) next.toggleAttribute('disabled', track.scrollLeft >= max - 2);
      };

      prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
      next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  /* ──────────────────────────────────────────
     Reveal on Scroll
  ────────────────────────────────────────── */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ──────────────────────────────────────────
     Accordions
  ────────────────────────────────────────── */
  function initAccordions() {
    document.addEventListener('click', (e) => {
      const head = e.target.closest('.acc__head');
      if (!head) return;
      head.closest('.accordion').classList.toggle('open');
    });
  }

  /* ──────────────────────────────────────────
     Warenkorb (AJAX + Section Rendering)
  ────────────────────────────────────────── */
  async function refreshCartDrawer(openAfter) {
    try {
      const res = await fetch(window.Shopify && Shopify.routes ? Shopify.routes.root + '?sections=cart-drawer' : '/?sections=cart-drawer');
      const data = await res.json();
      const holder = document.getElementById('shopify-section-cart-drawer');
      if (holder && data['cart-drawer']) {
        const tmp = document.createElement('div');
        tmp.innerHTML = data['cart-drawer'];
        const fresh = tmp.querySelector('.cdrawer') || tmp.firstElementChild;
        const current = holder.querySelector('.cdrawer');
        if (fresh && current) current.replaceWith(fresh);
        const drawer = holder.querySelector('.cdrawer');
        const n = parseInt(drawer && drawer.dataset.itemCount || '0', 10);
        updateBagCount(n);
        if (openAfter && drawer) openDrawer(drawer);
      }
    } catch (err) { /* still */ }
  }

  function updateBagCount(n) {
    $$('.bag-count').forEach((b) => {
      b.textContent = n;
      b.classList.toggle('show', n > 0);
    });
  }

  async function addToCart(variantId, qty) {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: Number(variantId), quantity: qty || 1 })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.description || 'Konnte nicht hinzugefügt werden.');
    }
    await refreshCartDrawer(true);
  }

  async function changeLine(key, qty) {
    await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    });
    if (document.body.classList.contains('template-cart')) {
      window.location.reload();
    } else {
      const wasOpen = !!$('.cdrawer.open');
      await refreshCartDrawer(wasOpen);
    }
  }

  function initCart() {
    /* Quick-Add & ATC-Buttons (Delegation, übersteht Re-Render) */
    document.addEventListener('click', async (e) => {
      const qa = e.target.closest('[data-add-variant]');
      if (qa) {
        e.preventDefault();
        qa.classList.add('is-disabled');
        try { await addToCart(qa.getAttribute('data-add-variant'), 1); }
        catch (err) { alert(err.message); }
        qa.classList.remove('is-disabled');
        return;
      }
      const qtyBtn = e.target.closest('[data-qty-change]');
      if (qtyBtn) {
        e.preventDefault();
        changeLine(qtyBtn.getAttribute('data-line-key'), parseInt(qtyBtn.getAttribute('data-qty-change'), 10));
        return;
      }
      const rm = e.target.closest('[data-line-remove]');
      if (rm) {
        e.preventDefault();
        changeLine(rm.getAttribute('data-line-remove'), 0);
      }
    });

    /* PDP-Formular */
    $$('form[data-product-form]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = $('[type="submit"]', form);
        const id = $('[name="id"]', form).value;
        const qty = parseInt(($('[name="quantity"]', form) || {}).value || '1', 10);
        const label = btn.textContent;
        btn.disabled = true; btn.textContent = 'Wird hinzugefügt …';
        try { await addToCart(id, qty); }
        catch (err) { alert(err.message); }
        btn.disabled = false; btn.textContent = label;
      });
    });

    /* PDP-Mengenwahl */
    document.addEventListener('click', (e) => {
      const st = e.target.closest('[data-qty-step]');
      if (!st) return;
      const input = $(st.getAttribute('data-qty-step'));
      if (!input) return;
      const v = Math.max(1, parseInt(input.value || '1', 10) + (st.hasAttribute('data-up') ? 1 : -1));
      input.value = v;
      const out = $('[data-qty-display]', st.closest('.qty'));
      if (out) out.textContent = v;
    });
  }

  /* ──────────────────────────────────────────
     PDP: Variantenwahl
  ────────────────────────────────────────── */
  function initVariantPicker() {
    const root = $('[data-product-root]');
    if (!root) return;
    const dataEl = $('#ProductJson');
    if (!dataEl) return;
    const product = JSON.parse(dataEl.textContent);
    const form = $('form[data-product-form]', root);
    const idInput = $('[name="id"]', form);
    const priceEl = $('[data-pdp-price]', root);
    const btn = $('[data-pdp-atc]', root);

    const currentOptions = () =>
      $$('[data-option-group]', root).map((g) => {
        const checked = $('input:checked', g);
        return checked ? checked.value : null;
      });

    function match() {
      const opts = currentOptions();
      return product.variants.find(v => v.options.every((o, i) => o === opts[i]));
    }

    function render() {
      const v = match();
      $$('[data-option-group]', root).forEach((g) => {
        const cur = $('input:checked', g);
        const out = $('.opt-current', g);
        if (out && cur) out.textContent = cur.value;
      });
      if (!v) {
        btn.textContent = 'Nicht verfügbar'; btn.disabled = true;
        return;
      }
      idInput.value = v.id;
      if (priceEl) {
        priceEl.innerHTML = v.compare_at_price > v.price
          ? '<span class="price"><span class="price__sale">' + v.price_formatted + '</span><s class="price__compare">' + v.compare_at_formatted + '</s></span>'
          : '<span class="price">' + v.price_formatted + '</span>';
      }
      if (v.available) { btn.disabled = false; btn.textContent = btn.dataset.label || 'In den Warenkorb'; }
      else { btn.disabled = true; btn.textContent = 'Ausverkauft'; }
      const url = new URL(window.location);
      url.searchParams.set('variant', v.id);
      window.history.replaceState({}, '', url);
    }

    $$('[data-option-group] input', root).forEach(i => i.addEventListener('change', render));
    render();
  }

  /* ──────────────────────────────────────────
     Collection: Sortierung & Filter
  ────────────────────────────────────────── */
  function initCollection() {
    const sort = $('[data-sort-select]');
    if (sort) {
      sort.addEventListener('change', () => {
        const url = new URL(window.location);
        url.searchParams.set('sort_by', sort.value);
        url.searchParams.delete('page');
        window.location = url;
      });
    }
    const facetForm = $('#FacetsForm');
    if (facetForm) {
      facetForm.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"]')) facetForm.submit();
      });
    }
  }

  /* ──────────────────────────────────────────
     Cookie-Hinweis
  ────────────────────────────────────────── */
  function initCookie() {
    const box = $('#CookieNote');
    if (!box) return;
    try {
      if (localStorage.getItem('elira-cookie')) return;
    } catch (e) { return; }
    setTimeout(() => box.classList.add('show'), 1600);
    $$('[data-cookie-choice]', box).forEach((b) => {
      b.addEventListener('click', () => {
        try { localStorage.setItem('elira-cookie', b.getAttribute('data-cookie-choice')); } catch (e) {}
        box.classList.remove('show');
      });
    });
  }

  /* ──────────────────────────────────────────
     Init
  ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initAnnouncement();
    initHeader();
    initDrawers();
    initHero();
    initCarousels();
    initReveal();
    initAccordions();
    initCart();
    initVariantPicker();
    initCollection();
    initCookie();
  });
})();
