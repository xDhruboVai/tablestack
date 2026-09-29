# TableStack - studio website

Websites built around the way your business works. Websites first. Tools when needed.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · anime.js 4**.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

Node 20+ recommended (built on Node 24).

## The idea

The name is the concept: **table** + **tech stack** (the technical work behind a website or business system). TableStack builds websites for all kinds of businesses.

- **Front of house / Back of house.** Every restaurant has a dining room guests see and a kitchen they don't. Every business website has the pages customers see and the systems behind them (bookings, ordering, admin tools). TableStack builds both.
- **The exploded table (home hero).** A table drawn as four stacked layers - the site guests see, the menu, bookings/ordering, and infrastructure - standing on table legs. It assembles slab by slab on load, then explodes into an annotated diagram as you scroll (native scroll, no hijacking).
- **The FOH/BOH switch** (top right). Flips the entire site into a blueprint of itself: dark mode, 12-column grid overlay, component outlines and labels, wireframe versions of every project preview. It's remembered per visitor.
- **The lens.** Hover any project preview and a circle reveals its back-of-house blueprint. On touch screens it sweeps across as you scroll.
- **Menu typography.** Dotted leaders (`Website design ........ Custom`) organise capabilities and the work index, like a well-set menu.

### Motion language

| Front of house (display type, images) | Back of house (mono, lines, diagrams) |
| --- | --- |
| Rises out of a mask, like a plate arriving | Draws or scrambles, like a system booting |

Two eases (`out(4)` for arrivals, `inOut(4)` for covers/transitions) and three durations (380 / 900 / 1300 ms) - see `lib/motion.ts`.

- **Loader:** first visit per session only, ~1s, skipped by any scroll/key/tap.
- **Page transitions:** an ink panel rises with the route name, then lifts.
- **Kitchen ticket:** the contact form's success state prints a ticket with the inquiry on it.
- **Reduced motion:** with `prefers-reduced-motion`, everything renders immediately - the hero shows the fully exploded diagram as a static figure, no loader, no transitions, no scroll scrubbing.

## Where things live

| What | File |
| --- | --- |
| Brand name, email, booking link, location, availability, copy | `content/site.ts` |
| Projects (case studies, services, stack, gallery slots) | `content/projects.ts` |
| Colors, type scale, motion CSS | `app/globals.css` (tokens at the top) |
| Fonts | `app/layout.tsx` (`next/font/google`) |
| Motion constants | `lib/motion.ts` |
| Logo / wordmark | `components/layout/Wordmark.tsx`, `app/icon.svg` |
| Social card | `app/opengraph-image.tsx` |
| Contact form delivery | `app/api/contact/route.ts` + `scripts/google-apps-script.gs` + `.env.local` |

## Contact form

The form posts to `/api/contact`, which forwards to a Google Apps Script webhook. The script writes each inquiry to Google Sheets and sends Gmail notifications.

1. Copy `.env.example` to `.env.local`.
2. Fill in `GOOGLE_SHEETS_WEBHOOK_URL` and `GOOGLE_SHEETS_WEBHOOK_SECRET`.

Without these values, development logs submissions to the terminal and shows the success ticket. **Production without them shows the error state** (with the direct email link) so nothing is silently lost.

## Replace before launch

Search the codebase for `REPLACE` and `placeholder` to find every spot.

**Brand + contact (`content/site.ts`)**
- [ ] `url` - your real domain (used for canonical URLs, sitemap, social cards)
- [x] `email` - `tablestackbd@gmail.com` (also set `CONTACT_TO_EMAIL` to this in `.env.local` so form inquiries arrive there)
- [ ] `bookingUrl` - a real booking link. While empty, every "Book a call" button stays hidden
- [ ] `availability`, `responseTime` (location is set to Bangladesh, footer clock to Dhaka time)
- [ ] `inquiry.budgets` - the BDT ranges in the contact form are placeholders; set them to match your pricing
- [ ] `social` - Facebook Page and WhatsApp links (hidden until filled in)
- [ ] `about.team` - real names, roles, bios; set `placeholder: false`
- [ ] `testimonials` - only real quotes, with permission. The section stays hidden while empty.

**Projects (`content/projects.ts`)**
Two live projects are in: **Smashed Burgers** and **Pinewood**, with screenshots in `public/work/<slug>/`.
- [ ] Confirm the year, services and client names on each
- [ ] Add a short client quote to each `outcome` when you have one (only real quotes, with permission)
- [ ] Swap the `*.vercel.app` links in `liveUrl` for the restaurants' own domains once they're live
- [ ] New projects: copy one of the real entries, then capture images with the same sizes (below)

The five fictional sample projects (Brasa, Forno, Sumi, Verde, Marginalia) are kept in `placeholderProjects` only as a template. They're hidden (`SHOW_PLACEHOLDERS = false`) and never shown alongside real work.

**Image sizes** (put them in `public/work/<slug>/`)

| Slot | Size | Notes |
| --- | --- | --- |
| `cover.jpg` | 2880×1800 (16:10) | Desktop hero of the site |
| `cover-boh.jpg` | 2880×1800 | Edge-detected blueprint of the cover, shown under the X-ray lens (optional; falls back to a CSS filter) |
| `home.jpg` | 2880×1800 | A second desktop section |
| `mobile.jpg` | 1600×1600 | Two phone screens side by side |
| `menu.jpg`, `detail.jpg`, `booking.jpg` | 1600×1600 | Menu page, a signature detail, the booking flow |

`media.annotations` sets the labelled boxes on the blueprint (in % of the cover), and `media.focusX` sets which side stays in frame when a cover is cropped into a tall card.

**Brand assets**
- [ ] Logo: `components/layout/Wordmark.tsx` (the current mark is a placeholder: three stacked slabs)
- [ ] Favicon: `app/icon.svg`
- [ ] Social card: `app/opengraph-image.tsx` (uses a system font; embed the brand fonts or swap in a designed 1200×630 PNG as `app/opengraph-image.png`)
- [ ] Colors: tokens at the top of `app/globals.css` (`--linen`, `--ink`, `--tomato`, plus `--accent-text` variants tuned for WCAG AA)

## Accessibility notes

- Semantic landmarks, skip link, visible focus rings, labeled form fields with inline errors and an error summary.
- Keyboard: every interaction is reachable; the mobile menu traps focus and closes on Escape; focus moves to the new page after transitions.
- Split-text animations keep an accessible copy of the text for screen readers.
- Small accent-colored text uses darker/lighter tomato variants to meet 4.5:1 contrast.
- `prefers-reduced-motion` is honored throughout.
