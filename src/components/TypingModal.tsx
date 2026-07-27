'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal } from '@/contexts/TerminalContext';
import { Loader2 } from 'lucide-react';

const WORD_POOL = [
  'because', 'any', 'change', 'than', 'real', 'go', 'who', 'life', 'this', 'early',
  'long', 'for', 'up', 'this', 'the', 'would', 'can', 'form', 'but', 'thing', 'what',
  'could', 'run', 'first', 'world', 'system', 'code', 'logic', 'react', 'build', 'state',
  'props', 'custom', 'speed', 'power', 'future', 'cloud', 'learn', 'share', 'query', 'database',
  'render', 'commit', 'branch', 'source', 'script', 'array', 'string', 'number', 'boolean', 'import',
  'export', 'class', 'const', 'return', 'async', 'await', 'event', 'target', 'value', 'input',
  'theme', 'modal', 'hover', 'click', 'press', 'level', 'type', 'text', 'test', 'word',
  'line', 'page', 'site', 'view', 'card', 'grid', 'flex', 'style', 'color', 'light',
  'dark', 'mode', 'flow', 'time', 'fast', 'peak', 'high', 'rank', 'pass', 'done',
  'engine', 'keyboard', 'focus', 'signal', 'token', 'action', 'dispatch', 'hook', 'effect', 'context'
];

// Generate shuffle array without word repetition
function generateRandomWords(count = 35): string[] {
  const shuffled = [...WORD_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export function TypingModal() {
  const { state, dispatch, closeTypingModal } = useTerminal();
  
  // Test state
  const [words, setWords] = useState<string[]>([]);
  const [typedText, setTypedText] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Initialize random non-repeating words
  const initTest = useCallback(() => {
    setWords(generateRandomWords(35));
    setTypedText('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsFinished(false);
    setActiveKeys(new Set());
    setTimeout(() => hiddenInputRef.current?.focus(), 100);
  }, []);

  // Initialize test when modal opens
  useEffect(() => {
    if (state.isTypingModalOpen) {
      initTest();
    }
  }, [state.isTypingModalOpen, initTest]);

  // Timer loop when typing starts
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTime && !isFinished) {
      timer = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
    }
    return () => clearInterval(timer);
  }, [startTime, isFinished]);

  const targetSentence = words.join(' ');

  // Live Metrics Calculations
  const calculateMetrics = useCallback(() => {
    const totalTyped = typedText.length;
    let correctChars = 0;
    for (let i = 0; i < totalTyped; i++) {
      if (typedText[i] === targetSentence[i]) {
        correctChars++;
      }
    }
    const minutes = Math.max(elapsedSeconds / 60, 0.01);
    const wpm = Math.round((correctChars / 5) / minutes);
    const accuracy = totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);
    return { wpm, accuracy, correctChars, totalTyped };
  }, [typedText, targetSentence, elapsedSeconds]);

  // Handle Physical Key Presses
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (state.isTypingLoading) return;

    if (e.key === 'Escape') {
      closeTypingModal();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      initTest();
      return;
    }

    // Start timer on first character typed
    if (!startTime && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setStartTime(Date.now());
    }

    // Active key lighting animation
    const keyLower = e.key.toLowerCase();
    setActiveKeys((prev) => new Set(prev).add(keyLower === ' ' ? 'space' : keyLower));

    if (e.key === 'Backspace') {
      setTypedText((prev) => prev.slice(0, -1));
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      if (typedText.length < targetSentence.length) {
        const nextText = typedText + e.key;
        setTypedText(nextText);

        if (nextText.length === targetSentence.length) {
          setIsFinished(true);
        }
      }
    }
  }, [state.isTypingLoading, closeTypingModal, initTest, startTime, typedText, targetSentence]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const keyLower = e.key.toLowerCase();
    setActiveKeys((prev) => {
      const next = new Set(prev);
      next.delete(keyLower === ' ' ? 'space' : keyLower);
      return next;
    });
  }, []);

  const { wpm, accuracy } = calculateMetrics();

  if (!state.isTypingModalOpen) return null;

  return (
    <AnimatePresence>
      {state.isTypingModalOpen && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeTypingModal();
          }}
        >
          {/* Transparent Backdrop Blur over entire background */}
          <motion.div className="absolute inset-0 bg-slate-950/85 backdrop-blur-2xl" />

          {/* Hidden input to capture physical keyboard events */}
          <input
            ref={hiddenInputRef}
            type="text"
            className="absolute opacity-0 pointer-events-none w-0 h-0"
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            autoFocus
          />

          {/* Transparent Outer Floating Wrapper (No Box / No Border / No Title Bar) */}
          <motion.div
            className="relative w-full max-w-[860px] flex flex-col items-center justify-center text-slate-100 font-mono"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            onClick={() => hiddenInputRef.current?.focus()}
          >
            {/* WPM, ACC, TIME Metrics Display (Only Numbers & Labels, No Box) */}
                <div className="flex justify-center items-baseline gap-12 sm:gap-24 mb-10 select-none">
                  <div className="text-center">
                    <span className="text-4xl sm:text-5xl font-bold text-slate-100 block tracking-tight">
                      {wpm}
                    </span>
                    <span className="text-[11px] text-slate-400/80 uppercase tracking-widest font-medium">
                      WPM
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-4xl sm:text-5xl font-bold text-slate-100 block tracking-tight">
                      {accuracy}<span className="text-lg text-slate-400 font-normal">%</span>
                    </span>
                    <span className="text-[11px] text-slate-400/80 uppercase tracking-widest font-medium">
                      ACC
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-4xl sm:text-5xl font-bold text-slate-100 block tracking-tight">
                      {elapsedSeconds}<span className="text-lg text-slate-400 font-normal">s</span>
                    </span>
                    <span className="text-[11px] text-slate-400/80 uppercase tracking-widest font-medium">
                      TIME
                    </span>
                  </div>
                </div>

                {/* Floating Words Paragraph Stream (No Bounding Box / No Container Border) */}
                <div className="w-full mb-10 px-4 min-h-[120px] flex items-center justify-center cursor-text">
                  <p className="font-mono text-lg sm:text-xl leading-relaxed tracking-wider text-left w-full select-none break-words">
                    {targetSentence.split('').map((char, index) => {
                      const isTyped = index < typedText.length;
                      const isCorrect = isTyped && typedText[index] === char;
                      const isCurrent = index === typedText.length;

                      let colorClass = 'text-slate-400/35'; // Dimmed un-typed words matching screenshot
                      if (isTyped) {
                        colorClass = isCorrect
                          ? 'text-slate-100 font-medium'
                          : 'text-red-400 bg-red-500/20 rounded-sm underline decoration-red-400';
                      }

                      return (
                        <span key={index} className={`relative transition-colors ${colorClass}`}>
                          {isCurrent && (
                            <span className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-slate-100 animate-pulse" />
                          )}
                          {char}
                        </span>
                      );
                    })}
                  </p>
                </div>

                {/* Floating Interactive Virtual Keyboard Keys */}
                <div className="space-y-2 max-w-[560px] mx-auto mb-10 select-none">
                  {KEYBOARD_ROWS.map((row, rIdx) => (
                    <div key={rIdx} className="flex justify-center gap-1.5 sm:gap-2">
                      {row.map((key) => {
                        const isPressed = activeKeys.has(key);
                        return (
                          <div
                            key={key}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs font-semibold lowercase transition-all duration-75 border ${
                              isPressed
                                ? 'bg-slate-100 text-slate-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-95 font-bold'
                                : 'bg-slate-800/40 border-slate-700/40 text-slate-300 hover:border-slate-500/60'
                            }`}
                          >
                            {key}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Space Bar Key */}
                  <div className="flex justify-center pt-1">
                    <div
                      className={`w-64 sm:w-80 h-9 rounded-xl flex items-center justify-center text-[10px] font-semibold tracking-wider uppercase transition-all duration-75 border ${
                        activeKeys.has('space')
                          ? 'bg-slate-100 text-slate-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-95 font-bold'
                          : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:border-slate-500/60'
                      }`}
                    >
                      SPACE
                    </div>
                  </div>
                </div>

                {/* Hotkeys Footer Controls (Floating text without box) */}
                <div className="flex items-center justify-center gap-8 text-xs font-mono text-slate-400/80 select-none">
                  <button
                    onClick={initTest}
                    className="flex items-center gap-2 hover:text-slate-100 transition-colors group"
                  >
                    <kbd className="px-1.5 py-0.5 bg-slate-800/60 border border-slate-700/60 rounded text-[10px] text-slate-300 group-hover:border-slate-400">
                      tab
                    </kbd>
                    <span>restart</span>
                  </button>

                  <button
                    onClick={closeTypingModal}
                    className="flex items-center gap-2 hover:text-slate-100 transition-colors group"
                  >
                    <kbd className="px-1.5 py-0.5 bg-slate-800/60 border border-slate-700/60 rounded text-[10px] text-slate-300 group-hover:border-slate-400">
                      esc
                    </kbd>
                    <span>close</span>
                  </button>
                </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

