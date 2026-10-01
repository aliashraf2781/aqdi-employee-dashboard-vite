import { Checkbox } from '@/shared/components/ui/checkbox';

/**
 * Builds the leading checkbox column of a ControllableTable.
 * Selection state lives in the page (see useRowSelection).
 */
export function makeSelectionColumn({ rows, selectedIds, onToggleRow, onToggleAll, getRowId = (row) => row?.id }) {
  const rowIds = rows.map(getRowId).filter((id) => id != null);
  const selectedCount = rowIds.filter((id) => selectedIds.has(id)).length;
  const allSelected = rowIds.length > 0 && selectedCount === rowIds.length;
  const headerState = allSelected ? true : selectedCount > 0 ? 'indeterminate' : false;

  return {
    id: '__select',
    label: '',
    hideable: false,
    sticky: 'start',
    stopRowClick: true,
    headerClassName: 'w-10',
    header: () => (
      <Checkbox
        checked={headerState}
        disabled={rowIds.length === 0}
        onCheckedChange={(value) => onToggleAll(rowIds, value === true)}
        aria-label="تحديد كل الطلبات"
      />
    ),
    cell: (row) => (
      <Checkbox
        checked={selectedIds.has(getRowId(row))}
        onCheckedChange={() => onToggleRow(getRowId(row))}
        aria-label="تحديد الطلب"
      />
    ),
  };
}
