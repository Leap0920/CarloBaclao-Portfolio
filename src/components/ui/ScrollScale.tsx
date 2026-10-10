'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

interface ScrollScaleProps {
  children: ReactNode;
  className?: string;
  /** Scale the child starts at, before it has fully arrived. */
  from?: number;
  /** Opacity the child starts at. */
  dim?: number;
}

/**
 * Grows and brightens its child as the child climbs into the viewport - the
 * image scale-and-fade from the motion rules, in its entry half only.
 *
 * There is deliberately no exit tween. An entry tween and an exit tween over
 * the same property overlap for any element taller than the gap between their
 * ranges, and two scrubbed tweens writing `opacity` fight each other at every
 * scroll position in the overlap. One direction, one tween, no conflict.
 *
 * Transform and opacity only, so it stays on the compositor. Static under
 * reduced motion.
 */
export function ScrollScale({ children, className, from = 0.94, dim = 0.6 }: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.fromTo(
      el,
      { scale: from, opacity: dim },
      {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 45%',
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced, from, dim]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
