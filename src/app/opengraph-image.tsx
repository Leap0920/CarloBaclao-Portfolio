import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';

/**
 * The social card. Generated rather than checked in as a binary, so it can
 * never drift from the profile data — change the role or the pitch and the
 * card follows on the next build.
 *
 * Satori (what renders this) supports a subset of CSS: flexbox only, no grid,
 * and every element with more than one child needs an explicit `display`.
 *
 * The palette is the site's, hardcoded because Satori cannot read CSS custom
 * properties: off-black #050505, off-white #FAFAFA, muted #B0B0B0, faint
 * #7D7D7D, surface #141414. Monochrome, like everything else — the card used
 * to be the one place the old amber survived.
 */

export const alt = `${profile.name} - ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#050505',
          backgroundImage:
            'radial-gradient(60% 55% at 10% 0%, rgba(255,255,255,0.10), transparent 70%)',
          color: '#FAFAFA',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 68,
              height: 68,
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.14)',
              backgroundColor: '#141414',
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            CB
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: '#B0B0B0',
            }}
          >
            {profile.role}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -3,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 26,
              maxWidth: 920,
              fontSize: 30,
              lineHeight: 1.35,
              color: '#B0B0B0',
            }}
          >
            {profile.pitch}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            paddingTop: 26,
            borderTop: '1px solid rgba(255,255,255,0.12)',
            fontSize: 24,
            color: '#B0B0B0',
          }}
        >
          <div style={{ display: 'flex' }}>{profile.location}</div>
          <div style={{ display: 'flex', color: '#7D7D7D' }}>·</div>
          <div style={{ display: 'flex' }}>{profile.availability}</div>
        </div>
      </div>
    ),
    size,
  );
}
