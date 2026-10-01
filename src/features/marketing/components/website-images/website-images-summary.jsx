import { StatCard } from '@/shared/components/stat-card';
import { WEBSITE_IMAGE_SUMMARY_CARDS } from '@/features/marketing/lib/website-images';

export function WebsiteImagesSummary({ summary }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {WEBSITE_IMAGE_SUMMARY_CARDS.map((card) => (
        <StatCard key={card.key} value={summary?.[card.key] ?? 0} label={card.label} tone="primary" />
      ))}
    </div>
  );
}
