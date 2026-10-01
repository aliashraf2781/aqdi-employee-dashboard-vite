import { StatCard } from '@/features/clients/components/stat-card';
import { formatMoney } from '@/features/clients/lib/client-details-format';

const STATS = [
  { key: 'completed', label: 'مكتمل', accentClass: 'bg-success' },
  { key: 'draft', label: 'مسودة', accentClass: 'bg-neutral' },
  { key: 'incomplete', label: 'غير مكتمل', accentClass: 'bg-warning' },
  { key: 'properties', label: 'عقارات', accentClass: 'bg-primary' },
  { key: 'units', label: 'وحدات', accentClass: 'bg-primary' },
  { key: 'refundedAmount', label: 'مسترجع (ر.س)', accentClass: 'bg-destructive', isMoney: true },
  { key: 'paid', label: 'مدفوع (ر.س)', accentClass: 'bg-success', isMoney: true },
  { key: 'net', label: 'الصافي (ر.س)', accentClass: 'bg-primary', isMoney: true },
];

export function ClientStatsGrid({ client }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
      {STATS.map(({ key, label, accentClass, isMoney }) => (
        <StatCard
          key={key}
          label={label}
          value={isMoney ? formatMoney(client[key]) : (client[key] ?? 0)}
          accentClass={accentClass}
          className="p-3"
        />
      ))}
    </div>
  );
}
