'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal } from '@/contexts/TerminalContext';
import { 
  Terminal, 
  Sparkles, 
  HelpCircle, 
  User, 
  Code2, 
  FolderGit2, 
  FileText, 
  Mail, 
  Award, 
  Eye, 
  Keyboard, 
  Trash2, 
  X, 
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const AVAILABLE_COMMANDS = [
  { cmd: '/help', desc: 'Show all available commands', icon: HelpCircle },
  { cmd: '/about', desc: 'Display developer profile info', icon: User },
  { cmd: '/skills', desc: 'List technical skills & stack', icon: Code2 },
  { cmd: '/projects', desc: 'View featured projects', icon: FolderGit2 },
  { cmd: '/resume', desc: 'Download PDF resume', icon: FileText },
  { cmd: '/contact', desc: 'Get contact info & email', icon: Mail },
  { cmd: '/sudo hire carlo', desc: 'Unlock instant recruitment access', icon: Award },
  { cmd: '/matrix', desc: 'Toggle digital code rain effect', icon: Eye },
  { cmd: '/play typing', desc: 'Start speed typing test game', icon: Keyboard },
  { cmd: '/clear', desc: 'Clear terminal screen', icon: Trash2 },
  { cmd: '/exit', desc: 'Close terminal window', icon: X },
];

export function TerminalModal() {
  const { state, dispatch, closeTerminal } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  
  // History navigation (Arrow Up / Arrow Down)
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  // Auto-focus input when opened
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
        payload: {
          type: 'output',
          text: 'CMD_HELP',
        },
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
        payload: { type: 'output', text: state.matrixActive ? '⚡ Matrix rain mode disabled.' : '❇️ Matrix rain mode activated!' },
      });
    } else if (cmd === 'play typing') {
      const sentences = [
        "The quick brown fox jumps over the lazy dog.",
        "To be or not to be that is the question.",
        "All that glitters is not gold.",
        "Four score and seven years ago.",
        "It was the best of times it was the worst of times.",
      ];
      const sentence = sentences[Math.floor(Math.random() * sentences.length)];
      dispatch({ type: 'SET_MODE', payload: 'typing-test' });
      dispatch({ type: 'SET_TYPING_TEST', payload: { sentence, typedText: '', startTime: Date.now(), result: null }});
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: '🎮 Typing speed test started! Type the sentence displayed below.' },
      });
    } else if (cmd === 'clear') {
      dispatch({ type: 'CLEAR_HISTORY' });
    } else if (cmd === 'exit' || cmd === 'esc') {
      closeTerminal();
    } else {
      dispatch({
        type: 'ADD_HISTORY',
        payload: { type: 'output', text: `ERROR: command not found: "${raw}". Type /help for available commands.` },
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
        dispatch({ type: 'SET_TYPING_TEST', payload: { sentence, typedText: typedText.slice(0, -1), startTime: state.typingTestState.startTime, result: null }});
      } else if (e.key === 'Enter') {
        if (typedText === sentence && typedText.length > 0) {
          const elapsed = (Date.now() - state.typingTestState.startTime) / 1000;
          const minutes = elapsed / 60;
          const wpm = Math.round((typedText.length / 5) / Math.max(minutes, 0.01));
          const correct = typedText.split('').filter((c, i) => c === sentence[i]).length;
          const accuracy = Math.round((correct / typedText.length) * 100);
          dispatch({ type: 'SET_TYPING_TEST', payload: { sentence, typedText, startTime: state.typingTestState.startTime, result: { wpm, accuracy, time: Math.round(elapsed) }}});
          dispatch({ type: 'ADD_HISTORY', payload: { type: 'output', text: `✅ Completed! WPM: ${wpm} | Accuracy: ${accuracy}% | Time: ${Math.round(elapsed)}s` }});
          setTimeout(() => dispatch({ type: 'SET_MODE', payload: 'prompt' }), 3000);
        }
      } else if (e.key.length === 1) {
        e.preventDefault();
        dispatch({ type: 'SET_TYPING_TEST', payload: { sentence, typedText: typedText + e.key, startTime: state.typingTestState.startTime, result: null }});
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

      // History navigation (Up arrow / Down arrow)
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

      // Tab autocomplete
      if (e.key === 'Tab') {
        e.preventDefault();
        const current = state.inputValue.trim();
        if (!current) return;
        const matches = AVAILABLE_COMMANDS.filter((c) => c.cmd.startsWith(current) || c.cmd.slice(1).startsWith(current));
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

  // Render styled output content for standard commands
  const renderOutputItem = (text: string, index: number) => {
    if (text === 'CMD_HELP') {
      return (
        <div key={index} className="my-2 p-3 bg-slate-900/60 border border-emerald-500/20 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider border-b border-slate-800 pb-1.5">
            <HelpCircle className="w-4 h-4" /> Available Commands Catalog
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {AVAILABLE_COMMANDS.map((item) => (
              <button
                key={item.cmd}
                onClick={() => executeCommand(item.cmd)}
                className="flex items-center justify-between gap-2 p-2 rounded bg-slate-800/40 hover:bg-emerald-500/15 border border-slate-800 hover:border-emerald-500/30 text-left transition-all group"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="font-mono text-emerald-300 font-medium text-[11px]">{item.cmd}</span>
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-200 truncate">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (text === 'CMD_ABOUT') {
      return (
        <div key={index} className="my-2 p-3.5 bg-slate-900/60 border border-blue-500/20 rounded-lg space-y-2 text-xs">
          <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1.5">
            <User className="w-4 h-4" /> Developer Profile
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start pt-1">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shrink-0">
              CB
            </div>
            <div className="space-y-1 text-slate-300 leading-relaxed">
              <p className="font-semibold text-sm text-slate-100">Carlo C. Baclao</p>
              <p className="text-emerald-400 text-[11px]">4th Year BS IT Student — Quezon City University</p>
              <p className="text-slate-400 text-xs pt-1">
                Passionate full-stack developer with 5+ years of hands-on coding experience building scalable web apps, intuitive UI design systems, and backend RESTful architectures.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (text === 'CMD_SKILLS') {
      return (
        <div key={index} className="my-2 p-3.5 bg-slate-900/60 border border-teal-500/20 rounded-lg space-y-3 text-xs">
          <div className="flex items-center gap-2 text-teal-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1.5">
            <Code2 className="w-4 h-4" /> Tech Stack & Capabilities
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Languages</p>
              <div className="flex flex-wrap gap-1.5">
                {['JavaScript', 'TypeScript', 'Java', 'Python', 'C++', 'SQL', 'Dart'].map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Frameworks & Frontend</p>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'Next.js', 'Spring Boot', 'Flutter', 'Tailwind CSS', 'Framer Motion'].map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tools & Databases</p>
              <div className="flex flex-wrap gap-1.5">
                {['PostgreSQL', 'Git', 'Docker', 'Flyway', 'Raspberry Pi', 'Linux'].map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (text === 'CMD_PROJECTS') {
      const projects = [
        { name: 'Attendance Management System', url: 'https://Eattendease.vercel.app', tag: 'Full-stack' },
        { name: 'Tally DCPH', url: 'https://leap0920.github.io/Tally-DCPH', tag: 'Web App' },
        { name: 'Wallet', url: 'https://nothingwallet.vercel.app', tag: 'FinTech UI' },
        { name: 'LECUISINE', url: 'https://leap0920.github.io/LECUISINE', tag: 'Culinary Web' },
        { name: 'LoopHabit', url: 'https://loop-habit-website.vercel.app', tag: 'Productivity' },
      ];
      return (
        <div key={index} className="my-2 p-3.5 bg-slate-900/60 border border-purple-500/20 rounded-lg space-y-2 text-xs">
          <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1.5">
            <FolderGit2 className="w-4 h-4" /> Featured Projects
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {projects.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded bg-slate-800/40 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-semibold text-slate-200 group-hover:text-purple-300 text-xs">{p.name}</p>
                  <span className="text-[10px] text-purple-400 font-mono">{p.tag}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      );
    }

    if (text === 'CMD_RESUME') {
      return (
        <div key={index} className="my-2 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Downloading <strong>Carlo_Baclao_Resume.pdf</strong>...</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40 font-mono">PDF</span>
        </div>
      );
    }

    if (text === 'CMD_CONTACT') {
      return (
        <div key={index} className="my-2 p-3.5 bg-slate-900/60 border border-amber-500/20 rounded-lg space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1.5">
            <Mail className="w-4 h-4" /> Direct Contact Info
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
            <a href="mailto:baclao.carlo.cometa@gmail.com" className="p-2 rounded bg-slate-800/40 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">baclao.carlo.cometa@gmail.com</span>
            </a>
            <div className="p-2 rounded bg-slate-800/40 border border-slate-800 text-slate-300 flex items-center gap-2">
              <span className="text-amber-400 font-bold text-xs shrink-0">📞</span>
              <span>09686890263</span>
            </div>
            <div className="p-2 rounded bg-slate-800/40 border border-slate-800 text-slate-300 flex items-center gap-2">
              <span className="text-amber-400 font-bold text-xs shrink-0">📍</span>
              <span>Quezon City, PH</span>
            </div>
          </div>
        </div>
      );
    }

    if (text === 'CMD_HIRE') {
      return (
        <div key={index} className="my-2 p-4 bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-slate-900 border border-emerald-400/40 rounded-xl shadow-lg shadow-emerald-950/40 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400 animate-bounce" />
            <span>Access Granted — Offer Confirmation</span>
          </div>
          <p className="text-xs text-emerald-200 leading-relaxed">
            🚀 You just recruited one of the top software engineering candidates at Quezon City University! Passionate, high-performing, and ready to contribute from day one.
          </p>
          <div className="pt-1 flex gap-2">
            <a href="mailto:baclao.carlo.cometa@gmail.com?subject=Job%20Offer%20-%20Carlo%20Baclao" className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors shadow">
              Send Official Email Offer ✉️
            </a>
          </div>
        </div>
      );
    }

    if (text.startsWith('ERROR:')) {
      return (
        <p key={index} className="text-red-400 text-xs py-0.5 flex items-center gap-1.5">
          <span className="text-red-500 font-bold">✕</span>
          {text.replace('ERROR: ', '')}
        </p>
      );
    }

    if (text.startsWith('✅')) {
      return (
        <p key={index} className="text-emerald-300 font-semibold text-xs py-0.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          {text.replace('✅ ', '')}
        </p>
      );
    }

    return (
      <p key={index} className="text-slate-300 text-xs py-0.5 leading-relaxed font-mono">
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
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeTerminal();
          }}
        >
          {/* Backdrop Blur */}
          <motion.div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

          {/* Terminal Window */}
          <motion.div
            className="relative bg-slate-950/95 rounded-2xl border border-slate-800/80 w-full max-w-[760px] h-[85vh] max-h-[680px] flex flex-col shadow-[0_0_50px_-10px_rgba(16,185,129,0.15)] overflow-hidden terminal-scanlines backdrop-blur-2xl"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/80 select-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={closeTerminal}
                  className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center group"
                  title="Close Terminal"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[9px] text-slate-950 font-bold leading-none">✕</span>
                </button>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
                
                <div className="ml-3 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>carlo@portfolio:~ (zsh)</span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}
                  className="px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded transition-colors flex items-center gap-1"
                  title="Clear Screen"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
                <button
                  onClick={closeTerminal}
                  className="text-slate-500 hover:text-slate-200 p-1 hover:bg-slate-800/60 rounded transition-colors"
                  aria-label="Close terminal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Command Bar */}
            <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
              <span className="text-[11px] font-mono text-slate-500 shrink-0 mr-1 hidden sm:inline">Quick:</span>
              {['/help', '/about', '/skills', '/projects', '/contact', '/sudo hire carlo'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => executeCommand(cmd)}
                  className="px-2 py-0.5 rounded-md bg-slate-800/50 hover:bg-emerald-500/20 border border-slate-700/50 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-[11px] font-mono whitespace-nowrap transition-all"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Output Area */}
            <div
              ref={outputRef}
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 font-mono min-h-0 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
            >
              {/* Default Welcome Banner */}
              {state.history.length === 0 && (
                <div className="space-y-4 mb-4">
                  {/* ASCII Header */}
                  <pre className="text-emerald-400 text-[10px] sm:text-[11px] leading-none font-mono font-bold select-none overflow-x-auto">
{`  ____    _    ____  _     ___    ____  ____
 / ___|  / \\  |  _ \\| |   / _ \\  / ___||  _ \\
| |     / _ \\ | |_) | |  | | | | \\___ \\| |_) |
| |___ / ___ \\|  _ <| |__| |_| |  ___) |  __/
 \\____/_/   \\_\\_| \\_\\_____\\___/  |____/|_|`}
                  </pre>

                  {/* System Specs Card */}
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

