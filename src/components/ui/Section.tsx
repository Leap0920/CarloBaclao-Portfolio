import { cn } from '@/lib/cn';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Removes the hairline, for the first section on the page. */
  border?: boolean;
}

/** Consistent vertical rhythm and gutters for every top-level section. */
export function Section({ id, children, className, border = true }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-20 py-14 sm:py-24 lg:py-28',
        border &&
          'relative border-t border-hairline before:absolute before:-top-px before:inset-x-0 before:h-px before:bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--accent)_22%,transparent),transparent)]',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  /** Two-digit section number, e.g. `'02'`. */
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional element pinned to the right of the title on wide screens. */
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn('relative mb-9 sm:mb-14', className)}>
      {/* Oversized ghost numeral — a watermark, not content. It echoes the
          index in the eyebrow row at a size that only registers in passing. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 right-0 hidden select-none font-display text-[7rem] font-semibold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_color-mix(in_oklab,var(--foreground)_14%,transparent)] sm:block lg:text-[8.5rem]"
      >
        {index}
      </span>

      <div className="rise flex items-center gap-3">
        <span className="font-mono text-[11px] tabular-nums text-accent-500">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-border" />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
          {eyebrow}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div className="max-w-2xl">
          <h2 className="rise-2 text-[1.75rem]/[1.2] font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="rise-3 mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted sm:mt-4 sm:text-base">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
