'use client';

import { ArrowUpRight, MapPin, Phone } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import Magnet from '@/components/reactbits/Magnet/Magnet';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { profile } from '@/data/profile';
import { cn } from '@/lib/cn';

/**
 * Every profile link except email. The email address is this section's single
 * control (the ember plate), so repeating it as an icon would be a second
 * control for the same intent. Every other entry in `profile.socials` is a
 * real, published route to Carlo, so it renders; nothing is invented to fill
 * a gap and no platform is added that is not already in the data.
 */
const socials = profile.socials.filter((social) => social.id !== 'email');

/**
 * The two facts a hiring manager needs before writing. Both come straight from
 * `profile.ts`; no phone number, calendar link or street address is introduced
 * here.
 */
const FACTS: { icon: typeof MapPin; value: string; href?: string }[] = [
  { icon: MapPin, value: profile.location },
  { icon: Phone, value: profile.phone, href: `tel:${profile.phone}` },
];

/**
 * The design system's one curve, `--ease-fluid`, handed to Magnet as a CSS
 * timing function. Magnet's own defaults are `ease-out` and `ease-in-out`, and
 * `ease-in-out` is banned by the design contract, so both of its transitions
 * are overridden here rather than left at the library default. The hero applies
 * the identical override to the same component.
 */
const FLUID = 'cubic-bezier(0.32, 0.72, 0, 1)';

/**
 * Button-in-Button: a fully-rounded pill whose trailing glyph is nested in its
 * own circular wrapper, seated flush against the pill's right inner padding,
 * never a naked arrow beside the label. `pl-6`/`py-3` give the pill its mass
 * and a 48px tap target; the smaller `pr-3` is the gutter the circle sits in,
 * so the circle's right edge is flush with the inner padding edge. On hover the
 * circle travels diagonally and scales a touch; the whole pill presses to
 * `scale-[0.98]`. Transform and colour only, on the design system's own curve.
 */
const PILL =
  'group inline-flex min-h-12 items-center gap-3 rounded-full py-3 pl-6 pr-3 text-sm font-semibold transition-transform duration-300 ease-fluid active:scale-[0.98]';

/**
 * The trailing glyph, hard-wired to the on-accent treatment: it only ever sits
 * on the ember plate, which is the section's single control.
 */
function TrailingArrow() {
  return (
    <span
      aria-hidden="true"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-on-accent/15 text-on-accent transition-transform duration-500 ease-fluid group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-105"
    >
      <ArrowUpRight size={16} />
    </span>
  );
}

/**
 * The closing section: the page's last frame.
 *
 * The statement of intent is the section heading (no eyebrow: the page is at
 * its eyebrow budget and a closing frame needs none), and the bezel panel
 * beneath it holds the actual ways to reach Carlo. There is deliberately no
 * contact form.
 *
 * ONE CONTROL PER INTENT. The hero owns "View CV"; this section owns "Email
 * me". The address is shown as plain, selectable text beside the plate, not as
 * a second control for the same intent, so the section carries exactly one
 * ember plate and no competing accent.
 *
 * Entrances are CSS. The heading rides the shared `SectionHeading`, whose
 * `.rise` keyframe does the work, and the panel rides `Reveal`. Neither can
 * leave content invisible if the bundle is slow or fails, because the hidden
 * state lives behind the `html.js-reveal` boot class rather than an inline
 * style, and no Framer entrance variant survives in this file.
 *
 * Layout family (DESIGN.md section 10): full-width statement + bezel panel.
 * Below 768px (`md`) the panel is one column with `p-6`, and the two columns
 * collapse to one; from `md` up they sit side by side and a single hairline
 * splits them. Nothing here exceeds the column at 320px.
 */
export function Contact() {
  return (
    <Section id="contact">
      <SectionHeading
        title={profile.availability}
        description="Email is the fastest route. Nothing is sent or stored from this page."
      />

      <Reveal y={40}>
        <div className="bezel">
          <div className="bezel-core p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12">
              {/* The primary route: one control per intent, the ember plate.
                  The address is plain, selectable text so it is not a second
                  control for the same intent.

                  The reactbits `Magnet` wraps the plate so it leans a few
                  pixels toward the cursor. It is deliberately subtle: a high
                  `magnetStrength` (the offset is divided by it) and a small
                  `padding` (the radius at which the pull engages) keep the lean
                  to a few pixels. Magnet wraps the plate in a plain inline-block
                  div and translates only that div, so the anchor's click
                  target, focus ring and the global press state are untouched. */}
              <div>
                <Magnet
                  magnetStrength={7}
                  padding={32}
                  activeTransition={`transform 0.3s ${FLUID}`}
                  inactiveTransition={`transform 0.5s ${FLUID}`}
                >
                  <a
                    href={`mailto:${profile.email}`}
                    className={cn(PILL, 'bg-accent text-on-accent')}
                  >
                    <span className="whitespace-nowrap">Email me</span>
                    <TrailingArrow />
                  </a>
                </Magnet>

                <p className="mt-4 break-all text-sm text-muted">{profile.email}</p>
              </div>

              {/* The remaining routes and the two facts, split off by a single
                  hairline on wide screens. */}
              <div className="md:border-l md:border-border md:pl-12">
                <ul className="flex flex-wrap gap-3">
                  {socials.map((social) => (
                    <li key={social.id}>
                      {/* A fixed 44px box in every state: only the fill shifts,
                          so the hit area can never shrink. The hover stays on
                          the neutral ink token so ember is spent on the plate
                          alone and no second accent is introduced. */}
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${social.label} - ${social.handle}`}
                        className="grid h-11 w-11 place-items-center rounded-full bg-surface-2 text-ink-soft transition-colors duration-300 ease-fluid hover:bg-foreground/10 hover:text-foreground"
                      >
                        <BrandIcon name={social.icon} size={18} />
                      </a>
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 space-y-3 border-t border-border pt-5 text-sm text-muted">
                  {FACTS.map(({ icon: Icon, value, href }) => (
                    <li key={value} className="flex items-center gap-2">
                      <Icon size={15} aria-hidden="true" className="shrink-0" />
                      {href ? (
                        /* A 44px tap target without moving the row: `min-h-11`
                           grows the hit box and the negative margin takes the
                           growth back out of the layout, so the fact list keeps
                           its rhythm at every width. */
                        <a
                          href={href}
                          className="-my-3 inline-flex min-h-11 items-center transition-colors duration-300 ease-fluid hover:text-foreground"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
