'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Fraction of the element's own height to travel. 0.08 is a whisper. */
  speed?: number;
}

/**
 * Moves its layer against the scroll direction so stacked layers separate.
 * Transform-only, so it stays on the compositor. Under reduced motion the
 * layer is simply static.
 *
 * One Parallax layer per section, at most. Two in the same viewport read as a
 * wobble rather than as depth.
 */
export function Parallax({ children, className, speed = 0.12 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.fromTo(
      el,
      { yPercent: -speed * 100 },
      {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced, speed]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
