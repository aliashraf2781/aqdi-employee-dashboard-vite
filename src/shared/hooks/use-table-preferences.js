import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_TABLE_DENSITY } from '@/shared/components/controllable-table/density';

function readStoredPreferences(storageKey, fallback) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Remembers column visibility and density of a table in localStorage.
 * Every column is visible unless the user hid it (`hideable: false` columns are always visible).
 */
export function useTablePreferences({ storageKey }) {
  const [preferences, setPreferences] = useState(() =>
    readStoredPreferences(storageKey, { density: DEFAULT_TABLE_DENSITY, hiddenColumns: {} }),
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(preferences));
    } catch {
      // storage can be full or blocked: preferences then simply last for this visit
    }
  }, [storageKey, preferences]);

  const setDensity = useCallback((density) => setPreferences((previous) => ({ ...previous, density })), []);

  const toggleColumn = useCallback(
    (columnId) =>
      setPreferences((previous) => ({
        ...previous,
        hiddenColumns: { ...previous.hiddenColumns, [columnId]: !previous.hiddenColumns[columnId] },
      })),
    [],
  );

  const isColumnVisible = useCallback(
    (column) => column.hideable === false || !preferences.hiddenColumns[column.id],
    [preferences.hiddenColumns],
  );

  return { density: preferences.density, setDensity, toggleColumn, isColumnVisible };
}
