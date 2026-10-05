import { BrandIcon } from '@/components/BrandIcons';
import { profile } from '@/data/profile';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline/70 bg-[#fafafa] print-hide">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-900 font-mono text-[13px] font-medium text-white">
                CB
              </span>
              <span className="text-sm font-semibold tracking-tight text-ink">
                {profile.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {profile.role} based in {profile.location}. {profile.availability}.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-4 inline-block font-mono text-xs text-faint underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-accent-600 hover:decoration-accent-300"
            >
              {profile.email}
            </a>
          </div>

          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
              Elsewhere
            </h2>
            <ul className="mt-4 space-y-2.5">
              {profile.socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                  >
                    <BrandIcon name={social.icon} size={15} className="text-faint group-hover:text-accent-500" />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-faint">
            © {year} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-faint">
            Built with Next.js, Tailwind CSS and three.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
