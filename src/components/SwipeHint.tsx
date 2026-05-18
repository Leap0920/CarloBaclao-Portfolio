'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function SwipeHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    if (mq.matches) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(timer);
  }, [visible]);

  // Hide on any touch
  useEffect(() => {
    if (!visible) return;
    const hide = () => setVisible(false);
    window.addEventListener('touchstart', hide, { once: true });
    return () => window.removeEventListener('touchstart', hide);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Left hint */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
            className="md:hidden fixed left-1.5 top-1/2 -translate-y-1/2 z-[60]"
          >
            <motion.div
              animate={{ x: [-3, 3, -3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-1 bg-black/60 dark:bg-white/10 backdrop-blur-md rounded-full px-2 py-1 shadow-md border border-orange-500/20"
            >
              <ChevronLeft size={12} className="text-orange-400" />
              <span className="text-[8px] text-white/80 font-medium tracking-wider">MENU</span>
            </motion.div>
          </motion.div>

          {/* Right hint */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="md:hidden fixed right-1.5 top-1/2 -translate-y-1/2 z-[60]"
          >
            <motion.div
              animate={{ x: [3, -3, 3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-1 bg-black/60 dark:bg-white/10 backdrop-blur-md rounded-full px-2 py-1 shadow-md border border-orange-500/20"
            >
              <span className="text-[8px] text-white/80 font-medium tracking-wider">SKILLS</span>
              <ChevronRight size={12} className="text-orange-400" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
