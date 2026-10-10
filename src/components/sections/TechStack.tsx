'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import {
  Accessibility,
  ArrowRightLeft,
  Atom,
  Bot,
  Boxes,
  Braces,
  CircuitBoard,
  Cloud,
  Code2,
  Coffee,
  Container,
  Cpu,
  Database,
  DatabaseZap,
  FileCode,
  FileCode2,
  Flame,
  GitBranch,
  LayoutGrid,
  Leaf,
  Monitor,
  Navigation,
  Play,
  Rocket,
  Server,
  Smartphone,
  SquareTerminal,
  Terminal,
  Triangle,
  Waypoints,
  Wind,
} from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { skills } from '@/data/resume';
import type { SkillCategory } from '@/types';
import { cn } from '@/lib/cn';

/**
 * TECH STACK - layout family "Sticky domain rail + large-type editorial lines"
 * (DESIGN.md section 10a). The page's TYPE-DOMINANT section: no tiles, no
 * cards, no icons sitting in boxes. It keeps an eyebrow on purpose: the page's
 * eyebrow budget is two and this is the second, the hero's role label being
 * the first.
 *
 * WHAT THIS SECTION IS
 * Two columns from `lg` up. The left column is a sticky rail carrying the four
 * domain names (Frontend, Backend, Tools, Design) as mono labels; an
 * IntersectionObserver tracks which domain is currently crossing the middle of
 * the viewport and warms that label to the ember accent. The right column is
 * four panels, each led by its `summary` line and then its skills, and each
 * skill is an editorial line at large type: the name in the display face, its
 * proficiency as a mono label, and a hairline depth bar that fills on reveal.
 *
 * Below `lg` the rail is not rendered at all: it unsticks into a plain heading
 * on each group, which is the explicit mobile fallback (DESIGN.md section 8).
 *
 * PROFICIENCY IS REAL TEXT PLUS A BAR, NEVER COLOUR ALONE
 * `SkillCategory.levels` is SPARSE on purpose: a skill with no entry is
 * UNRATED, never 0 and never a maximum. The visible label is a band drawn from
 * the data's own scale (1 learning to 5 daily driver): `Learning` for 1 and 2,
 * `Working` for 3, `Daily driver` for 4 and 5, and `Unrated` when the data
 * leaves the skill blank. No number is ever invented. The hairline bar beside
 * the label restates the same fact at finer resolution (level over five) and
 * is `aria-hidden`, so the level is announced once, never twice.
 *
 * ONE INTERACTION, DONE ONCE
 * Hovering or focusing a line extends an ember hairline across the row. There
 * are no hover-only tooltips: at thirty-two skills a tooltip is a wall of
 * waiting. The level is always on screen as text and as a bar, so nothing the
 * reader needs is reachable only by hovering.
 *
 * MOTION IS CSS ONLY
 * Entrances are the shared `Reveal` primitive, so the hidden state ships behind
 * `html.js-reveal` and a slow or failed bundle leaves the copy visible. There
 * is no Framer entrance variant, no inline zero-opacity in the served HTML and
 * no scroll listener. The depth bar fills by transitioning its `scale`, and the
 * hover hairline extends the same way: transform and colour only, never width.
 *
 * MOBILE FALLBACK (<768px), DECLARED EXPLICITLY (DESIGN.md section 8)
 *   - The two-column grid is a single column below `lg`. The rail is dropped,
 *     not shrunk: each panel opens with its own heading, which is what the rail
 *     was doing on desktop.
 *   - The editorial lines tighten their leading and drop a type step at the
 *     smallest widths (`py-1.5` and a 15px name) rather than staying at display
 *     scale, because this is the section most likely to blow the 2,000px-per-
 *     section budget at 320px.
 *   - The inline icon is hidden below `sm` so the longest name still fits on
 *     one line beside its read-out instead of wrapping and adding height.
 *   - Nothing here is interactive, so no control can fall under the 44x44 floor.
 */
type IconType = ComponentType<{ size?: number | string; className?: string }>;

/**
 * One glyph per technology. Names that have no honest lucide equivalent fall
 * back to a generic mark, so a renamed skill degrades rather than crashes.
 * This map is unchanged from the previous build because it was already right:
 * one honest glyph per name, no hand-rolled SVG path.
 */
const ICONS: Record<string, IconType> = {
  React: Atom,
  'Next.js': Triangle,
  TypeScript: Braces,
  JavaScript: FileCode,
  Flutter: Smartphone,
  Dart: Navigation,

  Java: Coffee,
  Python: Terminal,
  'C++': Cpu,
  Go: Rocket,
  SQL: Database,
  'Spring Boot': Leaf,
  '.NET': Boxes,
  GraphQL: Waypoints,
  PostgreSQL: DatabaseZap,
  MongoDB: Cloud,
  SQLite: Server,
  Flyway: ArrowRightLeft,
  Firebase: Flame,

  Git: GitBranch,
  Docker: Container,
  Linux: SquareTerminal,
  'Raspberry Pi': CircuitBoard,
  'IntelliJ IDEA': Code2,
  'VS Code': FileCode2,
  'Android Studio': Bot,
  'Windows Deployment': Monitor,

  'Tailwind CSS': Wind,
  'Framer Motion': Play,
  'Responsive Design': LayoutGrid,
  Accessibility,
};

/** Skills whose real logo lives in BrandIcons rather than lucide. */
const BRAND: Record<string, 'github'> = {
  GitHub: 'github',
};

/** The top of the data's own scale: 1 (learning) to 5 (daily driver). */
const MAX_LEVEL = 5;

function SkillIcon({ name, size = 16 }: { name: string; size?: number }) {
  const brand = BRAND[name];
  if (brand) return <BrandIcon name={brand} size={size} />;

  const Icon = ICONS[name] ?? Wind;
  return <Icon size={size} aria-hidden="true" />;
}

/**
 * Map a sparse level onto a visible band, never an invented number. A missing
 * or out-of-range level is `Unrated` with a zero-length fill, which is the one
 * honest reading of "the data does not say".
 */
function levelBand(level?: number): { text: string; value: number; rated: boolean } {
  if (typeof level !== 'number' || level < 1) {
    return { text: 'Unrated', value: 0, rated: false };
  }
  const value = Math.min(MAX_LEVEL, Math.round(level));
  const text = value >= 4 ? 'Daily driver' : value >= 3 ? 'Working' : 'Learning';
  return { text, value, rated: true };
}

/**
 * The proficiency read-out: the mono band label, plus a hairline depth bar.
 *
 * The label is the carrier and is always visible; the bar restates the same
 * fact at finer resolution and is `aria-hidden`, so the level is announced once
 * and never rests on colour alone. A visually hidden sentence spells the exact
 * value out for a screen reader while the visible band stays short enough to
 * sit at the right edge of a 280px-wide row. Both segments come from tokens, so
 * the bar is finished in both themes: `bg-accent` for the filled level and
 * `bg-border` (the hairline) for the rest.
 */
function LevelMeter({ level }: { level?: number }) {
  const { text, value, rated } = levelBand(level);
  const percent = rated ? (value / MAX_LEVEL) * 100 : 0;

  return (
    <span className="flex shrink-0 items-center gap-2">
      <span aria-hidden="true" className="relative h-px w-6 bg-border sm:w-10">
        <span
          className="absolute inset-y-0 left-0 h-px origin-left scale-x-0 bg-accent transition-[scale] duration-700 ease-fluid group-data-[reveal=shown]:scale-x-100"
          style={{ width: `${percent}%` }}
        />
      </span>

      <span className="font-mono text-[11px] leading-none tracking-[0.04em] text-faint">
        <span className="sr-only">
          {rated ? `Proficiency ${value} of ${MAX_LEVEL}. ` : 'Proficiency not rated. '}
        </span>
        {text}
      </span>
    </span>
  );
}

/**
 * One editorial line: the skill name at large type with its icon as a small
 * inline mark, the read-out on the right, and a bottom hairline that turns to
 * ember and extends across the row on hover or focus-within. The `group` lives
 * on the `Reveal` element, which is also the line's `<li>`, so the depth bar
 * can key its fill off the line's own `data-reveal` state.
 */
function SkillLine({ name, level }: { name: string; level?: number }) {
  return (
    <Reveal as="li" y={12} className="group relative">
      <div className="flex items-center justify-between gap-2 py-1 sm:gap-6 sm:py-2.5 lg:py-3.5">
        <span className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <span aria-hidden="true" className="hidden shrink-0 text-faint sm:block">
            <SkillIcon name={name} />
          </span>
          <span className="font-display text-[0.9375rem] font-semibold leading-tight tracking-tight text-foreground sm:text-lg md:text-xl lg:text-[clamp(1.75rem,2.4vw,2.25rem)]">
            {name}
          </span>
        </span>

        <LevelMeter level={level} />
      </div>

      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-border" />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-[scale] duration-500 ease-fluid group-hover:scale-x-100 group-focus-within:scale-x-100"
      />
    </Reveal>
  );
}

/**
 * One domain. On desktop the panel is led by its `summary` line and its name
 * lives in the rail, so the heading is rendered `sr-only` from `lg` up to keep
 * the panel an accessible, named region without repeating the rail visually.
 * Below `lg` the same heading is the group's visible title, because there is no
 * rail to carry it.
 */
function DomainPanel({ group }: { group: SkillCategory }) {
  const levels = group.levels ?? {};
  const slug = group.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <section
      id={`domain-${slug}`}
      data-domain={group.category}
      className="scroll-mt-28"
    >
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl lg:sr-only">
        {group.category}
      </h3>

      <p className="mt-1 max-w-[52ch] text-sm leading-relaxed text-muted lg:mt-0 lg:text-base">
        {group.summary}
      </p>

      <ul className="mt-3 sm:mt-5 lg:mt-6">
        {group.skills.map((name) => (
          <SkillLine key={name} name={name} level={levels[name]} />
        ))}
      </ul>
    </section>
  );
}

/**
 * The sticky rail. A pure scroll-spy indicator: the four domain names as mono
 * labels, the active one warmed to ember and marked with a short ember tick so
 * the state does not rest on colour alone. It is `aria-hidden` because it
 * duplicates the panel headings (which are `sr-only` on desktop for exactly
 * that reason), and it is a plain list, not a control: the section's one
 * interaction is the hover hairline on each line, so nothing here is focusable.
 */
function DomainRail({ active }: { active: string }) {
  return (
    <div aria-hidden="true" className="hidden lg:block">
      <ul className="sticky top-28 space-y-4">
        {skills.map((group) => {
          const on = group.category === active;
          return (
            <li key={group.category}>
              <span
                className={cn(
                  'flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ease-fluid',
                  on ? 'text-accent' : 'text-faint',
                )}
              >
                <span
                  className={cn(
                    'h-px w-5 origin-left bg-accent transition-[scale] duration-500 ease-fluid',
                    on ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
                {group.category}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The stack as a sticky rail beside large-type editorial lines.
 *
 * `Section` and `SectionHeading` own the vertical rhythm, the seam hairline and
 * the heading scale, so nothing here adds its own `py-*` or `border-t`. The
 * observer is the only client state: it reads discrete intersection changes (a
 * thin band across the middle of the viewport) to pick the active domain, never
 * a continuous pointer or scroll value.
 */
export function TechStack() {
  const [active, setActive] = useState(skills[0]?.category ?? '');
  const panelWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = panelWrap.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-domain]'));
    if (panels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (!hit) return;
        const name = hit.target.getAttribute('data-domain');
        if (name) setActive(name);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  const total = skills.reduce((count, group) => count + group.skills.length, 0);

  return (
    <Section id="techstack">
      <SectionHeading
        eyebrow="Tech stack"
        title="The tools I actually reach for"
        description={`${total} tools across four domains, each rated from learning to daily driver.`}
      />

      <div className="lg:grid lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-20">
        <DomainRail active={active} />

        <div ref={panelWrap} className="space-y-8 sm:space-y-14 lg:space-y-20">
          {skills.map((group) => (
            <DomainPanel key={group.category} group={group} />
          ))}
        </div>
      </div>
    </Section>
  );
}
