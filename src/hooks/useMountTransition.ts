'use client';

import { useEffect, useRef, useState } from 'react';

/** Roughly one frame, long enough for the browser to paint the hidden form. */
const PAINT_DELAY_MS = 32;

/**
 * Keeps a transient surface — dialog, drawer, sheet — mounted for exactly as
 * long as its transition needs, and no longer.
 *
 * Two things here are deliberate.
 *
 * The unmount runs on a timeout rather than on the animation's completion
 * callback. A completion callback is a promise the frame clock has to keep, and
 * when it does not — a saturated compositor, a backgrounded tab, a stalled
 * animation loop — the surface stays in the DOM at `opacity: 0`, invisible but
 * still swallowing every click aimed at the page behind it.
 *
 * Every state flip is deferred a tick, so React commits the hidden form, the
 * browser paints it, and the transition has a starting value to animate from.
 *
 * @param open Whether the surface should be on screen.
 * @param durationMs How long the exit transition takes. Keep in step with the
 *   CSS `duration-*` on the surface.
 */
export function useMountTransition(open: boolean, durationMs = 220) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  const timer = useRef(0);

  useEffect(() => {
    window.clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      if (open) {
        setMounted(true);
        timer.current = window.setTimeout(() => setVisible(true), PAINT_DELAY_MS);
      } else {
        setVisible(false);
        timer.current = window.setTimeout(() => setMounted(false), durationMs);
      }
    }, 0);

    return () => window.clearTimeout(timer.current);
  }, [open, durationMs]);

  return { mounted, visible };
}
