# Backyard Barber Land Management — Site Roadmap

Live at **https://mybackyardbarber.com** · Netlify project `ornate-froyo-9a8406` ·
every push to `main` auto-deploys.

Last updated: 2026-07-20

---

## Stack

| Piece | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript | Turbopack builds |
| Styling | Tailwind v4 | Tokens in `app/globals.css`, brand yellow/black/chrome |
| Hosting | Netlify free tier | Vercel's free tier bars commercial use |
| Domain / DNS | Cloudflare Registrar | Registrar + DNS only, **grey cloud** — see gotchas |
| Leads | Netlify Forms | 100 submissions/mo free, emails on each one |
| AI chat | Claude Haiku 4.5 | `/api/chat`, key in Netlify env |
| Maps | Leaflet + OpenStreetMap | No API key, no billing |

Deliberately **not** wired up (not needed yet): Sanity CMS, Neon Postgres, Resend.

---

## Shipped

- Marketing pages: home, services, gallery, about, service area, contact
- Logo-derived design system (Oswald + Source Sans, yellow/black/chrome)
- AI chat widget — answers questions, collects quote details via a tool call,
  then opens a pre-filled quote form
- Lead capture through Netlify Forms, with client-compressed photo uploads
- Recent Work marquee + gallery grid, both linking out to Facebook
- Service-area map (50-mile radius, from `SERVICE_RADIUS_MILES` in `lib/site.ts`)
- SEO pack: sitemap, robots, canonicals, OG card, LocalBusiness JSON-LD
- **Service detail pages** at `/services/[slug]` — photo header, detail copy,
  CTA that carries the service into the quote form
- **Photo lightbox** on the gallery and Recent Work (keyboard, swipe, Esc)
- **Scroll reveals + hover polish**, barber-stripe section divider
- **Seasonal spotlight** banner that follows the calendar, no upkeep needed
- **Trust band** with stats that count up on scroll (no radius — see copy rules)
- **Landscaping Supply Delivery** service — mulch, gravel, stone, sand,
  topsoil, pine needles; delivered or spread
- **Town-level local SEO** — `lib/serviceArea.ts` lists the covered towns by
  county; they render on `/service-area` and feed named `City` entries into
  `areaServed` alongside the GeoCircle

---

## Next up

### Blocked on the owner

1. **Google Business Profile** — the single biggest remaining local-SEO win.
   Needs the owner to claim and verify the listing; nothing in this repo can
   substitute for it.
2. **Real customer reviews.** `components/Testimonials.tsx` is built and
   renders *nothing* while `TESTIMONIALS_ARE_PLACEHOLDER` is `true` in
   `lib/testimonials.ts`. Replace the placeholder entries with real
   Facebook/Google reviews (with permission), flip the flag, and only then add
   `review`/`aggregateRating` to `components/StructuredData.tsx` — marking up
   invented reviews violates Google's structured-data policy.

### Ready to do

3. **Google Search Console** — set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in
   the Netlify env (the layout emits the meta tag only when it's set), verify,
   then submit `/sitemap.xml`. The six service pages are already in the
   sitemap and need a resubmit to get crawled. **As of 2026-07-20 the site is
   not in Google's index at all** — a search for `mybackyardbarber.com` returns
   nothing. Until this is done, nothing else here can rank.
4. **Confirm Cloudflare domain auto-renew is on.**
5. **Netlify Forms notifications** — verify the email recipients are configured
   in the UI (Forms → notifications): `backyardbarber@protonmail.com` plus the
   owner's phone via the Cricket email-to-SMS gateway.

---

## Considered and rejected

- **Instant price estimator** — built, then removed on request 2026-07-20.
  Don't rebuild it without asking. `components/Estimator.tsx` and
  `lib/pricing.ts` are deleted; the `estimate` field is out of
  `public/__forms.html`. What survives is the `/contact?service=<name>`
  prefill, which the service pages still use.
- **Twilio SMS alerts** — abandoned 2026-07-19 over A2P brand-registration
  hassle and the monthly number fee. Netlify Forms email replaced it.
- **Before/after slider** — deferred; needs paired photos that don't exist yet.
- **Vercel hosting** — free tier prohibits commercial use.

---

## Copy rules

Directives from the owner. Check these before writing marketing copy.

- No "around Statesville" / "across Statesville" phrasing in body copy.
  Statesville *does* stay in SEO metadata, the footer, the hero eyebrow, and
  the service-area page — that's what drives local search.
- No "What's Included" lists on service pages.
- No "per visit" / "per load" / "for the job" unit lingo.
- **No service radius on the homepage.** The mileage figure lives only on the
  Service Area page (and the map + `areaServed` schema, both driven by
  `SERVICE_RADIUS_MILES`). Don't reintroduce it to the trust band.
- **Stump grinding is year-round.** Season, weather, and frozen ground are not
  factors — never imply a better time of year. Price depends on stump count,
  size, and *location on the property* (machine access). This is enforced in
  the chat system prompt too; the bot invented seasonal advice until told not
  to, so keep that rule in `app/api/chat/route.ts`.
- **Gravel:** no "crowning" language. It's raked flat and smooth.
- **We do not do landscaping** in the planting/beds/sod/hardscape sense
  (confirmed by the owner 2026-07-20). The six services in `lib/services.ts`
  are the whole list. "Landscaping" may appear only as *landscaping supply
  delivery*. Don't add a landscaping service page to chase search traffic —
  it earns calls that have to be turned down, and Google demotes listings
  whose site and Business Profile disagree about what the business does.
- **Only list towns we'll actually drive to** in `lib/serviceArea.ts`.

---

## Gotchas

Hard-won, all of these cost time at least once.

- **Cloudflare + Netlify apex.** A `CNAME` at `@` looks like it works but fails
  Netlify's verification — CNAME flattening means there's no CNAME for the
  verifier to see. Use `A @ -> 75.2.60.5`; leave `www` as a real CNAME. Never
  enable the orange-cloud proxy (blocks cert provisioning, causes redirect
  loops). Cloudflare's UI will nag you to turn it on. Ignore it.
- **Netlify Forms file uploads** cap at 8MB *and* accept only **one file per
  field**. A single `multiple` input silently drops photos. `lib/photos.ts`
  compresses each image and appends them as `photo1..photo5`, each declared in
  `public/__forms.html`. **Any new form field must be declared there** or
  Netlify drops it.
- **`GITHUB_PAGES` env var** forces the static export in `next.config.ts`,
  which drops the API routes (and so the chat). Never set it on Netlify.
- **Scroll-driven reveals** (`.reveal` in `app/globals.css`) need *both* the
  `@supports not (animation-timeline: view())` and `prefers-reduced-motion`
  fallbacks, or content is left stuck at `opacity: 0`. They also ignore
  `animation-delay` — stagger with `animation-range` instead. Note that
  full-page screenshots render these sections blank; that's a capture
  artifact, not a bug. Scan viewport-by-viewport.
- **`next build` fails with `EPERM: unlink .next/...`** while `npm run dev` is
  running against the same `.next`. Stop the dev server first, and find it by
  command line rather than killing every node process.
- **The lightbox must out-rank the chat launcher.** The launcher is `z-50` and
  renders after `<main>`, so anything at `z-50` loses to it. Lightbox is
  `z-[60]`.
- **Screen-capture PowerShell trips Defender AMSI.** Use plain `.ps1` with a
  simple `Bitmap.Save`, not `EncodedCommand` or `EncoderParameters`.

---

## Adding content

- **Work photos** — resize (Pillow: `exif_transpose` then thumbnail ~1400px)
  into `public/work/`, add the path to `lib/work.ts`, push.
- **Services** — add an entry to `lib/services.ts` and drop a photo in
  `public/services/`. The card, detail page, sitemap entry, and JSON-LD all
  follow automatically. Don't change a `slug` after launch without a redirect.
- **Seasonal banner** — edit `lib/seasonal.ts`. It's date-driven; no one needs
  to swap it by hand.
