import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { KpiCard } from '@/shared/components/kpi-card';
import { countReturnOrdersByApproval } from '@/features/orders';

const KPI_ITEMS = [
  { key: 'pending', label: 'بانتظار الموافقة', icon: Clock, tone: 'warning' },
  { key: 'approved', label: 'تمت الموافقة', icon: CheckCircle2, tone: 'success' },
  { key: 'rejected', label: 'مرفوضة', icon: XCircle, tone: 'danger' },
];

/**
 * Pending / approved / rejected counters.
 * `counts` are the global numbers; without them the rows of the current page are counted.
 */
export function ReturnOrdersKpis({ rows = [], counts }) {
  const shown = counts ?? countReturnOrdersByApproval(rows);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {KPI_ITEMS.map(({ key, ...item }) => (
        <KpiCard key={key} value={shown[key] ?? 0} {...item} />
      ))}
    </div>
  );
}
