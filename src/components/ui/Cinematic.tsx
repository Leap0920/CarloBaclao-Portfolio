'use client';

import { type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollFx } from '@/lib/scrollFx';
import { cn } from '@/lib/cn';

/**
 * Cinematic scroll primitives.
 *
 * Three rules hold across every one of them, and they are the reason these
 * live in one file instead of being re-implemented per section:
 *
 * 1. EVERYTHING DEGRADES TO A PLAIN VERTICAL STACK. A pinned horizontal rail is
 *    a desktop affordance; on a phone it is a way to hide content behind a
 *    gesture nobody discovers. Each primitive renders a normal stacked layout
 *    below its breakpoint and only then opts into the effect, so the mobile DOM
 *    is the simple one and the page height stays honest.
 * 2. NOTHING RUNS UNDER prefers-reduced-motion OR ON THE SERVER. That is
 *    handled inside useScrollFx, which returns an unattached ref and lets the
 *    CSS resting state stand.
 * 3. ONLY transform AND opacity ARE ANIMATED. Never width, height, top or left
 *    — those relayout every frame and are what makes a scroll effect feel like
 *    it is dragging the page instead of moving with it.
 */

/**
 * Sticky stacking plates.
 *
 * Each item sticks a little lower than the one before it, so as the reader
 * scrolls the plates pile up and the newest covers the last. The depth cue is
 * a scrubbed scale on everything except the top card — it shrinks slightly as
 * it is covered, which is what stops the stack reading as a flat overlap.
 *
 * Pure CSS `position: sticky` does the pinning; GSAP only adds the scale. That
 * means the stack still works (just without the depth) if the bundle is slow.
 */
export function StickyStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useScrollFx<HTMLOListElement>((ctx) => {
    const el = scope.current;
    if (!el) return;

    const items = gsap.utils.toArray<HTMLElement>('[data-stack-item]', el);
    if (items.length < 2) return;

    items.forEach((item, i) => {
      if (i === items.length - 1) return; // the last card is never covered
      gsap.to(item, {
        scale: 0.94,
        opacity: 0.55,
        ease: 'none',
        scrollTrigger: {
          trigger: items[i + 1],
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      });
    });
  });

  return (
    <ol ref={scope} className={cn('relative', className)}>
      {children}
    </ol>
  );
}

export function StickyStackItem({
  children,
  index,
  className,
}: {
  children: ReactNode;
  index: number;
  className?: string;
}) {
  return (
    <li
      data-stack-item
      className={cn('sticky will-change-transform', className)}
      style={
        {
          // Each plate parks 1.5rem below the previous one, under the floating
          // nav island (which is ~4.5rem tall plus its own offset).
          top: `calc(5.5rem + ${index * 1.5}rem)`,
        } as CSSProperties
      }
    >
      {children}
    </li>
  );
}

/**
 * Scroll-velocity skew.
 *
 * The page leans into the scroll: moving fast skews the content a degree or
 * two along Y, and it springs back to square as the scroll settles. This is the
 * single cheapest way to make a long page feel like it has weight.
 *
 * Transform only, driven from a quickTo so it never queues a tween per frame.
 */
export function ScrollSkew({
  children,
  className,
  strength = 3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const scope = useScrollFx<HTMLDivElement>((ctx) => {
    const el = scope.current;
    if (!el) return;

    const proxy = { skew: 0 };
    const setter = gsap.quickSetter(el, 'skewY', 'deg') as (v: number) => void;

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = gsap.utils.clamp(-strength, strength, self.getVelocity() / -420);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.55,
            ease: 'power3',
            overwrite: true,
            onUpdate: () => setter(proxy.skew),
          });
        }
      },
    });

    return () => trigger.kill();
  });

  return (
    <div ref={scope} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}

/**
 * A block that lifts away as it leaves the top of the viewport.
 *
 * This is the mirror of `ScrollSettle`: where that one is an *entrance* and
 * can only run for a block that starts below the fold, this one is an *exit*
 * and is meant for blocks that start at the top of the document — the hero, the
 * closing statement. It runs from `top top` to `bottom top`, so it is at its
 * resting state on load and only moves once the reader has actually scrolled.
 *
 * Scale, opacity and a small lift. Transform and opacity only.
 */
export function ScrollExit({
  children,
  className,
  to = 0.9,
  fade = 0.25,
  lift = -70,
}: {
  children: ReactNode;
  className?: string;
  /** Scale the block shrinks to as it leaves. */
  to?: number;
  /** Opacity it fades to. Keep above 0 — this is a departure, not a deletion. */
  fade?: number;
  /** How far it drifts up, in px. Negative is up. */
  lift?: number;
}) {
  const scope = useScrollFx<HTMLDivElement>((ctx) => {
    const el = scope.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { scale: 1, opacity: 1, y: 0 },
      {
        scale: to,
        opacity: fade,
        y: lift,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  }, [to, fade, lift]);

  return (
    <div ref={scope} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}

/**
 * A marquee whose speed follows the scroll.
 *
 * Scroll down and the band accelerates; stop and it settles back to its base
 * speed. Built on `gsap.ticker` rather than a CSS animation because the speed
 * has to be a live value, and driven from `ScrollTrigger`'s velocity rather than
 * a scroll listener so it shares one scroll pass with everything else.
 *
 * The track holds TWO copies of the children and wraps at half its own width,
 * so the loop is seamless. The second copy is `aria-hidden` — a screen reader
 * should not read the list twice.
 */
export function VelocityMarquee({
  children,
  className,
  trackClassName,
  baseVelocity = 60,
  direction = 1,
}: {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** Idle speed in px per second. */
  baseVelocity?: number;
  /** `1` travels left, `-1` travels right. */
  direction?: 1 | -1;
}) {
  const scope = useScrollFx<HTMLDivElement>((ctx) => {
    const el = scope.current;
    if (!el) return;

    const track = el.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return;

    const setX = gsap.quickSetter(track, 'x', 'px') as (v: number) => void;
    let x = 0;
    let boost = 0;
    let half = 0;

    const measure = () => {
      half = track.scrollWidth / 2;
    };
    measure();

    const tick = (_time: number, deltaMs: number) => {
      // Decay the scroll kick back toward the base speed.
      boost *= 0.94;
      x -= (baseVelocity * direction + boost) * (deltaMs / 1000);
      if (half > 0) x = (((x % half) + half) % half) - half;
      setX(x);
    };

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        boost = gsap.utils.clamp(-1400, 1400, self.getVelocity() * 0.14);
      },
    });

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      trigger.kill();
    };
  }, [baseVelocity, direction]);

  return (
    <div ref={scope} className={cn('overflow-hidden', className)}>
      <div data-marquee-track className={cn('flex w-max', trackClassName)}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}