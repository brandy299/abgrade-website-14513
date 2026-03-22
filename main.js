/* ═══════════════════════════════════════════
   AbGradE — main.js
   Starfield · Organic Cells · DNA Helix
   Nav · Tabs · Stats Count-Up · Scroll Reveal
   ═══════════════════════════════════════════ */

/* ── STARFIELD + ORGANIC LAYER ──────────────── */
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let stars = [];
  let cells = [];
  let shooting = null, shootTimer = 0;

  /* resize */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Stars ── */
  function mkStar() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.15,
      a: Math.random() * 0.8 + 0.1,
      tw: Math.random() * Math.PI * 2,
      ts: Math.random() * 0.018 + 0.004,
      col: Math.random() > 0.9 ? '#7b5fff' : Math.random() > 0.78 ? '#00d2ff' : '#ffffff',
    };
  }
  function initStars() {
    stars = Array.from({ length: Math.floor((W * H) / 4000) }, mkStar);
  }

  /* ── Organic Cells ── */
  function mkCell() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 9 + 5,          // radius 5–14px
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      pulse:  Math.random() * Math.PI * 2,
      pSpeed: Math.random() * 0.012 + 0.004,
      hue: Math.random() > 0.45 ? 'green' : 'cyan', // mix of bio-green and space-cyan
    };
  }
  function initCells() {
    const n = Math.max(10, Math.floor((W * H) / 55000));
    cells = Array.from({ length: n }, mkCell);
  }

  function drawCells() {
    // connection lines first (behind cells)
    for (let i = 0; i < cells.length; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const dx = cells[i].x - cells[j].x;
        const dy = cells[i].y - cells[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          const alpha = 0.09 * (1 - dist / 220);
          ctx.beginPath();
          ctx.moveTo(cells[i].x, cells[i].y);
          ctx.lineTo(cells[j].x, cells[j].y);
          ctx.strokeStyle = `rgba(0, 232, 123, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // draw each cell
    cells.forEach(c => {
      // drift + wrap
      c.x += c.vx; c.y += c.vy;
      if (c.x < -20) c.x = W + 20;
      if (c.x > W + 20) c.x = -20;
      if (c.y < -20) c.y = H + 20;
      if (c.y > H + 20) c.y = -20;

      c.pulse += c.pSpeed;
      const pf = 0.92 + 0.08 * Math.sin(c.pulse);
      const r  = c.r * pf;

      const isGreen = c.hue === 'green';
      const colRgb  = isGreen ? '0, 232, 123' : '0, 210, 255';

      // outer halo
      ctx.beginPath();
      ctx.arc(c.x, c.y, r * 1.7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${colRgb}, 0.06)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // outer membrane
      ctx.beginPath();
      ctx.arc(c.x, c.y, r * 1.25, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${colRgb}, 0.14)`;
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // inner membrane
      ctx.beginPath();
      ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${colRgb}, 0.28)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // nucleus glow
      const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r * 0.55);
      grad.addColorStop(0, `rgba(${colRgb}, 0.18)`);
      grad.addColorStop(1, `rgba(${colRgb}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* ── Nebula (static backdrop) ── */
  function drawNebula() {
    // space nebula (blue/violet)
    [[W * .18, H * .28, W * .28, '123,95,255,'],
     [W * .82, H * .62, W * .32, '0,210,255,'],
    ].forEach(([cx, cy, r, col]) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${col}0.036)`);
      g.addColorStop(1, `rgba(${col}0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
    // biology nebula (green)
    const g2 = ctx.createRadialGradient(W * .55, H * .75, 0, W * .55, H * .75, W * .24);
    g2.addColorStop(0, 'rgba(0,232,123,0.028)');
    g2.addColorStop(1, 'rgba(0,232,123,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  }

  /* ── Shooting star ── */
  function drawShoot(s) {
    const len = 110;
    const g = ctx.createLinearGradient(s.x, s.y, s.x - len * Math.cos(s.a), s.y - len * Math.sin(s.a));
    g.addColorStop(0, 'rgba(0,210,255,0.85)');
    g.addColorStop(1, 'rgba(0,210,255,0)');
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - len * Math.cos(s.a), s.y - len * Math.sin(s.a));
    ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.stroke();
  }

  /* ── Main Loop ── */
  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawNebula();

    // stars
    stars.forEach(s => {
      s.tw += s.ts;
      ctx.globalAlpha = s.a * (.55 + .45 * Math.sin(s.tw));
      ctx.fillStyle = s.col;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // organic cells
    drawCells();

    // shooting star
    shootTimer++;
    if (shootTimer > 320 && !shooting) {
      shooting = { x: Math.random() * W * .65, y: Math.random() * H * .4, a: Math.PI / 5 + Math.random() * .3, life: 0 };
      shootTimer = 0;
    }
    if (shooting) {
      shooting.x += Math.cos(shooting.a) * 9;
      shooting.y += Math.sin(shooting.a) * 9;
      shooting.life++;
      ctx.globalAlpha = Math.min(1, (40 - Math.abs(shooting.life - 20)) / 20);
      drawShoot(shooting); ctx.globalAlpha = 1;
      if (shooting.life > 40) shooting = null;
    }

    requestAnimationFrame(loop);
  }

  resize(); initStars(); initCells(); loop();
  window.addEventListener('resize', () => { resize(); initStars(); initCells(); });
})();


/* ── DNA HELIX ──────────────────────────────── */
(function () {
  const svg = document.getElementById('dna-helix');
  if (!svg) return;

  const ns  = 'http://www.w3.org/2000/svg';
  const period = 80, amp = 26, cx = 40, total = 400;
  let pts1 = '', pts2 = '';

  for (let y = 0; y <= total; y += 3) {
    const x1 = cx + amp * Math.sin(y * 2 * Math.PI / period);
    const x2 = cx - amp * Math.sin(y * 2 * Math.PI / period);
    pts1 += `${x1.toFixed(1)},${y} `;
    pts2 += `${x2.toFixed(1)},${y} `;
  }

  // strand 1 (space — cyan)
  const pl1 = document.createElementNS(ns, 'polyline');
  pl1.setAttribute('points', pts1);
  pl1.setAttribute('fill', 'none');
  pl1.setAttribute('stroke', '#00d2ff');
  pl1.setAttribute('stroke-width', '1.6');
  pl1.setAttribute('stroke-opacity', '0.55');
  svg.appendChild(pl1);

  // strand 2 (biology — green)
  const pl2 = document.createElementNS(ns, 'polyline');
  pl2.setAttribute('points', pts2);
  pl2.setAttribute('fill', 'none');
  pl2.setAttribute('stroke', '#00e87b');
  pl2.setAttribute('stroke-width', '1.6');
  pl2.setAttribute('stroke-opacity', '0.55');
  svg.appendChild(pl2);

  // base pair rungs — where strands are widest apart (peaks)
  for (let y = 20; y <= total; y += 40) {
    const x1 = cx + amp * Math.sin(y * 2 * Math.PI / period);
    const x2 = cx - amp * Math.sin(y * 2 * Math.PI / period);
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', x1.toFixed(1)); line.setAttribute('y1', y);
    line.setAttribute('x2', x2.toFixed(1)); line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(160, 220, 255, 0.3)');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);

    // dots at rung ends
    [x1, x2].forEach(x => {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y);
      c.setAttribute('r', '2');
      c.setAttribute('fill', x === x1 ? 'rgba(0,210,255,0.6)' : 'rgba(0,232,123,0.6)');
      svg.appendChild(c);
    });
  }
})();


/* ── COUNT-UP ANIMATION ─────────────────────── */
(function () {
  const els = document.querySelectorAll('.stat-val[data-target]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const dur    = 1600;
      const start  = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        const val   = Math.round(eased * target);
        el.textContent = val + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: .3 });

  els.forEach(el => io.observe(el));
})();


/* ── NAV: SCROLL + ACTIVE + MOBILE ─────────── */
(function () {
  const nav       = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const linksList = document.querySelector('.nav-links');
  if (!nav) return;

  // scroll darken
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // active link highlight
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // mobile toggle
  if (hamburger && linksList) {
    hamburger.addEventListener('click', () => {
      const open = linksList.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', open);
      hamburger.querySelectorAll('span').forEach((s, i) => {
        if (open) {
          if (i === 0) s.style.transform = 'translateY(6px) rotate(45deg)';
          if (i === 1) s.style.opacity   = '0';
          if (i === 2) s.style.transform = 'translateY(-6px) rotate(-45deg)';
        } else {
          s.style.transform = ''; s.style.opacity = '';
        }
      });
    });
    // close on link click
    linksList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        linksList.classList.remove('nav-open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }
})();


/* ── TABS ───────────────────────────────────── */
function switchTab(btn, id) {
  const wrap = btn.closest('.tabs').parentElement;
  wrap.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  wrap.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  wrap.querySelector('#tab-' + id).classList.add('active');
}


/* ── SCROLL REVEAL ──────────────────────────── */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 55);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .07 });

  document.querySelectorAll(
    '.news-card, .s-card, .stat-val, .team-card, .disc-card, .country-card, .event-card, .reveal'
  ).forEach(el => { el.classList.add('reveal'); io.observe(el); });
})();
