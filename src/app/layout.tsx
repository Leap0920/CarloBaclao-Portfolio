import type { Metadata, Viewport } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import { StageBackdrop } from '@/components/layout/StageBackdrop';
import { profile, siteUrl } from '@/data/profile';
import { REVEAL_SCRIPT } from '@/lib/theme';
import './globals.css';

/** Geist carries both body and display. One family, differentiated by
 *  scale and weight rather than a second face, which is what keeps a
 *  page this typographically loud from looking like two designs.
 *  Inter is banned outright by the governing skill, as are Roboto,
 *  Arial, Open Sans and Helvetica. */
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
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
 * One chrome colour, because there is one theme. It is the bone stage the
 * page actually paints, so the browser's own UI (the address bar on a
 * phone, the title bar on a desktop PWA) matches the page instead of
 * fighting it. There is no media-query pair to keep in step any more.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f3f0ea',
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
      className={`${geist.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* One boot script now. The theme script went with the theme
            switch: the light palette lives in `:root`, so there is nothing
            to resolve before the first paint and nothing to flash. All that
            remains is the reveal arming. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
      </head>
      {/* No `bg-background` on <body>. The stage colour comes from `html` in
          globals.css instead, and <body> stays transparent on purpose: the
          fixed StageBackdrop paints at a negative z-index, and an opaque body
          background paints above a negative z-index child, which would hide the
          whole layer. With <body> transparent the layer sits above the html
          canvas and below all content. */}
      <body className="font-sans text-foreground">
        {/* The first focusable element on the page. Visible only while
            focused; it jumps to `#main-content`, which every route marks on
            its <main>. It survives the nav island's removal deliberately: on
            a page this long the first thing a keyboard user wants is to get
            past the hero and into the content, and this is one keypress
            instead of a hundred Tabs. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-card focus:bg-accent focus:px-5 focus:text-sm focus:font-semibold focus:text-on-accent"
        >
          Skip to content
        </a>
        {/* NO NAV ISLAND. There is deliberately no fixed header: the page is
            one scroll narrative, the footer carries the same section anchors
            for anyone who wants to jump, and the scroll-spy that fed the
            island's `aria-current` went with it. Everything that used to say
            "the nav island is a sibling of the clip wrapper" is moot now;
            `StageBackdrop` and the grain keep that placement for their own
            reasons (see below). */}
        {/* `overflow: clip`, NOT hidden. `hidden` would turn this into a
            scroll container and break `position: sticky` inside the
            page; `clip` leaves the scrollport (and therefore sticky)
            untouched. Both axes are clipped on purpose: a scroll-reveal
            block sits `--reveal-y` px below its resting place until it
            plays, and a transformed block still counts towards the
            document's scrollable overflow, so un-clipped the last blocks
            make `scrollHeight` breathe as they play and skew the
            denominator behind the progress bar. Fixed elements (the nav
            island, the progress bar, back-to-top) and the portalled
            dialogs are not clipped: they resolve to the viewport or to
            <body>. */}
        <div className="overflow-clip">
          {children}
        </div>
        {/* The scroll-linked stage lighting. A SIBLING of the clip wrapper,
            not a child, for the same reason the nav island and the grain are:
            a `position: fixed` layer inside an `overflow: clip` ancestor is one
            transform away from being clipped along with the content. It sits at
            a negative z-index, so it is behind every section. */}
        <StageBackdrop />
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
