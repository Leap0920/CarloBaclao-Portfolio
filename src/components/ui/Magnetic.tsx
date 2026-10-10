'use client';

import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

/** Fraction of the offset from centre that the element follows. */
const PULL = 0.22;

/** Hard cap, in px, so a wide button never slides out from under the pointer. */
const MAX = 8;

/**
 * Wraps a control so it leans towards the pointer. Transform only, and off
 * entirely under reduced motion. The CSS transition on the transform is what
 * makes it feel like the button is being pulled rather than snapped to.
 */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dx = Math.max(-MAX, Math.min(MAX, (event.clientX - (rect.left + rect.width / 2)) * PULL));
    const dy = Math.max(-MAX, Math.min(MAX, (event.clientY - (rect.top + rect.height / 2)) * PULL));
    el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = '';
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={cn('inline-block transition-transform duration-200 ease-out', className)}
    >
      {children}
    </span>
  );
}
