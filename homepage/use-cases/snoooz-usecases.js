/* ============================================================
   SNOOOZ HOMEPAGE — USE CASES SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Adds a staggered fade-up as the cards
   scroll into view. Reduced-motion users get the cards immediately.
   ============================================================ */

(function () {
  var section = document.getElementById('snooozUseCases');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; /* leave cards visible, no animation */

  var cards = Array.prototype.slice.call(section.querySelectorAll('.snoooz-uc__card'));
  if (!cards.length) return;

  section.classList.add('is-reveal');

  var obs = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var i = cards.indexOf(e.target);
      e.target.style.transitionDelay = Math.max(0, i % 3) * 0.08 + 's';
      e.target.classList.add('is-visible');
      observer.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

  cards.forEach(function (c) { obs.observe(c); });
})();
