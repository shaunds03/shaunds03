/* ============================================================
   SNOOOZ HOMEPAGE — BUSINESS INTEGRATIONS SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Adds the staggered reveal and a cursor
   spotlight. Reduced-motion / touch users skip the effects.
   ============================================================ */

(function () {
  var section = document.getElementById('snooozIntSection');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Staggered reveal on scroll into view */
  if (!reduce) {
    section.classList.add('is-reveal');
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        section.classList.add('is-visible');
        obs.disconnect();
      });
    }, { threshold: 0.2 });
    io.observe(section);
  }

  /* Cursor spotlight (fine pointers only) */
  var spot = section.querySelector('.snoooz-int__cursor');
  var fine = window.matchMedia('(pointer: fine)').matches;
  if (spot && fine && !reduce) {
    section.addEventListener('pointermove', function (e) {
      var r = section.getBoundingClientRect();
      spot.style.left = (e.clientX - r.left) + 'px';
      spot.style.top = (e.clientY - r.top) + 'px';
      spot.style.opacity = '1';
    });
    section.addEventListener('pointerleave', function () { spot.style.opacity = '0'; });
  }
})();
