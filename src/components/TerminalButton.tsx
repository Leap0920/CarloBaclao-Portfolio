'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useTerminal } from '@/contexts/TerminalContext';

export function TerminalButton() {
  const { toggleTerminal } = useTerminal();
  const hasPulsed = useRef(false);
  const [pulse, setPulse] = useState(true);

  const handleClick = () => {
    if (!hasPulsed.current) {
      hasPulsed.current = true;
      setPulse(false);
    }
    toggleTerminal();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-[100] w-14 h-14 bg-black text-green-400 rounded-full shadow-lg shadow-green-900/20 hover:scale-110 hover:shadow-green-900/40 transition-all duration-300 flex items-center justify-center border border-gray-800/50 ${
        pulse ? 'animate-pulse' : ''
      }`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Open terminal"
    >
      <Terminal size={24} />
    </motion.button>
  );
}
