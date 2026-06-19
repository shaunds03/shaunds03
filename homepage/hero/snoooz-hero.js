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

  /* ---- 2. Play button + clearing the floating tags ----
     The video autoplays muted and looped, and stays fixed in place.
     Hovering the video, or clicking play, smoothly hides the floating
     tags. Play also unmutes the video from the top. */
  (function () {
    var stage = document.querySelector('.snoooz-hero__stage');
    var video = document.getElementById('snooozHeroVideo');
    var play = document.getElementById('snooozHeroPlay');
    if (!stage || !video || !play) return;

    var playing = false;
    function clearTags(on) { stage.classList.toggle('is-clear', on); }

    video.addEventListener('pointerenter', function () { clearTags(true); });
    video.addEventListener('pointerleave', function () { if (!playing) clearTags(false); });

    play.addEventListener('click', function () {
      playing = true;
      clearTags(true);
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
})();
