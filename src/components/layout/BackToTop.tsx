'use client';

import { ArrowUp } from 'lucide-react';
import { useMountTransition } from '@/hooks/useMountTransition';
import { useScrolled } from '@/hooks/useScrollSpy';
import { cn } from '@/lib/cn';

/** Keep in step with the `duration-200` on the button. */
const EXIT_MS = 200;

/** Floating scroll-to-top control, revealed once the hero is out of the way. */
export function BackToTop() {
  const visible = useScrolled(700);
  const { mounted, visible: shown } = useMountTransition(visible, EXIT_MS);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      tabIndex={shown ? undefined : -1}
      className={cn(
        /* `bottom-[calc(var(--statusbar-h)+1rem)]`, not a fixed `bottom-5`:
           the status line is 44px of fixed chrome across the bottom of the
           viewport, and a control parked 20px from the bottom edge sits
           half-underneath it. */
        'fixed bottom-[calc(var(--statusbar-h)+1rem)] right-5 z-40 grid h-11 w-11 place-items-center rounded-full bg-surface-2 text-muted shadow-card transition-[opacity,translate,scale,background-color,color] duration-300 ease-fluid hover:bg-accent hover:text-on-accent sm:right-8 print-hide',
        shown ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-2 scale-90 opacity-0',
      )}
    >
      <ArrowUp size={16} />
    </button>
  );
}
