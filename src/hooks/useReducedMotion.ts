'use client';

import { useSyncExternalStore } from 'react';

const matchMediaStore = {
  subscribe: (callback: () => void) => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  },
  getSnapshot: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  getServerSnapshot: () => false,
};

export function useReducedMotion(): boolean {
  return useSyncExternalStore(matchMediaStore.subscribe, matchMediaStore.getSnapshot, matchMediaStore.getServerSnapshot);
}
