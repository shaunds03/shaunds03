/* ============================================================
   SNOOOZ HOMEPAGE — EMAIL PROVIDERS NETWORK SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Self-contained, no dependencies.

   Draws a connector arrow from each provider to the Snoooz hub between
   their real on-screen positions, then animates green dots flowing along
   each wire into the hub. Recomputes on resize; reduced-motion users get
   static wires with no flowing dots.
   ============================================================ */

(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stage = document.getElementById('snooozNet');
  if (!stage) return;
  var svg = stage.querySelector('.snoooz-net__wires');
  var hub = stage.querySelector('.snoooz-net__hub');
  var nodes = Array.prototype.slice.call(stage.querySelectorAll('.snoooz-net__node'));
  var section = document.getElementById('snooozNetSection') || stage;
  if (!svg || !hub || !nodes.length) return;

  var wires = [], dots = [], raf = null, visible = false, revealed = false;

  function centerOf(elm, base) {
    var b = elm.getBoundingClientRect();
    return {
      x: b.left - base.left + b.width / 2,
      y: b.top - base.top + b.height / 2,
      r: Math.max(b.width, b.height) / 2
    };
  }

  function clearGenerated() {
    var old = svg.querySelectorAll('.snoooz-net__wire, .snoooz-net__dot');
    Array.prototype.forEach.call(old, function (e) { e.remove(); });
    wires = []; dots = [];
  }

  function build() {
    var base = stage.getBoundingClientRect();
    if (!base.width) return;
    svg.setAttribute('viewBox', '0 0 ' + base.width + ' ' + base.height);
    clearGenerated();

    var hc = centerOf(hub, base);

    nodes.forEach(function (node, i) {
      var pc = centerOf(node, base);
      var dx = hc.x - pc.x, dy = hc.y - pc.y;
      var dist = Math.hypot(dx, dy) || 1;
      var ux = dx / dist, uy = dy / dist;
      var sx = pc.x + ux * (pc.r + 4), sy = pc.y + uy * (pc.r + 4);
      var ex = hc.x - ux * (hc.r + 9), ey = hc.y - uy * (hc.r + 9);

      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', 'M' + sx + ' ' + sy + ' L' + ex + ' ' + ey);
      path.setAttribute('class', 'snoooz-net__wire');
      path.setAttribute('marker-end', 'url(#snooozArrow)');
      svg.appendChild(path);

      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = revealed ? 0 : len;
      wires.push(path);

      if (!reduce) {
        for (var k = 0; k < 2; k++) {
          var c = document.createElementNS(NS, 'circle');
          c.setAttribute('r', '4');
          c.setAttribute('class', 'snoooz-net__dot');
          svg.appendChild(c);
          dots.push({ el: c, path: path, len: len, t: ((i * 0.17) + k * 0.5) % 1, speed: 0.0055 });
        }
      }
    });
  }

  function reveal() {
    revealed = true;
    section.classList.add('is-visible');
    wires.forEach(function (p, i) {
      p.style.transition = 'stroke-dashoffset 0.9s ease ' + (i * 0.09) + 's';
      p.style.strokeDashoffset = '0';
    });
  }

  function frame() {
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.t += d.speed;
      if (d.t > 1) d.t -= 1;
      var p = d.path.getPointAtLength(d.t * d.len);
      d.el.setAttribute('cx', p.x);
      d.el.setAttribute('cy', p.y);
      var f = Math.sin(d.t * Math.PI); /* fade in/out at the ends */
      d.el.setAttribute('opacity', (0.12 + 0.88 * f).toFixed(3));
    }
    raf = window.requestAnimationFrame(frame);
  }
  function startDots() { if (reduce || raf) return; raf = window.requestAnimationFrame(frame); }
  function stopDots() { if (raf) { window.cancelAnimationFrame(raf); raf = null; } }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      visible = e.isIntersecting;
      if (visible) { if (!revealed) reveal(); startDots(); }
      else stopDots();
    });
  }, { threshold: 0.2 });
  io.observe(stage);

  /* Build after layout settles */
  window.requestAnimationFrame(function () {
    build();
    if (visible) { reveal(); startDots(); }
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var wasRevealed = revealed;
      build();
      if (wasRevealed) {
        wires.forEach(function (p) { p.style.transition = 'none'; p.style.strokeDashoffset = '0'; });
      }
      if (visible) startDots();
    }, 180);
  });
})();
