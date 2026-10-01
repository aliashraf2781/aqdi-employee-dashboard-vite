import { StatCardRow } from '@/shared/components/stat-card';
import { DASH, formatInt, formatMoney, formatPercent } from '@/features/marketing/lib/format';

const trendOf = (metric) => {
  const change = metric?.change_percent;
  if (change == null || change === '' || Number.isNaN(Number(change))) return undefined;
  return { direction: Number(change) >= 0 ? 'up' : 'down', value: `${Math.abs(Number(change))}%` };
};

export function OverviewKpis({ kpis, currency }) {
  const items = [
    { value: kpis.cac == null ? DASH : formatMoney(kpis.cac, currency), label: 'تكلفة العميل CAC', tone: 'warning' },
    { value: formatPercent(kpis.conversion_rate), label: 'معدل التحويل زائر→عميل' },
    { value: formatInt(kpis.paying_customers), label: 'عملاء دفعوا', tone: 'success' },
    { value: formatInt(kpis.marketing_orders), label: 'طلبات من التسويق', tone: 'success' },
    { value: formatInt(kpis.app_visits?.value), label: 'زيارات التطبيق', tone: 'primary', trend: trendOf(kpis.app_visits) },
    { value: formatInt(kpis.website_visits?.value), label: 'زيارات الموقع', tone: 'primary', trend: trendOf(kpis.website_visits) },
  ];

  return <StatCardRow items={items} className="mb-4" />;
}
