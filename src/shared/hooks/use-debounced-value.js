import { useEffect, useState } from 'react';

const DEFAULT_DELAY_MS = 500;

/** Returns `value` only after it stopped changing for `delayMs` (used for search boxes). */
export function useDebouncedValue(value, delayMs = DEFAULT_DELAY_MS) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
