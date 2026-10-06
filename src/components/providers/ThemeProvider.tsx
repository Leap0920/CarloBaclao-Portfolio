'use client';

/**
 * ThemeProvider — a self-contained, dependency-free theme context.
 *
 * It mirrors the public shape of `next-themes`' provider and hook, so the
 * rest of the app only ever talks to `useTheme()`:
 *
 *     const { theme, setTheme, resolvedTheme } = useTheme();
 *
 * `next-themes` is installed but deliberately not adopted — this tree keeps its
 * own provider — so the equivalent is implemented here. The part that actually
 * prevents a flash of the wrong
 * theme is NOT this component — it is `THEME_SCRIPT`, the blocking inline
 * script injected into `<head>` by `src/app/layout.tsx`. This provider
 * only keeps React state in sync with what that script already did, and
 * writes the visitor's choice back to localStorage.
 *
 * Dark is the default: the server renders `<html class="dark">` and
 * `:root` in globals.css carries the dark values, so dark applies with no
 * class and with JavaScript disabled.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DARK_CLASS,
  DEFAULT_THEME,
  FALLBACK_THEME,
  LIGHT_CLASS,
  THEME_STORAGE_KEY,
  THEMES,
  type ResolvedTheme,
  type ThemeSetting,
} from '@/lib/theme';

interface ThemeContextValue {
  /** The stored setting: 'light' | 'dark' | 'system'. */
  theme: ThemeSetting;
  /** Set and persist the theme. */
  setTheme: (theme: ThemeSetting) => void;
  /** The theme actually applied to the document. */
  resolvedTheme: ResolvedTheme;
  /** The OS preference, live. */
  systemTheme: ResolvedTheme;
  /** Every valid value for `theme`. */
  themes: ThemeSetting[];
  /** True once the client has hydrated — use to avoid icon flicker. */
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DARK_QUERY = '(prefers-color-scheme: dark)';

function readSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return FALLBACK_THEME;
  }
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

function readStoredTheme(): ThemeSetting {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    /* localStorage blocked — fall through to the default. */
  }
  return DEFAULT_THEME;
}

function resolve(setting: ThemeSetting): ResolvedTheme {
  return setting === 'system' ? readSystemTheme() : setting;
}

/** Writes the resolved theme to <html>. Mirrors THEME_SCRIPT's output. */
function applyTheme(next: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle(DARK_CLASS, next === 'dark');
  root.classList.toggle(LIGHT_CLASS, next === 'light');
  root.style.colorScheme = next;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initial state must match the server render (dark) to keep hydration
  // clean; the effect below adopts whatever THEME_SCRIPT already applied.
  const [theme, setThemeState] = useState<ThemeSetting>(DEFAULT_THEME);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(FALLBACK_THEME);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(FALLBACK_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readStoredTheme();
    const system = readSystemTheme();
    const next = resolve(stored);

    setThemeState(stored);
    setSystemTheme(system);
    setResolvedTheme(next);
    setMounted(true);
    // Re-assert in case the inline script was skipped (e.g. no <head>).
    applyTheme(next);

    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => {
      const current = readSystemTheme();
      setSystemTheme(current);
      if (readStoredTheme() === 'system') {
        setResolvedTheme(current);
        applyTheme(current);
      }
    };

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const setTheme = useCallback((next: ThemeSetting) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* Persisting is best-effort; the switch still happens this session. */
    }
    const applied = resolve(next);
    setThemeState(next);
    setResolvedTheme(applied);
    applyTheme(applied);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, resolvedTheme, systemTheme, themes: THEMES, mounted }),
    [theme, setTheme, resolvedTheme, systemTheme, mounted],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Read and change the theme. Throws if used outside `<ThemeProvider>` so a
 * missing provider fails loudly instead of silently rendering the wrong
 * icons.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>.');
  }
  return context;
}
