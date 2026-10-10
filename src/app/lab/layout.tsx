import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * `/lab` is the React Bits showcase: a workshop for comparing ported
 * components side by side. It is a development tool, not site content, so it
 * is kept out of search results.
 *
 * This exists as a layout because `page.tsx` is a client component and a
 * client component cannot export `metadata`. The layout is a server component,
 * so the robots directive can live here without touching the page.
 *
 * The route still ships, which is deliberate: it is what pulls the ~45
 * showcase components (and `three`, `ogl`, `matter-js`, `postprocessing`,
 * `motion`, `framer-motion`) into the deployment. They are all dynamic
 * imports, so none of them are in the home page's bundle.
 */
export const metadata: Metadata = {
  title: 'Lab',
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: ReactNode }) {
  return children;
}
