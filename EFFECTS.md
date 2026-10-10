# EFFECTS.md — 40 replacement effects & layouts for Projects, Tools, Certificates

What this is: options to REPLACE the current effect + layout in the three sections the client
called out. Each entry names the effect, the layout change, how it gets built, and what it costs
against the rules below. Nothing here is committed — per DESIGN.md, working tree only.

## Shipped so far

**Projects — item 3 (split frame + browser chrome) + item 4 (cover pan). DONE.**

The full-bleed reel is gone. Each featured project is now a two-column frame: the copy in one
column, the product in a browser window in the other, sides alternating down the section. The
window is a fixed 16:10 frame, which is what finally makes the cover pan read — the same
`Parallax` drift was nearly invisible inside a 100vh frame.

Three items were REJECTED for Projects, and the reasons matter because they constrain the other
two sections as well:

- **Item 1 (sticky stack deck) — rejected: `Experience` already owns that skeleton.** Two sections
  that pin and cover each other on one page reads as one trick used twice, and `Projects.tsx`'s own
  header requires the three heaviest sections to never share a skeleton.
- **Item 2 (index-first, image-on-demand) — rejected: it makes Projects list-dominant**, which is
  the skeleton `Certificates` already owns.
- **Item 6 (year timeline) — rejected: chronology is `Experience`'s territory too.**

Side benefit of the rewrite: **no text sits over a photograph anywhere in Projects any more**, so
the scrim is deleted and an entire class of contrast risk went with it.

Measured after the change (all green): typecheck 0 · tests 22/22 · `scroll-check` ALL PASS
(11/11 sections animating, hydration PASS, nothing invisible) · `resp-audit` every budget met
(projects 3,337px @320 against a 4,000px cap; no overflow at any width) · `projects-check` 18/18
(chrome label 4.89:1, pan layer 1.2x the window, sides alternating, all 4 covers loading).

## What is there now (so "replace" is well defined)

- **Projects** — `ReelScene`: full-bleed `min-h-[88dvh]` frames, cover with `object-cover`, a token
  scrim, text pinned to the bottom; `ScrollScale` grows/brightens the cover, `Parallax` drifts it.
  Below `md` the text drops below a 16:9 box and frames become content-height. Plus an index and a
  portal dialog. Height: 3,849px @1440 / 2,732px @320.
- **Tools** — "Sticky domain rail + large-type editorial lines": left rail of 4 domains warmed to
  ember by an IntersectionObserver; right column of editorial lines (display name, mono level label,
  hairline depth bar), ember hairline on hover. Height: 3,417px @1440 / 1,965px @320.
- **Certificates** — "Credits roll": text only, 23 credentials grouped by issuer, every name a
  `ScrollText` word scrub, 3 featured ones a size up with an ember tick. No images, no cards.
  Height: 1,710px @1440 / 2,419px @320.

## The rules these have to live inside (from DESIGN.md + measured probes)

1. **Entrances are CSS, never `motion.*` variants** — Framer's `initial` writes inline `opacity: 0`
   that no CSS can override.
2. **Never `window.addEventListener('scroll')`** — use `Cinematic.tsx` (`StickyStack`,
   `StickyStackItem`, `ScrollSkew`, `ScrollExit`, `VelocityMarquee`), `scrollFx.ts` (`useScrollFx`),
   `ui/Parallax`, `ui/ScrollScale`, `ui/ScrollText`.
3. **One marquee per page, maximum** — the hero's focus-area band owns it.
4. **`HorizontalRail` and `ScrollSettle` are DELETED** — a horizontal scroll rail is banned unless
   that decision is revisited.
5. **Scroll snapping is `proximity`, never `mandatory`**, desktop-only, off under reduced motion.
   Sections opt in with `data-snap` (already set).
6. **Anything above the fold must not wait on hydration** — the hero LCP defect measured at 5,512ms
   and fixed to ~1,912ms. Do not reintroduce a JS-gated entrance on the critical frame.
7. **Contrast is measured against the ACTUAL rendered backdrop, 4.5:1.** An ambient layer under text
   costs ratio.
8. **Never dim with `opacity`.** The ScrollText defect: 0.18 opacity measured 1.2:1 light / 2.0:1
   dark. Dim with a token colour (`text-muted`) instead, which is contrast-safe by construction.
9. **Durations: 500-700ms transform, 300ms colour.** Transform + opacity only, never width/height/top.
10. **No scroll cues, no hover-only affordances, 44x44 tap floor.**

Cost key: `[css]` styling only · `[prim]` an existing primitive, mostly wiring · `[new]` a new
component · `[asset]` needs new media · `[revisit]` collides with a rule above and needs a decision.

---

## A. Projects (1-14)

1. **Sticky stack deck** — each project pins under the nav and the next slides over it, like a deck
   being dealt, instead of four full-bleed scenes scrolling past. `[prim]` `StickyStack` /
   `StickyStackItem`. Keeps the cover, drops the reel's dead space.
2. **Index-first, image-on-demand** — the section becomes a typographic index (name, year, stack,
   one line, no images); pointing at or focusing a row raises a floating cover preview that follows
   the pointer. `[new]` + `[prim]` `ImageTrail` / `TiltedCard`. Cuts height hard; needs a keyboard
   equivalent for the preview.
3. **Split frame: copy left, browser chrome right** — sticky copy column beside the cover set in a
   `rounded-card` frame with a window bar, so each project reads as a product screen rather than a
   photograph. `[css]` + `[prim]` `Parallax`.
4. **Cover pan (scroll-scrubbed scan)** — the cover is a tall crop that translates inside an
   `overflow-hidden` frame as you scroll, so you scan the screenshot instead of seeing one static
   crop. `[prim]` `useScrollFx`. Cheap, compositor-only, reads as real footage.
5. **Bento** — one hero tile plus smaller tiles on uneven spans, hairline borders, `rounded-card`,
   each with its own aspect. `[new]` + `[prim]` `MagicBento` exists in reactbits. Dense and modern;
   watch the 2,000px-per-section budget at 320px.
6. **Year timeline with in-place expand** — projects on a vertical ember spine with year nodes; a row
   expands in place (real `<button>` + region) instead of opening the portal dialog. `[new]`.
7. **Scroll-snap panels** — each project is a snap stop using the `data-snap` opt-in already present,
   so the reel gains a tactile stop per project. `[css]`. Mostly free; proximity only.
8. **Metric-forward cards** — each project leads with 1-3 REAL numbers (commits, latency, users) as
   display type and the cover becomes a small inset. `[new]`. Data-first; needs real data or it is
   decoration.
9. **Layered depth parallax** — cover, a floating chip layer and the title each move at different
   `Parallax` speeds inside one frame, for depth without WebGL. `[prim]`.
10. **Magnetic tilt + glare** — the cover tilts toward the pointer with a specular sweep. `[prim]`
    `TiltCard` + reactbits `GlareHover`. Tactile, and no new assets.
11. **Clip-path wipe reveal** — the cover wipes in on arrival via `clip-path` rather than fading, so
    the section reads as deliberate rather than merely faded. `[css]`. Compositor-friendly.
12. **Accordion case study** — each project collapses to a one-line summary and opens to
    problem / approach / outcome in three beats. `[new]`. Turns the reel into a reading section.
13. **Horizontal scroll rail** — a sticky viewport translating a horizontal track off vertical scroll.
    `[revisit]` **This is the deleted `HorizontalRail`.** Strong effect, but it needs the DESIGN.md
    deletion reversed on purpose, and it fights the mobile height budget.
14. **Sticky index + sliding detail pane** — a sticky left index of project names and a right pane
    whose content swaps as you scroll past each one. `[new]`. Same shape as the Tools rail, so the
    page would echo itself — decide whether that is cohesion or repetition.

## B. Tools (15-27)

15. **Skill matrix / heat grid** — replace the editorial lines with a skills x domains grid, cells
    shaded by level. `[new]`. Very scannable; shading MUST be a token colour ramp, not opacity
    (rule 8), and the level still needs its text label.
16. **Filter chips + card grid** — real filter buttons (by domain, by level) over a grid of
    `rounded-card` tiles carrying icon, name and level bar. `[new]`. Adds genuine interactivity and
    cuts height; the chips are the first real controls in this section.
17. **Level-grouped ladder** — regroup by proficiency instead of domain: "Daily driver / Working /
    Learning" as three bands. `[css]`. No new components, and it reorders the story around strength.
18. **Terminal block** — each domain as a shell session (`$ stack list frontend`) with mono type and
    a caret, skills as output lines. `[new]`. Fits the existing mono-label language; a fake terminal
    is a cliche unless the output is real data, which here it is.
19. **Datasheet / spec table** — mono columns with hairline rules, tabular numerals, zero icons.
    `[css]`. Cheapest to build, best contrast, calmest — a strong "remove the effect" answer.
20. **Fuel-gauge rows** — keep the data, change the layout: the depth bar becomes the row's own
    background fill with the name over it, so the level is spatial rather than a thin tick. `[css]`.
21. **Icon wall with expand-on-focus** — a dense wall of glyphs where the focused one expands to show
    name + level. `[new]`. Needs true keyboard parity, not hover-only (rule 10).
22. **Domain bento** — four cards, each with its skill count and its top three as large type.
    `[css]` + `[prim]`. Shorter and more scannable than 32 editorial lines.
23. **Accordion by domain** — domains collapsed to a count, expanding to the lines. `[new]`. Directly
    attacks the 3,417px @1440 height.
24. **Scroll-linked focus line** — the skill nearest the viewport centre goes full ink while the rest
    sit at `text-muted`; the same dim/bright language as Certificates, done with colour not opacity.
    `[prim]` `useScrollFx`. On-brand and contrast-safe by construction.
25. **Radar chart per domain** — an SVG radar per domain with the level polygon. `[new]`. Must ship a
    text equivalent; a chart is the worst offender for colour-only meaning.
26. **Progress spine rail** — the sticky rail becomes a vertical ember spine that fills as you pass
    each domain, doubling as a scoped reading-progress indicator. `[prim]`. Keeps the rail but gives
    it a job.
27. **Proficiency counters** — `ui/Counter` (currently orphaned) counts up real totals ("32 skills,
    4 domains, 5 daily drivers") as the section opener before the lines. `[prim]`. Wires an orphan
    back in and gives the section a spine.

## C. Certificates (28-40)

28. **Kill the scrub, keep the hierarchy** — drop `ScrollText` entirely: featured credentials at
    display scale, the rest a step down, everything at full ink. `[css]`. The calmest option and it
    removes the dim-state contrast risk at the root.
29. **Credits crawl** — one continuous vertical crawl translated by scroll, instead of per-line word
    scrub. `[prim]` `useScrollFx`. Keeps the cinematic idea with far less per-word work.
30. **Issuer spine + year timeline** — credentials on a vertical timeline with year nodes and the
    issuer as the spine label. `[css]`. Turns 23 loose names into a chronology.
31. **Year-band grouping with sticky mini-headers** — regroup by year rather than issuer, years as
    sticky headers. `[css]`. Same data, different story.
32. **Mono ledger table** — Issuer / Credential / Year as a real table with tabular numerals.
    `[css]`. The best accessibility answer; zero motion, zero contrast risk.
33. **Plate grid** — finally render the 23 scans as small framed plates with type as captions.
    `[asset]` `[revisit]`. **Reverses a client decision**: the brief asked for credentials as type
    and `CertificationGallery` was deleted for it. The files are already deployed (4.5MB), so the
    cost is page weight, not new assets. Needs the client's call.
34. **Lightbox gallery** — plates that open the full scan in the dialog primitive. `[new]`
    `[revisit]`. Same client-decision caveat as 33, and it reintroduces a modal to trap focus
    properly (open item 19 in BACKLOG.md).
35. **Scroll-pinned stack by issuer** — one issuer pins, the next slides over it. `[prim]`
    `StickyStack`. Gives the section a beat per issuer.
36. **Issuer watermark groups** — the issuer name as a large low-alpha watermark behind each group.
    `[css]`. Contrast-check the type sitting over it (rule 7) — this is exactly the kind of ambient
    layer that cost ratio on the hero.
37. **Verified chips + outbound links** — a mono `verified` chip per credential and a real link where
    a verification URL exists. `[new]`. Adds utility rather than decoration; needs real URLs.
38. **Centre-line emphasis** — the credential nearest the viewport centre is full ink, the rest
    `text-muted`. `[prim]`. The cinematic feel with legal contrast, using colour not opacity.
39. **Two-column masonry with featured anchors** — featured credentials span both columns as anchors
    and the rest flow around them. `[css]`. Breaks the current even two-column rhythm.
40. **Summary counter opener** — `ui/Counter` counts up 23 credentials / 5 issuers / N years as the
    section opens, then the list follows. `[prim]`. Pairs naturally with 27 and wires the same
    orphan.

---

## Reading the list

- **Cheapest real change, biggest height win:** 19 (datasheet), 23 (accordion), 2 (index-first),
  28 (kill the scrub).
- **Most "new" while staying inside the rules:** 1, 4, 6, 10, 24, 30.
- **Needs a rule or client decision first:** 13 (banned primitive), 33/34 (reverses the type-only
  brief), 35/37 (needs assets/URLs).
- **Reuse what is already installed:** `StickyStack`, `Parallax`, `ScrollScale`, `useScrollFx`,
  `TiltCard`, `Counter`, and reactbits `MagicBento` / `GlareHover` / `ImageTrail` / `TiltedCard` —
  all already in the tree, so those options cost wiring, not dependencies.
