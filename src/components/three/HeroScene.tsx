'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ACCENT = '#4f5bd5';
const INK = '#27272a';
const LINE = '#8b8b96';
const MIST = '#a1a1aa';
/** Matches the page background, so distance fades into the page. */
const FOG = '#ffffff';

/** Slow, opposing rotations on a wireframe shell - the "blueprint" skin. */
function Shell() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.055;
    ref.current.rotation.x -= delta * 0.018;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.3, 1]} />
      <meshBasicMaterial wireframe color={LINE} transparent opacity={0.34} depthWrite={false} />
    </mesh>
  );
}

/** The single saturated object: a faceted core that breathes. */
function Core() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.28;
    ref.current.rotation.x = t * 0.13;
    ref.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.035);
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.92, 0]} />
      <meshStandardMaterial color={ACCENT} roughness={0.34} metalness={0.08} flatShading />
    </mesh>
  );
}

interface OrbitProps {
  radius: number;
  count: number;
  tilt: [number, number, number];
  speed: number;
  palette: string[];
  beadScale?: number;
}

/** A thin ring with beads travelling around it. */
function Orbit({ radius, count, tilt, speed, palette, beadScale = 1 }: OrbitProps) {
  const spinner = useRef<THREE.Group>(null);

  const beads = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        return {
          key: index,
          position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0] as [number, number, number],
          size: (0.055 + (index % 3) * 0.022) * beadScale,
          color: palette[index % palette.length]!,
        };
      }),
    [radius, count, palette, beadScale],
  );

  useFrame((_, delta) => {
    if (spinner.current) spinner.current.rotation.z += delta * speed;
  });

  return (
    <group rotation={tilt}>
      <group ref={spinner}>
        <mesh>
          <torusGeometry args={[radius, 0.0035, 6, 140]} />
          <meshBasicMaterial color={LINE} transparent opacity={0.45} />
        </mesh>
        {beads.map((bead) => (
          <mesh key={bead.key} position={bead.position}>
            <sphereGeometry args={[bead.size, 16, 16]} />
            <meshStandardMaterial color={bead.color} roughness={0.45} metalness={0.02} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Drifts the composition, leans it toward the pointer, and lifts/turns it as the
 * hero scrolls away. Scroll is read into a ref from a passive listener so the
 * render loop never triggers a React render.
 */
function Rig({ children, still }: { children: React.ReactNode; still: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const scroll = useRef(0);

  useEffect(() => {
    if (still) return;
    const onScroll = () => {
      scroll.current = window.scrollY;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [still]);

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;

    const vh = window.innerHeight || 1;
    const progress = Math.min(1, Math.max(0, scroll.current / vh));

    group.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.13 + progress * 0.9;
    group.rotation.z = -progress * 0.12;

    const targetY = state.pointer.x * 0.3 + progress * 0.45;
    const targetX = -state.pointer.y * 0.2 - progress * 0.16;
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetY, 2.6, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetX, 2.6, delta);
  });

  // Scaled so the outermost orbit stays inside the frustum at every aspect ratio.
  return (
    <group ref={ref} scale={0.72}>
      {children}
    </group>
  );
}

function Composition({ still }: { still: boolean }) {
  return (
    <Rig still={still}>
      <Shell />
      <Core />
      <Orbit radius={3.1} count={7} tilt={[0.42, 0.2, 0]} speed={0.28} palette={[ACCENT, INK, MIST]} />
      <Orbit radius={3.85} count={5} tilt={[-0.62, -0.35, 0.5]} speed={-0.19} palette={[INK, LINE, ACCENT]} beadScale={0.85} />
      <Orbit radius={4.5} count={11} tilt={[1.24, 0.5, -0.3]} speed={0.12} palette={[LINE, MIST]} beadScale={0.6} />
    </Rig>
  );
}

interface HeroSceneProps {
  still?: boolean;
  active?: boolean;
}

export default function HeroScene({ still = false, active = true }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10.2], fov: 40 }}
      dpr={[1, 1.5]}
      flat
      frameloop={still ? 'demand' : active ? 'always' : 'never'}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <fog attach="fog" args={[FOG, 9.5, 16]} />
      <ambientLight intensity={0.62} />
      <directionalLight position={[4.5, 6, 6]} intensity={1.5} />
      <directionalLight position={[-6, -3, -4]} intensity={0.35} color="#c7cffe" />
      <Composition still={still} />
    </Canvas>
  );
}
