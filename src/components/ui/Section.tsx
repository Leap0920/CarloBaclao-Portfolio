import Shuffle from '@/components/reactbits/Shuffle/Shuffle';
import { ScrollText } from '@/components/ui/ScrollText';
import { cn } from '@/lib/cn';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Draws the dashed seam across the top. Off for the first section. */
  border?: boolean;
  /**
   * Drops the `max-w-6xl` container so children can run edge to edge.
   *
   * This exists so a full-bleed scene can escape the container WITHOUT a
   * `w-screen -translate-x-1/2` breakout. That trick is the usual way to do
   * this and it is wrong: `100vw` includes the vertical scrollbar, so on
   * Windows Chrome it overflows by ~15px and the page gains a horizontal
   * scrollbar. With `bleed`, a child that wants the container simply wraps
   * itself in `mx-auto w-full max-w-6xl px-5 sm:px-8`.
   */
  bleed?: boolean;
}

/**
 * Consistent vertical rhythm and gutters for every top-level section.
 *
 * The top edge is the `.seam` dashed rule, which draws itself in as the
 * section arrives (a scroll-driven `view()` timeline, so it is a function
 * of position rather than a one-shot). It replaced a solid 1px gradient
 * hairline: a dashed boundary is a line a terminal would draw, and the
 * solid gradient line was the single most generic mark on the page.
 *
 * `data-snap` is the scroll-snap stop. Snapping is declared on `html`
 * (see globals.css) and is `proximity`, desktop-only and off under
 * reduced motion, so this attribute is inert everywhere else.
 *
 * `scroll-mt-24` (96px) clears the top of the viewport for an anchored
 * jump. It lives here and NOT as `scroll-padding-top` on the scrollport:
 * the two would add up and land every anchor twice as far down as
 * intended.
 */
export function Section({ id, children, className, border = true, bleed = false }: SectionProps) {
  return (
    <section
      id={id}
      data-snap
      className={cn(
        /* One knob for the page's vertical air: the token, not a class
           ramp. The bottom padding is deliberately 15% larger than the
           top, because equal top and bottom padding reads bottom-heavy
           once the next section's seam sits on it. */
        'relative scroll-mt-24 pt-[var(--space-section)] pb-[calc(var(--space-section)*1.15)]',
        border && 'seam',
        className,
      )}
    >
      {bleed ? (
        children
      ) : (
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
      )}
    </section>
  );
}

/** The container a `bleed` section re-applies around content it wants inset. */
export const sectionContainer = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

interface SectionHeadingProps {
  /**
   * Two-digit section number, e.g. `'02'`.
   *
   * Accepted but deliberately NOT rendered. Section-number eyebrows are
   * banned outright: a numbered section is a tell that the page was
   * assembled from a template, and the number tells the reader nothing
   * the heading does not. The prop survives so the call sites that
   * still pass it do not have to be found first.
   */
  index?: string;
  /**
   * The command line above the title, e.g. `'~/projects'`. It is the
   * heading's eyebrow, spelled the way this theme spells things: a shell
   * invocation. Rendered in the mono face in the accent colour, after a
   * `$`, with a dashed rule running to the right margin - so the heading
   * reads as a command and its output rather than as a label and a title.
   */
  command: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional element pinned to the right of the title on wide screens. */
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  command,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn('relative mb-14 sm:mb-20 lg:mb-24', className)}>
      <div className="rise flex items-center gap-3 font-mono text-[11px] tracking-[0.08em]">
        <span aria-hidden="true" className="text-faint">
          $
        </span>
        <span className="text-accent">{command}</span>
        {/* The dashed rule that runs from the command to the margin. It
            is what makes the line read as a shell transcript rather than
            as an eyebrow with a decorative stroke next to it. */}
        <span aria-hidden="true" className="rule-dash h-px flex-1" />
      </div>

      <div
        className={cn(
          'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10',
          'mt-4 sm:mt-5',
        )}
      >
        <div className="max-w-2xl">
          <h2
            className="rise-2 text-title font-semibold text-foreground"
            /* The name lives here rather than on the split span below: a
               heading's role supports `aria-label`, a role-less span's does
               not (WCAG 4.1.2). Only applied for the string form, since a
               title that is already markup names itself. */
            aria-label={typeof title === 'string' ? title : undefined}
          >
            {/* `type-in` wipes the title in from the left as it enters,
                scrubbed by the heading's own travel through the viewport:
                the words appear in reading order at reading speed, and
                scroll back up and they un-type. It sits on an inner span
                because `rise-2` already owns the element's `animation`
                shorthand and two classes cannot both set it.

                The clip is not a removal - the `<h2>` above still carries
                the text for a screen reader and for search - which is why
                this is only ever applied to a heading, never to body
                copy. */}
            <span className="type-in inline-block">
              {/* Titles arrive as plain strings, which is what Shuffle
                  wants; a title that is already markup (a link, a
                  fragment) is passed through untouched rather than being
                  flattened to text. */}
              {typeof title === 'string' ? (
                /* `splitAria="hidden"` instead of GSAP's default `'auto'`.
                   `'auto'` puts `aria-label` on the split container, which
                   here is this <span> - prohibited on a role-less element
                   and a real audit failure. With `'hidden'` the split
                   characters stay hidden and the <h2> above supplies the
                   name, so the text is announced once, correctly. */
                <Shuffle
                  text={title}
                  tag="span"
                  textAlign="left"
                  triggerOnce
                  splitAria="hidden"
                />
              ) : (
                title
              )}
            </span>
          </h2>
          {description ? (
            /* The lead paragraph is where the page's scroll-linked
               reading happens: `ScrollText` scrubs its words from dim
               to full as the block crosses the viewport. It only
               accepts a plain string, so a description that arrives as
               markup falls back to a static paragraph rather than
               being flattened to text. */
            typeof description === 'string' ? (
              <ScrollText className="rise-3 mt-5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                {description}
              </ScrollText>
            ) : (
              <p className="rise-3 mt-5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                {description}
              </p>
            )
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
