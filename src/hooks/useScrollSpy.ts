'use client';

import { useEffect, useState } from 'react';
import { navSections } from '@/data/navigation';

const IDS = navSections.map((section) => section.id);

/**
 * Returns the id of the section currently in view.
 *
 * A section takes over once its top edge enters the top `bandRatio` of the
 * viewport, so the highlight follows what the reader is actually looking at
 * instead of lagging behind until the previous section has fully left.
 */
export function useScrollSpy(bandRatio = 0.3): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      let current: string | null = null;

      // Never demand less than the header's own height plus a little slack.
      const line = Math.max(120, Math.round(window.innerHeight * bandRatio));

      for (const id of IDS) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) {
          current = id;
        }
      }

      // At the very bottom the last section may never cross the line.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (atBottom) current = IDS[IDS.length - 1] ?? current;

      setActive(current);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [bandRatio]);

  return active;
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolled(threshold = 12): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
