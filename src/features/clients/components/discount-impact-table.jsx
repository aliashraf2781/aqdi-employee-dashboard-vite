import { Badge } from '@/shared/components/badge';
import { DataTable } from '@/shared/components/data-table';
import { formatMoney } from '@/features/clients/lib/client-details-format';

const COLUMNS = [
  { key: 'label', header: 'المسار', cell: (row) => <span className="font-bold">{row.label}</span> },
  { key: 'baseFee', header: 'رسوم السنة الأولى', cell: (row) => formatMoney(row.baseFee) },
  { key: 'amountAfter', header: 'يدفع بعد', cell: (row) => <span className="font-bold">{formatMoney(row.amountAfter)}</span> },
  {
    key: 'discount',
    header: 'الخصم',
    cell: (row) => <span className="font-bold text-destructive">{row.discount > 0 ? `-${formatMoney(row.discount)}` : '0'}</span>,
  },
  { key: 'margin', header: 'هامش عقدي', cell: (row) => formatMoney(row.margin) },
  {
    key: 'check',
    header: 'الفحص',
    cell: (row) => <Badge tone={row.isProfitable ? 'success' : 'danger'}>{row.isProfitable ? 'ربح' : 'خسارة'}</Badge>,
  },
];

/** Illustrative first-year fee preview, one row per contract track. */
export function DiscountImpactTable({ rows }) {
  return <DataTable columns={COLUMNS} rows={rows} getRowKey={(row) => row.key} />;
}
