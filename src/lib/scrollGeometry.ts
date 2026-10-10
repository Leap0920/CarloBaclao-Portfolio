'use client';

import { navSections } from '@/data/navigation';

/**
 * One cached model of the page's scroll geometry.
 *
 * WHY THIS EXISTS
 * Reading `scrollHeight` or `getBoundingClientRect()` during a scroll frame
 * forces a synchronous layout pass. That is only expensive when the DOM is
 * already dirty - and on this page it always is, because GSAP's scrubbed
 * ScrollTriggers write transforms every frame. So every per-frame read
 * bought a full layout, several times over, and the page paid for it while
 * the reader was actually scrolling.
 *
 * Measured on a 4.5s smoothed wheel profile, before this module:
 *   getBoundingClientRect   352ms  (7.9% of the profile)
 *   scrollHeight in SmoothScroll  248ms  (5.5%)
 *   scrollHeight in StatusBar     152ms  (3.4%)
 * Three components were reading geometry per frame: SmoothScroll for the
 * scroll limit, StatusBar for the readout and the section spy, and
 * ScrollProgress for the progress fraction.
 *
 * WHAT IT DOES INSTEAD
 * Geometry is read ONCE, cached, and refreshed only when it can actually
 * have changed - a viewport resize, a change in document height, or fonts
 * settling (the gutter re-lays the document out once they do). Consumers
 * then do arithmetic on the cached numbers and touch layout not at all.
 *
 * The numbers are the same numbers. Nothing about the page's behaviour
 * changes; only where the reads happen.
 */

export interface ScrollGeometry {
  /** `scrollHeight - innerHeight`, floored at 0: the furthest scrollY. */
  maxScroll: number;
  /** `documentElement.scrollHeight`. */
  scrollHeight: number;
  /** `window.innerHeight`, cached so the frame loop never reads it. */
  viewportH: number;
  /**
   * Document-space top of each nav section, in `navSections` order.
   * A section is at document offset `sectionTops[i]`; its position in the
   * viewport is `sectionTops[i] - scrollY`, which is what a spy compares
   * against its band without ever asking the layout engine.
   */
  sectionTops: number[];
}

const EMPTY: ScrollGeometry = { maxScroll: 0, scrollHeight: 0, viewportH: 0, sectionTops: [] };

let cached: ScrollGeometry | null = null;
let started = false;
const listeners = new Set<(g: ScrollGeometry) => void>();

/**
 * The one place layout is read. Only ever called when geometry may have
 * moved, never from a scroll handler.
 */
function read(): ScrollGeometry {
  const doc = document.documentElement;
  const viewportH = window.innerHeight;
  const scrollHeight = doc.scrollHeight;
  const y = window.scrollY;

  return {
    maxScroll: Math.max(0, scrollHeight - viewportH),
    scrollHeight,
    viewportH,
    // A section that is not in the DOM cannot claim the spy, so it is
    // parked past the end of the document rather than at zero.
    sectionTops: navSections.map((section) => {
      const el = document.getElementById(section.id);
      return el ? el.getBoundingClientRect().top + y : Number.POSITIVE_INFINITY;
    }),
  };
}

function notify() {
  cached = read();
  for (const listener of listeners) listener(cached);
}

function start() {
  if (started || typeof window === 'undefined') return;
  started = true;

  cached = read();

  window.addEventListener('resize', notify, { passive: true });

  // Catches everything that changes the document's height without a
  // viewport resize: the gutter re-laying out once the monospace font
  // settles, an image or font swapping in, the projects rail changing
  // height when a card is selected, a dialog locking the body.
  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(notify);
    observer.observe(document.documentElement);
  }

  if (typeof document.fonts?.ready?.then === 'function') {
    document.fonts.ready.then(notify).catch(() => {});
  }
}

/**
 * The cached geometry. Reading it never touches layout, so it is safe to
 * call inside a scroll frame - which is the whole point.
 */
export function scrollGeometry(): ScrollGeometry {
  if (typeof window === 'undefined') return EMPTY;
  if (!started) start();
  return cached ?? EMPTY;
}

/**
 * Re-read geometry now and tell every listener. For code that changes the
 * page's height in a way a ResizeObserver might coalesce away, or that
 * needs the new numbers immediately rather than next frame.
 */
export function refreshScrollGeometry(): void {
  if (typeof window === 'undefined') return;
  notify();
}

/**
 * Run `listener` whenever geometry is re-read, so a consumer can drop any
 * value it derived from the old numbers. Returns the unsubscribe.
 */
export function onScrollGeometry(listener: (g: ScrollGeometry) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
