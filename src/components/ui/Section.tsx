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
        'scroll-mt-20 py-20 sm:py-24 lg:py-28',
        border && 'border-t border-hairline',
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
    <header className={cn('mb-12 sm:mb-14', className)}>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] tabular-nums text-accent-500">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-zinc-300" />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
          {eyebrow}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
