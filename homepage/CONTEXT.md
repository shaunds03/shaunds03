# Snoooz — Build Context Brief

Reference doc for building/repositioning the Snoooz marketing site. Paste relevant parts
into a new session before a request (e.g. "build the homepage how-it-works section").

## Company
Snoooz (snoooz.ai) — AI-powered email assistant. Founded Oct 2022, Ontario, Canada;
bootstrapped, DMZ incubator. Started as an out-of-office auto-responder, now a full AI email
assistant. CMS is **HubSpot** (some pages hand-built HTML/CSS/JS pasted into modules).

Connects to **Gmail, Outlook (incl. classic desktop), and IMAP/SMTP**. Can **draft, send,
categorize, label, route, forward, and follow up** on email based on user rules, company
knowledge, and tone.

- AI drafting + autonomous sending (draft-first, then automate what you trust)
- Auto-categorize, label, route, forward, escalate
- Conversation mode + auto follow-ups (count/timing/working-hours/attachments; auto-stops on reply)
- Train on knowledge: docs, FAQs, website crawl, Zendesk, Intercom, Document360, SharePoint
- Sentiment + language detection; human-like reply delays
- Chrome + Edge extensions; modern + **classic** Outlook add-in (rare among competitors)
- MCP server (manage Snoooz from ChatGPT/Claude)
- Base model Gemini; **BYOK + 300+ models via OpenRouter**

**Integrations:** Email (Gmail, Outlook, IMAP/SMTP) · CRM (Salesforce, HubSpot) · Helpdesk
(Zendesk, Intercom, Document360) · E-commerce (Shopify, WooCommerce, BigCommerce — some beta) ·
ERP (SAP, Dynamics, Odoo) · Calendar (Google, Outlook, Calendly, Chili Piper) · Knowledge
(SharePoint, website, FAQs/PDFs).

**Security/compliance:** SOC 2 Type 2, ISO 27001, GDPR, HIPAA, CASA Tier 2. **EU data residency
on every plan** (not gated). Customer email **never** trains public AI models.

**Scale claims:** 3,000+ customers, 60+ countries. Inbox Impact Report: 2.5M emails processed,
416K+ hours saved, $15.6M estimated productivity value. 4.86★ across 88 AppSumo reviews.

## Positioning (Camp 2)
> Snoooz answers your repetitive inbound email from your own knowledge — drafting, sending,
> routing, and following up — and escalates to a human only when it should. Built to pass
> enterprise security review.

Deflection + human-in-the-loop. Lead with **teams** (support, sales, internal help); give
individuals a self-serve side door. **No OOO/vacation framing** on team/enterprise pages.

**Two audiences:** (1) AppSumo/lifetime buyers = feeder/proof, kept on their own path;
(2) Enterprise/SaaS = the recurring-revenue goal, owns the homepage. Logos on the site are
largely AppSumo individuals — frame as "professionals and teams at," **not** company-wide deployments.

**Enterprise use-case patterns (name logos only with permission):** Gong (CS deflection),
Noriance (law firm, PAYING — draft + validate), GlobalFoundries (SharePoint policy Q&A),
Cadillac Fairview (seasonal CX surge), Capelli Sport (e-commerce), Spendhound (after-hours sales).

## Competitors (keep claims accurate, be fair)
- **Fyxer** — personal/EA productivity; **drafts only, never sends**; Gmail/Outlook only;
  SOC2 T2/ISO/GDPR/HIPAA(ent). Edge they have: meeting notetaker. Compliance ≈ tie (don't claim a win).
- **Jace** — personal AI EA; weakest compliance (SOC 2 **Type 1**, CASA T3) — a real Snoooz win.
- **Serif** — closest competitor; "runs your inbox like an employee"; SOC2 T2/HIPAA/GDPR/CASA but
  **no ISO 27001, no stated EU residency**. SMB/lean teams.

**Snoooz edges:** autonomous send, functional/shared inboxes, KB training, routing by CRM/sentiment,
IMAP, classic Outlook, deeper integrations, ISO 27001, EU residency, BYOK/300+/MCP, draft-first
for regulated teams. **Biggest gap vs all:** they have named quantified case studies; we have logos.

## Pricing (illustrative; credits ≈ 1 per email, headline metric)
Self-serve (monthly; annual ≈ 20% off): **Starter ~$29** (1 seat, 1,500 cr) · **Team ~$99**
(3 seats, 6,000 pooled cr, "Most popular") · **Scale ~$299** (10 seats, 20,000 pooled cr) ·
**Enterprise** custom (priced on conversations resolved, not seats; SSO/SCIM, CSM, DPA/SLA).
Add-ons: extra credits $10/1,000 · extra seat $10–12/mo · extra workspace $8–10/mo.
Free trial: standardize on **14 days** everywhere.

## Brand & design system (match exactly)
**Font:** Open Sans (400/600/700/800). Headings tight letter-spacing (~-0.035 to -0.05em), bold 700.

```css
--snoooz-bg: #f7f9f4;            /* off-white green-tinted background */
--snoooz-text: #102421;          /* near-black green */
--snoooz-muted: #60706d;         /* muted grey-green body text */
--snoooz-border: #dfe8e2;        /* hairline borders */
--snoooz-primary: #0F5B44;       /* brand dark green (CTAs, accents) */
--snoooz-primary-hover: #053533; /* darker green hover */
--snoooz-secondary: #D6D9A0;     /* sage/olive accent */
--snoooz-secondary-hover: #A5AE47;
--snoooz-secondary-soft: rgba(214, 217, 160, 0.26);
--snoooz-shadow: 0 18px 50px rgba(15, 91, 68, 0.06);
```

- Glassmorphic cards: translucent white, `backdrop-filter: blur(10px)`, soft green shadows.
- Rounded corners 18–28px on cards; pill buttons/chips `border-radius: 999px`.
- Radial-gradient background washes (sage top-left, faint green top-right).
- ✓ bullets in primary green; "Most popular" ribbon in primary green.
- Dark-green gradient banners for enterprise tiers / closing CTAs.
- Max content width ~1080–1180px; ~72px top section padding.
- Responsive to mobile, visible keyboard focus, `prefers-reduced-motion` respected.

**Tone:** plain verbs, sentence case, specific over clever, outcome-led, from the user's side.
No OOO/vacation framing on team/enterprise pages.

**Build output convention:** split into separate CSS / HTML / JS (for HubSpot modules) plus an
assembled standalone HTML preview file. Prefix all classes/IDs to avoid collisions.

## Homepage page map (Camp 2)
1. Hero · 2. Logo wall · 3. Problem/category · 4. How it works (employee model) ·
5. What it does (capabilities as outcomes) · 6. Use cases (team & industry) · 7. Integrations ·
8. Security/trust (pulled up) · 9. Proof (stats + case study + attributed testimonials + ROI) ·
10. Why Snoooz · 11. FAQ · 12. Final CTA (demo-first). Primary CTA = **Book a demo**;
secondary = **Start free**.

## Files
- `homepage/hero/` — hero section (CSS / HTML / JS + assembled preview).
- `homepage/social-proof/` — logo wall / social proof (CSS + HTML, CSS-only marquee; + preview).
- `homepage/problem/` — problem/category section: pinned scroll stage where the busy inbox
  slides right→left while problem text exits and solution text enters from the right; inbox
  reorganizes itself (green) on solve, with a "Your inbox, handled by Snoooz" caption. Mobile
  keeps positions and crossfades in place. CSS / HTML / JS + preview.
- `homepage/how-it-works/` — four steps, each an animated "Snoooz app" that plays on scroll into
  view and loops: connect inboxes, train on knowledge (file drop), review mode (draft/edit/send),
  autopilot toggle. CSS / HTML / JS + preview.
- `homepage/use-cases/` — six-card grid by team & industry with themed SVG icons, hover lift, and
  a staggered scroll-reveal. CSS / HTML / JS + preview.
- `homepage/providers/` — "Works with every email provider": hub-and-spoke diagram with the Snoooz
  logo centered and provider logos around it. JS draws the connector arrows between real element
  positions and animates green dots flowing into the hub; recomputes on resize; mobile re-rings the
  nodes. CSS / HTML / JS + preview.
- `homepage/integrations/` — business integrations (CRM, helpdesk, e-commerce, ERP, calendars):
  a dark, futuristic bento grid with a neon-bordered Snoooz core, animated grid backdrop, cursor
  spotlight, and logo chips. Intentionally a different style from the email-provider hub; fits in
  one glance. CSS / HTML / JS + preview.
- `homepage/proof/` — Inbox Impact Report teaser: copy + dark-green dashboard card with figures
  that count up on scroll. CSS / HTML / JS + preview.
- `homepage/cases/` — enterprise case cards (Gong, Noriance, GlobalFoundries, Cadillac Fairview),
  framed as use-case patterns (no invented metrics). CSS / HTML / JS + preview.
- `homepage/security/` — security/trust band: compliance badges + three reassurance points + Trust
  Center CTAs. CSS / HTML / JS + preview.
- `homepage/why/` — Why Snoooz differentiation cards (vs personal assistant / autoresponder /
  hiring), link to /compare. CSS / HTML / JS + preview.
- `homepage/faq/` — accessible accordion of the enterprise FAQs. CSS / HTML / JS + preview.
- `homepage/cta/` — final demo-first CTA band (dark green). CSS / HTML / JS + preview.
- `homepage/build_previews.py` — regenerates every section preview + homepage-preview.html from
  source. Run after editing any section.

Section order (homepage-preview.html): hero, social-proof, problem, how-it-works, use-cases,
providers, integrations, proof, cases, security, why, faq, cta.
- `homepage/homepage-preview.html` — assembled full-page preview (stacks all sections built so far).

Content rule: no em dashes in user-facing copy.
- (Pricing page design is the styling reference; see the uploaded pricing preview HTML.)
