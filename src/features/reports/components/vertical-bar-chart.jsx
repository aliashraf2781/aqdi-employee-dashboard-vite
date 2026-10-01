import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { formatNumber } from '../lib/report-format';

const LABEL_AND_VALUE_SPACE_PX = 40;
const MIN_VISIBLE_BAR_PX = 8;
const ISO_DAY_PATTERN = /^\d{4}-(\d{2})-(\d{2})/;

/** "2026-03-15" becomes "15/03"; other labels are shown as they are. */
function formatDayLabel(value) {
  const match = typeof value === 'string' && value.match(ISO_DAY_PATTERN);
  return match ? `${match[2]}/${match[1]}` : value;
}

function barHeightPx(value, peak, chartHeight) {
  if (value <= 0 || peak <= 0) return 0;
  return Math.max((value / peak) * (chartHeight - LABEL_AND_VALUE_SPACE_PX), MIN_VISIBLE_BAR_PX);
}

/** Column chart for daily series: [{ date | label, value }]. `pageSize` adds paging for long series. */
export function VerticalBarChart({ items, height = 160, pageSize, showValues = false }) {
  const [requestedPage, setRequestedPage] = useState(0);
  const totalPages = pageSize ? Math.max(Math.ceil(items.length / pageSize), 1) : 1;
  const page = Math.min(requestedPage, totalPages - 1);

  const visibleItems = pageSize ? items.slice(page * pageSize, (page + 1) * pageSize) : items;
  const peak = Math.max(...visibleItems.map((item) => Number(item.value) || 0), 1);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {visibleItems.map((item) => {
          const value = Number(item.value) || 0;
          const name = item.date ?? item.label;

          return (
            <div key={name} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              {showValues && (
                <span className="text-xs font-bold tabular-nums text-foreground">{formatNumber(value)}</span>
              )}
              <div
                className="w-full max-w-10 rounded-t-md bg-chart-6 transition-all duration-500"
                style={{ height: barHeightPx(value, peak, height) }}
                title={`${name}: ${formatNumber(value)}`}
              />
              <span className="w-full truncate text-center text-xs text-muted-foreground">{formatDayLabel(name)}</span>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setRequestedPage(page - 1)}
            aria-label="السابق"
          >
            <ChevronRight className="size-4" />
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground">
            {page + 1} من {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages - 1}
            onClick={() => setRequestedPage(page + 1)}
            aria-label="التالي"
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
