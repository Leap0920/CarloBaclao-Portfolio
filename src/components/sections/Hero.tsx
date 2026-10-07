'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { Download, Eye } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { CvPreviewDialog } from '@/components/ui/CvPreviewDialog';
import { JupiterHero } from '@/components/hero/JupiterHero';
import { profile } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';
import { DURATION, EASE, STAGGER_STEP } from '@/lib/motion';

/**
 * The hero's copy entrance runs as a CSS animation, not through the shared
 * variants, and that is deliberate.
 *
 * These elements are the first thing painted and the name is the largest thing
 * on the page. An entrance driven by JavaScript cannot start until React has
 * hydrated, so the hero sits blank for as long as the bundle takes — and the
 * largest-contentful paint is held out with it, because an element at zero
 * opacity does not count as painted. A keyframe starts at first paint and
 * needs no JavaScript at all.
 *
 * The stagger is the shared step, handed to the stylesheet as a custom
 * property so the rule below stays declarative.
 */
const heroDelay = (index: number): CSSProperties =>
  ({ '--hero-delay': `${(index * STAGGER_STEP).toFixed(2)}s` }) as CSSProperties;

/** The three routes worth surfacing in the hero. */
const heroSocials = profile.socials.filter((social) =>
  ['github', 'linkedin', 'email'].includes(social.id),
);

/** Years since the first line of code, derived so it never needs a hand edit. */
const YEARS_CODING = Math.max(1, new Date().getFullYear() - profile.codingSince);

/**
 * The scannable facts that used to open the About section. They belong with
 * the name and the role: this is what a recruiter looks for first, and it
 * should not need a scroll to reach.
 */
const QUICK_FACTS: ReadonlyArray<{ label: string; value: string }> = [
  { label: 'Location', value: profile.location },
  { label: 'Availability', value: profile.availability },
  { label: 'Experience', value: `${YEARS_CODING}+ years writing code` },
  { label: 'Languages', value: profile.spokenLanguages.join(' \u00b7 ') },
];

/**
 * The opening section: a two-column hero (copy left, the 3D object right) on
 * a soft amber glow.
 *
 * The CTAs are the two things a reader reaches for first, the CV preview and
 * the download. The preview opens the same accessible modal the About section
 * used, so the CV never leaves the page.
 *
 * The copy entrance is a CSS keyframe and the 3D band uses the shared CSS
 * `Reveal` primitive, so nothing on the page's first screen waits on
 * JavaScript to become visible. Reduced motion is handled in CSS.
 */
export function Hero() {
  const [cvOpen, setCvOpen] = useState(false);
  const cvTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <section id="home" className="hero-glow relative isolate scroll-mt-20 overflow-hidden">
      {/* The entrance for the copy below. Declared next to the elements it
          drives so the rule, the keyframe and the markup stay together, and
          `both` holds the resting state after it finishes — so the copy is
          never left invisible if the animation is skipped. Reduced motion is
          handled in CSS, which is the only place it can be handled before the
          first paint. */}
      <style>{`
        .hero-rise {
          animation: hero-rise ${DURATION.slow}s cubic-bezier(${EASE.join(', ')}) both;
          animation-delay: var(--hero-delay, 0s);
        }
        @keyframes hero-rise {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-rise { animation: none; }
        }
      `}</style>
      {/* `pb` used to be 64/96px, which measured as 96px of empty hero below the
          graphic plus 112px of the next section's own top padding — 208px of
          nothing between the planet and the Projects heading. */}
      <div className="mx-auto w-full max-w-6xl px-5 pb-8 pt-28 sm:px-8 sm:pt-32 lg:pb-10 lg:pt-36">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          {/* Copy, first in the DOM, and lifted above the graphic, which is the
              hero's background on a phone. */}
          <div className="relative z-10 max-w-xl">
            <h1
              className="hero-rise font-display text-[clamp(2.5rem,8vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground"
              style={heroDelay(0)}
            >
              {profile.name}
            </h1>

            <p
              className="hero-rise mt-4 font-mono text-sm uppercase tracking-[0.14em] text-accent"
              style={heroDelay(1)}
            >
              {profile.role}
            </p>

            <p
              className="hero-rise mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
              style={heroDelay(2)}
            >
              {profile.pitch}
            </p>

            <dl
              className="hero-rise mt-10 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-border pt-8 sm:grid-cols-2"
              style={heroDelay(3)}
            >
              {QUICK_FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-micro uppercase tracking-[0.16em] text-muted">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>

            {/* The CV pair sits under the facts, so the details a reader scans
                for come first and the two actions follow them. Download is the
                accent fill, matching the weight it carries everywhere else on
                the page; the preview is the secondary. */}
            <div
              className="hero-rise mt-8 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center"
              style={heroDelay(4)}
            >
              <button
                ref={cvTriggerRef}
                type="button"
                onClick={() => setCvOpen(true)}
                aria-haspopup="dialog"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-card rounded border border-border-strong bg-surface px-6 text-sm font-semibold text-foreground transition-colors duration-200 ease-out hover:border-accent/60 hover:text-accent sm:w-auto"
              >
                <Eye size={16} aria-hidden="true" />
                Preview CV
              </button>
              <a
                href={profile.resumeUrl}
                download="Carlo_Baclao_Resume.pdf"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-card rounded bg-accent px-6 text-sm font-semibold text-on-accent transition-colors duration-200 ease-out hover:bg-accent-hover sm:w-auto"
              >
                <Download size={16} aria-hidden="true" />
                Download CV
              </a>
            </div>

            <ul className="hero-rise mt-8 flex items-center gap-1" style={heroDelay(5)}>
              {heroSocials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    aria-label={social.label}
                    className="grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
                  >
                    <BrandIcon name={social.icon} size={17} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* The graphic band. From `lg` up it is the right-hand column of the
              grid; below `lg` it stays in the flow and sits under the copy.

              It used to leave the flow below `lg` and become a dimmed
              background behind the hero. Measured, that was not survivable: the
              planet's lit band lifted the pixels under the stats list to about
              2.5:1 against the muted 11px labels, and dimming it enough to clear
              4.5:1 left the graphic effectively invisible — the arithmetic
              wanted roughly a seventh of the strength it had. Sitting in the
              flow instead, no copy is ever over it, so it can be shown whole on
              a phone rather than at 45% and still failing.

              `pointer-events-none` keeps it from stealing the CTAs' clicks. */}
          {/* Decorative: the live planet inside is drag-to-spin, but it carries
              no information, so it stays out of the accessibility tree and out
              of the tab order. `pointer-events-none` is undone on the canvas
              itself, which is the only part that wants the pointer. */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative z-0 mx-auto grid w-full place-items-center lg:static lg:z-auto lg:mx-0 lg:block"
          >
            <Reveal
              y={0}
              scale={0.9}
              className="relative isolate aspect-square w-[min(112%,25rem)] lg:mx-auto lg:w-[112%] lg:max-w-none"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    'radial-gradient(50% 46% at 50% 80%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)',
                }}
              />
              <JupiterHero className="h-full w-full" />
            </Reveal>
          </div>
        </div>
      </div>

      <CvPreviewDialog
        open={cvOpen}
        onClose={() => setCvOpen(false)}
        triggerRef={cvTriggerRef}
      />
    </section>
  );
}
