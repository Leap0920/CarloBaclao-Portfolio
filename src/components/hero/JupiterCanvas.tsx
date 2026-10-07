'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { JUPITER_FRAG, JUPITER_VERT } from './jupiterShader';

/**
 * Jupiter, live, in the hero.
 *
 * The flat SVG beside this is what the server renders, what shows before
 * hydration, and what stays if WebGL is unavailable. This is the same object
 * drawn as a procedural fragment shader: the surface is solved per pixel from
 * the sphere's own normal, so there is no texture to load at any size and the
 * detail is resolution-independent.
 *
 * It is a still. It was draggable for a while — you could spin it, tilt it and
 * throw it — but the pose it settled into is the one that was wanted, so the
 * interaction is gone and the planet is fixed where it is. That also means one
 * draw call per resize instead of sixty a second, and nothing at all while it
 * sits there.
 *
 * The backing store is capped and scaled to its container rather than to the
 * window, so a large display does not pay for pixels it cannot show.
 */

/** Ceiling on the backing store, in device pixels. */
const MAX_WIDTH = 2200;

/**
 * The host is deliberately larger than the graphic's own box (see Hero.tsx) and
 * the zoom is raised to match, so a ring of sky appears around the disc. Without
 * that margin the disc runs to the edge of the canvas and the nebula gets a
 * visible rectangular border — a picture frame around a planet, which is exactly
 * what it looked like.
 *
 * It also sets the planet's size, and the relationship is the one that is easy
 * to get backwards: the disc's radius is `0.5 * canvasHeight * ZOOM`, so the
 * diameter is simply `canvasHeight * ZOOM`. At 1.45 the disc came out at 1054 px
 * on a 727 px canvas — the whole canvas was planet, the sky branch never ran on
 * a visible pixel, and raising this had made the planet *bigger*. 0.76 puts the
 * disc at 552 px with a genuine ring of sky around it.
 */
const ZOOM = 0.76;

/**
 * The pose, fixed. The storm sits at texture longitude 0.6 and the shader
 * samples at `viewLon + spin`, so 0.42 puts it at ~0.18 — just right of centre
 * and on the lit side, rather than round the back in the dark.
 */
const SPIN = 0.42;
const TILT = -0.18;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('could not create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log ?? 'shader failed to compile');
  }
  return shader;
}

function link(gl: WebGLRenderingContext): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error('could not create program');
  const vs = compile(gl, gl.VERTEX_SHADER, JUPITER_VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, JUPITER_FRAG);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log ?? 'program failed to link');
  }
  return program;
}

interface JupiterCanvasProps {
  className?: string;
  /** Called once the first frame is on screen, so the poster can stand down. */
  onReady?: () => void;
}

export function JupiterCanvas({ className, onReady }: JupiterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext('webgl', {
        antialias: false,
        alpha: false,
        depth: false,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      }) ?? canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }
    // No WebGL: leave the SVG poster exactly where it is.
    if (!gl) return;
    // React runs this effect twice in development — mount, unmount, remount — and
    // the second run gets the same context back from getContext. A cleanup that
    // had lost it would leave the canvas blank for the life of the page, which is
    // exactly what the dev server was doing while the cleanup called
    // loseContext() and production, which does not double-invoke, was fine.
    if (gl.isContextLost()) return;

    let program: WebGLProgram;
    try {
      program = link(gl);
    } catch {
      return;
    }

    gl.useProgram(program);

    // One full-screen triangle. Cheaper than a quad, and there is no seam down
    // the diagonal for a pixel of background to show through.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'uRes');
    const uSpin = gl.getUniformLocation(program, 'uSpin');
    const uTilt = gl.getUniformLocation(program, 'uTilt');
    const uZoom = gl.getUniformLocation(program, 'uZoom');
    const uSun = gl.getUniformLocation(program, 'uSun');
    const uDetail = gl.getUniformLocation(program, 'uDetail');
    const uStars = gl.getUniformLocation(program, 'uStars');

    let detail = 6;
    let announced = false;

    const draw = () => {
      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.uniform1f(uSpin, SPIN);
      gl!.uniform1f(uTilt, TILT);
      gl!.uniform1f(uZoom, ZOOM);
      // The sun stays put in view space.
      gl!.uniform3f(uSun, -0.62, 0.42, 0.66);
      gl!.uniform1f(uDetail, detail);
      gl!.uniform1f(uStars, 1.0);

      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      if (!announced) {
        announced = true;
        readyRef.current?.();
      }
    };

    const resize = () => {
      const cssW = host.clientWidth || 1;
      const cssH = host.clientHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const scale = Math.min(dpr, Math.max(1, MAX_WIDTH / cssW));
      const w = Math.max(160, Math.round(cssW * scale));
      const h = Math.max(160, Math.round(cssH * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // Cost is fill-rate, so the octave budget follows the pixel count. Fewer
      // octaves over more pixels still resolves finer structure than the other
      // way round, and it keeps the cost flat across display densities.
      const px = w * h;
      detail = px > 6e6 ? 5 : px > 2.5e6 ? 6 : 7;
      gl!.viewport(0, 0, w, h);
      draw();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      observer.disconnect();
      gl!.deleteBuffer(buffer);
      gl!.deleteProgram(program);
      // Deliberately no WEBGL_lose_context here. The canvas goes away with the
      // component and the browser reclaims the context on its own; losing it
      // explicitly is what left the remount with a dead canvas.
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={cn('pointer-events-none relative h-full w-full select-none', className)}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-hidden="true"
        // Fades the sky out before it reaches the panel's edge, so the graphic
        // dissolves into the page instead of ending on a straight line.
        style={{
          maskImage: 'radial-gradient(closest-side, #000 90%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(closest-side, #000 90%, transparent 100%)',
        }}
      />
    </div>
  );
}

export default JupiterCanvas;
