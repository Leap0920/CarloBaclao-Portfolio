'use client';

import React, { useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react';
import { onScrollGeometry } from '@/lib/scrollGeometry';

export interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

/** The design system's one curve, `--ease-fluid`. */
const EASE_FLUID = 'cubic-bezier(0.32, 0.72, 0, 1)';

/**
 * Magnet — an element that leans toward the pointer.
 *
 * Rewritten from the upstream version, which re-rendered on every mouse move:
 *
 *  1. It held the offset in `useState`, and wrote a FRESH object
 *     (`{ x: 0, y: 0 }`) on every event even when the element was nowhere near
 *     the pointer. React compares state by identity, so that never bailed out:
 *     moving the mouse anywhere on the page re-rendered the subtree ~60x/sec.
 *  2. It called `getBoundingClientRect()` inside the move handler. That forces
 *     a synchronous layout, at pointer rate, for a purely decorative effect.
 *  3. Its listeners were on `window` and never removed while `disabled`.
 *
 * Now: the box is cached in DOCUMENT space and refreshed only when the
 * document actually moves, the offset is written straight to `style.transform`
 * with no state at all, and a move that does not change the offset does no
 * work. The public API is unchanged.
 *
 * Caching in document space rather than viewport space is what takes the
 * element off the scroll path. Its viewport position is `top - scrollY`, and
 * reading the scroll offset costs nothing, so a scroll no longer re-measures
 * anything - which it used to do on every scroll event, at the cost of a
 * forced layout per frame.
 *
 * The transition defaults are also this repo's curve rather than upstream's
 * `ease-out` / `ease-in-out`, so a caller that forgets to override still gets
 * the design system's easing.
 */
const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = `transform 0.3s ${EASE_FLUID}`,
  inactiveTransition = `transform 0.5s ${EASE_FLUID}`,
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner || disabled) return;

    // Decorative motion: under reduced motion the element simply stays put.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    /** The wrapper's box in document space. */
    let box = { left: 0, top: 0, width: 0, height: 0 };
    const measure = () => {
      const r = wrapper.getBoundingClientRect();
      box = { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height };
    };
    measure();

    let active = false;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: PointerEvent) => {
      // Document box -> viewport box. `scrollY` is a cheap read and never
      // forces a layout, which is the whole reason the box is stored this way.
      const centerX = box.left - window.scrollX + box.width / 2;
      const centerY = box.top - window.scrollY + box.height / 2;
      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);
      const within = distX < box.width / 2 + padding && distY < box.height / 2 + padding;

      // Only touch the transition when the engagement state actually flips.
      if (within !== active) {
        active = within;
        inner.style.transition = within ? activeTransition : inactiveTransition;
      }

      const x = within ? (e.clientX - centerX) / magnetStrength : 0;
      const y = within ? (e.clientY - centerY) / magnetStrength : 0;
      if (x === lastX && y === lastY) return;
      lastX = x;
      lastY = y;
      inner.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    // Re-measure when the document moves - a resize, or the monospace font
    // settling and re-laying the page out - instead of on every scroll.
    const offGeometry = onScrollGeometry(measure);

    return () => {
      window.removeEventListener('pointermove', onMove);
      offGeometry();
    };
  }, [padding, disabled, magnetStrength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{ willChange: 'transform', transition: inactiveTransition }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
