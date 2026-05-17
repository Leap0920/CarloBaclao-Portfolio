'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface ContentAreaProps {
  section: string;
  content: React.ReactNode;
}

function TypingGreeting() {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [greetingText, setGreetingText] = useState('HELLO THERE!');

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreetingText('GOOD MORNING!');
    else if (hour < 18) setGreetingText('GOOD AFTERNOON!');
    else setGreetingText('GOOD EVENING!');
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (index < greetingText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + greetingText[index]);
        setIndex((prev) => prev + 1);
      }, 60);
      return () => clearTimeout(timeout);
    }
  }, [index, mounted, greetingText]);

  if (!mounted) return <div className="h-10" />;

  return (
    <div className="flex items-center gap-2 mb-6 px-2">
      <h1 className="text-xl font-black text-white uppercase tracking-tight" suppressHydrationWarning>
        {displayedText}
        {index < greetingText.length && <motion.span
          className="inline-block w-1.5 h-5 bg-blue-500 ml-1 translate-y-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />}
      </h1>
    </div>
  );
}

export function ContentArea({ section, content }: ContentAreaProps) {
  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden h-full pr-1 custom-scrollbar pb-6">
      <TypingGreeting />
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
