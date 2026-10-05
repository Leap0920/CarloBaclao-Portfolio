import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { profile, siteUrl } from '@/data/profile';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { THEME_SCRIPT } from '@/lib/theme';
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
  // Dark-first: each colour scheme gets its own browser chrome colour so the
  // mobile address bar never paints white above a near-black page.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b10' },
  ],
  colorScheme: 'dark light',
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
        {/* Blocking, before-paint: resolves the theme and stamps the class on
            <html>. This is what removes the flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: revealBoot }} />
      </head>
      <body className="bg-background font-sans text-foreground">
        <ThemeProvider>
          {/* `overflow-x: clip` — NOT hidden. `hidden` would turn this into a
              scroll container and break `position: sticky` on the navbar.
              `clip` trims horizontal overflow from the slide-ins while
              leaving the scrollport (and therefore sticky) untouched. */}
          <div className="overflow-x-clip">
            {children}
          </div>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
