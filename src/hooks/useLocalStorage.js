import { useEffect, useState } from 'react';

/** Like useState, but the value is saved to localStorage and restored on reload. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue; // private mode or corrupted JSON: start fresh
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked: the app still works, it just won't persist.
    }
  }, [key, value]);

  return [value, setValue];
}
