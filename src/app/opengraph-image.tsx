import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';

/**
 * The social card. Generated rather than checked in as a binary, so it can
 * never drift from the profile data — change the role or the pitch and the
 * card follows on the next build.
 *
 * Satori (what renders this) supports a subset of CSS: flexbox only, no grid,
 * and every element with more than one child needs an explicit `display`.
 */

export const alt = `${profile.name} — ${profile.role}`;
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
          backgroundColor: '#100E0B',
          backgroundImage:
            'radial-gradient(60% 55% at 10% 0%, rgba(232,163,61,0.18), transparent 70%)',
          color: '#F5F1E8',
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
              border: '1px solid rgba(244,236,222,0.18)',
              backgroundColor: '#1A1712',
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
              color: '#E8A33D',
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
              color: '#A79E8D',
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
            borderTop: '1px solid rgba(244,236,222,0.14)',
            fontSize: 24,
            color: '#A79E8D',
          }}
        >
          <div style={{ display: 'flex' }}>{profile.location}</div>
          <div style={{ display: 'flex', color: '#8B8271' }}>·</div>
          <div style={{ display: 'flex' }}>{profile.availability}</div>
        </div>
      </div>
    ),
    size,
  );
}
