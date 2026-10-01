import { useCallback, useMemo, useState } from 'react';

/** Multi-row selection state for tables. Ids are whatever the table uses as row id. */
export function useRowSelection() {
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const toggle = useCallback((id) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleMany = useCallback((ids, checked) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelectedIds((previous) => (previous.size ? new Set() : previous));
  }, []);

  const selectedArray = useMemo(() => Array.from(selectedIds), [selectedIds]);

  return { selectedIds, selectedArray, selectedCount: selectedIds.size, toggle, toggleMany, clear };
}
