/* ============================================================
   SNOOOZ HOMEPAGE — PROBLEM / CATEGORY SCRIPTS
   Paste into your HubSpot module JS field (or a <script> block
   placed after the HTML). Self-contained, no dependencies.

   - Streams new emails into the inbox while the "problem" step is in view.
   - When the "solution" step hits the middle of the viewport, marks the
     inbox solved: streaming stops, the unread count counts down to zero,
     and every row swaps its category tag for a green Snoooz action.
   ============================================================ */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var inbox = document.getElementById('snooozInbox');
  var list = document.getElementById('snooozInboxList');
  var numEl = document.getElementById('snooozInboxNum');
  var footNumEl = document.getElementById('snooozFootNum');
  var countPill = document.getElementById('snooozInboxCount');
  var solutionStep = document.getElementById('snooozSolutionStep');
  if (!inbox || !list) return;

  var MAX_ROWS = 7;
  var BASE_COUNT = 248;
  var count = BASE_COUNT;
  var solved = false;
  var visible = false;
  var streamTimer = null;

  /* Pool of incoming emails (sender, initials, subject, category, tag, solved action) */
  var pool = [
    { from: 'Hannah Cole',   ini: 'HC', subj: 'Weekly product newsletter',      cat: 'marketing', tag: 'Marketing', act: 'Archived',          type: 'archived' },
    { from: 'Leon Garcia',   ini: 'LG', subj: 'Pricing for 25 seats?',          cat: 'sales',     tag: 'Sales',     act: 'Routed to Sales',    type: 'routed'   },
    { from: 'Mia Anderson',  ini: 'MA', subj: 'App will not load on mobile',     cat: 'support',   tag: 'Support',   act: 'Auto-replied',       type: 'replied'  },
    { from: 'Tom Becker',    ini: 'TB', subj: 'Change my shipping address',      cat: 'support',   tag: 'Support',   act: 'Auto-replied',       type: 'replied'  },
    { from: 'Aisha Khan',    ini: 'AK', subj: 'Update my card on file',          cat: 'billing',   tag: 'Billing',   act: 'Routed to Finance',  type: 'routed'   },
    { from: 'Noah Wright',   ini: 'NW', subj: 'How do I submit expenses?',       cat: 'internal',  tag: 'Internal',  act: 'Auto-replied',       type: 'replied'  },
    { from: 'Elena Rossi',   ini: 'ER', subj: 'Cancel my subscription',          cat: 'support',   tag: 'Support',   act: 'Escalated to you',   type: 'escalate' },
    { from: 'Kofi Mensah',   ini: 'KM', subj: 'Partnership inquiry',             cat: 'sales',     tag: 'Sales',     act: 'Routed to Sales',    type: 'routed'   },
    { from: 'Grace Park',    ini: 'GP', subj: 'Promo code is not working',       cat: 'support',   tag: 'Support',   act: 'Auto-replied',       type: 'replied'  },
    { from: 'David Cohen',   ini: 'DC', subj: 'Schedule an onboarding call',     cat: 'sales',     tag: 'Sales',     act: 'Routed to Sales',    type: 'routed'   },
    { from: 'Yuki Tanaka',   ini: 'YT', subj: 'Do you offer EU data residency?', cat: 'sales',     tag: 'Sales',     act: 'Routed to Sales',    type: 'routed'   },
    { from: 'Omar Haddad',   ini: 'OH', subj: 'Damaged on arrival, need help',   cat: 'support',   tag: 'Support',   act: 'Escalated to you',   type: 'escalate' }
  ];

  var times = ['now', '1m', '2m', '3m'];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function buildRow(item) {
    var row = document.createElement('div');
    row.className = 'snoooz-row snoooz-row--new';
    row.setAttribute('data-cat', item.cat);
    row.innerHTML =
      '<span class="snoooz-row__ava">' + esc(item.ini) + '</span>' +
      '<div class="snoooz-row__body">' +
        '<div class="snoooz-row__top"><span class="snoooz-row__from">' + esc(item.from) + '</span>' +
        '<span class="snoooz-row__time">' + esc(times[Math.floor(Math.random() * times.length)]) + '</span></div>' +
        '<div class="snoooz-row__subj">' + esc(item.subj) + '</div>' +
      '</div>' +
      '<div class="snoooz-row__side">' +
        '<span class="snoooz-row__dot" aria-hidden="true"></span>' +
        '<span class="snoooz-row__tag">' + esc(item.tag) + '</span>' +
        '<span class="snoooz-row__action snoooz-row__action--' + item.type + '">' + esc(item.act) + '</span>' +
      '</div>';
    return row;
  }

  function setCount(v) {
    count = v;
    if (numEl) numEl.textContent = v;
    if (footNumEl) footNumEl.textContent = v;
  }

  function addEmail() {
    var item = pool[Math.floor(Math.random() * pool.length)];
    list.insertBefore(buildRow(item), list.firstChild);
    while (list.children.length > MAX_ROWS) list.removeChild(list.lastElementChild);
    setCount(count + 1);
  }

  function startStream() {
    if (reduce || solved || streamTimer) return;
    streamTimer = window.setInterval(addEmail, 1500);
  }
  function stopStream() {
    if (streamTimer) { window.clearInterval(streamTimer); streamTimer = null; }
  }

  function easeOut(p) { return 1 - Math.pow(1 - p, 3); }

  function countDownToZero() {
    if (countPill) countPill.classList.remove('is-pulsing');
    if (reduce) { setCount(0); return; }
    var start = count;
    var t0 = null;
    var dur = 900;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      setCount(Math.round(start * (1 - easeOut(p))));
      if (p < 1 && solved) window.requestAnimationFrame(step);
      else if (solved) setCount(0);
    }
    window.requestAnimationFrame(step);
  }

  function solve() {
    if (solved) return;
    solved = true;
    stopStream();
    inbox.classList.add('is-solved');
    countDownToZero();
  }

  function unsolve() {
    if (!solved) return;
    solved = false;
    inbox.classList.remove('is-solved');
    if (countPill && !reduce) countPill.classList.add('is-pulsing');
    setCount(BASE_COUNT);
    if (visible) startStream();
  }

  /* Start/stop the stream only while the inbox is on screen (saves work) */
  var sectionObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      visible = e.isIntersecting;
      if (visible && !solved) startStream();
      else stopStream();
    });
  }, { threshold: 0 });
  sectionObs.observe(inbox);

  /* Solve when the solution step crosses the centre band of the viewport */
  if (solutionStep) {
    var solveObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) solve();
        else unsolve();
      });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    solveObs.observe(solutionStep);
  }
})();
