# MASTER PROMPT — IFH Connects Multi-Page Landing Site

> Copy everything below this line into your AI builder (Claude, Cursor, v0, Bolt, Lovable, etc.).

---

## 0. Your role

You are a senior product designer and front-end engineer. Build a **premium, responsive, multi-page marketing landing site** for **IFH Connects** (I Find House), a broker-free property rental platform in India.

This is **not** a single scrolling page. It is a small website with **separate HTML pages** linked from a shared navigation bar. Clicking a nav item must load a **different page** (a new URL), not scroll to a section.

Quality bar: it should feel as polished as Wise, Linear or Stripe marketing sites — confident typography, generous whitespace, one strong accent colour, smooth but restrained motion.

**Do not drop any content listed in this prompt.** Every heading, fact, price, step, FAQ and link in Section 5 must appear on the site. You may rewrite layout, but not remove information.

---

## 1. About the product (context)

**IFH Connects** is a broker-free property rental platform. Tenants discover and enquire about properties directly with owners — no broker in between. It covers **long-stay homes, short stays and office spaces**, and every listing is **IFH-verified**.

- **Tagline:** Find your place. Skip the broker.
- **Brand line (footer):** Zero brokerage, always
- **Meta description:** Find IFH-verified long-stay homes, short stays and office spaces in one clear, broker-free property platform.
- **Live app (all CTAs point here):** `https://app.beta.ifindhouse.in`
- **Business model:** Owners list for free and pay nothing. Tenants browse for free and pay a small **fixed** connection fee only when they choose to unlock an owner's contact. Never a percentage of rent.

**Users and surfaces**

| User | Surface | Purpose |
|---|---|---|
| Tenants | Web app and mobile app (iOS & Android) | Find, shortlist and enquire about properties |
| Property owners | Platform | List and manage properties, receive leads and payouts |
| IFH staff | Admin console | Operate the platform: properties, users, leads, payments, payouts, support and terms |

---

## 2. Tech stack and file structure

Keep the code **simple, readable and beginner-friendly**. No framework required.

- **HTML5 + CSS3 + vanilla JavaScript** (no build step; opens directly in a browser)
- One shared stylesheet, one shared script
- Fonts from Google Fonts: **Inter** (400, 600, 700, 900) and **Space Mono** (400, 700)
- Icons: inline SVG (Lucide-style, 1.75px stroke). No icon fonts.
- Comment each major section of HTML and CSS so a student can follow it.

```
ifh-landing/
├── index.html            ← Home (hub that introduces IFH and routes to the 3 pages)
├── why-ifh.html          ← Nav item 1: Why IFH
├── tenant.html           ← Nav item 2: Tenant
├── property-owner.html   ← Nav item 3: Property Owner
├── css/
│   └── styles.css        ← tokens + all components
├── js/
│   └── main.js           ← nav drawer, active link, FAQ accordion, reveal-on-scroll
└── assets/
    ├── logo.svg          ← placeholder IFH logo (text mark is fine)
    └── img/              ← city & property photos (use Unsplash placeholders)
```

The **header and footer must be identical on all four pages** (copy the same markup into each file).

---

## 3. Design system (follow exactly)

The look is **lime green, near-black and white**, set in **Inter**. Green is the **only** brand accent. Wise-inspired.

### 3.1 CSS tokens — put these on `:root`

```css
:root {
  /* Brand green */
  --green:          #9fe870; /* primary buttons, selection, focus, theme colour */
  --green-active:   #cdffad; /* hover / pressed */
  --green-neutral:  #c5edab; /* neutral brand tint */
  --green-pale:     #e2f6d5; /* washes, subtle backgrounds */
  --green-ink:      #163300; /* text on green surfaces */

  /* Ink */
  --ink:            #0e0f0c; /* primary text, strong borders, text on green buttons */
  --body:           #454745; /* secondary text */
  --muted:          #868685; /* muted text, "rented" state */

  /* Surfaces */
  --canvas:         #ffffff;
  --canvas-soft:    #e8ebe6; /* sage-grey secondary surface */
  --surface-tint:   #f6f8f4;
  --border:         #cfd4cc;

  /* Status (always paired with text + icon, never colour alone) */
  --success: #2ead4b;  --success-deep: #054d28;
  --warning: #ffd11a;  --warning-deep: #b86700; --warning-soft: #fdf2d6;
  --danger:  #d03238;  --danger-deep:  #a72027;
  --info:    #38c8ff;
  --accent-orange: #ffc091;

  /* Type */
  --font-display: "Inter", system-ui, -apple-system, sans-serif;
  --font-ui:      "Inter", system-ui, -apple-system, sans-serif;
  --font-mono:    "Space Mono", ui-monospace, monospace;

  --fs-mega: 126px; --fs-xxl: 96px; --fs-xl: 64px; --fs-lg: 47px;
  --fs-md: 40px;    --fs-sm: 32px;  --fs-xs: 24px;
  --fs-body-l: 20px; --fs-body-m: 16px; --fs-body-s: 14px; --fs-caption: 12px;
  --fs-h1: clamp(32px, 4vw, 48px);
  --fs-h2: clamp(26px, 3vw, 36px);
  --fs-h3: clamp(20px, 2vw, 24px);

  /* Shape & spacing */
  --r-input: 12px; --r-card: 16px; --r-lg: 24px; --r-pill: 999px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;
  --container: 1280px;

  /* Motion */
  --dur-fast: 150ms; --dur: 220ms; --dur-page: 300ms;
  --ease: cubic-bezier(.2,.8,.2,1);
  --focus-ring: 0 0 0 2px #fff, 0 0 0 6px rgba(159,232,112,0.65);
}
```

### 3.2 Typography rules

- Marketing hero headings: **Inter 900**, tight line-height (0.95–1.05). Use `clamp()` so the hero scales from ~44px on mobile up to `--fs-xxl` (96px) on desktop. Letter-spacing never below `-0.04em`.
- Section headings: Inter 700–900, `--fs-h2`.
- Body: Inter 400, 16–20px, line-height 1.55, colour `--body`.
- **Eyebrow labels / numbers / prices / step numbers:** Space Mono 12–14px, 700, uppercase, `0.08em` tracking (e.g. `01`, `BEFORE YOU ASK`, `₹99`).
- Max line length for paragraphs: ~65 characters.

### 3.3 Components

- **Primary button:** lime fill (`--green`), `--ink` text, Inter 600, min-height 48px, pill radius, hover → `--green-active`, slight lift (translateY -1px).
- **Secondary button:** `--canvas-soft` fill, ink text, same size.
- **Ghost / text link:** ink text, underline on hover, arrow icon that nudges right 4px.
- **Cards:** white, 16–24px radius, 1px `--border`. Prefer **surface contrast over shadows**; only floating elements (sticky nav, dropdown) get a soft shadow.
- **Inputs:** white, 1px ink border, 12px radius, explicit labels.
- **Badges/pills:** "IFH verified" (green-pale bg + check icon), "Available now" (success + dot icon + text), "Rented" (muted + text).
- **Focus:** every interactive element shows `--focus-ring` on `:focus-visible`.
- Touch targets ≥ 44px.

### 3.4 Premium aesthetic direction

- Big, confident type and lots of air. Sections separated by **alternating surfaces**: white → sage (`--canvas-soft`) → white → **ink (dark) band** for emphasis moments (e.g. the brokerage comparison).
- **Bento grids** for features (mixed card sizes, 2–3 columns desktop, 1 column mobile).
- Lime used sparingly: buttons, highlights, a lime underline/marker behind one key word in each hero (e.g. "**Skip the broker.**").
- Rounded image masks (24px) on property and city photos; subtle zoom (scale 1.04) on hover.
- Numbers rendered big in Space Mono for stats/prices.
- No gradients-everywhere, no glassmorphism overload, no stock "handshake" clichés. Clean, editorial, trustworthy.

### 3.5 Motion

- Reveal on scroll: fade + 16px rise, 220ms, staggered 60ms for grid children (use `IntersectionObserver`).
- **Page-to-page transition:** add cross-document View Transitions so moving between pages feels smooth:
  ```css
  @view-transition { navigation: auto; }
  ```
  Browsers that don't support it simply load the page normally.
- State changes 150–220ms. Nothing bouncy.
- `@media (prefers-reduced-motion: reduce)` → disable movement, keep opacity-only fades.

---

## 4. Global layout (all pages)

### 4.1 Header / Navbar (sticky)

- **Left:** IFH logo + wordmark "IFH Connects", small caption "Rent, stay or find an office". Clicking it goes to `index.html`.
- **Centre/right — exactly three nav links:**
  1. **Why IFH** → `why-ifh.html`
  2. **Tenant** → `tenant.html`
  3. **Property Owner** → `property-owner.html`
- **Far right CTA:** primary button "Open app" → `https://app.beta.ifindhouse.in`
- **Active state:** the current page's link gets an ink underline bar (or lime pill background) and `aria-current="page"`. Set this in `main.js` by comparing `location.pathname`.
- On scroll > 8px: header gets white background, 1px bottom border and a soft shadow.
- **Mobile (< 900px):** hamburger button (44px) opens a full-height slide-in drawer with the three links as large 32px Inter 700 items, plus the "Open app" button. Close on link click, ✕ button and `Esc`. Lock body scroll while open. Use `aria-expanded`.

### 4.2 Footer (dark ink band, all pages)

Four link columns + bottom bar. Keep **every** link:

- **Rent a home:** All rental homes · 1 BHK · 2 BHK · 3 BHK · PG & co-living · Villas
- **Workspaces:** All offices · With meeting rooms · Dedicated desks · Compare spaces
- **For owners:** List your property · Owner dashboard · Run a deal · Pricing · Owner support
- **IFH Connects:** About us · Journal · Help centre · Terms · Privacy

Bottom bar: logo · "I Find House" · `© 2026 IFH Connects · All prices in INR` · **"Zero brokerage, always"** (in lime).

Link targets (prefix with `https://app.beta.ifindhouse.in`):
`/properties?category=rental_home`, `...&bhk=1BHK`, `...&bhk=2BHK`, `...&bhk=3BHK`, `/properties?property_type=pg`, `/properties?property_type=villa`, `/properties?category=office_space`, `...&amenities=meeting_room`, `...&amenities=dedicated_desks`, `/compare`, `/list-your-property`, `/owner`, `/owner/deals`, `/pricing`, `/support`, `/about`, `/blog`, `/faq`, `/legal/terms`, `/legal/privacy`.

### 4.3 Floating "Ask IFH" button

Bottom-right pill button with a sparkle icon labelled **"Ask IFH"** (represents the in-app AI assistant). Links to the app. Hide label on mobile, keep icon.

---

## 5. Pages and content (do not lose any of this)

### PAGE A — `index.html` (Home / hub)

Purpose: first impression + send each visitor to the right page.

1. **Hero** (white, large)
   - Eyebrow: `ZERO BROKERAGE · IFH VERIFIED`
   - H1: **"Verified homes, short stays and offices"**
   - Sub: "Rent a home, book a short stay or find an office. Browse IFH-verified listings and connect directly with owners."
   - A **search card** mock: tabs **Rent / Offices**, input placeholder **"Where do you want to live?"**, an **"IFH AI"** chip, primary button **"Find a home"**, link **"Not sure where? Try guided search"**.
   - Under it, label "Describe it in your own words" with three clickable example chips: **"2BHK under 25k in Adyar"**, **"furnished studio in Koramangala"**, **"3BHK villa in Mumbai for a family"**.
   - Trust row (icon + text): **Clear property details · Trust-first search · One account**
   - All search actions link to `https://app.beta.ifindhouse.in/properties`.
2. **"Who are you?" doorway** — two large split cards side by side:
   - **"Looking for a place"** → `tenant.html`
   - **"I have a place to list"** → `property-owner.html`
   Each with a short line, an arrow, and a photo. Hover: card lifts, arrow moves.
3. **Three categories strip:** Long-stay homes · Short stays · Office spaces (icon cards).
4. **Brokerage teaser (ink band):** "A month's rent is the going rate for brokerage. *We charge a fixed fee instead.*" — Through a broker: **one to two months' rent** vs Through IFH: **₹0**. Button "Why IFH →" → `why-ifh.html`.
5. **Rentals by city** — "Where renters are moving": Bengaluru, Chennai, Mumbai, Hyderabad, Pune, Coimbatore (photo tiles; horizontal scroll-snap on mobile). Each links to `/properties?category=rental_home&city=<City>&status=available`.
6. **Final CTA band** (lime-pale): "Find your place. Skip the broker." + buttons "Browse homes" (app) and "List your property" (`property-owner.html`).

---

### PAGE B — `why-ifh.html` (Why IFH)

Purpose: explain the mission, trust and the zero-brokerage model.

1. **Hero:** Eyebrow `ABOUT` · H1 **"Renting, without the middleman."** · Body: "IFH Connects is a broker-free property platform. Tenants browse listings for free, with no login. When you find a place you like, you enquire, verify your number, choose a plan, and unlock the owner's contact — directly, with no brokerage. Owners list properties and connect with genuinely interested tenants. We moderate every listing."
2. **The brokerage comparison (ink band, big numbers):**
   Headline: "A month's rent is the going rate for brokerage. *We charge a fixed fee instead.*"
   Two columns — **Through a broker:** one to two months' rent · **Through IFH:** ₹0.
   Copy: "Owners pay nothing, ever. You pay a small fixed fee only when you choose to contact one — never a percentage of your rent. Every listing is checked against ownership documents before it goes live, so the saving never costs you certainty."
   Link: "See what connecting costs" → `tenant.html#pricing`.
3. **Three pillars (bento):**
   - **Zero brokerage** — tenants connect directly with property owners.
   - **Verified listings** — long-stay homes, short stays and office spaces in one place.
   - **Direct with the owner** — no agent in the middle, no commission on rent, no one taking a cut of the deposit.
4. **What "IFH verified" means** (split layout, badge illustration): "Our team has checked the listing against ownership documents and confirmed the property exists as described. Verification covers the listing and the owner's identity — it is not a survey, and it does not inspect condition."
5. **Everything in one platform (feature bento grid)** — include all:
   Zero brokerage · Verified listings · Search & discovery (browse, filter, property details, wishlist, compare) · Enquiry flow (enquire → OTP verify → pick a plan) · Paid access (full details unlock with a plan) · Payments & GST invoices · Messaging & visits (chat with owners, schedule visits) · Reviews, support & notifications · **AI assistant** (in-app "Ask IFH" widget).
6. **One experience, every screen:** Tenant web app · Mobile app (iOS & Android) · Admin console for IFH's property, support and finance teams (role-based). Show as three device cards.
7. **Journal — "Worth reading before you sign"** (3 article cards, link "All articles" → `/blog`):
   - MONEY · 28 August 2026 · 6 min — **What brokerage actually buys you** — "A month of rent is the going rate in most Indian cities. Here is what that fee covers, and what it does not." → `/blog/what-brokerage-actually-buys-you`
   - MONEY · 14 August 2026 · 8 min — **Deposit rules, city by city** — "Ten months in Bengaluru, two in Mumbai, negotiable almost everywhere. What is normal and what is a red flag." → `/blog/deposit-rules-city-by-city`
   - RENTING · 30 July 2026 · 5 min — **Reading a rent agreement in ten minutes** — "Six clauses decide whether the next eleven months go smoothly. The rest is boilerplate." → `/blog/reading-a-rent-agreement`
8. **FAQ — "Before you ask / Questions people actually have"** (accordion, all six — full answers in Section 6).
9. **CTA:** "Find your place. Skip the broker." → buttons to `tenant.html` and `property-owner.html`.

---

### PAGE C — `tenant.html` (Tenant)

Purpose: everything a renter needs, ending in pricing.

1. **Hero:** Eyebrow `FOR TENANTS` · H1 **"Find your next space. Skip the broker."** · Sub: "Browse every IFH-verified home, short stay and office for free — no account needed. Pay only when you want to talk to an owner." · Same search card + example chips as Home · Buttons "Browse homes" / "See pricing" (`#pricing`).
2. **What you can find** (category bento):
   - **Rent a home:** 1 BHK · 2 BHK · 3 BHK · PG & co-living · Villas
   - **Short stays:** one night or more where the owner allows; minimum-night rules shown on each listing.
   - **Workspaces:** All offices · With meeting rooms · Dedicated desks · Compare spaces
   Each item links to the matching app URL from Section 4.2.
3. **Rentals by city** (same six cities as Home).
4. **Homes available now** — 4–6 **sample listing cards** (photo carousel dots, "IFH verified" badge, status badge, title, `BHK · Baths · Locality`, suitable-for line, amenity chips like Pet-friendly / 24×7 water / Gated community / Parking / Lift, price in Space Mono e.g. **₹20,000 /month**, buttons **View details**, **Contact owner**, and a **Compare** checkbox). Use realistic, clean sample data (e.g. "2BHK in Madhapur, Hyderabad — ₹30,000/month — Gated community, Parking, Lift"; "Independent 3BHK house in Jayanagar, Bengaluru — ₹45,000/month — Parking, 24×7 water, Ground floor"). **Do not copy test listings.** Show at least one card in the "Rented" state (muted, with text label). Link "View all" → app.
5. **How it works — three steps** (big Space Mono numbers):
   - **01 Search everything, free** — Every listing, every photograph, every filter. No account needed and nothing held back behind a signup.
   - **02 Connect when you are sure** — Pay a fixed fee to unlock an owner's number — only for the places you actually want to see.
   - **03 Deal direct with the owner** — No agent in the middle, no commission on your rent, and no one taking a cut of your deposit.
   Then a small horizontal **enquiry flow** strip: Send enquiry → Verify by OTP → Pick a plan → Unlock owner details.
6. **Tenant tools (bento):** Wishlist / Saved · Compare listings · Chat with owners · Schedule visits · Reviews · Notifications · Online payments with GST invoices · Ask IFH AI assistant.
7. **Pricing (`id="pricing"`)** — three cards, middle one highlighted with a lime **"Best value"** badge:

   | Plan | Access | Price | Connections |
   |---|---|---|---|
   | **Single 30** — "Get started — connect with a handful of owners." | 30-day access | **₹99** one-time | 1 owner connection · valid 30 days |
   | **Plus** — "More connections, more time to compare." | 60-day access | **₹299** one-time | 20 owner connections · valid 60 days |
   | **Pro** — "Most connections and the longest runway." | 90-day access | **₹699** one-time | 50 owner connections · valid 90 days |

   Each card: "Total price · GST included" and these included features (check icons): Owner's direct number & WhatsApp · Chat with the owner directly · Full photos & video tour · Exact address & map location · Schedule a visit · Zero brokerage, ever. Button **"Buy credits"** → `/pricing`.
   Below cards: "Browse every listing for free. Pay only when you want an owner's contact, exact address, video tour and visit scheduling — then talk to owners directly, with zero brokerage."
   Trust chips: **GST included · No brokerage · No recurring charge**
   Fine print: "You'll choose a property and pay only after showing interest and verifying your number. Access stays active until the plan expires or its unlocks are used."
8. **Tenant FAQ** (accordion): Is there really no brokerage? · What does "IFH verified" mean? · How quickly do owners reply? · Can I book a short stay for one night? · What happens to my deposit?
9. **CTA band:** "Your next home is already listed." → "Browse homes" (app).

---

### PAGE D — `property-owner.html` (Property Owner)

Purpose: convince owners to list for free.

1. **Hero:** Eyebrow `FOR OWNERS` · H1 **"List your home. Skip the broker."** (lime marker under "Skip the broker.") · Sub: "Reach verified tenants directly on IFH Connects. Listing is free, leads are real, and there is no brokerage on your rent — not now, not ever." · Buttons **"Start your listing"** → `/owner/properties/new` and **"I already have a listing"** → `/owner/properties`. Right side: a mock owner-dashboard card (listing preview, "3 new enquiries", "Under review → Published" status with text + icon).
2. **Three benefits:**
   - **Free to list** — Post your property in minutes. You only ever pay zero — tenants pay a small fee to reach you.
   - **Verified leads only** — Every tenant is phone-verified before they can contact you. No spam, no time-wasters.
   - **No brokerage, ever** — Deal with tenants directly. There is no broker in the middle and no commission on your rent.
3. **How it works — "Three steps to your first tenant"** (connected timeline):
   - **01 List it** — Add photos, rent, and details in a short guided form.
   - **02 We review it** — Our team checks the listing and publishes it — usually within a day.
   - **03 Get direct enquiries** — Verified tenants unlock your contact and reach out. You stay in control.
4. **What you can list:** Long-stay homes · Short stays (you set minimum-night rules) · Office spaces.
5. **Owner tools (bento):** Owner dashboard · Manage properties · Receive leads · Run a deal · Payouts · Owner support. Each links to its app URL (`/owner`, `/owner/deals`, `/support`).
6. **"What listing costs" (ink band, big type):** **₹0.** "Listing, photographs, enquiries and the owner dashboard are free, and there is no commission on your rent. We are paid by tenants who choose to connect."
7. **Verified = trust** strip: every listing is checked against ownership documents; verification covers the listing and the owner's identity.
8. **Owner FAQ** (accordion): I am an owner. What does listing cost? · What does "IFH verified" mean? · Is there really no brokerage? · What happens to my deposit?
9. **Final CTA:** **"Ready to find your tenant?"** — "It takes a few minutes and your first listing is free." → **"Start your listing"**.

---

## 6. FAQ answers (use verbatim)

- **Is there really no brokerage?** — No brokerage, ever. You browse and shortlist for free, and pay a fixed connection fee only when you choose to unlock an owner's contact details. The owner pays nothing and never owes a commission on rent.
- **What does "IFH verified" mean?** — That our team has checked the listing against ownership documents and confirmed the property exists as described. Verification covers the listing and the owner's identity — it is not a survey, and it does not inspect condition.
- **How quickly do owners reply?** — Most reply the same day. Owner response time is shown on each listing, so you can weigh it before you spend a connection on someone who has not logged in for a fortnight.
- **Can I book a short stay for one night?** — Yes, where the owner allows it. Minimum-night rules are set per property and shown on the listing before you reach payment.
- **What happens to my deposit?** — Deposits are agreed and paid directly between you and the owner — IFH never holds them. The listing shows the deposit in rupees before you connect, so it is never a surprise at signing.
- **I am an owner. What does listing cost?** — Nothing. Listing, photographs, enquiries and the owner dashboard are free, and there is no commission on your rent. We are paid by tenants who choose to connect.

Accordion: `<button aria-expanded>` + panel, smooth height animation, plus/minus icon rotating, only one open at a time.

---

## 7. Responsiveness

Mobile-first CSS. Breakpoints:

| Width | Layout |
|---|---|
| < 600px | 1 column, 16px side gutter, hero H1 ~44px, buttons full-width, city tiles in horizontal scroll-snap, pricing cards stacked (Plus first) |
| 600–899px | 2-column grids, hamburger nav still |
| 900–1279px | full nav, 2–3 column bento |
| ≥ 1280px | container max 1280px, 3-column bento, hero side-by-side with visual |

- No horizontal page scroll at any width (test at 360px).
- Images: `loading="lazy"`, `aspect-ratio` set, `object-fit: cover`.
- Respect `env(safe-area-inset-*)` for notched phones.

---

## 8. Accessibility (WCAG 2.2 AA)

- Semantic landmarks (`header`, `nav`, `main#main`, `footer`), one `h1` per page, logical heading order.
- "Skip to content" link as first focusable element.
- Visible focus ring everywhere (`--focus-ring`).
- Status never by colour alone — always text + icon.
- Colour contrast AA (ink on lime is fine; never white text on lime).
- All images have meaningful `alt`; decorative SVGs `aria-hidden="true"`.
- Touch targets ≥ 44px.

---

## 9. SEO & meta (each page)

- `<title>`: "IFH Connects — Rent, stay or find an office" (Home), "Why IFH · IFH Connects", "For Tenants · IFH Connects", "For Owners · IFH Connects".
- Meta description (per page, based on its hero sub).
- `<meta name="theme-color" content="#9fe870">`, `lang="en-IN"`, Open Graph title/description, favicon.

---

## 10. Acceptance checklist (verify before finishing)

- [ ] Four separate HTML files; the navbar has **exactly three links: Why IFH, Tenant, Property Owner**, each opening its own page.
- [ ] Logo returns to Home; current page is highlighted in the nav.
- [ ] Mobile drawer opens/closes with button, link click and `Esc`.
- [ ] Every item in Sections 5 and 6 is present (headings, steps, all 3 plans with ₹99 / ₹299 / ₹699, all six FAQs, six cities, three journal articles, all footer links).
- [ ] Only the defined colour tokens are used; Inter + Space Mono loaded.
- [ ] Looks premium: big type, whitespace, alternating surfaces, one ink band per page, lime used sparingly.
- [ ] Smooth page transitions + scroll reveals, disabled under reduced motion.
- [ ] Fully responsive from 360px to 1440px+, no horizontal scroll.
- [ ] All CTAs point to the correct `https://app.beta.ifindhouse.in/...` URLs.
- [ ] Clean, commented, beginner-readable code.

Build all four pages completely — no placeholders like "content goes here".
