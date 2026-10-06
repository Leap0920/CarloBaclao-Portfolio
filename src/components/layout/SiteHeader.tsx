'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { navSections } from '@/data/navigation';
import { profile } from '@/data/profile';
import { useMountTransition } from '@/hooks/useMountTransition';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollSpy, useScrolled } from '@/hooks/useScrollSpy';
import { cn } from '@/lib/cn';
import { EASE } from '@/lib/motion';

/** Keep in step with the drawer's CSS transition. */
const DRAWER_MS = 300;

export function SiteHeader() {
  const active = useScrollSpy();
  const scrolled = useScrolled(8);
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const { mounted: drawerMounted, visible: drawerVisible } = useMountTransition(menuOpen, DRAWER_MS);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const closeMenu = useCallback((refocus = false) => {
    setMenuOpen(false);
    if (refocus) window.requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  // Escape closes the drawer; growing to the desktop breakpoint closes it too.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu(true);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onBreakpoint = () => {
      if (desktop.matches) setMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onBreakpoint);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onBreakpoint);
    };
  }, [menuOpen, closeMenu]);

  // Land keyboard focus in the panel when it opens.
  useEffect(() => {
    if (!drawerVisible) return;
    const timer = window.setTimeout(() => firstLinkRef.current?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(timer);
  }, [drawerVisible]);

  return (
    <motion.header
      // Opacity stays at 1 so the nav is never stuck invisible before (or
      // without) hydration; only a restrained 10px settle is animated.
      initial={{ opacity: 1, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 print-hide',
        'transition-[background-color,border-color] duration-300',
        scrolled
          ? 'border-b border-border bg-background'
          : 'border-b border-transparent bg-background',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#home"
          aria-label={`${profile.name} — back to top`}
          className="group flex shrink-0 items-center gap-2.5 rounded-lg"
        >
          {/* `rounded-card` is the contract name but no `--radius-card` token
              landed in globals.css; `rounded` is the one that renders (20px). */}
          <span className="grid h-9 w-9 place-items-center rounded-card rounded border border-border bg-surface font-mono text-xs font-semibold tracking-tight text-foreground transition-colors group-hover:border-accent/40">
            CB
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight text-foreground sm:block">
            {profile.name}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {navSections.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative flex h-9 items-center rounded-full px-3 text-sm transition-colors',
                      isActive ? 'text-foreground' : 'text-muted hover:text-foreground',
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-accent/10 ring-1 ring-accent/25"
                        transition={
                          reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }
                        }
                      />
                    ) : null}
                    <span className="relative z-10">{section.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle />

          <button
            ref={toggleRef}
            type="button"
            onClick={() => (menuOpen ? closeMenu(true) : setMenuOpen(true))}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="grid h-11 w-11 place-items-center rounded-full border border-border-strong text-foreground transition-colors hover:border-accent/40 lg:hidden"
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {drawerMounted ? (
        <div
          id="mobile-nav"
          className={cn(
            'grid overflow-hidden border-b bg-background lg:hidden',
            reduced
              ? 'transition-none'
              : 'transition-[grid-template-rows,opacity,border-color] duration-300 ease-out',
            drawerVisible
              ? 'grid-rows-[1fr] border-border opacity-100'
              : 'grid-rows-[0fr] border-transparent opacity-0',
          )}
          inert={!drawerVisible}
        >
          <div className="min-h-0 overflow-hidden">
            <nav aria-label="Mobile" className="mx-auto w-full max-w-[1200px] px-5 pb-5 pt-3 sm:px-8">
              <ul className="flex flex-col">
                {navSections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={`#${section.id}`}
                      onClick={() => closeMenu(false)}
                      aria-current={active === section.id ? 'true' : undefined}
                      className={cn(
                        'flex h-11 items-center rounded-lg px-3 text-[15px] transition-colors',
                        active === section.id
                          ? 'bg-accent/10 text-foreground'
                          : 'text-muted hover:bg-surface-2 hover:text-foreground',
                      )}
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
