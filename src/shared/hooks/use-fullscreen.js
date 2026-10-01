import { useCallback, useEffect, useRef, useState } from 'react';

const isBrowserFullscreen = () => Boolean(document.fullscreenElement);

/**
 * Lets an element switch the browser to fullscreen and back.
 * Attach `ref` to the element; `isFullscreen` follows the browser (Esc included).
 */
export function useFullscreen() {
  const ref = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const syncState = () => setIsFullscreen(isBrowserFullscreen());
    document.addEventListener('fullscreenchange', syncState);
    return () => document.removeEventListener('fullscreenchange', syncState);
  }, []);

  const exit = useCallback(async () => {
    if (isBrowserFullscreen()) await document.exitFullscreen().catch(() => {});
  }, []);

  const toggle = useCallback(async () => {
    if (isBrowserFullscreen()) await exit();
    else await ref.current?.requestFullscreen?.().catch(() => {});
  }, [exit]);

  // Leaving the page (or unmounting the dialog) must not leave the browser in fullscreen.
  useEffect(() => exit, [exit]);

  return { ref, isFullscreen, toggle, exit };
}
