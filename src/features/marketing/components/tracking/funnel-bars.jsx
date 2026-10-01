import { ChangeBadge } from '@/features/marketing/components/shared/chips';
import { formatInt, formatPercent } from '@/features/marketing/lib/format';

const MIN_WIDTH_PERCENT = 3;
const MAX_WIDTH_PERCENT = 100;

const clampWidth = (share) => Math.max(Math.min(Number(share) || 0, MAX_WIDTH_PERCENT), MIN_WIDTH_PERCENT);

/** The marketing funnel: impressions -> clicks -> leads -> conversions. */
export function FunnelBars({ steps }) {
  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, index) => (
        <div key={step.key || step.label_ar} className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-end tabular-nums">{index > 0 && <ChangeBadge value={step.change_percent} />}</span>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="h-8 flex-1 overflow-hidden rounded-md bg-muted">
              <div className="flex h-full items-center rounded-md bg-primary px-3" style={{ width: `${clampWidth(step.share_percent)}%` }}>
                <span className="whitespace-nowrap text-xs font-extrabold tabular-nums text-primary-foreground">{formatInt(step.value)}</span>
              </div>
            </div>
            <span className="min-w-24 shrink-0 text-sm font-bold text-foreground">
              {step.label_ar}
              {step.rate_from_previous != null && (
                <span className="block text-xs font-medium text-muted-foreground">{formatPercent(step.rate_from_previous)} من السابق</span>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
