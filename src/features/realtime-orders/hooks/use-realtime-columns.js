import { useMemo } from 'react';
import { makeSelectionColumn } from '@/shared/components/controllable-table/selection-column';
import { buildRealtimeColumns } from '../components/realtime-columns';

/** Columns of the realtime table, including the selection checkbox column. */
export function useRealtimeColumns(page) {
  const { rows, selection, permissions, statusFlow, changeableStatuses, openOrder } = page;

  return useMemo(
    () => [
      makeSelectionColumn({
        rows,
        selectedIds: selection.selectedIds,
        onToggleRow: selection.toggle,
        onToggleAll: selection.toggleMany,
      }),
      ...buildRealtimeColumns({
        onView: openOrder,
        statusChange: {
          enabled: permissions.canChangeStatus,
          statuses: changeableStatuses,
          pendingOrderId: statusFlow.changingOrderId,
          onChange: statusFlow.requestStatusChange,
        },
      }),
    ],
    [rows, selection.selectedIds, selection.toggle, selection.toggleMany, permissions.canChangeStatus, changeableStatuses, statusFlow, openOrder],
  );
}
