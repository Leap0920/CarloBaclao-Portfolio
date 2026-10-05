# DESIGN.md — Carlo Baclao Portfolio

The single source of truth for tokens, type, motion and behaviour.
Every change to `src/` must conform to this file. If a change needs a token
that is not here, add it here first.

**This file describes the DARK-FIRST system.** The previous light-theme colour
contract is deleted. Where an older section below still reads light, the
"Token reference" section at the end wins.

---

## 1. Product frame

- **Surface:** one page, `src/app/page.tsx`, eight sections in document order.
- **Audience:** a hiring manager or tech lead skimming for 60 seconds on a phone,
  then possibly opening the résumé. Secondary: a recruiter on desktop.
- **Primary task:** decide within one screen that this person ships real software,
  then reach the résumé or email in one tap.
- **Quality bar:** the Linear / Stripe / Supabase class — technically clean, but
  with a real point of view. Calm, confident, dark-first. Not a template.
- **Copy budget:** the whole page must read in **under 3 minutes**. Target
  **≤ 650 rendered words**.

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

## 2. The theme system — dark first, switchable, no flash

**Dark is the default.** Three things make that true, in this order:

1. The server renders `<html class="dark …">`. With JavaScript disabled the dark
   theme applies, because `:root` in `globals.css` *is* the dark value set.
2. A **blocking inline `<script>` in `<head>`** (`THEME_SCRIPT`, `src/lib/theme.ts`)
   runs before the first paint. It resolves the theme from
   `localStorage['cp-theme']` → `prefers-color-scheme` → dark, then stamps
   `dark` / `light` and `color-scheme` on `<html>`.
3. `ThemeProvider` (`src/components/providers/ThemeProvider.tsx`) only *keeps
   React in sync* with what the script already did, and writes the visitor's
   choice back to `localStorage`.

A `useEffect`-only approach flashes the wrong theme; do not reintroduce one.

### Rules

- `<html>` always carries exactly one of `dark` / `light`. The `dark:` Tailwind
  variant is class-based (`@custom-variant dark (&:where(.dark, .dark *))`).
- The token switch lives in raw CSS variables: `:root` = dark, `:root.light` =
  light. `@theme static inline` maps those onto Tailwind's namespaces, so
  `bg-background`, `text-foreground`, `border-border`, `text-muted`,
  `text-accent`, `bg-accent` and `font-display` follow the switch with no
  re-declared utilities.
- Never hardcode a hex in a component. If a colour is needed, it is a token.
- `ThemeToggle` (`src/components/ui/ThemeToggle.tsx`) is the only control.
  It is a ≥44×44 button, always visible (never hover-revealed), labelled with the
  *action* ("Switch to light theme"), and renders **both** icons, swapping them
  in CSS — so there is no hydration flash and no client-only icon choice.

### Verified contrast (measured in Chrome, not asserted)

| Pair | Theme | Ratio |
|---|---|---|
| `--muted` text on `--background` | dark | **7.07:1** |
| `--accent` text on `--background` | dark | **4.52:1** |
| `--muted` text on `--background` | light | **6.93:1** |
| `--accent` text on `--background` | light | **5.53:1** |

All four clear AA (4.5:1). `--foreground` measures 18.03:1 (dark) / 18.83:1 (light).

**Caveat — dark surfaces.** `--accent` on `--surface` (`#14141C`) is only
**4.21:1** and therefore fails AA for text. In dark mode, accent text on a raised
surface must step up the ramp to `--color-accent-400` (`#9C82FF`, 6.15:1 on
surface) or use `--foreground`. This is a consequence of the client-specified
`--surface` value and the mandated `#7C5CFF` accent; it is documented, not hidden.

---

## 3. Colour tokens

### 3.1 Semantic (the contract)

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--background` | `#0b0b10` | `#fafafc` | page |
| `--surface` | `#14141c` | `#ffffff` | cards, panels |
| `--surface-2` | `#17171f` | `#f3f3f8` | nested / footer panel |
| `--border` | `rgba(255,255,255,.08)` | `rgba(0,0,0,.08)` | every hairline |
| `--foreground` | `#f5f5f7` | `#0b0b10` | body + headings |
| `--muted` | `#9a9aa8` | `#565663` | secondary copy |
| `--accent` | `#7c5cff` | `#6b45e8` | accent text, fills |
| `--accent-hover` | `#9279ff` | `#5a34cc` | accent hover |
| `--accent-soft` | `rgba(124,92,255,.16)` | `rgba(107,69,232,.10)` | tinted background |
| `--on-accent` | `#0b0b10` | `#ffffff` | label on an accent fill |

Legacy aliases kept for untouched components: `--color-ink` → `--foreground`,
`--color-ink-soft` → `--ink-soft`, `--color-faint` → `--faint`,
`--color-hairline` → `--border`.

### 3.2 The accent ramp

One violet family, two variants — the ramp itself switches with the theme.

| Step | Dark | Light | Text-safe on |
|---|---|---|---|
| `-50` | `#f0edff` | `#f3f0ff` | — (tint) |
| `-100` | `#e2dbff` | `#e7e1ff` | — (tint) |
| `-200` | `#c8bdff` | `#cfc2ff` | — (tint) |
| `-300` | `#b09eff` | `#ae99ff` | dark (8.58:1) |
| `-400` | `#9c82ff` | `#8b6bff` | dark (6.59:1) |
| `-500` | `#7c5cff` | `#6b45e8` | dark (4.52:1) · light (5.53:1) |
| `-600` | `#6a46e8` | `#5a34cc` | light (7.20:1) — dark: fill only |
| `-700` | `#5837c4` | `#4a2aa6` | light (9.27:1) — dark: fill only |
| `-800` | `#462c9b` | `#3a2080` | fills |
| `-900` | `#33206f` | `#2a1758` | fills |

**The accent MUST be re-derived for light mode.** `#7C5CFF` on a near-white page
is only **4.17:1** and fails AA as text; the light accent is `#6B45E8` (5.53:1 on
`--background`, 5.77:1 on `--surface`). The dark accent stays exactly `#7C5CFF`.

Fills: in dark mode `bg-accent` (`#7C5CFF`) pairs with `text-on-accent`
(`#0B0B10`, 4.52:1) — or use `bg-accent-600` with white (5.75:1). In light mode
`bg-accent` (`#6B45E8`) pairs with `text-on-accent` (white, 5.77:1).

### 3.3 Cyan — gradients only

`--cyan: #22d3ee`. It exists as a **raw variable only**; there is deliberately no
`--color-cyan`, so no `text-cyan` / `bg-cyan` utility can be generated from it.
Cyan may appear **inside a gradient** (today: `hero-glow`) and nowhere else —
never flat text, never a solid fill, never a border.

---

## 4. Type

Three faces, three jobs:

| Role | Family | Variable | Where |
|---|---|---|---|
| Display / headings | **Space Grotesk** | `--font-display` | `h1`–`h6` (set in the base layer) and the `font-display` utility |
| Body / UI | **Inter** | `--font-sans` | everything by default |
| Labels / code | **JetBrains Mono** | `--font-mono` | eyebrows, dates, tech lists, counts |

`--font-display` falls back to Inter and then the system stack. **If the
`Space_Grotesk` loader is removed from `layout.tsx`, the display face silently
becomes Inter** — the loader is the only thing that makes it real. Verified: the
computed `font-family` of `h1` is `"Space Grotesk", "Space Grotesk Fallback",
Inter, "Inter Fallback", ui-sans-serif, system-ui, sans-serif`.

Scale (mobile → desktop, `clamp` where noted):

| Token | Value | Use |
|---|---|---|
| `--text-display` | `clamp(2.75rem, 8vw, 5rem)` | hero name only |
| `--text-title` | `clamp(1.625rem, 3vw, 2.25rem)` | section headings |
| `--text-lead` | `1.125rem` | section intros |
| `--text-body` | `1rem` | body copy |
| `--text-small` | `0.875rem` | secondary / meta |
| `--text-micro` | `0.6875rem` | **HARD FLOOR** |

**Nothing may render below 11px (`--text-micro`).** This is a hard floor
established by the previous pass. A 10px label is a bug, not a size.

Rules:
- Body copy is **never** wider than `62ch`. Section intros max `52ch`.
- `text-wrap: balance` on headings, `pretty` on paragraphs (global).
- No letter-spaced all-caps text above 11px.

---

## 5. Space & layout

- Container: `--max-width: 1200px` (utility `max-w-content`, via
  `--container-content`). Gutters `px-5` mobile / `px-8` ≥640px.
- Section rhythm: `--space-section` — **4rem** mobile, **6rem** ≥768px.
  No per-section `py-*` overrides.
- **8px spacing scale** (named tokens, `n × 8px`):

| Token | `--space-1` | `--space-2` | `--space-3` | `--space-4` | `--space-6` | `--space-8` | `--space-12` | `--space-16` |
|---|---|---|---|---|---|---|---|---|
| px | 8 | 16 | 24 | 32 | 48 | 64 | 96 | 128 |

- Tailwind's numeric spacing (`gap-4`, `py-6`) stays on its own 4px base — do
  **not** repoint `--spacing`, it would rescale every existing utility.
- One hairline per division. Never a border *and* a background change on the
  same edge.

### Overflow

`layout.tsx` wraps the page in `overflow-x: clip`. **Never `overflow-x: hidden`** —
`hidden` makes the element a scroll container and breaks `position: sticky` on the
navbar. `clip` trims horizontal overflow without creating a scrollport. Verified:
the wrapper computes `overflow-x: clip` / `overflow-y: visible`, the fixed navbar
still hit-tests at the top after a 1400px scroll, and
`documentElement.scrollWidth === clientWidth === innerWidth` at **320** and **375**.

---

## 6. Radius

One language:

| Token | Value | Utility |
|---|---|---|
| `--radius` | **20px** | `rounded` |
| `--radius-lg` | **24px** | `rounded-lg` |
| `--radius-sm` | **16px** | `rounded-sm` |

Cards use `--radius`; large media/panels use `--radius-lg`; chips and small
controls use `--radius-sm`. Pills stay `rounded-full`.

---

## 7. Motion contract

Everything lives in **`src/lib/motion.ts`**. Sections import the shared variants;
no section defines its own.

| Export | Shape |
|---|---|
| `fadeUp` | `opacity 0, y 40` → `opacity 1, y 0` |
| `slideLeft` | `opacity 0, x -80` → `opacity 1, x 0` (desktop) |
| `slideRight` | `opacity 0, x +80` → `opacity 1, x 0` (desktop) |
| `scaleIn` | `opacity 0, scale 0.9` → `opacity 1, scale 1` |
| `staggerContainer` | `staggerChildren: 0.12` |
| `viewportOnce` | `{ once: true, amount: 0.2 }` |
| `EASE` | `cubic-bezier(0.22, 1, 0.36, 1)` (exported as a bezier array) |
| `DURATION` | `base 0.6` · `slow 0.7` · `max 0.8` — seconds |

### The performance rule

**Animations may only animate `transform` and `opacity`.** Never width, height,
top, left, margin or padding — those trigger layout and destroy the frame budget.
Every exported variant complies; anything added must too.

### Responsive slide distance

An 80px sweep reads as a jump on a 320px-wide phone. Slides therefore travel:

| Viewport | Distance |
|---|---|
| ≥640px (`--breakpoint` desktop) | **80px** |
| <640px (`max-width: 639px`) | **30px** |

Use `useSlideVariants()` (client hook) — it resolves the breakpoint *and*
reduced motion, so sections never re-implement the check. `makeSlideVariants(isMobile)`
is the pure equivalent. `slideLeft` / `slideRight` stay exported as the desktop
pair for existing call sites.

### Reduced motion

Reduced motion is a branch, not a hope:

- **Slides become a simple fade** (`fadeIn`, opacity only) — not a faster slide.
  `useSlideVariants()` returns fades automatically; `resolveVariants(slideLeft, true)`
  does it for the plain desktop variants.
- `resolveVariants(variants, reduced)` returns the resting `NO_MOTION` state
  (visible, un-offset, zero duration) for everything else.

The global `prefers-reduced-motion` block in `globals.css` stays: scroll-behaviour
goes `auto`, transitions collapse to `0.01ms`, and the scroll-reveal resolves
instantly. `useReducedMotion()` (`src/hooks/useReducedMotion.ts`) must keep working.

### Scroll reveal

`[data-reveal]` + `html.js-reveal` (added by the boot script) stays as is. The
content must never be stuck at opacity 0 if the bundle fails.

Banned: bounce/elastic easing, `animate-bounce`, springs with visible overshoot on
layout, entrance animations longer than `0.8s`, anything that replays on every
scroll-direction change.

---

## 8. The 3D hero

Required:

- **Contain it.** The composition must be fully inside its box at every width —
  no edge crop. Pull the camera back / scale the rig rather than cropping.
- **Never overlap text.** On `<1024px` the scene occupies its own band *below* the
  copy (or is removed entirely below `640px`); it must not sit under the chips,
  the CTAs, or the stat row. On `≥1024px` it stays in the right column, and its
  bounding box must clear the stat row.
- **Read as intentional.** If it is visible it is `opacity-100` in its own clear
  space; if there is no clear space, do not render it.
- **Depth.** A subtle depth-of-field (near beads crisp, far beads dimmed via `fog`
  or per-mesh opacity), a soft contact shadow, and a slow idle drift. Keep the
  "blueprint shell + faceted accent core + bead orbits" language — do not replace
  it with a generic blob, a particle field, or a spinning cube.
- **Interaction.** Damped pointer parallax plus a clamped scroll-linked response.
  Off under reduced motion.
- **Budget.** `dpr={[1, 1.5]}`, `antialias` on, `preserveDrawingBuffer` **off**,
  `powerPreference: 'high-performance'`, `frameloop` never `'always'` when the
  hero is out of view. Gate the scene behind
  `webgl && !reducedMotion && !saveData && inView`.
- Geometry stays low-poly. No postprocessing pass, no shadow maps, no env map.

---

## 9. Responsive rules

- **375px is the primary target**, not an afterthought. Judge every change there
  first, and check **320px** for horizontal overflow.
- Stacked buttons go **full width** below `640px` and share one width.
- The contributions chart must not force a horizontal scroll on a phone; let the
  SVG scale with `w-full` or render a compact window.
- Certification and Work are the tallest sections; cap initial renders behind a
  "Show all N" control where it helps the phone.
- Never rely on hover for anything functional.
- Tap targets ≥ 44×44px.

---

## 10. Performance budget

| Metric | Target |
|---|---|
| Page JS (gzip, prod build) | ≤ 260 KB |
| Fonts | 3 families (Inter, Space Grotesk, JetBrains Mono) — subset `latin`, `display: swap` |
| CLS | 0 |
| Layout thrash | none — animate `transform`/`opacity` only |

`next.config.mjs` already sets `reactCompiler`, image formats
(`avif`, `webp`) and `optimizePackageImports: ['lucide-react','framer-motion']`.
Measure performance against a production build, never the dev server.

---

## 11. Anti-slop checklist (reject on sight)

- **Flat cyan.** `#22D3EE` anywhere except inside a gradient. No `text-cyan`,
  no `bg-cyan`, no cyan border.
- **`#7C5CFF` as light-mode text.** It is 4.17:1 on white — re-derive the accent
  for light mode (use `--accent` / `#6B45E8`).
- Accent text on a dark `--surface` without stepping up the ramp to `-400`.
- Hardcoded hex values in components instead of tokens.
- `overflow-x: hidden` on a page wrapper — it breaks sticky. Use `clip`.
- Animating width / height / top / left.
- A per-section copy of a variant that already lives in `motion.ts`.
- Purple/indigo **gradient** text or buttons — the accent is a flat colour.
- Glassmorphism outside the header, the lightbox, and `glass-card`.
- A card for every piece of content; cards inside cards.
- Icon + heading + two-line description repeated identically six times.
- Emoji in headings or buttons.
- `shadow-xl` on flat content; shadows only on floating surfaces.
- Centred body paragraphs; this page is left-aligned editorial.
- Decorative blobs, orbs, or "AI glow" — `hero-glow` is the only glow.
- Placeholder copy left in (`Lorem`, `Coming soon`, `TODO`).
- An animation whose only job is to prove an animation exists.
- Text below 11px. Text that fails 4.5:1 on its own background.

---

## 12. Token reference (authoritative)

These live in `src/app/globals.css`. Where this section conflicts with any earlier
section, **this section wins**.

```css
:root {                       /* DARK — the default */
  --background:#0b0b10; --surface:#14141c; --surface-2:#17171f;
  --border:rgba(255,255,255,.08);
  --foreground:#f5f5f7; --ink-soft:#c7c7d1; --muted:#9a9aa8; --faint:#8f8f9c;
  --accent:#7c5cff; --accent-hover:#9279ff; --accent-soft:rgba(124,92,255,.16);
  --on-accent:#0b0b10;
  --accent-50:#f0edff; --accent-100:#e2dbff; --accent-200:#c8bdff;
  --accent-300:#b09eff; --accent-400:#9c82ff; --accent-500:#7c5cff;
  --accent-600:#6a46e8; --accent-700:#5837c4; --accent-800:#462c9b; --accent-900:#33206f;
  --cyan:#22d3ee;             /* gradients only */
  color-scheme:dark;
}
:root.light {                 /* LIGHT — every value re-derived */
  --background:#fafafc; --surface:#ffffff; --surface-2:#f3f3f8;
  --border:rgba(0,0,0,.08);
  --foreground:#0b0b10; --ink-soft:#2e2e38; --muted:#565663; --faint:#6b6b76;
  --accent:#6b45e8; --accent-hover:#5a34cc; --accent-soft:rgba(107,69,232,.10);
  --on-accent:#ffffff;
  --accent-50:#f3f0ff; --accent-100:#e7e1ff; --accent-200:#cfc2ff;
  --accent-300:#ae99ff; --accent-400:#8b6bff; --accent-500:#6b45e8;
  --accent-600:#5a34cc; --accent-700:#4a2aa6; --accent-800:#3a2080; --accent-900:#2a1758;
  color-scheme:light;
}
```

Mapped through `@theme static inline` to: `background`, `surface`, `surface-2`,
`border`, `foreground`, `muted`, `accent`, `accent-hover`, `accent-soft`,
`on-accent`, `accent-50…900`, plus the legacy `ink` / `ink-soft` / `faint` /
`hairline` aliases, `font-sans` / `font-display` / `font-mono`, the `text-*`
scale, `radius` / `radius-lg` / `radius-sm`, the `space-*` scale, `max-width` /
`container-content`, and the `ease-out-expo` / `ease-soft` easings.

Utilities defined in `globals.css`: `hero-glow` (subtle violet + cyan gradient on
a `::before` at `inset:0` — no layout cost, cannot overflow), `glass-card` (1px
hairline, `--radius`, soft shadow, 16px backdrop blur), `glass`, `bg-grid`,
`no-scrollbar`.
