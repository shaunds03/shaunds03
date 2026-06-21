/* ============================================================
   SNOOOZ HOMEPAGE — SECURITY / TRUST SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Adds a staggered reveal as the band
   scrolls into view. Reduced-motion users get it immediately.
   ============================================================ */

(function () {
  var section = document.getElementById('snooozSecuritySection');
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
  }, { threshold: 0.15 });
  io.observe(section);
})();
