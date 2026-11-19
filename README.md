# IFHConnects
IFH Connects is a property discovery and booking platform for homes, rooms, hotels, holiday stays, and office spaces. It simplifies property search through location-based discovery, organised listings, and a responsive design, connecting property seekers with owners for a seamless experience.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3006
pnpm build      # production build (what Amplify runs)
pnpm typecheck
```

Run only one `next dev` per checkout. Two servers share `.next` and break it; the symptom is a 500 with
"Could not find the module ... in the React Client Manifest". Fix: stop the server, delete `.next`, start again.

## Owner landing page (`/`)

A mobile-first sign-up page for house owners: "first 500 owners post free". About 90% of visitors are on phones,
so every change should be checked at 360-430 px wide first, then tablet (768) and desktop (1024+).
The previous home page now lives at `/legacy`. `/tenant`, `/property-owner`, `/privacy` and `/terms` are unchanged.

### Where things are

| What | File |
|---|---|
| All words on the page (simple English / Tanglish) | `src/landing/copy.ts` |
| Settings: seat total, towns, WhatsApp number, hero photos | `src/landing/config.ts` |
| Page order | `src/app/(landing)/page.tsx` |
| All styles (mobile first; desktop rules at the end) | `src/app/(landing)/landing.css` |
| Sections | `src/landing/components/` (Intro, TopBar, Hero + HeroSlides, ZeroReveal, PrivacySection + PhoneMock, FormSection + OwnerForm, Footer, StickyCta) |
| Server logic: database, validation, WhatsApp, Meta Pixel | `src/landing/lib/` |
| APIs | `src/app/api/seats` (live free-spot count), `src/app/api/owner/start` (form step 1), `src/app/api/owner/complete` (form step 2) |

### Page flow

1. **Intro (about 2 s):** logo, "IFH", "நம்ம ஊரு App". Pure CSS, so there is no flash and no JavaScript needed.
2. **Hero:** "Veedu gaaliya irukka?", rotating home photos with owner-style notifications, 3 reasons, a CTA that pulses gently, and the live seat count. Built to fit one 360x560 phone screen. Two columns on desktop.
3. **₹0 reveal:** pinned for a moment; "1 month rent to the broker" is struck through, then ₹0 (GSAP timeline; the 3D ₹ is layered CSS).
4. **Unga veedu, unga rules:** a scroll-driven 4-step dial with a phone mock.
5. **Form:** 2 steps. Step 1 saves a partial lead at once. Step 2 takes a seat number and sends a WhatsApp confirmation.

All motion respects `prefers-reduced-motion`. A refresh always starts at the top.

### Backend: what to connect

Set these environment variables (in Amplify and in `.env.local` for local work):

| Variable | Needed for |
|---|---|
| `DATABASE_URL` | Neon Postgres. The `owner_signups` table is created automatically on first use (`src/landing/lib/leads.ts`). Without it, local dev uses an in-memory store; production fails loudly. |
| `WA_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_TEMPLATE_NAME`, optional `WA_TEMPLATE_LANG` | WhatsApp Business confirmation after sign-up (`src/landing/lib/whatsapp.ts`). Skipped with a log line if they are missing. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel `Lead` event (`src/landing/lib/pixel.ts`). |

**Before going live (security):** phone numbers are not verified, because there is no OTP yet. Until that changes:

- **WhatsApp:** anyone could type a stranger's number and trigger a WhatsApp message to it. The name in the message is already reduced to letters and spaces (`safeTemplateName` in `whatsapp.ts`), so it cannot carry links. Still, add phone OTP (or only message people who message IFH first) before setting the `WA_*` variables in production.
- **Seats:** a script could burn the 500 free seats with fake numbers. Add per-IP and per-phone rate limiting plus a CAPTCHA (for example Cloudflare Turnstile) on `/api/owner/start` and `/api/owner/complete`. Ideally, count only verified sign-ups as taken seats.
- **Unfinished sign-ups:** step 1 with someone else's number returns that number's existing lead. A completed sign-up is never changed (the API returns only its seat number), but an unfinished one can be completed by whoever submits it. OTP before step 2 closes this.

Open items:

- **Photo upload:** owners can pick photos in step 2, and they are compressed on the phone, but they are not uploaded yet. See `TODO(photos)` in `OwnerForm.tsx`. Choose a file store (for example S3) and send the URLs to `/api/owner/complete`.
- **WhatsApp help number:** `whatsappNumber` in `config.ts` is a placeholder (`910000000000`).
- **"Unga veedu" phone mock photos:** add `public/landing/home-1.jpg` ... `home-10.jpg` (one house, room by room; order in `config.privacyPhotos`). Until then it shows house icons.
- **OG image:** add `og-image.jpg` for link previews (see the note in `src/app/(landing)/layout.tsx`).

### Photos

The hero photos are in `public/landing/`. `hero-house`, `hero-bedroom`, `hero-kitchen` and `hero-living` are free Pexels photos (Pexels licence: commercial use allowed, no credit needed). `hero-3` was already in the project. To change them, swap the files or edit `heroSlides` in `config.ts`; each photo's notification is in `copy.hero.notes`, in the same order.
