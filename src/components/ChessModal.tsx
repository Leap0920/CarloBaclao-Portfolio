'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal, useTheme } from '@/contexts';
import { RotateCcw, X, Bot, Users, Trophy, Flag, Crown } from 'lucide-react';

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
type PieceColor = 'w' | 'b';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type BoardState = (Piece | null)[][];

const UNICODE_PIECES: Record<string, string> = {
  w_k: '♔',
  w_q: '♕',
  w_r: '♖',
  w_b: '♗',
  w_n: '♘',
  w_p: '♙',
  b_k: '♚',
  b_q: '♛',
  b_r: '♜',
  b_b: '♝',
  b_n: '♞',
  b_p: '♟',
};

function createInitialBoard(): BoardState {
  const setup: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));

  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: setup[c], color: 'b' };
    board[1][c] = { type: 'p', color: 'b' };
    board[6][c] = { type: 'p', color: 'w' };
    board[7][c] = { type: setup[c], color: 'w' };
  }
  return board;
}

export function ChessModal() {
  const { state, closeChessModal } = useTerminal();
  const { isDark } = useTheme();

  const [board, setBoard] = useState<BoardState>(createInitialBoard);
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [turn, setTurn] = useState<PieceColor>('w');
  const [vsBot, setVsBot] = useState<boolean>(true);
  const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);
  const [winner, setWinner] = useState<PieceColor | 'draw' | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('White to move');

  const initGame = useCallback(() => {
    setBoard(createInitialBoard());
    setSelectedPos(null);
    setValidMoves([]);
    setTurn('w');
    setCapturedWhite([]);
    setCapturedBlack([]);
    setWinner(null);
    setStatusMsg('White to move');
  }, []);

  useEffect(() => {
    if (state.isChessModalOpen) {
      initGame();
    }
  }, [state.isChessModalOpen, initGame]);

  // Compute pseudo-legal candidate moves for a piece
  const getPseudoLegalMoves = useCallback((b: BoardState, r: number, c: number): [number, number][] => {
    const piece = b[r][c];
    if (!piece) return [];
    const moves: [number, number][] = [];
    const color = piece.color;
    const enemy = color === 'w' ? 'b' : 'w';

    const addIfValid = (nr: number, nc: number) => {
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const dest = b[nr][nc];
        if (!dest) {
          moves.push([nr, nc]);
          return true;
        } else if (dest.color === enemy) {
          moves.push([nr, nc]);
          return false;
        }
      }
      return false;
    };

    if (piece.type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      // Step forward 1
      if (r + dir >= 0 && r + dir < 8 && !b[r + dir][c]) {
        moves.push([r + dir, c]);
        // Step forward 2 from start
        if (r === startRow && !b[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
      // Captures
      [-1, 1].forEach((dc) => {
        const nr = r + dir;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && b[nr][nc]?.color === enemy) {
          moves.push([nr, nc]);
        }
      });
    } else if (piece.type === 'n') {
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      knightOffsets.forEach(([dr, dc]) => addIfValid(r + dr, c + dc));
    } else if (piece.type === 'k') {
      const kingOffsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      kingOffsets.forEach(([dr, dc]) => addIfValid(r + dr, c + dc));
    } else {
      // Rays for R, B, Q
      const dirs: [number, number][] = [];
      if (piece.type === 'r' || piece.type === 'q') {
        dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
      }
      if (piece.type === 'b' || piece.type === 'q') {
        dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }
      dirs.forEach(([dr, dc]) => {
        let nr = r + dr;
        let nc = c + dc;
        while (addIfValid(nr, nc)) {
          nr += dr;
          nc += dc;
        }
      });
    }

    return moves;
  }, []);

  // Find King position
  const findKingPos = (b: BoardState, color: PieceColor): [number, number] | null => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (b[r][c]?.type === 'k' && b[r][c]?.color === color) {
          return [r, c];
        }
      }
    }
    return null;
  };

  // Check if a King is attacked under pseudo-legal moves
  const isKingAttacked = useCallback((b: BoardState, color: PieceColor): boolean => {
    const kingPos = findKingPos(b, color);
    if (!kingPos) return true; // Missing King -> attacked
    const [kr, kc] = kingPos;
    const enemyColor = color === 'w' ? 'b' : 'w';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (b[r][c]?.color === enemyColor) {
          const pseudoMoves = getPseudoLegalMoves(b, r, c);
          if (pseudoMoves.some(([tr, tc]) => tr === kr && tc === kc)) {
            return true;
          }
        }
      }
    }
    return false;
  }, [getPseudoLegalMoves]);

  // Compute STRICT legal moves (prevents moving into check or exposing pinned King)
  const getStrictLegalMoves = useCallback((b: BoardState, r: number, c: number): [number, number][] => {
    const piece = b[r][c];
    if (!piece) return [];
    const candidates = getPseudoLegalMoves(b, r, c);

    return candidates.filter(([tr, tc]) => {
      // Simulate move on cloned board
      const testBoard = b.map((row) => [...row]);
      testBoard[tr][tc] = testBoard[r][c];
      testBoard[r][c] = null;
      // Filter out if own King is left in check
      return !isKingAttacked(testBoard, piece.color);
    });
  }, [getPseudoLegalMoves, isKingAttacked]);

  // Count total strict legal moves for a color
  const countTotalStrictLegalMoves = useCallback((b: BoardState, color: PieceColor): number => {
    let count = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (b[r][c]?.color === color) {
          count += getStrictLegalMoves(b, r, c).length;
        }
      }
    }
    return count;
  }, [getStrictLegalMoves]);

  // Make move
  const makeMove = useCallback((fromR: number, fromC: number, toR: number, toC: number) => {
    if (winner) return;
    const movingPiece = board[fromR][fromC];
    const targetPiece = board[toR][toC];
    if (!movingPiece) return;

    // Instant Win on King capture (backup safety)
    if (targetPiece?.type === 'k') {
      const winColor = movingPiece.color;
      if (targetPiece.color === 'w') setCapturedWhite((cp) => [...cp, targetPiece]);
      else setCapturedBlack((cp) => [...cp, targetPiece]);

      const newB = board.map((row) => [...row]);
      newB[toR][toC] = movingPiece;
      newB[fromR][fromC] = null;

      setBoard(newB);
      setSelectedPos(null);
      setValidMoves([]);
      setWinner(winColor);
      setStatusMsg(`Checkmate! ${winColor === 'w' ? 'White' : 'Black (AI)'} Wins!`);
      return;
    }

    // Execute Move
    const newBoard = board.map((row) => [...row]);
    newBoard[toR][toC] = movingPiece;
    newBoard[fromR][fromC] = null;

    if (targetPiece) {
      if (targetPiece.color === 'w') setCapturedWhite((cp) => [...cp, targetPiece]);
      else setCapturedBlack((cp) => [...cp, targetPiece]);
    }

    setBoard(newBoard);
    setSelectedPos(null);
    setValidMoves([]);

    const nextTurn = turn === 'w' ? 'b' : 'w';
    setTurn(nextTurn);

    // Evaluate Check / Checkmate / Stalemate for next turn player
    const nextTurnMoves = countTotalStrictLegalMoves(newBoard, nextTurn);
    const inCheck = isKingAttacked(newBoard, nextTurn);

    if (inCheck && nextTurnMoves === 0) {
      // True Checkmate!
      setWinner(movingPiece.color);
      setStatusMsg(`Checkmate! ${movingPiece.color === 'w' ? 'White' : 'Black (AI)'} Wins!`);
    } else if (!inCheck && nextTurnMoves === 0) {
      // Stalemate!
      setWinner('draw');
      setStatusMsg('Stalemate! Game is a Draw.');
    } else if (inCheck) {
      // Check warning
      setStatusMsg(`CHECK! ${nextTurn === 'w' ? "White's" : "Black's"} King is under attack!`);
    } else {
      setStatusMsg(`${nextTurn === 'w' ? "White's" : "Black's"} turn`);
    }
  }, [board, turn, winner, isKingAttacked, countTotalStrictLegalMoves]);

  // AI Bot Move Logic
  const handleBotMove = useCallback(() => {
    if (winner || turn !== 'b' || !vsBot) return;

    // Collect all black strict legal moves
    const allMoves: { from: [number, number]; to: [number, number]; score: number }[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c]?.color === 'b') {
          const legals = getStrictLegalMoves(board, r, c);
          legals.forEach(([tr, tc]) => {
            const destPiece = board[tr][tc];
            let score = 0;
            if (destPiece) {
              const valMap: Record<PieceType, number> = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
              score = valMap[destPiece.type] * 10;
            }
            // Prefer center control
            score += (3.5 - Math.abs(3.5 - tr)) + (3.5 - Math.abs(3.5 - tc));
            allMoves.push({ from: [r, c], to: [tr, tc], score });
          });
        }
      }
    }

    if (allMoves.length === 0) {
      return;
    }

    // Sort by score & pick top move
    allMoves.sort((a, b) => b.score - a.score);
    const chosen = allMoves[0];
    makeMove(chosen.from[0], chosen.from[1], chosen.to[0], chosen.to[1]);
  }, [board, turn, vsBot, winner, getStrictLegalMoves, makeMove]);

  // Trigger bot move after short delay
  useEffect(() => {
    if (vsBot && turn === 'b' && !winner) {
      const botTimer = setTimeout(handleBotMove, 400);
      return () => clearTimeout(botTimer);
    }
  }, [turn, vsBot, winner, handleBotMove]);

  // Handle Square Click
  const handleSquareClick = (r: number, c: number) => {
    if (winner) return;
    if (vsBot && turn === 'b') return;

    const clickedPiece = board[r][c];

    if (selectedPos) {
      const [sr, sc] = selectedPos;
      const isValid = validMoves.some(([vr, vc]) => vr === r && vc === c);
      if (isValid) {
        makeMove(sr, sc, r, c);
        return;
      }
    }

    if (clickedPiece && clickedPiece.color === turn) {
      setSelectedPos([r, c]);
      setValidMoves(getStrictLegalMoves(board, r, c));
    } else {
      setSelectedPos(null);
      setValidMoves([]);
    }
  };

  // Keyboard Hotkeys (Tab -> restart, Esc -> close)
  useEffect(() => {
    if (!state.isChessModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        initGame();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeChessModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [state.isChessModalOpen, initGame, closeChessModal]);

  if (!state.isChessModalOpen) return null;

  return (
    <AnimatePresence>
      {state.isChessModalOpen && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 select-none font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeChessModal();
          }}
        >
          {/* Transparent Backdrop Blur */}
          <motion.div
            className={`absolute inset-0 transition-colors duration-300 ${
              isDark ? 'bg-slate-950/85 backdrop-blur-2xl' : 'bg-slate-100/85 backdrop-blur-2xl'
            }`}
          />

          {/* Floating Transparent Content */}
          <motion.div
            className={`relative w-full max-w-[540px] flex flex-col items-center justify-center ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Header Controls & Mode Switcher */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase">Chess Arcade</span>
              </div>

              {/* Mode Toggle Button */}
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setVsBot((prev) => !prev);
                  initGame();
                }}
                className={`px-3 py-1 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-900/70 border-slate-800 text-slate-300 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:text-slate-950 shadow-xs'
                }`}
              >
                {vsBot ? <Bot className="w-3.5 h-3.5 text-emerald-400" /> : <Users className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{vsBot ? 'vs AI Bot' : '2-Player Local'}</span>
              </button>
            </div>

            {/* Status & Captured Pieces Header */}
            <div className="w-full flex items-center justify-between text-xs mb-3 px-1">
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Captured:</span>
                <span className="text-slate-200">{capturedBlack.map((p) => UNICODE_PIECES[`b_${p.type}`]).join(' ')}</span>
              </div>
              <span className={`font-semibold ${winner ? 'text-amber-400 animate-bounce' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {statusMsg}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-slate-200">{capturedWhite.map((p) => UNICODE_PIECES[`w_${p.type}`]).join(' ')}</span>
              </div>
            </div>

            {/* 8x8 Chessboard Grid */}
            <div className={`relative p-2 rounded-2xl border shadow-2xl backdrop-blur-xl ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
            }`}>
              {/* Checkmate Victory Banner Overlay */}
              {winner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-30 rounded-2xl bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3 font-mono"
                >
                  <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
                  <h3 className="text-2xl font-extrabold text-white tracking-wider">
                    {winner === 'draw' ? 'STALEMATE!' : 'CHECKMATE!'}
                  </h3>
                  <p className="text-emerald-400 font-bold text-sm">
                    {winner === 'draw'
                      ? 'No legal moves left - Game is a Draw!'
                      : winner === 'w'
                      ? 'White Player Wins!'
                      : vsBot
                      ? 'Black (AI Bot) Wins!'
                      : 'Black Player Wins!'}
                  </p>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={initGame}
                    className="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" /> Play Again (Tab)
                  </button>
                </motion.div>
              )}

              <div className="grid grid-cols-8 gap-0 border border-slate-700/50 rounded-xl overflow-hidden">
                {board.map((row, r) =>
                  row.map((cell, c) => {
                    const isDarkSquare = (r + c) % 2 === 1;
                    const isSelected = selectedPos?.[0] === r && selectedPos?.[1] === c;
                    const isValidMove = validMoves.some(([vr, vc]) => vr === r && vc === c);
                    const isKingInCheckSquare = cell?.type === 'k' && isKingAttacked(board, cell.color);

                    let bgStyle = isDarkSquare
                      ? isDark ? 'bg-slate-800/80' : 'bg-slate-300/80'
                      : isDark ? 'bg-slate-900/80' : 'bg-slate-100';

                    if (isKingInCheckSquare) {
                      bgStyle = 'bg-rose-500/60 ring-4 ring-rose-500 animate-pulse';
                    } else if (isSelected) {
                      bgStyle = isDark ? 'bg-emerald-600/60 ring-2 ring-emerald-400' : 'bg-emerald-300 ring-2 ring-emerald-600';
                    }

                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        tabIndex={-1}
                        onClick={() => handleSquareClick(r, c)}
                        className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-3xl transition-all duration-100 relative cursor-pointer ${bgStyle}`}
                      >
                        {/* Legal Move Dot Highlight */}
                        {isValidMove && (
                          <div className={`absolute w-3.5 h-3.5 rounded-full z-10 ${
                            cell ? 'border-2 border-red-500 bg-red-500/30 animate-pulse' : 'bg-emerald-400/80'
                          }`} />
                        )}

                        {/* Piece Symbol */}
                        {cell && (
                          <span className={`z-0 leading-none select-none ${
                            cell.color === 'w'
                              ? isDark ? 'text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-slate-950 font-bold'
                              : 'text-zinc-950 drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]'
                          }`}>
                            {UNICODE_PIECES[`${cell.color}_${cell.type}`]}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Hotkeys Footer */}
            <div className="flex items-center justify-center gap-8 text-xs font-mono select-none pt-4">
              <button
                type="button"
                tabIndex={-1}
                onClick={initGame}
                className={`flex items-center gap-2 transition-colors group cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <kbd className={`px-2 py-0.5 border rounded text-[10px] ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700/80 text-slate-300 group-hover:border-slate-400'
                    : 'bg-white border-slate-300 text-slate-800 font-semibold group-hover:border-slate-500 shadow-xs'
                }`}>
                  tab
                </kbd>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                  restart
                </span>
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={closeChessModal}
                className={`flex items-center gap-2 transition-colors group cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-slate-100' : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <kbd className={`px-2 py-0.5 border rounded text-[10px] ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700/80 text-slate-300 group-hover:border-slate-400'
                    : 'bg-white border-slate-300 text-slate-800 font-semibold group-hover:border-slate-500 shadow-xs'
                }`}>
                  esc
                </kbd>
                <span className="flex items-center gap-1">
                  <X className="w-3 h-3" />
                  close
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
