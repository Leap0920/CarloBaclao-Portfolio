import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { focusAreas, values } from '@/data/resume';
import { profile } from '@/data/profile';

const NARRATIVE =
  'I started programming in senior high school at the Asian Institute of Computer Studies, then took my Information Technology degree at Quezon City University. Most of what I know came from shipping real deployments, not tutorials.';

export function About() {
  return (
    <Section id="about" border={false}>
      <SectionHeading
        index="01"
        eyebrow="About"
        title="An IT student who ships"
        description="Full-stack web, native Android, and small deployments on real hardware."
      />

      <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <Reveal>
          <p className="text-[15px] leading-relaxed text-muted">{NARRATIVE}</p>
        </Reveal>

        <div>
          <Reveal delay={0.08}>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              What I do
            </h3>
          </Reveal>
          <Stagger className="mt-4 divide-y divide-hairline border-y border-hairline">
            {focusAreas.map((area, index) => (
              <StaggerItem key={area.title}>
                <div className="flex gap-4 py-5">
                  <span className="pt-0.5 font-mono text-[11px] tabular-nums text-accent-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-ink">{area.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-faint">{area.detail}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <h3 className="mt-12 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Languages
            </h3>
            <p className="mt-4 text-sm text-muted">{profile.spokenLanguages.join(' · ')}</p>
          </Reveal>
        </div>
      </div>

      <div className="mt-16 border-t border-hairline pt-10">
        <div>
          <Reveal>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Goals
            </h3>
          </Reveal>
          <dl className="mt-5 space-y-5">
            {values.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.05}>
                <dt className="text-sm font-semibold text-ink">{item.label}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">{item.detail}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
