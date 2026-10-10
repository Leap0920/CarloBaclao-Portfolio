'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

/**
 * The route error boundary. Next's own error screen is bare system text with
 * no branding and no way back, which is the same problem `not-found.tsx`
 * solves for a 404.
 *
 * It renders INSIDE the root layout, so the token layer is available and this
 * file needs no colours of its own.
 *
 * The button acts immediately: it calls `reset()` and nothing else. The copy
 * says what happened in one line rather than explaining the framework.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-24 text-center focus:outline-none sm:px-8"
    >
      <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Error</p>

      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Something broke on this page
      </h1>

      <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
        The page failed to render. Trying again usually clears it.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-card bg-accent px-6 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </button>

        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-card border border-border-strong px-6 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to the portfolio
        </Link>
      </div>

      {error.digest ? (
        <p className="mt-8 font-mono text-xs text-muted">Reference {error.digest}</p>
      ) : null}
    </main>
  );
}
