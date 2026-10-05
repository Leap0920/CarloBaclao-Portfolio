'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { certifications, certIssuers } from '@/data/resume';
import { useMountTransition } from '@/hooks/useMountTransition';
import { cn } from '@/lib/cn';

const ALL = 'All';

/** Keep in step with the `duration-200` on the lightbox surfaces. */
const LIGHTBOX_EXIT_MS = 200;

export function CertificationGallery() {
  const [issuer, setIssuer] = useState<string>(ALL);
  const [lightboxOpen, setLightboxOpen] = useState(false);
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
      <div className="no-scrollbar -mx-5 flex gap-6 overflow-x-auto border-b border-zinc-200 px-5 sm:mx-0 sm:flex-wrap sm:px-0">
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
              }}
              aria-pressed={isActive}
              className={cn(
                'relative shrink-0 pb-3 text-[13px] transition-colors',
                isActive ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900',
              )}
            >
              {name}
              <span className="ml-1.5 font-mono text-[10px] tabular-nums text-zinc-400">
                {count}
              </span>
              {isActive ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-[1.5px] bg-zinc-900"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((cert, index) => (
          <li key={cert.id}>
            <motion.button
              type="button"
              layout
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => open(index)}
              aria-label={`View certificate: ${cert.name}`}
              className="group block w-full text-left"
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-zinc-200 bg-white transition-colors duration-300 group-hover:border-zinc-300">
                <Image
                  src={cert.image}
                  alt={`${cert.name} certificate from ${cert.issuer}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </span>
              <span className="mt-3 block line-clamp-2 text-[13px] font-medium leading-snug text-zinc-900">
                {cert.name}
              </span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">
                {cert.issuer}
              </span>
            </motion.button>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-8 flex items-center gap-2 text-sm text-zinc-500">
          <Award size={15} />
          No certificates from this issuer.
        </p>
      ) : null}

      {/* Lightbox */}
      {lightboxMounted && current ? (
        <div
          onClick={close}
          className={cn(
            'fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm transition-opacity duration-200 sm:p-8',
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
              'relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl outline-none transition duration-200 ease-out',
              lightboxVisible
                ? 'translate-y-0 scale-100 opacity-100'
                : 'translate-y-2 scale-[0.98] opacity-0',
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-4">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold tracking-tight text-zinc-900">
                  {current.name}
                </h3>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">
                  {current.issuer} · {filtered.indexOf(current) + 1} of {filtered.length}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              >
                <X size={15} />
              </button>
            </div>
  
            <div className="relative min-h-0 flex-1 bg-[#fafafa]">
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
              <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-400 sm:block">
                  Use ← → to browse
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
