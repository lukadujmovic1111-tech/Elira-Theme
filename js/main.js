/* ELIRA — v2 */
(function () {
  'use strict';

  /* ── Sticky header ── */
  const hdr = document.getElementById('hdr');
  window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  /* ── Hero slider ── */
  const slides = [...document.querySelectorAll('.hslide')];
  const dots   = [...document.querySelectorAll('.hdot')];
  let cur = 0, timer;

  function goTo(n) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
  }
  function autoPlay() { clearInterval(timer); timer = setInterval(() => goTo(cur + 1), 5500); }

  document.getElementById('h-prev').addEventListener('click', () => { goTo(cur - 1); autoPlay(); });
  document.getElementById('h-next').addEventListener('click', () => { goTo(cur + 1); autoPlay(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.i); autoPlay(); }));
  autoPlay();

  /* ── Scroll hide hero scroll indicator ── */
  const ind = document.getElementById('hscroll-ind');
  if (ind) window.addEventListener('scroll', () => {
    ind.style.opacity = window.scrollY > 80 ? '0' : '1';
  }, { passive: true });

  /* ── Search ── */
  const srchBar = document.getElementById('srch-bar');
  document.getElementById('srch-btn').addEventListener('click', () => {
    srchBar.classList.toggle('on');
    if (srchBar.classList.contains('on')) document.getElementById('srch-input').focus();
  });
  document.getElementById('srch-close').addEventListener('click', () => srchBar.classList.remove('on'));

  /* ── Mobile drawer ── */
  const mobOv  = document.getElementById('mob-ov');
  const mobDrw = document.getElementById('mob-drw');
  const hbg    = document.getElementById('hbg');

  function openDrw()  { mobDrw.classList.add('on'); mobOv.classList.add('on'); hbg.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrw() { mobDrw.classList.remove('on'); mobOv.classList.remove('on'); hbg.classList.remove('open'); document.body.style.overflow = ''; }

  hbg.addEventListener('click', () => mobDrw.classList.contains('on') ? closeDrw() : openDrw());
  document.getElementById('drw-close').addEventListener('click', closeDrw);
  mobOv.addEventListener('click', closeDrw);

  document.querySelectorAll('.drw-tog').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      const isOpen = sub.classList.contains('on');
      document.querySelectorAll('.drw-sub').forEach(s => s.classList.remove('on'));
      document.querySelectorAll('.drw-tog').forEach(b => b.classList.remove('on'));
      if (!isOpen) { sub.classList.add('on'); btn.classList.add('on'); }
    });
  });

  /* ── Cart drawer ── */
  const cartOv  = document.getElementById('cart-ov');
  const cartDrw = document.getElementById('cart-drw');
  const cbadge  = document.getElementById('cbadge');
  let cartCount = 0;

  function openCart()  { cartDrw.classList.add('on'); cartOv.classList.add('on'); document.body.style.overflow = 'hidden'; }
  function closeCart() { cartDrw.classList.remove('on'); cartOv.classList.remove('on'); document.body.style.overflow = ''; }

  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  cartOv.addEventListener('click', closeCart);

  /* ── Quick add ── */
  document.querySelectorAll('.qadd').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      cartCount++;
      cbadge.textContent = cartCount;
      cbadge.classList.add('on');
      document.getElementById('cdrw-cnt').textContent = `(${cartCount})`;
      const orig = btn.textContent;
      btn.textContent = 'Hinzugefügt ✓';
      btn.style.cssText = 'background:var(--black);color:var(--white);transform:translateY(0)';
      setTimeout(() => { btn.textContent = orig; btn.style.cssText = ''; }, 1800);
    });
  });

  /* ── Wishlist ── */
  document.querySelectorAll('.wbtn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const on = btn.hasAttribute('data-on');
      on ? btn.removeAttribute('data-on') : btn.setAttribute('data-on', '');
      btn.querySelector('path').setAttribute('fill', on ? 'none' : 'currentColor');
    });
  });

  /* ── Newsletter ── */
  document.getElementById('nl-form').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const inp = e.target.querySelector('input');
    btn.innerHTML = 'Angemeldet ✓ <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
    btn.disabled = true; inp.value = '';
    setTimeout(() => {
      btn.innerHTML = 'Anmelden <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
      btn.disabled = false;
    }, 3500);
  });

  /* ── Cookie ── */
  const cookie = document.getElementById('cookie');
  if (!localStorage.getItem('elira-ck')) setTimeout(() => cookie.classList.add('on'), 1400);
  function dismissCk() { cookie.classList.remove('on'); localStorage.setItem('elira-ck', '1'); }
  document.getElementById('ck-yes').addEventListener('click', dismissCk);
  document.getElementById('ck-no').addEventListener('click', dismissCk);

  /* ── Scroll reveal ── */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach((e, idx) => {
        if (e.isIntersecting) {
          const delay = (idx % 4) * 80;
          setTimeout(() => e.target.classList.add('vis'), delay);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('vis'));
  }

  /* ── Keyboard nav ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCart(); closeDrw(); srchBar.classList.remove('on'); }
  });

})();
