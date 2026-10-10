'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

/** Past this much scroll, the header is allowed to hide. */
const THRESHOLD = 220;

/** A scroll shorter than this is treated as noise, not a direction change. */
const HYSTERESIS = 6;

/**
 * `true` while the page is scrolling down past `THRESHOLD`, `false` otherwise.
 *
 * Framer's `useScroll()` rather than `window.addEventListener('scroll')`, which
 * the taste-skill pack bans outright (`design-taste-frontend` line 563: "a hard
 * ban, not a 'prefer-not'"). It reads the same value but hands it over as a
 * motion value, so the state write happens only when the boolean actually flips
 * instead of once per scroll frame.
 *
 * This repo does have one documented exception to that ban, in `Reveal.tsx`,
 * where a rAF-driven reveal never fires in a background or occluded window. The
 * reasoning does not apply here: the header's hidden state is irrelevant while
 * the tab is hidden, and it is recomputed the moment the tab is visible again.
 */
export function useScrollDirection(): boolean {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  // A reload part-way down the page starts `last` at the real position, so the
  // first scroll does not read as one giant downward jump.
  useEffect(() => {
    last.current = scrollY.get();
  }, [scrollY]);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - last.current;
    if (Math.abs(delta) < HYSTERESIS) return;
    last.current = y;
    setHidden(delta > 0 && y > THRESHOLD);
  });

  return hidden;
}
