'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ScrollExit, VelocityMarquee } from '@/components/ui/Cinematic';
import { CvPreviewDialog } from '@/components/ui/CvPreviewDialog';
import { Magnetic } from '@/components/ui/Magnetic';
import { profile } from '@/data/profile';
import { focusAreas } from '@/data/resume';

/**
 * The name, split once so the surname can carry the display emphasis.
 * `profile.name` stays the single source of truth; nothing here is
 * authored, and a one-word name would simply render unemphasised.
 */
const [givenName, ...surnameParts] = profile.name.split(' ');
const surname = surnameParts.join(' ');

/**
 * The hero: the opening frame of the session.
 *
 * COMPOSITION - an asymmetric split, not a centred blob. The copy is hard
 * left and occupies 7 of 12 columns; the remaining 5 are the terminal
 * window, which is the section's visual object. It is a REAL window on a
 * REAL fact: the body is `profile.intro`, the same sentence the rest of
 * the site is written from, printed as the output of `cat about.txt`.
 * Nothing in it is a fake prompt with fake output - a terminal that
 * prints lorem ipsum is a screenshot, and the one thing this theme
 * cannot afford is to be decoration wearing a shell.
 *
 * THE WEBGL FIELD IS GONE. This frame used to mount a three.js particle
 * field behind the copy, deferred to an idle callback so it could not
 * gate the entrance. It was several hundred kilobytes of WebGL on the
 * most important frame of the page to draw a moving background, and the
 * client asked for the 3D to come out. What replaced it costs one
 * element: the terminal window above, which is server-rendered markup
 * that carries real text. `src/components/three/` was deleted with it.
 *
 * TEXT BUDGET - the prompt, the name, the role, the pitch and the CTA.
 * The role is a shell comment (`# Full-Stack Developer`) rather than a
 * separate eyebrow, which is how a terminal would actually annotate the
 * line above it.
 *
 * ENTRANCE - a pure-CSS keyframe, and specifically NOT the
 * `Reveal`/`Stagger` mechanism the sections use. `Reveal` writes its
 * reveal in a useEffect, so its content stays invisible until React
 * hydrates; measured on a 4x-throttled phone that held this name at
 * opacity 0 for 5,102ms (LCP 5,512ms). The hero carries the LCP element,
 * so it may not wait on a bundle: `.hero-rise` starts at first paint, its
 * stagger is `animation-delay`, and nothing can gate it.
 */
export function Hero() {
  const [cvOpen, setCvOpen] = useState(false);
  const cvTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <section id="home" data-snap className="hero-glow relative scroll-mt-24 overflow-hidden">
      {/* The whole frame departs through `ScrollExit`: as the reader
          scrolls on, the composition scales a hair, lifts and fades to
          45%. It rests at its fully-visible state on load (its `from`
          values are the resting state) and only moves once the reader has
          actually scrolled, so nothing here is gated behind a bundle.
          Transform and opacity only. */}
      <ScrollExit to={0.96} fade={0.45} lift={-56}>
        {/* The frame. `lg:pt-32` opens the session rather than centring
            it: a shell prints from the top of the buffer, and a centred
            column on a 900px viewport put the first line of the page a
            third of the way down. `min-h-[86dvh]` rather than
            `100dvh` leaves the closing band just below the fold instead
            of stranding it a screen away, and `dvh`, never `vh`, so a
            phone browser's dynamic chrome cannot crop the frame. */}
        <div className="relative mx-auto flex w-full max-w-6xl flex-col px-5 pt-24 pb-16 sm:px-8 sm:pt-28 lg:min-h-[86dvh] lg:justify-start lg:pt-32 lg:pb-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-7">
              {/* The session line. A shell prompt, and the one place on
                  the page where the whole path is spelled out. It is one
                  inline run with no flex gap: a prompt with spaces
                  between its segments (`carlo@baclao : ~ $ whoami`) is
                  not a prompt, and a `gap` utility on this line is
                  exactly what produces that. */}
              <div className="hero-rise font-mono text-[11px] tracking-[0.08em]">
                <span className="text-faint">carlo@baclao</span>
                <span className="text-faint">:</span>
                <span className="text-accent">~</span>
                <span className="text-faint">$</span>
                <span className="text-accent"> whoami</span>
              </div>

              {/* The only h1 on the page, real selectable type at display
                  scale. The surname is italicised for emphasis: the same
                  family, never a serif injected into a mono headline. The
                  caret is the page's one blinking element and it is
                  `aria-hidden` - a cursor is not content. This is the LCP
                  element, so it takes the CSS entrance and is on screen
                  from the first paint. */}
              <h1 className="hero-rise hero-rise-2 mt-5 font-display text-display leading-display tracking-display text-foreground">
                {givenName} <span className="italic">{surname}</span>
                <span aria-hidden="true" className="caret" />
              </h1>

              <p className="hero-rise hero-rise-3 mt-4 font-mono text-sm text-muted">
                <span aria-hidden="true" className="text-accent">
                  #&nbsp;
                </span>
                {profile.role}
              </p>

              <p className="hero-rise hero-rise-4 mt-6 max-w-[46ch] text-base leading-relaxed text-ink-soft sm:text-lg">
                {profile.pitch}
              </p>

              {/* One intent, one label, page-wide. The CV is the only
                  affordance here and the nav deliberately carries no
                  second "Contact" button; the download lives inside the
                  dialog.

                  The hover lean is CSS only. The button names the `scale`
                  property in its transition, not `transform`, because
                  Tailwind v4 writes `scale-*` and `translate-*` to the
                  `scale` and `translate` properties, so a
                  `transition-transform` would leave the hover state
                  instant. */}
              <div className="hero-rise hero-rise-5 mt-8">
                <Magnetic>
                  <button
                    ref={cvTriggerRef}
                    type="button"
                    onClick={() => setCvOpen(true)}
                    aria-haspopup="dialog"
                    className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-accent pl-6 pr-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-on-accent transition-[scale] duration-500 ease-fluid hover:scale-[1.02] active:scale-[0.98]"
                  >
                    View CV
                    <span
                      aria-hidden="true"
                      className="grid h-9 w-9 place-items-center rounded-full bg-on-accent/15 transition-[translate,scale] duration-500 ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105"
                    >
                      <ArrowUpRight size={16} />
                    </span>
                  </button>
                </Magnetic>
              </div>
            </div>

            {/* The section's visual object. In the flow at every width -
                it is real content, so it never becomes a background and
                never puts text over a texture. `drift` gives it a slow
                scroll-linked parallax, which is a CSS view timeline and
                therefore works with no bundle.

                Its body is `neofetch` output, not a second copy of the
                hero paragraph. The first pass printed `profile.intro`
                here, which restated `profile.pitch` two columns to the
                left - two paragraphs of the same sentence, which reads as
                padding rather than as content. A session summary is what
                a terminal actually puts on screen at login, and every
                value below is real profile data. */}
            <div className="hero-rise hero-rise-4 lg:col-span-5">
              <div className="term drift" style={{ '--drift': '18px' } as CSSProperties}>
                <div className="term-bar">
                  <span className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2 w-2 rounded-full bg-accent/80" />
                    <span className="h-2 w-2 rounded-full bg-foreground/25" />
                    <span className="h-2 w-2 rounded-full bg-foreground/25" />
                  </span>
                  <span>zsh — carlo@baclao</span>
                </div>
                <div className="p-5 font-mono text-sm leading-relaxed">
                  <p className="text-faint">
                    <span aria-hidden="true" className="text-accent">
                      ${' '}
                    </span>
                    neofetch
                  </p>
                  <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-1">
                    <dt className="text-faint">location</dt>
                    <dd className="text-muted">{profile.location}</dd>
                    <dt className="text-faint">status</dt>
                    <dd className="text-muted">{profile.availability}</dd>
                    <dt className="text-faint">speaks</dt>
                    <dd className="text-muted">{profile.spokenLanguages.join(', ')}</dd>
                    <dt className="text-faint">coding since</dt>
                    <dd className="text-muted">{profile.codingSince}</dd>
                  </dl>
                  <p className="mt-3 text-faint">
                    <span aria-hidden="true" className="text-accent">
                      ${' '}
                    </span>
                    <span aria-hidden="true" className="caret" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The closing band: the practice areas, printed as the output of
            one command. It is the hero's gesture toward the sections
            below and it is the ONLY marquee on the page.
            `VelocityMarquee` renders its children twice (the second copy
            is `aria-hidden`), so the loop is seamless; it is
            `overflow-hidden` and transform-only, so it costs one clipped
            row at every width. The separator is a mono slash in ember,
            not a middle dot, which the design rations. */}
        <div className="mx-auto w-full max-w-6xl px-5 pb-[var(--space-section)] sm:px-8">
          <p className="mb-4 font-mono text-[11px] tracking-[0.08em]">
            <span aria-hidden="true" className="text-faint">
              ${' '}
            </span>
            <span className="text-faint">ls ~/focus</span>
          </p>
          <VelocityMarquee baseVelocity={10} direction={1}>
            {focusAreas.map((area) => (
              <span key={area.title} className="flex shrink-0 items-center gap-10 pr-10">
                <span className="whitespace-nowrap font-mono text-lg tracking-tight text-muted sm:text-xl">
                  {area.title}
                </span>
                <span aria-hidden="true" className="font-mono text-lg text-accent sm:text-xl">
                  /
                </span>
              </span>
            ))}
          </VelocityMarquee>
        </div>
      </ScrollExit>

      {/* There is deliberately NO scroll cue: the reader knows what
          scrolling is, and the taste rules ban them outright. */}

      <CvPreviewDialog
        open={cvOpen}
        onClose={() => setCvOpen(false)}
        triggerRef={cvTriggerRef}
      />
    </section>
  );
}
