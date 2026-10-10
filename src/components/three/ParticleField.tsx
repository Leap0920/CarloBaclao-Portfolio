'use client';

import { useEffect, useMemo, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Color,
  NormalBlending,
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
  Vector2,
  Vector4,
  type PerspectiveCamera,
} from 'three';
import { FIELD_FRAG, FIELD_VERT } from './shaders/field';

/** How many particles. Dense enough to read as a volume in a hero-sized box,
 *  sparse enough that overlapping dots do not silt up into a solid mass. */
const COUNT = 16000;

/** The sphere's radius in unit space. `uScale` turns this into world units. */
const UNIT = 1;

/** The sphere's diameter as a fraction of the smaller canvas extent. Under 1
 *  so the silhouette keeps a margin instead of being cut by the canvas edge. */
const FIT = 0.92;

/** The mutable state the host writes and this component reads each frame.
 *  Written outside React so a pointer move never triggers a render. */
export interface FieldState {
  morph: number;
  /** Pointer position in normalised device coordinates, -1..1. */
  pointer: Vector2;
  copy: Vector4;
}

/** Scratch vector for the per-frame pointer conversion. A single module-level
 *  instance is correct here: it is consumed in the frame that writes it. */
const pointerWorld = new Vector2();

export function ParticleField({ state }: { state: RefObject<FieldState> }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const scatter = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const cols = Math.ceil(Math.sqrt(COUNT));

    for (let i = 0; i < COUNT; i++) {
      // Fibonacci sphere: an even distribution with no poles to bunch at.
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const jitter = 0.92 + Math.random() * 0.16;
      // Most particles sit on the shell, but a shell alone projects to a
      // bright rim around a hollow middle. Sending a third of them through the
      // interior (cube root, so the density is even in volume) fills the void
      // and is what makes the mass read as a lit sphere rather than a hoop.
      const vol = i % 10 < 3 ? Math.cbrt(0.02 + Math.random() * 0.98) : 1;
      const rad = UNIT * jitter * vol;
      positions[i * 3 + 0] = Math.cos(theta) * r * rad;
      positions[i * 3 + 1] = y * rad;
      positions[i * 3 + 2] = Math.sin(theta) * r * rad;

      // The dissolved state: a flat lattice the sphere unfolds into as the hero
      // scrolls away. Unit space, so `uScale` sizes it along with the sphere.
      const cx = i % cols;
      const cy = Math.floor(i / cols);
      scatter[i * 3 + 0] = (cx / cols - 0.5) * 2 + (Math.random() - 0.5) * 0.02;
      scatter[i * 3 + 1] = (cy / cols - 0.5) * 2 + (Math.random() - 0.5) * 0.02;
      scatter[i * 3 + 2] = (Math.random() - 0.5) * 0.15;

      seeds[i] = Math.random();
    }

    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(positions, 3));
    g.setAttribute('aScatter', new BufferAttribute(scatter, 3));
    g.setAttribute('aSeed', new BufferAttribute(seeds, 1));
    return g;
  }, []);

  // The dot colour comes from the page's own `--foreground` token, read once
  // at mount, so the palette has exactly one source of truth: change the
  // token in globals.css and the WebGL field follows. The literal is only a
  // fallback for the impossible case of an empty custom property.
  const readInk = () =>
    new Color(
      (typeof window !== 'undefined' &&
        getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()) ||
        '#09090b',
    );

  // The material is built here rather than declared as <shaderMaterial> JSX.
  // r3f's prop application does not hand a ShaderMaterial the uniforms object
  // it was given: it builds its own, so every `useFrame` write to the uniforms
  // the component closed over lands on an object the GPU never reads. The
  // symptom is a field that renders its first frame and then holds it forever
  // while uTime, uMorph, uScale and uProj all advance on a detached copy.
  // Constructing the material keeps one uniforms object, owned here.
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: FIELD_VERT,
        fragmentShader: FIELD_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uPointer: { value: new Vector2(0, 0) },
          uCopy: { value: new Vector4(2, 2, 2, 2) },
          // Dot diameter in WORLD units; `uProj` converts it to device pixels.
          uSize: { value: 0.022 },
          // Device pixels of viewport height over 2*tan(fov/2), and the world
          // radius of the sphere. Both are recomputed on the first frame from
          // the real camera and canvas; these values only cover the single
          // frame r3f renders before useFrame first runs.
          uProj: { value: 900 },
          uScale: { value: 1.5 },
          uInk: { value: readInk() },
        },
        transparent: true,
        depthWrite: false,
        // NORMAL, not additive. Additive blending brightens towards white,
        // which is exactly what you want for white dots on a black page and
        // exactly what makes them vanish on a light one. Normal blending
        // composites the ink over the silver page instead.
        blending: NormalBlending,
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((frame, delta) => {
    const s = state.current;
    if (!s) return;
    const u = material.uniforms;

    u.uTime.value += delta;
    // Ease towards the target so a fast scroll does not snap the field.
    u.uMorph.value += (s.morph - u.uMorph.value) * 0.08;
    u.uCopy.value.copy(s.copy);

    // Everything below is derived rather than assumed. A resize, a rotation or
    // a device pixel ratio change moves all of it, and a stale value shows up
    // immediately as dots of the wrong size or a sphere that overflows its box.
    const cam = frame.camera as PerspectiveCamera;
    if (!cam.isPerspectiveCamera) return;

    const tanHalfFov = Math.tan((cam.fov * Math.PI) / 360);
    // Distance to the plane the sphere sits on, which is z = 0.
    const dist = cam.position.length();
    const halfHeight = tanHalfFov * dist;
    const halfWidth = halfHeight * cam.aspect;

    // `uScale` is the sphere's radius in world units, so FIT is the diameter
    // as a fraction of the canvas's smaller extent.
    u.uScale.value = Math.min(halfWidth, halfHeight) * FIT;
    u.uProj.value = (frame.size.height * (frame.viewport.dpr || 1)) / (2 * tanHalfFov);

    // The pointer is captured in NDC because that is what the browser hands
    // over; the shader works in world units.
    pointerWorld.set(s.pointer.x * halfWidth, s.pointer.y * halfHeight);
    u.uPointer.value.lerp(pointerWorld, 0.06);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <primitive object={material} attach="material" />
    </points>
  );
}
