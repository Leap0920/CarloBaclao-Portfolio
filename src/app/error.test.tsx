import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

// The boundary renders a `next/link`. App Router's Link wants router context,
// which a bare RTL render does not provide, so it is stubbed down to an anchor.
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Imported as RouteError on purpose: naming it `Error` would shadow the global
// Error constructor, and every `new Error(...)` below would then construct the
// React component instead (hooks dispatcher null, three cryptic failures).
import RouteError from './error';

describe('route error boundary', () => {
  // The component logs the error on mount; keep the test output readable.
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it('explains what happened in one line', () => {
    render(<RouteError error={new Error('boom')} reset={() => {}} />);

    expect(screen.getByRole('heading', { name: /something broke/i })).toBeInTheDocument();
    expect(screen.getByText(/trying again usually clears it/i)).toBeInTheDocument();
  });

  it('calls reset() immediately on Try again, with no intermediate step', async () => {
    const reset = vi.fn();
    const user = userEvent.setup();
    render(<RouteError error={new Error('boom')} reset={reset} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('shows a digest reference only when Next supplies one', () => {
    const { rerender } = render(<RouteError error={new Error('boom')} reset={() => {}} />);
    expect(screen.queryByText(/reference/i)).not.toBeInTheDocument();

    const withDigest = Object.assign(new Error('boom'), { digest: 'abc123' });
    rerender(<RouteError error={withDigest} reset={() => {}} />);

    expect(screen.getByText(/reference abc123/i)).toBeInTheDocument();
  });
});
