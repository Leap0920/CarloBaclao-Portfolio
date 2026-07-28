'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal, useTheme } from '@/contexts';
import { RefreshCw, User, Bot, Trophy } from 'lucide-react';

type Player = 'X' | 'O' | null;

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6],           // Diagonals
];

function checkWinner(board: Player[]): { winner: Player; combo: number[] | null } {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }
  return { winner: null, combo: null };
}

// Minimax AI for unbeatable / smart AI opponent
function minimax(board: Player[], depth: number, isMaximizing: boolean): { score: number; index?: number } {
  const { winner } = checkWinner(board);
  if (winner === 'O') return { score: 10 - depth };
  if (winner === 'X') return { score: depth - 10 };
  if (board.every((cell) => cell !== null)) return { score: 0 };

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestIndex = -1;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false).score;
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestIndex = i;
        }
      }
    }
    return { score: bestScore, index: bestIndex };
  } else {
    let bestScore = Infinity;
    let bestIndex = -1;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true).score;
        board[i] = null;
        if (score < bestScore) {
          bestScore = score;
          bestIndex = i;
        }
      }
    }
    return { score: bestScore, index: bestIndex };
  }
}

export function TicTacToeModal() {
  const { state, closeTicTacToeModal } = useTerminal();
  const { isDark } = useTheme();

  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [vsAI, setVsAI] = useState<boolean>(true);
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });

  const { winner, combo: winningCombo } = checkWinner(board);
  const isDraw = !winner && board.every((cell) => cell !== null);

  // Reset Game Board
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  }, []);

  // Update scores when round completes
  useEffect(() => {
    if (winner === 'X') {
      setScores((prev) => ({ ...prev, x: prev.x + 1 }));
    } else if (winner === 'O') {
      setScores((prev) => ({ ...prev, o: prev.o + 1 }));
    } else if (isDraw) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  }, [winner, isDraw]);

  // AI Move Execution
  useEffect(() => {
    if (vsAI && !isXNext && !winner && !isDraw && state.isTicTacToeModalOpen) {
      const timer = setTimeout(() => {
        const bestMove = minimax(board, 0, true).index;
        if (bestMove !== undefined && bestMove !== -1) {
          const newBoard = [...board];
          newBoard[bestMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [vsAI, isXNext, winner, isDraw, board, state.isTicTacToeModalOpen]);

  // Handle Tile Clicks
  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;
    if (vsAI && !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Global window hotkeys (Tab restart, Esc close)
  useEffect(() => {
    if (!state.isTicTacToeModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        resetGame();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeTicTacToeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [state.isTicTacToeModalOpen, resetGame, closeTicTacToeModal]);

  if (!state.isTicTacToeModalOpen) return null;

  return (
    <AnimatePresence>
      {state.isTicTacToeModalOpen && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeTicTacToeModal();
          }}
        >
          {/* Theme-aware backdrop blur */}
          <motion.div
            className={`absolute inset-0 transition-colors duration-300 ${
              isDark ? 'bg-slate-950/85 backdrop-blur-2xl' : 'bg-slate-100/85 backdrop-blur-2xl'
            }`}
          />

          {/* Floating Transparent Game Wrapper */}
          <motion.div
            className={`relative w-full max-w-[500px] flex flex-col items-center justify-center font-mono ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Top Scoreboard */}
            <div className="flex justify-between items-center w-full mb-8 px-4 font-mono select-none">
              <div className="text-center">
                <span className="text-xs uppercase tracking-wider font-semibold block text-emerald-400">
                  X (PLAYER)
                </span>
                <span className={`text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {scores.x}
                </span>
              </div>

              <div className="text-center">
                <span className={`text-xs uppercase tracking-wider font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  DRAWS
                </span>
                <span className={`text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {scores.draws}
                </span>
              </div>

              <div className="text-center">
                <span className="text-xs uppercase tracking-wider font-semibold block text-cyan-400">
                  O ({vsAI ? 'AI BOT' : 'PLAYER 2'})
                </span>
                <span className={`text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {scores.o}
                </span>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-3 mb-6 text-xs select-none">
              <button
                onClick={() => {
                  setVsAI(true);
                  resetGame();
                }}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                  vsAI
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                    : isDark
                    ? 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200'
                    : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bot className="w-3.5 h-3.5" /> vs AI Bot
              </button>

              <button
                onClick={() => {
                  setVsAI(false);
                  resetGame();
                }}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                  !vsAI
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
                    : isDark
                    ? 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200'
                    : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" /> 2 Players
              </button>
            </div>

            {/* Turn Status Banner */}
            <div className="mb-6 h-6 text-sm font-semibold tracking-wider uppercase text-center select-none">
              {winner ? (
                <span className={winner === 'X' ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                  PLAYER {winner} WINS!
                </span>
              ) : isDraw ? (
                <span className={isDark ? 'text-slate-400 font-bold' : 'text-slate-600 font-bold'}>IT&apos;S A DRAW!</span>
              ) : (
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {isXNext ? 'PLAYER X TURN' : vsAI ? 'AI BOT THINKING...' : 'PLAYER O TURN'}
                </span>
              )}
            </div>

            {/* 3x3 Tic Tac Toe Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[340px] aspect-square mb-8">
              {board.map((cell, idx) => {
                const isWinningTile = winningCombo?.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleClick(idx)}
                    className={`rounded-2xl border flex items-center justify-center text-4xl font-extrabold transition-all duration-150 cursor-pointer ${
                      isWinningTile
                        ? cell === 'X'
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                          : 'bg-cyan-500/20 border-cyan-400 text-cyan-400 scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                        : cell === 'X'
                        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20'
                        : cell === 'O'
                        ? 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20'
                        : isDark
                        ? 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/70 hover:border-slate-600'
                        : 'bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-xs'
                    }`}
                  >
                    {cell && (
                      <motion.span
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        {cell}
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hotkeys Footer */}
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
                onClick={closeTicTacToeModal}
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
