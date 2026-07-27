'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal } from '@/contexts/TerminalContext';
import {
  Terminal,
  X,
  Minus,
  Square,
  HelpCircle,
  User,
  UserCheck,
  Code2,
  FolderGit2,
  FileText,
  Mail,
  Award,
  Eye,
  Keyboard,
  Gamepad2,
  Trash2,
  ExternalLink,
  Phone,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const QUICK_COMMANDS = [
  { cmd: '/help', desc: 'List all commands', icon: HelpCircle },
  { cmd: '/about', desc: 'Developer summary', icon: UserCheck },
  { cmd: '/skills', desc: 'Technical stack & skills', icon: Code2 },
  { cmd: '/projects', desc: 'Featured projects & links', icon: FolderGit2 },
  { cmd: '/resume', desc: 'Download PDF resume', icon: FileText },
  { cmd: '/contact', desc: 'Direct contact info', icon: Mail },
  { cmd: '/sudo hire carlo', desc: 'Hire command', icon: Award },
  { cmd: '/matrix', desc: 'Toggle matrix code rain', icon: Eye },
  { cmd: '/play typing', desc: 'Speed typing test', icon: Keyboard },
  { cmd: '/play tictactoe', desc: 'Tic Tac Toe game vs AI', icon: Gamepad2 },
  { cmd: '/play snake', desc: 'Retro snake game', icon: Gamepad2 },
  { cmd: '/clear', desc: 'Clear terminal screen', icon: Trash2 },
  { cmd: '/exit', desc: 'Close terminal window', icon: X },
];

export function TerminalModal() {
  const { state, dispatch, closeTerminal, openTypingModal, openTicTacToeModal, openSnakeModal } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  useEffect(() => {
    if (state.isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [state.isOpen]);

  const executeCommand = useCallback((commandText: string) => {
    const raw = commandText.trim();
    if (!raw) return;

    dispatch({ type: 'ADD_HISTORY', payload: { type: 'input', text: raw } });
    dispatch({ type: 'SET_INPUT', payload: '' });

    setCmdHistory((prev) => [...prev, raw]);
    setHistoryIdx(-1);

    const stripped = raw.startsWith('/') ? raw.slice(1) : raw;
    const cmd = stripped.toLowerCase();

    if (cmd === 'help') {
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: 'CMD_HELP' },
      });
    } else if (cmd === 'about') {
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: 'CMD_ABOUT' },
      });
    } else if (cmd === 'skills') {
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: 'CMD_SKILLS' },
      });
    } else if (cmd === 'projects') {
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: 'CMD_PROJECTS' },
      });
    } else if (cmd === 'resume') {
      dispatch({ type: 'ADD_HISTORY', payload: { type: 'output', text: 'CMD_RESUME' } });
      const link = document.createElement('a');
      link.href = '/Carlo_Baclao_Resume.pdf';
      link.download = 'Carlo_Baclao_Resume.pdf';
      link.click();
    } else if (cmd === 'contact') {
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: 'CMD_CONTACT' },
      });
    } else if (cmd === 'sudo hire carlo') {
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: 'CMD_HIRE' },
      });
    } else if (cmd === 'matrix') {
      dispatch({ type: 'TOGGLE_MATRIX' });
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: state.matrixActive ? 'Matrix code rain effect: OFF' : 'Matrix code rain effect: ON' },
      });
    } else if (cmd === 'play typing') {
      openTypingModal();
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: 'Interactive Monkeytype speed test modal launched.' },
      });
    } else if (cmd === 'play tictactoe' || cmd === 'play ttt' || cmd === 'play tic-tac-toe') {
      openTicTacToeModal();
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: 'Interactive Tic Tac Toe game modal launched.' },
      });
    } else if (cmd === 'play snake' || cmd === 'play snakes') {
      openSnakeModal();
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: 'Retro Snake arcade game modal launched.' },
      });
    } else if (cmd === 'clear') {
      dispatch({ type: 'CLEAR_HISTORY' });
    } else if (cmd === 'exit' || cmd === 'esc') {
      closeTerminal();
    } else {
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: `zsh: command not found: ${raw}. Type 'help' for available commands.` },
      });
    }

    setTimeout(() => {
      outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  }, [state.matrixActive, dispatch, closeTerminal]);

  const handleSubmit = useCallback(() => {
    executeCommand(state.inputValue);
  }, [state.inputValue, executeCommand]);

  const handleTypingKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!state.typingTestState?.startTime) return;
      const { sentence, typedText } = state.typingTestState;

      if (e.key === 'Backspace') {
        e.preventDefault();
        dispatch({ type: 'SET_TYPING_TEST', payload: { sentence, typedText: typedText.slice(0, -1), startTime: state.typingTestState.startTime, result: null } });
      } else if (e.key === 'Enter') {
        if (typedText === sentence && typedText.length > 0) {
          const elapsed = (Date.now() - state.typingTestState.startTime) / 1000;
          const minutes = elapsed / 60;
          const wpm = Math.round((typedText.length / 5) / Math.max(minutes, 0.01));
          const correct = typedText.split('').filter((c, i) => c === sentence[i]).length;
          const accuracy = Math.round((correct / typedText.length) * 100);
          dispatch({ type: 'SET_TYPING_TEST', payload: { sentence, typedText, startTime: state.typingTestState.startTime, result: { wpm, accuracy, time: Math.round(elapsed) } } });
          dispatch({ type: 'ADD_HISTORY', payload: { type: 'output', text: `Result: ${wpm} WPM | Accuracy: ${accuracy}% | Time: ${Math.round(elapsed)}s` } });
          setTimeout(() => dispatch({ type: 'SET_MODE', payload: 'prompt' }), 3000);
        }
      } else if (e.key.length === 1) {
        e.preventDefault();
        dispatch({ type: 'SET_TYPING_TEST', payload: { sentence, typedText: typedText + e.key, startTime: state.typingTestState.startTime, result: null } });
      }
    },
    [state.typingTestState, dispatch],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (state.mode === 'typing-test') {
        handleTypingKey(e);
        return;
      }

      if (e.key === 'Escape') {
        closeTerminal();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length === 0) return;
        const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        dispatch({ type: 'SET_INPUT', payload: cmdHistory[nextIdx] });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIdx === -1) return;
        const nextIdx = historyIdx + 1;
        if (nextIdx >= cmdHistory.length) {
          setHistoryIdx(-1);
          dispatch({ type: 'SET_INPUT', payload: '' });
        } else {
          setHistoryIdx(nextIdx);
          dispatch({ type: 'SET_INPUT', payload: cmdHistory[nextIdx] });
        }
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const current = state.inputValue.trim();
        if (!current) return;
        const matches = QUICK_COMMANDS.filter((c) => c.cmd.startsWith(current) || c.cmd.slice(1).startsWith(current));
        if (matches.length === 1) {
          dispatch({ type: 'SET_INPUT', payload: matches[0].cmd });
        }
      }
    },
    [handleSubmit, closeTerminal, state.mode, handleTypingKey, cmdHistory, historyIdx, state.inputValue, dispatch],
  );

  const displayValue =
    state.mode === 'typing-test' && state.typingTestState
      ? state.typingTestState.typedText
      : state.inputValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (state.mode !== 'typing-test') {
      dispatch({ type: 'SET_INPUT', payload: e.target.value });
    }
  };

  const renderOutputItem = (text: string, index: number) => {
    if (text === 'CMD_HELP') {
      return (
        <div key={index} className="my-2 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400 font-bold mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>AVAILABLE COMMANDS:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 font-mono">
            {QUICK_COMMANDS.map((item) => (
              <button
                key={item.cmd}
                onClick={() => executeCommand(item.cmd)}
                className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-zinc-900 text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  <item.icon className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-emerald-400 group-hover:underline">{item.cmd}</span>
                </div>
                <span className="text-zinc-500 text-[11px] truncate">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (text === 'CMD_ABOUT') {
      return (
        <div key={index} className="my-2 text-xs space-y-1 leading-relaxed text-zinc-300 font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <User className="w-3.5 h-3.5" />
            <span>Carlo C. Baclao — 4th Year BS IT Student @ Quezon City University</span>
          </div>
          <p className="text-zinc-400 pl-5">
            Full-stack developer with 5+ years of hands-on coding experience building web applications, backend REST APIs, and responsive user interfaces.
          </p>
        </div>
      );
    }

    if (text === 'CMD_SKILLS') {
      return (
        <div key={index} className="my-2 text-xs space-y-1.5 font-mono text-zinc-300">
          <div className="flex items-center gap-1.5 text-zinc-400 font-bold mb-1">
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>TECHNICAL CAPABILITIES:</span>
          </div>
          <p className="pl-5"><span className="text-zinc-400 w-24 inline-block font-semibold">Languages:</span> <span className="text-emerald-400">JavaScript, TypeScript, Java, Python, C++, SQL, Dart</span></p>
          <p className="pl-5"><span className="text-zinc-400 w-24 inline-block font-semibold">Frameworks:</span> <span className="text-cyan-400">React, Next.js, Spring Boot, Flutter, Tailwind CSS, Framer Motion</span></p>
          <p className="pl-5"><span className="text-zinc-400 w-24 inline-block font-semibold">Tools & Infra:</span> <span className="text-zinc-300">PostgreSQL, Git, Docker, Flyway, Raspberry Pi, Linux</span></p>
        </div>
      );
    }

    if (text === 'CMD_PROJECTS') {
      const projects = [
        { name: 'Attendance Management System', url: 'https://Eattendease.vercel.app' },
        { name: 'Tally DCPH', url: 'https://leap0920.github.io/Tally-DCPH' },
        { name: 'Wallet', url: 'https://nothingwallet.vercel.app' },
        { name: 'LECUISINE', url: 'https://leap0920.github.io/LECUISINE' },
        { name: 'LoopHabit', url: 'https://loop-habit-website.vercel.app' },
      ];
      return (
        <div key={index} className="my-2 text-xs space-y-1.5 font-mono">
          <div className="flex items-center gap-1.5 text-zinc-400 font-bold">
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>FEATURED PROJECTS:</span>
          </div>
          {projects.map((p) => (
            <div key={p.name} className="flex items-center justify-between text-zinc-300 py-0.5 border-b border-zinc-900 pl-5">
              <span>{p.name}</span>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>{p.url.replace('https://', '')}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          ))}
        </div>
      );
    }

    if (text === 'CMD_RESUME') {
      return (
        <div key={index} className="my-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>Resume download initiated (Carlo_Baclao_Resume.pdf)...</span>
        </div>
      );
    }

    if (text === 'CMD_CONTACT') {
      return (
        <div key={index} className="my-2 text-xs font-mono space-y-1 text-zinc-300">
          <div className="flex items-center gap-1.5 text-zinc-400 font-bold mb-1">
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>CONTACT DETAILS:</span>
          </div>
          <p className="pl-5 flex items-center gap-2">
            <Mail className="w-3 h-3 text-zinc-500 shrink-0" />
            <span className="text-zinc-400 w-16 inline-block">Email:</span>
            <a href="mailto:baclao.carlo.cometa@gmail.com" className="text-emerald-400 hover:underline">baclao.carlo.cometa@gmail.com</a>
          </p>
          <p className="pl-5 flex items-center gap-2">
            <Phone className="w-3 h-3 text-zinc-500 shrink-0" />
            <span className="text-zinc-400 w-16 inline-block">Phone:</span>
            <span>09686890263</span>
          </p>
          <p className="pl-5 flex items-center gap-2">
            <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
            <span className="text-zinc-400 w-16 inline-block">Location:</span>
            <span>Quezon City, Philippines</span>
          </p>
        </div>
      );
    }

    if (text === 'CMD_HIRE') {
      return (
        <div key={index} className="my-2 text-xs font-mono p-3 bg-zinc-900 border border-zinc-800 rounded space-y-1 text-zinc-200">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Award className="w-4 h-4" />
            <span>[SUCCESS] Offer Access Granted</span>
          </div>
          <p>You are viewing Carlo Baclao&apos;s recruitment profile. Ready for full-stack engineering roles.</p>
          <p className="text-zinc-400 pt-1">Contact: <a href="mailto:baclao.carlo.cometa@gmail.com" className="text-emerald-400 underline">baclao.carlo.cometa@gmail.com</a></p>
        </div>
      );
    }

    if (text.startsWith('zsh:')) {
      return (
        <p key={index} className="text-red-400 text-xs py-0.5 font-mono">
          {text}
        </p>
      );
    }

    return (
      <p key={index} className="text-zinc-300 text-xs py-0.5 leading-relaxed font-mono">
        {text}
      </p>
    );
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <motion.div
          className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeTerminal();
          }}
        >
          <motion.div className="absolute inset-0 bg-black/75" />

          <motion.div
            className="relative bg-zinc-950 rounded-xl border border-zinc-800 w-full max-w-[740px] h-[80vh] max-h-[640px] flex flex-col shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/90 select-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={closeTerminal}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
                  title="Close"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold">✕</span>
                </button>
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />

                <div className="ml-3 flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>carlo@portfolio:~ — zsh</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}
                  className="px-2 py-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors flex items-center gap-1"
                  title="Clear output"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
                <button
                  onClick={closeTerminal}
                  className="text-zinc-500 hover:text-zinc-200 p-1 hover:bg-zinc-800 rounded transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
              <span className="text-[11px] font-mono text-zinc-500 shrink-0 mr-1 hidden sm:inline">Quick:</span>
              {QUICK_COMMANDS.slice(0, 7).map((item) => (
                <button
                  key={item.cmd}
                  onClick={() => executeCommand(item.cmd)}
                  className="px-2 py-1 rounded bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5 whitespace-nowrap transition-colors"
                >
                  <item.icon className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{item.cmd}</span>
                </button>
              ))}
            </div>

            <div
              ref={outputRef}
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 font-mono text-xs min-h-0 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
            >
              {state.history.length === 0 && (
                <div className="space-y-4 mb-4">
                  <pre className="text-emerald-400 text-[8px] sm:text-[10px] leading-none font-mono font-bold select-none overflow-x-auto">
{`  ____    _    ____  _     ___    ____    _    ____ _     _    ___  
 / ___|  / \\  |  _ \\| |   / _ \\  | __ )  / \\  / ___| |   / \\  / _ \\ 
| |     / _ \\ | |_) | |  | | | | |  _ \\ / _ \\| |   | |  / _ \\| | | |
| |___ / ___ \\|  _ <| |__| |_| | | |_) / ___ \\ |___| |_/ ___ \\ |_| |
 \\____/_/   \\_\\_| \\_\\_____\\___/  |____/_/   \\_\\____|____/_/   \\_\\___/ `}
                  </pre>

                  <div className="p-3.5 bg-slate-900/60 border border-emerald-500/20 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>CARLO.OS Interactive Shell v2.4</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Quezon City, PH</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                      <div className="p-1.5 rounded bg-slate-800/40 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">User</span>
                        <span className="text-slate-200 font-semibold">Carlo Baclao</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-800/40 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Role</span>
                        <span className="text-slate-200 font-semibold">4th Yr BS IT</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-800/40 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Stack</span>
                        <span className="text-emerald-400 font-semibold">Full-Stack Dev</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-800/40 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Status</span>
                        <span className="text-emerald-400 font-semibold">Open for Work 🚀</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 pt-1">
                      Type <button onClick={() => executeCommand('/help')} className="text-emerald-400 underline hover:text-emerald-300 font-bold">/help</button> to view commands or click any button above. Use <kbd className="px-1 py-0.5 bg-slate-800 rounded text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-800 rounded text-[10px]">↓</kbd> for history and <kbd className="px-1 py-0.5 bg-slate-800 rounded text-[10px]">Tab</kbd> to autocomplete.
                    </p>
                  </div>
                </div>
              )}

              {/* History Items */}
              {state.history.map((entry, i) => (
                <div key={i} className="my-1">
                  {entry.type === 'input' ? (
                    <div className="flex items-center gap-2 text-xs font-mono py-1">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                        carlo@portfolio:~$
                      </span>
                      <span className="text-slate-100 font-bold">{entry.text}</span>
                    </div>
                  ) : (
                    renderOutputItem(entry.text, i)
                  )}
                </div>
              ))}

              {/* Typing Test Active */}
              {state.mode === 'typing-test' && state.typingTestState && !state.typingTestState.result && (() => {
                const tt = state.typingTestState!;
                return (
                  <div className="mt-3 mb-2 p-3 bg-slate-900/80 border border-emerald-500/30 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Keyboard className="w-3.5 h-3.5" /> Typing Speed Challenge
                      </span>
                      <span className="text-[10px] text-slate-400">Type exact sentence below</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-sm leading-relaxed tracking-wide">
                      {tt.sentence.split('').map((char, i) => {
                        const typedChar = tt.typedText[i];
                        if (i < tt.typedText.length) {
                          if (typedChar === char) {
                            return <span key={i} className="text-emerald-400 bg-emerald-500/10 rounded-sm">{char}</span>;
                          }
                          return <span key={i} className="text-red-400 bg-red-500/20 rounded-sm underline decoration-red-500">{typedChar}</span>;
                        }
                        if (i === tt.typedText.length) {
                          return <span key={i} className="text-slate-200 underline decoration-emerald-400 underline-offset-4 font-bold bg-slate-800">{char}</span>;
                        }
                        return <span key={i} className="text-slate-600">{char}</span>;
                      })}
                      <span className="inline-block w-[2px] h-[1.1em] bg-emerald-400 animate-pulse ml-[1px] align-text-bottom" />
                    </div>
                  </div>
                );
              })()}

              {/* Typing Test Result */}
              {state.mode === 'typing-test' && state.typingTestState?.result && (
                <div className="mt-3 mb-2 p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center space-y-2">
                  <p className="text-emerald-400 font-bold text-sm flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Challenge Completed!
                  </p>
                  <div className="flex justify-center gap-4 text-xs font-mono pt-1">
                    <span className="px-2.5 py-1 bg-slate-900 rounded border border-emerald-500/30 text-emerald-300">
                      WPM: <strong>{state.typingTestState!.result.wpm}</strong>
                    </span>
                    <span className="px-2.5 py-1 bg-slate-900 rounded border border-emerald-500/30 text-emerald-300">
                      Accuracy: <strong>{state.typingTestState!.result.accuracy}%</strong>
                    </span>
                    <span className="px-2.5 py-1 bg-slate-900 rounded border border-emerald-500/30 text-emerald-300">
                      Time: <strong>{state.typingTestState!.result.time}s</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Line */}
            <div className="flex items-center px-4 py-3 border-t border-slate-800/80 bg-slate-900/90">
              <span className="text-emerald-400 text-xs font-mono mr-2 shrink-0 select-none flex items-center gap-1 font-semibold">
                <span>carlo@portfolio:~$</span>
              </span>
              <input
                ref={inputRef}
                type="text"
                value={displayValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-slate-100 text-xs font-mono outline-none caret-emerald-400 placeholder:text-slate-600"
                placeholder={state.mode === 'typing-test' ? 'Start typing the sentence above...' : 'Type a command... (e.g. /help)'}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <button
                onClick={handleSubmit}
                className="ml-2 px-2.5 py-1 text-xs font-mono bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded transition-colors shrink-0"
              >
                Run
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

