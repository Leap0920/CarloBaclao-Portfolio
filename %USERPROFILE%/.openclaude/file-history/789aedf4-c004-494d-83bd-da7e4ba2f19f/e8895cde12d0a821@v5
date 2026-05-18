'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Constellation Particles ── */
function Constellation({ count = 300 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!);
  const lineRef = useRef<THREE.LineSegments>(null!);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      vel[i * 3] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
      // Orange to white gradient
      const t = Math.random();
      col[i * 3] = 0.9 + t * 0.1;
      col[i * 3 + 1] = 0.4 + t * 0.5;
      col[i * 3 + 2] = t * 0.3;
    }
    return [pos, vel, col];
  }, [count]);

  const linePositions = useMemo(() => new Float32Array(count * 6), [count]);
  const lineColors = useMemo(() => new Float32Array(count * 6), [count]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!mesh.current || !lineRef.current) return;
    const pos = mesh.current.geometry.attributes.position;
    const t = state.clock.elapsedTime;

    // Update particles
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      (pos.array as Float32Array)[ix] += velocities[ix] + Math.sin(t * 0.5 + i) * 0.002;
      (pos.array as Float32Array)[ix + 1] += velocities[ix + 1] + Math.cos(t * 0.3 + i) * 0.002;
      (pos.array as Float32Array)[ix + 2] += velocities[ix + 2];

      // Boundary bounce
      for (let j = 0; j < 3; j++) {
        const limit = j === 0 ? 6 : j === 1 ? 4 : 3;
        if (Math.abs((pos.array as Float32Array)[ix + j]) > limit) {
          velocities[ix + j] *= -1;
        }
      }

      // Mouse repulsion
      const mx = mouse.current.x * 6;
      const my = mouse.current.y * 4;
      const dx = (pos.array as Float32Array)[ix] - mx;
      const dy = (pos.array as Float32Array)[ix + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) {
        const force = (2 - dist) * 0.01;
        (pos.array as Float32Array)[ix] += (dx / dist) * force;
        (pos.array as Float32Array)[ix + 1] += (dy / dist) * force;
      }
    }
    pos.needsUpdate = true;

    // Build connection lines between nearby particles
    let lineIdx = 0;
    const maxDist = 1.8;
    const lp = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const lc = lineRef.current.geometry.attributes.color as THREE.BufferAttribute;
    const pa = pos.array as Float32Array;

    for (let i = 0; i < count && lineIdx < count * 6; i++) {
      for (let j = i + 1; j < count && lineIdx < count * 6; j++) {
        const dx = pa[i * 3] - pa[j * 3];
        const dy = pa[i * 3 + 1] - pa[j * 3 + 1];
        const dz = pa[i * 3 + 2] - pa[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < maxDist) {
          const alpha = 1 - d / maxDist;
          lp.array[lineIdx] = pa[i * 3];
          lp.array[lineIdx + 1] = pa[i * 3 + 1];
          lp.array[lineIdx + 2] = pa[i * 3 + 2];
          lp.array[lineIdx + 3] = pa[j * 3];
          lp.array[lineIdx + 4] = pa[j * 3 + 1];
          lp.array[lineIdx + 5] = pa[j * 3 + 2];
          lc.array[lineIdx] = 0.95 * alpha;
          lc.array[lineIdx + 1] = 0.5 * alpha;
          lc.array[lineIdx + 2] = 0.15 * alpha;
          lc.array[lineIdx + 3] = 0.95 * alpha;
          lc.array[lineIdx + 4] = 0.5 * alpha;
          lc.array[lineIdx + 5] = 0.15 * alpha;
          lineIdx += 6;
        }
      }
    }
    // Clear remaining
    for (let i = lineIdx; i < count * 6; i++) {
      lp.array[i] = 0;
      lc.array[i] = 0;
    }
    lp.needsUpdate = true;
    lc.needsUpdate = true;

    mesh.current.rotation.y = t * 0.02;
  });

  return (
    <group>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} vertexColors transparent opacity={0.9} sizeAttenuation />
      </points>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

/* ── Pulsing Rings ── */
function PulsingRings() {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.3;
    group.current.rotation.z = t * 0.1;
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const scale = 1 + Math.sin(t * 2 + i * 1.5) * 0.1;
      mesh.scale.set(scale, scale, scale);
    });
  });

  return (
    <group ref={group}>
      {[1.5, 2.0, 2.5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
          <torusGeometry args={[radius, 0.005, 16, 100]} />
          <meshBasicMaterial
            color={i === 1 ? '#f97316' : '#fb923c'}
            transparent
            opacity={0.4 - i * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <Constellation />
      <PulsingRings />
    </>
  );
}

/* ── Glitch Text ── */
function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="relative z-10">{text}</span>
      <span
        className="absolute inset-0 text-cyan-400 animate-pulse"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px, -1px)' }}
        aria-hidden
      >
        {text}
      </span>
      <span
        className="absolute inset-0 text-orange-500 animate-pulse"
        style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)', transform: 'translate(2px, 1px)', animationDelay: '0.15s' }}
        aria-hidden
      >
        {text}
      </span>
    </div>
  );
}

/* ── Circular Progress ── */
function CircularProgress({ progress }: { progress: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        {/* Progress */}
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      {/* Percentage */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl sm:text-2xl font-black text-white font-mono">{Math.min(Math.round(progress), 100)}</span>
        <span className="text-[8px] sm:text-[9px] text-orange-400/70 tracking-[0.2em] uppercase">percent</span>
      </div>
    </div>
  );
}

/* ── Loading Screen ── */
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowName(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onComplete, 800);
          }, 500);
          return 100;
        }
        const remaining = 100 - prev;
        return prev + Math.max(remaining * 0.08, Math.random() * 3 + 1);
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#0a0a0f]"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Three.js Background */}
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]}>
              <Scene />
            </Canvas>
          </div>

          {/* Scan lines overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.05) 1px, rgba(255,255,255,0.05) 2px)',
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          }} />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            {showName && (
              <div className="flex flex-col items-center">
                {/* Top accent line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-16 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent mb-8"
                />

                {/* Name with glitch */}
                <motion.div
                  initial={{ opacity: 0, letterSpacing: '0.5em' }}
                  animate={{ opacity: 1, letterSpacing: '0.25em' }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="px-4"
                >
                  <GlitchText
                    text="CARLO BACLAO"
                    className="text-[1.8rem] sm:text-4xl md:text-7xl font-black text-white tracking-[0.15em] sm:tracking-[0.25em] whitespace-nowrap"
                  />
                </motion.div>

                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 mb-8 sm:mb-14"
                >
                  <div className="w-6 sm:w-8 h-[1px] bg-orange-500/50" />
                  <span className="text-[9px] sm:text-[11px] text-orange-400/80 tracking-[0.3em] sm:tracking-[0.4em] uppercase font-medium">
                    Full Stack Developer
                  </span>
                  <div className="w-6 sm:w-8 h-[1px] bg-orange-500/50" />
                </motion.div>

                {/* Circular Progress */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <CircularProgress progress={progress} />
                </motion.div>

                {/* Bottom accent */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mt-6 sm:mt-10 flex items-center gap-3 sm:gap-4"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full bg-orange-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/30 font-mono tracking-widest">INITIALIZING</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full bg-orange-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 + 0.6 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Corner brackets */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-4 h-4 sm:w-6 sm:h-6 border-l border-t border-orange-500/30" />
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 w-4 h-4 sm:w-6 sm:h-6 border-r border-t border-orange-500/30" />
          <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 w-4 h-4 sm:w-6 sm:h-6 border-l border-b border-orange-500/30" />
          <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 w-4 h-4 sm:w-6 sm:h-6 border-r border-b border-orange-500/30" />

          {/* Corner data */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-5 left-12 text-[9px] text-white/20 font-mono"
          >
            SYS.INIT // 2026
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-5 right-12 text-[9px] text-white/20 font-mono"
          >
            v1.0.0
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
