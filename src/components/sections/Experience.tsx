'use client';

import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { StickyStack, StickyStackItem } from '@/components/ui/Cinematic';
import { experience } from '@/data/resume';
import { formatRange } from '@/lib/format';

/**
 * EXPERIENCE - sticky stacking role plates (layout family, DESIGN.md section 10).
 *
 * Each role is a double-bezel plate that parks a little lower than the one
 * before it, so as the reader scrolls the newest plate rises and covers the
 * last. The pinning and the scrubbed depth (a slight scale and dim on the
 * covered plate) are owned by StickyStack / StickyStackItem; this file supplies
 * only the plates and deliberately does not re-implement either behaviour.
 *
 * The plate reads in the order the data matters: role title, then company, then
 * the date range in mono, then the achievement bullets. Every bullet in the
 * data is kept verbatim, none summarised or dropped.
 *
 * The `.bezel` tray carries the rest elevation (`--elev-card`) and the
 * `.bezel-core` plate carries the machined inner highlight, so the pair reads
 * as hardware at rest.
 *
 * MOBILE FALLBACK, DECLARED EXPLICITLY (DESIGN.md section 8): below 768px (md)
 * the plates must NOT pin. StickyStackItem hardcodes `sticky`, so each item is
 * given `max-md:static`, which wins inside the max-width:767px media query the
 * same way `block md:hidden` wins. Below md the plates are ordinary block boxes
 * in normal flow, separated by the list's own spacing, with no sticky
 * containing block and no pin.
 *
 * HEIGHT: sticky positioning does not change an element's flow box, so the
 * stack adds no height of its own. The travel the reader scrolls through comes
 * from the gaps between plates plus a trailing, non-stacking `<li>` tail that
 * extends the list's flow box so the finished pile lingers after the last plate
 * lands. Below md nothing sticks, so the tail is a single short block.
 */
export function Experience() {
  return (
    <Section id="experience">
      <SectionHeading
        title="Where I have worked"
        description="A software development internship, and clinical data work at a diagnostic center."
      />

      {/* The gaps are the first travel knob: a wider space between plates means
          each one holds at full size for longer before the next covers it. */}
      <StickyStack className="space-y-16 sm:space-y-28 lg:space-y-40">
        {experience.map((role, index) => (
          <StickyStackItem key={role.id} index={index} className="max-md:static">
            <Reveal as="article" y={20} className="bezel">
              <div className="bezel-core p-6 sm:p-8 lg:p-10">
                {/* Identity first: the role title, then the company. */}
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl lg:text-2xl">
                  {role.position}
                </h3>

                <p className="mt-1.5 text-sm font-medium text-muted sm:text-base">
                  {role.company}
                  {role.location ? <span className="text-faint">, {role.location}</span> : null}
                </p>

                {/* One hairline divides the identity from the meta line: the
                    date range in mono and the timeline ordinal, both on the
                    micro step (11px, the hard floor). */}
                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-border pt-4">
                  <time
                    className="font-mono text-micro text-faint"
                    dateTime={
                      role.range.end ? `${role.range.start}/${role.range.end}` : role.range.start
                    }
                  >
                    {formatRange(role.range)}
                  </time>
                  <span
                    aria-hidden="true"
                    className="font-mono text-micro uppercase tracking-[0.14em] text-faint"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {role.description.map((line) => (
                    <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span aria-hidden="true" className="select-none font-mono text-accent">
                        {'-'}
                      </span>
                      <span className="min-w-0">{line}</span>
                    </li>
                  ))}
                </ul>

                {role.technologies.length > 0 ? (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {role.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full bg-surface-2 px-3 py-1 font-mono text-micro text-muted"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Reveal>
          </StickyStackItem>
        ))}

        {/* The second travel knob: a silent tail that extends the list's flow
            box so the pile parks on screen for a long breath after the last
            plate has landed. It carries no `data-stack-item`, so the primitive's
            scrubbed scale never claims it, and it renders nothing. */}
        <li aria-hidden="true" className="h-16 sm:h-52 lg:h-72" />
      </StickyStack>
    </Section>
  );
}
