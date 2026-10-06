'use client';

import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
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
import { Section, SectionHeading } from '@/components/ui/Section';
import { skills } from '@/data/resume';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { resolveVariants, scaleIn, staggerContainer, viewportOnce } from '@/lib/motion';

type IconType = ComponentType<{ size?: number | string; className?: string }>;

/**
 * One glyph per technology. Names that have no honest lucide equivalent fall
 * back to a generic mark, so a renamed skill degrades rather than crashes.
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

function SkillIcon({ name }: { name: string }) {
  const brand = BRAND[name];
  if (brand) return <BrandIcon name={brand} size={15} />;

  const Icon = ICONS[name] ?? Wind;
  return <Icon size={15} aria-hidden="true" />;
}

/** A single small card: icon + name, hairline border, glassy surface. */
function TechCard({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 rounded-card border border-border bg-surface px-3 py-2">
      <span className="grid h-5 w-5 shrink-0 place-items-center text-accent">
        <SkillIcon name={name} />
      </span>
      <span className="whitespace-nowrap text-xs font-medium text-foreground">{name}</span>
    </div>
  );
}

/**
 * The strip. Desktop is a four-column grid of grouped cards that scale in,
 * row by row. Below `sm` each group becomes an infinite marquee: the track
 * carries the items twice and translates exactly one copy's width, so the
 * loop is seamless. `motion-reduce:` stops the animation and lets the row
 * wrap instead, and the clip wrapper keeps the marquee from ever widening
 * the page.
 */
export function TechStack() {
  const reduced = useReducedMotion();

  return (
    <Section id="techstack">
      <SectionHeading
        index="02"
        eyebrow="Tech Stack"
        title="The tools I actually reach for"
        description="Grouped into the interfaces, the APIs and data behind them, the toolchain, and the design layer."
      />

      <style>{'@keyframes tech-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}'}</style>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {skills.map((group) => (
          <motion.div
            key={group.category}
            variants={resolveVariants(staggerContainer, reduced)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
              {group.category}
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">{group.summary}</p>

            <div className="mt-4 overflow-hidden sm:overflow-visible">
              <ul
                className={cn(
                  'flex w-max',
                  !reduced &&
                    'will-change-transform animate-[tech-marquee_26s_linear_infinite] motion-reduce:animate-none motion-reduce:will-change-auto',
                  'sm:w-auto sm:animate-none sm:flex-wrap sm:gap-2 sm:will-change-auto',
                  'motion-reduce:w-auto motion-reduce:flex-wrap',
                )}
              >
                {group.skills.map((name) => (
                  <motion.li
                    key={name}
                    variants={resolveVariants(scaleIn, reduced)}
                    className="mr-2 shrink-0 sm:mr-0"
                  >
                    <TechCard name={name} />
                  </motion.li>
                ))}

                {/* The second copy that makes the loop seamless — marquee only. */}
                {group.skills.map((name) => (
                  <motion.li
                    key={`loop-${name}`}
                    aria-hidden="true"
                    variants={resolveVariants(scaleIn, reduced)}
                    className="mr-2 shrink-0 sm:hidden motion-reduce:hidden"
                  >
                    <TechCard name={name} />
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
