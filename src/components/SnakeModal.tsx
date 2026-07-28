'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal, useTheme } from '@/contexts';
import { Trophy, RefreshCw } from 'lucide-react';

const GRID_SIZE = 20; // 20x20 grid
const INITIAL_SPEED = 120; // ms per tick

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

function getRandomFoodPosition(snake: Point[]): Point {
  while (true) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    const isOnSnake = snake.some((seg) => seg.x === x && seg.y === y);
    if (!isOnSnake) return { x, y };
  }
}

export function SnakeModal() {
  const { state, closeSnakeModal } = useTerminal();
  const { isDark } = useTheme();

  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>('UP');
  const [nextDir, setNextDir] = useState<Direction>('UP');
  const [food, setFood] = useState<Point>({ x: 10, y: 5 });
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Load high score from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('snake_highscore');
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  // Reset Game
  const resetGame = useCallback(() => {
    const initS = INITIAL_SNAKE;
    setSnake(initS);
    setDirection('UP');
    setNextDir('UP');
    setFood(getRandomFoodPosition(initS));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  }, []);

  // Initialize game on modal open
  useEffect(() => {
    if (state.isSnakeModalOpen) {
      resetGame();
    }
  }, [state.isSnakeModalOpen, resetGame]);

  // Main Game Loop
  useEffect(() => {
    if (!state.isSnakeModalOpen || isGameOver || isPaused) return;

    const gameInterval = setInterval(() => {
      setDirection(nextDir);

      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (nextDir) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        // Wall collision check
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collision check
        const selfCollision = prevSnake.some((seg) => seg.x === head.x && seg.y === head.y);
        if (selfCollision) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food check
        if (head.x === food.x && head.y === food.y) {
          setScore((prevScore) => {
            const nextScore = prevScore + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('snake_highscore', nextScore.toString());
            }
            return nextScore;
          });
          setFood(getRandomFoodPosition(newSnake));
        } else {
          newSnake.pop(); // Remove tail segment
        }

        return newSnake;
      });
    }, INITIAL_SPEED);

    return () => clearInterval(gameInterval);
  }, [state.isSnakeModalOpen, isGameOver, isPaused, nextDir, food, highScore]);

  // Keyboard navigation & hotkeys
  useEffect(() => {
    if (!state.isSnakeModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        resetGame();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeSnakeModal();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setNextDir('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setNextDir('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setNextDir('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setNextDir('RIGHT');
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [state.isSnakeModalOpen, direction, resetGame, closeSnakeModal]);

  if (!state.isSnakeModalOpen) return null;

  return (
    <AnimatePresence>
      {state.isSnakeModalOpen && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSnakeModal();
          }}
        >
          {/* Theme-aware Backdrop Blur */}
          <motion.div
            className={`absolute inset-0 transition-colors duration-300 ${
              isDark ? 'bg-slate-950/85 backdrop-blur-2xl' : 'bg-slate-100/85 backdrop-blur-2xl'
            }`}
          />

          {/* Floating Transparent Game Wrapper */}
          <motion.div
            className={`relative w-full max-w-[480px] flex flex-col items-center justify-center font-mono ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Top Score Bar */}
            <div className="flex justify-between items-baseline w-full mb-6 px-4 font-mono select-none">
              <div className="text-left">
                <span className={`text-[11px] uppercase tracking-widest font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  SCORE
                </span>
                <span className="text-3xl font-extrabold text-emerald-400">
                  {score}
                </span>
              </div>

              <div className="text-right">
                <span className={`text-[11px] uppercase tracking-widest font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  HIGH SCORE
                </span>
                <span className={`text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {highScore}
                </span>
              </div>
            </div>

            {/* Snake Game Grid */}
            <div className="relative w-full aspect-square max-w-[360px] mb-6 rounded-2xl overflow-hidden border p-1 backdrop-blur-md shadow-lg flex flex-col justify-between transition-colors bg-slate-950/60 border-slate-800/80">
              <div className="grid grid-cols-20 grid-rows-20 w-full h-full gap-[1px]">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                  const x = idx % GRID_SIZE;
                  const y = Math.floor(idx / GRID_SIZE);

                  const isHead = snake[0].x === x && snake[0].y === y;
                  const isBody = snake.slice(1).some((seg) => seg.x === x && seg.y === y);
                  const isFood = food.x === x && food.y === y;

                  let cellClass = 'bg-transparent';
                  if (isHead) {
                    cellClass = 'bg-emerald-400 rounded-sm shadow-[0_0_8px_rgba(52,211,153,0.8)]';
                  } else if (isBody) {
                    cellClass = 'bg-emerald-500/80 rounded-sm';
                  } else if (isFood) {
                    cellClass = 'bg-rose-500 rounded-full animate-ping';
                  }

                  return (
                    <div key={idx} className="relative w-full h-full">
                      {isFood && (
                        <div className="absolute inset-0 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.9)]" />
                      )}
                      <div className={`w-full h-full ${cellClass}`} />
                    </div>
                  );
                })}
              </div>

              {/* Game Over Overlay */}
              {isGameOver && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <p className="text-rose-400 font-extrabold text-xl tracking-wider">
                    GAME OVER!
                  </p>
                  <p className="text-xs text-slate-300 font-mono">
                    Final Score: <strong className="text-emerald-400">{score}</strong>
                  </p>
                  <button
                    onClick={resetGame}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow"
                  >
                    Play Again (Tab)
                  </button>
                </div>
              )}
            </div>

            {/* Controls Hint */}
            <div className="text-[11px] font-mono text-slate-400 mb-6 text-center">
              Use <kbd className="px-1 py-0.5 bg-slate-800/60 border border-slate-700/60 rounded">W A S D</kbd> or <kbd className="px-1 py-0.5 bg-slate-800/60 border border-slate-700/60 rounded">↑ ↓ ← →</kbd> to move
            </div>

            {/* Hotkeys Footer Controls */}
            <div className="flex items-center justify-center gap-8 text-xs font-mono select-none">
              <button
                onClick={resetGame}
                className={`flex items-center gap-2 transition-colors group cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <kbd className={`px-1.5 py-0.5 border rounded text-[10px] ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700/80 text-slate-300 group-hover:border-slate-400'
                    : 'bg-white border-slate-300 text-slate-800 font-semibold group-hover:border-slate-500 shadow-xs'
                }`}>
                  tab
                </kbd>
                <span>restart</span>
              </button>

              <button
                onClick={closeSnakeModal}
                className={`flex items-center gap-2 transition-colors group cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <kbd className={`px-1.5 py-0.5 border rounded text-[10px] ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700/80 text-slate-300 group-hover:border-slate-400'
                    : 'bg-white border-slate-300 text-slate-800 font-semibold group-hover:border-slate-500 shadow-xs'
                }`}>
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
