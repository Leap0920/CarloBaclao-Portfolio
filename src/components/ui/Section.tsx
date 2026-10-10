import Shuffle from '@/components/reactbits/Shuffle/Shuffle';
import { ScrollText } from '@/components/ui/ScrollText';
import { cn } from '@/lib/cn';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Removes the hairline, for the first section on the page. */
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
 * `data-snap` is the scroll-snap stop. Snapping is declared on `html`
 * (see globals.css) and is `proximity`, desktop-only and off under
 * reduced motion, so this attribute is inert everywhere else.
 *
 * `scroll-mt-24` (96px) is the nav island's own offset: the island is
 * ~56px tall plus a 16px top gap, and the extra 24px is the clearance
 * between the island's bottom edge and the heading. It lives here and
 * NOT as `scroll-padding-top` on the scrollport: the two would add up
 * and land every anchor twice as far down as intended.
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
           once the next section's hairline sits on it. */
        'relative scroll-mt-24 pt-[var(--space-section)] pb-[calc(var(--space-section)*1.15)]',
        border &&
          'seam border-t border-hairline before:absolute before:-top-px before:inset-x-0 before:h-px before:bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--accent)_38%,transparent),transparent)]',
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
   * Small uppercase label above the title. Optional, and rationed: at
   * most one eyebrow per three sections on the page. If everything is
   * labelled, nothing is.
   */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional element pinned to the right of the title on wide screens. */
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn('relative mb-14 sm:mb-20 lg:mb-24', className)}>
      {eyebrow ? (
        <div className="rise flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            {eyebrow}
          </span>
        </div>
      ) : null}

      <div
        className={cn(
          'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10',
          eyebrow ? 'mt-4 sm:mt-5' : 'mt-0',
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
            {/* Titles arrive as plain strings, which is what Shuffle
                wants; a title that is already markup (a link, a
                fragment) is passed through untouched rather than being
                flattened to text. */}
            {typeof title === 'string' ? (
              /* `splitAria="hidden"` instead of GSAP's default `'auto'`.
                 `'auto'` puts `aria-label` on the split container, which
                 here is this <span> — prohibited on a role-less element
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
