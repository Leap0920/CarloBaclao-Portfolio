import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { navSections } from '@/data/navigation';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

/**
 * The 404. Without this file Next serves its own bare error page — black
 * system text on white, no branding, no way back. This one is built from the
 * same tokens as the rest of the site.
 *
 * The header and footer live in `page.tsx`, not the root layout, so this route
 * carries its own wayfinding: one primary route home and the section links.
 */
export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-24 text-center focus:outline-none sm:px-8"
    >
      <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">404</p>

      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        This page does not exist
      </h1>

      <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
        The link may be out of date, or the page may have moved.
      </p>

      <Link
        href="/"
        className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-card rounded bg-accent px-6 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to the portfolio
      </Link>

      <nav aria-label="Sections" className="mt-14 border-t border-border pt-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {navSections
            .filter((section) => section.id !== 'home')
            .map((section) => (
              <li key={section.id}>
                <Link
                  href={`/#${section.id}`}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {section.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </main>
  );
}
