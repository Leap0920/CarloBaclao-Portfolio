'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * A fluid surface drawn as characters.
 *
 * React Bits Pro ships a `liquid-ascii` component that runs a full FLIP/PIC
 * particle fluid and rasterises it to a glyph grid. That one is a paid
 * component and its source is not published, so this is not it — this is an
 * independent take on the same idea, built here rather than copied.
 *
 * The simulation is a damped two-dimensional wave equation on a height field:
 * each cell is pulled toward the mean of its four neighbours and pushed away
 * from where it was on the previous step, which is the standard explicit
 * scheme for a vibrating surface. The cursor injects energy; left alone, the
 * surface falls quiet and the auto wave takes over so it is never dead.
 *
 * Rendering walks the same grid and picks a character from a ramp ordered by
 * visual weight, so a crest reads bright and a trough reads sparse. The grid
 * is deliberately coarse — the glyph is the pixel — which keeps the character
 * count, and therefore the number of fillText calls, bounded.
 */

export interface LiquidAsciiProps {
  /** Cell size in CSS pixels. Smaller means more characters and more work. */
  cellSize?: number;
  /** Characters ordered light to heavy. */
  characters?: string;
  /** Text colour. */
  color?: string;
  /** Background colour. */
  backgroundColor?: string;
  fontFamily?: string;
  /** Simulation speed multiplier. */
  speed?: number;
  /** How much of the container's height the surface fills, 0 to 1. */
  fillHeight?: number;
  /** Cursor influence radius as a fraction of the short side. */
  cursorRadius?: number;
  /** Cursor push strength. */
  cursorForce?: number;
  /** Keep the surface moving when the cursor is idle. */
  autoWave?: boolean;
  className?: string;
}

const DEFAULT_CHARS = ' ·:-~=+*#%@';

export function LiquidAscii({
  cellSize = 14,
  characters = DEFAULT_CHARS,
  color = '#FAFAFA',
  backgroundColor = 'transparent',
  fontFamily = 'ui-monospace, SFMono-Regular, Menlo, monospace',
  speed = 1,
  fillHeight = 0.55,
  cursorRadius = 0.25,
  cursorForce = 1,
  autoWave = true,
  className,
}: LiquidAsciiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ramp = characters.length > 1 ? characters : DEFAULT_CHARS;

    // Grid state. Two height buffers and a velocity buffer, all flat Float32.
    let cols = 0;
    let rows = 0;
    let cell = cellSize;
    let current = new Float32Array(0);
    let previous = new Float32Array(0);
    let velocity = new Float32Array(0);

    // Pointer, in grid coordinates. `active` gates the injection so an idle
    // cursor does not keep pumping energy into the surface.
    let pointerX = -1;
    let pointerY = -1;
    let pointerActive = false;
    let idleFrames = 0;

    let raf = 0;
    let running = true;
    let lastTime = 0;

    const index = (x: number, y: number) => y * cols + x;

    const allocate = (nextCols: number, nextRows: number, nextCell: number) => {
      cols = nextCols;
      rows = nextRows;
      cell = nextCell;
      const size = cols * rows;
      current = new Float32Array(size);
      previous = new Float32Array(size);
      velocity = new Float32Array(size);
      // A shallow standing ripple to start from, so the first frame is not blank.
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const h = Math.sin(x * 0.16) * 0.25 + Math.cos(y * 0.21) * 0.2;
          current[index(x, y)] = h;
          previous[index(x, y)] = h;
        }
      }
    };

    const resize = () => {
      const cssW = host.clientWidth || 1;
      const cssH = host.clientHeight || 1;

      // The grid is coarse on purpose: it is the resolution of the artwork, and
      // it is what keeps the per-frame fillText count in the low thousands.
      const nextCols = Math.max(8, Math.min(240, Math.round(cssW / cellSize)));
      const nextRows = Math.max(6, Math.min(160, Math.round(cssH / cellSize)));
      const nextCell = cssW / nextCols;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(cssW * dpr);
      const h = Math.round(cssH * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (nextCols !== cols || nextRows !== rows) allocate(nextCols, nextRows, nextCell);
      else cell = nextCell;
    };

    const step = () => {
      // Standard explicit wave update: the new height is the mean of the four
      // neighbours minus the height two steps back, damped. Skipping the
      // border keeps the edges reflecting rather than reading out of bounds.
      const damping = 0.985;
      for (let y = 1; y < rows - 1; y++) {
        const row = y * cols;
        const up = row - cols;
        const down = row + cols;
        for (let x = 1; x < cols - 1; x++) {
          const i = row + x;
          const neighbours = current[up + x] + current[down + x] + current[i - 1] + current[i + 1];
          const next = (neighbours * 0.5 - previous[i]) * damping;
          previous[i] = next;
        }
      }
      // `previous` now holds the new field; swap it into `current`.
      const swap = current;
      current = previous;
      previous = swap;

      // Cursor injection, as a smooth falloff over the influence radius.
      if (pointerActive) {
        const radius = Math.max(2, Math.round(Math.min(cols, rows) * cursorRadius));
        const r2 = radius * radius;
        for (let dy = -radius; dy <= radius; dy++) {
          const y = pointerY + dy;
          if (y < 1 || y >= rows - 1) continue;
          for (let dx = -radius; dx <= radius; dx++) {
            const x = pointerX + dx;
            if (x < 1 || x >= cols - 1) continue;
            const d2 = dx * dx + dy * dy;
            if (d2 > r2) continue;
            const falloff = 1 - d2 / r2;
            current[y * cols + x] += falloff * falloff * 0.5 * cursorForce;
          }
        }
      } else if (autoWave) {
        // A slow travelling swell keeps it alive when nobody is pointing at it.
        idleFrames++;
        const t = idleFrames * 0.012 * speed;
        for (let y = 1; y < rows - 1; y++) {
          const row = y * cols;
          for (let x = 1; x < cols - 1; x++) {
            current[row + x] += Math.sin(x * 0.09 + t) * Math.cos(y * 0.11 - t * 0.7) * 0.006;
          }
        }
      }
    };

    const draw = () => {
      ctx.fillStyle = backgroundColor;
      if (backgroundColor === 'transparent') ctx.clearRect(0, 0, canvas.width, canvas.height);
      else ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${Math.round(cell * 1.05)}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const baseRow = Math.max(0, Math.round(rows * (1 - fillHeight)));
      const last = ramp.length - 1;
      // Pre-split the ramp so the inner loop does no string indexing surprises.
      const glyphs = ramp.split('');

      for (let y = baseRow; y < rows; y++) {
        const row = y * cols;
        for (let x = 0; x < cols; x++) {
          const h = current[row + x];
          // Height is roughly -1..1; bias, clamp and quantise onto the ramp.
          let level = (h + 1) * 0.5;
          level = level < 0 ? 0 : level > 1 ? 1 : level;
          const glyph = glyphs[Math.round(level * last)];
          if (glyph === ' ') continue;
          ctx.fillStyle = color;
          ctx.fillText(glyph, x * cell + cell * 0.5, y * cell + cell * 0.5);
        }
      }
    };

    const frame = (time: number) => {
      if (!running) return;
      // Cap at ~30 fps: the surface is slow-moving and the glyph grid is the
      // expensive part, so halving the rate is invisible and halves the cost.
      if (time - lastTime >= 33) {
        lastTime = time;
        step();
        draw();
      }
      raf = window.requestAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = Math.round((event.clientX - rect.left) / cell);
      const y = Math.round((event.clientY - rect.top) / cell);
      pointerX = x;
      pointerY = y;
      pointerActive = x >= 0 && x < cols && y >= 0 && y < rows;
      if (pointerActive) idleFrames = 0;
    };

    const onPointerLeave = () => {
      pointerActive = false;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerleave', onPointerLeave);

    if (reduced) {
      // One frame, no loop: the artwork is still there, it just does not move.
      step();
      draw();
    } else {
      raf = window.requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      observer.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [
    cellSize,
    characters,
    color,
    backgroundColor,
    fontFamily,
    speed,
    fillHeight,
    cursorRadius,
    cursorForce,
    autoWave,
  ]);

  return (
    <div ref={hostRef} className={cn('relative h-full w-full', className)} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export default LiquidAscii;
