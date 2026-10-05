import { BrandIcon } from '@/components/BrandIcons';
import { profile } from '@/data/profile';

/** Calm closing band: who this is, one line, the ways to reach him, the year. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border print-hide">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg font-semibold tracking-tight text-foreground">
              {profile.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {profile.availability}. Based in {profile.location}.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-3 inline-block font-mono text-xs text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              {profile.email}
            </a>
          </div>

          <ul className="flex flex-wrap items-center gap-1">
            {profile.socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.url}
                  target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  aria-label={social.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                >
                  <BrandIcon name={social.icon} size={16} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="font-mono text-xs text-muted">
            © {year} {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
