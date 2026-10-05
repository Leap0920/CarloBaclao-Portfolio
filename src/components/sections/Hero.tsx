import { ArrowRight, Download } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { HeroCanvas } from '@/components/three/HeroCanvas';
import { Counter } from '@/components/ui/Counter';
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

      <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:pb-28 lg:pt-40">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
          {/* Copy — DOM order first, so the 3D band sits below it on mobile. */}
          <div className="max-w-xl">
            <Reveal>
              <h1 className="text-[clamp(2.5rem,9vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink">
                {profile.name}
              </h1>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-5 text-base text-muted sm:text-lg">
                {profile.role} in {profile.location}.
              </p>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
                {profile.intro}
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                  Tech stack
                </p>
                <ul className="mt-3 flex max-w-lg flex-wrap gap-2">
                  {coreStack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-hairline bg-white px-2.5 py-1 font-mono text-[11px] text-ink-soft"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <a
                  href="#work"
                  className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-600 sm:w-auto"
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
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-hairline bg-white px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-zinc-300 hover:bg-surface-2 sm:w-auto"
                >
                  <Download size={15} />
                  Download résumé
                </a>
              </div>
              <a
                href={`mailto:${profile.email}`}
                className="mt-4 block break-words font-mono text-[13px] text-faint underline decoration-hairline underline-offset-4 transition-colors hover:text-ink hover:decoration-accent-300"
              >
                {profile.email}
              </a>
            </Reveal>

            <Reveal delay={0.3}>
              <ul className="mt-6 flex items-center gap-1">
                {profile.socials
                  .filter((social) => ['github', 'linkedin', 'instagram'].includes(social.id))
                  .map((social) => (
                    <li key={social.id}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="grid h-11 w-11 place-items-center rounded-lg text-faint transition-colors hover:bg-surface-2 hover:text-ink"
                      >
                        <BrandIcon name={social.icon} size={16} />
                      </a>
                    </li>
                  ))}
              </ul>
            </Reveal>
          </div>

          {/* 3D band — its own square box, in flow, so it can never sit under text.
              Square keeps the composition's horizontal extent inside the frustum.
              The rig is wider than it is tall, so the canvas keeps ~18% of its
              width as empty space above the composition. On top of the 40px grid
              gap that left the graphic ~88-115px below the socials — a dead band
              that read as a rendering bug. The negative top margin absorbs that
              internal padding (scaled at sm, where the band is wider) so the
              visible graphic follows the socials at normal section rhythm. Reset
              at lg, where the band sits in its own column beside the copy. */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative mx-auto mt-[-3rem] aspect-square w-full max-w-[20rem] sm:mt-[-4rem] sm:max-w-[24rem] lg:mt-0 lg:max-w-[30rem]"
          >
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(50% 42% at 50% 82%, rgba(79,91,213,0.16), rgba(79,91,213,0) 70%)',
              }}
            />
            <HeroCanvas className="h-full w-full" />
          </div>
        </div>

        {/* Headline numbers */}
        <Stagger
          delay={0.36}
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-hairline pt-8 sm:mt-20 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <Counter
                value={stat.value}
                className="text-3xl font-semibold tabular-nums tracking-tight text-ink sm:text-4xl"
              />
              <p className="mt-1.5 text-sm font-medium text-ink-soft">{stat.label}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
                {stat.hint}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
