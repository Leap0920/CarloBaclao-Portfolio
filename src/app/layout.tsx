import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { profile, siteUrl } from '@/data/profile';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/** Heading face. `--font-display` in globals.css falls back to Inter if this
 *  loader is ever removed — so the wiring here is what makes the display
 *  face real. */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const headline = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: headline,
    template: `%s — ${profile.name}`,
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
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Dark only, so there is exactly one browser chrome colour: the mobile
  // address bar never paints white above a near-black page.
  themeColor: '#100e0b',
  colorScheme: 'dark',
};

/**
 * Arms the scroll-reveal styling before the first paint, so the page never
 * flashes its unwrapped content. If the app has not reported for duty within
 * four seconds — a failed bundle, an offline chunk — the class comes back off
 * and every section is simply visible. See `[data-reveal]` in globals.css.
 */
const revealBoot = `(function(){var d=document.documentElement;d.classList.add('js-reveal');setTimeout(function(){if(!d.dataset.revealReady)d.classList.remove('js-reveal')},4000)})();`;

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
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBoot }} />
      </head>
      <body className="bg-background font-sans text-foreground">
        {/* `overflow: clip` — NOT hidden. `hidden` would turn this into a
            scroll container and break `position: sticky` on the navbar;
            `clip` leaves the scrollport (and therefore sticky) untouched.
            Both axes are clipped on purpose. A scroll-reveal block sits
            `--reveal-y` px below its resting place until it plays, and a
            transformed block still counts towards the document's scrollable
            overflow — un-clipped, the last blocks on the page make
            `scrollHeight` breathe as they play, which skews the denominator
            behind the progress bar at the top. Fixed elements (header,
            progress bar, back-to-top) and the portalled dialogs are not
            clipped: they resolve to the viewport or to <body>. */}
        <div className="overflow-clip">
          {children}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
