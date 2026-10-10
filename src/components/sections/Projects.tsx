'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ChevronDown, ChevronUp, ExternalLink, X as CloseIcon } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import GlareHover from '@/components/reactbits/GlareHover/GlareHover';
import { Parallax } from '@/components/ui/Parallax';
import { Reveal } from '@/components/ui/Reveal';
import { ScrollScale } from '@/components/ui/ScrollScale';
import { Section, SectionHeading } from '@/components/ui/Section';
import { TiltCard } from '@/components/ui/TiltCard';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import type { Project, ProjectCategory } from '@/types';

type Filter = 'All' | ProjectCategory;

/** The categories actually present in the data, behind an "All". */
const FILTERS: Filter[] = [
  'All',
  ...Array.from(new Set(projects.map((project) => project.category))),
];

/**
 * The project the band opens on. It also leads the list, which is what puts
 * DCPH-Tracker on the first line.
 */
const HIGHLIGHT_SLUG = 'dcph-tracker';

/**
 * A project carries one `url`; split it into the two links the view shows.
 * When that url is a repository, it is the code link and there is no live
 * site — never label a repo as a deployment.
 */
function projectLinks(project: Project): { live?: string; repo?: string } {
  const urlIsRepo = project.url.includes('github.com');
  return {
    live: urlIsRepo ? undefined : project.url,
    repo: project.repo ?? (urlIsRepo ? project.url : undefined),
  };
}

/* ── View ─────────────────────────────────────────────────────────── */

/**
 * Whatever the list has selected, shown at size: the art, the description and
 * the whole tech list, with the dialog one press away. It carries no trigger
 * over its own surface — the panel is content now, and the list beside it is
 * what moves the selection.
 *
 * The whole plate tilts under the pointer (`TiltCard`, which includes the
 * cover), and the cover image itself grows and brightens as it climbs in
 * (`ScrollScale`). Both are transform/opacity only, both self-disable on
 * touch and under reduced motion, and `ScrollScale` has no exit tween by
 * design — one direction, one tween, no fighting scrubs.
 */
function ProjectView({
  project,
  position,
  total,
  onOpen,
  setTrigger,
}: {
  project: Project;
  position: number;
  total: number;
  onOpen: () => void;
  setTrigger: (el: HTMLButtonElement | null) => void;
}) {
  const { live, repo } = projectLinks(project);

  return (
    <TiltCard className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface transition-transform duration-300 ease-out hover:-translate-y-1.5">
        {/* Soft accent glow. Opacity only — no layout property moves. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-card opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(90% 65% at 50% 0%, color-mix(in oklab, var(--accent) 24%, transparent), transparent 72%)',
          }}
        />

        <div className="relative flex h-full flex-col">
          <div className="relative aspect-[2/1] overflow-hidden bg-surface-2 sm:aspect-[16/9]">
            {/* The cover grows in on scroll. The layer is 4% larger than the
                frame on every side so its 0.94 entry scale can never reveal a
                bare edge; `ScrollScale` is transform/opacity only. */}
            <ScrollScale className="absolute -inset-[4%]">
              <Image
                src={project.image}
                alt={`${project.name} — ${project.subtitle}`}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </ScrollScale>
            {/* Where this project sits in the set — the same count the index
                shows, so the two columns agree at a glance. */}
            <span className="absolute left-3 top-3 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[11px] tabular-nums text-muted">
              <span className="text-foreground">{String(position).padStart(2, '0')}</span>
              {' / '}
              {String(total).padStart(2, '0')}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-4 sm:p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {project.category} · {project.year}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {project.name}
            </h3>
            <p className="mt-1.5 text-sm font-medium text-muted">{project.subtitle}</p>
            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted sm:mt-4 sm:line-clamp-none">{project.description}</p>

            <ul className="mt-4 flex flex-wrap gap-1.5 sm:mt-5">
              {project.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-border bg-background/40 px-2.5 py-1 font-mono text-[11px] text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 sm:gap-x-5 sm:pt-6">
              <button
                ref={setTrigger}
                type="button"
                onClick={onOpen}
                aria-label={`Open details for ${project.name}`}
                className="inline-flex min-h-11 sm:min-h-12 items-center rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent"
              >
                View details
              </button>
              {live ? (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 sm:min-h-12 items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent"
                >
                  Live
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              ) : null}
              {repo ? (
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 sm:min-h-12 items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent"
                >
                  <BrandIcon name="github" size={15} />
                  GitHub
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

/* ── Dialog ───────────────────────────────────────────────────────── */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { live, repo } = projectLinks(project);

  // The page behind the dialog must not scroll while it is open.
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  // Land focus inside, keep it inside, and close on Escape.
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const node = dialogRef.current;
      if (!node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      );

      if (items.length === 0) {
        event.preventDefault();
        node.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const titleId = `project-title-${project.slug}`;
  const descriptionId = `project-description-${project.slug}`;

  return createPortal(
    <div className="project-dialog-backdrop fixed inset-0 z-[120] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-background/95"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="project-dialog-panel relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-card border border-border bg-surface shadow-2xl"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-2">
          <Image
            src={project.image}
            alt={`${project.name} — ${project.subtitle}`}
            fill
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-cover"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-foreground"
          >
            <CloseIcon size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 sm:p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            {project.category} · {project.year}
          </p>
          <h3
            id={titleId}
            className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground"
          >
            {project.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted">{project.subtitle}</p>
          <p id={descriptionId} className="mt-4 text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          <h4 className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Tech
          </h4>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border bg-background/40 px-2.5 py-1 font-mono text-[11px] text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
            {live ? (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-on-accent"
              >
                <ExternalLink size={15} aria-hidden="true" />
                Live site
              </a>
            ) : null}
            {repo ? (
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground"
              >
                <BrandIcon name="github" size={15} />
                View code
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export function Projects() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('All');
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string>(HIGHLIGHT_SLUG);
  /** Which way the last move went, so the view can arrive from that side. */
  const [direction, setDirection] = useState<1 | -1>(1);

  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  /** The view panel, so a press on a phone can bring it into sight. */
  const viewRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  /**
   * What the left of the band shows. The selection is held by slug, so it
   * survives a filter that happens to hide it: when the selected project is
   * not in the filtered set the view falls to the leader, then to the first
   * match — never to nothing while the set is non-empty.
   */
  const selected = useMemo(
    () =>
      filtered.find((project) => project.slug === selectedSlug) ??
      filtered.find((project) => project.slug === HIGHLIGHT_SLUG) ??
      filtered[0] ??
      null,
    [filtered, selectedSlug],
  );

  const selectedIndex = selected
    ? filtered.findIndex((project) => project.slug === selected.slug)
    : -1;

  const openProject = useMemo(
    () => projects.find((project) => project.slug === openSlug) ?? null,
    [openSlug],
  );

  const open = useCallback((slug: string) => {
    lastTrigger.current = triggers.current.get(slug) ?? null;
    setOpenSlug(slug);
  }, []);

  const close = useCallback(() => {
    setOpenSlug(null);
    const target = lastTrigger.current;
    window.requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  }, []);

  /**
   * Select by position, and on a phone bring the view into sight. Every move
   * goes through here — a row press, an arrow, a key — so the travel direction
   * is always known and no path can skip the nudge.
   *
   * Below `lg` the view sits ABOVE the index, so a row press changes something
   * that is off screen above the reader. It only nudges when the panel is fully
   * off screen, and only as far as `block: 'nearest'` needs — never yanking a
   * half-visible panel.
   */
  const selectIndex = useCallback(
    (next: number) => {
      const target = filtered[next];
      if (!target) return;

      const index = filtered.findIndex((project) => project.slug === selectedSlug);
      const from = index === -1 ? 0 : index;
      setDirection(next >= from ? 1 : -1);
      setSelectedSlug(target.slug);

      if (window.matchMedia('(min-width: 1024px)').matches) return;
      const node = viewRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (rect.top >= window.innerHeight || rect.bottom <= 0) {
        node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
      }
    },
    [filtered, selectedSlug, reduced],
  );

  /**
   * One press = one project, so the view never lands between two. The set
   * wraps: past the last project comes the first, and before the first comes
   * the last. That is why the arrows are never disabled — there is always
   * somewhere to go.
   */
  const step = useCallback(
    (delta: 1 | -1) => {
      const count = filtered.length;
      if (count === 0) return;
      const index = filtered.findIndex((project) => project.slug === selectedSlug);
      const from = index === -1 ? 0 : index;
      selectIndex((from + delta + count) % count);
    },
    [filtered, selectedSlug, selectIndex],
  );

  /**
   * The index is a listbox in everything but name: Up/Down walk it and wrap
   * with it, Home/End jump to the ends, and focus moves with the selection so
   * the next press lands on the row the reader just chose.
   */
  const onListKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLUListElement>) => {
      const { key } = event;
      if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Home' && key !== 'End') return;
      event.preventDefault();

      const count = filtered.length;
      if (count === 0) return;
      const index = filtered.findIndex((project) => project.slug === selectedSlug);
      const from = index === -1 ? 0 : index;
      const next =
        key === 'ArrowDown'
          ? (from + 1) % count
          : key === 'ArrowUp'
            ? (from - 1 + count) % count
            : key === 'Home'
              ? 0
              : count - 1;

      selectIndex(next);
      event.currentTarget
        .querySelectorAll<HTMLButtonElement>('button')
        [next]?.focus({ preventScroll: true });
    },
    [filtered, selectedSlug, selectIndex],
  );

  return (
    <Section id="projects">
      {/* The entrance animations this section still owns, as CSS keyframes
          rather than Framer variants: the direction-aware view swap and the two
          dialog surfaces. The scroll reveals are the `Reveal` primitive's job.

          The GlareHover block is the ported reactbits component's showcase CSS
          neutralised for the light-only bone stage: its dark panel, fixed
          500px box and grid centring are stripped, and its sheen is re-expressed
          as a transform so nothing repaints a background-position per frame.
          Everything stands down under reduced motion. */}
      <style>{`
        @keyframes project-swap-in {
          from { opacity: 0; transform: translateY(var(--swap-y, 0px)); }
          to { opacity: 1; transform: none; }
        }
        .project-swap { animation: project-swap-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @keyframes project-dialog-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .project-dialog-backdrop { animation: project-dialog-backdrop-in 0.25s ease-out both; }

        @keyframes project-dialog-panel-in {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: none; }
        }
        .project-dialog-panel { animation: project-dialog-panel-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }

        /* GlareHover, remapped onto the site's own tokens. The component ships a
           dark card (background #000, border #333, a fixed 500px grid box); none
           of that survives here. The sheen is a transform-only sweep so the
           compositor carries it and no background-position is painted. */
        .projects-row-glare.glare-hover {
          display: block;
          width: 100%;
          height: auto;
          background: transparent;
          border: 0;
          border-radius: var(--radius-card);
          overflow: hidden;
          font: inherit;
          line-height: inherit;
          letter-spacing: inherit;
          text-transform: none;
        }
        .projects-row-glare.glare-hover::before {
          content: '';
          position: absolute;
          inset: -50%;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            transparent 44%,
            var(--gh-rgba, color-mix(in oklab, var(--accent) 30%, transparent)) 50%,
            transparent 56%
          );
          transform: translate3d(-60%, 0, 0);
          transition: transform var(--gh-duration, 650ms) ease;
        }
        .projects-row-glare.glare-hover:hover::before,
        .projects-row-glare.glare-hover:focus-within::before {
          transform: translate3d(60%, 0, 0);
        }

        @media (prefers-reduced-motion: reduce) {
          .project-swap,
          .project-dialog-backdrop,
          .project-dialog-panel { animation: none; }
          .projects-row-glare.glare-hover::before { transition: none; transform: none; }
        }
      `}</style>

      <SectionHeading
        index="01"
        eyebrow="Projects"
        title="Things that I built"
        action={
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
          >
            <BrandIcon name="github" size={15} />
            All repositories
          </a>
        }
      />

      <div
        role="group"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((item) => {
          const isFilter = item === filter;
          const count =
            item === 'All'
              ? projects.length
              : projects.filter((project) => project.category === item).length;

          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                setFilter(item);
                // A new set opens on its leader again rather than on whatever
                // happened to be selected under the previous one.
                setSelectedSlug(HIGHLIGHT_SLUG);
              }}
              aria-pressed={isFilter}
              aria-label={`${item}, ${count} ${count === 1 ? 'project' : 'projects'}`}
              className={cn(
                'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors',
                isFilter
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-border bg-surface text-muted hover:text-foreground',
              )}
            >
              {item}
              <span
                aria-hidden="true"
                className={cn(
                  'font-mono text-[11px] tabular-nums',
                  isFilter ? 'text-on-accent' : 'text-muted',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-8">
          {/* The index. It stays first in the DOM — it is the control — but it
              is ordered AFTER the view at every width, so on a phone the
              highlights are what you land on and the list follows underneath.

              This is the section's ONE Parallax layer: the whole index drifts a
              hair against the scroll so the two columns separate into depth.
              A second layer in the same viewport would read as a wobble, so
              there is deliberately only this one. */}
          <Reveal x={80} y={0} className="order-2 min-w-0">
            <Parallax speed={0.05} className="h-full">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  Projects · {filtered.length}
                </p>
                <div className="flex items-center gap-3">
                  {/* The arrows say which way the reader can go; this says how
                      far along they are. */}
                  <span className="font-mono text-[11px] tabular-nums text-faint">
                    <span className="text-foreground">
                      {selectedIndex >= 0 ? String(selectedIndex + 1).padStart(2, '0') : '--'}
                    </span>
                    {' / '}
                    {String(filtered.length).padStart(2, '0')}
                  </span>
                  {filtered.length > 1 ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => step(-1)}
                        aria-label="Previous project"
                        className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                      >
                        <ChevronUp size={18} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => step(1)}
                        aria-label="Next project"
                        className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                      >
                        <ChevronDown size={18} aria-hidden="true" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <ul
                aria-label="Projects"
                onKeyDown={onListKeyDown}
                className="mt-4 flex flex-col gap-1.5"
              >
                {filtered.map((project, index) => {
                  const isSelected = project.slug === selected?.slug;

                  return (
                    <li key={project.slug}>
                      <Reveal y={14} delay={Math.min(index, 7) * 0.04}>
                        {/* A pointer sheen sweeps the row on hover/focus. The
                            component's dark showcase CSS is neutralised above;
                            it ships no resting opacity:0 — only a decorative
                            pseudo-element, which is pointer-events: none. */}
                        <GlareHover
                          className="projects-row-glare"
                          background="transparent"
                          borderColor="transparent"
                          glareColor="color-mix(in oklab, var(--accent) 32%, transparent)"
                          glareAngle={115}
                          glareSize={200}
                          transitionDuration={650}
                        >
                          <button
                            type="button"
                            onClick={() => selectIndex(index)}
                            aria-pressed={isSelected}
                            className={cn(
                              'group relative flex w-full items-center gap-3 overflow-hidden rounded-card border py-2.5 pl-4 pr-3.5 text-left transition-colors duration-200',
                              isSelected
                                ? 'border-accent/50 bg-surface-2'
                                : 'border-transparent hover:border-border hover:bg-surface',
                            )}
                          >
                            {/* The rail marks the selection without moving a box. */}
                            <span
                              aria-hidden="true"
                              className={cn(
                                'absolute inset-y-2.5 left-0 w-[3px] rounded-full bg-accent transition-opacity duration-200',
                                isSelected ? 'opacity-100' : 'opacity-0',
                              )}
                            />

                            {/* A recognisable thumbnail does the work a number
                                cannot — the covers are the same art as the view. */}
                            <span className="relative block h-11 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2">
                              <Image
                                src={project.image}
                                alt=""
                                fill
                                sizes="64px"
                                className={cn(
                                  'object-cover transition-[opacity,scale] duration-200',
                                  isSelected
                                    ? 'scale-105 opacity-100'
                                    : 'opacity-60 group-hover:scale-105 group-hover:opacity-100',
                                )}
                              />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span
                                className={cn(
                                  'block font-mono text-[11px] tabular-nums tracking-[0.16em]',
                                  isSelected ? 'text-accent' : 'text-faint',
                                )}
                              >
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <span
                                className={cn(
                                  'mt-1 block break-words text-sm font-medium',
                                  isSelected ? 'text-foreground' : 'text-muted group-hover:text-foreground',
                                )}
                              >
                                {project.name}
                              </span>
                            </span>

                            <span
                              className={cn(
                                'hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] sm:block',
                                isSelected ? 'text-accent' : 'text-faint',
                              )}
                            >
                              {project.category}
                            </span>
                          </button>
                        </GlareHover>
                      </Reveal>
                    </li>
                  );
                })}
              </ul>
            </Parallax>
          </Reveal>

          {/* The view of whatever the list has selected. Left column from `lg`,
              and first on a phone so the highlights lead. Announced politely so
              a screen reader hears the swap. */}
          <Reveal x={-80} y={0} className="order-1 min-w-0">
            <div ref={viewRef} aria-live="polite" className="h-full">
              {selected ? (
                <div
                  key={selected.slug}
                  style={{ '--swap-y': `${10 * direction}px` } as CSSProperties}
                  className="project-swap h-full"
                >
                  <ProjectView
                    project={selected}
                    position={selectedIndex + 1}
                    total={filtered.length}
                    onOpen={() => open(selected.slug)}
                    setTrigger={(el) => {
                      if (el) triggers.current.set(selected.slug, el);
                      else triggers.current.delete(selected.slug);
                    }}
                  />
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      ) : (
        <p
          role="status"
          className="mt-8 rounded-card border border-border bg-surface p-5 sm:p-6 text-sm text-muted"
        >
          No {filter} projects yet — try another category.
        </p>
      )}

      {openProject ? (
        <ProjectDialog key={openProject.slug} project={openProject} onClose={close} />
      ) : null}
    </Section>
  );
}
