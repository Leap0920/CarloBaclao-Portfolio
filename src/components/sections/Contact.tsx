import { MapPin, Phone } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { profile } from '@/data/profile';

/** The two facts a hiring manager needs before writing: where, and how to call. */
const FACTS: { icon: React.ComponentType<{ size?: number; className?: string }>; value: string }[] = [
  { icon: MapPin, value: profile.location },
  { icon: Phone, value: profile.phone },
];

export function Contact() {
  return (
    <Section id="contact">
      <SectionHeading
        index="07"
        eyebrow="Contact"
        title={profile.availability}
      />

      {/* The address is the page's primary action, so it gets the title treatment. */}
      <Reveal>
        <a
          href={`mailto:${profile.email}`}
          className="block break-all text-title font-semibold tracking-tight text-ink underline-offset-[6px] transition-colors hover:underline hover:decoration-accent focus-visible:underline focus-visible:decoration-accent"
        >
          {profile.email}
        </a>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-hairline pt-6 text-sm text-muted">
          {FACTS.map(({ icon: Icon, value }) => (
            <span key={value} className="inline-flex items-center gap-2">
              <Icon size={14} className="shrink-0" />
              {value}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
          {profile.socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.url}
                target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
              >
                <BrandIcon
                  name={social.icon}
                  size={15}
                  className="shrink-0 text-muted transition-colors group-hover:text-accent"
                />
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
