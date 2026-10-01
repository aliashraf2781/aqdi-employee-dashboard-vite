import { cn } from '@/shared/lib/cn';

/** Read-only "label above a boxed value"; an empty value shows an en dash. */
export function LabeledValue({ label, value, className }) {
  const isEmpty = value == null || value === '';

  return (
    <div className={cn('flex min-w-0 flex-col gap-1', className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="break-words rounded-md border border-border bg-surface-muted px-3 py-2 text-sm font-bold tabular-nums text-foreground">
        {isEmpty ? '–' : value}
      </span>
    </div>
  );
}
