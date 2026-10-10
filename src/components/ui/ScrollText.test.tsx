import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollText } from '@/components/ui/ScrollText';

/**
 * The scrub's contract, pinned. Two defects lived here and must not return:
 *
 *  1. Under `prefers-reduced-motion` the hook's server snapshot is `false`,
 *     so the first pass built the tween and wrote a dim inline opacity; when
 *     the hook corrected to `true` the cleanup killed the tween but left the
 *     inline opacity behind, stranding every word at the dim value forever.
 *  2. The dim floor was a single hardcoded alpha that measured well under
 *     4.5:1 against the painted backdrop. There is now exactly ONE floor,
 *     0.95, and it is the light floor: the page is light-only, and the old
 *     dark floor (0.7) left in place measures 2.1:1 on the bone stage.
 *
 * The runtime theme-flip test is gone with the theme switch. The floor no
 * longer depends on any class on <html>, and that is asserted below.
 */
const gsapMock = vi.hoisted(() => {
  const kill = vi.fn();
  const scrollTriggerKill = vi.fn();
  // Params are typed on purpose: a bare `vi.fn()` infers a zero-arg mock,
  // so `mock.calls[0][1]` fails to typecheck against an empty tuple.
  const fromTo = vi.fn(
    (_targets: unknown, _from: Record<string, number>, _to: Record<string, unknown>) => ({
      scrollTrigger: { kill: scrollTriggerKill },
      kill,
    }),
  );
  return { registerPlugin: vi.fn(), set: vi.fn(), fromTo, kill, scrollTriggerKill };
});

vi.mock('gsap', () => ({ default: gsapMock }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { kill: vi.fn(), refresh: vi.fn() } }));

const motion = vi.hoisted(() => ({ reduced: false }));
vi.mock('@/hooks/useReducedMotion', () => ({ useReducedMotion: () => motion.reduced }));

const fromVars = (call = 0) => gsapMock.fromTo.mock.calls[call]?.[1];

beforeEach(() => {
  motion.reduced = false;
  document.documentElement.className = '';
  gsapMock.fromTo.mockClear();
  gsapMock.set.mockClear();
  gsapMock.registerPlugin.mockClear();
});

describe('ScrollText', () => {
  it('splits the sentence into one span per word', () => {
    const { container } = render(<ScrollText>alpha beta gamma</ScrollText>);
    const words = container.querySelectorAll('[data-word]');
    expect(words).toHaveLength(3);
    expect(container.textContent?.replace(/\u00a0/g, ' ')).toBe('alpha beta gamma');
  });

  it('scrubs from the floor to full opacity', () => {
    render(<ScrollText>alpha beta gamma</ScrollText>);

    expect(gsapMock.fromTo).toHaveBeenCalledTimes(1);
    expect(gsapMock.fromTo.mock.calls[0]?.[0]).toHaveLength(3);
    expect(fromVars()).toEqual({ opacity: 0.95 });
    expect(gsapMock.fromTo.mock.calls[0]?.[2]).toMatchObject({
      opacity: 1,
      ease: 'none',
      stagger: 0.4,
      scrollTrigger: { start: 'top 85%', end: 'bottom 55%', scrub: true },
    });
  });

  it('uses the same floor whichever theme class is on <html>', () => {
    document.documentElement.classList.add('dark');
    const first = render(<ScrollText>alpha beta</ScrollText>);
    expect(fromVars()).toEqual({ opacity: 0.95 });
    first.unmount();
    gsapMock.fromTo.mockClear();

    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    render(<ScrollText>alpha beta</ScrollText>);
    expect(fromVars()).toEqual({ opacity: 0.95 });
  });

  it('never applies a dim floor under reduced motion', () => {
    motion.reduced = true;
    render(<ScrollText>alpha beta</ScrollText>);

    expect(gsapMock.fromTo).not.toHaveBeenCalled();
    expect(gsapMock.registerPlugin).not.toHaveBeenCalled();
    expect(gsapMock.set).toHaveBeenCalledWith(expect.anything(), { clearProps: 'opacity' });
  });

  it('clears a dim floor written before reduced motion was known', async () => {
    // Pass one: the server snapshot says `false`, so the tween is built.
    motion.reduced = false;
    const { rerender } = render(<ScrollText>alpha beta</ScrollText>);
    expect(gsapMock.fromTo).toHaveBeenCalledTimes(1);

    // Pass two: the hook corrects to `true`. No new tween may be built, and
    // the inline opacity the first pass wrote must be cleared.
    motion.reduced = true;
    rerender(<ScrollText>alpha beta</ScrollText>);

    await waitFor(() =>
      expect(gsapMock.set).toHaveBeenCalledWith(expect.anything(), { clearProps: 'opacity' }),
    );
    expect(gsapMock.fromTo).toHaveBeenCalledTimes(1);
  });
});
