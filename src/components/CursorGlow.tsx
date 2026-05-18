'use client';

import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSyncExternalStore } from 'react';

const touchStore = {
  subscribe: () => () => {},
  getSnapshot: () => !window.matchMedia('(pointer: fine)').matches,
  getServerSnapshot: () => true,
};

export function CursorGlow() {
  const { x, y } = useMousePosition();
  const prefersReducedMotion = useReducedMotion();
  const isTouchDevice = useSyncExternalStore(touchStore.subscribe, touchStore.getSnapshot, touchStore.getServerSnapshot);

  if (prefersReducedMotion || isTouchDevice) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] rounded-full mix-blend-screen"
      style={{
        width: 400,
        height: 400,
        left: x - 200,
        top: y - 200,
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)',
      }}
      animate={{
        left: x - 200,
        top: y - 200,
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 25, mass: 0.5 }}
    />
  );
}
