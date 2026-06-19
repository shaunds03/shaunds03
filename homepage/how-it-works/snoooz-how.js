/* ============================================================
   SNOOOZ HOMEPAGE — HOW IT WORKS SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Self-contained, no dependencies.

   Each step's app animates only while it is on screen, then loops.
   The HTML is seeded in each animation's finished state, so reduced-motion
   users (and the no-JS case) simply keep that finished state.
   ============================================================ */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; /* keep the seeded finished states, no looping */

  /* Run `loopFn` (async) while the element is in view; stop when it leaves.
     A generation token kills any stale loop so re-entering never doubles up.
     `resetFn` puts the markup back to its starting state before each run. */
  function onView(el, resetFn, loopFn) {
    if (!el) return;
    var gen = 0, running = false;
    function alive(myGen) { return running && myGen === gen; }
    function wait(ms, myGen) {
      return new Promise(function (res) { setTimeout(function () { res(alive(myGen)); }, ms); });
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !running) {
          running = true; gen++;
          var myGen = gen;
          if (resetFn) resetFn();
          loopFn(myGen, function (ms) { return wait(ms, myGen); }, function () { return alive(myGen); });
        } else if (!e.isIntersecting) {
          running = false; gen++;
        }
      });
    }, { threshold: 0.35 });
    obs.observe(el);
  }

  function typeInto(el, text, speed, alive) {
    return new Promise(function (resolve) {
      el.classList.add('is-typing');
      var i = 0;
      function tick() {
        if (!alive()) { el.classList.remove('is-typing'); resolve(false); return; }
        el.textContent = text.slice(0, i);
        i++;
        if (i <= text.length) setTimeout(tick, speed);
        else { el.classList.remove('is-typing'); resolve(true); }
      }
      tick();
    });
  }

  /* ---------- Step 1: connect ---------- */
  (function () {
    var root = document.getElementById('snooozConnect');
    if (!root) return;
    var rows = Array.prototype.slice.call(root.querySelectorAll('.snoooz-connect__row'));
    function set(row, on) {
      row.classList.toggle('is-connected', on);
      var s = row.querySelector('.snoooz-connect__status');
      if (s) s.textContent = on ? 'Connected' : 'Connect';
    }
    function reset() { rows.forEach(function (r) { set(r, false); }); }

    onView(root, reset, async function (g, wait, alive) {
      while (alive()) {
        reset();
        if (!(await wait(600))) return;
        for (var i = 0; i < rows.length; i++) {
          if (!alive()) return;
          set(rows[i], true);
          if (!(await wait(680))) return;
        }
        if (!(await wait(1500))) return;
      }
    });
  })();

  /* ---------- Step 2: train ---------- */
  (function () {
    var root = document.getElementById('snooozTrain');
    if (!root) return;
    var drop = root.querySelector('.snoooz-train__drop');
    var files = Array.prototype.slice.call(root.querySelectorAll('.snoooz-train__file'));
    var status = root.querySelector('.snoooz-train__status');
    function reset() {
      files.forEach(function (f) { f.classList.remove('is-in'); });
      if (status) status.classList.remove('is-on');
      if (drop) drop.classList.remove('is-active');
    }

    onView(root, reset, async function (g, wait, alive) {
      while (alive()) {
        reset();
        if (!(await wait(650))) return;
        for (var i = 0; i < files.length; i++) {
          if (!alive()) return;
          if (drop) drop.classList.add('is-active');
          files[i].classList.add('is-in');
          if (!(await wait(200))) return;
          if (drop) drop.classList.remove('is-active');
          if (!(await wait(540))) return;
        }
        if (status) status.classList.add('is-on');
        if (!(await wait(1700))) return;
      }
    });
  })();

  /* ---------- Step 3: review ---------- */
  (function () {
    var root = document.getElementById('snooozReview');
    if (!root) return;
    var inEl = document.getElementById('snooozReviewIn');
    var draftEl = document.getElementById('snooozReviewDraft');
    var actions = document.getElementById('snooozReviewActions');
    var editBtn = document.getElementById('snooozReviewEdit');
    var sendBtn = document.getElementById('snooozReviewSend');
    if (!inEl || !draftEl || !actions) return;

    var INCOMING = 'Hi, do you ship to Canada, and how long does delivery take?';
    var REPLY1 = 'Hi! Yes, we ship to Canada. Standard delivery takes 3 to 5 business days.';
    var REPLY2 = 'Hi Maria! Yes, we ship to Canada. Standard delivery takes 3 to 5 business days.';
    var REPLY3 = 'Hi Maria! Yes, we ship to Canada. Delivery is 2 to 4 business days, with tracking.';

    function flash(el) {
      el.classList.remove('is-flash');
      void el.offsetWidth; /* restart the animation */
      el.classList.add('is-flash');
    }
    function reset() {
      inEl.textContent = '';
      draftEl.textContent = '';
      actions.classList.remove('is-sent');
      if (editBtn) editBtn.classList.remove('is-active');
      if (sendBtn) sendBtn.classList.remove('is-pressed');
    }

    onView(root, reset, async function (g, wait, alive) {
      while (alive()) {
        reset();
        if (!(await wait(500))) return;
        if (!(await typeInto(inEl, INCOMING, 24, alive))) return;
        if (!(await wait(450))) return;
        if (!(await typeInto(draftEl, REPLY1, 20, alive))) return;
        if (!(await wait(750))) return;

        if (editBtn) editBtn.classList.add('is-active');
        if (!(await wait(300))) return;
        draftEl.textContent = REPLY2; flash(draftEl);
        if (editBtn) editBtn.classList.remove('is-active');
        if (!(await wait(950))) return;

        if (editBtn) editBtn.classList.add('is-active');
        if (!(await wait(300))) return;
        draftEl.textContent = REPLY3; flash(draftEl);
        if (editBtn) editBtn.classList.remove('is-active');
        if (!(await wait(1000))) return;

        if (sendBtn) sendBtn.classList.add('is-pressed');
        if (!(await wait(320))) return;
        actions.classList.add('is-sent');
        if (!(await wait(2000))) return;
      }
    });
  })();

  /* ---------- Step 4: autopilot ---------- */
  (function () {
    var root = document.getElementById('snooozAuto');
    if (!root) return;
    var toggle = document.getElementById('snooozAutoToggle');
    var rows = Array.prototype.slice.call(root.querySelectorAll('.snoooz-auto__row'));
    function reset() {
      if (toggle) toggle.classList.remove('is-on');
      rows.forEach(function (r) { r.classList.remove('is-shown'); });
    }

    onView(root, reset, async function (g, wait, alive) {
      while (alive()) {
        reset();
        if (!(await wait(800))) return;
        if (toggle) toggle.classList.add('is-on');
        if (!(await wait(560))) return;
        for (var i = 0; i < rows.length; i++) {
          if (!alive()) return;
          rows[i].classList.add('is-shown');
          if (!(await wait(280))) return;
        }
        if (!(await wait(2200))) return;
      }
    });
  })();
})();
