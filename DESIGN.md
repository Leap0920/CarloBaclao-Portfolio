# Design System: Carlo Baclao - Portfolio (Cinematic Scroll)

Single source of truth for this rebuild. Read this before touching any section.

**This file replaces the "Soft Structuralism" revision.** That build was a light,
monochrome, no-header page whose three biggest sections were horizontal scroll
rails. None of that survives: the page is now dark by default, the rails are
gone, and there is a nav island again. If you find a reference to silver paper,
`#f4f4f5`, a header-less page, `HorizontalRail`, or "one family for body and
display", it is stale and this file wins.

Governing skills (the repo's own pack, symlinked at `.hermes/skills`):
`high-end-visual-design` (the aesthetic) with `design-taste-frontend` (the
master rule set). `redesign-existing-projects` covers the audit.

## 0. Design read

> Reading this as: a solo developer portfolio for recruiters and hiring
> managers, with a cinematic long-scroll language, leaning toward native CSS +
> Tailwind v4 + GSAP ScrollTrigger, dual-mode with a warm ember accent.

**Dials:** `DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 7`, `VISUAL_DENSITY: 4`.

**Mode:** redesign - overhaul. Visuals are greenfield; content, IA and section
ids are preserved exactly.

## 1. The brief this build answers

The user asked for a **cinematic long-scroll experience**: vertical scroll as
the primary navigation, smooth section transitions, visual pacing, and the
existing *horizontal* layout replaced with content that is "punchy, visual and
distinct without feeling drawn-out or cluttered". Four directives, in his words:

1. **Cinematic scroll.** Vertical long scroll, CSS scroll snapping or a JS
   scroll effect, generous vertical padding, a dark or high-contrast theme,
   subtle parallax, cinematic type with a strong hierarchy.
2. **Projects are the hero feature.** Large high-impact cards, grid or
   staggered vertical, each with a prominent preview image, title, a 1-2
   sentence impact summary, tech badges and `View live` / `Source code` CTAs.
   Glassmorphism, high-contrast borders or gradient hover states to make each
   one distinct.
3. **Tech stack as a showcase.** Not a plain text list: a clean icon grid or
   styled pills, grouped by domain, with a hover interaction (glow, lift, or a
   tooltip describing proficiency).
4. **Certifications, hybrid.** Two or three featured credential cards with the
   issuer, the date and a verification link; everything else in a clean
   two-column minimalist list or a collapsible section.

## 2. Theme: dual mode, dark by default

- **Dark is the default** and it lives in `:root`. A reader with no JavaScript,
  a failed bundle, or a crawler gets the intended dark page, not an unstyled
  one. Light is `:root.light`, applied to `<html>` by the boot script in
  `src/lib/theme.ts` before the first paint.
- **The switch is in the nav island**, on the surface. A reader must never open
  a drawer to change the mode.
- **PAGE THEME LOCK.** The page is one theme at a time. No section inverts. A
  dark band inside a light page (or the reverse) is a pre-flight fail. The
  `StageBackdrop` (see section 5) shifts warmth, position and intensity only;
  it never crosses into an inversion, in either mode.
- **`<body>` carries no background colour, on purpose.** The stage colour comes
  from `html`, and `<body>` stays transparent so the fixed `StageBackdrop` can
  paint at a negative z-index. An opaque body occludes the entire layer: this
  was a real bug, and re-adding `bg-background` to `<body>` silently kills the
  whole scroll-driven background. The canvas colour still comes from `html`, so
  a no-JS or failed-bundle reader still gets a solid correct stage.
- **One accent, locked page-wide: ember.** It is re-derived per theme, never
  shared: dark `#E2703A` (6.2:1 on the stage), light `#A8471A` (5.2:1 on paper).
  A component that caches a raw hex will paint the wrong ember; read the token.

| Role | Token | Dark | Light |
|---|---|---|---|
| Stage | `bg-background` | `#0b0a09` | `#f3f0ea` |
| Stage warm (backdrop only) | `--stage-warm` | `#3a1e0e` | `#f8e9d8` |
| Stage deep (backdrop only) | `--stage-deep` | `#070605` | `#e6dfd2` |
| Plate | `bg-surface` | `#151311` | `#fdfcfa` |
| Recessed | `bg-surface-2` | `#1e1b18` | `#f7f4ee` |
| Ink | `text-foreground` | `#f4efe7` | `#12100d` |
| Ink soft | `text-ink-soft` | `#dad3c7` | `#2a2620` |
| Body | `text-muted` | `#a79e8f` (7.5:1) | `#56504a` (7.0:1) |
| Micro labels | `text-faint` | `#918878` (5.7:1) | `#6e675e` (4.9:1) |
| Hairline | `border-border` | fg @ 10% | ink @ 12% |
| Interactive edge | `border-border-strong` | fg @ 44% | ink @ 42% |
| Accent | `text-accent` / `bg-accent` | `#e2703a` | `#a8471a` |
| On accent | `text-on-accent` | `#140a04` | `#fff6ef` |

`text-faint` is the dimmest step that still clears 4.5:1 at 11px **against the
flat stage**. Do not go dimmer for anything carrying meaning, and do not assume
it clears 4.5:1 everywhere: the hero's `.hero-glow` ambient lift lightens the
local backdrop under it, which pulled the hero's role label down to 4.44:1. The
hero eyebrow is therefore `text-accent` (6.2:1 there). Any micro label sitting
on a lifted or scrimmed surface needs measuring, not assuming. `text-muted` is
the body default.

No pure `#000000` and no pure `#ffffff` anywhere: a pure value leaves a surface
nothing to sit above. Both themes are warm-neutral on purpose, because mixing a
warm dark with a cool light is how a two-mode palette starts looking accidental.

**The light column above is measured against a flat stage that the painted page
never actually has.** Ambient `--wash` and the `StageBackdrop` both darken the
light stage, so the real rendered backdrop under a label runs darker than
`#f3f0ea` (sampled: `rgb(242,236,229)` at experience, `rgb(234,228,218)` at
certifications, `rgb(245,230,214)` at the footer). Twelve 11px `text-faint`
labels that pass against the flat token measured **3.97 to 4.56:1** on the
painted page and had to move to `text-muted`. Two consequences:

- **Measure light-mode contrast against the live rendered backdrop, never
  against the token value.** A token-table pass is not a page pass. This has
  already produced one shipped defect.
- **Every ambient layer costs ratio.** The hero at 320px in light mode measures
  4.78:1 on the bare stage and falls to 4.20 with `hero-glow`, 4.40 with the
  `StageBackdrop`, and **3.69 with both** (brightest backdrop against the darkest
  sample). Layers that lift the stage are not free, and stacking them compounds.

## 3. Typography

**Geist** (`font-sans`, `font-display`) for both body and display, with
**JetBrains Mono** (`font-mono`) for labels, dates and numerals. Inter is
banned, and so are Roboto, Arial, Open Sans and Helvetica.

- Display: `text-display` = `clamp(2.75rem, 8vw, 6.5rem)`, leading `0.92`,
  tracking `-0.04em`.
- Section headline: `text-title` = `clamp(1.75rem, 3.4vw, 2.75rem)`.
- Body: `text-base leading-relaxed max-w-[65ch] text-muted`.
- Micro label: `text-[11px] font-mono uppercase tracking-[0.14em] text-faint`.
- Emphasise a word with **italic or bold of the same family**. Never inject a
  serif word into a sans headline.
- Nothing may render below 11px. That is a hard floor.

## 4. Shape: one documented system

| Use | Token | Value |
|---|---|---|
| Outer tray (`.bezel`) | `--radius-shell` | `2rem` / 32px |
| Inner plate (`.bezel-core`) | `--radius-core` | `calc(2rem - 0.375rem)` / 26px |
| A plate with no tray | `rounded-card` | `1.5rem` / 24px |
| Anything clickable | `rounded-full` | pill |

Round buttons in a square layout (or the reverse) is broken design.

## 5. Surfaces

- **`.bezel` + `.bezel-core`** - the nested tray-and-plate pair, for anything
  that should read as machined hardware. Use them together, never one alone.
- **`.plate`** - a single-surface card that lifts 4px and warms its edge to
  ember on hover/focus-within. This is the project plate and the featured
  credential card. Transform and box-shadow only.
- **`StageBackdrop`** (`layout/StageBackdrop.tsx`) - the page-wide lighting.
  Fixed, full-viewport, `aria-hidden`, `pointer-events-none`, `z-index: -10`,
  mounted as a **sibling** of the `overflow-clip` wrapper (same reason as the
  nav island and the grain). It holds one opaque base layer at
  `var(--background)` plus three tone layers and three soft radial light pools.
  The tone layers crossfade by `opacity` alone so the stage colour itself
  changes as the reader scrolls; the pools drift on `transform` and `opacity`.
  It must never repaint a gradient per frame.
  **In light mode the three pools are wrapped in a static `light:opacity-30`
  multiplier** - a separate wrapper GSAP never touches, so the per-pool opacity
  animation still runs and the tone crossfade is untouched, while the pools stop
  eating the hero's contrast. Measured cost of the pools on the light hero was
  0.54 of ratio, the single largest contributor; the tone layers cost 0.04.
- **`.grain`** - page-wide noise, fixed and `pointer-events-none`.
- **`.hero-glow`** - the hero's dot lattice and ambient lift. **In light mode it
  drops its ember pool and keeps only the dot lattice.** On paper a dark ember
  pool is a warm shadow, not a lift, and it was measurably darkening the stage
  under the hero's own text; the dot lattice costs no contrast at all. Dark mode
  keeps both layers.
- Elevation is `shadow-card` at rest and `shadow-float` lifted. Shadows are
  tinted to the stage hue, never black.
- **`backdrop-filter` is allowed ONLY on the nav island and the dialog
  backdrop.** Never on scrolling content.

## 6. Motion

- Curve: `ease-fluid` = `cubic-bezier(0.32, 0.72, 0, 1)`. `linear` and
  `ease-in-out` are banned for UI transitions (the marquee is the one
  exception, because a marquee is constant-speed by definition).
- Durations: 500-700ms for transforms, 300ms for colour.
- **Entrances are CSS, not Framer variants.** `Reveal` / `Stagger` plus the
  `.rise` heading keyframes already do this. Framer's `initial` renders inline
  `opacity: 0` into the HTML and no CSS rule can override an inline style, so a
  slow link shows a permanently blank page. **Do not reintroduce `motion.*`
  entrance variants.**
- **Scroll snapping is `proximity`, never `mandatory`.** Declared once on
  `html` in globals.css, desktop-only, off under reduced motion. Sections opt
  in with `data-snap`, which `Section.tsx` already sets.
- Scroll-linked work uses the existing primitives: `Cinematic.tsx`
  (`StickyStack`, `StickyStackItem`, `ScrollSkew`, `ScrollExit`,
  `VelocityMarquee`), `scrollFx.ts` (`useScrollFx`) and the standalone
  `ui/Parallax.tsx` / `ui/ScrollScale.tsx` / `ui/ScrollText.tsx`. Never
  `window.addEventListener('scroll')`.
- **`HorizontalRail` and `ScrollSettle` are deleted.** The rail was the old
  layout and is gone for good; leaving the primitive in place invited someone
  to bring it back. Do not reintroduce either without updating this file.
- Animate **only `transform` and `opacity`**. Never `top`, `left`, `width`,
  `height`. (Tailwind v4 writes `scale-*` and `translate-*` to the `scale` and
  `translate` properties, so a transition must name those, not `transform`.)
- **The scroll-driven background is the `StageBackdrop`, and it animates
  `opacity` and `transform` only.** Each of the seven sections has a state:
  tone `warm`/`lift`/`deep` opacities plus three pool positions. The arc
  deepens through `certifications` (the most shadowed moment on the page,
  `deep` at ~0.73 and every pool dimmed) and warms and lifts for `contact`
  (`warm` at 0.9). It is scrubbed continuously, so a section boundary is a
  gradient, not a cut.
- **The backdrop never moves horizontally.** The light pools drift vertically,
  change scale and change opacity; their horizontal offset is a fixed constant.
  An earlier revision tweened `xPercent` too and swept the light several hundred
  pixels sideways as the reader scrolled, which the client rejected outright.
  The stage-colour crossfade is the effect; the sideways sweep is not. Do not
  reintroduce horizontal pool motion, and do not compensate for its absence by
  weakening the tone crossfade.
- **Never animate `background`, `background-position` or `filter` on the
  backdrop.** Those force a full-viewport repaint every frame; the whole design
  is that the layers are pre-rendered and only their opacity and transform
  move. A crossfade between pre-rendered layers is compositor-only and costs
  nothing.
- **The backdrop's static state is the `home` frame**, which is what a
  reduced-motion or no-JS reader gets: a solid, deliberate, fully lit opening
  frame, never a half-lit or empty page.
- Never track a continuous input value (pointer, scroll) in `useState`.
- **One marquee per page, maximum.** The hero's focus-area band is the one.
  The tech-stack and contact marquees are gone.

## 7. Banned (any of these fails the design)

- **Fonts:** Inter, Roboto, Arial, Open Sans, Helvetica.
- **Icons:** thick-stroked Lucide (a global `.lucide { stroke-width: 1.5 }` rule
  handles this), FontAwesome, Material Icons. Never hand-roll an SVG icon.
- **Borders/shadows:** generic 1px solid grey borders; harsh dark drop shadows
  (`shadow-md`, `rgba(0,0,0,0.3)`); neon outer glows.
- **Layouts:** symmetrical three-equal-card feature rows; three or more
  consecutive image+text zigzags; edge-to-edge sticky navbars.
- **Motion:** `linear` / `ease-in-out` for UI transitions; instant state
  changes without interpolation.
- **Copy:** the em-dash (`—`) and the en-dash as a separator. Zero, anywhere on
  the page. Use a plain hyphen, a comma, a colon or a period. Also banned: the
  middle dot as a universal separator (max one per line), section-number
  eyebrows, scroll cues ("Scroll to explore"), locale/time/weather strips,
  version footers, decorative status dots, and pills overlaid on images.
- **Fake screenshots.** Never build a product preview out of `<div>`
  rectangles. Use the project's real cover image.

## 8. Hard layout rules

- **Eyebrow restraint.** Maximum **1 eyebrow per 3 sections**: across 7
  sections that is **at most 3**, and the hero's role label counts as one.
- **Split-header ban.** No "big headline left + small explainer paragraph
  right". Stack them.
- **Section-layout-repetition ban.** Each layout family appears once. See
  section 10.
- **Mobile collapse is explicit** in the same component. Declare the `<768px`
  fallback. No "Tailwind handles it" assumptions.
- Never `h-screen`; use `min-h-[100dvh]`.
- Hero: max 4 text elements, **top padding at least 88px** to clear the nav island
  (island ≈56px tall + 16px top gap + 16px clearance), CTA visible without scroll
  at 1440x900 and 375x812. The old "≤ `pt-24`" rule predates the nav island and
  is retired: 96px is now the floor, not the ceiling.
- Every CTA label fits on one line at desktop. One intent, one label, page-wide.
- Tap targets ≥ 44x44px. Never rely on hover for anything functional.

## 9. Accessibility

- Body text ≥ 4.5:1, large text ≥ 3:1. `pw-qa/field-contrast.mjs`.
- Every interactive element keeps a visible `:focus-visible` ring (global).
- Real text stays real text. Never bake words into an image or a canvas only.
- The mobile menu locks body scroll, closes on Escape, and returns focus to the
  control that opened it.

## 10. Page order and layout families (binding)

| # | Section | id | Layout family | Eyebrow |
|---|---|---|---|---|
| 1 | Hero | `home` | Asymmetric split, full-bleed stage, display type | yes |
| 2 | Projects | `projects` | **Full-bleed reel** — one full-height scene per featured project | no |
| 3 | Tech Stack | `techstack` | **Sticky domain rail + large-type editorial lines** | yes |
| 4 | Experience | `experience` | Sticky stacking plates | no |
| 5 | Education | `education` | Editorial split with a sticky rail | no |
| 6 | Certifications | `certifications` | **Credits roll** — text only, scroll-brightened, grouped by issuer | no |
| 7 | Contact | `contact` | Full-width statement + bezel panel | no |

That is 2 eyebrows across 7 sections. Every family is used once.

**The three heaviest sections are deliberately image-dominant, type-dominant
and list-dominant respectively, so no two of them read the same.** An earlier
revision had all three as card grids, which is what "three sections in a row
that look identical" looks like from the reader's seat. If a future change
makes two of these three share a skeleton, it has broken the page.

## 10a. The three cinematic treatments

### Projects — the reel (`Projects.tsx`)

Not a grid. Each of the four `featured: true` projects is a **full-bleed scene**:

- The scene is `min-h-[88dvh]` **on desktop only** (not 100dvh: four full screens
  of scroll is a drag, 88 lets the next frame peek in and keeps momentum) and
  spans the full viewport width. **Below `md` a scene is content-height**: the
  cover in a 16:9 box with the text stacked underneath it. A phone viewport is
  ~812px tall, so four 88dvh scenes would be a ~2,900px section, which is a
  punishing mobile scroll. The mobile fallback is therefore two-part, and both
  parts are required: text moves off the scrim to below the image, AND the
  scene drops its `min-height`.
- The project's real cover image fills it, `object-cover`, with a **token-driven
  scrim** over it (a two-stop gradient from `background` at high alpha at the
  bottom edge to transparent by ~55%), plus a mild overall darkening. The scrim
  is what makes real text over a photograph legal: measure the text against the
  scrimmed image, not against the raw photo. Because the scrim uses the
  `background` token it inverts with the theme, so dark ink over a light scrim
  works in light mode.
- Real text sits on the scrim: the project name at `text-title` scale, the
  `impact` line (max 52ch), the tech badges, and the CTA pair. Badges are text
  or hairline chips on the scrim, **never pills sitting on the image itself**.
- A mono reel counter (`01 / 04`) at the frame edge. This is NOT a
  section-number eyebrow: it counts scenes inside one section, which is a real
  ordering device, and it is the only numbering permitted anywhere.
- **No pinning.** The scenes scroll normally, with scroll-linked image scale
  and a small parallax drift via `ScrollScale` / `Parallax` from
  `@/lib/scrollFx` and `@/components/ui/Parallax`. Pinning here would collide
  with Experience's sticky stack, and two pinned sections in one page is one
  too many.
- The four non-featured projects become a **compact mono index** immediately
  after the reel: one line each, name in `ink-soft`, year and category in
  `faint`, separated by a hairline. No images, no cards.
- The detail dialog is kept and re-skinned. Its backdrop is one of the two
  permitted `backdrop-blur` sites.

### Tech Stack — the instrument panel (`TechStack.tsx`)

Not a tile grid. A **sticky rail plus large-type lines**:

- Left column (`lg` and up): a sticky rail carrying the four domain names
  (Frontend, Backend, Tools, Design) as mono labels. The rail tracks which
  domain is in view via `IntersectionObserver` and warms the active one to
  ember. Below `lg` the rail unsticks and becomes a plain heading per group.
- Right column: each domain is a panel led by its `summary` line, then its
  skills as **editorial lines at large type** — the skill name at `text-title`
  scale (or one step down), with its proficiency as a mono label (`Daily
  driver`, `Working`, `Learning`) and a hairline depth bar that fills on
  reveal. A skill with no `levels` entry reads `Unrated`; never 0, never max.
- The level is **visible text plus a bar**, never colour alone. There are no
  hover-only tooltips: at 32 skills a tooltip is a wall of waiting.
- Hover/focus on a line extends its ember hairline across the row. One
  interaction, done once.
- This is the page's type-dominant section. No tiles, no icons in boxes.

### Certifications — the credits roll (`Certifications.tsx`)

**Text only. Zero images.** The client asked for the credentials themselves to
be shown as type with a cinematic scroll, so the 23 certificate scans are not
rendered at all. `CertificationGallery.tsx` and its lightbox are DELETED, and
the files in `public/images/Certification/` become unreferenced assets.

What replaces the ledger:

- **All 23 credentials, in one continuous type block, grouped by issuer** (the
  six issuers: freeCodeCamp, HackerRank, Cisco, Fortinet, TESDA, Udemy). Each
  group is led by its issuer as a mono label with a count.
- **The scroll mechanic is the whole effect: each credential name brightens in
  sequence as it crosses the viewport**, the same word-by-word scrub that
  `ui/ScrollText.tsx` already implements for the section descriptions. A
  credential the reader has not reached yet sits dim; the one they are reading
  is at full ink. That is the "cinematic scrolling" and it is why this section
  needs no plates, no cards and no images.
- **The three featured credentials step up in type size** and carry an ember
  hairline tick at the left. Everything else is the same line one type step
  down. No cards, no monogram badges for the secondary set.
- **Two columns from `lg`, one column below.** Issuer group labels span both
  columns. This is what keeps 23 credentials from becoming a 3,000px wall, and
  it is deliberately different from the Tech Stack section, which is a single
  wide column behind a sticky rail.
- **A single ember progress hairline** down the left edge of the block, filled
  by `scaleY` as the section scrolls. One hairline, scroll-linked, not a nav
  rail and not a sticky element.
- `date` and `verify` are OPTIONAL and unpopulated. Render each only when
  present: no placeholder, no "date unavailable", no dead link, no reserved
  gap. The composition must look finished with both absent.
- This stays the page's list-dominant section: type, air and scroll-linked
  brightness, with no chrome at all.

**A section that changes its layout family must update its row here.** This
table has drifted before, which makes the document lie about the site.

### The nav island (`SiteHeader.tsx`)

A floating glass pill, fixed, `z-40`, detached from the top edge. It carries
the brand, the section links (scroll-spy `aria-current`), the theme switch, and
below `lg` a hamburger that opens a full-screen overlay with a staggered link
reveal. Height stays under the 80px cap and the links stay on one line: the
brand wordmark only appears from `xl`, and below `lg` the links move into the
overlay rather than wrapping.

Sections offset for it with `scroll-mt-24` (96px). That offset lives on the
sections and **never** as `scroll-padding-top` on the scrollport: the two would
add up and land every anchor twice as far down as intended.

## 11. Space

- Container `max-w-6xl` (1152px), gutters `px-5` mobile / `px-8` ≥640px.
- Section rhythm is a single token, `--space-section`, consumed by `Section.tsx`
  and nothing else: **9rem** mobile, **11rem** ≥640px, **13rem** ≥1024px. Do
  not add per-section `py-*` overrides.
- The ramp lives inside `@layer base`, not at top level: Tailwind emits `@theme`
  into the `theme` layer and an unlayered copy never reaches the browser.
- One hairline per division. Never a border *and* a background change on the
  same edge.

## 12. Overflow

`layout.tsx` wraps the page in `overflow-clip`. **Never `overflow-x: hidden`** -
`hidden` makes the element a scroll container and breaks `position: sticky` and
the pinned stacks. The nav island and the grain are siblings of that wrapper so
they can never be clipped by it.

## 13. Verification

Every change must leave these green.

```bash
# Type-check (Windows-side; tsc from WSL blocks on the 9p mount)
timeout 400 powershell.exe -NoProfile -Command "cd C:\codes\Clean-Portfolio; & 'C:\Program Files\nodejs\node.exe' 'node_modules\typescript\bin\tsc' --noEmit -p tsconfig.check.json; Write-Output ('TSC_EXIT=' + \$LASTEXITCODE)"
```

The responsive and weight probes run **Windows-side** (QA Chrome is on Windows
loopback) and read `CDP` / `BASE` / `WIDTHS` from the environment:

```powershell
$env:CDP='http://127.0.0.1:9247'; $env:BASE='http://localhost:3000/'
node pw-qa\scroll-check.mjs    # scroll motion, hydration, overflow, nothing invisible
node pw-qa\field-contrast.mjs  # text contrast
node pw-qa\resp-audit.mjs      # page + per-section height, overflow, text/control floors
node pw-qa\small-controls.mjs  # names every control under 44x44
node pw-qa\weight-check.mjs    # transferred bytes, image weight
```

`pw-qa\dom-probe.mjs` is the escape hatch: set `PROBE` (or `PROBE_FILE`) to any
JS expression and it runs at each width, resolving promises.

### Budgets (regression = fail)

| Metric | Budget |
|---|---|
| Page height @320px | ≤ 14,000px (smoke alarm) |
| Any section @320px | ≤ 2,000px, **except `projects`** (≤ 4,000px) and **`certifications`** (≤ 3,000px) |
| Controls under 44x44 | 0 (WCAG 2.5.8 exempts inline text links) |
| Transferred images @1440px | ≤ 600 KB |
| Horizontal overflow | 0 at every width |
| Page height @768px / @1023px | ≤ page height @1440px |

**Measured baseline.** Recorded so drift is visible, not so it can be relaxed.
Re-measure before claiming any of it still holds.

| Width | Page height | Overflow |
|---|---|---|
| 320 | 12,126px | 0 |
| 375 | 11,764px | 0 |
| 768 | 12,756px | 0 |
| 1024 | 13,985px | 0 |
| 1440 | 14,278px | 0 |

Sections @320px: `home` 683, `projects` 2,732, `techstack` 1,965, `experience`
1,803, `education` 1,218, `certifications` 2,419, `contact` 918, footer 388.
At 1440px `certifications` is 1,710px.
Images @1440px: **115 KB** across 4 requests, all of them project covers.

Two budgets were widened after the design was chosen, and both widenings are
deliberate rather than a pass being faked:

- `projects` is exempt because four cinematic scenes are the section's purpose.
- `certifications` is exempt because 23 credential lines plus 6 issuer group
  labels at 320px is content, not bloat. Reaching 2,000px there would mean
  hiding credentials, and the whole point of the credits roll is that all 23
  are visible.

**Do not expect the certifications height to come down by dropping the images.**
It was already tried: the text-only rebuild removed every scan from the section
(zero `<img>`, page image requests 5 → 4, transferred images 127 KB → 115 KB)
and the section only moved from 2,651px to 2,419px. The height is the 23
credential lines, not the artwork, so any future attempt to hit 2,000px has to
change how the list is presented, not what it renders.

The per-section cap is a smoke alarm for accidental bloat, not a design target.
If a section that is NOT one of those two passes 2,000px at 320px, something has
gone wrong with it.

**The 640-1023px band is the trap.** The nav's link list switches at `lg`, and
any two-column layout must collapse at the same breakpoint its container does.
Measure 320, 375, 640, 768, 1023 and 1440; the endpoints alone have passed a
broken page before.

### Traps the probes encode

- **Scroll with yields.** `Reveal` is driven off scroll events; a synchronous
  `for` loop of `scrollTo` calls is coalesced into one event, so blocks never
  play and lazy images are never requested. Step the scroll and await.
- **A nested `<footer>` is not a section.**
- **`naturalWidth === 0` is not a broken image** unless `img.complete` is also
  true; usually it is just lazy.
- **A contrast probe that assumes a light background reports white-on-dark as
  failing.** Verify a flagged element by reading its own background first.
- **Scroll snapping is active on desktop.** Force
  `document.documentElement.style.scrollBehavior = 'auto'` and assert the
  requested `innerWidth`/`innerHeight` before trusting any per-viewport number.
- **`Page.captureScreenshot` clips are DOCUMENT-relative, not viewport-relative.**
  Sampling a fixed-position layer by clipping at the viewport coordinates you
  want returns a constant, because you are reading the top of the document every
  time. It looks exactly like "the background does not change" and it is a
  coordinate-space bug, not a finding. Offset the clip by `window.scrollY`, or
  capture the full viewport. Any probe that measures a fixed layer at several
  scroll positions needs this.
- **`field-contrast.mjs` reports false failures on pill-shaped elements, and
  only in light mode.** It screenshots the element's bounding rect and takes the
  brightest pixel in that clip as the background. For a `rounded-full` pill the
  rect's corners fall *outside* the fill, so the sample picks up whatever sits
  behind the pill instead of the pill's own surface. On the dark stage that is
  another dark tone and the probe passes; on the light stage it is bright bone,
  which inflates the measured ratio and fails a button that is fine on screen.
  The probe has only ever been run against `#home` in dark mode, which is why
  this has never fired. Before extending contrast measurement to light mode,
  inset the sample rect (or sample the centre) for any element with a
  `border-radius` large enough to cut the corners.

Never commit and never push. Leave every change in the working tree.
