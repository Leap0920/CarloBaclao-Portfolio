'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/cn';

/**
 * Accessible dark/light switch.
 *
 * - 44x44 hit area, always visible (never revealed on hover).
 * - `aria-label` describes the action, not the state.
 * - Both icons are rendered and swapped by CSS (`.dark` on <html>), so
 *   there is no hydration flash and no client-only icon choice.
 * - Keyboard focus is handled by the global `:focus-visible` ring in
 *   globals.css, and re-stated here so the button is self-contained.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme, mounted } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const label = !mounted
    ? 'Toggle colour theme'
    : isDark
      ? 'Switch to light theme'
      : 'Switch to dark theme';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className={cn(
        'grid h-11 w-11 place-items-center rounded-full border border-border bg-surface/85 text-muted shadow-sm backdrop-blur transition-colors duration-200 ease-out-expo hover:border-accent/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        className,
      )}
    >
      <Sun aria-hidden="true" size={19} strokeWidth={1.75} className="hidden dark:block" />
      <Moon aria-hidden="true" size={19} strokeWidth={1.75} className="block dark:hidden" />
    </button>
  );
}
