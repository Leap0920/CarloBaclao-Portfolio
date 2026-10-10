import { afterEach, describe, expect, it, vi } from 'vitest';
import { REVEAL_SCRIPT } from '@/lib/theme';

/**
 * The boot script is a string that runs in <head> before paint. It
 * cannot be unit-tested by importing a function, so it is evaluated here
 * against the jsdom document — which is exactly the environment it is
 * written for.
 *
 * There is no THEME_SCRIPT test any more: the theme script and the
 * theme switch it served were deleted with the move to a light-only
 * page. See DESIGN.md section 2.
 */
function runScript(script: string) {
  new Function(script)();
}

afterEach(() => {
  document.documentElement.className = '';
  document.documentElement.removeAttribute('style');
  delete document.documentElement.dataset.revealReady;
  vi.useRealTimers();
});

describe('REVEAL_SCRIPT', () => {
  it('arms js-reveal immediately and disarms it after the 4s hatch', () => {
    vi.useFakeTimers();
    runScript(REVEAL_SCRIPT);
    expect(document.documentElement.classList.contains('js-reveal')).toBe(true);

    vi.advanceTimersByTime(4000);
    expect(document.documentElement.classList.contains('js-reveal')).toBe(false);
  });

  it('keeps js-reveal when the app reported ready before the hatch', () => {
    vi.useFakeTimers();
    runScript(REVEAL_SCRIPT);
    document.documentElement.dataset.revealReady = 'true';

    vi.advanceTimersByTime(4000);
    expect(document.documentElement.classList.contains('js-reveal')).toBe(true);
  });
});
