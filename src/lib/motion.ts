/**
 * motion.ts — the shared animation contract.
 *
 * ──────────────────────────────────────────────────────────────────
 * HOW TO USE
 * ──────────────────────────────────────────────────────────────────
 * Import the *same* variants every section uses; never copy them into a
 * component. Wrap a block in a `motion.*` element and drive it with the
 * shared viewport gate:
 *
 *   import { motion } from 'framer-motion';
 *   import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';
 *
 *   <motion.div
 *     variants={fadeUp}
 *     initial="hidden"
 *     whileInView="visible"
 *     viewport={viewportOnce}
 *   />
 *
 *   // Staggered children: the container owns the timing.
 *   <motion.ul variants={staggerContainer} initial="hidden"
 *              whileInView="visible" viewport={viewportOnce}>
 *     {items.map((i) => <motion.li key={i} variants={fadeUp} />)}
 *   </motion.ul>
 *
 * Slides travel less on a phone (30px) than on desktop (80px). Do NOT
 * hardcode the desktop distance in a section — use `useSlideVariants()`
 * (which resolves both the breakpoint and reduced motion for you) or
 * `makeSlideVariants(isMobile)` if you already know the breakpoint.
 * `slideLeft` / `slideRight` remain exported for the desktop case so
 * existing call sites keep working.
 *
 * ──────────────────────────────────────────────────────────────────
 * REDUCED MOTION
 * ──────────────────────────────────────────────────────────────────
 * Reduced motion is a branch, not a hope. Two things happen:
 *   1. Slides become a SIMPLE FADE (opacity only) — never a faster slide.
 *      `useSlideVariants()` returns fade variants automatically, and
 *      `resolveVariants(slideLeft, true)` does the same for the plain
 *      desktop variants.
 *   2. Every variant resolves to its resting state with a zero-duration
 *      transition via `resolveVariants(variants, reduced)`.
 * Sections that read `useReducedMotion()` directly should pipe their
 * variants through `resolveVariants()`.
 *
 * ──────────────────────────────────────────────────────────────────
 * PERFORMANCE RULE
 * ──────────────────────────────────────────────────────────────────
 * Animations may ONLY animate `transform` and `opacity`. Never animate
 * width, height, top, left, margin or padding — those trigger layout and
 * destroy the frame budget. Everything exported here obeys that rule;
 * anything you add here must too. If a variant cannot be expressed as
 * transform/opacity, it does not belong in this file.
 */

import { useEffect, useMemo, useState } from 'react';
import type { BezierDefinition, Transition, Variants, ViewportOptions } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** The one easing curve. Exported as a bezier array for Framer Motion. */
export const EASE: BezierDefinition = [0.22, 1, 0.36, 1];

/** Shared durations, in seconds. Nothing here runs longer than 0.8s. */
export const DURATION = {
  /** Scale/pop entrances. */
  base: 0.6,
  /** The default for fades and slides. */
  slow: 0.7,
  /** The ceiling — never exceed it. */
  max: 0.8,
} as const;

/** Stagger between siblings in a `staggerContainer`. */
export const STAGGER_STEP = 0.12;

/** The viewport gate every scroll-triggered animation shares. */
export const viewportOnce: ViewportOptions = { once: true, amount: 0.2 };

/** Breakpoint at which slides travel the shorter distance. */
export const MOBILE_SLIDE_QUERY = '(max-width: 639px)';

/** Slide travel, in px. Mobile is deliberately ~40% of desktop. */
export const SLIDE_DISTANCE = {
  desktop: 80,
  mobile: 30,
} as const;

const t = (duration: number): Transition => ({ duration, ease: EASE });

/* ── Core variants ───────────────────────────────────────────────── */

/** Fade + lift. The default entrance for a block of content. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: t(DURATION.slow) },
};

/** Opacity only. Used for reduced-motion slides and quiet reveals. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: t(DURATION.base) },
};

/** Enters from the left. Desktop travel distance. */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -SLIDE_DISTANCE.desktop },
  visible: { opacity: 1, x: 0, transition: t(DURATION.slow) },
};

/** Enters from the right. Desktop travel distance. */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: SLIDE_DISTANCE.desktop },
  visible: { opacity: 1, x: 0, transition: t(DURATION.slow) },
};

/** Fade + scale. For cards, chips and media. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: t(DURATION.base) },
};

/** Parents only. Publishes the stagger to `fadeUp`/`scaleIn` children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_STEP } },
};

/* ── Reduced motion ──────────────────────────────────────────────── */

/**
 * The resting state: visible, un-offset, zero duration. Returned by
 * `resolveVariants` when the visitor prefers reduced motion.
 */
export const NO_MOTION: Variants = {
  hidden: { opacity: 1, x: 0, y: 0, scale: 1 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } },
};

/**
 * Returns `variants` unchanged, or the resting `NO_MOTION` equivalent
 * when `reduced` is true. Use it wherever you read reduced motion
 * yourself:
 *
 *   const reduced = useReducedMotion();
 *   <motion.div variants={resolveVariants(fadeUp, reduced)} ... />
 */
export function resolveVariants(variants: Variants, reduced: boolean): Variants {
  return reduced ? NO_MOTION : variants;
}

/* ── Responsive slides ───────────────────────────────────────────── */

/**
 * Builds the slide pair for a known breakpoint. On mobile the travel is
 * `SLIDE_DISTANCE.mobile` (30px) instead of the desktop 80px — an 80px
 * sweep over a 320px-wide phone reads as a jump, not an entrance.
 */
export function makeSlideVariants(isMobile: boolean): {
  slideLeft: Variants;
  slideRight: Variants;
} {
  const distance = isMobile ? SLIDE_DISTANCE.mobile : SLIDE_DISTANCE.desktop;
  return {
    slideLeft: {
      hidden: { opacity: 0, x: -distance },
      visible: { opacity: 1, x: 0, transition: t(DURATION.slow) },
    },
    slideRight: {
      hidden: { opacity: 0, x: distance },
      visible: { opacity: 1, x: 0, transition: t(DURATION.slow) },
    },
  };
}

/**
 * Client hook: the slide pair for the *current* viewport, with reduced
 * motion already applied. This is what sections should call — it keeps
 * every section from re-implementing the breakpoint check.
 *
 *   const { slideLeft } = useSlideVariants();
 *   <motion.div variants={slideLeft} initial="hidden" whileInView="visible"
 *               viewport={viewportOnce} />
 *
 * Under `prefers-reduced-motion: reduce` both entries are a simple fade
 * (`fadeIn`), not a faster slide.
 */
export function useSlideVariants(): { slideLeft: Variants; slideRight: Variants } {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_SLIDE_QUERY);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return useMemo(() => {
    if (reduced) return { slideLeft: fadeIn, slideRight: fadeIn };
    return makeSlideVariants(isMobile);
  }, [reduced, isMobile]);
}
