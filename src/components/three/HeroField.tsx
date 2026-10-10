'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Vector2, Vector4 } from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ParticleField, type FieldState } from './ParticleField';
import { FieldBoundary } from './FieldBoundary';
import { cn } from '@/lib/cn';

/** 30fps. Every animation in the scene is delta-driven, so halving the rate
 *  changes nothing about their speed — it only halves the cost. */
const FRAME_MS = 1000 / 30;

/** Padding added around the copy rectangle, as a fraction of the canvas. */
const COPY_PAD = 0.03;

function FrameGate({ active, invalidate }: { active: boolean; invalidate: () => void }) {
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(invalidate, FRAME_MS);
    return () => window.clearInterval(id);
  }, [active, invalidate]);
  return null;
}

/** Publishes r3f's `invalidate` so the gate can drive the demand loop. */
function GateBridge({ onReady }: { onReady: (fn: () => void) => void }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => onReady(invalidate), [invalidate, onReady]);
  return null;
}

export default function HeroField({
  className,
  copySelector = '[data-hero-copy]',
}: {
  className?: string;
  /** The element whose rectangle is kept free of bright particles. */
  copySelector?: string;
}) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const invalidateRef = useRef<(() => void) | null>(null);

  const state = useRef<FieldState>({
    morph: 0,
    pointer: new Vector2(0, 0),
    copy: new Vector4(2, 2, 2, 2),
  });

  // Declared BEFORE the effects below, because their dependency arrays are
  // evaluated during render and a `const` declared after them would be in the
  // temporal dead zone — a ReferenceError at the first render, not a warning.
  const active = inView && tabVisible && !reduced;

  // Mount only once the hero has been on screen. The hero is at the top of the
  // document, so in practice this fires immediately — it exists so a deep link
  // straight to #contact never pays for the field.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px 0px' },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Pointer parallax. Written straight into the ref — no React state per move.
  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      const host = hostRef.current;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      state.current.pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  // Scroll morph + the copy exclusion rectangle.
  //
  // There is NO `window.addEventListener('scroll')` here. The taste-skill pack
  // bans it outright (`design-taste-frontend` line 563: "a hard ban, not a
  // 'prefer-not'") and it is right: a scroll listener fires on every frame and
  // cannot be batched. This is a self-scheduling rAF loop instead, running only
  // while the field is active, measuring every 6th frame (~5 Hz at 30 fps) so
  // the loop never forces a layout in a frame it also renders. Nothing here
  // touches React state — the values go straight into the ref.
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let frame = 0;

    const measure = () => {
      const host = hostRef.current;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // 0 while the hero fills the viewport, 1 once it has scrolled fully away.
      const travel = Math.max(1, rect.height);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      state.current.morph = progress * progress;

      const copy = document.querySelector(copySelector) as HTMLElement | null;
      if (!copy) {
        state.current.copy.set(2, 2, 2, 2);
        return;
      }
      const c = copy.getBoundingClientRect();
      const toX = (px: number) => ((px - rect.left) / rect.width) * 2 - 1;
      const toY = (py: number) => -(((py - rect.top) / rect.height) * 2 - 1);
      const padX = COPY_PAD * 2;
      const padY = COPY_PAD * 2;
      state.current.copy.set(
        Math.min(toX(c.left), toX(c.right)) - padX,
        Math.min(toY(c.top), toY(c.bottom)) - padY,
        Math.max(toX(c.left), toX(c.right)) + padX,
        Math.max(toY(c.top), toY(c.bottom)) + padY,
      );
    };

    const tick = () => {
      if (frame++ % 6 === 0) measure();
      raf = window.requestAnimationFrame(tick);
    };

    measure();
    raf = window.requestAnimationFrame(tick);

    // A resize invalidates the measurement at once rather than at the next poll.
    const ro = new ResizeObserver(measure);
    if (hostRef.current) ro.observe(hostRef.current);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active, copySelector]);

  return (
    <div ref={hostRef} className={cn('relative', className)}>
      <FieldBoundary>
        <Canvas
          frameloop={active ? 'demand' : 'never'}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => gl.setClearAlpha(0)}
        >
          <GateBridge onReady={(fn) => (invalidateRef.current = fn)} />
          <FrameGate active={active} invalidate={() => invalidateRef.current?.()} />
          <ParticleField state={state} />
        </Canvas>
      </FieldBoundary>
    </div>
  );
}
