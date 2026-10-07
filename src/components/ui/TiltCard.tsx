'use client';

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

/** Maximum rotation, in degrees, at the outer edges of the card. */
const MAX_TILT = 6;

/**
 * A pointer-tracking 3D tilt, built once and reused.
 *
 * Disabled in three cases, all of which leave a plain, static card:
 *   - the visitor prefers reduced motion;
 *   - the device has no fine pointer (touch/pen), where a hover tilt is
 *     meaningless and the extra compositor work is pure cost;
 *   - nothing has hovered it yet (the matchMedia check runs after mount).
 *
 * Only `transform` moves, and `will-change: transform` is set *only* on
 * the enabled element — never across the grid.
 *
 * The tilt is hand-rolled rather than spring-driven: the pointer writes the
 * rotation straight to the element's transform, and a short ease-out transition
 * on that transform stands in for the previous spring, so the card still lags
 * the cursor instead of snapping to it. The component carries no framer
 * dependency.
 */
export function TiltCard({
  children,
  className,
  max = MAX_TILT,
}: {
  children: ReactNode;
  className?: string;
  /** Peak rotation in degrees. */
  max?: number;
}) {
  const reduced = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFinePointer(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const enabled = finePointer && !reduced;

  // The transform is written imperatively, so React cannot clear it. When the
  // card stops being interactive, drop whatever tilt it was left holding.
  useEffect(() => {
    if (enabled) return;
    const card = cardRef.current;
    if (card) card.style.transform = '';
  }, [enabled]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = px * max * 2;
    const rotateX = -py * max * 2;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const reset = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div
      ref={cardRef}
      data-tilt={enabled ? 'on' : 'off'}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      style={
        enabled
          ? {
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              transition: 'transform 160ms ease-out',
            }
          : undefined
      }
      className={cn('relative', className)}
    >
      {children}
    </div>
  );
}
