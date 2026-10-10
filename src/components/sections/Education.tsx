'use client';

import gsap from 'gsap';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { useScrollFx } from '@/lib/scrollFx';
import { education } from '@/data/resume';
import { formatRange } from '@/lib/format';

/**
 * EDUCATION - layout family "Editorial split with a sticky rail"
 * (DESIGN.md section 10).
 *
 * The section heading sits above a two-column split. The LEFT rail holds the
 * current degree and its school, pinned in place; the RIGHT column is the
 * chronicle of every institution, scrolling past it. That is deliberately
 * distinct from Experience's stacking plates: nothing here is a card, the
 * entries are separated by hairlines and read as an edited list.
 *
 * The pinning is pure CSS `position: sticky`. No GSAP is involved in it, and
 * none should be: a sticky rail is a layout affordance, not a scrubbed
 * animation, so it must work even if the motion bundle never loads.
 *
 * MOTION LAYER (desktop only, scrubbed, transform only): the rail carries a
 * progress hairline that fills as the chronicle travels past the pinned rail,
 * the pin's own progress drawn in ink. It is registered inside `useScrollFx`
 * behind a `gsap.matchMedia('(min-width: 768px)')` gate, so below 768px no
 * ScrollTrigger is created at all and the hairline rests as a plain full-width
 * divider. Under `prefers-reduced-motion` the hook never attaches and every
 * element keeps its fully-visible CSS state.
 *
 * MOBILE FALLBACK, DECLARED EXPLICITLY (DESIGN.md section 8): below 768px (md)
 * the grid is off entirely and the two columns collapse into ONE column in
 * normal flow, the rail first, the chronicle under it. `position: sticky` is
 * only switched on at md, so a phone never gets a pinned rail it cannot use.
 * The base (unprefixed) classes below are the single-column phone layout; the
 * `md:` variants are what turn the split on.
 *
 * Every string rendered here is drawn from the `education` export; the rail's
 * lead degree is the entry still in progress (the one with no end date), not a
 * hardcoded name.
 */
export function Education() {
  const split = useScrollFx<HTMLDivElement>(() => {
    const root = split.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const chronicle = root.querySelector<HTMLElement>('[data-chronicle]');
      const progress = root.querySelector<HTMLElement>('[data-rail-progress]');
      if (!chronicle || !progress) return;

      // The rail's hairline fills as the chronicle travels past the pinned
      // rail. Transform only, constant speed: a progress line must not ease,
      // or it stops measuring the scroll.
      gsap.fromTo(
        progress,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: chronicle,
            start: 'top 72%',
            end: 'bottom 55%',
            scrub: true,
          },
        },
      );
    });

    // gsap.context reverts the tweens; matchMedia owns its own set, so it is
    // reverted explicitly on unmount, and on a resize below md, which restores
    // the hairline to its plain CSS state.
    return () => mm.revert();
  });

  // The lead credential: the degree still in progress, falling back to the
  // first entry if the data ever carries an end date for every row.
  const current = education.find((item) => !item.range.end) ?? education[0];

  return (
    <Section id="education">
      <SectionHeading
        title="Where I studied"
        description="A degree in progress and the coursework behind the projects."
      />

      {/*
        THE SPLIT.

        <768px - the default, mobile-first state: this is a plain block, so the
        rail and the chronicle simply stack in document order (degree, then the
        list). No grid, no sticky.

        >=768px (md) - a two-track grid: a fixed rail and a fluid chronicle
        column, widening the rail at `lg` and `xl`. `items-start` is load
        bearing: it stops the rail stretching to the full row height, which
        would leave `position: sticky` nothing to travel within.

        The ref is the scroll-fx scope: the progress hairline is queried from
        here and gated to md inside the hook.
      */}
      <div
        ref={split}
        className="md:grid md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:items-start md:gap-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:gap-20"
      >
        {/*
          THE STICKY RAIL.

          `md:self-start` + `md:sticky md:top-24` is the whole effect: the rail
          sits in normal flow until the column scrolls past 6rem (clearing the
          floating nav island), then pins there while the taller chronicle
          keeps going. Pure CSS: nothing here waits on JavaScript.
        */}
        {/* A plain div, not an <aside>. `aside` is the `complementary`
            landmark, and axe fails a landmark nested inside another one
            (`landmark-complementary-is-top-level`) — this rail sits inside the
            page's <main>. The content is part of this section rather than a
            tangential aside, so it should not be a landmark at all. */}
        <div className="md:sticky md:top-24 md:self-start">
          <time className="block font-mono text-micro text-muted" dateTime={current.range.start}>
            {formatRange(current.range)}
          </time>

          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
            {current.degree} in {current.field}
          </h3>

          <p className="mt-3 text-base text-ink-soft">{current.institution}</p>

          {/* The progress hairline. The track is a faint divider; the fill is
              ink and scales from the left as the chronicle scrolls past the
              pinned rail. The CSS resting state is a FULL line, so a phone -
              where no scrub is ever created - and a failed bundle both see an
              ordinary hairline, never an empty gap. */}
          <div className="mt-7" aria-hidden="true">
            <div className="relative h-px w-full bg-border">
              <div data-rail-progress className="absolute inset-0 origin-left bg-accent" />
            </div>
          </div>
        </div>

        {/*
          THE CHRONICLE.

          One column, so the entries stack at every width; the composition comes
          from the sticky rail beside them. `mt-10 md:mt-0` is the phone gap
          between the rail and the list, handed to the grid's `gap-10` once the
          columns sit side by side. Hairline separators rather than cards, so
          this section never reads as a second stack of plates.
        */}
        <div className="mt-10 md:mt-0" data-chronicle>
          <ol className="border-t border-border">
            {education.map((item, index) => (
              <Reveal
                key={item.id}
                as="li"
                y={18}
                delay={index * 0.06}
                className="border-b border-border py-7 sm:py-9 lg:py-11"
              >
                <div className="flex gap-4 sm:gap-6">
                  <span
                    aria-hidden="true"
                    className="pt-0.5 font-mono text-micro uppercase tracking-[0.14em] text-muted"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0">
                    {/* Dates are real `<time>` elements; year-only keeps the
                        stamp short and reads editorially. */}
                    <time
                      className="font-mono text-micro text-muted"
                      dateTime={
                        item.range.end ? `${item.range.start}/${item.range.end}` : item.range.start
                      }
                    >
                      {formatRange(item.range, { month: false })}
                    </time>

                    <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                      {item.institution}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-muted">
                      {item.degree} in {item.field}
                    </p>

                    {item.note ? (
                      <p className="mt-2.5 max-w-[60ch] text-sm leading-relaxed text-muted">
                        {item.note}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* The closing marker: a mono tally drawn from the data, so the rail's
              journey has a visible terminus instead of stopping at the last
              entry's edge. Real text, not a baked image. */}
          <Reveal y={14}>
            <p className="mt-6 font-mono text-micro uppercase tracking-[0.14em] text-muted">
              {`${String(education.length).padStart(2, '0')} institutions, degree in progress`}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
