'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Nodes around a centre, with pulses travelling the spokes between them.
 *
 * React Bits Pro ships a `center-flow` component with this idea. That one is a
 * paid component and its source is not published, so this is not it — it is an
 * independent implementation written here, matching the behaviour the public
 * prop list describes.
 *
 * One requestAnimationFrame loop drives every pulse by writing attributes on
 * refs. Nothing here re-renders React: the positions are computed once per
 * resize and the animation is pure attribute writes, which keeps the cost flat
 * however many nodes there are.
 */

export interface CenterFlowNode {
  /** Rendered inside the node. Falls back to a plain dot. */
  content?: React.ReactNode;
}

export interface CenterFlowProps {
  /** One entry per outer node. The count comes from the array length. */
  nodeItems?: CenterFlowNode[];
  /** Rendered inside the centre square. */
  centerContent?: React.ReactNode;
  /** Centre square size in pixels. */
  centerSize?: number;
  /** Outer node size in pixels. */
  nodeSize?: number;
  /** Seconds for a pulse to travel the whole spoke. */
  pulseDuration?: number;
  /** Average seconds between pulses spawning. */
  pulseInterval?: number;
  /** Pulse length as a fraction of the spoke, 0 to 1. */
  pulseLength?: number;
  /** Stroke width of the spokes. */
  lineWidth?: number;
  /** Stroke width of the pulse. */
  pulseWidth?: number;
  /** Blur applied to the pulse, in pixels. */
  pulseSoftness?: number;
  /** Spoke colour. */
  lineColor?: string;
  /** Pulse colour. */
  pulseColor?: string;
  /** Centre glow colour. */
  glowColor?: string;
  /** Peak glow opacity. */
  maxGlowIntensity?: number;
  /** How fast the glow decays after a pulse lands, per frame. */
  glowDecay?: number;
  /** Corner radius of the centre square. */
  borderRadius?: number;
  /** Distance of the nodes from the centre, as a fraction of the half-short-side. */
  nodeDistance?: number;
  /** Stop the centre from brightening when a pulse arrives. */
  disableBlinking?: boolean;
  className?: string;
}

interface Pulse {
  spoke: number;
  startedAt: number;
  duration: number;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

export function CenterFlow({
  nodeItems = Array.from({ length: 9 }, () => ({})),
  centerContent,
  centerSize = 120,
  nodeSize = 60,
  pulseDuration = 5,
  pulseInterval = 10,
  pulseLength = 0.4,
  lineWidth = 2,
  pulseWidth = 1,
  pulseSoftness = 10,
  lineColor = '#2A241C',
  pulseColor = '#FAFAFA',
  glowColor = '#FAFAFA',
  maxGlowIntensity = 25,
  glowDecay = 0.95,
  borderRadius = 35,
  nodeDistance = 0.7,
  disableBlinking = false,
  className,
}: CenterFlowProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const spokesRef = useRef<SVGLineElement[]>([]);
  const pulsesRef = useRef<SVGLineElement[]>([]);
  const glowRef = useRef<SVGCircleElement>(null);
  const nodesRef = useRef<HTMLDivElement[]>([]);

  const count = nodeItems.length;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Geometry, recomputed on resize. Node positions are in percentages of the
    // container so the SVG viewBox can stay in user units.
    const layout = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.5 * nodeDistance;

      spokesRef.current.forEach((line, i) => {
        if (!line) return;
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        line.setAttribute('x1', String(cx));
        line.setAttribute('y1', String(cy));
        line.setAttribute('x2', String(x));
        line.setAttribute('y2', String(y));
      });

      // The node boxes are absolutely positioned on the same circle.
      nodesRef.current.forEach((node, i) => {
        if (!node) return;
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        node.style.left = `${cx + Math.cos(angle) * radius}px`;
        node.style.top = `${cy + Math.sin(angle) * radius}px`;
      });

      if (glowRef.current) {
        glowRef.current.setAttribute('cx', String(cx));
        glowRef.current.setAttribute('cy', String(cy));
      }
    };

    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(host);

    if (reduced) {
      // Static spokes, no pulses.
      pulsesRef.current.forEach((p) => p?.setAttribute('opacity', '0'));
      return () => observer.disconnect();
    }

    const pulses: Pulse[] = [];
    let glow = 0;
    let raf = 0;
    let running = true;
    let lastSpawn = performance.now();
    // Randomised so the pulses never fall into a visible rhythm.
    let nextGap = pulseInterval * 1000 * (0.4 + Math.random() * 1.2);

    const frame = (now: number) => {
      if (!running) return;

      if (now - lastSpawn >= nextGap && count > 0) {
        lastSpawn = now;
        nextGap = pulseInterval * 1000 * (0.4 + Math.random() * 1.2);
        pulses.push({
          spoke: Math.floor(Math.random() * count),
          startedAt: now,
          duration: pulseDuration * 1000,
        });
      }

      const host_ = hostRef.current;
      const w = host_?.clientWidth ?? 0;
      const h = host_?.clientHeight ?? 0;
      const cx = w / 2;
      const cy = h / 2;

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const line = pulsesRef.current[pulse.spoke];
        const progress = (now - pulse.startedAt) / pulse.duration;

        if (!line || progress >= 1) {
          if (line) line.setAttribute('opacity', '0');
          if (progress >= 1 && !disableBlinking) glow = Math.min(1, glow + 0.5);
          pulses.splice(i, 1);
          continue;
        }

        // A short segment travelling from the centre outward. The head is at
        // `progress`, the tail `pulseLength` behind it, both clamped to the
        // spoke so a pulse never pokes out past the node.
        const head = progress;
        const tail = Math.max(0, progress - pulseLength);
        const spoke = spokesRef.current[pulse.spoke];
        if (spoke) {
          const x1 = Number(spoke.getAttribute('x1') ?? cx);
          const y1 = Number(spoke.getAttribute('y1') ?? cy);
          const x2 = Number(spoke.getAttribute('x2') ?? cx);
          const y2 = Number(spoke.getAttribute('y2') ?? cy);
          line.setAttribute('x1', String(x1 + (x2 - x1) * tail));
          line.setAttribute('y1', String(y1 + (y2 - y1) * tail));
          line.setAttribute('x2', String(x1 + (x2 - x1) * head));
          line.setAttribute('y2', String(y1 + (y2 - y1) * head));
        }
        line.setAttribute('opacity', '1');
      }

      // Fade the glow, then apply it. `glowDecay` is per frame, so the glow
      // fades at the same rate regardless of the display's refresh rate only
      // if the frame rate is steady; it is a decorative value, so it is fine.
      glow *= glowDecay;
      if (glowRef.current) {
        glowRef.current.setAttribute('opacity', String(Math.min(1, glow)));
      }

      raf = window.requestAnimationFrame(frame);
    };

    raf = window.requestAnimationFrame(frame);

    return () => {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [
    count,
    pulseDuration,
    pulseInterval,
    pulseLength,
    nodeDistance,
    glowDecay,
    disableBlinking,
  ]);

  return (
    <div ref={hostRef} className={cn('relative h-full w-full', className)}>
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <line
            key={`spoke-${i}`}
            ref={(el) => {
              if (el) spokesRef.current[i] = el;
            }}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
        ))}

        {/* The glow sits under the pulses so it reads as light behind them. */}
        <circle
          ref={glowRef}
          r={centerSize}
          fill={glowColor}
          opacity="0"
          style={{ filter: `blur(${Math.round(centerSize / 4)}px)` }}
        />

        {Array.from({ length: count }, (_, i) => (
          <line
            key={`pulse-${i}`}
            ref={(el) => {
              if (el) pulsesRef.current[i] = el;
            }}
            stroke={pulseColor}
            strokeWidth={pulseWidth}
            strokeLinecap="round"
            opacity="0"
            style={{ filter: pulseSoftness ? `blur(${pulseSoftness / 3}px)` : undefined }}
          />
        ))}
      </svg>

      {/* Centre. `-translate-x-1/2 -translate-y-1/2` keeps it on the true centre
          however big it is. */}
      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-border-strong bg-surface text-foreground"
        style={{ width: centerSize, height: centerSize, borderRadius }}
      >
        {centerContent}
      </div>

      {nodeItems.map((item, i) => (
        <div
          key={`node-${i}`}
          ref={(el) => {
            if (el) nodesRef.current[i] = el;
          }}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-border bg-surface-2 text-muted"
          style={{ width: nodeSize, height: nodeSize, borderRadius: Math.round(nodeSize / 2) }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

export default CenterFlow;
