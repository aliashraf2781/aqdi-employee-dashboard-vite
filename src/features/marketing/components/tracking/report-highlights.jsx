import { Badge } from '@/shared/components/badge';
import { ChangeBadge, ColorChip } from '@/features/marketing/components/shared/chips';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { formatInt, formatMoney } from '@/features/marketing/lib/format';

function HighlightBadge({ badge }) {
  if (!badge) return null;
  if (typeof badge === 'object') return <ColorChip label={badge.label_ar} color={badge.color} />;
  return <Badge tone="success">{badge}</Badge>;
}

function HighlightTile({ item }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="text-xs font-bold text-muted-foreground">{item.title_ar}</div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-foreground">
        <HighlightBadge badge={item.badge} />
        {item.label}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{item.detail_ar}</div>
    </div>
  );
}

function ComparisonCard({ comparison, currency }) {
  return (
    <SectionCard title={comparison.title_ar} className="mt-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(comparison.items || []).map((item) => (
          <div key={item.key} className="rounded-lg bg-surface-muted p-3 text-center">
            <ChangeBadge value={item.change_percent} />
            <div className="text-lg font-extrabold text-foreground">{item.is_money ? formatMoney(item.value, currency) : formatInt(item.value)}</div>
            <div className="text-xs text-muted-foreground">{item.label_ar}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/** Best-of tiles and the period comparison of the reports tab. */
export function ReportHighlights({ highlights, comparison, currency }) {
  return (
    <>
      {highlights?.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item) => (
            <HighlightTile key={item.key} item={item} />
          ))}
        </div>
      )}
      {comparison && <ComparisonCard comparison={comparison} currency={currency} />}
    </>
  );
}
