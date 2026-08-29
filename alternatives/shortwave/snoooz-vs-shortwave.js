/* Enable the scroll-reveal start states. The CSS only hides revealable
   blocks while this class is present, so if this file fails to load the
   page still shows all of its content. */
document.documentElement.classList.add('snzc-anim');

(function () {
  /* Hero video: autoplays muted + looped. The play button restarts it
     from the top with sound; clicking the video toggles play/pause. */
  var video = document.getElementById('snzcHeroVideo');
  var play = document.getElementById('snzcHeroPlay');
  if (!video || !play) return;

  play.addEventListener('click', function () {
    video.muted = false;
    video.currentTime = 0;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
    play.classList.add('is-hidden');
  });

  video.addEventListener('click', function () {
    if (video.paused) {
      video.play();
      if (!video.muted) play.classList.add('is-hidden');
    } else {
      video.pause();
      play.classList.remove('is-hidden');
    }
  });
})();

/* ---- Part 2: 'How they differ' scroll sequence ---- */
(function () {
  var section = document.querySelector('.snzc-vs');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rows = Array.prototype.slice.call(section.querySelectorAll('.snzc-vs__row'));
  var fair = section.querySelector('.snzc-vs__fair');
  var seq = section.querySelector('.snzc-vs__seq');
  var endNode = section.querySelector('.snzc-vs__end');
  var fill = document.getElementById('snzcSpineFill');

  if (reduce) {
    rows.forEach(function (r) { r.classList.add('is-in', 'is-active'); });
    if (endNode) endNode.classList.add('is-in', 'is-active');
    if (fair) fair.classList.add('is-in');
    if (fill) fill.style.height = '100%';
    return;
  }

  /* Reveal cells + icon nodes as they enter the viewport */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
    rows.forEach(function (r) { io.observe(r); });
    if (endNode) io.observe(endNode);
    if (fair) io.observe(fair);
  } else {
    rows.forEach(function (r) { r.classList.add('is-in'); });
    if (endNode) endNode.classList.add('is-in');
    if (fair) fair.classList.add('is-in');
  }

  /* Draw the spine + light up each node as the scroll line passes it */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      if (!seq) return;
      var rect = seq.getBoundingClientRect();
      var anchor = window.innerHeight * 0.5;
      var prog = (anchor - rect.top) / rect.height;
      prog = Math.max(0, Math.min(1, prog));
      if (fill) fill.style.height = (prog * 100).toFixed(2) + '%';
      rows.forEach(function (r) {
        var node = r.querySelector('.snzc-vs__node-dot');
        if (!node) return;
        var nr = node.getBoundingClientRect();
        r.classList.toggle('is-active', (nr.top + nr.height / 2) <= anchor + 4);
      });
      if (endNode) {
        var ed = endNode.querySelector('.snzc-vs__end-dot');
        if (ed) {
          var er = ed.getBoundingClientRect();
          endNode.classList.toggle('is-active', (er.top + er.height / 2) <= anchor + 4);
        }
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();


/* ---- Part 3: detailed comparison table - reveal rows on scroll ---- */
(function () {
  var card = document.querySelector('.snzc-tbl__card');
  if (!card) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rows = Array.prototype.slice.call(card.querySelectorAll('.snzc-tbl__row--body'));

  if (reduce || !('IntersectionObserver' in window)) {
    rows.forEach(function (r) { r.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  rows.forEach(function (r) { io.observe(r); });
})();


/* ---- Part 4: closing CTA reveal + sticky mobile CTA ---- */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal the banner */
  var banner = document.querySelector('.snzc-cta__banner');
  if (banner) {
    if (reduce || !('IntersectionObserver' in window)) {
      banner.classList.add('is-in');
    } else {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); bio.unobserve(e.target); }
        });
      }, { threshold: 0.2 });
      bio.observe(banner);
    }
  }

  /* Sticky mobile CTA: show once the hero is scrolled past, hide over the closing banner */
  var sticky = document.getElementById('snzcSticky');
  var hero = document.querySelector('.snzc-hero');
  if (!sticky || !hero) return;

  if (!('IntersectionObserver' in window)) { sticky.classList.add('is-visible'); return; }

  var heroOut = false, ctaIn = false;
  function update() { sticky.classList.toggle('is-visible', heroOut && !ctaIn); }

  new IntersectionObserver(function (e) {
    heroOut = !e[0].isIntersecting;
    update();
  }, { rootMargin: '-20% 0px 0px 0px' }).observe(hero);

  if (banner) {
    new IntersectionObserver(function (e) {
      ctaIn = e[0].isIntersecting;
      update();
    }, { threshold: 0.2 }).observe(banner);
  }
})();


/* ---- Part 5: business integrations - draw connectors lanes -> Snoooz ---- */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var section = document.getElementById('snooozStackSection');
  var grid = document.getElementById('snooozStack');
  if (!section || !grid) return;
  var svg = grid.querySelector('.snoooz-stack__wires');
  var defs = document.getElementById('snooozStackDefs');
  var hub = grid.querySelector('.snoooz-stack__hub');
  var lanes = Array.prototype.slice.call(grid.querySelectorAll('.snoooz-stack__lane'));
  if (!svg || !defs || !hub || !lanes.length) return;

  /* Reveal */
  if (!reduce) {
    section.classList.add('is-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) section.classList.add('is-visible');
      });
    }, { threshold: 0.15 });
    io.observe(section);
  }

  var wires = [], raf = null, visible = false, hubGlow = 0;

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }

  function edgePoint(rect, base, toward) {
    var cx = rect.left - base.left + rect.width / 2;
    var cy = rect.top - base.top + rect.height / 2;
    var dx = toward.x - cx, dy = toward.y - cy;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return { x: (dx > 0 ? rect.right : rect.left) - base.left, y: cy };
    }
    return { x: cx, y: (dy > 0 ? rect.bottom : rect.top) - base.top };
  }

  function build() {
    lanes.forEach(function (lane, i) {
      var grad = document.createElementNS(NS, 'linearGradient');
      grad.setAttribute('id', 'snzStackGrad' + i);
      grad.setAttribute('gradientUnits', 'userSpaceOnUse');
      var s0 = document.createElementNS(NS, 'stop');
      s0.setAttribute('offset', '0'); s0.setAttribute('stop-color', '#0F5B44'); s0.setAttribute('stop-opacity', '0.05');
      var s1 = document.createElementNS(NS, 'stop');
      s1.setAttribute('offset', '1'); s1.setAttribute('stop-color', '#18c47d'); s1.setAttribute('stop-opacity', '1');
      grad.appendChild(s0); grad.appendChild(s1); defs.appendChild(grad);

      var path = document.createElementNS(NS, 'path');
      path.setAttribute('class', 'snoooz-stack__wire');
      path.setAttribute('stroke', 'url(#snzStackGrad' + i + ')');
      svg.appendChild(path);

      var dot = null;
      if (!reduce) {
        dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('r', '4.5');
        dot.setAttribute('class', 'snoooz-stack__dot');
        svg.appendChild(dot);
      }
      wires.push({ lane: lane, path: path, grad: grad, dot: dot, t: (i * 0.21) % 1, prevT: (i * 0.21) % 1 });
    });
  }

  function progress() {
    var r = grid.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return clamp((vh * 0.82 - r.top) / (vh * 0.6), 0, 1);
  }

  function draw(p) {
    var base = grid.getBoundingClientRect();
    if (!base.width) return;
    svg.setAttribute('viewBox', '0 0 ' + base.width + ' ' + base.height);

    var now = (window.performance && performance.now ? performance.now() : Date.now()) / 1000;

    var hr = hub.getBoundingClientRect();
    var hc = { x: hr.left - base.left + hr.width / 2, y: hr.top - base.top + hr.height / 2 };

    var allConnected = true;

    wires.forEach(function (w, i) {
      var lr = w.lane.getBoundingClientRect();
      var lc = { x: lr.left - base.left + lr.width / 2, y: lr.top - base.top + lr.height / 2 };

      var start = edgePoint(lr, base, hc);
      var end = edgePoint(hr, base, lc);

      var dx = end.x - start.x, dy = end.y - start.y;
      var dist = Math.hypot(dx, dy) || 1;
      var nx = -dy / dist, ny = dx / dist;
      var sign = (lc.y <= hc.y) ? -1 : 1;
      var off = Math.min(dist * 0.16, 46) * sign;
      var cx = (start.x + end.x) / 2 + nx * off;
      var cy = (start.y + end.y) / 2 + ny * off;

      w.path.setAttribute('d', 'M' + start.x + ' ' + start.y + ' Q' + cx + ' ' + cy + ' ' + end.x + ' ' + end.y);
      w.grad.setAttribute('x1', start.x); w.grad.setAttribute('y1', start.y);
      w.grad.setAttribute('x2', end.x); w.grad.setAttribute('y2', end.y);

      var len = w.path.getTotalLength();
      var drawAmount = clamp((p - i * 0.06) / 0.42, 0, 1);
      w.path.style.strokeDasharray = len;
      w.path.style.strokeDashoffset = len * (1 - drawAmount);

      if (drawAmount < 0.999) allConnected = false;

      if (w.dot) {
        if (drawAmount > 0.85) {
          w.t += 0.0058;
          if (w.t > 1) w.t -= 1;
          var pt = w.path.getPointAtLength(w.t * len);
          w.dot.setAttribute('cx', pt.x);
          w.dot.setAttribute('cy', pt.y);
          var f = Math.sin(w.t * Math.PI);
          var pulse = 0.5 + 0.5 * Math.sin(now * 7 + i);
          w.dot.setAttribute('r', (3.6 + 2.6 * pulse).toFixed(2));
          w.dot.setAttribute('opacity', (0.18 + 0.82 * f).toFixed(3));
        } else {
          w.dot.setAttribute('opacity', 0);
        }
      }
    });

    var target = allConnected ? 1 : 0;
    if (reduce) hubGlow = target;
    else hubGlow += (target - hubGlow) * 0.08;
    if (hubGlow < 0.001) hubGlow = 0;

    var breathe = reduce ? 1 : (0.9 + 0.1 * Math.sin(now * 2.2));
    var g = hubGlow * breathe;
    hub.style.setProperty('--glow-blur', (10 + 46 * g).toFixed(1) + 'px');
    hub.style.setProperty('--glow-a', (0.6 * g).toFixed(3));
  }

  function frame() { draw(progress()); raf = window.requestAnimationFrame(frame); }
  function start() { if (raf) return; raf = window.requestAnimationFrame(frame); }
  function stop() { if (raf) { window.cancelAnimationFrame(raf); raf = null; } }

  var vio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      visible = e.isIntersecting;
      if (reduce) { if (visible) draw(1); return; }
      if (visible) start(); else stop();
    });
  }, { threshold: 0 });
  vio.observe(grid);

  build();
  window.requestAnimationFrame(function () { draw(reduce ? 1 : progress()); });

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { draw(reduce ? 1 : progress()); }, 150);
  });
})();


/* ---- Part 6: how it works - sticky scrollytelling (active step drives the stage) ---- */
(function () {
  var section = document.querySelector('.snzc-works');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = Array.prototype.slice.call(section.querySelectorAll('.snzc-works__card'));
  var frames = Array.prototype.slice.call(section.querySelectorAll('.snzc-works__frame'));
  var segs = Array.prototype.slice.call(section.querySelectorAll('.snzc-works__seg'));
  var uses = Array.prototype.slice.call(section.querySelectorAll('.snzc-works__use'));
  var say = section.querySelector('.snzc-say');
  if (!cards.length) return;

  var current = -1;
  function setActive(idx) {
    if (idx === current) return;
    current = idx;
    cards.forEach(function (c, i) { c.classList.toggle('is-active', i === idx); });
    frames.forEach(function (f, i) { f.classList.toggle('is-active', i === idx); });
    segs.forEach(function (sg, i) { sg.classList.toggle('is-filled', i <= idx); });
  }

  /* Reveal grid / breadth / statement */
  if (reduce || !('IntersectionObserver' in window)) {
    section.classList.add('is-in');
    uses.forEach(function (u) { u.classList.add('is-in'); });
    if (say) say.classList.add('is-in');
  } else {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    rio.observe(section);
    uses.forEach(function (u) { rio.observe(u); });
    if (say) rio.observe(say);
  }

  if (reduce) { setActive(0); return; }

  /* Pick the step nearest the viewport anchor as you scroll */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var anchor = window.innerHeight * 0.45;
      var best = 0, bestDist = Infinity;
      cards.forEach(function (c, i) {
        var r = c.getBoundingClientRect();
        var d = Math.abs((r.top + r.height / 2) - anchor);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActive(best);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();


/* ---- Part 7: FAQ accordion + reveal ---- */
(function () {
  var section = document.querySelector('.snzc-faq');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = Array.prototype.slice.call(section.querySelectorAll('.snzc-faq__item'));

  /* Reveal on scroll */
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (it) { it.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (it) { io.observe(it); });
  }

  /* Accordion: one open at a time */
  items.forEach(function (item) {
    var btn = item.querySelector('.snzc-faq__q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      items.forEach(function (other) {
        other.classList.remove('is-open');
        var b = other.querySelector('.snzc-faq__q');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ---- Part 8: proof / inbox impact report - count-up on scroll ---- */
(function () {
  var section = document.getElementById('snooozProofSection');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nums = Array.prototype.slice.call(section.querySelectorAll('.snoooz-proof__num'));

  function fmt(n, dec, prefix, suffix) {
    return prefix + n.toFixed(dec) + suffix;
  }

  function settle(el) {
    var to = parseFloat(el.getAttribute('data-to')) || 0;
    var dec = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    el.textContent = fmt(to, dec, el.getAttribute('data-prefix') || '', el.getAttribute('data-suffix') || '');
  }

  function countUp(el) {
    var to = parseFloat(el.getAttribute('data-to')) || 0;
    var dec = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1500, t0 = null;
    function ease(p) { return 1 - Math.pow(1 - p, 3); }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      el.textContent = fmt(to * ease(p), dec, prefix, suffix);
      if (p < 1) window.requestAnimationFrame(step);
      else settle(el);
    }
    window.requestAnimationFrame(step);
  }

  if (reduce) { nums.forEach(settle); return; }

  section.classList.add('is-reveal');

  var io = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      section.classList.add('is-visible');
      nums.forEach(countUp);
      obs.disconnect();
    });
  }, { threshold: 0.3 });
  io.observe(section);
})();

/* =================== end JS =================== */
