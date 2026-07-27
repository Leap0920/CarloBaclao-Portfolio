'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────────────

export interface TerminalState {
  isOpen: boolean;
  isTypingModalOpen: boolean;
  isTypingLoading: boolean;
  mode: 'prompt' | 'typing-test';
  history: { type: 'input' | 'output'; text: string }[];
  inputValue: string;
  matrixActive: boolean;
  typingTestState: {
    sentence: string;
    typedText: string;
    startTime: number | null;
    result: { wpm: number; accuracy: number; time: number } | null;
  } | null;
}

type TerminalAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'OPEN_TYPING_MODAL' }
  | { type: 'CLOSE_TYPING_MODAL' }
  | { type: 'SET_TYPING_LOADING'; payload: boolean }
  | { type: 'ADD_HISTORY'; payload: { type: 'input' | 'output'; text: string } }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_MODE'; payload: 'prompt' | 'typing-test' }
  | { type: 'TOGGLE_MATRIX' }
  | { type: 'SET_TYPING_TEST'; payload: TerminalState['typingTestState'] };

// ── Initial State ──────────────────────────────────────────────────────

const initialState: TerminalState = {
  isOpen: false,
  isTypingModalOpen: false,
  isTypingLoading: false,
  mode: 'prompt',
  history: [],
  inputValue: '',
  matrixActive: false,
  typingTestState: null,
};

// ── Reducer ────────────────────────────────────────────────────────────

function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false, inputValue: '', typingTestState: null };
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen, inputValue: '', typingTestState: null };
    case 'OPEN_TYPING_MODAL':
      return { ...state, isTypingModalOpen: true, isTypingLoading: true };
    case 'CLOSE_TYPING_MODAL':
      return { ...state, isTypingModalOpen: false, isTypingLoading: false };
    case 'SET_TYPING_LOADING':
      return { ...state, isTypingLoading: action.payload };
    case 'ADD_HISTORY':
      return { ...state, history: [...state.history, action.payload] };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    case 'SET_INPUT':
      return { ...state, inputValue: action.payload };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'TOGGLE_MATRIX':
      return { ...state, matrixActive: !state.matrixActive };
    case 'SET_TYPING_TEST':
      return { ...state, typingTestState: action.payload };
    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────

interface TerminalContextType {
  state: TerminalState;
  dispatch: React.Dispatch<TerminalAction>;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  openTypingModal: () => void;
  closeTypingModal: () => void;
  addOutput: (text: string) => void;
  addInput: (text: string) => void;
  clearHistory: () => void;
}

const TerminalContext = createContext<TerminalContextType | null>(null);

// ── Provider ───────────────────────────────────────────────────────────

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(terminalReducer, initialState);

  const openTerminal = useCallback(() => dispatch({ type: 'OPEN' }), []);
  const closeTerminal = useCallback(() => dispatch({ type: 'CLOSE' }), []);
  const toggleTerminal = useCallback(() => dispatch({ type: 'TOGGLE' }), []);
  const openTypingModal = useCallback(() => dispatch({ type: 'OPEN_TYPING_MODAL' }), []);
  const closeTypingModal = useCallback(() => dispatch({ type: 'CLOSE_TYPING_MODAL' }), []);
  const addOutput = useCallback(
    (text: string) => dispatch({ type: 'ADD_HISTORY', payload: { type: 'output', text } }),
    [],
  );
  const addInput = useCallback(
    (text: string) => dispatch({ type: 'ADD_HISTORY', payload: { type: 'input', text } }),
    [],
  );
  const clearHistory = useCallback(() => dispatch({ type: 'CLEAR_HISTORY' }), []);

  return (
    <TerminalContext.Provider
      value={{
        state,
        dispatch,
        openTerminal,
        closeTerminal,
        toggleTerminal,
        openTypingModal,
        closeTypingModal,
        addOutput,
        addInput,
        clearHistory,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error('useTerminal must be used within TerminalProvider');
  return ctx;
}

