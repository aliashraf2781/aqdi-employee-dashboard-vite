import { DataTable } from '@/shared/components/data-table';
import { ColorChip } from '@/features/marketing/components/shared/chips';
import { formatInt } from '@/features/marketing/lib/format';

const COLUMNS = [
  { key: 'campaign', header: 'الحملة', cell: (row) => <b>{row.campaign}</b> },
  { key: 'source', header: 'المصدر', cell: (row) => <ColorChip label={row.label_ar} color={row.color} /> },
  { key: 'orders', header: 'الطلبات', cell: (row) => formatInt(row.orders) },
];

export function TopCampaignsTable({ rows }) {
  return (
    <DataTable
      columns={COLUMNS}
      rows={rows}
      getRowKey={(row) => `${row.campaign}-${row.label_ar}`}
      emptyMessage="لا توجد حملات موسومة بطلبات لهذه الفترة."
    />
  );
}
