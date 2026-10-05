/**
 * Theme constants + the pre-paint boot script.
 *
 * `THEME_SCRIPT` is injected into `<head>` as a blocking inline script
 * (see `src/app/layout.tsx`). It runs before the first paint, so the
 * correct theme class is on `<html>` by the time anything is drawn —
 * this is what removes the flash of the wrong theme. It is deliberately
 * dependency-free and wrapped in try/catch: if `localStorage` is
 * unavailable (private mode, blocked cookies) the page keeps the
 * server-rendered `dark` class instead of throwing.
 */

/** localStorage key. Namespaced so it cannot collide with other apps. */
export const THEME_STORAGE_KEY = 'cp-theme';

/** What the visitor chose. `system` defers to prefers-color-scheme. */
export type ThemeSetting = 'light' | 'dark' | 'system';

/** What is actually applied to the document. */
export type ResolvedTheme = 'light' | 'dark';

/** Applied on a first visit, before the visitor has expressed a choice. */
export const DEFAULT_THEME: ThemeSetting = 'system';

/** Fallback when `system` cannot be resolved (no matchMedia, SSR). */
export const FALLBACK_THEME: ResolvedTheme = 'dark';

export const THEMES: ThemeSetting[] = ['light', 'dark', 'system'];

/** The class names that live on `<html>`. */
export const DARK_CLASS = 'dark';
export const LIGHT_CLASS = 'light';

/**
 * Runs in `<head>` before paint. Resolves the theme from
 * localStorage → prefers-color-scheme → dark, then sets the class and
 * `color-scheme` on the document element.
 */
export const THEME_SCRIPT = `(function(){try{var d=document.documentElement;var s=localStorage.getItem('${THEME_STORAGE_KEY}');var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var t=(s==='light'||s==='dark')?s:(m?'dark':'light');if(t==='dark'){d.classList.add('dark');d.classList.remove('light')}else{d.classList.add('light');d.classList.remove('dark')}d.style.colorScheme=t}catch(e){}})();`;
