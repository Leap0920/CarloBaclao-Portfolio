import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * `globals: false` means React Testing Library cannot register its own
 * auto-cleanup (it looks for a global `afterEach`). Without this, every
 * component a test renders stays mounted for the rest of the file — and a
 * component with a `MutationObserver` keeps reacting to later tests, which
 * shows up as a mock being called more times than the test rendered.
 */
afterEach(cleanup);

/**
 * jsdom ships no `matchMedia`, but the motion hooks query it on mount.
 * Stub it once here rather than in every test that happens to render a
 * component which calls `useReducedMotion`.
 */
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  })) as unknown as typeof window.matchMedia;
}
