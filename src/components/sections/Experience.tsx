'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui/Section';
import { experience } from '@/data/resume';
import { formatRange } from '@/lib/format';
import { resolveVariants, useSlideVariants, viewportOnce } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

/** The 20px glass recipe. `rounded-card` is the contract name; the landed 20px
 *  token is `--radius` (bare `rounded`), so both are kept so it renders today. */
const GLASS =
  'rounded-card rounded border border-border bg-surface shadow-[var(--shadow-card)]';

/** Below `lg` the timeline is a single left rail; at `lg` the cards alternate. */
function useIsStacked() {
  const [stacked, setStacked] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const update = () => setStacked(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return stacked;
}

export function Experience() {
  const reduced = useReducedMotion();
  const { slideLeft, slideRight } = useSlideVariants();
  const stacked = useIsStacked();
  const trackRef = useRef<HTMLOListElement>(null);

  // Real scroll progress across the track — this is what draws the rail, not a
  // timer. Progress is 0 as the track enters, 1 once it is most of the way up.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 80%', 'end 45%'],
  });

  // Spring-smoothed. Framer writes this as a `scaleY` transform — never a
  // height animation — so the draw stays on the compositor.
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <Section id="experience">
      <SectionHeading
        index="03"
        eyebrow="Experience"
        title="Where I have worked"
        description="Clinical data work at a diagnostic center."
      />

      {/* overflow-x-clip: the rail and the sliding cards can never add a
          horizontal scrollbar, however wide the transient transform is. */}
      <div className="relative overflow-x-clip">
        {/* The rail — full height, revealed from the top via scaleY. */}
        <div
          aria-hidden="true"
          className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-border lg:left-1/2"
        >
          <motion.div
            className="h-full w-full origin-top bg-accent"
            style={reduced ? { scaleY: 1 } : { scaleY: drawn }}
          />
        </div>

        <ol ref={trackRef} className="space-y-12">
          {experience.map((role, index) => {
            // Mobile: every card enters from the left. Desktop: alternate.
            // `resolveVariants` drops the slide (and its offset) under reduced motion.
            const fromLeft = stacked || index % 2 === 0;
            const variants = resolveVariants(fromLeft ? slideLeft : slideRight, reduced);

            return (
              <li
                key={role.id}
                className="relative pl-12 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:pl-0"
              >
                {/* Node sitting on the rail. */}
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-1.5 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-border bg-accent lg:left-1/2"
                />

                <motion.article
                  variants={variants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  className={cn(
                    GLASS,
                    'p-6',
                    fromLeft ? 'lg:col-start-1 lg:mr-8' : 'lg:col-start-2 lg:ml-8',
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                      {role.position}
                    </h3>
                    <time className="font-mono text-micro text-muted">
                      {formatRange(role.range)}
                    </time>
                  </div>

                  <p className="mt-1 text-sm font-medium text-accent">{role.company}</p>

                  <ul className="mt-4 space-y-2.5">
                    {role.description.map((line) => (
                      <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span
                          aria-hidden="true"
                          className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>

                  {role.technologies.length > 0 ? (
                    <p className="mt-4 font-mono text-micro text-muted">
                      {role.technologies.join(' · ')}
                    </p>
                  ) : null}
                </motion.article>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
