/* ============================================================
   SNOOOZ HOMEPAGE — WHY SNOOOZ SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Staggered reveal on scroll into view.
   Reduced-motion users get the cards immediately.
   ============================================================ */

(function () {
  var section = document.getElementById('snooozWhySection');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  section.classList.add('is-reveal');

  var io = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      section.classList.add('is-visible');
      obs.disconnect();
    });
  }, { threshold: 0.2 });
  io.observe(section);
})();
