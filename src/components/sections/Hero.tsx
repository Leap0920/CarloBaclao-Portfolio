'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowUpRight } from 'lucide-react';
import { ScrollExit, VelocityMarquee } from '@/components/ui/Cinematic';
import { CvPreviewDialog } from '@/components/ui/CvPreviewDialog';
import { Magnetic } from '@/components/ui/Magnetic';
import { profile } from '@/data/profile';
import { focusAreas } from '@/data/resume';

/**
 * The hero's visual object: the WebGL particle field. It is the scene the
 * hero was always meant to carry - the old Jupiter shader files were deleted
 * in its favour.
 *
 * It is loaded with `ssr: false` and mounted only once the browser is idle
 * (see the effect in `Hero`), so neither the server pass nor the first
 * hydration pays to parse or run three.js, and the pure-CSS `hero-rise`
 * entrance is never gated behind a bundle. The scene gates its own frame
 * loop (demand frameloop, an in-view IntersectionObserver and a tab-visibility
 * check) and stops rendering entirely when it leaves the viewport, so it
 * costs nothing while off screen.
 */
const HeroField = dynamic(() => import('@/components/three/HeroField'), { ssr: false });

/**
 * The name, split once so the surname can carry the display emphasis.
 * `profile.name` stays the single source of truth; nothing here is authored,
 * and a one-word name would simply render unemphasised.
 */
const [givenName, ...surnameParts] = profile.name.split(' ');
const surname = surnameParts.join(' ');

/**
 * The hero: the opening frame of a long scroll, and the most important frame
 * on the page.
 *
 * COMPOSITION - an asymmetric split, not a centred blob. The copy is hard left
 * and occupies 7 of 12 columns; the remaining 5 are stage, which is where the
 * `.hero-glow` utility already pools its ambient ember (its lift sits at 74%
 * across). That utility is the whole ambient visual: a token-based dot lattice
 * plus an ember pool, masked away from the copy so it never touches contrast.
 * The previous build stacked a client-only WebGL particle field beside the
 * copy; that is gone. It was several hundred kilobytes of three.js on the
 * critical frame for an effect the CSS already gives, and the brief asks for
 * the ambient layer to stay cheap. `.hero-glow` animates nothing and listens
 * to nothing.
 *
 * TEXT BUDGET - four elements, exactly: the role label, the name, the pitch
 * and the CTA. The old quick-facts strip is deleted rather than moved; a
 * feature list is what the dedicated sections below the hero are for. The
 * role label is the page's hero eyebrow.
 *
 * ENTRANCE - a pure-CSS keyframe, and specifically NOT the `Reveal`/`Stagger`
 * mechanism the sections use. `Reveal` writes its reveal in a useEffect, so its
 * content stays invisible until React hydrates; measured on a 4x-throttled
 * phone that held this name at opacity 0 for 5,102ms (LCP 5,512ms). The hero
 * carries the LCP element, so it may not wait on a bundle: `.hero-rise` starts
 * at first paint, its stagger is `animation-delay`, and nothing can gate it.
 * The shared `.rise` heading keyframes are still not used here, because they
 * run off a `view()` timeline tuned for blocks entering from below the fold,
 * which would leave an above-the-fold hero part-faded.
 */
export function Hero() {
  const [cvOpen, setCvOpen] = useState(false);
  const cvTriggerRef = useRef<HTMLButtonElement>(null);

  // The canvas mounts only once the browser is idle (or 1500ms has passed),
  // so hydration and the pure-CSS entrance finish first and neither is gated
  // behind three.js. `requestIdleCallback` is not universal, hence the
  // `setTimeout(1)` fallback; both paths set the same flag, so the field is
  // present once the page settles. No per-frame work lives here - this runs
  // exactly once.
  const [fieldReady, setFieldReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (typeof w.requestIdleCallback === 'function') {
      const handle = w.requestIdleCallback(() => setFieldReady(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(handle);
    }
    const handle = window.setTimeout(() => setFieldReady(true), 1);
    return () => window.clearTimeout(handle);
  }, []);

  return (
    <section
      id="home"
      data-snap
      className="hero-glow relative scroll-mt-24 overflow-hidden"
    >
      {/* The whole frame departs through `ScrollExit`: as the reader scrolls
          on, the composition scales a hair, lifts and fades to 45%. It rests
          at its fully-visible state on load (its `from` values are the resting
          state) and only moves once the reader has actually scrolled, so
          nothing here is gated behind a bundle. Transform and opacity only. */}
      <ScrollExit to={0.96} fade={0.45} lift={-56}>
        {/* The frame. `pt-[var(--space-section)]` is the page's one vertical
            rhythm token, and it is applied from `lg` up only. Below `lg` the
            content is top-aligned, and the old 144px of dead space at the top
            of a phone screen existed for one reason: clearing the fixed nav
            island. The island is gone, so the hero now owns the top edge and
            the padding is a deliberate 96px opening frame instead of a
            clearance. `min-h-[100dvh]`, never `h-screen`, so a phone browser's
            dynamic chrome cannot crop the frame.

            MOBILE FALLBACK (<768px): the 12-column split below collapses to a
            single stacked column; the frame stays a full `100dvh` tall but its
            content is top-aligned rather than vertically centred (a centred
            column taller than a short screen would clip its own eyebrow); and
            the display name wraps rather than overflowing, so the frame stays
            inside 320px. */}
        <div className="relative mx-auto flex w-full max-w-6xl flex-col px-5 pt-24 pb-16 sm:px-8 sm:pt-28 lg:min-h-[100dvh] lg:justify-center lg:pt-[var(--space-section)] lg:pb-24">
          {/* The hero's visual object: the WebGL field, absolutely placed so
              it adds no layout height at any width (the page must not grow
              taller). From `lg` up it occupies the right-hand stage - the copy
              owns the left 7 of 12 columns - so the text and the field never
              share a cell. On narrower viewports it sits behind the copy,
              where the shader's copy-exclusion rectangle (fed the real
              measured rect via `data-hero-copy`) dims any particle under the
              text; the field uses NormalBlending, so it composites as ink over
              the bone page rather than as additive light. The layer is inert -
              `pointer-events-none` and `aria-hidden` - and the scene reads the
              pointer from its own window listener, so parallax still works
              without the canvas ever capturing a click. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 lg:left-[58.333%]"
          >
            {fieldReady ? <HeroField className="h-full w-full" /> : null}
          </div>

          {/* One grid, two zones. The copy takes the left 7 columns; the right
              5 are the ambient stage. A single grid child leaves the other
              columns empty by construction, so no placeholder element is
              needed and the split stays honestly asymmetric. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center">
            {/* `relative z-10` keeps the copy above the field layer, and
                `data-hero-copy` hands the scene the real measured rect to
                keep clear (see the shader's copy-exclusion zone). */}
            <div className="relative z-10 lg:col-span-7" data-hero-copy>
              <div>
                {/* The page's hero eyebrow. `text-accent` rather than the
                    `text-faint` micro-label step: the hero carries the
                    `.hero-glow` ambient lift behind this line, and that lift
                    lightens the local backdrop enough to pull `faint` down to
                    4.44:1 at 11px. Ember measures 6.2:1 there, and it also
                    matches the eyebrow structure in `SectionHeading`. */}
                <div className="hero-rise flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-accent" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                    {profile.role}
                  </span>
                </div>

                {/* The only h1 on the page, real selectable type at display
                    scale. The surname is italicised for emphasis: the same
                    family, never a serif injected into the sans headline.
                    This is the LCP element, so it takes the CSS entrance and
                    is on screen from the first paint - see the ENTRANCE note
                    above. */}
                <div className="hero-rise hero-rise-2">
                  <h1 className="mt-5 font-display text-display leading-display tracking-display text-foreground">
                    {givenName}{' '}
                    <span className="italic">{surname}</span>
                  </h1>
                </div>

                <p className="hero-rise hero-rise-3 mt-5 max-w-[48ch] text-lg leading-relaxed text-muted sm:text-xl">
                  {profile.pitch}
                </p>

                {/* One intent, one label, page-wide. The CV is the only
                    affordance here and the nav deliberately carries no second
                    "Contact" button; the download lives inside the dialog.

                    The hover lean is CSS only. The button names the `scale`
                    property in its transition, not `transform`, because
                    Tailwind v4 writes `scale-*` and `translate-*` to the
                    `scale` and `translate` properties, so a
                    `transition-transform` would leave the hover state instant. */}
                <div className="hero-rise hero-rise-4 mt-8">
                  {/* The CTA leans toward the pointer. `Magnetic` is transform
                      only and a no-op under reduced motion, so it adds no
                      resting state and no motion when motion is off. */}
                  <Magnetic>
                    <button
                      ref={cvTriggerRef}
                      type="button"
                      onClick={() => setCvOpen(true)}
                      aria-haspopup="dialog"
                      className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-accent pl-6 pr-1.5 text-sm font-semibold text-on-accent transition-[scale] duration-500 ease-fluid hover:scale-[1.02] active:scale-[0.98]"
                    >
                      View CV
                      <span
                        aria-hidden="true"
                        className="grid h-9 w-9 place-items-center rounded-full bg-on-accent/15 transition-[translate,scale] duration-500 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105"
                      >
                        <ArrowUpRight size={16} />
                      </span>
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The closing band: the practice areas as one run of display type.
            It is the hero's gesture toward the sections below and it is the
            ONLY marquee on the page. `VelocityMarquee` renders its children
            twice (the second copy is `aria-hidden`), so the loop is seamless;
            it is `overflow-hidden` and transform-only, so it costs one clipped
            row at every width. The separator is a mono slash in ember, not a
            middle dot, which the design rations. Each item carries its own
            trailing space so the seam between the two copies matches the gap
            between items inside a copy. */}
        <div className="mx-auto w-full max-w-6xl px-5 pb-[var(--space-section)] sm:px-8">
          <VelocityMarquee baseVelocity={10} direction={1}>
            {focusAreas.map((area) => (
              <span key={area.title} className="flex shrink-0 items-center gap-16 pr-16">
                <span className="whitespace-nowrap font-display text-3xl font-medium tracking-tight text-muted sm:text-4xl">
                  {area.title}
                </span>
                <span aria-hidden="true" className="font-mono text-3xl text-accent sm:text-4xl">
                  /
                </span>
              </span>
            ))}
          </VelocityMarquee>
        </div>
      </ScrollExit>

      {/* There is deliberately NO scroll cue: the reader knows what scrolling
          is, and the taste rules ban them outright. */}

      <CvPreviewDialog
        open={cvOpen}
        onClose={() => setCvOpen(false)}
        triggerRef={cvTriggerRef}
      />
    </section>
  );
}
