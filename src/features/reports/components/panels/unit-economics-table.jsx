import { DataTable } from '@/shared/components/data-table';
import { formatMoney, formatNumber, pick } from '../../lib/report-format';
import { EmptyNote } from '../empty-note';

const DEFAULT_NOTE = '⚠ هامش السنة الإضافية للسكني منخفض (~14%) — يستحق مراجعة التسعير';

const numberCell =
  (...keys) =>
  (row) =>
    formatNumber(pick(row, ...keys));

const PATH_COLUMNS = [
  {
    key: 'label',
    header: 'المسار',
    cell: (row) => <span className="font-semibold">{pick(row, 'label', 'path', 'service', 'name')}</span>,
  },
  { key: 'pay', header: 'يدفع العميل', cell: numberCell('customer_pays', 'pay', 'client_pays') },
  { key: 'ejar', header: 'إيجار', cell: numberCell('ejar', 'ejar_fee', 'ejar_cost') },
  { key: 'moyasar', header: 'موياسر', cell: numberCell('moyasar', 'gateway_fee', 'moyasar_fee') },
  { key: 'margin', header: 'الهامش', cell: (row) => <b>{formatNumber(pick(row, 'margin', 'value'))}</b> },
  { key: 'percent', header: '%', cell: (row) => `${pick(row, 'margin_percent', 'percent', 'pct') ?? 0}%` },
];

const SERVICE_COLUMNS = [
  { key: 'label', header: 'الخدمة', cell: (row) => <span className="font-semibold">{row.label ?? row.service}</span> },
  { key: 'qty', header: 'الكمية', cell: (row) => row.qty },
  { key: 'value', header: 'القيمة', cell: (row) => formatMoney(row.value) },
  { key: 'percent', header: 'النسبة', cell: (row) => `${row.percent ?? row.pct ?? 0}%` },
];

const PATH_FIELDS = ['customer_pays', 'pay', 'ejar', 'moyasar', 'gateway_fee'];

/** The API sends either a per-path cost breakdown or a simple per-service list. */
export function UnitEconomicsTable({ rows, note }) {
  if (!rows.length) return <EmptyNote />;
  const isPathBreakdown = rows.some((row) => PATH_FIELDS.some((field) => row[field] != null));

  return (
    <>
      <DataTable
        columns={isPathBreakdown ? PATH_COLUMNS : SERVICE_COLUMNS}
        rows={rows}
        getRowKey={(row) => pick(row, 'label', 'path', 'service', 'name')}
      />
      <p className="mt-3 text-xs text-warning">{note ?? DEFAULT_NOTE}</p>
    </>
  );
}
