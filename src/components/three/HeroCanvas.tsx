'use client';

import {
  Component,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type ReactNode,
} from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroSceneProps {
  still?: boolean;
  active?: boolean;
}

/**
 * Static stand-in shown whenever the 3D scene is not mounted: no WebGL,
 * reduced motion, save-data, still below the fold, or a failed chunk load.
 *
 * It fills the same box as the scene — its outermost ring and bead sit just
 * inside the box edge — so the visible gap between the copy and the graphic
 * reads the same whether the scene loaded or not. It is built from the frozen
 * tokens (accent / border), so it reads as intentional rather than broken.
 */
function SceneFallback() {
  return (
    <div aria-hidden="true" className="relative h-full w-full">
      <div
        className="absolute inset-[6%] rounded-full"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--accent) 20%, transparent), transparent 70%)',
        }}
      />
      <div className="absolute inset-[4%] rounded-full border border-accent/30" />
      <div className="absolute inset-[26%] rotate-45 rounded-card border border-border" />
      <div
        className="absolute inset-[36%] rounded-card bg-accent"
        style={{ boxShadow: '0 0 48px -6px var(--accent)' }}
      />
      <div className="absolute left-1/2 top-[4%] h-2 w-2 -translate-x-1/2 rounded-full bg-accent" />
      <div className="absolute right-[7%] top-[48%] h-1.5 w-1.5 rounded-full bg-accent/70" />
      <div className="absolute bottom-[9%] left-[15%] h-1.5 w-1.5 rounded-full bg-accent/60" />
    </div>
  );
}

/**
 * The scene chunk is fetched only once the gate below opens. A failed download
 * (offline, blocked chunk, bad deploy) resolves to the static fallback instead
 * of throwing into the hero, and `loading` keeps that fallback on screen while
 * the chunk is in flight, so the box is never empty.
 */
const HeroScene = dynamic<HeroSceneProps>(
  () =>
    import('./HeroScene').catch(() => ({
      default: SceneFallback as ComponentType<HeroSceneProps>,
    })),
  { ssr: false, loading: () => <SceneFallback /> },
);

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

type ConnectionLike = EventTarget & { saveData?: boolean };

function connection(): ConnectionLike | undefined {
  return (navigator as Navigator & { connection?: ConnectionLike }).connection;
}

function readSaveData(): boolean {
  try {
    return Boolean(connection()?.saveData);
  } catch {
    return false;
  }
}

/** Save-data is read live; browsers fire "change" if it flips mid-session. */
const dataSaverStore = {
  subscribe: (callback: () => void) => {
    const conn = connection();
    if (!conn || typeof conn.addEventListener !== 'function') return () => {};
    conn.addEventListener('change', callback);
    return () => conn.removeEventListener('change', callback);
  },
  getSnapshot: readSaveData,
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

interface HeroCanvasProps {
  className?: string;
}

/**
 * Mounts the 3D hero only when it is worth its cost. The scene stays unmounted
 * — and its ~230 KB chunk stays unfetched — until the wrapper is near the
 * viewport, and never mounts for reduced-motion, save-data or WebGL-less
 * visitors, who keep the static composition instead.
 */
export function HeroCanvas({ className }: HeroCanvasProps) {
  const reduced = useReducedMotion();
  const dataSaver = useSyncExternalStore(
    dataSaverStore.subscribe,
    dataSaverStore.getSnapshot,
    dataSaverStore.getServerSnapshot,
  );
  const webgl = useSyncExternalStore(
    webglStore.subscribe,
    webglStore.getSnapshot,
    webglStore.getServerSnapshot,
  );

  const hostRef = useRef<HTMLDivElement>(null);
  // Starts false: a visitor who never scrolls the band into view must never
  // pay for the chunk.
  const [inView, setInView] = useState(false);
  // Below `lg` the band is the hero's *background*, not a column, so it is
  // always intersecting and the gate below can never hold — a phone would
  // fetch the whole scene to sit behind the copy at 45% opacity. The static
  // composition is built for exactly that case, so the scene is desktop-only.
  const [wide, setWide] = useState(false);

  // The scene is expensive to stand up — its chunk, its shaders, its GPU
  // context — and it becomes eligible at exactly the moment the hero's copy is
  // animating in and React is hydrating. Waiting for the first idle slot lets
  // those finish first: the entrance keeps the main thread, and the graphic
  // arrives a beat later instead of competing for it.
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (!inView) {
      setIdle(false);
      return;
    }

    if (typeof window.requestIdleCallback !== 'function') {
      const timer = window.setTimeout(() => setIdle(true), 300);
      return () => window.clearTimeout(timer);
    }

    const handle = window.requestIdleCallback(() => setIdle(true), { timeout: 1500 });
    return () => window.cancelIdleCallback(handle);
  }, [inView]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setWide(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Require the band to be MEANINGFULLY on screen, not merely peeking past
    // the fold. Shrinking the observer root's bottom edge by a percentage of
    // the viewport means the gate only opens once the band has risen well into
    // view: on a tall phone, where the band's top rests just below the fold,
    // the static composition stays put and the chunk is never fetched. The
    // margin is viewport-relative (not a pixel offset tied to the band's
    // current position) so it survives the hero layout moving underneath it.
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { rootMargin: '0px 0px -20% 0px' },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const mountScene = wide && webgl && !reduced && !dataSaver && idle;

  return (
    <div ref={hostRef} className={className}>
      {mountScene ? (
        <SceneBoundary fallback={<SceneFallback />}>
          <HeroScene still={reduced} active={inView} />
        </SceneBoundary>
      ) : (
        <SceneFallback />
      )}
    </div>
  );
}
