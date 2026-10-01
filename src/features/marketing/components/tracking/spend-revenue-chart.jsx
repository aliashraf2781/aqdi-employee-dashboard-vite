const CHART_HEIGHT = 220;
const BAR_AREA_HEIGHT = CHART_HEIGHT - 36;
const MIN_BAR_HEIGHT = 4;

function Bar({ value, peak, className, title }) {
  const height = Math.max((value / peak) * BAR_AREA_HEIGHT, MIN_BAR_HEIGHT);
  return <div className={`w-4 rounded-t-sm sm:w-5 ${className}`} style={{ height }} title={title} />;
}

function Legend({ className, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
      <span className={`size-2.5 rounded-sm ${className}`} />
      {label}
    </span>
  );
}

/** Grouped bars: spend vs revenue per channel. `items` = [{ label, spend, revenue }]. */
export function SpendRevenueChart({ items }) {
  const peak = Math.max(...items.flatMap((item) => [item.spend, item.revenue]), 1);

  return (
    <div>
      <div className="flex items-end justify-between gap-3" style={{ height: CHART_HEIGHT }}>
        {items.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex items-end gap-1.5" style={{ height: BAR_AREA_HEIGHT }}>
              <Bar value={item.spend} peak={peak} className="bg-primary/30" title={`الصرف: ${item.spend.toLocaleString('en-US')}`} />
              <Bar value={item.revenue} peak={peak} className="bg-primary" title={`الإيراد: ${item.revenue.toLocaleString('en-US')}`} />
            </div>
            <span className="w-full truncate text-center text-xs font-bold text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-5 border-t border-border pt-3">
        <Legend className="bg-primary" label="الإيراد" />
        <Legend className="bg-primary/30" label="الصرف" />
      </div>
    </div>
  );
}
