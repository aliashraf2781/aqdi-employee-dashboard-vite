import { DataTable } from '@/shared/components/data-table';
import { ColorChip, RoasChip } from '@/features/marketing/components/shared/chips';
import { DASH, formatInt, formatMoney, formatSignedMoney } from '@/features/marketing/lib/format';

const TOTAL_LABEL = 'الإجمالي';

function ProfitCell({ value, currency }) {
  return <span className={Number(value) >= 0 ? 'font-bold text-success' : 'font-bold text-danger'}>{formatSignedMoney(value, currency)}</span>;
}

function buildColumns({ currency, showLeads }) {
  const columns = [
    {
      key: 'channel',
      header: 'القناة',
      cell: (row) => (row.isTotal ? <b>{TOTAL_LABEL}</b> : <ColorChip label={row.label_ar || row.source} color={row.color} />),
    },
    { key: 'spend', header: 'الصرف', cell: (row) => formatMoney(row.spend, currency) },
    { key: 'revenue', header: 'الإيراد', cell: (row) => formatMoney(row.revenue, currency) },
    { key: 'roas', header: 'ROAS', cell: (row) => <RoasChip value={row.roas} tone={row.roas_tone} /> },
  ];
  if (showLeads) columns.push({ key: 'leads', header: 'Leads', cell: (row) => formatInt(row.leads) });
  columns.push(
    { key: 'conversions', header: 'تحويلات', cell: (row) => formatInt(row.conversions) },
    { key: 'cac', header: 'CAC', cell: (row) => (row.cac == null ? DASH : formatMoney(row.cac, currency)) },
    { key: 'profit', header: 'الربح', cell: (row) => <ProfitCell value={row.profit} currency={currency} /> },
  );
  return columns;
}

/** Paid-channel performance table (overview, campaigns and reports tabs). `total` adds a summary row. */
export function ChannelRoiTable({ rows, total, currency, showLeads = false }) {
  const tableRows = total ? [...rows, { ...total, isTotal: true, source: 'total' }] : rows;

  return <DataTable columns={buildColumns({ currency, showLeads })} rows={tableRows} getRowKey={(row) => row.source} />;
}
