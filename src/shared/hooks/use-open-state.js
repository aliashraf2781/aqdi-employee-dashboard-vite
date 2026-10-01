import { useCallback, useMemo, useState } from 'react';

/** Open/closed state of a dialog: `{ open, setOpen, show, hide }`, ready to spread into `open`/`onOpenChange`. */
export function useOpenState(initial = false) {
  const [open, setOpen] = useState(initial);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  return useMemo(() => ({ open, setOpen, show, hide }), [open, show, hide]);
}
