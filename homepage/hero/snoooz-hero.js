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

  /* ---- 2. Play button → unmute + restart the video with sound ----
     The video autoplays muted and looped as a background. Clicking play
     unmutes it from the top; clicking the video toggles pause/play. */
  (function () {
    var video = document.getElementById('snooozHeroVideo');
    var play = document.getElementById('snooozHeroPlay');
    if (!video || !play) return;

    play.addEventListener('click', function () {
      video.muted = false;
      video.currentTime = 0;
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      play.classList.add('is-hidden');
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        video.play();
        if (!video.muted) play.classList.add('is-hidden');
      } else {
        video.pause();
        play.classList.remove('is-hidden');
      }
    });
  })();

  /* ---- 3. Pointer parallax — tilt the video and drift the chips ---- */
  (function () {
    var stage = document.querySelector('.snoooz-hero__stage');
    if (!stage || reduce) return;

    var video = stage.querySelector('.snoooz-hero__video');
    var chips = stage.querySelectorAll('.snoooz-hero__chip');

    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5;   /* -0.5 .. 0.5 */
      var dy = (e.clientY - r.top) / r.height - 0.5;

      if (video) {
        video.style.transform =
          'translateY(-6px) rotateX(' + (-dy * 4).toFixed(2) + 'deg) rotateY(' + (dx * 5).toFixed(2) + 'deg)';
      }
      chips.forEach(function (chip, i) {
        var depth = (i + 1) * 9;
        chip.style.transform = 'translate(' + (dx * depth).toFixed(1) + 'px,' + (dy * depth).toFixed(1) + 'px)';
      });
    });

    stage.addEventListener('pointerleave', function () {
      if (video) video.style.transform = '';
      chips.forEach(function (chip) { chip.style.transform = ''; });
    });
  })();
})();
