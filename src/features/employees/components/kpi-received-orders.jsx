import { DataTable } from '@/shared/components/data-table';
import { cn } from '@/shared/lib/cn';

const SLA_CLASSES = { pass: 'text-success', fail: 'text-danger', na: 'text-muted-foreground' };
const PURE_NUMBER = /^\d+(?:\.\d+)?$/;

/** Prefers the server's label; falls back to "<n> دقيقة" when only a number came back. */
export function formatReceiveDuration(order) {
  const label = order?.receive_work_minutes_label;
  const text = label == null ? '' : String(label).trim();
  if (text && !PURE_NUMBER.test(text)) return text;

  const minutes = text || order?.receive_work_minutes;
  if (minutes == null || minutes === '') return '—';
  return `${minutes} دقيقة`;
}

const COLUMNS = [
  { key: 'order', header: 'الطلب', cell: (order) => order.order },
  { key: 'received_at', header: 'وقت الاستلام', cell: (order) => order.received_at_label ?? '—' },
  { key: 'duration', header: 'مدة الاستلام', cell: formatReceiveDuration },
  {
    key: 'sla',
    header: 'SLA',
    cell: (order) => <span className={cn('font-semibold', SLA_CLASSES[order.sla] ?? SLA_CLASSES.na)}>{order.sla_label_ar ?? '—'}</span>,
  },
  { key: 'status', header: 'الحالة الحالية', cell: (order) => order.current_status ?? '—' },
];

export function KpiReceivedOrders({ orders }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-foreground">الطلبات المستلمة بالفترة</h3>
      <DataTable columns={COLUMNS} rows={orders} getRowKey={(order) => order.uuid ?? order.order} emptyMessage="لا توجد طلبات مستلمة في هذه الفترة." />
    </section>
  );
}
