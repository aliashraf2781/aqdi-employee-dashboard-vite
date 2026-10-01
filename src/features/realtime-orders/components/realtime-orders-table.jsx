import { ControllableTable } from '@/shared/components/controllable-table';
import { isDraftOrderRow } from '@/features/orders';

const DEFAULT_SORT = { id: 'receivedSince', direction: 'asc' };

export function RealtimeOrdersTable({ columns, page }) {
  return (
    <ControllableTable
      columns={columns}
      rows={page.rows}
      isLoading={page.isLoading}
      density={page.tablePreferences.density}
      isColumnVisible={page.tablePreferences.isColumnVisible}
      emptyMessage="لا نتائج مطابقة — عدّل البحث أو الفلاتر"
      onRowClick={page.openOrder}
      getRowHighlight={isDraftOrderRow}
      defaultSort={DEFAULT_SORT}
    />
  );
}
