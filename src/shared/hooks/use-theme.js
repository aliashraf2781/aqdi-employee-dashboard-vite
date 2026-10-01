import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'aqdi-theme';
const listeners = new Set();

const readIsDark = () => document.documentElement.classList.contains('dark');

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  listeners.forEach((listener) => listener());
}

/** Call once at startup to restore the saved theme. */
export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  document.documentElement.classList.toggle('dark', saved === 'dark');
}

export function useTheme() {
  const isDark = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    readIsDark,
  );
  const toggleTheme = useCallback(() => applyTheme(!readIsDark()), []);
  return { isDark, toggleTheme };
}
