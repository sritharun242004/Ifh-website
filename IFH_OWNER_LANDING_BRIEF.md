# IFH Owner Landing Page - Build Brief for Claude Code

Read this whole file before writing any code. It is the single source of truth for this page.

---

## 0. What you are building

A **mobile-first, single-page homeowner sign-up page** for IFH (I Find House). Traffic comes only from **Meta (Facebook/Instagram) ads**, on phones, mostly mid/low-end Android, on 4G.

**Audience:** house owners in tier 2/3 towns of south Tamil Nadu (Tenkasi, Tirunelveli, Kanyakumari...). Not highly educated in English. They decide in seconds.

**The only goal:** get the owner to submit the form. Every element either builds trust or pushes to the form. Nothing else.

**Offer:** Posting on IFH is normally paid. **The first 500 owners post free.** A live counter shows how many free spots are left. It drops by 1 for every real sign-up.

**This is NOT a traditional website.** No nav menu, no feature lists, no city pages, no FAQ wall. Think: a poster that scrolls, with a form at the end.

---

## 1. Work inside the existing project

- The current site runs at `http://localhost:3006/`. Inspect the project first: framework, routing, styling system, animation libraries already installed, image folder.
- **Reuse the existing stack.** Do not introduce a new framework.
- This page **replaces the current homepage** (`/`). Before replacing, move the current homepage to `/legacy` so nothing is lost.
- **Keep and reuse** from the current site:
  - The **curved number dial animation** (the 01 → 04 dial in the "Why IFH / Renting, without the middleman" section). It is reused in Section 3.
  - The logo component (smiling-house mark).
- **Drop** everything else from the current homepage: villa hero, marquee, platform features, "pick your doorway", rentals by city, visit calendar, FAQ, big footer.
- **Do NOT use** the black-and-white tiled-roof house photo from the "brokerage maths" section anywhere.
- Put all page copy in one file (e.g. `landing/copy.ts`) and all config (seat total, town list, WhatsApp number, sample rent) in one file (e.g. `landing/config.ts`), so they can be edited without touching components.

---

## 2. Design system (locked - follow exactly)

**Colour**
| Token | Hex | Use |
|---|---|---|
| `pine` | `#14453B` | Primary. Headlines accents, buttons, the ₹0 |
| `pine-press` | `#0E322A` | Button pressed, deepest text accents, 3D extrusion shade |
| `pine-tint` | `#E8ECEB` | Soft surfaces, cards, chips |
| `success` | `#1F9D55` | Live dot on counter, success state only |
| `ink` | `#0F1A17` | Body text |
| `muted` | `#6B7A76` | Secondary text, the "broker" side of the comparison |
| `white` | `#FFFFFF` | Background. **White only. No cream, no beige.** |

- No lime / bright grass green anywhere. The current site's lime accent must be replaced with pine.
- Gradients: only a **subtle radial pine-tint wash** behind the hero is allowed. No mesh, aura or multi-colour gradients.

**Type**
| Role | Font | Notes |
|---|---|---|
| Headlines | **Manrope** 800 | Huge, tight leading (0.95-1.0), letter-spacing -0.03em |
| Body / UI / form | **Hanken Grotesk** 400-600 | Min 16px (prevents iOS zoom on inputs) |
| Numbers (counter, ₹0, dial) | **Montserrat** 800-900 | `font-variant-numeric: tabular-nums` so numbers never shift layout |
| The one Tamil line | **Noto Sans Tamil** 800 (or Catamaran 800) | Only for "நம்ம ஊரு App" |

- **No serif fonts anywhere.**

**Language rule (important)**
- **No Tamil script on the page except the brand line "நம்ம ஊரு App".**
- Everything else is **simple English or Tanglish written in English letters** (e.g. "Free-ah Post Pannunga", "Unga veedu"). Short words. No jargon. No paragraphs.
- Max ~12 words of visible text per screen, excluding the form.

**Layout feel**
- **Negative space is the design.** One idea per screen. Huge type, lots of white.
- Each section is roughly one phone screen tall (`min-height: 100svh`), content vertically centred or bottom-weighted.
- Corners: 20-28px radius on cards, full pill on buttons.
- Primary button: full-width pill, pine background, white text, 56px tall, arrow icon. Pressed = pine-press + scale 0.98.

**Visual references** (Madhan will place screenshots in `/references/`; open and study them before designing)
- *Nearo waitlist page*: centred big headline, very calm, early-access feel, soft tint wash, phone mockup.
- *GoMart app welcome screen*: top half is a **mosaic of tilted, rounded photo tiles**, bottom half is a short bold centred headline + one line + one black pill button. Very clean. **Use this as the model for the hero.**
- Two **reveal-animation** references (videos). If frames are in `/references/`, match their motion. If not, use the motion spec in section 5.

---

## 3. Page structure (mobile, 360-430px wide is the primary design)

### Always visible: Top bar (slim, 56px, white, no menu)
- Left: IFH logo.
- Right: **live seat chip** in pine-tint: green pulsing dot + `449 left` (real number).

### Sticky bottom CTA bar
- Appears once the hero CTA scrolls out of view. Hides when the form section is on screen.
- Content: `449 free spots left` (small) + pill button `Post Free →`. Tapping scrolls smoothly to the form.
- Respect the iPhone safe area (`env(safe-area-inset-bottom)`).

---

### Section 1 - Hero (the hook + the counter)

Layout like the GoMart reference:
- **Top ~45%:** mosaic of 4 tilted rounded photo tiles (slots `hero-1` to `hero-4`, see section 6), slight random rotations (-6° to 6°), overlapping. They animate in with a stagger.
- **Bottom ~55%:** centred text.

Copy (top to bottom):
- Brand line (Tamil script, small, pine, pill outline): **நம்ம ஊரு App**
- H1 (Manrope 800, ~44-52px on mobile): **Veedu kaaliya irukka?**
- Sub (one line, muted): **Get verified tenants. Free.**
- **Counter block** (the hero's main object):
  - Giant Montserrat number: **449** (real value), with a small `/ 500` beside it.
  - Label under it: **Free spots left for owners**
  - On load it rolls (odometer style) from 500 down to the real number.
- Button: **Free-ah Post Pannunga →** (scrolls to form)

### Section 2 - Zero commission (the big reveal)

This is the emotional peak. It should feel like a reverse countdown.

**Sequence (scroll-triggered, pinned on scroll for ~1.5 screens; plays once):**
1. Small line appears: **No more**
2. Very big, two lines, ink: **1 MONTH RENT** / **to the broker.** The words "1 MONTH RENT" are the biggest thing on screen.
3. A strike line draws through "1 MONTH RENT" (left to right, pine).
4. A rent figure appears and **counts down fast to zero**: `₹10,000 → ₹0` (start value from `config.sampleMonthlyRent`, ease-out, ~1.4s). The last few numbers slow down.
5. It lands on a **giant 3D ₹0** (see "The 3D ₹0" below), which drops in with a small bounce.
6. Line under it: **Unga rent. Full-ah ungalukku.**

**Comparison (right after the reveal, stacked top/bottom on mobile, side-by-side on desktop):**
| Card | Style | Content |
|---|---|---|
| Broker | white card, muted grey text, thin border, strike-through on the amount | `Broker` / **1 month rent** / "gone" |
| IFH | pine card, white text, slightly bigger, raised shadow | `IFH` / **₹0** / "always" |

Cards reveal one after the other (broker first, then IFH slides up and over it slightly).

**The 3D ₹0**
- Build it **without WebGL** (performance on cheap phones). Use CSS 3D: render "₹0" in Montserrat 900 at ~45vw, then stack ~12-16 duplicate layers behind it with `translateZ` steps, coloured from `pine` to `pine-press`, inside a container with `perspective: 800px` and `transform-style: preserve-3d`.
- **Interactive:** it tilts toward the finger on touch-drag / mouse-move (max ±18°), springs back on release. Idle: a slow gentle float (rotateY ±6°, 4s loop).
- If `prefers-reduced-motion` or the device is very slow: render a flat, bold, pine ₹0 with a soft shadow. Still huge.

### Section 3 - Privacy (reuse the number dial)

- H2: **Unga veedu. Unga rules.**
- Reuse the existing **curved number dial**. As the user scrolls, it rotates through 4 steps. Each step shows the big number + one short line:
  - **01** - 10 photos upload pannunga
  - **02** - Neenga choose panra 2 mattum show aagum
  - **03** - Phone number & location hidden
  - **04** - Verified tenants mattum paakalaam
- Next to or under the dial: a **small phone mockup built in HTML/CSS** (not an image) that changes with the step:
  - 01: grid of 10 photo thumbs
  - 02: 8 thumbs blur out, 2 stay sharp with a pine tick
  - 03: phone number shows as `+91 ••••• •••••` with a lock icon, map pin blurred
  - 04: a "KYC Verified" badge (pine-tint / pine) unlocks the number
- Small trust line at the end, muted: **KYC verified tenants only.**

### Section 4 - The form ("Lock your spot")

- H2: **Unga spot-ah lock pannunga.**
- Counter repeated, smaller: `449 / 500 free spots left` with the live dot.
- **Two-step form** (a progress bar of 2 segments at the top of the card):

**Step 1** (capture the lead fast)
| Field | Type | Rules |
|---|---|---|
| Name | text | required, `autocomplete="name"` |
| Phone | tel, `+91` prefix fixed | required, exactly 10 digits, `inputmode="numeric"`, starts 6-9 |
| Town | big tap-friendly select (bottom sheet on mobile) | required. Options from `config.towns`: Tenkasi, Tirunelveli, Kanyakumari, Nagercoil, Thoothukudi, Other |

Button: **Next →** - on tap, **save this as a partial lead immediately** (so we keep the lead even if they drop off).

**Step 2**
| Field | Type | Rules |
|---|---|---|
| House location | text (area / street) + a **"Use my location"** button (browser geolocation, stores lat/lng) | required: either text or coordinates |
| When is the house free? | 3 big chips: **Now** / **Within 1 month** / **Later** | required |
| Photos | multi-image upload, optional, max 10, compress client-side to ~1600px / ~300KB each before upload, show thumbs | optional, clearly labelled "Optional" |
| WhatsApp consent | checkbox, **pre-ticked is NOT allowed** | "Send my confirmation on WhatsApp" |

Button: **Lock my free spot →**

- Inline validation in plain words ("Enter 10 digit number"). No red walls of text.
- Loading state on submit, disable double submit.

**Success state** (replaces the form card)
- Big pine tick animation.
- **Done! Unga spot #451 locked.** (the actual position number)
- **WhatsApp-la confirmation varum.**
- Secondary button: **Open WhatsApp** (link `https://wa.me/<config.whatsappNumber>?text=<prefilled "Hi IFH, I just signed up. My name is ...">`)
- The counter everywhere on the page updates (drops by 1).

**If spots reach 0:** counter shows `All 500 free spots taken`, form stays but heading changes to **Join the waitlist** and the button to **Notify me**. Copy lives in `copy.ts`.

### Footer (tiny)
- Logo, "IFH - I Find House", Privacy · Terms links, a WhatsApp help link. One or two lines. Lots of space above it.

---

## 4. Data, counter and WhatsApp

Create a small data layer (e.g. `landing/lib/leads.ts`) with:
- `getSeats(): { total: 500, taken: number }`
- `savePartialLead(step1Data)` → returns `leadId`
- `completeLead(leadId, step2Data, photos)` → returns `{ position: number }`

**Before choosing where leads are stored, check the project for an existing backend / database / API. If there is none, stop and ask Madhan** which store to use. Do not silently pick one.

Rules:
- **The counter must be real**, computed from completed sign-ups in the store. Never hard-code or fake the number. `total` comes from config (500).
- Refresh the counter on page load, when the tab regains focus, and every 30s while visible.
- Prevent duplicates: same phone number = same lead (update, don't add a second seat).
- Store with each lead: name, phone, town, location text, lat/lng, availability, photo URLs, consent flag, created time, and **UTM params + `fbclid`** from the landing URL.

**WhatsApp confirmation (after sign-up):**
- Server-side, after `completeLead` succeeds and consent is true, send a WhatsApp template message via the **WhatsApp Business Cloud API**. Read `WA_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_TEMPLATE_NAME` from env.
- Template content (Madhan will register it): "Hi {{name}}, your free IFH spot #{{position}} is locked. We will call you soon to set up your home listing. - IFH, நம்ம ஊரு App"
- If env vars are missing, log it and skip sending. The page must still show success.

---

## 5. Motion spec

Use the animation library already in the project. If there is none, add **GSAP + ScrollTrigger** (nothing heavier).

| Element | Motion |
|---|---|
| Headlines | **Line-mask reveal**: each line slides up from behind a clip mask (`translateY(100%) → 0`, 0.7s, ease `power3.out`, 80ms stagger between lines) |
| Hero photo tiles | Scale 0.85 → 1 + fade + settle into their rotation, 90ms stagger |
| Counter | Odometer roll per digit on load and on every change |
| Section 2 | Pinned scroll sequence as described; strike line draws with `scaleX` |
| ₹0 | Drop from -40px with slight overshoot bounce, then idle float |
| Comparison cards | Broker fades up, IFH slides up 24px later and overlaps slightly |
| Dial | Existing dial behaviour, driven by scroll progress through Section 3 |
| Buttons | Press scale 0.98, 120ms |

- Every animation runs **once**, never loops distractingly (except the gentle ₹0 float and the live dot pulse).
- Full `prefers-reduced-motion` support: show final states, no movement.
- Nothing may block the user from reaching the form. No scroll-jacking beyond the one pinned Section 2.

---

## 6. Images (placeholders now, AI images later)

Use **placeholders now**. Final images will be generated later (Higgsfield) and dropped in with the **same file names**, so wire them by name.

Folder: `/public/landing/` (or the project's equivalent)

| Slot | Ratio | What the final image will show |
|---|---|---|
| `hero-1.webp` | 4:5 | A typical independent house in a south Tamil Nadu town, gate, coconut tree, warm morning light |
| `hero-2.webp` | 4:5 | Middle-aged Tamil homeowner at their gate holding keys, smiling, trustworthy |
| `hero-3.webp` | 4:5 | Bright clean living room / hall of a rental home, simple furniture |
| `hero-4.webp` | 4:5 | Young family arriving with bags at a house door |
| `og-image.jpg` | 1200x630 | Share image: ₹0 + "நம்ம ஊரு App" + counter |

For now: reuse suitable photos already in the project (**not** the tiled-roof B&W house), or render clean pine-tint placeholder blocks with the slot name written on them. Every image: `width`/`height` set, `loading="lazy"` except hero tiles, WebP/AVIF, `object-fit: cover`.

The privacy phone mockup in Section 3 is built in HTML/CSS, not an image.

---

## 7. Performance, tracking, quality bar

**Performance (non-negotiable for ad traffic on cheap Android)**
- LCP < 2.5s on simulated "Slow 4G, mid-tier mobile". Total JS for this page as small as possible.
- Preload the headline font only; use `font-display: swap`; subset fonts to Latin (+ Tamil only for the one brand line).
- No layout shift from the counter or fonts (CLS < 0.05).

**Tracking**
- Meta Pixel (ID from env `NEXT_PUBLIC_META_PIXEL_ID` or the project's env convention): `PageView` on load, `ViewContent` when the form enters view, `InitiateCheckout`-style custom event `Step1Complete` after step 1, **`Lead`** on successful sign-up with a unique `event_id` (so it can be de-duplicated with Conversions API later).

**Accessibility**
- Tap targets ≥ 48px. Real `<label>`s on all inputs. Colour contrast AA. Form usable with screen reader. Focus states visible (pine ring).

**Desktop**
- Do not design a separate desktop site. On ≥1024px, keep the same flow: centred content column (max ~560px) with the big type and the ₹0 allowed to go wider. Comparison cards go side by side. Lots of white around everything.

**SEO / meta**
- Title: `IFH - நம்ம ஊரு App | First 500 owners post free`
- Description: `Post your house free. Zero commission. Only verified tenants see your number.`
- `og-image.jpg` as above. `lang="en-IN"`.

---

## 8. Definition of done

Before you say it is finished:
1. Run the page at 390x844 and 360x740 and **take screenshots of every section**. Check: one idea per screen, nothing cramped, no text overflow, sticky bar behaves.
2. Submit the form end to end (step 1 partial save → step 2 → success). Confirm the counter drops by exactly 1 everywhere, and the same phone number twice does not take two spots.
3. Confirm reduced-motion mode shows everything correctly.
4. Run Lighthouse mobile. Report LCP, CLS, total JS size.
5. List anything you could not finish or any decision you need from Madhan (data store, WhatsApp env, Pixel ID).

Work section by section: build Section 1 + top bar + sticky bar first, show screenshots, then continue.
