'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { experience } from '@/data/resume';
import { formatRange } from '@/lib/format';
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

/** The viewport fractions the rail tracks between: progress is 0 as the track's
 *  top reaches 80% of the viewport height, and 1 once its bottom has climbed to
 *  45%. Mirrors the previous `useScroll({ offset: ['start 80%', 'end 45%'] })`. */
const RAIL_START = 0.8;
const RAIL_END = 0.45;

/**
 * Draws the timeline rail from real scroll position — the effect the previous
 * `useScroll` + `useSpring` pair produced, hand-rolled so the section carries no
 * framer dependency. Progress is written straight to the rail as a `scaleY`
 * transform (never a height animation), so the draw stays on the compositor.
 * Layout is read once per pass, coalesced to a single frame callback. Under
 * reduced motion the rail is pinned fully drawn.
 */
function useRailProgress(
  trackRef: RefObject<HTMLOListElement | null>,
  railRef: RefObject<HTMLDivElement | null>,
  reduced: boolean,
) {
  useEffect(() => {
    const track = trackRef.current;
    const rail = railRef.current;
    if (!track || !rail) return;

    if (reduced) {
      rail.style.transform = 'scaleY(1)';
      return;
    }

    let frame = 0;

    const draw = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * RAIL_START;
      // The distance the track travels between the two offsets: its own height
      // plus the (start − end) gap of the viewport.
      const total = rect.height + viewport * (RAIL_START - RAIL_END);
      const progress = total > 0 ? (start - rect.top) / total : 1;
      const clamped = progress < 0 ? 0 : progress > 1 ? 1 : progress;
      rail.style.transform = `scaleY(${clamped})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [trackRef, railRef, reduced]);
}

export function Experience() {
  const reduced = useReducedMotion();
  const stacked = useIsStacked();
  const trackRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useRailProgress(trackRef, railRef, reduced);

  return (
    <Section id="experience">
      <SectionHeading
        index="03"
        eyebrow="Experience"
        title="Where I have worked"
        description="A software development internship, and clinical data work at a diagnostic center."
      />

      {/* overflow-x-clip: the rail and the sliding cards can never add a
          horizontal scrollbar, however wide the transient transform is. */}
      <div className="relative overflow-x-clip">
        {/* The rail — full height, revealed from the top via scaleY. */}
        <div
          aria-hidden="true"
          className="absolute left-2.5 top-0 h-full w-px -translate-x-1/2 bg-border sm:left-4 lg:left-1/2"
        >
          <div ref={railRef} className="h-full w-full origin-top bg-accent" />
        </div>

        <ol ref={trackRef} className="space-y-8 sm:space-y-12">
          {experience.map((role, index) => {
            // Mobile: every card enters from the left. Desktop: alternate.
            const fromLeft = stacked || index % 2 === 0;

            return (
              <li
                key={role.id}
                className="relative pl-7 sm:pl-12 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:pl-0"
              >
                {/* Node sitting on the rail. */}
                <span
                  aria-hidden="true"
                  className="absolute left-2.5 top-1.5 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-border bg-accent sm:left-4 lg:left-1/2"
                />

                <Reveal
                  as="article"
                  y={0}
                  x={fromLeft ? -80 : 80}
                  className={cn(
                    GLASS,
                    'p-5 sm:p-6',
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

                  <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
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
                    <p className="mt-3 font-mono text-micro text-muted sm:mt-4">
                      {role.technologies.join(' · ')}
                    </p>
                  ) : null}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
