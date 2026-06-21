/* ============================================================
   SNOOOZ HOMEPAGE — EMAIL PROVIDERS NETWORK SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Self-contained, no dependencies.

   For each provider it draws a thick gradient connector curve into the
   Snoooz hub, recomputed every frame so it stays attached to the floating
   tiles. Green dots stream along each curve into the hub. The lines draw
   themselves in as the section scrolls into view. Reduced-motion users get
   static, fully-drawn lines with no dots.
   ============================================================ */

(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stage = document.getElementById('snooozNet');
  if (!stage) return;
  var svg = stage.querySelector('.snoooz-net__wires');
  var defs = document.getElementById('snooozNetDefs');
  var hubTile = stage.querySelector('.snoooz-net__hub-tile');
  var section = document.getElementById('snooozNetSection') || stage;
  var tiles = Array.prototype.slice.call(stage.querySelectorAll('.snoooz-net__node .snoooz-net__tile'));
  if (!svg || !defs || !hubTile || !tiles.length) return;

  var wires = [], raf = null, visible = false;

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }

  function center(elm, base) {
    var b = elm.getBoundingClientRect();
    return {
      x: b.left - base.left + b.width / 2,
      y: b.top - base.top + b.height / 2,
      r: Math.max(b.width, b.height) / 2
    };
  }

  function progress() {
    var r = stage.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return clamp((vh * 0.80 - r.top) / (vh * 0.60), 0, 1);
  }

  function build() {
    tiles.forEach(function (tile, i) {
      var grad = document.createElementNS(NS, 'linearGradient');
      grad.setAttribute('id', 'snzGrad' + i);
      grad.setAttribute('gradientUnits', 'userSpaceOnUse');
      var s0 = document.createElementNS(NS, 'stop');
      s0.setAttribute('offset', '0');
      s0.setAttribute('stop-color', '#0F5B44');
      s0.setAttribute('stop-opacity', '0.05');
      var s1 = document.createElementNS(NS, 'stop');
      s1.setAttribute('offset', '1');
      s1.setAttribute('stop-color', '#18c47d');
      s1.setAttribute('stop-opacity', '1');
      grad.appendChild(s0);
      grad.appendChild(s1);
      defs.appendChild(grad);

      var path = document.createElementNS(NS, 'path');
      path.setAttribute('class', 'snoooz-net__wire');
      path.setAttribute('stroke', 'url(#snzGrad' + i + ')');
      svg.appendChild(path);

      var dots = [];
      if (!reduce) {
        var sizes = [5, 3.2];
        for (var k = 0; k < sizes.length; k++) {
          var c = document.createElementNS(NS, 'circle');
          c.setAttribute('r', sizes[k]);
          c.setAttribute('class', 'snoooz-net__dot');
          svg.appendChild(c);
          dots.push({ el: c, t: ((i * 0.19) + k * 0.13) % 1 });
        }
      }

      wires.push({ tile: tile, path: path, grad: grad, dots: dots, sign: i % 2 ? 1 : -1 });
    });
  }

  function draw(p) {
    var base = stage.getBoundingClientRect();
    if (!base.width) return;
    svg.setAttribute('viewBox', '0 0 ' + base.width + ' ' + base.height);
    var hc = center(hubTile, base);

    wires.forEach(function (w, i) {
      var pc = center(w.tile, base);
      var dx = hc.x - pc.x, dy = hc.y - pc.y;
      var dist = Math.hypot(dx, dy) || 1;
      var ux = dx / dist, uy = dy / dist;

      var sx = pc.x + ux * (pc.r * 0.84), sy = pc.y + uy * (pc.r * 0.84);
      var ex = hc.x - ux * (hc.r * 0.80), ey = hc.y - uy * (hc.r * 0.80);

      /* gentle curve via a perpendicular control point */
      var mx = (sx + ex) / 2, my = (sy + ey) / 2;
      var nx = -(ey - sy), ny = (ex - sx);
      var nl = Math.hypot(nx, ny) || 1;
      var off = dist * 0.10 * w.sign;
      var cx = mx + (nx / nl) * off, cy = my + (ny / nl) * off;

      w.path.setAttribute('d', 'M' + sx + ' ' + sy + ' Q' + cx + ' ' + cy + ' ' + ex + ' ' + ey);

      w.grad.setAttribute('x1', sx); w.grad.setAttribute('y1', sy);
      w.grad.setAttribute('x2', ex); w.grad.setAttribute('y2', ey);

      var len = w.path.getTotalLength();
      var drawAmount = clamp((p - i * 0.07) / 0.42, 0, 1);
      w.path.style.strokeDasharray = len;
      w.path.style.strokeDashoffset = len * (1 - drawAmount);

      var flowing = drawAmount > 0.85;
      w.dots.forEach(function (d) {
        if (!flowing) { d.el.setAttribute('opacity', 0); return; }
        d.t += 0.006;
        if (d.t > 1) d.t -= 1;
        var pt = w.path.getPointAtLength(d.t * len);
        d.el.setAttribute('cx', pt.x);
        d.el.setAttribute('cy', pt.y);
        var f = Math.sin(d.t * Math.PI);
        d.el.setAttribute('opacity', (0.12 + 0.88 * f).toFixed(3));
      });
    });
  }

  function frame() {
    draw(progress());
    raf = window.requestAnimationFrame(frame);
  }
  function start() { if (raf) return; raf = window.requestAnimationFrame(frame); }
  function stop() { if (raf) { window.cancelAnimationFrame(raf); raf = null; } }

  /* Reveal the tiles + (for reduced motion) draw the lines statically */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      visible = e.isIntersecting;
      if (visible) section.classList.add('is-visible');
      if (reduce) { if (visible) draw(1); return; }
      if (visible) start(); else stop();
    });
  }, { threshold: 0.18 });
  io.observe(stage);

  build();
  window.requestAnimationFrame(function () { draw(reduce ? 1 : progress()); });

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { draw(reduce ? 1 : progress()); }, 150);
  });
})();
