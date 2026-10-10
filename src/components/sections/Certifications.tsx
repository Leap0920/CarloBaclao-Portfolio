'use client';

import gsap from 'gsap';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ScrollText } from '@/components/ui/ScrollText';
import { useScrollFx } from '@/lib/scrollFx';
import { cn } from '@/lib/cn';
import { certifications, certIssuers, featuredCertifications } from '@/data/resume';
import { formatMonth } from '@/lib/format';
import type { Certification } from '@/types';

/**
 * CERTIFICATIONS - layout family "Credits roll: text only, scroll-brightened,
 * grouped by issuer" (DESIGN.md section 10a).
 *
 * The client asked for the credentials themselves as type with a cinematic
 * scroll, so the twenty-three certificate scans are not rendered at all:
 * CertificationGallery.tsx and its lightbox are deleted, and every file in
 * public/images/Certification/ is now an unreferenced asset.
 *
 * WHAT THIS IS
 * All twenty-three credentials sit in one continuous type block, grouped by
 * issuer. Each group is led by its issuer as a mono label with its count. The
 * scroll is the whole effect: every credential name is a `ScrollText`, the
 * shared word-by-word scrub, so a line the reader has not reached yet sits dim
 * and the line they are reading is at full ink. That is why the section needs
 * no plates, no cards and no images.
 *
 * The three featured credentials step up one type size and carry a short ember
 * hairline tick at the left. Everything else is the same line one step down. No
 * monogram badges, no thumbnails, no lightbox.
 *
 * TWO COLUMNS FROM `lg`
 * Each group's list is `grid-cols-1` below `lg` and `lg:grid-cols-2` above it,
 * while the group's own label spans both columns because it sits outside the
 * list. Two columns are what keep twenty-three credentials from becoming a
 * 3,000px wall. This is deliberately different from Tech Stack, which is a
 * single wide column behind a sticky rail.
 *
 * THE ONE HAIRLINE
 * A single ember progress hairline runs down the left edge of the block and
 * fills by `scaleY` as the section scrolls, driven by `useScrollFx`. It is
 * scroll-linked, it is not a nav rail and it is not sticky. Its resting state
 * is a full ember line: under `prefers-reduced-motion`, or with a failed
 * bundle, no scrub is created and the line simply reads as a hairline rather
 * than an empty gap.
 *
 * OPTIONAL FIELDS
 * `date` and `verify` are optional and unpopulated. Each renders only when it
 * exists: the credential name becomes a link when `verify` is present, and a
 * small mono date joins the line when `date` is present. With both absent there
 * is no placeholder, no "date unavailable", no dead or disabled link, no empty
 * row and no reserved gap, and the composition is already finished.
 *
 * MOBILE FALLBACK (<768px), DECLARED EXPLICITLY (DESIGN.md section 8)
 * The base classes below ARE the phone layout: one column, one type step down,
 * a smaller gutter for the progress hairline. Nothing here relies on the
 * container to collapse itself, and no width, height, top or left is animated.
 *
 * ENTRANCES AND MOTION
 * There is no Framer entrance variant and no inline start-opacity: the dim state is
 * written by GSAP at runtime, so a slow or failed bundle leaves every name
 * fully readable. Only `transform` and `opacity` move.
 */

/** The ids that earn the featured tier, so a line can ask once. */
const FEATURED_IDS = new Set(featuredCertifications.map((cert) => cert.id));

/**
 * The issuer groups in reading order.
 *
 * The three issuers that own a featured credential lead the roll, in the
 * order `featuredCertifications` lists them (the flagship freeCodeCamp
 * credential first). The remaining issuers follow in `certIssuers` order,
 * which is the data's own count-descending sort. Nothing is hardcoded: the
 * group order is derived, so it survives an edit to the data.
 */
const GROUPS: Array<{ issuer: string; members: Certification[] }> = (() => {
  const featuredIssuers = featuredCertifications.map((cert) => cert.issuer);
  const order = Array.from(
    new Set([...featuredIssuers, ...certIssuers.filter((issuer) => !featuredIssuers.includes(issuer))]),
  );

  return order.map((issuer) => ({
    issuer,
    members: certifications.filter((cert) => cert.issuer === issuer),
  }));
})();

/**
 * One credential line.
 *
 * The name is a `ScrollText` rendered `inline`, so the optional date can sit on
 * the same line and flow with the words. When `verify` is present the name
 * becomes a link: ember, the page's one interactive colour, plus the shared
 * hover underline. The ember tick is the featured tier's marker and lives in
 * the shared left gutter, so featured and secondary names stay aligned.
 */
function CredentialLine({ cert }: { cert: Certification }) {
  const featured = FEATURED_IDS.has(cert.id);

  const nameClass = cn(
    'inline font-display font-semibold tracking-tight',
    featured
      ? 'text-lg leading-tight text-foreground sm:text-xl'
      : 'text-[0.9375rem] leading-snug text-ink-soft sm:text-base',
  );

  return (
    <li className="py-2">
      <div className="relative pl-5">
        {featured ? (
          <span aria-hidden="true" className="absolute left-0 top-2.5 h-px w-3 bg-accent" />
        ) : null}

        {cert.verify ? (
          <a
            href={cert.verify}
            target="_blank"
            rel="noreferrer noopener"
            className="link-sweep text-accent"
          >
            <ScrollText className={nameClass}>{cert.name}</ScrollText>
          </a>
        ) : (
          <ScrollText className={nameClass}>{cert.name}</ScrollText>
        )}

        {cert.date ? (
          <time
            dateTime={cert.date}
            className="ml-3 font-mono text-micro uppercase tracking-[0.14em] text-muted"
          >
            {formatMonth(cert.date)}
          </time>
        ) : null}
      </div>
    </li>
  );
}

/**
 * The credits roll.
 *
 * `Section` and `SectionHeading` own the vertical rhythm, the seam hairline and
 * the heading scale, so nothing here adds its own section padding or top
 * border, and no `eyebrow` is passed: the page's eyebrow budget is spent. The
 * section heading's description is itself a `ScrollText`, so the lead line
 * scrubs with the roll beneath it.
 */
export function Certifications() {
  const scope = useScrollFx<HTMLDivElement>(() => {
    const root = scope.current;
    if (!root) return;

    const progress = root.querySelector<HTMLElement>('[data-certs-progress]');
    if (!progress) return;

    // The one hairline. Transform only, constant speed: a progress line must
    // not ease, or it stops measuring the scroll.
    gsap.fromTo(
      progress,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
          end: 'bottom 68%',
          scrub: true,
        },
      },
    );
  });

  const featuredCount = featuredCertifications.length;
  const total = certifications.length;

  return (
    <Section id="certifications">
      <SectionHeading
        command="~/certifications"
        title="Certificates and achievements"
        description={`${total} credentials from ${GROUPS.length} issuers, ${featuredCount} of them featured, in one roll.`}
      />

      {/* The block. The ref is the scroll-fx scope for the progress hairline;
          the hairline is a sibling of the groups, never a wrapper, so it can
          never become an overflow-clipping ancestor. */}
      <div ref={scope} className="relative pl-5 sm:pl-8">
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-border">
          <div data-certs-progress className="absolute inset-0 origin-top bg-accent" />
        </div>

        <div className="space-y-10 sm:space-y-14">
          {GROUPS.map((group) => (
            <section key={group.issuer}>
              {/* The group label spans both columns because it sits outside
                  the list. No rule under it: this section carries no chrome. */}
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-mono text-micro uppercase tracking-[0.14em] text-muted">
                  {group.issuer}
                </h3>
                <span
                  aria-hidden="true"
                  className="font-mono text-micro tracking-[0.14em] text-muted"
                >
                  {group.members.length}
                </span>
              </div>

              <ul className="mt-5 grid grid-cols-1 gap-x-10 lg:grid-cols-2 lg:gap-x-16">
                {group.members.map((cert) => (
                  <CredentialLine key={cert.id} cert={cert} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}
