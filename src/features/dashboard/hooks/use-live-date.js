import { useEffect, useState } from 'react';

// The UI shows minute-precision time, so a 30s tick is plenty.
const DEFAULT_TICK_MS = 30_000;

/** Current date that refreshes on an interval; keep it in small components so only they re-render. */
export function useLiveDate(intervalMs = DEFAULT_TICK_MS) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
