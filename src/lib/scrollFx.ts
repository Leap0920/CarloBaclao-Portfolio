'use client';

import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

let registered = false;

function register() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Runs a GSAP setup function scoped to a returned element ref.
 *
 * Three rules are enforced here so no caller has to remember them:
 *
 * 1. Nothing runs on the server, and nothing runs under
 *    `prefers-reduced-motion` - the ref comes back unattached and the element
 *    keeps whatever CSS already gives it.
 * 2. The setup is wrapped in `gsap.context()` scoped to the element, so
 *    `ctx.revert()` on unmount removes every tween AND every ScrollTrigger it
 *    created. A leaked ScrollTrigger keeps a stale start/end position after a
 *    layout change and fires at the wrong scroll offset.
 * 3. ScrollTrigger is registered exactly once per page.
 *
 * This is for scroll-LINKED motion only - pinning, scrubbing, parallax.
 * One-shot entrances belong to `Reveal` / the `.rise` keyframes, which are
 * CSS-gated and stay readable when the bundle never arrives.
 */
export function useScrollFx<T extends HTMLElement>(
  build: (ctx: gsap.Context) => void,
  deps: unknown[] = [],
): RefObject<T | null> {
  const scope = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = scope.current;
    if (!el || reduced) return;

    register();
    const ctx = gsap.context(build, el);
    // Web fonts, images and the hero canvas all move every trigger's
    // start/end once they settle. One refresh after paint keeps them honest.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return scope;
}
