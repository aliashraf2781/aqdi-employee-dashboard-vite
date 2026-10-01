import { StatCardRow } from '@/shared/components/stat-card';
import { cn } from '@/shared/lib/cn';
import { SectionCard } from '@/features/marketing/components/shared/section-card';

const SUMMARY_TONES = { indexed_pages: 'primary', healthy_pages: 'success', broken_pages: 'danger', on_page_issues: 'warning' };
const CATEGORY_TONE_CLASSES = {
  high: 'border-danger text-danger',
  medium: 'border-warning text-warning',
  success: 'border-success text-success',
};
const HEALTHY_TYPE = 'healthy_pages';

export function CrawlSummaryCards({ summary }) {
  const items = Object.entries(summary || {}).map(([key, value]) => ({
    value: value?.count ?? 0,
    label: value?.label ?? key,
    tone: SUMMARY_TONES[key],
  }));
  return <StatCardRow items={items} className="mt-4" />;
}

/** Issue categories; clicking one filters the issues list below. */
export function CrawlCategories({ categories, activeType, onSelect }) {
  if (!categories?.length) return null;

  return (
    <SectionCard title="تفصيل نتائج الفحص" className="mt-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {categories.map((category) => {
          const clickable = category.type !== HEALTHY_TYPE;
          const isActive = activeType === category.type;
          return (
            <button
              key={category.type}
              type="button"
              disabled={!clickable}
              onClick={() => onSelect(isActive ? null : category.type)}
              className={cn(
                'rounded-lg border bg-surface p-3 text-center',
                CATEGORY_TONE_CLASSES[category.severity] ?? 'border-border text-foreground',
                clickable && 'hover:bg-accent',
                isActive && 'ring-2 ring-ring',
              )}
            >
              <div className="text-xl font-extrabold">{category.count}</div>
              <div className="text-xs font-medium">{category.label_ar || category.label}</div>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}
