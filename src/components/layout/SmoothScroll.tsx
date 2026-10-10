'use client';

import { useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Slow scroll.
 *
 * The page is a terminal buffer being read, not a document being flung.
 * A stock wheel scroll moves the page in hard steps - one notch, one
 * jump - which reads as "browsing a web page". This makes the page glide:
 * every wheel notch is scaled down, and the page eases toward the new
 * target over the following frames instead of teleporting to it. The
 * result is that the reader's own scroll becomes the slowest animation on
 * the page, and the scroll-driven effects layered underneath it (the
 * gutter, the seams, the heading wipes) get more frames to play across.
 *
 * Four rules keep this from becoming the thing that breaks the site:
 *
 * 1. `prefers-reduced-motion: reduce` disables it outright. Hijacking
 *    scroll is exactly the kind of motion that setting exists to refuse,
 *    so under it the page keeps the browser's own scrolling and the CSS
 *    layer keeps its resting frames.
 * 2. It only takes over a FINE pointer. A touch device already has
 *    momentum, rubber-banding and a scrollbar the OS draws; a JS lerp on
 *    top of that fights the platform and loses on the first flick.
 * 3. A scroll the page did not author always wins. Anchor jumps, keyboard
 *    PageDown, a scrollbar drag and the browser restoring a position all
 *    move `scrollY` without us, and when that happens we drop the loop and
 *    re-seat on the real position rather than dragging the reader back.
 * 4. A wheel event inside a nested scroller belongs to that element. The
 *    CV dialog is a scrollable panel over a locked page; stealing its
 *    wheel would make the dialog unscrollable. Walk the ancestors and
 *    hand the event back the moment one of them can actually scroll.
 *
 * Rule 3 is the one that took real work, and the obvious version of it is
 * a trap. The first attempt asked "is `scrollY` one of the positions I
 * wrote?" and cancelled the glide when the answer was no. That dies
 * immediately, because a browser does not apply a programmatic scroll
 * verbatim: a write of 29 comes back reported as 32, 32 is not in the
 * write history, and the smoother reads its own clamped scroll as a
 * foreign one and switches itself off two frames into the first glide.
 * Measured: one wheel notch of 100px landed at 32px and stopped dead.
 *
 * So the question is asked as a corridor instead. A glide only ever moves
 * between where its burst started and where it is heading, so anything
 * inside that band, plus a few pixels of slack, is ours whether or not it
 * is exactly a value we wrote; anything outside it is genuinely someone
 * else's scroll and we yield. That is immune to clamping, rounding and
 * the browser's own quantization.
 *
 * It writes through `behavior: 'instant'` on purpose. `scroll-behavior:
 * smooth` is set on `html` in globals.css, so the two-argument
 * `scrollTo()` would ask the browser to animate toward a position the
 * loop is already animating toward, and the two easings would compound
 * into a rubber band.
 *
 * The dials are CSS custom properties, so they are tunable from
 * globals.css without touching this file:
 *   --scroll-rate  how far one wheel notch moves the page. 1 = stock.
 *   --scroll-ease  how much of the remaining distance is covered per
 *                  frame. Lower is a longer, slower glide.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window.matchMedia !== 'function') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const root = document.documentElement;

    /**
     * `scroll-snap-type: y proximity` is declared on `html` in
     * globals.css, and it is the one thing on this page that genuinely
     * cannot coexist with a lerped scroll. A glide writes dozens of
     * arbitrary intermediate positions, and a snap container yanks every
     * one of them to the nearest snap point. Measured with snapping left
     * on: a scroll to 300px collapsed to 32px, 700px jumped to 932px, and
     * 1000px jumped to 1028px - so the glide does not merely get dented,
     * it gets deleted, and the page reads as broken rather than slow.
     * Both want to own the final scroll position, so the smoother takes
     * it for as long as it is mounted and hands it back on unmount.
     * Reduced motion and touch never mount it, so those readers keep the
     * snapping exactly as it shipped.
     */
    const previousSnap = root.style.scrollSnapType;
    root.style.scrollSnapType = 'none';

    const cssNum = (name: string, fallback: number) => {
      const v = parseFloat(getComputedStyle(root).getPropertyValue(name));
      return Number.isFinite(v) && v > 0 ? v : fallback;
    };

    const RATE = cssNum('--scroll-rate', 0.6);
    const EASE = Math.min(cssNum('--scroll-ease', 0.09), 1);
    // Sub-pixel. Anything smaller and the loop spins on a distance the
    // reader cannot see.
    const EPS = 0.4;
    // How far outside the corridor `scrollY` has to land before we call
    // the scroll someone else's. Covers the browser's own rounding and
    // any clamping it applies to our writes.
    const SLACK = 6;
    // A long frame is a stalled tab, not a gesture: clamp so a resume
    // from a background tab cannot teleport the page.
    const MAX_FRAME = 64;

    let current = window.scrollY;
    let target = current;
    // The band this glide is allowed to travel through, so a scroll event
    // can be attributed without having to match a written value exactly.
    let burstLo = current;
    let burstHi = current;
    let raf = 0;
    let running = false;
    let lastFrame = 0;

    const maxScroll = () => Math.max(0, root.scrollHeight - window.innerHeight);
    const clamp = (v: number) => Math.min(Math.max(v, 0), maxScroll());

    const write = (v: number) => {
      window.scrollTo({ top: v, behavior: 'instant' });
    };

    const step = (now: number) => {
      // Ease by elapsed time, not by frame. A fixed per-frame fraction
      // makes the glide twice as fast on a 144Hz display as on a 60Hz
      // one, which is the sort of difference the reader feels without
      // being able to name.
      const dt = lastFrame ? Math.min(now - lastFrame, MAX_FRAME) : 1000 / 60;
      lastFrame = now;
      const k = 1 - Math.pow(1 - EASE, dt / (1000 / 60));

      // Re-read the limit every frame. The gutter resizes the document
      // once fonts settle, and a target past the new end would otherwise
      // keep the loop alive against a wall.
      target = clamp(target);
      current += (target - current) * k;

      if (Math.abs(target - current) < EPS) {
        current = target;
        write(current);
        running = false;
        lastFrame = 0;
        return;
      }
      write(current);
      raf = requestAnimationFrame(step);
    };

    const kick = () => {
      if (running) return;
      running = true;
      lastFrame = 0;
      burstLo = Math.min(window.scrollY, target);
      burstHi = Math.max(window.scrollY, target);
      raf = requestAnimationFrame(step);
    };

    const release = () => {
      cancelAnimationFrame(raf);
      running = false;
      lastFrame = 0;
      current = target = window.scrollY;
    };

    const onScroll = () => {
      const y = window.scrollY;
      // Idle: nothing of ours to defend, so just stay in sync with the
      // page. Without this a native scroll (PageDown, a scrollbar drag)
      // would leave `current` stale, and the next notch would add its
      // delta to the wrong origin and jump.
      if (!running) {
        current = target = y;
        return;
      }
      if (y < burstLo - SLACK || y > burstHi + SLACK) release();
    };

    // An anchor jump while a glide is in flight would otherwise be
    // overwritten by the next frame of our own animation.
    const onHash = () => release();

    const inNestedScroller = (node: EventTarget | null) => {
      let n = node instanceof Element ? node : null;
      while (n && n !== root) {
        const overflowY = getComputedStyle(n).overflowY;
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          n.scrollHeight > n.clientHeight + 1
        ) {
          return true;
        }
        n = n.parentElement;
      }
      return false;
    };

    const onWheel = (e: WheelEvent) => {
      // Ctrl+wheel is pinch-zoom, and a handler upstream that already
      // called preventDefault has claimed the gesture.
      if (e.ctrlKey || e.defaultPrevented) return;
      if (maxScroll() <= 0) return;
      if (inNestedScroller(e.target)) return;

      e.preventDefault();

      // `deltaMode` is lines in some browsers and some mice; 16px is the
      // conventional line. Pixels otherwise, which is Chrome on Windows.
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      target = clamp(target + delta * RATE);
      if (running) {
        burstLo = Math.min(burstLo, target);
        burstHi = Math.max(burstHi, target);
      }
      kick();
    };

    const onResize = () => release();

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('hashchange', onHash);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('hashchange', onHash);
      root.style.scrollSnapType = previousSnap;
    };
  }, [reduced]);

  return null;
}
