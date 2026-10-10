# Registry components

Real shadcn-registry components, pulled from their open-source upstreams and
adapted to this repo. Alongside `src/components/reactbits/` (73 React Bits
components), this is the component toolbox for the site.

## Where these came from, and why not 21st.dev

The brief was "21st.dev — get all the tools there". **21st.dev itself is not
usable from here.** Its registry endpoints answer `403 authentication_required`
(`{"error":"Authentication required","reason":"authentication_required",…}`),
and there are no saved credentials for it. Nothing was guessed.

The components 21st.dev aggregates are open source upstream, and those
registries are public, so the same components were fetched from source:

- **Magic UI** — `https://magicui.design/r/<name>.json` (MIT)
- **Aceternity UI** — `https://ui.aceternity.com/registry/<name>.json`

If a 21st.dev account is ever added, `npx shadcn@latest add <url>` would work
against `https://21st.dev/r/<author>/<name>` — but run it **Windows-side**, or
the win32 `node_modules` is destroyed.

## What is here

| Component | Source | Notes |
|---|---|---|
| `aceternity/container-scroll-animation` | Aceternity | 3D container that rotates/scales as it scrolls. The most cinematic one here. |
| `aceternity/sticky-scroll-reveal` | Aceternity | Sticky column with a scrubbed cross-fade. |
| `aceternity/hero-parallax` | Aceternity | Parallax product grid with a sticky header row. |
| `aceternity/infinite-moving-cards` | Aceternity | Two-row infinite marquee of cards. |
| `aceternity/text-generate-effect` | Aceternity | Word-by-word opacity reveal. |
| `aceternity/card-hover-effect` | Aceternity | Pointer-tracking hover cards. |
| `magicui/marquee` | Magic UI | Infinite scrolling track. **Rewritten** — see below. |
| `magicui/scroll-based-velocity` | Magic UI | Marquee whose speed follows scroll velocity. |
| `magicui/number-ticker` | Magic UI | Count-up on view. |
| `magicui/blur-fade` | Magic UI | Blur-in entrance. |
| `magicui/shine-border` | Magic UI | Animated border sheen. |
| `magicui/magic-card` | Magic UI | Pointer-following spotlight card. |

## Adaptations that were required

These are not optional polish — each one is a bug if skipped.

1. **`cn` is not clsx here.** Every registry file imports `cn` from
   `@/lib/utils`, which does not exist in this repo (it is `@/lib/cn`), and the
   repo's `cn` is a plain falsy-filtering join — it does **not** accept objects
   or nested arrays. Upstream `marquee` called
   `cn("…", { "flex-row": !vertical })`, which would have stringified to
   `[object Object]` in the class list. `marquee.tsx` was rewritten to use
   ternaries and `&&`. **Check any newly pulled component for object/array
   arguments before trusting it.**

2. **`magic-card` imported `next-themes`,** which this repo deliberately does
   not have (the theme system was removed). The lookup is pinned to light, which
   is the only theme the site ships.

3. **`marquee` needs keyframes the registry does not ship.** The
   `--animate-marquee` / `--animate-marquee-vertical` theme keys and their
   `@keyframes` live in `src/app/globals.css`. Without them `animate-marquee` is
   a class that does nothing.

## Rules when using one of these

- **Do not wrap the page in anything that transforms.** A CSS `transform` on an
  ancestor makes `position: fixed` resolve against that ancestor, which breaks
  GSAP pinning (the Projects horizontal rail). This is why `ScrollSkew` is not
  applied at page level.
- **Do not let a component gate content visibility on a framer/motion
  entrance.** `initial={{ opacity: 0 }}` / `whileInView` bakes inline
  `opacity: 0` into the served HTML and never resolves on a slow link — a
  documented, measured bug on this site (178 of 240 elements once stayed
  invisible through the tunnel). Scroll-*linked* motion (`useScroll`,
  `useTransform`) is safe; entrance gating is not.
- **Strip the demo styling.** Registry CSS ships showcase values — fonts, sizes,
  `text-transform: uppercase`, hardcoded colours. This has already broken a
  heading once (`Shuffle.css` forced `4rem` + uppercase). Neutralise anything
  that sets `font-family`, `font-size`, `line-height`, `letter-spacing`,
  `text-transform` or a raw colour, and restate `line-height` **after** any
  `font` shorthand, because the shorthand resets it.
- **Monochrome only.** No accent hue, no gradients, no hardcoded hex. Read
  `DESIGN.md` and use the tokens.
- **Mobile is the constraint.** The page was 16,731px tall at 320px. Anything
  added must declare its `<768px` behaviour, and a component that only looks
  right at 1440px is not finished.
