import { ArrowUpRight, MapPin, Phone } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { CopyEmailButton } from '@/components/ui/CopyEmailButton';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { profile } from '@/data/profile';

const DETAILS: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ size?: number }>;
}[] = [
  { label: 'Location', value: profile.location, icon: MapPin },
  { label: 'Phone', value: profile.phone, icon: Phone },
  { label: 'Status', value: profile.availability },
];

export function Contact() {
  return (
    <Section id="contact">
      <SectionHeading
        index="07"
        eyebrow="Contact"
        title="Let's build something that has to work"
        description="Hiring for an internship or a junior role, or need a hand on a small build? Send a note with a bit of context — I read everything and I reply."
      />

      <Reveal>
        <a
          href={`mailto:${profile.email}`}
          className="block break-all text-2xl font-semibold tracking-tight text-zinc-900 transition-colors hover:text-accent-600 sm:text-4xl"
        >
          {profile.email}
        </a>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-600"
          >
            <BrandIcon name="mail" size={15} />
            Send an email
          </a>
          <CopyEmailButton
            email={profile.email}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
          />
        </div>
      </Reveal>

      <dl className="mt-16 grid gap-6 border-t border-zinc-200 pt-8 sm:grid-cols-3">
        {DETAILS.map((detail) => (
          <div key={detail.label}>
            <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              {detail.icon ? <detail.icon size={12} /> : null}
              {detail.label}
            </dt>
            <dd className="mt-1.5 text-sm text-zinc-700">{detail.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-14">
        <Reveal>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            Profiles
          </h3>
        </Reveal>

        <Stagger className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.socials.map((social) => (
            <StaggerItem key={social.id}>
              <a
                href={social.url}
                target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="group flex items-baseline gap-3 text-sm text-zinc-700 transition-colors hover:text-zinc-900"
              >
                <BrandIcon
                  name={social.icon}
                  size={15}
                  className="translate-y-0.5 shrink-0 text-zinc-400 transition-colors group-hover:text-accent-500"
                />
                <span className="min-w-0 flex-1 truncate">
                  {social.label}
                  <span className="ml-2 font-mono text-[11px] text-zinc-400">
                    {social.handle}
                  </span>
                </span>
                <ArrowUpRight
                  size={13}
                  className="shrink-0 text-zinc-300 transition-colors group-hover:text-accent-500"
                />
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
