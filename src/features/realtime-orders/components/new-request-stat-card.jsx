import { cn } from '@/shared/lib/cn';

const TONE_CLASS = {
  primary: { value: 'text-primary', bar: 'bg-primary' },
  warning: { value: 'text-warning', bar: 'bg-warning' },
  danger: { value: 'text-danger', bar: 'bg-danger' },
};

const MAX_PERCENT = 100;

/** A counter with a thin bar showing its share of the total. */
export function NewRequestStatCard({ value, total, label, hint, tone = 'primary' }) {
  const percent = total ? Math.min(MAX_PERCENT, Math.round((value / total) * MAX_PERCENT)) : 0;

  return (
    <div className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-muted-foreground">{label}</p>
        <span className={cn('shrink-0 text-3xl font-black leading-none tabular-nums', TONE_CLASS[tone].value)}>{value}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full transition-all', TONE_CLASS[tone].bar)} style={{ width: `${percent}%` }} />
      </div>

      <p className="text-xs font-medium text-muted-foreground">{hint}</p>
    </div>
  );
}
