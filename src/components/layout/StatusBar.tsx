'use client';

import { useEffect, useRef, useState } from 'react';
import { navSections } from '@/data/navigation';
import { cn } from '@/lib/cn';

/** Must match `--gutter-pitch` in globals.css. */
const PITCH = 32;

/**
 * The status line: a shell's bottom bar, and the page's navigation.
 *
 * A terminal puts the session state on a status line - mode, working
 * directory, position - and this page is a session, so that is where its
 * chrome went. Three things share the row:
 *
 *   1. The SECTION PATHS, as clickable `~/<id>` entries. This is the
 *      page's navigation, on the surface and always visible: the fixed
 *      nav island was deleted from this design, and burying the anchors
 *      in a drawer or a menu would put the one control a reader needs
 *      behind a gesture. The active path carries a `❯` prompt glyph -
 *      the cursor has moved to the line you are on - which is the whole
 *      scroll-spy feedback, and it costs a `❯` rather than a pill.
 *   2. The active path alone, below `lg`, where the full list will not
 *      fit. The footer carries the same anchors for anyone who wants to
 *      jump.
 *   3. The READOUT: the current line and the percentage of the buffer
 *      consumed, in tabular figures so the digits do not jitter as they
 *      count. The percentage is also drawn as the hairline fill across
 *      the top edge of the bar, which is a CSS scroll-driven animation
 *      (`.scroll-fill`) and therefore costs no JavaScript at all.
 *
 * WHY THERE IS A SCROLL LISTENER HERE, WHEN THE REST OF THE PAGE HAS
 * NONE. A number is not something CSS can derive from a scroll position
 * yet, and a readout that silently stops updating is worse than no
 * readout. So this is one passive, rAF-coalesced listener - the same
 * pattern `ScrollProgress` already uses - that writes `textContent` and
 * a class straight to the DOM. It sets React state ONLY when the active
 * section actually changes, so scrolling does not re-render the tree.
 * It deliberately does not run on the server, and it works identically
 * under reduced motion, because a position readout is information, not
 * decoration.
 */
export function StatusBar() {
  const [active, setActive] = useState<string>(navSections[0]?.id ?? 'home');
  const lineRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;

      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;

      // The line number the playhead is sitting on, in the gutter's own
      // units, so the two readouts agree.
      const line = Math.max(1, Math.round(y / PITCH) + 1);
      const pct = scrollable > 0 ? Math.min(100, Math.max(0, (y / scrollable) * 100)) : 0;

      if (lineRef.current) lineRef.current.textContent = `ln ${line}`;
      if (pctRef.current) pctRef.current.textContent = `${pct.toFixed(0)}%`;

      // A section takes over once its top edge passes the top 30% of the
      // viewport, so the prompt follows what the reader is looking at
      // rather than lagging a whole section behind.
      const band = Math.max(120, Math.round(window.innerHeight * 0.3));
      let current = navSections[0]?.id ?? 'home';
      for (const section of navSections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= band) current = section.id;
      }
      if (window.innerHeight + y >= doc.scrollHeight - 8) {
        current = navSections[navSections.length - 1]?.id ?? current;
      }

      setActive((previous) => (previous === current ? previous : current));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div className="print-hide fixed inset-x-0 bottom-0 z-50 h-[calc(var(--statusbar-h)+env(safe-area-inset-bottom))] border-t border-border bg-surface-2 pb-[env(safe-area-inset-bottom)]">
      {/* The consumed fraction of the buffer. CSS scroll-driven, so it is
          exact at every scroll position and needs no JavaScript. */}
      <div aria-hidden="true" className="scroll-fill absolute inset-x-0 top-0 h-px bg-accent" />

      <div className="mx-auto flex h-[var(--statusbar-h)] w-full max-w-6xl items-center gap-4 px-3 sm:px-5">
        <span className="hidden shrink-0 items-center rounded-sm bg-accent px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-on-accent sm:inline-flex">
          shell
        </span>

        {/* The full path list. `lg` and up, because below that the row
            cannot hold seven paths and a readout without one of them
            being unreadable. */}
        <nav aria-label="Page sections" className="hidden min-w-0 lg:block">
          <ul className="flex items-center">
            {navSections.map((section) => {
              const isActive = section.id === active;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'inline-flex min-h-11 items-center gap-1.5 rounded-sm px-2 font-mono text-xs transition-colors duration-300 ease-fluid',
                      isActive ? 'text-accent' : 'text-muted hover:text-foreground',
                    )}
                  >
                    {/* The prompt glyph marks the current line. It keeps
                        its width when inactive, so the row does not
                        shift as the reader scrolls. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'transition-opacity duration-300 ease-fluid',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      ❯
                    </span>
                    <span>~/{section.id}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Below `lg`, the working directory alone. */}
        <p className="min-w-0 flex-1 truncate font-mono text-xs lg:hidden">
          <span aria-hidden="true" className="text-accent">
            ❯{' '}
          </span>
          <span className="text-faint">carlo@baclao</span>
          <span className="text-faint">:</span>
          <span className="text-accent">~/{active}</span>
        </p>

        <p className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-faint">
          <span ref={lineRef} className="hidden sm:inline">
            ln 1
          </span>
          <span aria-hidden="true" className="hidden sm:inline">
            {' · '}
          </span>
          <span ref={pctRef}>0%</span>
        </p>
      </div>
    </div>
  );
}
