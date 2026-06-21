/* ============================================================
   SNOOOZ HOMEPAGE — BUSINESS INTEGRATIONS SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Self-contained, no dependencies.

   Draws a gradient connector from each category lane into the Snoooz node
   and flows a green dot along it. The lines draw themselves in as the
   section scrolls into view. Auto-orients: horizontal when the hub is to
   the side (desktop), vertical when it is below (stacked / mobile).
   Reduced-motion users get static, fully-drawn lines with no dots.
   ============================================================ */

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

  var wires = [], raf = null, visible = false, hubGlow = 0, connectedGlowed = false;

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }

  function edgePoint(rect, base, toward) {
    /* point on `rect` facing `toward` (a center point), in grid coords */
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

    hubGlow *= 0.92; /* glow decays each frame, dots re-ignite it on arrival */
    var now = (window.performance && performance.now ? performance.now() : Date.now()) / 1000;

    var hr = hub.getBoundingClientRect();
    var hc = { x: hr.left - base.left + hr.width / 2, y: hr.top - base.top + hr.height / 2 };

    var allConnected = true, allRetracted = true;

    wires.forEach(function (w, i) {
      var lr = w.lane.getBoundingClientRect();
      var lc = { x: lr.left - base.left + lr.width / 2, y: lr.top - base.top + lr.height / 2 };

      var start = edgePoint(lr, base, hc);
      var end = edgePoint(hr, base, lc);

      var dx = end.x - start.x, dy = end.y - start.y;
      var dist = Math.hypot(dx, dy) || 1;
      var nx = -dy / dist, ny = dx / dist;            /* perpendicular */
      var sign = (lc.y <= hc.y) ? -1 : 1;             /* fan toward the hub */
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
      if (drawAmount > 0.05) allRetracted = false;

      if (w.dot) {
        if (drawAmount > 0.85) {
          w.t += 0.0058;
          if (w.t > 1) w.t -= 1;
          var pt = w.path.getPointAtLength(w.t * len);
          w.dot.setAttribute('cx', pt.x);
          w.dot.setAttribute('cy', pt.y);
          var f = Math.sin(w.t * Math.PI);                 /* fade in/out at the ends */
          var pulse = 0.5 + 0.5 * Math.sin(now * 7 + i);   /* pulsate as it travels */
          w.dot.setAttribute('r', (3.6 + 2.6 * pulse).toFixed(2));
          w.dot.setAttribute('opacity', (0.18 + 0.82 * f).toFixed(3));
        } else {
          w.dot.setAttribute('opacity', 0);
        }
      }
    });

    /* Glow once, the moment every line has finished connecting.
       Re-arms only after the lines fully retract (scroll back up). */
    if (allConnected && !connectedGlowed && !reduce) { hubGlow = 1; connectedGlowed = true; }
    if (allRetracted) connectedGlowed = false;

    hub.style.setProperty('--glow-blur', (8 + 48 * hubGlow).toFixed(1) + 'px');
    hub.style.setProperty('--glow-a', (0.62 * hubGlow).toFixed(3));
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
