'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { Download, Eye } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { CvPreviewDialog } from '@/components/ui/CvPreviewDialog';
import { HeroCanvas } from '@/components/three/HeroCanvas';
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
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:pb-24 lg:pt-36">
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

          {/* The 3D band. From `lg` up it is the right-hand column of the grid;
              below `lg` it leaves the flow and becomes the hero's background,
              `absolute inset-0` anchors to the section (the grid is not itself
              positioned), so the layer covers the whole hero and the graphic
              sits centred behind the copy rather than pushing it down.
              `pointer-events-none` keeps it from stealing the CTAs' clicks, and
              the dimming lives on this wrapper rather than on the reveal child,
              where the hidden state's opacity would fight it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 grid place-items-center opacity-45 lg:static lg:z-auto lg:block lg:opacity-100"
          >
            <Reveal
              y={0}
              scale={0.9}
              className="relative isolate aspect-square w-[min(84vw,24rem)] lg:mx-auto lg:w-full lg:max-w-[28rem]"
            >
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    'radial-gradient(50% 46% at 50% 80%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)',
                }}
              />
              <HeroCanvas className="h-full w-full" />
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
