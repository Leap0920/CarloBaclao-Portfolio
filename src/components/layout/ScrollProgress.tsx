'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Hairline accent reading-progress bar pinned to the very top of the page.
 *
 * `fixed` + `pointer-events-none` so it never shifts layout and can never sit
 * over a control — the header's theme toggle included — and swallow a click.
 *
 * The fill is hand-rolled rather than driven by a scroll library: a passive
 * scroll listener writes `scaleX(progress)` straight to the bar's transform, so
 * the whole effect stays on the compositor and the component carries no framer
 * dependency. The write is coalesced to a single frame callback and a short
 * linear transition smooths the steps between scroll events. Under reduced
 * motion the value is written with no transition, so the bar tracks the scroll
 * position exactly instead of easing toward it.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let frame = 0;

    const draw = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clamped = progress < 0 ? 0 : progress > 1 ? 1 : progress;
      bar.style.transform = `scaleX(${clamped})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(draw);
    };

    // Set the initial value once, before the first scroll can arrive.
    draw();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={reduced ? undefined : { transition: 'transform 120ms linear' }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[linear-gradient(90deg,color-mix(in_oklab,var(--accent)_45%,transparent),var(--accent))] shadow-[0_0_10px_-1px_var(--accent)] print-hide"
    />
  );
}
