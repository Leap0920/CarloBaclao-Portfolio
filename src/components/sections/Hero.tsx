import { ArrowRight, Download } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { HeroCanvas } from '@/components/three/HeroCanvas';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { profile } from '@/data/profile';
import { coreStack, stats } from '@/data/stats';

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Soft indigo wash so the line work has something to sit on */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30"
        style={{
          background:
            'radial-gradient(60% 55% at 72% 42%, #eef1ff 0%, rgba(238,241,255,0) 68%)',
        }}
      />

      {/* Blueprint backdrop */}
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 -z-20"
        style={{
          maskImage:
            'radial-gradient(ellipse 85% 65% at 50% 0%, black 20%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 65% at 50% 0%, black 20%, transparent 78%)',
        }}
      />

      {/* 3D composition, offset to the right so it never fights the text.
          On phones it becomes a square so the camera keeps the whole
          composition in frame instead of cropping it to a sliver. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 right-[-12%] top-[22%] h-[88vw] w-[88vw] opacity-30 sm:right-[-8%] sm:top-[14%] sm:h-[70vw] sm:w-[70vw] sm:opacity-55 lg:inset-y-0 lg:right-[-4%] lg:top-0 lg:h-auto lg:w-[58%] lg:opacity-100"
      >
        <HeroCanvas className="h-full w-full" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:pb-28 lg:pt-40">
        <div className="max-w-2xl">
          <Reveal>
            <h1 className="text-[clamp(2.6rem,7.5vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-zinc-900">
              {profile.name}
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-5 text-lg text-zinc-600 sm:text-xl">
              {profile.role} in {profile.location}.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-9">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                Tech stack
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {coreStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[11px] text-zinc-600"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-600"
              >
                View my work
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              >
                <Download size={15} />
                Download résumé
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
              >
                {profile.email}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <ul className="mt-7 flex items-center gap-1">
              {profile.socials
                .filter((social) => ['github', 'linkedin', 'instagram'].includes(social.id))
                .map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                    >
                      <BrandIcon name={social.icon} size={16} />
                    </a>
                  </li>
                ))}
            </ul>
          </Reveal>
        </div>

        {/* Headline numbers */}
        <Stagger
          delay={0.36}
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-zinc-200 pt-8 sm:mt-20 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <p className="text-3xl font-semibold tabular-nums tracking-tight text-zinc-900 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm font-medium text-zinc-700">{stat.label}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400">
                {stat.hint}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
