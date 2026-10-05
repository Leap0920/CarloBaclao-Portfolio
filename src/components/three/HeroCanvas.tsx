'use client';

import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

let webglSupport: boolean | null = null;

/** Probes WebGL once and remembers the answer for the life of the page. */
function supportsWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;

  try {
    const canvas = document.createElement('canvas');
    webglSupport = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ?? canvas.getContext('webgl')),
    );
  } catch {
    webglSupport = false;
  }

  return webglSupport;
}

/** The capability never changes mid-session, so there is nothing to subscribe to. */
const webglStore = {
  subscribe: () => () => {},
  getSnapshot: supportsWebGL,
  // During SSR and hydration we assume no WebGL, then upgrade on the client.
  getServerSnapshot: () => false,
};

/** Keeps a renderer failure from taking the hero down with it. */
class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Static stand-in used when WebGL is unavailable or the scene fails to mount.
 * Shares the composition's visual language so the hero still looks intentional.
 */
function SceneFallback() {
  return (
    <div aria-hidden="true" className="relative h-full w-full">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-56 w-56 rounded-full border border-zinc-200 sm:h-72 sm:w-72" />
        <div className="absolute h-40 w-40 rotate-45 rounded-[2rem] border border-zinc-200 sm:h-52 sm:w-52" />
        <div className="absolute h-20 w-20 rounded-3xl bg-accent-500/90 sm:h-24 sm:w-24" />
        <div className="absolute h-1.5 w-1.5 -translate-x-28 rounded-full bg-zinc-900 sm:-translate-x-36" />
        <div className="absolute h-1 w-1 translate-x-32 translate-y-16 rounded-full bg-accent-500 sm:translate-x-40" />
      </div>
    </div>
  );
}

interface HeroCanvasProps {
  className?: string;
}

/** Mounts the 3D hero only on the client, only when WebGL works, and only while visible. */
export function HeroCanvas({ className }: HeroCanvasProps) {
  const reduced = useReducedMotion();
  const ready = useSyncExternalStore(
    webglStore.subscribe,
    webglStore.getSnapshot,
    webglStore.getServerSnapshot,
  );

  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? true),
      { rootMargin: '120px' },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={className}>
      {ready ? (
        <SceneBoundary fallback={<SceneFallback />}>
          <HeroScene still={reduced} active={inView} />
        </SceneBoundary>
      ) : (
        <SceneFallback />
      )}
    </div>
  );
}
