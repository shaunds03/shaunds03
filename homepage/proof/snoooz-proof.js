/* ============================================================
   SNOOOZ HOMEPAGE — PROOF / INBOX IMPACT REPORT SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Reveals the section and counts the
   figures up when the card scrolls into view. Reduced-motion users
   get the final figures with no animation.
   ============================================================ */

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
