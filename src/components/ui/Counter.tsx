'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Only 1-3 digit strings count up. A year like "2021" stays a plain label. */
const COUNTABLE = /^\d{1,3}$/;

const DURATION = 700;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

interface CounterProps {
  value: string;
  className?: string;
}

/**
 * Counts a number up from zero the first time it scrolls into view.
 *
 * Values that are not 1-3 digits (the year "2021") render as static text with no
 * animation and no observer — there is nothing to count. Reduced motion resolves
 * to the final value immediately, so the number is never withheld.
 */
export function Counter({ value, className }: CounterProps) {
  const reduced = useReducedMotion();
  const countable = COUNTABLE.test(value);
  const target = countable ? Number(value) : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(countable ? '0' : value);

  useEffect(() => {
    if (!countable || reduced) {
      setDisplay(value);
      return;
    }

    const node = ref.current;
    if (!node) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      if (start === 0) start = now;
      const progress = Math.min(1, (now - start) / DURATION);
      setDisplay(String(Math.round(easeOutCubic(progress) * target)));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [countable, reduced, target, value]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {display}
    </span>
  );
}
