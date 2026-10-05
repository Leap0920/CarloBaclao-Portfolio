import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import { profile, siteUrl } from '@/data/profile';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
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
  themeColor: '#ffffff',
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
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBoot }} />
      </head>
      <body className="bg-white text-zinc-900">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
