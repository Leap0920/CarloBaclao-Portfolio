'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { profile } from '@/data/profile';
import { resolveVariants, useSlideVariants, viewportOnce } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The 20px glass recipe, composed from the frozen tokens (no bespoke class).
 * `rounded-card` is the contract name, but no `--radius-card` token landed in
 * globals.css — the 20px token is `--radius`, surfaced as Tailwind's bare
 * `rounded`. Both are kept: `rounded-card` records the intent, `rounded` is
 * what actually renders the 20px today.
 */
const GLASS =
  'rounded-card rounded border border-border bg-surface/60 backdrop-blur-xl shadow-[var(--shadow-card)]';

/**
 * Portrait for the About section.
 *
 * `public/` holds no portrait — only the certification scans and the project
 * covers — so `src` is `null` and no `<img>` is rendered. An `<img>` pointed
 * at a missing file would 404, and a grey "photo coming soon" panel is not
 * this design, so the reserved slot stays empty rather than fake. The slot
 * itself is always in the flow at a fixed 4:5 ratio, so dropping a portrait at
 * `public/images/profile/carlo.jpg` and setting `src` fills it with no layout
 * shift. `alt` is already written for the moment it lands.
 */
const PROFILE_PHOTO: { src: string | null; alt: string } = {
  src: null,
  alt: 'Portrait of Carlo Baclao, full-stack developer',
};

/** Years since the first line of code — derived so it never needs a hand edit. */
const YEARS_CODING = Math.max(1, new Date().getFullYear() - profile.codingSince);

/** Scannable facts, not prose. Values come straight from the profile data. */
const QUICK_FACTS: ReadonlyArray<{ label: string; value: string }> = [
  { label: 'Location', value: profile.location },
  { label: 'Availability', value: profile.availability },
  { label: 'Experience', value: `${YEARS_CODING}+ years writing code` },
  { label: 'Languages', value: profile.spokenLanguages.join(' · ') },
];

export function About() {
  // `useSlideVariants` supplies the phone-aware travel distance; `resolveVariants`
  // is what handles reduced motion — it swaps in the resting variant (no offset,
  // zero duration) so nothing is left sitting 80px to the side.
  const reduced = useReducedMotion();
  const { slideLeft, slideRight } = useSlideVariants();
  const photoVariants = resolveVariants(slideLeft, reduced);
  const textVariants = resolveVariants(slideRight, reduced);

  return (
    <Section id="about" border={false}>
      <SectionHeading
        index="01"
        eyebrow="About"
        title="An IT student who ships"
        description="Full-stack web, native Android, and small deployments on real hardware."
      />

      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Portrait — enters from the left. */}
        <motion.div
          variants={photoVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="lg:col-span-5"
        >
          <div
            className={[
              'relative mx-auto aspect-[4/5] w-full max-w-sm lg:mx-0',
              PROFILE_PHOTO.src ? GLASS : '',
            ]
              .join(' ')
              .trim()}
          >
            {PROFILE_PHOTO.src ? (
              <img
                src={PROFILE_PHOTO.src}
                alt={PROFILE_PHOTO.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full rounded-card rounded object-cover"
              />
            ) : null}
          </div>
        </motion.div>

        {/* Bio and quick facts — enter from the right. */}
        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="lg:col-span-7"
        >
          <p className="max-w-prose text-base leading-relaxed text-muted">{profile.intro}</p>

          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
            {QUICK_FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-micro uppercase tracking-[0.16em] text-muted">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href={profile.resumeUrl}
            download="Carlo_Baclao_Resume.pdf"
            className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-card rounded bg-accent px-5 text-sm font-semibold text-on-accent transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <Download size={16} aria-hidden="true" />
            Download CV
          </a>
        </motion.div>
      </div>
    </Section>
  );
}
