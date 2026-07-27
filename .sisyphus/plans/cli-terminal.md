# CLI Terminal Feature — Portfolio Enhancement

## TL;DR
> Add an interactive CLI terminal to Carlo Baclao's portfolio with a floating trigger button, command palette, typing test, and Matrix code-rain background toggle.

## Context
Carlo's portfolio (`CarloBaclao-Portfolio`) is a Next.js 16 + React 19 + TypeScript + Tailwind CSS app with Framer Motion animations. A new `Test` branch has been created for this work. All existing state is managed via React Context (`NavigationContext`, `ThemeContext`). The plan specifies 8 feature groups organized into 4 phases.

## Objective
Build an interactive terminal/CLI modal with:
1. Floating trigger button (bottom-right) + Ctrl+K/Cmd+K binding
2. Modal shell styled as a real terminal with prompt, history, input
3. Static command implementations (help, about, skills, projects, resume, contact, sudo hire carlo, matrix, play typing, clear, exit)
4. Typing speed test mode integrated into terminal
5. Matrix/code-rain background toggle
6. Proper styling (navy theme, monospace, semantic coloring)
7. Mobile responsiveness

## Phased Implementation

### Phase 1: Context + Trigger Button + Modal Shell

**Files to create:**
- `src/contexts/TerminalContext.tsx` — Terminal state provider (isOpen, mode, history, inputValue, matrixActive, typingTestState, dispatch)
- `src/components/Terminal.tsx` — Floating trigger button (position: fixed bottom-right, z-index above Connect section)
- `src/components/TerminalModal.tsx` — Center-screen terminal overlay with modal backdrop, title bar, scrollable output, prompt input line

**Files to modify:**
- `src/contexts/index.ts` — Export TerminalProvider
- `src/app/layout.tsx` — Wrap children with TerminalProvider alongside NavigationProvider and ThemeProvider

### Phase 2: Command Parser + Static Commands

**Files to create:**
- `src/data/terminalCommands.ts` — Single `commands` object/map with all v1 commands (help, about, skills, projects, resume, contact, sudo hire carlo, clear, exit, matrix, play typing)

**Files to modify:**
- `src/components/TerminalModal.tsx` — Wire up command parser, render output history

### Phase 3: Typing Test + Matrix Toggle

**Phase 3 is pre-scoped from previous conversation — no new design needed.**
- `play typing` → switches mode to typing-test, renders sentence, char-by-char highlighting, WPM/accuracy/time results, returns to prompt
- `matrix` → toggles code-rain background effect on/off (use existing ParticleBackground or lightweight canvas alternative)

### Phase 4: Styling + Keyboard Bindings + Polish

**Files to modify:**
- Terminal visual styling (navy #0f172a palette, JetBrains Mono, semantic color classes)
- Ctrl+K/Cmd+K global keyboard binding
- Pulse animation on trigger button (first load only)
- Command history recall via ↑/↓ arrows
- Mobile responsive adjustments

## Verification Strategy
- `npm run build` must pass with zero TypeScript errors or warnings
- Terminal trigger button appears in bottom-right corner
- Ctrl+K opens terminal modal
- All v1 commands produce expected output
- Typing test mode renders sentence, accepts input, shows WPM/accuracy results
- Matrix toggle shows/hides code-rain effect

## TODOs

- Phase 1 TODOs
- Phase 2 TODOs
- Phase 3 TODOs
- Phase 4 TODOs

## Final Verification Wave
- [ ] V1. Build Pass — `npm run build` zero errors
- [ ] V2. Terminal Opens — modal displays on button click + Ctrl+K
- [ ] V3. Commands Work — all v1 static commands produce correct output
- [ ] V4. Typing Test — mode switches, renders, WPM shown, returns to prompt
- [ ] V5. Matrix Toggle — code-rain visibility toggles
- [ ] V6. Keyboard — Ctrl+K/Cmd+K binding, ↑/↓ history, Esc closes
- [ ] V7. Mobile — trigger button visible, modal scrollable, no overlap
- [ ] V8. No regressions — existing portfolio features unaffected
