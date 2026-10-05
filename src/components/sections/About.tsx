import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { focusAreas, interests, values } from '@/data/resume';

const NARRATIVE = [
  'I started programming in senior high school at the Asian Institute of Computer Studies and kept at it through my Information Technology degree at Quezon City University. Most of what I know came from finishing things rather than from tutorials: an attendance system deployed for a real client, an Android habit tracker, and a lot of small tools I built because doing it by hand was annoying.',
  'The work I enjoy most is the unglamorous half of the job — a database migration that survives a reboot, a service that comes back on its own after a power cut, a request that fails on the client network but not on mine. I like the part where software stops being a demo and starts being depended on, and I am looking for a team where I can have my code reviewed properly.',
];

export function About() {
  return (
    <Section id="about" border={false}>
      <SectionHeading
        index="01"
        eyebrow="About"
        title="An IT student who ships, not just studies"
        description="Full-stack web, native Android, and small deployments on real hardware."
      />

      <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div className="space-y-5">
          {NARRATIVE.map((paragraph, index) => (
            <Reveal key={index} delay={index * 0.05}>
              <p className="text-[15px] leading-relaxed text-zinc-600">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <div>
          <Reveal delay={0.08}>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              What I do
            </h3>
          </Reveal>
          <Stagger className="mt-4 divide-y divide-zinc-200 border-y border-zinc-200">
            {focusAreas.map((area, index) => (
              <StaggerItem key={area.title}>
                <div className="flex gap-4 py-5">
                  <span className="pt-0.5 font-mono text-[11px] tabular-nums text-accent-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900">{area.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-500">{area.detail}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      <div className="mt-16 grid gap-12 border-t border-zinc-200 pt-10 sm:grid-cols-2 sm:gap-14">
        <div>
          <Reveal>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              Goals
            </h3>
          </Reveal>
          <dl className="mt-5 space-y-5">
            {values.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.05}>
                <dt className="text-sm font-semibold text-zinc-900">{item.label}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-600">{item.detail}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <div>
          {interests.map((item) => (
            <Reveal key={item.label} delay={0.05}>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                {item.label}
              </h3>
              <p className="mt-5 text-sm leading-relaxed text-zinc-600">{item.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
