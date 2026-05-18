'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/contexts';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-full h-10 rounded-xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isDark
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Stars (dark mode) */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute w-[2px] h-[2px] bg-white rounded-full top-2 left-[15%] opacity-80" />
        <div className="absolute w-[3px] h-[3px] bg-white rounded-full top-3 left-[25%] opacity-60" />
        <div className="absolute w-[2px] h-[2px] bg-white rounded-full top-[10px] right-[20%] opacity-70" />
        <div className="absolute w-[2px] h-[2px] bg-white rounded-full top-[18px] left-[40%] opacity-50" />
        <div className="absolute w-[3px] h-[3px] bg-white rounded-full top-[14px] right-[35%] opacity-90" />
      </motion.div>

      {/* Clouds (light mode) */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute w-5 h-2 bg-white/40 rounded-full top-2 left-[20%]" />
        <div className="absolute w-7 h-2.5 bg-white/30 rounded-full top-[18px] right-[25%]" />
        <div className="absolute w-4 h-1.5 bg-white/35 rounded-full top-1 right-[15%]" />
      </motion.div>

      {/* Toggle knob with icon */}
      <motion.div
        className="absolute top-[5px] w-[30px] h-[30px] rounded-full flex items-center justify-center z-10"
        animate={{
          left: isDark ? 'calc(100% - 35px)' : '5px',
          background: isDark ? '#1e293b' : '#fff',
          boxShadow: isDark
            ? '0 0 15px rgba(59,130,246,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)'
            : '0 2px 8px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.05)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {/* Moon (dark) */}
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute"
          animate={{ opacity: isDark ? 1 : 0, rotate: isDark ? 0 : 90, scale: isDark ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="#fbbf24"
            stroke="#fbbf24"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>

        {/* Sun (light) */}
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute"
          animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? -90 : 0, scale: isDark ? 0.5 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <circle cx="12" cy="12" r="4" fill="#f59e0b" />
          <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </motion.svg>
      </motion.div>

      {/* Label */}
      <motion.span
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold tracking-wide z-10"
        animate={{
          color: isDark ? '#94a3b8' : '#78350f',
        }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? 'DARK' : 'LIGHT'}
      </motion.span>
    </motion.button>
  );
}
