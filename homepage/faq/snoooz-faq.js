/* ============================================================
   SNOOOZ HOMEPAGE — FAQ SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Runs the accordion (with smooth height)
   and a staggered reveal. Reduced-motion users get instant toggles.
   ============================================================ */

(function () {
  var section = document.getElementById('snooozFaqSection');
  if (!section) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = Array.prototype.slice.call(section.querySelectorAll('.snoooz-faq__item'));

  items.forEach(function (item) {
    var btn = item.querySelector('.snoooz-faq__q');
    var panel = item.querySelector('.snoooz-faq__a');
    if (!btn || !panel) return;

    btn.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (reduce) {
        panel.style.maxHeight = open ? 'none' : '0px';
        return;
      }
      if (open) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        requestAnimationFrame(function () { panel.style.maxHeight = '0px'; });
      }
    });

    /* keep an open panel sized correctly after fonts/resize */
    panel.addEventListener('transitionend', function () {
      if (item.classList.contains('is-open')) panel.style.maxHeight = 'none';
    });
  });

  window.addEventListener('resize', function () {
    items.forEach(function (item) {
      if (!item.classList.contains('is-open')) return;
      var panel = item.querySelector('.snoooz-faq__a');
      if (panel) panel.style.maxHeight = 'none';
    });
  });

  /* Reveal */
  if (!reduce) {
    section.classList.add('is-reveal');
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        section.classList.add('is-visible');
        obs.disconnect();
      });
    }, { threshold: 0.1 });
    io.observe(section);
  }
})();
