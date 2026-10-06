'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui/Section';
import { education } from '@/data/resume';
import { formatRange } from '@/lib/format';
import { resolveVariants, useSlideVariants, viewportOnce } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

/** The 20px glass recipe. `rounded-card` is the contract name; the landed 20px
 *  token is `--radius` (bare `rounded`), so both are kept so it renders today. */
const GLASS =
  'rounded-card rounded border border-border bg-surface shadow-[var(--shadow-card)]';

export function Education() {
  const reduced = useReducedMotion();
  const { slideLeft, slideRight } = useSlideVariants();

  return (
    <Section id="education">
      <SectionHeading
        index="04"
        eyebrow="Education"
        title="Where I studied"
        description="A degree in progress and the coursework behind the projects."
      />

      {/* Schools — the first card enters from the left, the second from the right. */}
      <div className="grid gap-6 md:grid-cols-2">
        {education.map((item, index) => {
          // `resolveVariants` drops the slide (and its offset) under reduced motion.
          const variants = resolveVariants(index % 2 === 0 ? slideLeft : slideRight, reduced);

          return (
            <motion.article
              key={item.id}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className={cn(GLASS, 'p-6')}
            >
              <p className="font-mono text-micro uppercase tracking-[0.16em] text-accent">
                {formatRange(item.range, { month: false })}
              </p>

              <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-foreground">
                {item.institution}
              </h3>

              <p className="mt-1 text-sm font-medium text-muted">
                {item.degree} in {item.field}
              </p>

              {item.note ? (
                <p className="mt-4 text-sm leading-relaxed text-muted">{item.note}</p>
              ) : null}
            </motion.article>
          );
        })}
      </div>

    </Section>
  );
}
