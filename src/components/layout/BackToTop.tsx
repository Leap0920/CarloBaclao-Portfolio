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
        'fixed bottom-5 right-5 z-40 grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white/90 text-zinc-600 shadow-sm backdrop-blur transition duration-200 ease-out-expo hover:border-zinc-300 hover:text-zinc-900 sm:bottom-8 sm:right-8 print-hide',
        shown ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-2 scale-90 opacity-0',
      )}
    >
      <ArrowUp size={16} />
    </button>
  );
}
