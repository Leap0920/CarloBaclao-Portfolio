import { navSections } from '@/data/navigation';
import { profile } from '@/data/profile';

/**
 * The quietest band on the page: who this is, the year, and the section links.
 *
 * The band is a double-bezel plate rather than a full-bleed strip with a rule
 * across the top. A 1px grey rule spanning the viewport draws a hard line
 * across the page and makes the footer read as leftover space below the
 * content; a floating plate reads as the last object in the composition
 * instead.
 *
 * Deliberately nothing else: no version string, no build hash, no locale or
 * time readout, no weather strip, no decorative status dot. Those are banned,
 * and the footer is the wrong place to spend a reader's attention. The link
 * list is `navSections` from `src/data/navigation.ts`, the same list that
 * drives the header nav, so the two can never drift apart.
 *
 * Below 640px (`sm`) the plate stacks: the name and year sit above the link
 * list. From `sm` up they share one row, the links pushed to the trailing edge.
 * Every link keeps a 44px tap target, and nothing here needs a bundle: the
 * footer is a server component with no motion and no state.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="print-hide px-5 pb-10 pt-4 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="bezel">
          <div className="bezel-core p-6 sm:p-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-display text-lg font-semibold tracking-tight text-foreground">
                  {profile.name}
                </p>
                <p className="mt-2 font-mono text-xs text-faint">&copy; {year}</p>
              </div>

              <nav aria-label="Page sections">
                <ul className="flex flex-wrap gap-x-1 gap-y-1">
                  {navSections.map(({ id, label }) => (
                    <li key={id}>
                      {/* `px-3` plus `min-h-11` gives every label, including the
                          shortest, a hit box of at least 44x44 without drawing
                          a background or a border. */}
                      <a
                        href={`#${id}`}
                        className="inline-flex min-h-11 items-center px-3 text-sm text-muted transition-colors duration-300 ease-fluid hover:text-foreground"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
