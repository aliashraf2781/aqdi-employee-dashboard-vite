import { Banknote, CheckCircle2, ReceiptText, Undo2 } from 'lucide-react';
import { KpiGrid } from '@/shared/components/kpi-card';
import { RiyalIcon } from './riyal-icon';

export function InvoiceStats({ stats }) {
  const items = [
    { key: 'paid', label: 'مدفوعة', value: stats.paidCount, icon: CheckCircle2, tone: 'success' },
    { key: 'refunded', label: 'مسترجعة', value: stats.refundedCount, icon: Undo2, tone: 'danger' },
    { key: 'total', label: 'إجمالي الفواتير', value: stats.totalCount, icon: ReceiptText, tone: 'warning' },
    {
      key: 'collected',
      label: 'المحصل',
      value: (
        <>
          {stats.collected.toLocaleString('en-US')} <RiyalIcon />
        </>
      ),
      icon: Banknote,
    },
  ];

  return <KpiGrid items={items} className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4" />;
}
