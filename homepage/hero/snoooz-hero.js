/* ============================================================
   SNOOOZ HOMEPAGE — HERO SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Self-contained, no dependencies.
   ============================================================ */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Rotating "now handling" inbox label ---- */
  (function () {
    var label = document.getElementById('snooozHeroInbox');
    if (!label || reduce) return;

    var inboxes = ['support@', 'sales@', 'info@', 'billing@', 'orders@'];
    var i = 0;

    setInterval(function () {
      i = (i + 1) % inboxes.length;
      label.classList.add('is-changing');
      setTimeout(function () {
        label.textContent = inboxes[i];
        label.classList.remove('is-changing');
      }, 300);
    }, 2600);
  })();

  /* ---- 2. Play button → open the demo video ----
     Set data-video-src on the .snoooz-hero__play button to an embed URL
     (YouTube/Wistia/MP4). With no src set, this is a no-op placeholder so
     you can wire it to whatever player/modal you already use in HubSpot. */
  (function () {
    var play = document.querySelector('.snoooz-hero__play');
    if (!play) return;

    play.addEventListener('click', function () {
      var src = play.getAttribute('data-video-src');
      if (!src) {
        // Placeholder: replace with your modal/lightbox trigger.
        console.info('[snoooz-hero] No data-video-src set on the play button yet.');
        return;
      }

      var stage = play.closest('.snoooz-hero__video');
      if (!stage) return;

      var frame = document.createElement('iframe');
      frame.src = src;
      frame.title = 'Snoooz product demo';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      frame.allowFullscreen = true;
      frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';

      stage.innerHTML = '';
      stage.appendChild(frame);
    });
  })();
})();
