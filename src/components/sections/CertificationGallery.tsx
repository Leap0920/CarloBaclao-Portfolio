'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Award, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { certifications, certIssuers } from '@/data/resume';
import { Reveal } from '@/components/ui/Reveal';
import { useMountTransition } from '@/hooks/useMountTransition';
import { cn } from '@/lib/cn';

const ALL = 'All';

/** Names shown before the list is expanded. Phones only — `sm` shows all. */
const MOBILE_PREVIEW = 8;

/** Keep in step with the `duration-200` on the lightbox surfaces. */
const LIGHTBOX_EXIT_MS = 200;

export function CertificationGallery() {
  const [issuer, setIssuer] = useState<string>(ALL);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Which certificate the lightbox draws. Deliberately not cleared on close, so
  // the certificate stays on screen for the fade-out.
  const [shownIndex, setShownIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (issuer === ALL ? certifications : certifications.filter((c) => c.issuer === issuer)),
    [issuer],
  );

  const current = shownIndex === null ? null : (filtered[shownIndex] ?? null);

  const { mounted: lightboxMounted, visible: lightboxVisible } = useMountTransition(
    lightboxOpen,
    LIGHTBOX_EXIT_MS,
  );

  const open = useCallback((index: number) => {
    setShownIndex(index);
    setLightboxOpen(true);
  }, []);

  const close = useCallback(() => setLightboxOpen(false), []);

  const step = useCallback(
    (direction: 1 | -1) =>
      setShownIndex((index) => {
        if (index === null || filtered.length === 0) return index;
        return (index + direction + filtered.length) % filtered.length;
      }),
    [filtered.length],
  );

  // Keyboard controls, scroll lock and focus, for as long as the lightbox is on
  // screen — including its fade-out.
  useEffect(() => {
    if (!lightboxMounted) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxMounted, close, step]);

  const filters = [ALL, ...certIssuers];

  return (
    <div>
      {/* Filters */}
      <div className="no-scrollbar -mx-5 flex gap-6 overflow-x-auto border-b border-border px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {filters.map((name) => {
          const count =
            name === ALL
              ? certifications.length
              : certifications.filter((cert) => cert.issuer === name).length;
          const isActive = issuer === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => {
                setIssuer(name);
                setLightboxOpen(false);
                setExpanded(false);
              }}
              aria-pressed={isActive}
              className={cn(
                'relative flex min-h-11 shrink-0 items-center pb-3 text-[13px] transition-colors sm:min-h-0',
                isActive ? 'text-ink' : 'text-faint hover:text-ink',
              )}
            >
              {name}
              <span className="ml-1.5 font-mono text-[11px] tabular-nums text-faint">
                {count}
              </span>
              {isActive ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-[1.5px] bg-accent"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Names, not thumbnails. The certificate itself is one press away in the
          lightbox, so the section stays a scannable list and the page does not
          pay for twenty-three certificate images it may never show. */}
      <ul className="mt-8 grid gap-x-10 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cert, index) => (
          <li key={cert.id} className={cn(!expanded && index >= MOBILE_PREVIEW && 'hidden sm:block')}>
            {/* Cascades in a row at a time as the list is scrolled. */}
            <Reveal y={14} delay={Math.min(index, 9) * 0.035}>
              <button
                type="button"
                onClick={() => open(index)}
                aria-label={`View the ${cert.name} certificate`}
                className="group flex w-full items-baseline justify-between gap-3 rounded-lg px-2 py-3 text-left transition-colors hover:bg-surface-2 active:bg-surface-2 sm:py-2.5"
              >
                <span className="text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
                  {cert.name}
                </span>
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
                  {cert.issuer}
                </span>
              </button>
            </Reveal>
          </li>
        ))}
      </ul>

      {filtered.length > MOBILE_PREVIEW ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-card border border-border text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-foreground sm:hidden"
        >
          {expanded ? 'Show fewer' : `Show all ${filtered.length} certificates`}
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={cn('transition-transform duration-200', expanded && 'rotate-180')}
          />
        </button>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-8 flex items-center gap-2 text-sm text-faint">
          <Award size={15} />
          No certificates from this issuer.
        </p>
      ) : null}

      {/* Lightbox */}
      {lightboxMounted && current ? (
        <div
          onClick={close}
          className={cn(
            'fixed inset-0 z-[70] flex items-center justify-center bg-background/85 p-4 transition-opacity duration-200 sm:p-8',
            lightboxVisible ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={current.name}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            className={cn(
              'relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-card rounded border border-border bg-surface shadow-[var(--shadow-card)] outline-none transition duration-200 ease-out',
              lightboxVisible
                ? 'translate-y-0 scale-100 opacity-100'
                : 'translate-y-2 scale-[0.98] opacity-0',
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold tracking-tight text-ink">
                  {current.name}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
                  {current.issuer} · {filtered.indexOf(current) + 1} of {filtered.length}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border text-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <X size={17} />
              </button>
            </div>
  
            <div className="relative min-h-0 flex-1 bg-surface-2">
              <div className="relative h-[min(66vh,640px)] w-full">
                <Image
                  src={current.image}
                  alt={`${current.name} certificate from ${current.issuer}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-contain p-4 sm:p-6"
                />
              </div>
            </div>
  
            {filtered.length > 1 ? (
              <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="hidden font-mono text-[11px] uppercase tracking-[0.1em] text-faint sm:block">
                  Use ← → to browse
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
