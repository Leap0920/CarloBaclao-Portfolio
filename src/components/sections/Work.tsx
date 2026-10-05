import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { featuredProjects, otherProjects } from '@/data/projects';
import { profile } from '@/data/profile';
import type { Project } from '@/types';

function Meta({ project }: { project: Project }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
      {project.category} · {project.year}
    </p>
  );
}

/** The lead project: the newest and largest build, given the full-width slot. */
function LeadProject({ project }: { project: Project }) {
  return (
    <article className="group grid gap-8 lg:grid-cols-[1.08fr_1fr] lg:items-center lg:gap-14">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-100 lg:order-2">
        <Image
          src={project.image}
          alt={`${project.name} — ${project.subtitle}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-accent-100 bg-white/95 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-700 shadow-sm backdrop-blur">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-500" />
          Latest build
        </span>
      </div>

      <div className="lg:order-1">
        <Meta project={project} />
        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-zinc-500">{project.subtitle}</p>
        <p className="mt-5 text-[15px] leading-relaxed text-zinc-600">{project.description}</p>
        <p className="mt-5 font-mono text-[11px] text-zinc-500">{project.tech.join(' · ')}</p>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 transition-colors hover:text-accent-600"
        >
          Visit the project
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </article>
  );
}

function FeatureCard({ project }: { project: Project }) {
  return (
    <article className="group">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={project.image}
          alt={`${project.name} — ${project.subtitle}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="mt-5">
        <Meta project={project} />
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-900">{project.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{project.description}</p>
        <p className="mt-3 font-mono text-[11px] text-zinc-500">{project.tech.join(' · ')}</p>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 transition-colors hover:text-accent-600"
        >
          {project.urlLabel}
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </article>
  );
}

export function Work() {
  const [lead, ...secondary] = featuredProjects;

  return (
    <Section id="work">
      <SectionHeading
        index="04"
        eyebrow="Work"
        title="Projects I built and put in front of people"
        description={`${featuredProjects.length + otherProjects.length} builds, from a full-stack deployment on a Raspberry Pi to web apps with real users.`}
        action={
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
          >
            <BrandIcon name="github" size={15} />
            All repositories
          </a>
        }
      />

      {lead ? (
        <Reveal>
          <LeadProject project={lead} />
        </Reveal>
      ) : null}

      {secondary.length > 0 ? (
        <Stagger className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {secondary.map((project) => (
            <StaggerItem key={project.slug} className="min-w-0">
              <FeatureCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : null}

      <div className="mt-20">
        <Reveal>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            More projects
          </h3>
        </Reveal>

        <Stagger className="mt-5 divide-y divide-zinc-200 border-y border-zinc-200">
          {otherProjects.map((project) => (
            <StaggerItem key={project.slug} className="min-w-0">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 py-5"
              >
                <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100 sm:h-16 sm:w-24">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-3">
                    <span className="truncate text-[15px] font-medium text-zinc-900">
                      {project.name}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-zinc-400">
                      {project.year}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-zinc-500">{project.subtitle}</span>
                </span>

                <span className="hidden shrink-0 font-mono text-[11px] text-zinc-400 lg:block">
                  {project.tech.slice(0, 3).join(' · ')}
                </span>

                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-zinc-300 transition-colors group-hover:text-accent-500"
                />
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.06}>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
          >
            Coursework, experiments and older projects on GitHub
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
