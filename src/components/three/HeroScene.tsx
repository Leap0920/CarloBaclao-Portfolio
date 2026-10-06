'use client';

import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

interface HeroSceneProps {
  /** Freezes the render loop (reduced motion / off-screen). */
  still?: boolean;
  /** Whether the canvas is on screen and allowed to keep rendering. */
  active?: boolean;
}

/** Mirrors the frozen `--accent` token, used only if the variable is absent. */
const FALLBACK_ACCENT = '#e8a33d';

/**
 * Touch devices rasterise every pixel once and then composite it again, and
 * they do it on a battery. The scene drops its anti-aliasing, its pixel ratio
 * and most of its dust there. The composition is unchanged — only the
 * sampling is — so the phone still gets the same object, just cheaper.
 */
function isLowPower(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  } catch {
    return false;
  }
}


/** The live accent, so the object follows the light/dark theme switch too. */
function readAccent(): string {
  if (typeof window === 'undefined') return FALLBACK_ACCENT;
  const value = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  return value || FALLBACK_ACCENT;
}

/**
 * Leans the whole composition toward the cursor — a fraction of a radian,
 * critically damped. Deliberately restrained: it reads as weight, not as a
 * gimmick, and it can never jitter because every frame interpolates toward a
 * target with `MathUtils.damp` rather than snapping to the raw pointer.
 *
 * The pointer is read from a passive window listener, NOT from R3F's
 * `state.pointer`: the canvas wrapper is `pointer-events-none`, so it would
 * never receive the events, and a listener leaves the CTAs clickable.
 */
function CursorRig({ still, children }: { still: boolean; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (still) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [still]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, pointer.current.x * 0.18, 2.4, delta);
    node.rotation.x = THREE.MathUtils.damp(node.rotation.x, pointer.current.y * 0.12, 2.4, delta);
    node.position.x = THREE.MathUtils.damp(node.position.x, pointer.current.x * 0.1, 2, delta);
    node.position.y = THREE.MathUtils.damp(node.position.y, pointer.current.y * 0.07, 2, delta);
  });

  return <group ref={group}>{children}</group>;
}

/** The hero object: a faceted low-poly core that turns and breathes. */
function Core({ accent }: { accent: string }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const node = mesh.current;
    if (!node) return;
    node.rotation.y += delta * 0.16;
    node.rotation.x += delta * 0.06;
    node.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.03);
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.25, 0]} />
      <meshStandardMaterial
        color={accent}
        roughness={0.3}
        metalness={0.16}
        flatShading
        emissive={accent}
        emissiveIntensity={0.12}
      />
    </mesh>
  );
}

/** A wireframe shell turning the other way — the "low-poly" cage. */
function Shell({ accent }: { accent: string }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const node = mesh.current;
    if (!node) return;
    node.rotation.y -= delta * 0.045;
    node.rotation.z += delta * 0.02;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.9, 0]} />
      <meshBasicMaterial wireframe color={accent} transparent opacity={0.24} depthWrite={false} />
    </mesh>
  );
}

/**
 * The outermost element: a hairline ring the particle dust sits around. It
 * also anchors the composition's visible extent, so the object reads as
 * filling its box instead of floating in dead space.
 */
function Ring({ accent }: { accent: string }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const node = mesh.current;
    if (!node) return;
    node.rotation.x = 0.16 + Math.sin(state.clock.elapsedTime * 0.25) * 0.04;
  });

  return (
    <mesh ref={mesh}>
      <torusGeometry args={[2.28, 0.006, 6, 160]} />
      <meshBasicMaterial color={accent} transparent opacity={0.6} depthWrite={false} />
    </mesh>
  );
}

/**
 * A drifting field of accent points. Positions are built once into a typed
 * array (never per frame) and the whole cloud is rotated as a group, so the
 * render loop allocates nothing.
 */
function ParticleField({
  accent,
  count = 520,
  radius = 2.35,
}: {
  accent: string;
  count?: number;
  radius?: number;
}) {
  const group = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.6 + 0.4 * Math.cbrt(Math.random()));
      array[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      array[i * 3 + 2] = r * Math.cos(phi);
    }
    return array;
  }, [count, radius]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    node.rotation.y += delta * 0.025;
    node.rotation.x += delta * 0.01;
  });

  return (
    <group ref={group}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={accent}
          size={0.05}
          sizeAttenuation
          depthWrite={false}
          opacity={0.95}
        />
      </Points>
    </group>
  );
}

function Composition({
  still,
  accent,
  lowPower,
}: {
  still: boolean;
  accent: string;
  lowPower: boolean;
}) {
  return (
    <CursorRig still={still}>
      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.6} floatingRange={[-0.06, 0.06]}>
        <Core accent={accent} />
      </Float>
      <Shell accent={accent} />
      <Ring accent={accent} />
      <ParticleField accent={accent} count={lowPower ? 220 : 520} />
    </CursorRig>
  );
}

/**
 * The floating, cursor-reactive hero object: a low-poly core inside a
 * wireframe cage, ringed and dusted with a particle field. Every geometry and
 * material is created through JSX, so R3F disposes them when the scene
 * unmounts and the chunk's cost is only ever paid by visitors who see it.
 */
export default function HeroScene({ still = false, active = true }: HeroSceneProps) {
  const accent = useMemo(readAccent, []);
  const lowPower = useMemo(isLowPower, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      dpr={lowPower ? [1, 1.25] : [1, 1.6]}
      flat
      frameloop={still ? 'demand' : active ? 'always' : 'never'}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 6]} intensity={1.6} />
      <directionalLight position={[-5, -3, -4]} intensity={0.4} color={accent} />
      <Composition still={still} accent={accent} lowPower={lowPower} />
    </Canvas>
  );
}
