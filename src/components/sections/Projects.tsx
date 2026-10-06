'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ExternalLink, X as CloseIcon } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { Section, SectionHeading } from '@/components/ui/Section';
import { TiltCard } from '@/components/ui/TiltCard';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { EASE, viewportOnce, useSlideVariants } from '@/lib/motion';
import type { Project, ProjectCategory } from '@/types';

type Filter = 'All' | ProjectCategory;

/** The categories actually present in the data, behind an "All". */
const FILTERS: Filter[] = [
  'All',
  ...Array.from(new Set(projects.map((project) => project.category))),
];

/**
 * A project carries one `url`; split it into the two links the cards show.
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

/* ── Card ─────────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  onOpen,
  setTrigger,
}: {
  project: Project;
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

        {/* One stretched trigger for the whole card. Sits above the art,
            below the real links (which re-raise themselves with z-20). */}
        <button
          ref={setTrigger}
          type="button"
          onClick={onOpen}
          aria-label={`Open details for ${project.name}`}
          className="absolute inset-0 z-10 rounded-card"
        />

        <div className="pointer-events-none relative flex h-full flex-col">
          <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
            <Image
              src={project.image}
              alt={`${project.name} — ${project.subtitle}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {project.category} · {project.year}
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-foreground">
              {project.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
              {project.description}
            </p>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.slice(0, 5).map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-border bg-background/40 px-2.5 py-1 font-mono text-[11px] text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-5">
              {live ? (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto relative z-20 inline-flex min-h-12 items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent"
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
                  className="pointer-events-auto relative z-20 inline-flex min-h-12 items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent"
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
  const reduced = useReducedMotion();
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
    <motion.div
      className="fixed inset-0 z-[120] flex items-end justify-center p-3 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.25, ease: EASE }}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-background/95"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.3, ease: EASE }}
        className="relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-card border border-border bg-surface shadow-2xl"
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
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export function Projects() {
  const reduced = useReducedMotion();
  const { slideLeft, slideRight } = useSlideVariants();
  const [filter, setFilter] = useState<Filter>('All');
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  /**
   * The resolved travel distance (80px desktop / 30px phone, 0 when motion is
   * off). `useSlideVariants` can only resolve the breakpoint after mount —
   * there is no `window` during SSR — and Framer Motion captures `initial`
   * once per mount, so a card that mounted with the desktop offset would keep
   * sweeping 80px on a phone. Keying the grid on the resolved distance
   * re-mounts it once, with the phone distance applied.
   */
  const travel = Math.abs(Number((slideLeft.hidden as { x?: number } | undefined)?.x ?? 0));

  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const filtered = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

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
   * Odd cards sweep in from the left, even from the right, with a slight
   * scale-up. `useSlideVariants` owns the travel distance (80px desktop,
   * 30px on a phone) and collapses both to a plain fade under reduced
   * motion — so the scale is only added when motion is allowed.
   */
  const cardVariants = useCallback(
    (index: number): Variants => {
      const base = index % 2 === 0 ? slideLeft : slideRight;
      if (reduced) return base;
      return {
        hidden: { ...(base.hidden as Record<string, unknown>), scale: 0.96 },
        visible: { ...(base.visible as Record<string, unknown>), scale: 1 },
      } as Variants;
    },
    [reduced, slideLeft, slideRight],
  );

  return (
    <Section id="projects">
      <SectionHeading
        index="04"
        eyebrow="Projects"
        title="Projects I shipped to real users"
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
          const selected = item === filter;
          const count =
            item === 'All'
              ? projects.length
              : projects.filter((project) => project.category === item).length;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={selected}
              aria-label={`${item}, ${count} ${count === 1 ? 'project' : 'projects'}`}
              className={cn(
                'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium',
                selected
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-border bg-surface text-muted hover:text-foreground',
              )}
            >
              {item}
              <span
                aria-hidden="true"
                className={cn(
                  'font-mono text-[11px] tabular-nums',
                  selected ? 'text-on-accent' : 'text-muted',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <motion.ul key={travel} className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <motion.li
                key={project.slug}
                layout={!reduced}
                variants={cardVariants(index)}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={
                  reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }
                }
                className="min-w-0"
              >
                <ProjectCard
                  project={project}
                  onOpen={() => open(project.slug)}
                  setTrigger={(el) => {
                    if (el) triggers.current.set(project.slug, el);
                    else triggers.current.delete(project.slug);
                  }}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <p
          role="status"
          className="mt-8 rounded-card border border-border bg-surface p-6 text-sm text-muted"
        >
          No {filter} projects yet — try another category.
        </p>
      )}

      <AnimatePresence>
        {openProject ? (
          <ProjectDialog key={openProject.slug} project={openProject} onClose={close} />
        ) : null}
      </AnimatePresence>
    </Section>
  );
}
