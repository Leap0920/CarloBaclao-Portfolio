import { Building2, Download, FileText, GraduationCap } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { education, experience } from '@/data/resume';
import { profile } from '@/data/profile';
import { formatRange } from '@/lib/format';

/** Shared row: mono date on the right, title and detail on the left. */
function Entry({
  title,
  subtitle,
  range,
  note,
  lines,
  tech,
}: {
  title: string;
  subtitle: string;
  range: string;
  note?: string;
  lines?: string[];
  tech?: string[];
}) {
  return (
    <div className="border-t border-zinc-200 pt-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h4 className="text-base font-semibold tracking-tight text-zinc-900">{title}</h4>
        <time className="shrink-0 font-mono text-[11px] text-zinc-500">{range}</time>
      </div>
      <p className="mt-1 text-sm font-medium text-zinc-500">{subtitle}</p>

      {note ? <p className="mt-3 text-sm leading-relaxed text-zinc-600">{note}</p> : null}

      {lines && lines.length > 0 ? (
        <ul className="mt-4 space-y-2.5">
          {lines.map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-zinc-600">
              <span
                aria-hidden="true"
                className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-zinc-300"
              />
              {line}
            </li>
          ))}
        </ul>
      ) : null}

      {tech && tech.length > 0 ? (
        <p className="mt-4 font-mono text-[11px] text-zinc-500">{tech.join(' · ')}</p>
      ) : null}
    </div>
  );
}

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeading
        index="03"
        eyebrow="Experience & Education"
        title="Where I have worked and studied"
        description="One role in a clinical data environment and a degree in progress — plus the coursework that produced most of the projects below."
      />

      <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div>
          <h3 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            <Building2 size={13} />
            Work
          </h3>

          <Stagger className="mt-6 space-y-8">
            {experience.map((role) => (
              <StaggerItem key={role.id}>
                <Entry
                  title={role.position}
                  subtitle={role.company}
                  range={formatRange(role.range)}
                  lines={role.description}
                  tech={role.technologies}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            <GraduationCap size={13} />
            Education
          </h3>

          <Stagger className="mt-6 space-y-8">
            {education.map((item) => (
              <StaggerItem key={item.id}>
                <Entry
                  title={`${item.degree} in ${item.field}`}
                  subtitle={item.institution}
                  range={formatRange(item.range, { month: false })}
                  note={item.note}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-14 flex flex-col gap-5 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600">
            Prefer the one-page version? The full résumé as a PDF — education, experience, skills
            and certifications.
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-600"
            >
              <FileText size={15} />
              Open résumé
            </a>
            <a
              href={profile.resumeUrl}
              download="Carlo_Baclao_Resume.pdf"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <Download size={15} />
              Download
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
