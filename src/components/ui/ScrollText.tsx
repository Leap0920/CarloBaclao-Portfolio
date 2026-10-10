'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

interface ScrollTextProps {
  children: string;
  className?: string;
}

/**
 * The scrub's dim floor.
 *
 * The old 0.18 measured 1.2:1 in light and 2.0:1 in dark against the
 * painted backdrop, so most of a 23-credential roll sat effectively
 * invisible. 0.95 is the lowest floor that holds the dim state at or
 * above 4.5:1 against the ACTUAL rendered backdrop, measured on the live
 * page. It is high because dark ink dimmed toward a light stage loses
 * contrast far faster than light ink dimmed toward a dark one, and this
 * page is light-only now. A dark-mode floor left in here measures 2.1:1,
 * so do not lower it.
 */
const DIM_OPACITY = 0.95;

/**
 * A paragraph whose words brighten in sequence as the block crosses the
 * viewport - the scrubbed text reveal.
 *
 * The dim starting opacity is written by GSAP at runtime, never in the markup.
 * If the bundle fails, or the reader prefers reduced motion, this is plain
 * fully-opaque text: the paragraph is never held hostage to hydration.
 *
 * The words stay real text inside inline-block spans, so assistive tech and
 * search engines still read one sentence rather than a list of words.
 */
export function ScrollText({ children, className }: ScrollTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll('[data-word]');
    if (words.length === 0) return;

    // Reduced motion, including the hydration pass where the hook still
    // holds its `false` server snapshot, means no scrub. Clear any inline
    // opacity an earlier pass wrote, so no word is stranded at the dim
    // value: a killed tween does not undo the style it applied.
    if (reduced) {
      gsap.set(words, { clearProps: 'opacity' });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // One floor, because there is one theme. This used to be a pair
    // (dark 0.7, light 0.95) picked at runtime from the class on <html>,
    // with a MutationObserver rebuilding the tween on every theme switch.
    // The switch is gone, so the light floor is simply THE floor: it is
    // the value that holds the dim state at or above 4.5:1 against the
    // actual painted backdrop.
    const tween = gsap.fromTo(
      words,
      { opacity: DIM_OPACITY },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.4,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 55%',
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      // A killed tween leaves its last inline opacity behind. Clear it so
      // an unmount or the reduced-motion correction never strands a word
      // mid-dim.
      gsap.set(words, { clearProps: 'opacity' });
    };
  }, [reduced]);

  const words = children.split(' ');

  return (
    <p ref={ref} className={cn(className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} data-word className="inline-block">
          {word}
          {i < words.length - 1 ? '\u00a0' : ''}
        </span>
      ))}
    </p>
  );
}
