import { chartBarClass } from '../lib/chart-colors';
import { formatNumber } from '../lib/report-format';
import { EmptyNote } from './empty-note';

const MIN_VISIBLE_PERCENT = 4;

function barWidthPercent(value, peak) {
  const magnitude = Math.abs(value);
  if (magnitude === 0 || peak === 0) return 0;
  return Math.max((magnitude / peak) * 100, MIN_VISIBLE_PERCENT);
}

/**
 * One bar per item: { label, value, suffix?, detail? }.
 * `seriesIndex` paints every bar with the same chart color instead of cycling.
 */
export function HorizontalBarChart({ items, seriesIndex }) {
  if (items.length === 0) return <EmptyNote />;

  const peak = Math.max(...items.map((item) => Math.abs(Number(item.value)) || 0), 1);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => {
        const value = Number(item.value) || 0;
        const colorClass = chartBarClass(seriesIndex ?? index, value);

        return (
          <div key={item.label} className="flex min-w-0 flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm text-muted-foreground">{item.label}</span>
              <span className="shrink-0 text-sm font-bold tabular-nums text-foreground">
                {formatNumber(value)} {item.suffix}
                {item.detail && <span className="ms-1 text-xs font-semibold text-muted-foreground">{item.detail}</span>}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-neutral-soft">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                style={{ width: `${barWidthPercent(value, peak)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
