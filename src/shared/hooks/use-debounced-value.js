import { useEffect, useState } from 'react';

const DEFAULT_DELAY_MS = 500;

/** Returns `value` only after it stopped changing for `delay` ms (search boxes). */
export function useDebouncedValue(value, delay = DEFAULT_DELAY_MS) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
