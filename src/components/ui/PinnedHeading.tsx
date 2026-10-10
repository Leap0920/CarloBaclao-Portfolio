'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

interface PinnedHeadingProps {
  children: ReactNode;
  className?: string;
}

/**
 * Holds a heading in place while the rest of its section scrolls past.
 *
 * `pinType: 'transform'` is explicit: the root layout wraps the page in
 * `overflow-clip`, and a `position: fixed` pin inside a clipping ancestor is
 * unreliable. Transform pinning works inside the clip and stays on the
 * compositor.
 *
 * `pinSpacing: false` because the heading already sits in a grid column with
 * its own height - letting ScrollTrigger add spacer padding would push the
 * section taller than the layout intends.
 */
export function PinnedHeading({ children, className }: PinnedHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 25%',
      end: 'bottom 70%',
      pin: el,
      pinSpacing: false,
      pinType: 'transform',
    });

    return () => trigger.kill();
  }, [reduced]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
