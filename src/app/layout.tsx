import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Space_Mono } from 'next/font/google';
import { LineGutter } from '@/components/layout/LineGutter';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { StageBackdrop } from '@/components/layout/StageBackdrop';
import { StatusBar } from '@/components/layout/StatusBar';
import { profile, siteUrl } from '@/data/profile';
import { REVEAL_SCRIPT } from '@/lib/theme';
import './globals.css';

/**
 * IBM Plex Mono carries the BODY. This is the load-bearing typographic
 * decision of the SHELL theme: a terminal that types in a proportional
 * grotesque is a screenshot of a terminal, not a terminal. Plex Mono is
 * humanist enough to stay readable in a 60-word paragraph, which is why
 * it is the body face rather than the display face.
 *
 * The weights are explicit because Plex Mono is not a variable font.
 * 400 body, 500 emphasis, 600 for the few places that need a real bold.
 * Inter is banned outright by the governing skill, as are Roboto,
 * Arial, Open Sans and Helvetica.
 */
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

/**
 * Space Mono carries the DISPLAY sizes only: the hero name, section
 * titles, the footer wordmark. It is a monospace with real personality -
 * a retro terminal face with wide, slab-ish counters - where Plex Mono
 * is humanist and quiet, so the two are genuinely different faces rather
 * than one family at two sizes. The first pass used Azeret Mono here and
 * it was wrong for exactly this reason: at 5rem Azeret's letterforms
 * read as a geometric sans, so the largest piece of type on a terminal
 * page was the one piece that did not look like a terminal.
 *
 * Italic is requested because the hero sets the surname in it.
 */
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-space-mono',
  display: 'swap',
});

const headline = `${profile.name} - ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: headline,
    template: `%s - ${profile.name}`,
  },
  description: profile.pitch,
  keywords: [
    'Carlo Baclao',
    'Full Stack Developer',
    'IT Student',
    'Portfolio',
    'React Developer',
    'Next.js Developer',
    'Spring Boot',
    'TypeScript',
    'Philippines Developer',
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: `${profile.name} Portfolio`,
    title: headline,
    description: profile.pitch,
    locale: 'en_PH',
  },
  twitter: {
    card: 'summary_large_image',
    title: headline,
    description: profile.pitch,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, 'max-image-preview': 'large' },
  },
};

/**
 * One chrome colour, because there is one theme. It is the stage the
 * page actually paints, so the browser's own UI (the address bar on a
 * phone, the title bar on a desktop PWA) matches the page instead of
 * fighting it. `colorScheme: dark` is what stops a phone browser from
 * painting its own light scrollbar and form chrome over a dark page.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0d0e',
  colorScheme: 'dark',
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  jobTitle: profile.role,
  description: profile.pitch,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Quezon City',
    addressCountry: 'PH',
  },
  sameAs: profile.socials.map((social) => social.url),
  knowsAbout: profile.focusAreas,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexMono.variable} ${spaceMono.variable}`}
    >
      <head>
        {/* One boot script. There is no theme script: the dark palette
            lives in `:root`, so there is nothing to resolve before the
            first paint and nothing to flash. All that remains is the
            reveal arming. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
      </head>
      {/* No `bg-background` on <body>. The stage colour comes from `html`
          in globals.css instead, and <body> stays transparent on purpose:
          the fixed StageBackdrop paints at a negative z-index, and an
          opaque body background paints above a negative z-index child,
          which would hide the whole layer. */}
      <body className="font-sans text-foreground">
        {/* The first focusable element on the page. Visible only while
            focused; it jumps to `#main-content`, which every route marks
            on its <main>. On a page this long the first thing a keyboard
            user wants is to get past the hero and into the content, and
            this is one keypress instead of a hundred Tabs. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-card focus:bg-accent focus:px-5 focus:text-sm focus:font-semibold focus:text-on-accent"
        >
          Skip to content
        </a>
        {/* NO NAV ISLAND. There is deliberately no fixed header: the page
            is one scroll narrative and the STATUS LINE at the bottom of
            the viewport is the navigation - a shell's status line is
            where a terminal puts the session state, and the section
            anchors are that state. */}
        {/* `overflow: clip`, NOT hidden. `hidden` would turn this into a
            scroll container and break `position: sticky` inside the page;
            `clip` leaves the scrollport (and therefore sticky) untouched.
            Both axes are clipped on purpose: a scroll-reveal block sits
            `--reveal-y` px below its resting place until it plays, and a
            transformed block still counts towards the document's
            scrollable overflow, so un-clipped the last blocks make
            `scrollHeight` breathe as they play and skew the denominator
            behind the progress readout. Fixed elements (the status line,
            the gutter, back-to-top) and the portalled dialogs are not
            clipped: they resolve to the viewport or to <body>.

            `pb-[var(--statusbar-h)]` reserves the status line's height so
            the last thing on the page is never underneath it. */}
        <div className="overflow-clip pb-[var(--statusbar-h)]">{children}</div>
        {/* The scroll-linked stage lighting. A SIBLING of the clip
            wrapper, not a child: a `position: fixed` layer inside an
            `overflow: clip` ancestor is one transform away from being
            clipped along with the content. It sits at a negative
            z-index, so it is behind every section. */}
        <StageBackdrop />
        {/* The chrome. Both are fixed, both are siblings of the clip
            wrapper for the same reason as the backdrop, and both are
            inert to the pointer except for the status line's own links. */}
        <LineGutter />
        <StatusBar />
        {/* The slow-scroll layer. Renders nothing; it exists for its
            effect. A sibling of the clip wrapper, mounted after the
            chrome so the wheel listeners are attached once the fixed
            layers are in the tree. Gated on `prefers-reduced-motion` and
            on a fine pointer inside the component, so a phone and a
            reader who has asked for less motion both keep the browser's
            own scrolling. */}
        <SmoothScroll />
        {/* Page-wide grain. A SIBLING of the clip wrapper, not a child:
            a fixed layer inside an `overflow-clip` ancestor is one
            transform away from being clipped. */}
        <div aria-hidden="true" className="grain" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
