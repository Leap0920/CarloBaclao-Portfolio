'use client';

import gsap from 'gsap';
import { useScrollFx } from '@/lib/scrollFx';

/**
 * STAGE BACKDROP - the page's scroll-linked scene lighting.
 *
 * The client asked for the background itself to change as the reader scrolls,
 * section to section. This is that, in two layers:
 *
 *   1. THE STAGE TONE (the headline effect). A stack of full-viewport tone
 *      layers, each a single pre-rendered stage tone, crossfaded by animating
 *      ONLY their `opacity`. The stage colour a reader sees therefore shifts as
 *      they move down the page, section to section. The bottom layer is opaque
 *      and is the default stage tone, so with JavaScript disabled, under
 *      reduced motion, or before the bundle arrives the page still paints a
 *      solid, correct stage rather than showing through to nothing.
 *   2. THE LIGHT POOLS (the secondary effect). Large, pre-rendered soft radial
 *      pools whose warmth, vertical position and intensity drift over the tone.
 *      They sit on top of the tone layers.
 *
 * WHY OPACITY CROSSFADE AND NOT A COLOUR TWEEN
 * A full-viewport gradient whose background colour or background-position is
 * animated forces a repaint of the whole layer every frame, which is the jank
 * to avoid. A stack of pre-rendered opaque layers crossfaded by `opacity` is
 * compositor-only, and it still gives a real, visible colour change. The pools
 * likewise animate only `transform` and `opacity`. Nothing here animates a
 * background, a filter, or a layout property on scroll.
 *
 * WHY IT IS A SIBLING OF THE CLIP WRAPPER
 * It is mounted in `layout.tsx` next to the `.grain` div, not inside the
 * `overflow-clip` wrapper. A `position: fixed` layer inside an `overflow: clip`
 * ancestor is one transform away from being clipped along with the content,
 * which is why the grain is a sibling too. (The nav island used to be the third
 * sibling; it is gone with the nav.)
 *
 * WHY A NEGATIVE Z-INDEX (and the body background change)
 * The layer sits at `z-index: -10` so it paints above the canvas and below
 * every piece of content. `body` no longer paints its own opaque
 * `bg-background`; the html canvas keeps the stage colour and this layer paints
 * above it. That is required, not cosmetic: an opaque `body` background paints
 * above a negative z-index child (verified in the browser), so the layer would
 * be invisible. With `body` transparent the layer paints above the html canvas
 * and below all in-flow content.
 *
 * TOKENS, SO THERE IS NO RAW HEX IN THIS FILE
 * The stage tones come from `--background` and `--surface-2`, plus two
 * intermediate tones `--stage-warm` and `--stage-deep` defined in globals.css
 * (the palette has nothing lighter than `--background` and nothing between it
 * and `--surface`). The warm pools are built from `--accent`; the counter pool
 * from `--foreground` at very low alpha. The tones stay inside the warm bone
 * family, so this layer shifts warmth, position and intensity only and never
 * inverts a section.
 *
 * REDUCED MOTION AND THE STATIC STATE
 * All scroll work goes through `useScrollFx`, which does not run on the server,
 * does not run under `prefers-reduced-motion`, and reverts its GSAP context on
 * unmount. Nothing here reads the scroll directly and no scroll listener is
 * added. Under reduced motion the hook never runs, so the layer keeps exactly
 * what the CSS gives it: the `home` frame, with the warm tone lit and the
 * primary pool high and to the right. That is a deliberate, finished frame, and
 * the opaque base layer guarantees it is a solid stage, not a hole.
 *
 * THE ARC (one frame per section, scrubbed continuously)
 *
 *   section          stage tone                pool A (warm)        pool C (counter)
 *   home             warm, lit                 high right, bright   centred, soft
 *   projects         lifted neutral            high, grows          lifts
 *   techstack        settling to base          lower, smaller       lower
 *   experience       lifted, cooling           centred, medium      centred
 *   education        deepening                 low, dimmer          low
 *   certifications   deep, DIMMEST             low, dimmest         low, dimmest
 *   contact          warmest, brightest        low, warmest         centred, warmest
 *
 * HORIZONTAL POSITION IS FIXED. Each pool has one constant x centre (its `left`,
 * applied in CSS and never animated), and every tween moves it on `yPercent`,
 * `scale` and `opacity` only. There is no `xPercent` anywhere: the pools drift
 * vertically and breathe, they never sweep sideways. An earlier build swept them
 * several hundred pixels left and right as the reader scrolled, and that
 * sideways sweep is the motion the client rejected, so the constant x was
 * recomposed to sit inside the content column (10%..90% at 1440) instead of
 * swinging out toward the viewport edges.
 *
 * The stage darkens and deepens through the certifications credits roll (the
 * most shadowed moment on the page) and warms and lifts again for the closing
 * contact frame.
 */

/** The seven ScrollTrigger targets, in page order. */
const SECTION_IDS = ['home', 'projects', 'techstack', 'experience', 'education', 'certifications', 'contact'] as const;

/** The tone layers that crossfade. `base` is separate and always opaque. */
type ToneKey = 'warm' | 'lift' | 'deep';

interface ToneLayer {
  key: ToneKey;
  /** Token reference, resolved per theme by globals.css. No hex here. */
  color: string;
}

const TONE_LAYERS: ToneLayer[] = [
  { key: 'warm', color: 'var(--stage-warm)' },
  { key: 'lift', color: 'var(--surface-2)' },
  { key: 'deep', color: 'var(--stage-deep)' },
];

/** One frame of tone opacities per section, home first. The base layer is
 *  always at opacity 1, so these are the opacities of the layers above it. */
const TONE_STATES: Array<Record<ToneKey, number>> = [
  { warm: 0.22, lift: 0.06, deep: 0 }, // home
  { warm: 0.3, lift: 0.55, deep: 0 }, // projects
  { warm: 0.12, lift: 0.4, deep: 0.06 }, // techstack
  { warm: 0.18, lift: 0.3, deep: 0.1 }, // experience
  { warm: 0.06, lift: 0.22, deep: 0.18 }, // education
  { warm: 0, lift: 0, deep: 0.85 }, // certifications
  { warm: 0.9, lift: 0.15, deep: 0 }, // contact
];

/** One pool's state for one section. `dy` is the vertical offset from its
 *  static home centre, as a percentage of the pool's own size; `s` is scale; `o`
 *  is opacity. There is deliberately no horizontal term: a pool's x is constant
 *  for the whole page (see `left` below), so no state can move it sideways. The
 *  home entry is the identity so the CSS default and the first tween agree. */
interface PoolState {
  dy: number;
  s: number;
  o: number;
}

interface Pool {
  key: string;
  /** Constant x centre as a percentage of the viewport, applied in CSS (static).
   *  Never animated: this one value is the pool's horizontal position for the
   *  whole page. */
  left: number;
  /** Vertical home centre, as a percentage of the viewport. `dy` states drift
   *  around it. */
  top: number;
  /** Pool diameter, in vmax. Large, so the falloff is soft and never reads as a blob. */
  size: number;
  /** Home opacity, applied in CSS (static). */
  opacity: number;
  /** Static, pre-rendered gradient built only from design tokens. */
  background: string;
  /** One state per entry in SECTION_IDS, home first. */
  states: PoolState[];
}

/** Accent at a low alpha, as a token-derived colour. No hex anywhere. */
const warm = (pct: number) => `color-mix(in oklab, var(--accent) ${pct}%, transparent)`;
/** The counter tone: the foreground token at a very low alpha. */
const counter = (pct: number) => `color-mix(in oklab, var(--foreground) ${pct}%, transparent)`;

const POOLS: Pool[] = [
  {
    key: 'warm-primary',
    left: 70,
    top: 22,
    size: 72,
    opacity: 0.72,
    background: `radial-gradient(closest-side, ${warm(22)}, ${warm(8)} 46%, transparent 78%)`,
    states: [
      { dy: 0, s: 1, o: 0.72 },
      { dy: 4, s: 1.14, o: 0.64 },
      { dy: 16, s: 0.88, o: 0.5 },
      { dy: 6, s: 1.02, o: 0.56 },
      { dy: -12, s: 0.92, o: 0.46 },
      { dy: 22, s: 0.8, o: 0.18 },
      { dy: 14, s: 1.2, o: 0.82 },
    ],
  },
  {
    key: 'warm-companion',
    left: 30,
    top: 72,
    size: 54,
    opacity: 0.36,
    background: `radial-gradient(closest-side, ${warm(18)}, ${warm(6)} 50%, transparent 76%)`,
    states: [
      { dy: 0, s: 1, o: 0.36 },
      { dy: -8, s: 1.05, o: 0.34 },
      { dy: 6, s: 0.92, o: 0.28 },
      { dy: -2, s: 1, o: 0.32 },
      { dy: -10, s: 0.96, o: 0.3 },
      { dy: 12, s: 0.86, o: 0.14 },
      { dy: 4, s: 1.08, o: 0.52 },
    ],
  },
  {
    key: 'counter',
    left: 50,
    top: 44,
    size: 84,
    opacity: 0.32,
    background: `radial-gradient(closest-side, ${counter(7)}, ${counter(2.5)} 50%, transparent 80%)`,
    states: [
      { dy: 0, s: 1, o: 0.32 },
      { dy: -4, s: 1.08, o: 0.3 },
      { dy: 8, s: 0.98, o: 0.26 },
      { dy: 0, s: 1.04, o: 0.28 },
      { dy: -6, s: 1, o: 0.3 },
      { dy: -8, s: 1.12, o: 0.14 },
      { dy: 6, s: 1.06, o: 0.42 },
    ],
  },
];

export function StageBackdrop() {
  const scope = useScrollFx<HTMLDivElement>(() => {
    const root = scope.current;
    if (!root) return;

    // The section targets. If the page shape has changed, leave the static
    // home frame alone rather than scrubbing against a moving denominator.
    const found = SECTION_IDS.map((id) => document.getElementById(id));
    if (found.some((section) => section === null)) return;
    const sections = found as HTMLElement[];

    // Map each section's centre to a fraction of the page's scroll range, so a
    // frame is reached when its section is actually in front of the reader
    // rather than split evenly across the page.
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const clamp = gsap.utils.clamp(0, 1);
    const centers = sections.map((section) => {
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      return clamp((top + section.offsetHeight / 2 - window.innerHeight / 2) / maxScroll);
    });

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        // The whole document is the scrub range: top of page to bottom of page.
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        // A short catch-up so the lighting trails the scroll by a breath.
        scrub: 0.45,
      },
    });

    // Pad the timeline to a total duration of exactly 1, so every position
    // below is a page-progress fraction rather than a running sum of seconds.
    timeline.to({}, { duration: 1 }, 0);

    // 1. The stage tone layers: opacity crossfade only, never a colour tween.
    for (const tone of TONE_LAYERS) {
      const node = root.querySelector<HTMLElement>(`[data-tone="${tone.key}"]`);
      if (!node) continue;

      for (let i = 1; i < centers.length; i += 1) {
        const start = centers[i - 1];
        const duration = Math.max(0.001, centers[i] - start);
        timeline.fromTo(
          node,
          { opacity: TONE_STATES[i - 1][tone.key] },
          { opacity: TONE_STATES[i][tone.key], duration, immediateRender: false },
          start,
        );
      }
    }

    // 2. The drifting light pools: vertical drift, scale and opacity only. No
    //    xPercent anywhere, so a pool's horizontal position is a constant.
    for (const pool of POOLS) {
      const node = root.querySelector<HTMLElement>(`[data-pool="${pool.key}"]`);
      if (!node) continue;

      for (let i = 1; i < centers.length; i += 1) {
        const from = pool.states[i - 1];
        const to = pool.states[i];
        const start = centers[i - 1];
        const duration = Math.max(0.001, centers[i] - start);

        // fromTo with immediateRender off: each layer holds its CSS home state
        // until the playhead reaches this segment, so progress 0 is exactly the
        // reduced-motion frame.
        timeline.fromTo(
          node,
          { yPercent: from.dy, scale: from.s, opacity: from.o },
          { yPercent: to.dy, scale: to.s, opacity: to.o, duration, immediateRender: false },
          start,
        );
      }
    }
  }, []);

  return (
    <div
      ref={scope}
      aria-hidden="true"
      data-stage-backdrop=""
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden"
    >
      {/* The stage itself. Opaque and always on: with no JavaScript, under
          reduced motion, or before the bundle arrives, this is the solid stage
          colour. The tone layers above it crossfade by opacity only. */}
      <div className="absolute inset-0" style={{ background: 'var(--background)' }} />

      {TONE_LAYERS.map((tone) => (
        <div
          key={tone.key}
          data-tone={tone.key}
          className="absolute inset-0"
          style={{
            background: tone.color,
            opacity: TONE_STATES[0][tone.key],
            willChange: 'opacity',
          }}
        />
      ))}

      {/* The light pools, on top of the tone layers. Static pre-rendered
          gradients; only vertical transform and opacity ever move.

          THINNED TO 30% PERMANENTLY. On the bone stage the pools are built
          from the accent, which is dark there, so they read as warm shadow
          rather than as light and pull the backdrop toward the text.
          Measured at 320px they are the dominant contrast cost under the
          hero's 11px label, which is why they were thinned in light mode
          only while a dark mode still existed. Light is the only mode now,
          so the thinning is unconditional: this is a STATIC multiplier that
          GSAP never touches (the per-pool opacity animation still runs,
          scaled), and it is deliberately NOT positioned, so the pools'
          percentage x/y still resolve against the fixed root and the
          horizontal offset stays the constant it always was. Do not raise
          it back to 1. */}
      <div className="opacity-30">
        {POOLS.map((pool) => (
          <div
            key={pool.key}
            data-pool={pool.key}
            style={{
              position: 'absolute',
              left: `${pool.left}%`,
              top: `${pool.top}%`,
              width: `${pool.size}vmax`,
              height: `${pool.size}vmax`,
              marginLeft: `${-pool.size / 2}vmax`,
              marginTop: `${-pool.size / 2}vmax`,
              opacity: pool.opacity,
              backgroundImage: pool.background,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>
    </div>
  );
}
