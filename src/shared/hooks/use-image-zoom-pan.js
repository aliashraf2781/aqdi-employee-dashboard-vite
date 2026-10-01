import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.2;
const ORIGIN = { x: 0, y: 0 };

const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

/**
 * Zoom (buttons and mouse wheel) and drag-to-pan for an image inside a container.
 * Attach `attachContainer` (a ref callback) and `handleMouseDown` to the container and apply `scale`/`position`
 * to the image wrapper. The transform resets when `resetKey` changes (e.g. another file is shown).
 */
export function useImageZoomPan({ enabled = true, resetKey } = {}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(ORIGIN);
  const [isDragging, setIsDragging] = useState(false);
  const [container, setContainer] = useState(null);
  const dragStart = useRef({ pointerX: 0, pointerY: 0, originX: 0, originY: 0 });
  const latest = useRef({ scale: 1, position: ORIGIN });

  useEffect(() => {
    latest.current = { scale, position };
  }, [scale, position]);

  const resetTransform = useCallback(() => {
    setScale(1);
    setPosition(ORIGIN);
  }, []);

  const [previousResetKey, setPreviousResetKey] = useState(resetKey);
  if (resetKey !== previousResetKey) {
    setPreviousResetKey(resetKey);
    resetTransform();
  }

  // Wheel zoom keeps the point under the cursor in place. It must be a non-passive native
  // listener because React attaches wheel handlers as passive and could not stop page scroll.
  useEffect(() => {
    if (!enabled || !container) return undefined;

    const onWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const { scale: current, position: currentPosition } = latest.current;
      const next = clampZoom(current + (event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP));
      if (next === current) return;

      const rect = container.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      const ratio = next / current;

      setPosition({ x: currentPosition.x - offsetX * (ratio - 1), y: currentPosition.y - offsetY * (ratio - 1) });
      setScale(next);
    };

    container.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => container.removeEventListener('wheel', onWheel, { capture: true });
  }, [enabled, container]);

  useEffect(() => {
    if (!isDragging) return undefined;

    const onMove = (event) => {
      const { pointerX, pointerY, originX, originY } = dragStart.current;
      setPosition({ x: originX + event.clientX - pointerX, y: originY + event.clientY - pointerY });
    };
    const onUp = () => setIsDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  const handleMouseDown = useCallback(
    (event) => {
      if (!enabled || event.button !== 0) return;
      const { position: current } = latest.current;
      dragStart.current = { pointerX: event.clientX, pointerY: event.clientY, originX: current.x, originY: current.y };
      setIsDragging(true);
    },
    [enabled],
  );

  const zoomIn = useCallback(() => setScale((value) => clampZoom(value + ZOOM_STEP)), []);
  const zoomOut = useCallback(() => setScale((value) => clampZoom(value - ZOOM_STEP)), []);

  let cursorClass = '';
  if (enabled) cursorClass = isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default';

  return { scale, position, isDragging, attachContainer: setContainer, resetTransform, handleMouseDown, zoomIn, zoomOut, cursorClass };
}
