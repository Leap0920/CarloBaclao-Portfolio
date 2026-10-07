'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { JupiterCanvas } from './JupiterCanvas';

/**
 * The hero graphic: Jupiter, drawn flat.
 *
 * This replaced a WebGL scene. The scene was a ~870 KB chunk that a phone could
 * never afford, so below 1024px the hero quietly fell back to a static
 * composition and most visitors never saw the object at all. Everything here is
 * markup plus two SVG filters, so the same graphic renders on every device,
 * server-side, with no chunk to fetch, no GPU context to create and no
 * capability probe to fail.
 *
 * Two things follow from that, and both are the point:
 *
 *   - It is visible immediately. Nothing about the graphic waits on hydration,
 *     so it cannot arrive late the way a lazily-mounted canvas does.
 *   - It costs no JavaScript per frame. The drift, the sway, the planet turning
 *     and the vortex inside the great storm are all CSS animations on
 *     `transform` and `stroke-dashoffset`; the only script is a pointer listener
 *     that writes two custom properties.
 *
 * There is no ring. Jupiter has one, but it is micron-scale dust with an optical
 * depth around a millionth — nothing you could draw without lying about the
 * object. An earlier version of this file carried a Saturn-style ring system
 * over, and it was the single loudest thing telling the eye this was not Jupiter.
 *
 * Three scales of structure are what make it read as an atmosphere rather than
 * as stripes, and all three are needed:
 *
 *   - the belts and zones, each a path whose latitude wanders;
 *   - a filament along every belt edge, wandering faster than the belt itself;
 *   - a broken, streaky layer of dashes over the top, which is the shear.
 *
 * THE ROTATION is the part that took the most care. Belts do not move — they are
 * latitude circles and they stay where they are — but everything *in* them
 * drifts, and that drift is the whole cue that this is a turning sphere rather
 * than a disc. So the loose features (the eddies and the small ovals) sit in
 * their own layer, drawn three times at a fixed spacing and translated by exactly
 * that spacing on a loop. The copies are identical and the spacing is exact, so
 * the wrap is invisible: a feature slides off one limb while its double slides in
 * at the other. A radial mask fades them as they approach the edge, which is what
 * sells the curvature.
 *
 * That layer is kept outside the noise filter, and the filter is kept off the
 * animated element, because a change *inside* a filtered group makes the browser
 * rebuild the whole filter every frame. As arranged, both filters are painted
 * once and only composited afterwards.
 */

/** The planet's radius in viewBox units. The box is 400x400, centred at 200. */
const PLANET_R = 78;

/**
 * The frame the drawing is cut to, tight around the disc. The object's own
 * extent is 156 units, so a box much wider than that is empty margin — and empty
 * margin is what makes a large graphic read as a small one. The halo overflows
 * this frame on purpose; it is a soft gradient and there is nothing to clip.
 */
const VIEW_BOX = '48 48 304 304';

/**
 * The axis tilt. Jupiter's own axis is barely tilted to the line of sight, but a
 * dead-level deck reads as a flat disc with stripes on it — a few degrees of
 * lean is what gives the belts their diagonal flow and lets the polar caps sit
 * where a sphere would put them.
 */
const DECK_TILT_DEG = -10;

/** The light comes from here, and everything about the shading follows it. */
const LIGHT_X = '8%';
const LIGHT_Y = '2%';

/**
 * The palette. Everything warm is mixed from the site's own accent, so the
 * object belongs to the page — but the darks are mixed toward a deep burnt brown
 * rather than toward black. Mixing with black drains the chroma as it darkens,
 * which is exactly what made an earlier pass look muddy; the belts need to be
 * dark and still orange.
 *
 * The cool tones are barely mixed at all, and that is deliberate. Blue and amber
 * are close to opposite hues, so mixing them in oklab cancels their chroma and
 * lands on a warm grey: a measured pass at a 70% blue mix produced a disc with no
 * blue in it at all. A tenth of the accent is enough to tie them to the page and
 * still leave them blue.
 *
 * The spread is the point, and it has to be wide. A gas giant in one hue reads as
 * a cartoon: it needs near-white zones hard against deep umber belts, with the
 * blue-gray in between doing the separating.
 */
const JOVIAN = {
  ivory: 'color-mix(in oklab, var(--accent) 4%, #fffdf7)',
  cream: 'color-mix(in oklab, var(--accent) 24%, #fff6e6)',
  peach: 'color-mix(in oklab, var(--accent) 60%, #ffd6a0)',
  ochre: 'var(--accent)',
  amber: 'color-mix(in oklab, var(--accent) 76%, #d97a1f)',
  spot: 'color-mix(in oklab, #c9552f 58%, var(--accent))',
  russet: 'color-mix(in oklab, var(--accent) 46%, #8a3f16)',
  umber: 'color-mix(in oklab, var(--accent) 30%, #5c2c0e)',
  deep: 'color-mix(in oklab, var(--accent) 18%, #3d1c08)',
  cool: 'color-mix(in oklab, #9ec8de 88%, var(--accent))',
  coolDeep: 'color-mix(in oklab, #3f6b85 88%, var(--accent))',
  slate: 'color-mix(in oklab, #24323e 92%, var(--accent))',
} as const;

type Tone = keyof typeof JOVIAN;

/**
 * A latitude circle on a sphere seen from slightly above projects to an ellipse,
 * and only its near half is visible. So each band is an open path that follows
 * that arc, bows away from the equator, and wanders — the wander is what stops
 * the deck from reading as stacked stripes.
 *
 * The bow is proportional to the circle's own radius, which makes it fall to
 * nothing at the poles and peak at the equator. That is what the real
 * foreshortening does, and it is the difference between a sphere and a disc.
 *
 * The samples are joined with quadratics through their midpoints rather than
 * straight lines, so the result is smooth without hand-written control points.
 */
function bandPath(lat: number, amp: number, phase: number, steps = 11): string {
  const clamped = Math.max(Math.min(lat, PLANET_R - 0.5), -(PLANET_R - 0.5));
  const rx = Math.sqrt(PLANET_R * PLANET_R - clamped * clamped);
  const bow = rx * 0.16;

  const points: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i += 1) {
    const u = (i / steps) * 2 - 1;
    const arc = bow * Math.sqrt(Math.max(1 - u * u, 0));
    const wander = amp * Math.sin(u * 2.6 + phase) * Math.cos(u * 1.4 - phase * 0.6);
    points.push([200 + rx * u, 200 + clamped - arc + wander]);
  }

  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const mx = (points[i][0] + points[i + 1][0]) / 2;
    const my = (points[i][1] + points[i + 1][1]) / 2;
    d += ` Q ${points[i][0].toFixed(1)} ${points[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
}

/** Ramanujan's approximation, so the vortex's dash pattern closes on itself. */
function ellipsePerimeter(rx: number, ry: number): number {
  const h = ((rx - ry) * (rx - ry)) / ((rx + ry) * (rx + ry));
  return Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}

/**
 * The belts and zones, north to south, laid out where Jupiter's own sit: a wide
 * dark belt either side of a bright equatorial zone, temperate belts beyond
 * those, and polar caps at the edges. Widths are stroke widths, so a belt is a
 * band of colour rather than a line.
 */
const CLOUD_BANDS: ReadonlyArray<[lat: number, width: number, tone: Tone, opacity: number]> = [
  [-74, 9, 'slate', 0.8],
  [-67, 12, 'coolDeep', 0.78],
  [-61, 6, 'cool', 0.74],
  [-55, 14, 'ivory', 0.86],
  [-49, 4, 'russet', 0.6],
  [-43, 13, 'umber', 0.86],
  [-37, 5, 'peach', 0.58],
  [-30, 15, 'ivory', 0.88],
  [-23, 4, 'russet', 0.58],
  [-16, 17, 'umber', 0.88],
  [-9, 8, 'deep', 0.8],
  [-4, 4, 'cool', 0.72],
  [1, 14, 'ivory', 0.9],
  [7, 4, 'peach', 0.58],
  [14, 17, 'amber', 0.88],
  [21, 5, 'russet', 0.58],
  [28, 15, 'ivory', 0.86],
  [34, 5, 'cool', 0.74],
  [41, 13, 'umber', 0.84],
  [47, 5, 'peach', 0.56],
  [54, 14, 'ivory', 0.84],
  [60, 6, 'coolDeep', 0.76],
  [67, 12, 'amber', 0.82],
  [74, 6, 'slate', 0.74],
];

/**
 * How far the drifting layer travels before it repeats, and the copies that make
 * the repeat seamless. Three copies at exactly this spacing, translated by
 * exactly this spacing: the pattern lands back on itself and the wrap is
 * invisible. The spacing is wider than the disc, so two copies are never on it
 * at once and the repetition never shows.
 */
const FEATURE_PERIOD = 250;
const FEATURE_COPIES = [0, FEATURE_PERIOD, FEATURE_PERIOD * 2];

/**
 * Eddies: the hooks and commas that break the bands up. Each is an ellipse drawn
 * as a partial arc, so it reads as a curl rather than a closed ring, and they are
 * placed off the band centres rather than on them.
 *
 * These drift. They are the loose structure inside the belts, and their motion
 * against the stationary belts is what makes the planet look like it is turning.
 */
const EDDIES: ReadonlyArray<{
  x: number;
  y: number;
  r: number;
  rot: number;
  tone: Tone;
  opacity: number;
  sweep: number;
}> = [
  { x: 156, y: 150, r: 15, rot: -24, tone: 'cream', opacity: 0.42, sweep: 0.62 },
  { x: 238, y: 158, r: 12, rot: 34, tone: 'cool', opacity: 0.4, sweep: 0.55 },
  { x: 130, y: 192, r: 13, rot: 12, tone: 'ivory', opacity: 0.38, sweep: 0.6 },
  { x: 256, y: 200, r: 15, rot: -38, tone: 'russet', opacity: 0.46, sweep: 0.52 },
  { x: 176, y: 220, r: 11, rot: 48, tone: 'coolDeep', opacity: 0.38, sweep: 0.58 },
  { x: 212, y: 232, r: 14, rot: -14, tone: 'ivory', opacity: 0.4, sweep: 0.62 },
  { x: 146, y: 250, r: 10, rot: 28, tone: 'umber', opacity: 0.46, sweep: 0.54 },
  { x: 250, y: 258, r: 12, rot: -52, tone: 'cool', opacity: 0.36, sweep: 0.58 },
  { x: 188, y: 268, r: 9, rot: 8, tone: 'ivory', opacity: 0.36, sweep: 0.56 },
  { x: 228, y: 176, r: 9, rot: -30, tone: 'ivory', opacity: 0.38, sweep: 0.5 },
  { x: 164, y: 184, r: 10, rot: 62, tone: 'coolDeep', opacity: 0.36, sweep: 0.52 },
  { x: 202, y: 146, r: 11, rot: -8, tone: 'russet', opacity: 0.4, sweep: 0.5 },
  { x: 140, y: 226, r: 8, rot: 18, tone: 'cream', opacity: 0.38, sweep: 0.5 },
  { x: 262, y: 232, r: 9, rot: -20, tone: 'umber', opacity: 0.4, sweep: 0.48 },
  { x: 170, y: 262, r: 8, rot: 40, tone: 'cool', opacity: 0.36, sweep: 0.52 },
  { x: 220, y: 204, r: 7, rot: -44, tone: 'ivory', opacity: 0.38, sweep: 0.46 },
  { x: 268, y: 168, r: 10, rot: -36, tone: 'cream', opacity: 0.36, sweep: 0.54 },
  { x: 118, y: 236, r: 9, rot: 44, tone: 'cool', opacity: 0.34, sweep: 0.5 },
];

/**
 * The smaller ovals, each with a collar and a rim so it reads as a storm. These
 * drift with the eddies.
 */
const OVALS: ReadonlyArray<{
  x: number;
  y: number;
  rx: number;
  ry: number;
  rot: number;
  bright: boolean;
}> = [
  { x: 150, y: 166, rx: 12, ry: 6.5, rot: -16, bright: true },
  { x: 212, y: 140, rx: 9, ry: 5, rot: -10, bright: true },
  { x: 256, y: 194, rx: 10, ry: 5.5, rot: -22, bright: false },
  { x: 170, y: 238, rx: 7, ry: 4, rot: 6, bright: true },
  { x: 132, y: 212, rx: 8, ry: 4, rot: -14, bright: false },
  { x: 222, y: 274, rx: 9, ry: 4.5, rot: 12, bright: true },
  { x: 278, y: 226, rx: 8, ry: 4.5, rot: -18, bright: false },
];

/**
 * The polar cluster: the ring of small cyclones that sits over Jupiter's pole.
 * Seen nearly edge-on the ring compresses into a shallow arc across the top of
 * the disc, which is why they run left to right rather than in a circle.
 */
const POLAR_CYCLONES: ReadonlyArray<{ x: number; y: number; r: number }> = [
  { x: 168, y: 136, r: 6.5 },
  { x: 182, y: 130, r: 5.5 },
  { x: 197, y: 127, r: 7 },
  { x: 213, y: 129, r: 5.5 },
  { x: 228, y: 134, r: 6 },
  { x: 242, y: 140, r: 4.5 },
  { x: 154, y: 144, r: 5 },
];

/**
 * The great storm: the one feature nobody needs telling what it is.
 *
 * It sits in the southern belt, well clear of the limb so its structure is not
 * foreshortened away, and — deliberately — outside the churn filter, so it keeps
 * a defined edge the surrounding deck does not have. That is what makes it read
 * as a storm rather than as another band.
 *
 * Its parts are all offset from each other. Concentric ellipses on a shared
 * centre read as a bullseye; a storm is a thing with a lopsided eye and a side it
 * has been dragging behind it.
 */
const SPOT = { x: 214, y: 246, rx: 27, ry: 16, rot: -12 };
const SPOT_SWIRL_RX = SPOT.rx * 0.82;
const SPOT_SWIRL_RY = SPOT.ry * 0.82;
const SPOT_SWIRL_LEN = Math.round(ellipsePerimeter(SPOT_SWIRL_RX, SPOT_SWIRL_RY));

/**
 * The spiral. Four arcs at shrinking radii, each rotated to a different angle and
 * each drawn as a partial dash so its gap falls somewhere else. That staggered
 * break is what makes the eye follow one continuous curl inward.
 *
 * This replaced four closed concentric ellipses. Whatever you do to their
 * centres, closed rings read as a bullseye — three separate reviews of the
 * earlier version said so, and they were right.
 */
const SPOT_SPIRAL: ReadonlyArray<{
  r: number;
  rot: number;
  dx: number;
  dy: number;
  tone: Tone;
  w: number;
  opacity: number;
  span: number;
}> = [
  { r: 0.8, rot: 22, dx: 0.02, dy: 0.04, tone: 'ivory', w: 2.4, opacity: 0.5, span: 0.52 },
  { r: 0.62, rot: 104, dx: -0.05, dy: -0.03, tone: 'deep', w: 2.2, opacity: 0.42, span: 0.58 },
  { r: 0.46, rot: 186, dx: -0.11, dy: -0.09, tone: 'cream', w: 2.6, opacity: 0.58, span: 0.5 },
  { r: 0.32, rot: 268, dx: -0.17, dy: -0.13, tone: 'russet', w: 2, opacity: 0.5, span: 0.6 },
];

/**
 * A broken fringe just outside the storm. The storm sits outside the noise filter
 * so it keeps a defined edge — but a perfectly clean edge on an otherwise
 * turbulent deck is its own tell, so the edge is interrupted.
 */
const SPOT_FRINGE: ReadonlyArray<{
  r: number;
  rot: number;
  tone: Tone;
  w: number;
  opacity: number;
  span: number;
}> = [
  { r: 1.14, rot: 10, tone: 'deep', w: 2.2, opacity: 0.34, span: 0.22 },
  { r: 1.2, rot: 96, tone: 'ivory', w: 1.8, opacity: 0.3, span: 0.18 },
  { r: 1.12, rot: 190, tone: 'deep', w: 2, opacity: 0.32, span: 0.2 },
  { r: 1.22, rot: 288, tone: 'cream', w: 1.6, opacity: 0.26, span: 0.16 },
];

/** How far the graphic leans toward the pointer, and how far it drifts. */
const LEAN_X_DEG = 6;
const LEAN_Y_DEG = 4.5;
const LEAN_X_PX = 9;
const LEAN_Y_PX = 7;

interface JupiterHeroProps {
  className?: string;
}

export function JupiterHero({ className }: JupiterHeroProps) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The gradients, the filters, the mask and the clip are referenced by id, so
  // they have to be unique to this instance. React's own ids contain characters
  // that are awkward inside `url(#…)`, so they are stripped to letters and
  // digits first.
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');

  /**
   * The only script in the graphic. It does not animate anything: it writes the
   * pointer's position, normalised to -1..1, into two custom properties and lets
   * CSS interpolate toward them on a long, slow transition. A damped per-frame
   * rig would have to run every frame forever to hold a resting pose; this
   * settles and then costs nothing at all.
   *
   * The listener is on the window, not the host, because the host is
   * `pointer-events-none` — the graphic sits beside the hero's copy and must
   * never swallow a click meant for a button.
   */
  useEffect(() => {
    if (reduced) return;
    const host = hostRef.current;
    if (!host) return;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const write = () => {
      frame = 0;
      host.style.setProperty('--lean-x', nextX.toFixed(4));
      host.style.setProperty('--lean-y', nextY.toFixed(4));
    };

    const onMove = (event: PointerEvent) => {
      nextX = (event.clientX / window.innerWidth) * 2 - 1;
      nextY = (event.clientY / window.innerHeight) * 2 - 1;
      if (frame) return;
      frame = window.requestAnimationFrame(write);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const deckTransform = `rotate(${DECK_TILT_DEG} 200 200)`;
  const spotTransform = `rotate(${SPOT.rot} ${SPOT.x} ${SPOT.y})`;

  /**
   * The drifting features, as one block of markup. It is rendered three times at
   * fixed spacing and the whole layer is translated by that spacing, so the
   * pattern repeats seamlessly and no seam is ever visible.
   */
  const driftFeatures: ReactNode = (
    <>
      {EDDIES.map((eddy, index) => (
        <ellipse
          key={`eddy-${eddy.x}-${eddy.y}-${index}`}
          cx={eddy.x}
          cy={eddy.y}
          rx={eddy.r}
          ry={eddy.r * 0.52}
          fill="none"
          stroke={JOVIAN[eddy.tone]}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeDasharray={`${(2 * Math.PI * eddy.r * eddy.sweep).toFixed(1)} 999`}
          opacity={eddy.opacity}
          transform={`rotate(${eddy.rot} ${eddy.x} ${eddy.y})`}
        />
      ))}

      {OVALS.map((oval, index) => (
        <g
          key={`oval-${oval.x}-${oval.y}-${index}`}
          transform={`rotate(${oval.rot} ${oval.x} ${oval.y})`}
        >
          <ellipse
            cx={oval.x}
            cy={oval.y}
            rx={oval.rx * 1.34}
            ry={oval.ry * 1.4}
            fill={oval.bright ? JOVIAN.cream : JOVIAN.slate}
            opacity={oval.bright ? 0.44 : 0.56}
          />
          <ellipse
            cx={oval.x}
            cy={oval.y}
            rx={oval.rx * 1.02}
            ry={oval.ry * 1.06}
            fill={oval.bright ? JOVIAN.russet : JOVIAN.deep}
            opacity="0.54"
          />
          <ellipse
            cx={oval.x}
            cy={oval.y}
            rx={oval.rx}
            ry={oval.ry}
            fill={oval.bright ? JOVIAN.ivory : JOVIAN.coolDeep}
            opacity={oval.bright ? 0.94 : 0.78}
          />
          <ellipse
            cx={oval.x + oval.rx * 0.34}
            cy={oval.y + oval.ry * 0.32}
            rx={oval.rx * 0.42}
            ry={oval.ry * 0.4}
            fill={oval.bright ? JOVIAN.amber : JOVIAN.deep}
            opacity="0.36"
          />
        </g>
      ))}
    </>
  );

  return (
    <>
    <div ref={hostRef} className={cn('jupiter-host relative', className)}>
      <style>{`
        .jupiter-host {
          --lean-x: 0;
          --lean-y: 0;
          perspective: 1000px;
        }

        /* The whole object drifts and sways on its own, slowly enough that it
           reads as floating rather than as an animation. */
        .jupiter-drift {
          height: 100%;
          width: 100%;
          animation: jupiter-drift 16s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        /* The pointer lean. CSS owns the easing, so the graphic keeps settling
           toward the cursor for a beat after the pointer stops. */
        .jupiter-lean {
          height: 100%;
          width: 100%;
          transform:
            translate3d(calc(var(--lean-x) * ${LEAN_X_PX}px), calc(var(--lean-y) * ${LEAN_Y_PX}px), 0)
            rotateX(calc(var(--lean-y) * ${-LEAN_Y_DEG}deg))
            rotateY(calc(var(--lean-x) * ${LEAN_X_DEG}deg));
          transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
          transform-style: preserve-3d;
        }

        .jupiter-svg {
          height: 100%;
          width: 100%;
          overflow: visible;
        }

        /* The planet turning. Only the loose features move — the belts are
           latitude circles and stay put, which is what the real thing does.

           The layer is drawn three times at exactly ${FEATURE_PERIOD} units apart
           and translated by exactly that, so the wrap is invisible. The copies
           are further apart than the disc is wide, so two are never on it at once
           and the repetition never shows.

           The animation is on the parent of the filtered groups, never inside
           one. A change inside a filtered group makes the browser rebuild the
           whole filter every frame; out here it is a transform on a cached
           layer. */
        .jupiter-scroll {
          will-change: transform;
          animation: jupiter-scroll 68s linear infinite;
        }

        /* The vortex turning over inside the great storm. The dash offset is what
           carries it around: the arc is one dash of a pattern exactly as long as
           the ellipse's own perimeter, so it closes seamlessly and never jumps.
           Nothing rotates, so there is no transform origin to get wrong, and the
           change is a paint on a stroked path rather than a re-layout.

           It sits outside the churn filter on purpose. A change inside a filtered
           group makes the browser rebuild the whole filter every frame; out here
           it is a few pixels of stroke and nothing else. */
        .jupiter-swirl {
          animation: jupiter-swirl 26s linear infinite;
        }

        .jupiter-halo {
          animation: jupiter-halo 11s ease-in-out infinite;
        }

        @keyframes jupiter-drift {
          0%,
          100% {
            transform: translateY(-6px);
          }
          50% {
            transform: translateY(6px);
          }
        }

        @keyframes jupiter-scroll {
          to {
            transform: translateX(-${FEATURE_PERIOD}px);
          }
        }

        @keyframes jupiter-swirl {
          to {
            stroke-dashoffset: -${SPOT_SWIRL_LEN};
          }
        }

        @keyframes jupiter-halo {
          0%,
          100% {
            opacity: 0.42;
          }
          50% {
            opacity: 0.72;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .jupiter-drift,
          .jupiter-scroll,
          .jupiter-swirl,
          .jupiter-halo {
            animation: none;
          }

          .jupiter-lean {
            transform: none;
            transition: none;
          }
        }
      `}</style>

      {/* The poster: server-rendered, visible before hydration, and what stays
          if WebGL is unavailable. The live canvas mounts over it and this fades
          out underneath, so nothing here waits on JavaScript to be visible. */}
      <div
        className={cn(
          'h-full w-full transition-opacity duration-700',
          live ? 'opacity-0' : 'opacity-100',
        )}
        aria-hidden="true"
      >
      <div className="jupiter-drift">
        <div className="jupiter-lean">
          <svg viewBox={VIEW_BOX} className="jupiter-svg" aria-hidden="true" focusable="false">
            <defs>
              {/* The ground the belts sit on, already lit from the sun's side and
                  already falling away from it. The deck is drawn over this, so
                  the gradient is doing the sphere's shading underneath. */}
              <radialGradient id={`${uid}-body`} cx="30%" cy="22%" r="98%">
                <stop offset="0%" stopColor={JOVIAN.ivory} />
                <stop offset="26%" stopColor={JOVIAN.ochre} />
                <stop offset="58%" stopColor={JOVIAN.russet} />
                <stop offset="82%" stopColor={JOVIAN.coolDeep} />
                <stop offset="100%" stopColor={JOVIAN.deep} />
              </radialGradient>

              {/* The terminator. It starts darkening a third of the way across
                  and finishes almost at the background, so the planet has a
                  definite day side and night side rather than being lit flat on.
                  This is the single strongest cue that the thing is a sphere. */}
              <linearGradient id={`${uid}-term`} x1={LIGHT_X} y1={LIGHT_Y} x2="96%" y2="104%">
                <stop offset="0%" stopColor="color-mix(in oklab, var(--background) 0%, transparent)" />
                <stop offset="26%" stopColor="color-mix(in oklab, var(--background) 17%, transparent)" />
                <stop offset="52%" stopColor="color-mix(in oklab, var(--background) 55%, transparent)" />
                <stop offset="76%" stopColor="color-mix(in oklab, var(--background) 87%, transparent)" />
                <stop offset="100%" stopColor="color-mix(in oklab, var(--background) 98%, transparent)" />
              </linearGradient>

              {/* Limb darkening, so the disc rolls off toward every edge as well
                  as falling away from the sun. */}
              <radialGradient id={`${uid}-limb`}>
                <stop offset="0%" stopColor="var(--background)" stopOpacity="0" />
                <stop offset="72%" stopColor="var(--background)" stopOpacity="0" />
                <stop offset="92%" stopColor="var(--background)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--background)" stopOpacity="0.42" />
              </radialGradient>

              <radialGradient id={`${uid}-halo`}>
                <stop offset="0%" stopColor="color-mix(in oklab, var(--accent) 18%, transparent)" />
                <stop offset="52%" stopColor="color-mix(in oklab, var(--accent) 7%, transparent)" />
                <stop offset="100%" stopColor="color-mix(in oklab, var(--accent) 0%, transparent)" />
              </radialGradient>

              <linearGradient id={`${uid}-swirl`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={JOVIAN.ivory} stopOpacity="0" />
                <stop offset="50%" stopColor={JOVIAN.ivory} stopOpacity="0.9" />
                <stop offset="100%" stopColor={JOVIAN.ivory} stopOpacity="0" />
              </linearGradient>

              {/* The mask that sells the curvature. The drifting features are
                  faded out as they approach the limb, so a feature does not slide
                  across a flat disc — it comes up over the edge of a sphere and
                  disappears round the back of it. */}
              <radialGradient id={`${uid}-fade`}>
                <stop offset="0%" stopColor="#fff" />
                <stop offset="58%" stopColor="#fff" />
                <stop offset="100%" stopColor="#000" />
              </radialGradient>

              <mask
                id={`${uid}-fadeMask`}
                maskUnits="userSpaceOnUse"
                x="110"
                y="110"
                width="180"
                height="180"
              >
                <circle cx="200" cy="200" r={PLANET_R} fill={`url(#${uid}-fade)`} />
              </mask>

              {/* The expensive filter, and the one that turns bands into an
                  atmosphere: the deck is pushed around by fractal noise, then
                  clipped back to the disc. The clip is applied after the filter,
                  so the limb stays a clean circle while the cloud edges inside it
                  fray.

                  The blur is deliberately tiny. An earlier pass used a heavy one
                  and the result read as an out-of-focus photograph — a gas giant
                  is filamentary, and softening it destroys the only detail it
                  has.

                  It is painted once, because nothing inside it animates. */}
              <filter
                id={`${uid}-churn`}
                x="-8%"
                y="-8%"
                width="116%"
                height="116%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="soft" />
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.05 0.11"
                  numOctaves="4"
                  seed="7"
                  result="noise"
                />
                <feDisplacementMap
                  in="soft"
                  in2="noise"
                  scale="10"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>

              {/* A second, much cheaper filter, so the drifting features share the
                  deck's softness instead of sitting on it crisply. It is applied
                  to each copy separately rather than to the whole layer, so its
                  region is one copy's extent and not three copies' worth. Also
                  painted once. */}
              <filter id={`${uid}-soft`} x="-6%" y="-20%" width="112%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" />
              </filter>

              <clipPath id={`${uid}-disc`}>
                <circle cx="200" cy="200" r={PLANET_R} />
              </clipPath>
            </defs>

            {/* Ambient light pooling behind the object. Kept low: turned up, it
                rim-lights the planet and makes it look pasted on. */}
            <circle className="jupiter-halo" cx="200" cy="200" r="176" fill={`url(#${uid}-halo)`} />

            <circle cx="200" cy="200" r={PLANET_R} fill={`url(#${uid}-body)`} />

            <g clipPath={`url(#${uid}-disc)`}>
              <g transform={deckTransform}>
                {/* The deck: belts, their frayed edges, the shear over the top,
                    the polar cyclones and the caps, all through the noise filter
                    together so they share one grain. None of it moves. */}
                <g filter={`url(#${uid}-churn)`}>
                  {CLOUD_BANDS.map(([lat, width, tone, opacity], index) => (
                    <path
                      key={`band-${lat}-${index}`}
                      d={bandPath(lat, 2 + ((index * 7) % 5) * 0.7, index * 1.9)}
                      fill="none"
                      stroke={JOVIAN[tone]}
                      strokeWidth={width}
                      opacity={opacity}
                      strokeLinecap="round"
                    />
                  ))}

                  {/* Every belt gets a filament along each edge, wandering faster
                      than the belt itself. Without this the belts have clean
                      edges, and clean edges are the tell that something is drawn
                      rather than photographed. */}
                  {CLOUD_BANDS.flatMap(([lat, width, tone, opacity], index) =>
                    width < 12
                      ? []
                      : [-1, 1].map((side) => (
                          <path
                            key={`scallop-${lat}-${side}`}
                            d={bandPath(
                              lat + side * (width * 0.5 + 0.6),
                              2.6 + ((index * 3) % 4) * 0.6,
                              index * 2.3 + side,
                            )}
                            fill="none"
                            stroke={JOVIAN[tone]}
                            strokeWidth={2.2}
                            opacity={Math.min(opacity * 0.7, 0.44)}
                            strokeLinecap="round"
                          />
                        )),
                  )}

                  {/* The third scale, and the one that finally reads as flow: the
                      same bands again, drawn as broken dashes of uneven length.
                      Solid strokes give smooth ribbons; breaking them into
                      fragments is what looks like shear — cloud torn into
                      streamers and dragged along the belt.

                      The dash pattern is irregular on purpose. An even one reads
                      as a dotted line; an uneven one reads as filaments. */}
                  {CLOUD_BANDS.flatMap(([lat, width, tone, opacity], index) => {
                    if (width < 8) return [];
                    const dash = [
                      14 + (index % 5) * 7,
                      6 + (index % 3) * 5,
                      24 + (index % 4) * 9,
                      8 + (index % 6) * 4,
                      9 + (index % 4) * 6,
                      12 + (index % 5) * 5,
                    ].join(' ');
                    return [
                      <path
                        key={`streak-${lat}`}
                        d={bandPath(
                          lat + (index % 2 ? 1.6 : -1.6),
                          3 + ((index * 5) % 4) * 0.8,
                          index * 3.1,
                        )}
                        fill="none"
                        stroke={JOVIAN[tone === 'ivory' || tone === 'cream' ? 'ivory' : 'deep']}
                        strokeWidth={1.5}
                        opacity={Math.min(opacity * 0.55, 0.34)}
                        strokeDasharray={dash}
                        strokeLinecap="round"
                      />,
                    ];
                  })}

                  {POLAR_CYCLONES.map((cyclone, index) => (
                    <g key={`cyclone-${cyclone.x}-${cyclone.y}-${index}`}>
                      <circle
                        cx={cyclone.x}
                        cy={cyclone.y}
                        r={cyclone.r * 1.6}
                        fill={JOVIAN.coolDeep}
                        opacity="0.55"
                      />
                      <circle
                        cx={cyclone.x}
                        cy={cyclone.y}
                        r={cyclone.r}
                        fill={JOVIAN.cool}
                        opacity="0.72"
                      />
                      <circle
                        cx={cyclone.x - cyclone.r * 0.25}
                        cy={cyclone.y - cyclone.r * 0.3}
                        r={cyclone.r * 0.46}
                        fill={JOVIAN.ivory}
                        opacity="0.6"
                      />
                    </g>
                  ))}

                  {/* The polar caps, darkening each end of the deck. */}
                  <ellipse
                    cx="200"
                    cy={200 - PLANET_R * 0.84}
                    rx={PLANET_R * 0.86}
                    ry={PLANET_R * 0.4}
                    fill={JOVIAN.slate}
                    opacity="0.72"
                  />
                  <ellipse
                    cx="200"
                    cy={200 + PLANET_R * 0.88}
                    rx={PLANET_R * 0.8}
                    ry={PLANET_R * 0.36}
                    fill={JOVIAN.coolDeep}
                    opacity="0.62"
                  />
                </g>

                {/* The drift layer. The mask is on this element, not on the one
                    that moves, so it stays anchored to the disc while the content
                    slides underneath it. */}
                <g mask={`url(#${uid}-fadeMask)`}>
                  <g className="jupiter-scroll">
                    {FEATURE_COPIES.map((offset) => (
                      <g
                        key={`copy-${offset}`}
                        transform={`translate(${offset} 0)`}
                        filter={`url(#${uid}-soft)`}
                      >
                        {driftFeatures}
                      </g>
                    ))}
                  </g>
                </g>

                {/* The great storm, outside the noise filter so it keeps its
                    edge. Every ring is offset from the one outside it: concentric
                    ellipses on a shared centre read as a bullseye, and this needs
                    to read as something that is turning. */}
                <g transform={spotTransform}>
                  <ellipse
                    cx={SPOT.x}
                    cy={SPOT.y}
                    rx={SPOT.rx * 1.32}
                    ry={SPOT.ry * 1.4}
                    fill={JOVIAN.cool}
                    opacity="0.36"
                  />
                  {/* The dark collar, hugging the outside rather than centred. */}
                  <ellipse
                    cx={SPOT.x - SPOT.rx * 0.06}
                    cy={SPOT.y + SPOT.ry * 0.08}
                    rx={SPOT.rx * 1.04}
                    ry={SPOT.ry * 1.06}
                    fill={JOVIAN.deep}
                    opacity="0.78"
                  />
                  <ellipse
                    cx={SPOT.x}
                    cy={SPOT.y}
                    rx={SPOT.rx}
                    ry={SPOT.ry}
                    fill={JOVIAN.spot}
                    opacity="0.95"
                  />
                  {/* The core, pushed off centre and small. A large centred
                      pale ellipse is the single thing that turns a storm into a
                      target, so it is deliberately neither. */}
                  <ellipse
                    cx={SPOT.x - SPOT.rx * 0.18}
                    cy={SPOT.y - SPOT.ry * 0.2}
                    rx={SPOT.rx * 0.34}
                    ry={SPOT.ry * 0.38}
                    fill={JOVIAN.cream}
                    opacity="0.6"
                  />
                  <ellipse
                    cx={SPOT.x - SPOT.rx * 0.26}
                    cy={SPOT.y - SPOT.ry * 0.26}
                    rx={SPOT.rx * 0.15}
                    ry={SPOT.ry * 0.18}
                    fill={JOVIAN.ivory}
                    opacity="0.7"
                  />
                  {/* The curl. Each arc is offset, rotated and broken at a
                      different point, so the gaps stagger and the eye reads one
                      continuous inward spiral. */}
                  {SPOT_SPIRAL.map((arc, index) => {
                    const perimeter = Math.round(ellipsePerimeter(SPOT.rx * arc.r, SPOT.ry * arc.r));
                    return (
                      <ellipse
                        key={`spiral-${index}`}
                        cx={SPOT.x + SPOT.rx * arc.dx}
                        cy={SPOT.y + SPOT.ry * arc.dy}
                        rx={SPOT.rx * arc.r}
                        ry={SPOT.ry * arc.r}
                        fill="none"
                        stroke={JOVIAN[arc.tone]}
                        strokeWidth={arc.w}
                        strokeLinecap="round"
                        opacity={arc.opacity}
                        strokeDasharray={`${Math.round(perimeter * arc.span)} ${perimeter}`}
                        transform={`rotate(${arc.rot} ${SPOT.x} ${SPOT.y})`}
                      />
                    );
                  })}
                  {SPOT_FRINGE.map((arc, index) => {
                    const perimeter = Math.round(ellipsePerimeter(SPOT.rx * arc.r, SPOT.ry * arc.r));
                    return (
                      <ellipse
                        key={`fringe-${index}`}
                        cx={SPOT.x}
                        cy={SPOT.y}
                        rx={SPOT.rx * arc.r}
                        ry={SPOT.ry * arc.r}
                        fill="none"
                        stroke={JOVIAN[arc.tone]}
                        strokeWidth={arc.w}
                        strokeLinecap="round"
                        opacity={arc.opacity}
                        strokeDasharray={`${Math.round(perimeter * arc.span)} ${perimeter}`}
                        transform={`rotate(${arc.rot} ${SPOT.x} ${SPOT.y})`}
                      />
                    );
                  })}
                  {/* The wake: what the storm has been dragging behind it, as
                      separate ovals shrinking downstream rather than a tail. */}
                  <ellipse
                    cx={SPOT.x + SPOT.rx * 1.02}
                    cy={SPOT.y + SPOT.ry * 0.3}
                    rx={SPOT.rx * 0.34}
                    ry={SPOT.ry * 0.4}
                    fill={JOVIAN.ivory}
                    opacity="0.42"
                    transform={`rotate(24 ${SPOT.x + SPOT.rx * 1.02} ${SPOT.y + SPOT.ry * 0.3})`}
                  />
                  <ellipse
                    cx={SPOT.x + SPOT.rx * 1.3}
                    cy={SPOT.y + SPOT.ry * 0.72}
                    rx={SPOT.rx * 0.22}
                    ry={SPOT.ry * 0.3}
                    fill={JOVIAN.cream}
                    opacity="0.34"
                    transform={`rotate(34 ${SPOT.x + SPOT.rx * 1.3} ${SPOT.y + SPOT.ry * 0.72})`}
                  />
                  <ellipse
                    cx={SPOT.x + SPOT.rx * 1.5}
                    cy={SPOT.y + SPOT.ry * 1.16}
                    rx={SPOT.rx * 0.14}
                    ry={SPOT.ry * 0.2}
                    fill={JOVIAN.cool}
                    opacity="0.3"
                  />
                  {/* The vortex itself. This is the one thing in the graphic that
                      moves on a circle, and it is the reason the storm reads as
                      spinning rather than as a painted oval. */}
                  <ellipse
                    className="jupiter-swirl"
                    cx={SPOT.x - SPOT.rx * 0.06}
                    cy={SPOT.y - SPOT.ry * 0.04}
                    rx={SPOT_SWIRL_RX}
                    ry={SPOT_SWIRL_RY}
                    fill="none"
                    stroke={`url(#${uid}-swirl)`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.round(SPOT_SWIRL_LEN * 0.4)} ${SPOT_SWIRL_LEN}`}
                  />
                </g>
              </g>

              {/* Lighting, over the top of everything: the limb roll-off, then
                  the terminator. */}
              <circle cx="200" cy="200" r={PLANET_R} fill={`url(#${uid}-limb)`} />
              <circle cx="200" cy="200" r={PLANET_R} fill={`url(#${uid}-term)`} />
            </g>

            {/* One arc on the lit side, where the sun catches the limb, and
                nothing else. There used to be a hairline all the way round as
                well, to echo the cards' borders — but a complete circle around
                the disc reads as a sticker outline and flattens the whole object,
                which is exactly what it was doing. */}
            <circle
              cx="200"
              cy="200"
              r={PLANET_R}
              fill="none"
              stroke={JOVIAN.cream}
              strokeWidth="1.6"
              strokeDasharray="150 500"
              strokeDashoffset="150"
              strokeLinecap="round"
              opacity="0.35"
            />
          </svg>
        </div>
      </div>
      </div>
    </div>

    {/* The live planet, over the poster. Client-only, so the SVG is what the
        server sends and what a browser without WebGL keeps. */}
    {mounted ? (
      <div className="absolute -inset-[15%]">
        <JupiterCanvas onReady={() => setLive(true)} />
      </div>
    ) : null}
    </>
  );
}
