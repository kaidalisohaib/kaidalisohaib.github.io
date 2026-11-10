// Sohaib Kaidali — portfolio. Plain JS, no dependencies.
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle (initial value is set inline in <head> to avoid a flash).
  const tb = document.querySelector('.theme');
  if (tb) tb.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    document.dispatchEvent(new Event('themechange'));
  });

  // The old site installed a caching service worker; make sure it goes away.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())).catch(() => {});
  }

  // Reveal on scroll.
  const rv = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(e => e.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(e => io.observe(e));
  }

  // Videos: load and play only while on screen. With reduced motion, show controls instead.
  const vids = document.querySelectorAll('video[data-auto]');
  if (reduce || !('IntersectionObserver' in window)) vids.forEach(v => { v.controls = true; });
  else {
    const vo = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { v.play().catch(() => { v.controls = true; }); } else v.pause();
    }), { threshold: 0.35 });
    vids.forEach(v => vo.observe(v));
  }

  // YouTube: show a thumbnail, load the player only when clicked.
  document.querySelectorAll('.yt[data-yt]').forEach(btn => btn.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + btn.dataset.yt + '?autoplay=1&rel=0';
    f.title = btn.getAttribute('aria-label').replace('Play video: ', '');
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    btn.replaceWith(f);
  }));

  // ---- Pole balancer: a cart-pole with an LQR controller the visitor can switch off. ----
  const cv = document.getElementById('pend');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const out = document.getElementById('pend-out');
  const bCtl = document.getElementById('pend-ctl');
  const bKick = document.getElementById('pend-kick');
  // Physical model: cart 1 kg, pole 0.15 kg, 1.5 m long (same length as the H2's pole).
  const M = 1.0, m = 0.15, l = 0.75, g = 9.81, FMAX = 40;
  // LQR gains for the upright linearization (Q = diag(4, 1, 40, 4), R = 0.05), computed offline.
  const K = [-8.944, -13.095, -94.358, -29.746];
  const XLIM = 2.6;                       // half-width of the track in metres
  let s, target = 0, ctl = true, fallen = 0, dragging = false, best = 0, up = 0, last = 0, vis = false, raf = 0;
  const reset = () => { s = [target * 0.3, 0, (Math.random() - 0.5) * 0.12, 0]; fallen = 0; up = 0; };
  reset();

  const deriv = (q, F) => {
    const [, xd, th, thd] = q, sn = Math.sin(th), cs = Math.cos(th);
    const tmp = (F + m * l * thd * thd * sn) / (M + m);
    const thdd = (g * sn - cs * tmp) / (l * (4 / 3 - m * cs * cs / (M + m)));
    return [xd, tmp - m * l * thdd * cs / (M + m), thd, thdd];
  };
  const force = () => {
    let F;
    if (ctl) F = -(K[0] * (s[0] - target) + K[1] * s[1] + K[2] * s[2] + K[3] * s[3]);
    else F = 60 * (target - s[0]) - 14 * s[1];        // you are the controller: the cart follows your pointer
    return Math.max(-FMAX, Math.min(FMAX, F));
  };
  const step = (dt) => {
    if (fallen) { fallen -= dt; if (fallen <= 0) reset(); return; }
    const F = force(), d = deriv(s, F);                // semi-implicit Euler, small step
    s[1] += d[1] * dt; s[3] += d[3] * dt; s[0] += s[1] * dt; s[2] += s[3] * dt;
    if (Math.abs(s[0]) > XLIM) { s[0] = Math.sign(s[0]) * XLIM; s[1] = 0; }
    if (Math.abs(s[2]) > 1.25) { fallen = 1.1; best = Math.max(best, up); }
    else up += dt;
  };

  const css = (n) => getComputedStyle(root).getPropertyValue(n).trim();
  let col = {};
  const readCols = () => { col = { ink: css('--ink'), rule: css('--rule'), soft: css('--rule-soft'), pole: css('--pole'), blue: css('--blue'), dim: css('--ink-3') }; };
  readCols(); document.addEventListener('themechange', readCols);

  let W = 0, H = 0, sc = 1;
  const size = () => {
    const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sc = Math.min(W / (2 * XLIM + 1.2), (H - 60) / 1.75);
  };
  const X = (x) => W / 2 + x * sc, Y0 = () => H - 38;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const y = Y0();
    ctx.strokeStyle = col.rule; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(X(-XLIM) - 30, y + 9); ctx.lineTo(X(XLIM) + 30, y + 9); ctx.stroke();
    ctx.strokeStyle = col.soft;
    for (let k = -Math.floor(XLIM * 2); k <= XLIM * 2; k++) { ctx.beginPath(); ctx.moveTo(X(k / 2), y + 9); ctx.lineTo(X(k / 2), y + (k % 2 ? 14 : 19)); ctx.stroke(); }
    // target marker
    ctx.fillStyle = col.blue; ctx.beginPath(); ctx.moveTo(X(target), y + 12); ctx.lineTo(X(target) - 6, y + 24); ctx.lineTo(X(target) + 6, y + 24); ctx.fill();
    // cart
    const cx = X(s[0]), cw = 0.42 * sc, ch = 0.16 * sc;
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.roundRect(cx - cw / 2, y - ch, cw, ch, 4); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - cw * 0.3, y + 3, 6, 0, 7); ctx.arc(cx + cw * 0.3, y + 3, 6, 0, 7); ctx.fill();
    // pole
    const L = 2 * l * sc, px = cx + Math.sin(s[2]) * L, py = y - ch - Math.cos(s[2]) * L;
    ctx.strokeStyle = col.pole; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.globalAlpha = fallen ? 0.45 : 1;
    ctx.beginPath(); ctx.moveTo(cx, y - ch); ctx.lineTo(px, py); ctx.stroke(); ctx.globalAlpha = 1;
    if (!dragging && up < 2.5 && !fallen) {
      ctx.fillStyle = col.dim; ctx.font = '13px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(ctl ? 'move your pointer: the cart follows, the pole stays up' : 'your turn: move the cart to keep the pole up', W / 2, 22);
    }
    if (out) out.textContent = `lean ${(s[2] * 57.3).toFixed(1).padStart(5)}°  ·  up ${up.toFixed(1)} s` + (!ctl && best ? `  ·  best ${best.toFixed(1)} s` : '');
  };
  const loop = (t) => {
    raf = 0;
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    const n = Math.max(1, Math.round(dt / 0.004));
    for (let i = 0; i < n; i++) step(dt / n);
    draw();
    if (vis) raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!raf && vis) { last = performance.now(); raf = requestAnimationFrame(loop); } };

  const setTarget = (e) => {
    const r = cv.getBoundingClientRect();
    target = Math.max(-XLIM + 0.3, Math.min(XLIM - 0.3, (e.clientX - r.left - W / 2) / sc));
  };
  cv.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || dragging) setTarget(e); });
  cv.addEventListener('pointerdown', (e) => { dragging = true; cv.setPointerCapture(e.pointerId); setTarget(e); });
  cv.addEventListener('pointerup', () => { dragging = false; });
  cv.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') target = Math.max(-XLIM + 0.3, target - 0.3);
    else if (e.key === 'ArrowRight') target = Math.min(XLIM - 0.3, target + 0.3);
    else return;
    e.preventDefault();
  });
  bCtl && bCtl.addEventListener('click', () => {
    ctl = !ctl; best = 0; up = 0;
    bCtl.setAttribute('aria-pressed', String(ctl));
    bCtl.textContent = ctl ? 'Controller: on' : 'Controller: off';
  });
  bKick && bKick.addEventListener('click', () => { if (!fallen) s[3] += (Math.random() < 0.5 ? -1 : 1) * 1.1; });

  addEventListener('resize', () => { size(); draw(); });
  size(); draw();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { vis = es[0].isIntersecting; start(); }, { threshold: 0.1 }).observe(cv);
  } else { vis = true; start(); }
})();
