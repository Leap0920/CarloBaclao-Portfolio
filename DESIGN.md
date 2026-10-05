# DESIGN.md — Carlo Baclao Portfolio

The single source of truth for tokens, type, motion and responsive behaviour.
Every change to `src/` must conform to this file. If a change needs a token that
is not here, add it here first.

---

## 1. Product frame

- **Surface:** one page, `src/app/page.tsx`, eight sections in document order.
- **Audience:** a hiring manager or tech lead skimming for 60 seconds on a phone,
  then possibly opening the résumé. Secondary: a recruiter on desktop.
- **Primary task:** decide within one screen that this person ships real software,
  then reach the résumé or email in one tap.
- **Quality bar:** the Linear / Stripe / Supabase class — technically clean, but
  with a real point of view. Calm, editorial, confident. Not a template.
- **Copy budget:** the whole page must read in **under 3 minutes**. Target
  **≤ 650 rendered words** (currently ~1,400 — the copy is the single biggest
  problem on the page).

### The one rule that governs copy

Every sentence must survive the question *"would a hiring manager act on this?"*
If it is atmosphere, self-description, or a restatement of the heading, delete it.
Prefer a number, a technology, or a concrete outcome over an adjective.

Banned words: *passionate, dedicated, curious, meticulous, highly adaptable,
leverage, innovative, high-impact, seamless, cutting-edge, robust, dynamic.*
Banned shapes: a sentence that explains why the heading was written; three
clauses where one carries the meaning; a paragraph whose second sentence repeats
the first.

---

## 2. Colour

Light theme only. One accent hue. No gradients except the two soft washes that
already exist in the hero (which are radial fades to transparent, not colour ramps).

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#18181b` | body text, primary button fill |
| `--color-ink-soft` | `#3f3f46` | strong secondary |
| `--color-muted` | `#52525b` | body copy (was `zinc-600` — raised for contrast) |
| `--color-faint` | `#71717a` | labels, meta (was `zinc-400/500` — raised for contrast) |
| `--color-hairline` | `#e4e4e7` | borders |
| `--color-surface` | `#ffffff` | page |
| `--color-surface-2` | `#fafafa` | footer, lightbox backdrop panel |
| `--color-accent-500` | `#4f5bd5` | the one accent |
| `--color-accent-600` | `#3a41c0` | accent hover |
| `--color-accent-700` | `#2f34a0` | accent on light tint |

**Contrast floor:** every text node ≥ 12px must hit **4.5:1** on its background.
The current 10px `zinc-400` labels (`#a1a1aa` on white = 2.6:1) fail and are the
main legibility complaint. Labels move to `--color-faint` (`#71717a` = 4.6:1) and
the smallest label size is **11px**, not 10px.

---

## 3. Type

Three roles. `Instrument Serif` is **removed** — `--font-display` was declared but
never used on any element, and it shipped a whole font file for nothing.

| Role | Family | Where |
|---|---|---|
| Body / UI | `Inter` (`--font-sans`) | everything by default |
| Labels / meta | `JetBrains Mono` (`--font-mono`) | eyebrows, dates, tech lists, counts |

Scale (mobile → desktop, `clamp` where noted):

- `h1` hero name — `clamp(2.5rem, 9vw, 4.75rem)`, weight 600, tracking `-0.04em`, leading `0.95`
- `h2` section title — `1.75rem → 2.25rem`, weight 600, tracking `-0.02em`
- `h3` item title — `1.125rem → 1.25rem`, weight 600
- body — `0.9375rem` (15px), leading `1.65`, `--color-muted`
- body small — `0.875rem` (14px)
- label — `0.6875rem` (11px), mono, uppercase, tracking `0.14em`, `--color-faint`

Rules:
- Body copy is **never** wider than `62ch`. Section intros max `52ch`.
- `text-wrap: balance` on headings, `pretty` on paragraphs (already global).
- No letter-spaced all-caps text above 11px.

---

## 4. Space & layout

- Container: `max-w-6xl` (72rem), gutters `px-5` mobile / `px-8` ≥640px.
- Section rhythm: `py-20 sm:py-24 lg:py-28`. Do not add per-section overrides.
- Vertical gap inside a section: `mt-12` between heading and content; `mt-16`
  between content blocks. Stop using `mt-20`/`mt-14` arbitrarily.
- Radii: `rounded-lg` (8px) for controls, `rounded-xl` (12px) for media,
  `rounded-2xl` (16px) for the lightbox only.
- One hairline per division. Never a border *and* a background change on the
  same edge.

---

## 5. Motion

Motion is a system, not decoration. Four primitives, nothing else:

1. **`Reveal`** — scroll-in fade + 16px lift, `0.75s` `--ease-out-expo`, stagger
   step `0.06s`. Already implemented in `src/components/ui/Reveal.tsx`; keep the
   `js-reveal` fail-open behaviour exactly as is (content must never be stuck at
   opacity 0 if the bundle fails).
2. **`Stagger` / `StaggerItem`** — the same primitive, sequenced.
3. **Pointer parallax** — hero 3D only. Damped, `0.6–1.0` strength, never more.
4. **Micro-interaction** — `transition-colors` / `transform` on hover, `200–300ms`.
   Arrow nudges move **2px**, never more.

Banned: bounce/elastic easing, `animate-bounce`, springs with visible overshoot
on layout, entrance animations longer than `0.8s`, anything that replays on every
scroll direction change, and animation on scroll-position-driven properties that
are not transform/opacity.

**Reduced motion is a branch, not a hope.** Every motion added must be gated by
`useReducedMotion()` or the global `prefers-reduced-motion` block in `globals.css`.
Under reduced motion: reveals resolve instantly, the 3D scene renders one still
frame, parallax is off.

---

## 6. The 3D hero

Current problems, confirmed by screenshot at 375px and 1440px:

- At 375px it is `opacity-30`, clipped by the right edge, and sits **behind the
  tech-stack chips** — the opaque chips punch holes in the wireframe and stray
  particles land in the chip gutters, reading as dust.
- At 1440px the orbit rings run behind the stat row and the divider, hurting
  legibility of the numbers.
- `preserveDrawingBuffer: true` forces a full framebuffer copy every frame for no
  benefit — the scene is never screenshotted.

Required:

- **Contain it.** The composition must be fully inside its box at every width —
  no edge crop. Pull the camera back / scale the rig rather than cropping.
- **Never overlap text.** On `<1024px` the scene occupies its own band *below* the
  copy (or is removed entirely below `640px`); it must not sit under the chips,
  the CTAs, or the stat row. On `≥1024px` it stays in the right column, and its
  bounding box must clear the stat row.
- **Read as intentional.** Raise presence on mobile rather than washing it out:
  if it is visible it is `opacity-100` in its own clear space; if there is no
  clear space, do not render it.
- **Depth.** Add real dimensionality: a subtle depth-of-field (near beads crisp,
  far beads dimmed via `fog` or per-mesh opacity), a soft contact shadow, and a
  slow idle drift. Keep the existing "blueprint shell + faceted accent core +
  bead orbits" language — it is on-brand; do not replace it with a generic blob,
  a particle field, or a spinning cube.
- **Interaction.** Pointer parallax (already damped) plus a **scroll-linked**
  response: the rig rotates and lifts slightly as the hero leaves the viewport,
  driven by `useScroll`/`scrollY` and clamped. Off under reduced motion.
- **Budget.** `dpr={[1, 1.5]}` (not 1.75), `antialias` on, `preserveDrawingBuffer`
  **off**, `powerPreference: 'high-performance'`, `frameloop` never `'always'`
  when the hero is out of view (already handled — keep it).
- Geometry stays low-poly. No postprocessing pass, no shadows maps, no env map.

---

## 7. Responsive rules

Verified: no horizontal overflow today, except the intentional 620px contribution
chart inside an `overflow-x-auto` container. Keep that property.

- **375px is the primary target**, not an afterthought. Every change is judged
  there first.
- Stacked buttons go **full width** below `640px` and share one width. The current
  hero CTAs are content-width and ragged (180px vs 245px).
- The contributions chart: below `640px`, do not force a 620px scroll. Render a
  compact 12-week window instead, or let the SVG scale with `w-full` and drop the
  `min-w`.
- Certification grid: `2` cols at 375 (already), but the section is **3,326px
  tall** — the tallest on the page. Cap the initial render at 8 tiles with a
  "Show all N" control so the page shortens on a phone.
- Work section is **3,230px tall** at 375px. The lead project image should not be
  a full 16/10 block above the fold of that section on mobile; keep it, but cut
  the surrounding copy so the section loses ~500px.
- Never rely on hover for anything functional.
- Tap targets ≥ 44×44px.

---

## 8. Performance budget

Measured baseline (lab, Windows Chrome 154, dev server, 375px, dsf 3):

| Metric | Baseline | Target |
|---|---|---|
| JS transferred | 1,484 KB (dev) | measure on `next build` + `next start`; ≤ 260 KB gzip for the page's own JS |
| Fonts | 146 KB / 3 families | ≤ 90 KB / 2 families |
| Page height @375px | 14,990 px | ≤ 9,500 px |
| Words rendered | 1,377 | ≤ 650 |
| CLS | 0 | 0 |
| LCP | not captured (dev) | capture on prod build |

Attribution before optimisation: the dominant cost is (a) `three` + `@react-three/fiber`
in the client bundle, (b) 32 images on one page, (c) an unused font family, and
(d) an unused `@react-three/drei` dependency. Fix in that order.

Required:
- Remove `@react-three/drei` from `package.json` — it is not imported anywhere.
- Remove the `Instrument_Serif` font from `src/app/layout.tsx` and its
  `--font-display` token; nothing uses it.
- `next.config.mjs`: add `images: { formats: ['image/avif','image/webp'] }` and
  `experimental.optimizePackageImports: ['lucide-react','framer-motion']`.
- Delete unused public assets (verified 0 references in `src/`):
  `images/black.png` (1.5 MB), `images/white.png` (1.5 MB), `images/cover.jpg`
  (2.2 MB), `images/temp1.png` (684 KB), `images/temp2.png` (300 KB),
  `images/languages/` (364 KB), `projects/attendance/docs.jpg` (337 KB),
  `profile-placeholder.svg`, `next.svg`, `vercel.svg`, `window.svg`, `file.svg`,
  `globe.svg`. Also the three untracked PNGs in the repo root.
- `projects/lecuisine/cover.png` is 1.65 MB — re-encode to WebP ≤ 250 KB.
- The `next/image` `priority` flag stays on the lead project image only.

---

## 9. Content fixes (accuracy)

These are wrong today and must be corrected:

| Where | Now | Correct |
|---|---|---|
| `src/data/profile.ts` `siteUrl` | `https://carlobaclao.dev` | `https://carlobaclao.vercel.app` — `carlobaclao.dev` has **no DNS record**; the live site is the Vercel URL, and the résumé PDF points there too. This poisons `metadataBase`, canonical, OpenGraph, JSON-LD and the sitemap. |
| `src/data/resume.ts` QCU range | `2022-08 → 2028-06` | `2023-08 → present` (résumé PDF: *Aug 2023 – Present*). Six years was also inconsistent with "fourth-year". |
| `src/data/resume.ts` State Lab range | `2022-04 → 2022-07` | `2022-04 → 2022-06` (résumé PDF: *April 2022 – June 2022*). |
| `public/sitemap.xml` | anchors `#projects`, `#github` | `#work`, `#activity` — the listed anchors do not exist. |
| `public/robots.txt` | missing | add, pointing at the sitemap. |
| `src/data/stats.ts` | hint `'across 6 issuers'` hardcoded | derive from `certIssuers.length`. |

## 10. Anti-slop checklist (reject on sight)

- Purple/indigo **gradient** text or buttons — the accent is a flat colour.
- Glassmorphism used anywhere except the sticky header and the lightbox backdrop.
- A card for every piece of content; cards inside cards.
- Icon + heading + two-line description repeated identically six times.
- Emoji in headings or buttons.
- `shadow-xl` on flat content; shadows only on floating surfaces (header, lightbox).
- Centred body paragraphs; this page is left-aligned editorial.
- Decorative blobs, orbs, or "AI glow" behind sections.
- Placeholder copy left in (`Lorem`, `Coming soon`, `TODO`).
- An animation whose only job is to prove an animation exists.


---

## 11. Design system tokens (authoritative)

These tokens live in `src/app/globals.css` under `@theme`. Where this
section conflicts with §2–§4 above, **this section wins** — those sections
predate the token pass.

### 11.1 Type scale

Every step must read as a distinct size. The previous scale was collapsed
(a confident H1 over undifferentiated 11–18px grey) — do not re-collapse it.

| Token | Value | Use |
|---|---|---|
| `--text-display` | `clamp(2.75rem, 8vw, 5rem)` | hero name only |
| `--leading-display` | `0.95` | with display |
| `--tracking-display` | `-0.03em` | with display |
| `--text-title` | `clamp(1.625rem, 3vw, 2.25rem)` | section headings |
| `--leading-title` | `1.1` | with title |
| `--tracking-title` | `-0.02em` | with title |
| `--text-lead` | `1.125rem` | section intros, one per section |
| `--leading-lead` | `1.5` | with lead |
| `--text-body` | `1rem` | body copy |
| `--leading-body` | `1.65` | with body |
| `--text-small` | `0.875rem` | secondary / meta |
| `--text-micro` | `0.75rem` | **HARD FLOOR** |

**`--text-micro` is a hard floor: nothing on the page may render below
0.75rem (12px).** Any existing 10–11px text is a bug to fix, not a size to
keep.

### 11.2 Colour — one accent family

The accent is a single 50–900 ramp. The three bare names are **aliases into
that ramp**, not new colours:

| Token | Value | Equals |
|---|---|---|
| `--color-accent` | `#4f5bd5` | `--color-accent-500` |
| `--color-accent-hover` | `#3a41c0` | `--color-accent-600` |
| `--color-accent-soft` | `#eef1ff` | `--color-accent-50` |
| `--color-accent-50 … -900` | (unchanged) | the ramp itself |

`bg-accent`, `text-accent` and `border-accent` resolve to the same blue as
the corresponding `-500` / `-600` utilities. **Never add a fourth blue** —
a new shade is a step on this ramp or it is not added at all.

The neutrals (`--color-ink`, `--color-ink-soft`, `--color-muted`,
`--color-faint`, `--color-hairline`, `--color-surface*`) are owned by the
contrast workstream — do not change their values.

### 11.3 Radius — one language

`--radius: 12px` applies to **every** card, chip, button, input and tag. The
page previously mixed ~6px chips with full-pill buttons; pick one language
(this one) and stop.

### 11.4 Spacing

- `--space-section`: **4rem** mobile, **6rem** from `768px` up (media query
  in `globals.css`). Section vertical rhythm uses this token — no
  per-section `py-*` overrides.
- The only allowed gap steps are **4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 /
  96 / 128** (px) — Tailwind's `1 / 2 / 3 / 4 / 6 / 8 / 12 / 16 / 24 / 32`.
  No arbitrary values (`gap-[13px]`), no half-steps (`mt-5`, `py-7`).

### 11.5 Binding rules

1. **Three text greys, no more.** `ink` for headings / primary, `ink-soft`
   for lead and strong body, `muted` for secondary body. `faint` is for
   hairlines and decorative rules **only** — never for text that must be
   read.
2. **The accent must appear in the UI, not only in the 3D scene:** the
   active nav item, link hover, focus rings, the active filter chip, the
   "Show all" control, and at least one figure in the stats row.
3. **Uppercase letterspaced mono labels: at most ONE per section**, and
   only where it carries information (the section index). The page
   currently uses four, which reads as a template signature.
4. **Every interactive element gets a visible accent-coloured focus ring
   (2px, 2px offset).** Never remove a focus outline without replacing it.
