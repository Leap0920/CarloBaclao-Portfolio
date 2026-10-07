'use client';

import {
  Children,
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

/** Grace period after the transition should have finished, before we force the
 * final state. Covers the cases where the frame clock is stalled — a background
 * tab, an occluded window — and a CSS transition therefore never advances. */
const SETTLE_MS = 1100;

/** How far below the viewport's bottom edge a block has to reach before it plays. */
const TRIGGER_MARGIN = 70;

const StaggerDelay = createContext(0);

/**
 * Blocks waiting to play, and the work that plays them.
 *
 * This is hand-rolled rather than an IntersectionObserver on purpose. An
 * observer only reports *changes* in intersection, so a jump — a nav link, a
 * restored scroll position, `scrollTo` — can carry a block from below the
 * viewport to above it between two observation points, and no callback ever
 * arrives: the block stays at zero opacity for good. A rect check on each
 * scroll frame cannot miss it, because "above the line" is just a position.
 */
const waiting = new Map<HTMLElement, number>();
let listening = false;

function play(node: HTMLElement, delayMs: number) {
  if (node.dataset.reveal === 'shown') return;
  node.style.transitionDelay = `${delayMs}ms`;
  node.dataset.reveal = 'shown';
  window.setTimeout(() => {
    if (getComputedStyle(node).opacity !== '1') node.style.transition = 'none';
  }, delayMs + SETTLE_MS);
}

/**
 * Runs straight off the scroll event rather than through a frame callback:
 * `requestAnimationFrame` is throttled to nothing in a background or occluded
 * window, which would leave blocks that require a scroll parked at zero opacity.
 * Reads happen first and writes second, so the pass costs one layout, not one
 * per block.
 */
function measure() {
  const line = window.innerHeight - TRIGGER_MARGIN;
  let ready: Array<[HTMLElement, number]> | null = null;

  for (const [node, delayMs] of waiting) {
    if (node.getBoundingClientRect().top >= line) continue;
    (ready ??= []).push([node, delayMs]);
  }

  if (!ready) return;
  for (const [node, delayMs] of ready) {
    waiting.delete(node);
    play(node, delayMs);
  }
  if (waiting.size === 0) stopWatching();
}

function startWatching() {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', measure, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
}

function stopWatching() {
  listening = false;
  window.removeEventListener('scroll', measure);
  window.removeEventListener('resize', measure);
}

/** The tags a reveal can land on without changing the markup's semantics. */
type RevealTag = 'div' | 'article' | 'li' | 'ul' | 'form' | 'p' | 'span' | 'section';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before this element animates in. */
  delay?: number;
  /** Distance in pixels the element travels upward. */
  y?: number;
  /** Distance in pixels the element travels sideways. Negative enters from the left. */
  x?: number;
  /** Scale the element starts at. */
  scale?: number;
  /** Element to render. Defaults to a div; use it to keep list/article semantics. */
  as?: RevealTag;
}

/**
 * Fades and lifts its children into view once they are scrolled into sight.
 *
 * The hidden state is written into the markup, but the CSS that acts on it is
 * scoped to `html.js-reveal` — a class the boot script adds before the first
 * paint. No JavaScript, a failed bundle, or a stalled clock all end with the
 * content on screen rather than stuck at zero opacity.
 *
 * This is the ONLY entrance mechanism the sections use. A JS-gated entrance
 * (a framework variant that server-renders `opacity: 0`) holds real content
 * hostage to hydration: on a slow connection the copy is in the HTML but
 * invisible for as long as the bundle takes to arrive, and any trigger that
 * fails to fire leaves the block blank for good. See the hero's `hero-rise`
 * keyframe for the same rule applied to the LCP element.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  x = 0,
  scale = 1,
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // The app booted: stand down the boot script's escape hatch.
    document.documentElement.dataset.revealReady = 'true';

    if (reduced) {
      node.dataset.reveal = 'shown';
      return;
    }

    const delayMs = Math.round(delay * 1000);
    waiting.set(node, delayMs);
    startWatching();
    measure();

    return () => {
      waiting.delete(node);
      if (waiting.size === 0) stopWatching();
    };
  }, [reduced, delay]);

  return createElement(
    as,
    {
      ref,
      'data-reveal': 'hidden',
      className: cn(className),
      style: {
        '--reveal-y': `${y}px`,
        '--reveal-x': `${x}px`,
        '--reveal-scale': scale,
      } as CSSProperties,
    },
    children,
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each child's entrance. */
  step?: number;
  /** Seconds to wait before the first child animates in. */
  delay?: number;
}

/**
 * Reveals its children one after another. Spacing is published through context
 * and read by each `StaggerItem`, so the children keep their own markup.
 */
export function Stagger({ children, className, step = 0.07, delay = 0 }: StaggerProps) {
  const items = Children.toArray(children);

  return (
    <div className={cn(className)}>
      {items.map((child, index) => (
        <StaggerDelay.Provider key={index} value={delay + index * step}>
          {child}
        </StaggerDelay.Provider>
      ))}
    </div>
  );
}

/** A single child of `Stagger`. */
export function StaggerItem({
  children,
  className,
  y = 18,
  x = 0,
  scale = 1,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  x?: number;
  scale?: number;
  as?: RevealTag;
}) {
  const delay = useContext(StaggerDelay);

  return (
    <Reveal className={className} delay={delay} y={y} x={x} scale={scale} as={as}>
      {children}
    </Reveal>
  );
}
