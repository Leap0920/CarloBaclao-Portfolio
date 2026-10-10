'use client';

/**
 * The last line of defence: this one catches an error thrown by the root
 * layout itself, which means it REPLACES that layout and cannot rely on the
 * token layer or the fonts it sets up.
 *
 * So it carries its own `<html>` and `<body>` and reads the palette through
 * `var(--token, <fallback>)` — when the stylesheet is present the tokens win,
 * and when it is not the fallbacks are the documented dark defaults. Nothing
 * here depends on hydration succeeding.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'var(--background, #0b0a09)',
          color: 'var(--foreground, #f4efe7)',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '32rem' }}>
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--accent, #e2703a)',
            }}
          >
            Error
          </p>

          <h1 style={{ margin: '1.5rem 0 0', fontSize: '2rem', lineHeight: 1.2 }}>
            The site failed to load
          </h1>

          <p style={{ margin: '1.25rem 0 0', lineHeight: 1.6, color: 'var(--muted, #a79e8f)' }}>
            Something went wrong before the page could start. Reloading usually clears it.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '2rem',
              minHeight: '3rem',
              padding: '0 1.5rem',
              border: 0,
              borderRadius: '0.75rem',
              background: 'var(--accent, #e2703a)',
              color: 'var(--on-accent, #140a04)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>

          {error.digest ? (
            <p style={{ margin: '2rem 0 0', fontSize: '0.75rem', color: 'var(--muted, #a79e8f)' }}>
              Reference {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
