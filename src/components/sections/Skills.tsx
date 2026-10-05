import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { skills } from '@/data/resume';
import { projectTech } from '@/data/projects';

/** Technologies that only ever show up in the projects, not in the lists above. */
const COVERED = new Set(skills.flatMap((group) => group.skills));
const PROJECT_ONLY = projectTech.filter((tech) => !COVERED.has(tech));

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        index="02"
        eyebrow="Skills"
        title="The tools I actually reach for"
      />

      <Stagger className="grid gap-x-14 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group) => (
          <StaggerItem key={group.category}>
            <div className="border-t border-hairline pt-5">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                {group.category}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {group.skills.join(' · ')}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {PROJECT_ONLY.length > 0 ? (
        <Reveal delay={0.1}>
          <p className="mt-12 border-t border-hairline pt-6 text-sm text-faint">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Also shipped with
            </span>
            <span className="mt-2 block text-ink-soft">{PROJECT_ONLY.join(' · ')}</span>
          </p>
        </Reveal>
      ) : null}
    </Section>
  );
}
