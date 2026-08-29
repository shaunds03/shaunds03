# Snoooz vs Shortwave — `/alternatives/shortwave`

Built on the **Snoooz vs Fyxer** template. The layout, CSS architecture, animation
behaviour and JS are the Fyxer page's; only the copy changes, plus one new block.

## Files

| File | What it is |
|---|---|
| `snoooz-vs-shortwave.html` | Single-file HubSpot page template (CSS + JS inlined in `{% raw %}` blocks, extends `layouts/base.html`). This is the one to upload. |
| `snoooz-vs-shortwave.css` | The same CSS, standalone, if you'd rather split it into a module. |
| `snoooz-vs-shortwave.js` | The same JS, standalone. **Byte-for-byte identical to the Fyxer page's JS.** |
| `snoooz-vs-shortwave-preview.html` | Plain-HTML preview for local checking (no HubL). |

## SEO

- **Title tag:** Snoooz vs Shortwave | AI That Resolves Email, Not Just Organizes It
- **Meta description:** Shortwave is an AI email client for Gmail teams. Snoooz answers,
  sends, routes, and follows up across Gmail, Outlook, and IMAP. Compare features side by side.
- **Slug:** `/alternatives/shortwave`
- **Target keywords:** Snoooz vs Shortwave, Shortwave alternative, AI email automation for
  shared inboxes

## What differs from the Fyxer page

- **"How they differ"** has **6** rows instead of 5 (switch apps / mailboxes / does it send /
  what it knows / who picks it up / cost to scale). The scroll spine and reveal JS handle any
  row count, so nothing changed in the script.
- **New section: "Same email, two outcomes"** (`.snzc-story`, CSS part 9 / HTML part 9), between
  "How Snoooz works" and the comparison table. It is deliberately **CSS-only** — the existing
  scripts use `document.querySelector` for a single instance per section, so reusing
  `.snzc-vs` or `.snzc-tbl` markup for a second block would have left it stuck at `opacity: 0`.
  Building it self-contained meant the JS could stay untouched.
- The comparison table has **19** rows instead of 15.
- Shortwave's brand pill is `SW`, since `S` is already Snoooz.
- Spine micro-labels are kept short ("Switch apps?", "Mailbox reach", "Who takes it?") because
  `.snzc-vs__label` is `white-space: nowrap` inside a 120px column — measured against the
  Fyxer page's widest label (131px) so nothing overlaps the cards.

## Before publishing

1. **Hero video.** The `<source>` points at
   `https://snoooz.ai/hubfs/Snoooz%20VS%20Shortwave%20video%20-%20compressed.mp4`, which does
   not exist yet. Upload a Shortwave cut to HubSpot Files under that name, or point the tag at
   another video. If there is never going to be one, drop the `.snzc-hero__stage` block.
2. **Re-verify the plan claims.** The 3/10/50 AI-filter caps and the per-seat pricing come from
   Shortwave's public pricing page. Re-check at each quarterly content review — pricing pages move.
3. **Do not** claim Shortwave lacks SOC 2 or ISO 27001. The page only says CASA Tier 2 is what
   they advertise, which is what their site says.
4. Add `Snoooz vs. Shortwave` to the footer Comparisons list and the `/alternatives` index.
