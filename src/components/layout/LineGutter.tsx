'use client';

import { useEffect, useState } from 'react';

/** Must match `--gutter-pitch` in globals.css. */
const PITCH = 32;
/** One numbered label every N lines; the ruler below ticks every line. */
const LABEL_EVERY = 2;
/** The server-rendered line count. The client corrects it on mount. */
const DEFAULT_LINES = 420;
const MAX_LINES = 6000;

/**
 * The line-number gutter down the left edge.
 *
 * This is the page's reading position rendered the way an editor renders
 * it: a ruler of hairlines with a number every five lines, a fixed
 * playhead band, and the whole column translating as the reader scrolls.
 * It is the single clearest statement of the theme - the page is a
 * buffer, not a document - and it costs nothing to run:
 *
 *   - The translation is a CSS scroll-driven animation
 *     (`.gutter-track`, `animation-timeline: scroll(root block)`), so it
 *     is a pure function of scroll position and lives on the compositor.
 *     No scroll listener, no rAF loop, and it works with JavaScript
 *     disabled.
 *   - The only JavaScript here runs ONCE: it measures how tall the page
 *     is and emits enough lines to cover it. A ResizeObserver on the
 *     document element re-measures when the page height changes (a
 *     viewport resize, a reveal playing), and a `setLines` to the same
 *     value is a React bail-out, so this does not re-render on scroll.
 *
 * DESKTOP ONLY, from `xl`. At 1280px the content column starts at x=64
 * and the gutter is exactly 64px wide, so it sits in the margin and can
 * never overlap a section; below that there is no margin to sit in. It
 * is `aria-hidden` throughout: a screen reader gains nothing from 84
 * decorative numbers, and the status line carries the real readout.
 */
export function LineGutter() {
  const [lines, setLines] = useState(DEFAULT_LINES);

  useEffect(() => {
    const measure = () => {
      const height = document.documentElement.scrollHeight;
      const needed = Math.ceil(height / PITCH) + LABEL_EVERY;
      setLines(Math.min(MAX_LINES, Math.max(DEFAULT_LINES, needed)));
    };

    measure();

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure);
      observer.observe(document.documentElement);
    }
    window.addEventListener('resize', measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const labels: number[] = [];
  for (let line = LABEL_EVERY; line <= lines; line += LABEL_EVERY) labels.push(line);

  return (
    <div
      aria-hidden="true"
      className="print-hide pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-16 overflow-hidden xl:block"
      style={{
        // The column fades at both ends rather than being cut off. A mask
        // paints nothing, so the stage behind it is never covered by a
        // second, slightly-wrong background colour.
        maskImage: 'linear-gradient(180deg, transparent 0, #000 6%, #000 94%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0, #000 6%, #000 94%, transparent 100%)',
      }}
    >
      {/* The ruler: one hairline per line, so the column reads as a scale
          and not as a list. Drawn as a repeating gradient, so it costs
          one element at any page height. */}
      <div
        className="absolute inset-y-0 right-2 w-2.5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, var(--border) 0 1px, transparent 1px 32px)',
        }}
      />

      {/* The numbers. Absolutely placed at their true line position, so
          the label and the ruler tick beside it can never drift apart.
          `gutter-track` translates the whole column as the page scrolls:
          its travel is its own height minus a viewport, which lands the
          last line at the bottom edge exactly when the page bottoms out. */}
      <div
        className="gutter-track absolute inset-x-0 top-0"
        style={{ height: `${lines * PITCH}px` }}
      >
        {labels.map((line) => (
          <span
            key={line}
            className="absolute right-6 font-mono text-[11px] leading-none text-muted"
            style={{ top: `${(line - 1) * PITCH}px` }}
          >
            {String(line).padStart(3, '0')}
          </span>
        ))}
      </div>

      {/* The playhead. Fixed to the viewport, so the numbers scroll past
          it and the band always marks "you are here". It is the one
          element in this component that does not move, and the prompt
          glyph on its leading edge is the cursor that makes it read as a
          cursor rather than as a smudge on the page edge. */}
      <div
        className="absolute inset-x-0 border-y border-accent/45 border-l-2 border-l-accent bg-accent/10"
        style={{ top: '38vh', height: `${PITCH}px` }}
      >
        <span
          aria-hidden="true"
          className="absolute left-1.5 top-1/2 -translate-y-1/2 font-mono text-[11px] leading-none text-accent"
        >
          ❯
        </span>
      </div>
    </div>
  );
}
