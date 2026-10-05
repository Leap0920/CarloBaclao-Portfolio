import { NextResponse } from 'next/server';

export const revalidate = 3600;

/** Empty day, then the four activity levels on the site's indigo ramp. */
const SCORE_COLORS = ['#f1f1f4', '#dfe4ff', '#a3b0fc', '#4f5bd5', '#2f34a0'];

/** Axis and legend labels — upstream grey reads as dirty against white. */
const LABEL_COLOR = '#a1a1aa';

/**
 * Proxies the GitHub contribution chart and recolours it for the light theme.
 *
 * The upstream palette changes without notice, so days are recoloured by their
 * `data-score` (0–4) rather than by matching hex values: a colour upstream
 * swaps out can no longer slip through as a stripe of GitHub green.
 */
export async function GET() {
  try {
    const res = await fetch('https://ghchart.rshah.org/219138/Leap0920', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return new NextResponse('Could not load contribution data', { status: 502 });
    }

    const upstream = await res.text();

    const svg = upstream
      .replace(/<rect\b[^>]*>/g, (rect) => {
        const score = /data-score="(\d)"/.exec(rect)?.[1];
        const color = score === undefined ? undefined : SCORE_COLORS[Number(score)];
        if (!color) return rect;
        return rect.replace(/fill:\s*#[0-9a-fA-F]{3,8}/, `fill:${color}`);
      })
      .replace(/#767676/gi, LABEL_COLOR)
      .replace(/width="[^"]*"/, 'width="100%"');

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return new NextResponse('Could not load contribution data', { status: 502 });
  }
}
