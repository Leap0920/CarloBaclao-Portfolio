'use client';

import { useEffect, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

/** Maximum rotation, in degrees, at the outer edges of the card. */
const MAX_TILT = 6;

/** Damped spring — the pointer drives a target, the spring catches up. */
const SPRING = { stiffness: 220, damping: 24, mass: 0.4 } as const;

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

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFinePointer(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const enabled = finePointer && !reduced;

  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * max * 2);
    rotateX.set(-py * max * 2);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      data-tilt={enabled ? 'on' : 'off'}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      style={
        enabled
          ? {
              rotateX,
              rotateY,
              transformPerspective: 900,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }
          : undefined
      }
      className={cn('relative', className)}
    >
      {children}
    </motion.div>
  );
}
