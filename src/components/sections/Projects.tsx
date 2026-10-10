'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ArrowUpRight, X as CloseIcon } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { Parallax } from '@/components/ui/Parallax';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { featuredProjects, otherProjects } from '@/data/projects';
import { profile } from '@/data/profile';
import { cn } from '@/lib/cn';
import type { Project } from '@/types';

/**
 * Every project, featured first, so a dialog lookup by slug can never miss
 * regardless of which list a scene or an index row was rendered from.
 */
const ALL_PROJECTS: Project[] = [...featuredProjects, ...otherProjects];

/**
 * A project carries one `url`; split it into the two links the scene shows.
 * When that url is a repository it is the code link and there is no live
 * site, so a repo is never mislabelled as a deployment.
 */
function projectLinks(project: Project): { live?: string; repo?: string } {
  const urlIsRepo = project.url.includes('github.com');
  return {
    live: urlIsRepo ? undefined : project.url,
    repo: project.repo ?? (urlIsRepo ? project.url : undefined),
  };
}

/**
 * The bare host a project lives at, for the window's chrome bar.
 *
 * Prefers the live site and falls back to the repository, so a project that
 * only exists as source still gets a truthful address. It is a LABEL, not a
 * link: the address is not always a browsable page, and a chrome bar that
 * looks clickable but is not is worse than one that plainly is not.
 */
function displayHost(project: Project): string {
  const { live, repo } = projectLinks(project);
  return (live ?? repo ?? project.url)
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

/**
 * The two CTAs every scene leads with. Both are real links, laid out side by
 * side and legible at rest: neither depends on a hover to be reachable or
 * readable, and each clears the 44px tap floor on its own.
 *
 * The accent button does not introduce a second colour to signal hover. It
 * lifts and deepens its shadow instead, which keeps the single-ember rule
 * intact across both themes.
 */
function ProjectCtas({ project, className }: { project: Project; className?: string }) {
  const { live, repo } = projectLinks(project);

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {live ? (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-3 text-[13px] font-medium text-on-accent transition-[translate,box-shadow] duration-300 ease-fluid hover:-translate-y-0.5 hover:shadow-float sm:gap-2 sm:px-5 sm:text-sm"
        >
          <ArrowUpRight size={14} aria-hidden="true" />
          View live
        </a>
      ) : null}
      {repo ? (
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border-strong px-3 text-[13px] font-medium text-foreground transition-colors duration-300 ease-fluid hover:border-accent hover:text-accent sm:gap-2 sm:px-5 sm:text-sm"
        >
          <BrandIcon name="github" size={14} />
          Source code
        </a>
      ) : null}
    </div>
  );
}

/**
 * Tech badges: hairline chips in the copy column, never pills over an image.
 *
 * Below `lg` only the first three are shown, so the chip row stays one line on
 * a phone and the scene keeps its momentum; the dialog always carries the
 * complete list. There is deliberately no `+N` chip: the row must never wrap
 * on a 320px screen, and a fourth chip is what tips it over.
 *
 * The chips used to sit on the photograph and needed a brighter ink step to
 * clear 4.5:1. They now sit in the copy column on the page background, so the
 * ordinary `muted` is both correct and simpler.
 */
function TechBadges({ tech, className }: { tech: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {tech.map((item, index) => (
        <li
          key={item}
          className={cn(
            'rounded-full border border-border-strong px-2.5 py-0.5 font-mono text-[11px] text-muted',
            index >= 3 && 'hidden lg:block',
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/* -- The framed scene ---------------------------------------------- */

/**
 * One featured project as a SPLIT FRAME: the copy in one column, the product
 * itself in the other, set in a browser window rather than bled edge to edge.
 *
 * Why this replaced the full-bleed reel. The reel gave every project a
 * full-viewport photograph with the text laid over it, which meant (a) the
 * text was legal only because a token scrim sat between it and the image, and
 * (b) the cover's scroll-linked motion was almost invisible — an image 116%
 * tall inside a 100vh frame moves a long way for a very small change on
 * screen. A fixed-aspect window makes the same pan read as a deliberate
 * camera move, and moving the copy off the image retires the scrim and the
 * whole contrast question with it.
 *
 * The window is the section's IMAGE-DOMINANT device and it stays that way:
 * the frame is the larger column (7 of 12), and it is the only thing on the
 * page that is a picture of a product.
 *
 * SIDES ALTERNATE. Odd rows put the window on the left, so the eye zigzags
 * down the section instead of running straight down a single gutter. The DOM
 * order never changes: the window is always first, so on a phone the reading
 * order opens on the visual and the copy follows it.
 *
 * Below `lg` the split collapses to one column and nothing is hidden — the
 * chrome bar, the host label and the whole copy block survive at every width.
 */
function ProjectFrame({
  project,
  index,
  total,
  onOpen,
  setTrigger,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: () => void;
  setTrigger: (el: HTMLButtonElement | null) => void;
}) {
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  const host = displayHost(project);
  /** Odd rows mirror, so the window alternates sides on wide screens. */
  const flip = index % 2 === 1;

  return (
    <li className="group/scene">
      <div className="grid items-center gap-6 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14">
        {/* The window. DOM-first so mobile opens on the visual; on lg it is
            pushed right on even rows and left on odd ones. */}
        <div
          className={cn(
            'order-first lg:col-span-7',
            flip ? 'lg:order-first' : 'lg:order-last',
          )}
        >
          <div className="overflow-hidden rounded-card border border-hairline bg-surface shadow-card">
            {/* The chrome. Three inert dots and the real host, both on the
                micro step. The dots are decoration and stay hidden from
                assistive tech; the host is the one piece of information. */}
            <div className="flex items-center gap-3 border-b border-hairline bg-surface-2 px-3.5 py-2.5">
              <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
                <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
                <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
              </span>
              <span className="min-w-0 truncate font-mono text-[11px] tracking-[0.06em] text-faint">
                {host}
              </span>
            </div>

            {/* The viewport. A fixed 16:10 window, so the parallax layer below
                is a visible pan rather than an imperceptible drift. */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
              {/* 120% tall and offset up 10%, so a +/-8% travel can never
                  reveal a bare edge. */}
              <Parallax speed={0.08} className="absolute inset-x-0 top-[-10%] h-[120%]">
                <Image
                  src={project.image}
                  alt={`${project.name}: ${project.subtitle}`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  quality={60}
                  className="object-cover"
                />
              </Parallax>
            </div>
          </div>
        </div>

        {/* The copy. */}
        <div className={cn('lg:col-span-5', flip && 'lg:order-last')}>
          <Reveal>
            {/* The reel counter counts scenes inside one section. It is not a
                section-number eyebrow, and it is the only numbering on the
                page. */}
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              {counter}
            </p>

            <h3 className="mt-2 font-display text-2xl font-semibold leading-[1.08] tracking-[-0.025em] text-foreground md:text-title">
              {/* The name is the dialog's trigger: a real control styled as
                  the display line. It carries `min-h-11` so its own box
                  clears the 44px tap floor even when the name is one line,
                  with an ember underline sweep on the inner span so it reads
                  as pressable without a hover being required to find it. */}
              <button
                ref={setTrigger}
                type="button"
                onClick={onOpen}
                aria-haspopup="dialog"
                className="inline-flex min-h-11 items-center text-left transition-colors duration-300 ease-fluid hover:text-accent focus-visible:text-accent"
              >
                <span className="link-sweep">{project.name}</span>
              </button>
            </h3>

            <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted md:text-base">
              {project.impact}
            </p>

            <TechBadges tech={project.tech} className="mt-4" />

            <ProjectCtas project={project} className="mt-5" />
          </Reveal>
        </div>
      </div>
    </li>
  );
}

/* -- The compact mono index ---------------------------------------- */

/**
 * One of the remaining projects as a single dense line: name in `ink-soft`,
 * year and category in `faint`, rows divided by a hairline. No image, no
 * card. This is what keeps the scroll from feeling drawn out after four
 * framed scenes. The whole line is one control that opens the same dialog
 * the scenes use, so nothing on the page is a dead end.
 *
 * The row is a flex-wrap: at 320px the year and category drop to their own
 * line rather than forcing the name to clip.
 */
function IndexRow({
  project,
  onOpen,
  setTrigger,
}: {
  project: Project;
  onOpen: () => void;
  setTrigger: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={setTrigger}
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group/row flex min-h-11 w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5 text-left"
    >
      <span className="font-display text-[15px] font-medium tracking-tight text-ink-soft transition-colors duration-300 ease-fluid group-hover/row:text-accent group-focus-visible/row:text-accent">
        {project.name}
      </span>
      <span className="flex items-baseline gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
        <span>{project.category}</span>
        <span>{project.year}</span>
      </span>
    </button>
  );
}

/* -- Dialog -------------------------------------------------------- */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The project detail dialog. Kept intact from the previous build: it locks
 * body scroll while open, lands focus inside on mount, traps Tab, closes on
 * Escape, and the section returns focus to the control that opened it. Only
 * the skin changed. Its backdrop is one of the two places a backdrop blur is
 * permitted.
 */
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
      {/* The scrim is fixed chrome, so a backdrop blur is allowed here and
          nowhere in the scrolling content. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="project-dialog-panel relative z-10 w-full max-w-2xl"
      >
        {/* The dialog is a major surface, so it wears the same double-bezel as
            the machined chrome elsewhere: tray, then core, then one scroll
            region. */}
        <div className="bezel">
          <div className="bezel-core">
            <div className="max-h-[85vh] overflow-y-auto">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-2">
                <Image
                  src={project.image}
                  alt={`${project.name}: ${project.subtitle}`}
                  fill
                  sizes="(max-width: 672px) 100vw, 672px"
                  className="object-cover"
                />
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full border border-border-strong bg-surface text-foreground transition-colors duration-300 ease-fluid hover:border-accent hover:text-accent"
                >
                  <CloseIcon size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="p-5 sm:p-7">
                <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </p>
                <h3
                  id={titleId}
                  className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground"
                >
                  {project.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-muted">{project.subtitle}</p>
                <p id={descriptionId} className="mt-4 max-w-[65ch] text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                <h4 className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                  Tech
                </h4>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[11px] text-muted"
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
                      className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-on-accent transition-[translate,box-shadow] duration-300 ease-fluid hover:-translate-y-0.5 hover:shadow-float"
                    >
                      <ArrowUpRight size={15} aria-hidden="true" />
                      View live
                    </a>
                  ) : null}
                  {repo ? (
                    <a
                      href={repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border-strong px-4 text-sm font-medium text-foreground transition-colors duration-300 ease-fluid hover:border-accent hover:text-accent"
                    >
                      <BrandIcon name="github" size={15} />
                      Source code
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* -- Section ------------------------------------------------------- */

/**
 * Projects: the split showcase (DESIGN.md 10a).
 *
 * Not a grid and no longer a full-bleed reel. Each featured project is a
 * two-column frame — copy on one side, the product in a browser window on the
 * other — and the remaining projects collapse into a compact mono index
 * underneath. This is the page's IMAGE-DOMINANT section on purpose: Tech
 * Stack is type-dominant and Certifications is list-dominant, so the three
 * heaviest sections never share a skeleton.
 *
 * Why not a sticky stack of full-height plates, which was the other candidate:
 * `Experience` already owns that skeleton, and two sections pinning and
 * covering each other on the same page reads as one trick used twice.
 *
 * The section no longer needs `bleed` — the window is a contained frame, not
 * an edge-to-edge band — so the default `max-w-6xl` container applies and
 * there is no `w-screen -translate-x-1/2` breakout, which would overflow
 * horizontally on Windows Chrome because `100vw` includes the scrollbar.
 *
 * Every entrance is CSS: `Reveal` for the copy and the index rows, the
 * `.rise` utilities for the heading. No Framer entrance variants, so nothing
 * server-renders an inline `opacity: 0` that a slow bundle could strand.
 */
export function Projects() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const openProject = openSlug
    ? (ALL_PROJECTS.find((project) => project.slug === openSlug) ?? null)
    : null;

  const open = useCallback((slug: string) => {
    lastTrigger.current = triggers.current.get(slug) ?? null;
    setOpenSlug(slug);
  }, []);

  const close = useCallback(() => {
    setOpenSlug(null);
    const target = lastTrigger.current;
    window.requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  }, []);

  const registerTrigger = useCallback(
    (slug: string) => (el: HTMLButtonElement | null) => {
      if (el) triggers.current.set(slug, el);
      else triggers.current.delete(slug);
    },
    [],
  );

  return (
    <Section id="projects">
      {/* The dialog's entrance. Transform and opacity only, and a CSS keyframe
          rather than a variant, so a failed bundle still shows a dialog rather
          than a blank scrim. */}
      <style>{`
        @keyframes project-dialog-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .project-dialog-backdrop { animation: project-dialog-backdrop-in 0.3s cubic-bezier(0.32, 0.72, 0, 1) both; }

        @keyframes project-dialog-panel-in {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: none; }
        }
        .project-dialog-panel { animation: project-dialog-panel-in 0.5s cubic-bezier(0.32, 0.72, 0, 1) both; }

        @media (prefers-reduced-motion: reduce) {
          .project-dialog-backdrop,
          .project-dialog-panel { animation: none; }
        }
      `}</style>

      <SectionHeading
        title="Things that I built"
        description="Four products that shipped to real users, then the rest of the workbench behind them."
        action={
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted transition-colors duration-300 ease-fluid hover:text-foreground"
          >
            <BrandIcon name="github" size={15} />
            All repositories
          </a>
        }
      />

      {/* The frames. Generous air between them: each one is a scene, not a
          row in a table. */}
      <ol className="space-y-16 sm:space-y-24 lg:space-y-32">
        {featuredProjects.map((project, index) => (
          <ProjectFrame
            key={project.slug}
            project={project}
            index={index}
            total={featuredProjects.length}
            onOpen={() => open(project.slug)}
            setTrigger={registerTrigger(project.slug)}
          />
        ))}
      </ol>

      {/* The compact mono index: the rest of the workbench, one line each. */}
      <div className="mt-16 sm:mt-24">
        <Reveal>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
            More work
          </h3>
        </Reveal>

        <ul className="mt-4 border-b border-hairline sm:mt-5">
          {otherProjects.map((project, index) => (
            <Reveal
              as="li"
              key={project.slug}
              delay={Math.min(index, 4) * 0.05}
              className="border-t border-hairline"
            >
              <IndexRow
                project={project}
                onOpen={() => open(project.slug)}
                setTrigger={registerTrigger(project.slug)}
              />
            </Reveal>
          ))}
        </ul>
      </div>

      {openProject ? (
        <ProjectDialog key={openProject.slug} project={openProject} onClose={close} />
      ) : null}
    </Section>
  );
}
