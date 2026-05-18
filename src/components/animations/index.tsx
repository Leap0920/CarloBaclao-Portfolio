'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode, useRef, useState, useCallback, type MouseEvent } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ─── Magnetic Button ─────────────────────────────────
interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  target,
  rel,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || prefersReducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  }, [strength, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  const Tag = href ? 'a' : 'div';
  const tagProps = href ? { href, target, rel } : {};

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
      className="inline-block"
    >
      <Tag
        {...tagProps}
        onClick={onClick}
        className={className}
      >
        {children}
      </Tag>
    </motion.div>
  );
}

// ─── Ripple Button ───────────────────────────────────
interface RippleButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function RippleButton({ children, className = '', onClick }: RippleButtonProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (!prefersReducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      const ripple = {
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setRipples(prev => [...prev, ripple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id));
      }, 600);
    }
    onClick?.();
  }, [onClick, prefersReducedMotion]);

  return (
    <button onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {children}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{ left: ripple.x - 50, top: ripple.y - 50, width: 100, height: 100 }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </button>
  );
}

// ─── Fade In ─────────────────────────────────────────
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 20,
  className = '',
  once = true,
}: FadeInProps) {
  const directions: Record<string, { x?: number; y?: number }> = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Container ───────────────────────────────
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: staggerDelay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Hover Scale ─────────────────────────────────────
interface HoverScaleProps {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function HoverScale({
  children,
  scale = 1.02,
  className = '',
}: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated Card ───────────────────────────────────
interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
}

export function AnimatedCard({
  children,
  delay = 0,
  className = '',
  hoverScale = 1.02,
  hoverY = -4,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Transition ──────────────────────────────
interface SectionTransitionProps {
  children: ReactNode;
  sectionKey: string;
  className?: string;
}

export function SectionTransition({
  children,
  sectionKey,
  className = '',
}: SectionTransitionProps) {
  return (
    <motion.div
      key={sectionKey}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Pulse Ring ──────────────────────────────────────
export function PulseRing({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          '0 0 0 0px rgba(59, 130, 246, 0.2)',
          '0 0 0 8px rgba(59, 130, 246, 0)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Tilt Card ───────────────────────────────────────
interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({ children, className = '', maxTilt = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)', glareOpacity: 0, glareX: 50, glareY: 50 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || prefersReducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * maxTilt * 2;
    const rotateY = (x - 0.5) * maxTilt * 2;
    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      glareOpacity: 0.15,
      glareX: x * 100,
      glareY: y * 100,
    });
  }, [maxTilt, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setStyle({ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)', glareOpacity: 0, glareX: 50, glareY: 50 });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: style.transform,
        transition: prefersReducedMotion ? 'none' : 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at ${style.glareX}% ${style.glareY}%, rgba(255,255,255,${style.glareOpacity}) 0%, transparent 60%)`,
          transition: prefersReducedMotion ? 'none' : 'opacity 0.15s ease-out',
        }}
      />
    </div>
  );
}

// ─── Count Up Animation ──────────────────────────────
interface CountUpProps {
  end: number;
  duration?: number;
  className?: string;
  suffix?: string;
}

export function CountUp({ end, duration = 2, className = '', suffix = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleViewportEnter = useCallback(() => {
    if (hasAnimated) return;
    setHasAnimated(true);

    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, hasAnimated, prefersReducedMotion]);

  return (
    <motion.span
      className={className}
      onViewportEnter={handleViewportEnter}
      viewport={{ once: true }}
    >
      {count}{suffix}
    </motion.span>
  );
}

// ─── Skill Radial ────────────────────────────────────
interface SkillRadialProps {
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function SkillRadial({ value, label, size = 72, strokeWidth = 6, className = '' }: SkillRadialProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const handleViewportEnter = useCallback(() => {
    if (hasAnimated) return;
    setHasAnimated(true);
    if (prefersReducedMotion) {
      setAnimatedValue(value);
      return;
    }
    const startTime = performance.now();
    const animateDuration = 1500;
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animateDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, hasAnimated, prefersReducedMotion]);

  const offset = circumference - (animatedValue / 100) * circumference;

  return (
    <motion.div
      className={`flex flex-col items-center gap-1 ${className}`}
      onViewportEnter={handleViewportEnter}
      viewport={{ once: true }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-gray-200 dark:text-slate-700" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-blue-500 transition-none"
        />
      </svg>
      <span className="text-xs font-semibold text-gray-900 dark:text-white">{animatedValue}%</span>
      <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center">{label}</span>
    </motion.div>
  );
}

// ─── Slide In Text ───────────────────────────────────
interface SlideInTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export function SlideInText({ text, delay = 0, className = '' }: SlideInTextProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {text}
    </motion.span>
  );
}
