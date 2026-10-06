'use client';

import { ArrowRight, Mail } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { BrandIcon } from '@/components/BrandIcons';
import { TechStack } from '@/components/sections/TechStack';
import { HeroCanvas } from '@/components/three/HeroCanvas';
import { profile } from '@/data/profile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fadeUp, resolveVariants, scaleIn, staggerContainer, viewportOnce } from '@/lib/motion';

/** The three routes worth surfacing in the hero. */
const heroSocials = profile.socials.filter((social) =>
  ['github', 'linkedin', 'email'].includes(social.id),
);

/**
 * The opening section: a two-column hero (copy left, the 3D object right) on
 * a soft violet glow, with the tech-stack strip closing it out underneath.
 *
 * Every entrance is driven by the shared variants. Reduced motion is a
 * branch, not a hope: `resolveVariants` swaps each variant for the resting
 * state with a zero-duration transition, so nothing moves and nothing hides.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const v = (variants: Variants) => resolveVariants(variants, reduced);

  return (
    <section id="home" className="hero-glow relative isolate scroll-mt-20 overflow-hidden">
      <div className="mx-auto w-full max-w-[1200px] px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:pb-24 lg:pt-36">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          {/* Copy — first in the DOM, and lifted above the graphic, which is the
              hero's background on a phone. */}
          <motion.div
            variants={v(staggerContainer)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative z-10 max-w-xl"
          >
            <motion.h1
              variants={v(fadeUp)}
              className="font-display text-[clamp(2.5rem,8vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground"
            >
              {profile.name}
            </motion.h1>

            <motion.p
              variants={v(fadeUp)}
              className="mt-4 font-mono text-sm uppercase tracking-[0.14em] text-accent"
            >
              {profile.role}
            </motion.p>

            <motion.p
              variants={v(fadeUp)}
              className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
            >
              {profile.pitch}
            </motion.p>

            <motion.div
              variants={v(fadeUp)}
              className="mt-8 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center"
            >
              <a
                href="#projects"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-card border border-transparent bg-accent px-6 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover sm:w-auto"
              >
                View Projects
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-card border border-border-strong bg-surface px-6 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 sm:w-auto"
              >
                <Mail size={16} aria-hidden="true" />
                Contact Me
              </a>
            </motion.div>

            <motion.ul variants={v(fadeUp)} className="mt-8 flex items-center gap-1">
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
            </motion.ul>
          </motion.div>

          {/* The 3D band. From `lg` up it is the right-hand column of the grid;
              below `lg` it leaves the flow and becomes the hero's background —
              `absolute inset-0` anchors to the section (the grid is not itself
              positioned), so the layer covers the whole hero and the graphic
              sits centred behind the copy rather than pushing it down.
              `pointer-events-none` keeps it from stealing the CTAs' clicks, and
              the dimming lives on this non-motion wrapper because the `scaleIn`
              variant writes opacity inline on the motion child and would
              override a class on it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 grid place-items-center opacity-45 lg:static lg:z-auto lg:block lg:opacity-100"
          >
            <motion.div
              variants={v(scaleIn)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
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
            </motion.div>
          </div>
        </div>

        <TechStack />
      </div>
    </section>
  );
}
