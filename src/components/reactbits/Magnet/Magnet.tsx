'use client';

import React, { useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react';

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
 * Now: the rect is cached and refreshed on scroll/resize, the offset is written
 * straight to `style.transform` with no state at all, and a move that does not
 * change the offset does no work. The public API is unchanged.
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

    let rect = wrapper.getBoundingClientRect();
    const measure = () => {
      rect = wrapper.getBoundingClientRect();
    };

    let active = false;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: PointerEvent) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);
      const within = distX < rect.width / 2 + padding && distY < rect.height / 2 + padding;

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
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
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
