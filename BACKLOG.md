# Clean-Portfolio — 40-item improvement backlog

Grounded in the repo as it stands (Next 16.2.1 / React 19 / Tailwind 4, working tree uncommitted).
Each item names the action and the evidence it rests on. Nothing here is committed — per DESIGN.md
"Never commit and never push. Leave every change in the working tree."

## Progress

- 1-5 DONE: `typecheck` + `test` scripts, Vitest harness (vitest 5 / jsdom / RTL), unit tests for
  `lib/format` and `lib/theme`, a `ScrollText` component test, and `.github/workflows/ci.yml`.
  19 tests pass, `TSC_EXIT=0`.
- 6 PARTIAL: ESLint now ignores the vendored dumps and the generated build outputs, which took
  `npm run lint` from **30,718 problems to 22** (17 errors, 5 warnings). The CI lint step is
  non-blocking until those 17 are cleared.
- 7 DONE: `npm run qa` (plus `qa:scroll`, `qa:resp`, `qa:contrast`) wraps the three existing
  `pw-qa` probes. Verified end to end: `QA_EXIT=0`, SCROLL-CHECK ALL PASS, FIELD-CONTRAST ALL PASS.
  It must run Windows-side, because the probe CDP port and the dev server are on the Windows
  loopback. `npm test` = 22 tests passing; `npm run build` green in an isolated `NEXT_DIST_DIR`.
- 8 DEFERRED: a CI job that boots the production build and runs those probes headlessly needs
  Playwright (a new heavy dependency). The probes already run on demand via item 7.
- 13 DONE: `reactCompiler: true` is already set in `next.config.mjs`.
- 39 DONE: `src/app/error.tsx` and `src/app/global-error.tsx` plus 3 tests. The route boundary
  renders inside the root layout so it uses the tokens; the global one replaces the layout, so it
  reads the palette through `var(--token, fallback)`. `loading.tsx` deliberately skipped: this is a
  single-route static page, so a route-level loading state would only ever flash.
- 9 DECIDED: `/lab` stays, and is now noindexed (`src/app/lab/layout.tsx`, added because a client
  page cannot export `metadata`). It is the only consumer of ~45 showcase components, so it is what
  pulls `three`, `@react-three/*`, `ogl`, `matter-js`, `motion`, `framer-motion`, `postprocessing`
  and `react-icons` into the deployment — but every one of those is a dynamic import, so none of
  them are in the home bundle. `reactbits/` is untouched.
- 10 DONE: the 12 unused `registry/` components were MOVED out of the repo to
  `C:\temp\clean-portfolio-removed\registry\` (the tree is untracked, so a delete is
  unrecoverable). `README.md` stays: it documents the upstream sources and the porting traps.
- 11 DONE: `scripts/bundle-budget.mjs` + `npm run bundle:budget`, enforced in CI after the build.
  It reads the prerendered HTML for a route and sums the chunks that route actually loads — not the
  whole directory, which would count lazy chunks too. Baseline `/` = 872.3 KB raw / 278.2 KB gzip
  (16 chunks); the ratchet is 950 KB / 300 KB. Both the pass and breach paths were exercised.
- 12 DONE (audit, no deps dropped): a real module-graph walk (`C:\temp\qa\dep-graph.mjs`) rather
  than greps. The home route reaches exactly **6** runtime packages: `next`, `react`, `react-dom`,
  `gsap`, `@gsap/react`, `lucide-react`. Ten more are lab-only. Nothing is droppable without
  breaking `/lab`, so nothing was dropped.
- 13 DONE: `reactCompiler: true` is already set in `next.config.mjs`.
- 14 DONE: the two `Carlo_Baclao_Resume.pdf` copies were byte-identical (same sha256); `profile.ts`
  points at the `public/` one, so the repo-root duplicate was moved out.
- NEW: `src/components/three/` (`HeroField`, `ParticleField`, `FieldBoundary`, `shaders/field.ts`)
  is reached by NO entry point — nothing imports it, so it is not in the home graph or the lab
  graph. It is the only first-party consumer of `three` and `@react-three/fiber`. Given the tree
  also deletes `hero/JupiterHero`, this is a sibling workstream's in-flight WebGL hero, NOT dead
  code. It was left completely alone.
- NEW: 25 `reactbits/` components are not referenced by any route, including `/lab`
  (`ChromaGrid`, `ClickSpark`, `Counter`, `DepthText`, `ElectricBorder`, `GlareHover`, `ImageTrail`,
  `MagicBento`, `MagnetLines`, `MetaBalls`, `PixelTrail`, `ProfileCard`, `Ribbons`,
  `ScrollVelocity`, `ShapeBlur`, `SplashCursor`, `SpotlightCard`, `Stepper`, `StrokeText`,
  `TargetCursor`, `TextCursor`, `TextPressure`, `TiltedCard`, `VariableProximity`). Left in place:
  a never-imported file is never bundled, so they cost nothing at runtime, and `reactbits/` is a
  toolbox by design.
- NEW: orphaned first-party files reached by no entry point: `ui/CopyEmailButton.tsx`,
  `ui/Counter.tsx`, `ui/Magnetic.tsx`, `ui/PinnedHeading.tsx`, `ui/TiltCard.tsx`, `data/stats.ts`,
  `hooks/useScrollDirection.ts`, `lib/motion.ts`. These pair up (`data/stats` + `ui/Counter`,
  `useScrollDirection` + `lib/motion`), so they read as a staged polish set rather than leftovers.
  Left in place. (`app/not-found.tsx` and `app/global-error.tsx` also show as unreferenced — that is
  the Next convention, not dead code.)
- FIXED (found by verification): `tsconfig.check.json` overrode `include` and omitted
  `vitest.setup.ts`, so the `@testing-library/jest-dom` matcher augmentation never loaded and
  `toBeInTheDocument` failed to typecheck in any test that used it. Added it.
- 15 DONE: a real axe-core audit runs against the live page in BOTH themes
  (`C:\temp\qa\axe-audit.mjs`, WCAG 2.1 A/AA + best-practice). axe is injected from a local copy, so
  the repo gains no dependency. It found 2 violations, both now fixed and re-verified as
  **NO VIOLATIONS** in dark and light:
  - `aria-prohibited-attr` (serious, WCAG 4.1.2 A), 6 nodes. GSAP SplitText defaults to
    `aria: 'auto'`, which puts `aria-label` on the element it splits — here a role-less `<span>`
    inside every section `<h2>`, where naming is prohibited. Fixed by adding a `splitAria`
    pass-through prop to `Shuffle` (default unchanged, so `/lab` is unaffected) and moving the name
    onto the `<h2>`, which may legitimately carry it. The heading check confirms the visual identity
    is untouched (every h2 still 44px/600, same colour) and the split span is now `aria-hidden`.
  - `landmark-complementary-is-top-level` (moderate). An `<aside>` sat inside the page's `<main>` in
    `Education.tsx`; it is section content, not a tangential aside, so it is now a `<div>`.
  - 480 `color-contrast` nodes stay in axe's `incomplete` bucket (it cannot compute against the
    gradient backdrop). Those are covered by `field-contrast.mjs`, which passes 15/15.
- 17 DONE: a skip-to-content link is now the first focusable element, and the nav island was moved
  BEFORE the clip wrapper so the nav is first in tab order — the order is what makes the skip link
  worth having. Safe because the header's `z-40` is explicit, and verified: `elementFromPoint` at
  the island still hits `header` on desktop and mobile, and the skip link measures 1x1 hidden →
  143x44 focused. `#main-content` is marked on the `<main>` of all four routes (home, lab, error,
  404). Tab order is now: skip link → back-to-top → 7 nav links → theme toggle → content.
- 21 DONE (verified clean): heading outline is a single H1, then H2 per section, then H3 items, with
  no skipped levels; landmarks are main + nav[Page sections] + nav[Sections].
- 16 PARTIAL: only `ScrollText` is proven reduced-motion safe (0 of 216 spans dimmed). The other
  components named in this item (`ui/Reveal`, `ui/Parallax`, `ui/ScrollScale`, `ui/Magnetic`,
  `ui/PinnedHeading`) are largely ORPHANED — see the dead-code finding above — so auditing them now
  would audit code no visitor can reach. Re-audit once they are wired.
- 18 PARTIAL: the skip link's focused state is verified (fixed, 143x44, accent fill, actually
  receives focus). A per-control focus-ring sweep across both themes is still outstanding.
- 19 NOT STARTED: dialog focus trap (Esc, restore focus to trigger).
- 20 NOT STARTED: colour-only meaning on pills and status dots.
- FIXED (found by regression): the new skip link made `resp-audit.mjs` report 1 control under 44px —
  a false positive, since the link is 1x1 by design while hidden. The probe now ignores controls
  <=1px in either axis, so a real undersized target cannot hide behind it.
- NEW: the 17 remaining lint errors are first-party and real (React Compiler rules:
  setState-in-effect in `lib/theme.ts` and `ui/Counter.tsx`; refs-during-render in `ui/Reveal.tsx`;
  impure-calls-during-render in `three/ParticleField.tsx`; access-before-declaration in
  `ui/Cinematic.tsx` x4, `layout/StageBackdrop.tsx`, `sections/Certifications.tsx`,
  `sections/Education.tsx`). They live in other workstreams' files — clear them before enforcing
  lint in CI.
- NEW: the QA probes now report sections `domain-frontend`, `domain-backend`, `domain-tools` and
  `domain-design`, which did not exist when this list was written. A sibling workstream is mid-flight
  on the section structure; this list must not be read as a description of the current tree.
- 22 DONE (budget) + FIXED (the biggest win on this list): `scripts/perf-budget.mjs` +
  `npm run perf:budget` measures LCP/CLS/TBT on the live page through the same CDP Chrome the qa
  probes use, under 4x CPU throttle and Slow-4G, as the **median of 3 samples** — one sample lands
  mid-recompile on this shared machine and roughly doubles TBT, so the median ignores it by
  construction. It is a ratchet, not the Lighthouse bar: LCP 3000ms (now close to the 2500ms good
  bar), CLS 0.1, TBT 1600ms (deliberately loose — TBT is hydration cost — with the gap printed on
  every run).
  - THE DEFECT IT FOUND: the hero copy was invisible until React hydrated. `[data-reveal='hidden']`
    is `opacity: 0` under `html.js-reveal`, and the flip to `shown` happens in `Reveal`'s
    `useEffect` — so the page's LCP element waited on the bundle. Measured with `gate-check.mjs`:
    **js-reveal armed at 761ms, React reported at 5102ms, copy visible at 5375ms.** The 4s escape
    hatch does not rescue it, because hydration eventually wins that race and then stands the hatch
    down. That is exactly the failure the entrance rule in DESIGN.md exists to prevent, and the hero
    was the one place still committing it.
  - THE FIX: the hero gets a pure-CSS `hero-rise` keyframe (the comment in `Reveal.tsx` already
    referenced a `hero-rise` that was never written). It starts at first paint, the stagger is
    `animation-delay` (0/.09/.18/.27s — the same step `Stagger` used), and `prefers-reduced-motion`
    turns it off. **LCP 5512ms -> 1912ms (median), now MEETING the 2500ms good bar**; the copy is
    first painted at 1424ms while React hydrates at 5235ms, i.e. the entrance no longer depends on
    JS at all. Verified by `hero-check.mjs` 8/8 (same four elements, same stagger, same 0.75s,
    identity classes and display-scale type intact, no animation under reduced motion), CLS still 0,
    full qa green, field-contrast ALL PASS including the hero eyebrow at 5:1, build green.
  - STILL OPEN: the below-fold sections still go through `Reveal`, so their content is likewise
    invisible until hydration (~4.6s). They are not the LCP element, so this is not a budget breach,
    but it is the same defect and the same fix applies.
- 23 MEASURED, NOT WORTH DOING: the item assumes 29 per-paragraph ScrollTriggers need batching into
  one. The cost was measured rather than assumed: 6s of continuous scripted scrolling on the
  4x-throttled page costs **186ms of TBT across 2 long tasks** — about 3% of main-thread time — over
  29 blocks / 216 word spans. GSAP services every trigger from a single rAF loop, and the work is
  the per-word style writes, not the trigger count, so merging 29 triggers into 1 would not remove
  the cost the item is aimed at. Left as is; re-measure if the block count grows by an order of
  magnitude.
- 24 DONE, with a fix. Every rendered raster goes through `next/image` with explicit `sizes`,
  verified by `img-check.mjs` (4/4 images LOADED, all `sizes=yes`, all served `image/avif`) and
  `img-net.mjs` (4/4 requests 200). `images.formats` is `['image/avif','image/webp']`. The only raw
  `<img>` is `CardNav` (reactbits, `/lab` only).
  - FIXED: `Projects.tsx` asks for `quality={60}`, but Next 16 restricts the optimizer to an
    allowlist (default `[75]`) and answers anything else with **400** — verified: q=60 -> 400,
    q=90 -> 400, q=75 -> 200. The page only dodged this because Next snapped the value (dev emitted
    q=70, production q=75), so the component's intent was silently ignored. Declared
    `qualities: [60, 75]` in `next.config.mjs`; verified against a real production server on a spare
    port: q=60 -> 200 (87,448 bytes vs 99,839 at 75, **12% smaller**), q=75 -> 200, q=90 -> 400, and
    the built page now requests `q=60` x36.
  - Note: the 23 certificate scans in `public/images/Certification/` (4.5MB) are deliberately not
    rendered — the client asked for the credentials as type, so `CertificationGallery` was deleted.
    They are deployed but never fetched, so they cost nothing per page.
- 26 AUDITED: both `/api/github/*` routes already carry `revalidate = 3600`, a matching
  `next: { revalidate }` on the fetch, `Cache-Control: public, max-age=3600,
  stale-while-revalidate=86400`, and a try/catch returning 502 rather than throwing. They are
  prerendered static (1h / 1y). The real finding is that **nothing calls them** — there is no
  reference to `/api/` anywhere in `src/` — so they are orphaned, most likely left behind when a
  contributions component was deleted. Left in place: they are cheap static routes and the sibling
  restructure is still moving. Candidate for removal once the tree settles.
- 27 NOT ACTIONABLE YET: `three/HeroField.tsx`, `ParticleField.tsx` and `FieldBoundary.tsx` are
  reached by no entry point (see the dead-code finding above), so there is no rendered WebGL cost to
  measure or gate. The hero's ambient layer is `.hero-glow`, which is CSS and by its own comment
  "animates nothing and listens to nothing". Revisit if the WebGL hero lands.
- 28 VERIFIED: the built HTML preloads both faces (`<link rel="preload" ... .woff2>` x2), and the
  fonts are declared with `display: 'swap'` and the `latin` subset, so there is no FOIT — text
  paints immediately in the fallback and swaps.


## A. Testing & CI (1-8) — the biggest gap: no tests, no CI
1. Add a `typecheck` script (`tsc --noEmit -p tsconfig.check.json`). Today it is only ever run by hand; `package.json` has dev/build/start/lint only.
2. Add a test runner (Vitest + Testing Library) and a `test` script. The repo has zero test files and no runner in `package.json`.
3. Unit-test the pure logic: `lib/format.ts`, `lib/theme.ts` (`THEME_SCRIPT`/`REVEAL_SCRIPT`), `hooks/useScrollSpy.ts`, `hooks/useReducedMotion.ts`.
4. Component-test `ScrollText`: dim floor per theme, and 0 dimmed spans under `prefers-reduced-motion`. Locks the regression just fixed so it cannot come back silently.
5. Add `.github/workflows/ci.yml` running install → lint → typecheck → test → build on every PR. There is no `.github/` directory today.
6. Make lint fail on warnings (`eslint --max-warnings=0`) and clear the 14 existing `eslint-disable` suppressions (13 in `reactbits/*`, 1 in `lib/scrollFx.ts`).
7. Promote the ad-hoc `pw-qa/` probes into a wired `npm run qa` (`scroll-check.mjs`, `resp-audit.mjs`, `field-contrast.mjs`) so the checks are reproducible instead of one-off.
8. Add a CI job that boots the production build and runs those probes headlessly, so layout/contrast/overflow regressions fail the build.

## B. Dead code & bundle weight (9-14)
9. Do NOT delete the `reactbits/` library: `/lab` (`src/app/lab/page.tsx`) dynamically imports ~50 of them (`import(...)`, which a `from '...'` grep misses). Only `Shuffle` and `Magnet` reach the real page. The open question is whether the `/lab` showcase route ships at all — see 25.
10. Remove the unused `registry/` files (12, no import of any of them anywhere — verified) — but MOVE them out of the repo rather than delete: the whole tree is untracked, so a delete is unrecoverable.
11. Add a bundle-size budget (`@next/bundle-analyzer` + a size check in CI). `three`, `@react-three/*`, `gsap`, `matter-js`, `ogl`, `postprocessing`, `framer-motion` and `motion` are all installed.
12. Audit which heavy deps are actually reached from the page (`three`/r3f/ogl/postprocessing/matter-js) and drop the unreached ones.
13. Confirm `babel-plugin-react-compiler` is actually enabled (it is a devDependency) and measure the win; otherwise remove it.
14. De-duplicate `Carlo_Baclao_Resume.pdf` (one copy at repo root, one in `public/`).

## C. Accessibility (15-21)
15. Add `@axe-core/playwright` (or pa11y) and run it against the home page in both themes, in CI.
16. Audit reduced-motion across every motion component. Only `ScrollText` is proven; `ui/Reveal.tsx`, `ui/Parallax.tsx`, `ui/ScrollScale.tsx`, `ui/Magnetic.tsx`, `ui/PinnedHeading.tsx` and the WebGL layers are unverified.
17. Add a "skip to content" link as the first focusable element.
18. Verify a visible focus ring on every interactive control in both themes (nav island, theme toggle, back-to-top, project dialog, copy-email).
19. Verify the project/CV dialog traps focus, closes on Esc, and restores focus to its trigger.
20. Check colour-only meaning (pills, status dots) carries a text or icon equivalent.
21. Verify heading order (`h1`→`h2`→…) and landmarks (`main`/`nav`/`footer`) hold across all seven sections.

## D. Performance (22-28)
22. Set and enforce a performance budget (LCP / CLS / INP) with Lighthouse CI.
23. Consolidate the per-paragraph ScrollTriggers in `ScrollText` (29 paragraphs = 29 tweens) into one batched trigger.
24. Verify every raster in `public/images` goes through `next/image` with AVIF/WebP and explicit `sizes`.
25. Decide the fate of the `lab/` route — exclude it from the production bundle or confirm it is meant to ship.
26. Audit the two `/api/github/*` routes for caching (`revalidate` / `Cache-Control`) and a graceful fallback when GitHub rate-limits.
27. Measure the WebGL cost (`three/HeroField.tsx`, `ParticleField.tsx`, `FieldBoundary.tsx`) on low-power/mobile and add a capability gate.
28. Confirm the font setup (Geist + JetBrains Mono, `display: 'swap'`, latin subset) has no FOIT and preloads the primary face.

## E. Guardrails / code quality (29-33)
29. Encode the DESIGN.md hard rules as a script (`scripts/design-lint.mjs`): no `h-screen`, no raw hex in components, no `motion.*` entrance variants, no `window.addEventListener('scroll')`, no `bg-background` on `<body>`.
30. Add the served-HTML hard-rule check (`served-check.mjs`: no inline dim opacity, no `opacity:0` entrance on content) to CI.
31. Add a formatter (Prettier or Biome) plus a format check — the repo has none.
32. Add `.gitattributes` (`* text=auto eol=lf`) to end the CRLF noise that makes the whole tree read as modified on this mount.
33. Fix the `react-hooks/exhaustive-deps` suppression in `lib/scrollFx.ts` by correcting the dependency array instead of silencing it.

## F. Content, data & SEO (34-37)
34. Validate `data/*.ts` (`profile`, `projects`, `resume`, `stats`, `navigation`) with Zod so a malformed entry fails the build instead of rendering wrong.
35. Verify `public/sitemap.xml` and `robots.txt` match the deployed domain and carry `lastmod`.
36. Verify the file-based `opengraph-image.tsx` is emitted and referenced as `og:image`/`twitter:image`, resolving through `metadataBase` to the live domain.
37. Add per-section `aria-label`s and a version/"last updated" stamp on the CV.

## G. Repo hygiene & resilience (38-40)
38. Prune untracked cruft (`.next-prod/`, `.next-build/`, `hermes-page.html`, `skills-lock.json`, `cp-*.log`, `%USERPROFILE%/`) and extend `.gitignore` (`.next-prod`, `.hermes`, `.agents`, `.codebuddy`, `pw-qa/`).
39. Add `app/error.tsx`, `app/global-error.tsx` and a `loading.tsx` skeleton — only `not-found.tsx` exists today.
40. Keep this backlog as `BACKLOG.md` and review it at the start of each work session; tick items off in place (working tree only, never committed).
