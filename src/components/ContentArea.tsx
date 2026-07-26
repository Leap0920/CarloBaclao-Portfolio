'use client';

import { motion, useScroll } from 'framer-motion';
import React, { useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ContentAreaProps {
  section: string;
  content: React.ReactNode;
}

function StaticGreeting() {
  const hour = new Date().getHours();
  const greetingText = hour < 12 ? 'GOOD MORNING!' : hour < 18 ? 'GOOD AFTERNOON!' : 'GOOD EVENING!';

  return (
    <div className="flex items-center gap-2 mb-6 px-2">
      <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
        {greetingText}
      </h1>
    </div>
  );
}

function ScrollProgressBar({ scrollRef }: { scrollRef: React.RefObject<HTMLElement | null> }) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    container: scrollRef as React.RefObject<HTMLElement>,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

export function ContentArea({ section, content }: ContentAreaProps) {
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden h-full pr-1 custom-scrollbar pb-6 relative">
      <ScrollProgressBar scrollRef={scrollRef} />
      <StaticGreeting />
      <motion.div
        key={section}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {content}
      </motion.div>
    </main>
  );
}
