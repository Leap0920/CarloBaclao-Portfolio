'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { navSections } from '@/data/navigation';
import { profile } from '@/data/profile';
import { useMountTransition } from '@/hooks/useMountTransition';
import { useScrollSpy, useScrolled } from '@/hooks/useScrollSpy';
import { cn } from '@/lib/cn';
import { ScrollProgress } from './ScrollProgress';

/** Keep in step with the `duration-300` on the drawer. */
const DRAWER_MS = 300;

export function SiteHeader() {
  const active = useScrollSpy();
  const scrolled = useScrolled(10);
  const [menuOpen, setMenuOpen] = useState(false);
  const { mounted: drawerMounted, visible: drawerVisible } = useMountTransition(menuOpen, DRAWER_MS);

  // Close the drawer on Escape, and whenever the layout grows to desktop.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onBreakpoint = () => desktop.matches && setMenuOpen(false);

    window.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onBreakpoint);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onBreakpoint);
    };
  }, [menuOpen]);

  // Stop the page scrolling behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300 print-hide',
        scrolled ? 'glass border-b border-hairline/80' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <a
          href="#top"
          className="group flex items-center gap-3 rounded-md"
          aria-label={`${profile.name} — back to top`}
        >
          <span className="grid h-10 w-10 lg:h-9 lg:w-9 place-items-center rounded-lg bg-zinc-900 font-mono text-[13px] font-medium text-white transition-colors group-hover:bg-accent-600">
            CB
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold tracking-tight text-ink">
              {profile.name}
            </span>
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              {profile.role}
            </span>
          </span>
        </a>

        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex items-center gap-0 xl:gap-0.5">
            {navSections.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative block rounded-full px-2.5 py-1.5 text-[13px] transition-colors',
                      isActive ? 'text-ink' : 'text-faint hover:text-ink',
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-zinc-100"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative">{section.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${profile.email}`}
            className="hidden items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-600 md:inline-flex"
          >
            Get in touch
            <ArrowUpRight size={14} />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 lg:h-9 lg:w-9 place-items-center rounded-lg border border-hairline text-ink-soft transition-colors hover:bg-zinc-50 lg:hidden"
          >
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      <ScrollProgress />

      {drawerMounted ? (
        <div
          id="mobile-nav"
          className={cn(
            'grid overflow-hidden border-t bg-white transition-[grid-template-rows,opacity] duration-300 ease-out-expo lg:hidden',
            drawerVisible
              ? 'grid-rows-[1fr] border-hairline/80 opacity-100'
              : 'grid-rows-[0fr] border-transparent opacity-0',
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <nav aria-label="Sections" className="mx-auto w-full max-w-6xl px-5 py-4 sm:px-8">
              <ul className="grid grid-cols-2 gap-1">
                {navSections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'block rounded-lg px-3 py-2.5 text-sm transition-colors',
                        active === section.id
                          ? 'bg-zinc-100 font-medium text-ink'
                          : 'text-muted hover:bg-zinc-50 hover:text-ink',
                      )}
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-zinc-100 pt-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
                >
                  Get in touch
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
