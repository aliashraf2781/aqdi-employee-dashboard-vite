import { StatCard } from '@/features/clients/components/stat-card';

const SUMMARY_CARDS = [
  { key: 'total_customers', accentClass: 'bg-success' },
  { key: 'website_customers', accentClass: 'bg-primary' },
  { key: 'google_play_customers', accentClass: 'bg-notice' },
  { key: 'apple_store_customers', accentClass: 'bg-neutral' },
  { key: 'banned', accentClass: 'bg-warning' },
];

/** Totals strip above the clients table. Renders nothing until the API sends a summary. */
export function ClientsSummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 desktop:grid-cols-5">
      {SUMMARY_CARDS.map(({ key, accentClass }) => (
        <StatCard key={key} label={summary.labels?.[key]} value={summary[key] ?? 0} accentClass={accentClass} />
      ))}
    </div>
  );
}
