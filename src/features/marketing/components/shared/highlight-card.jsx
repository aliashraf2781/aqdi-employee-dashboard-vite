import { ColorChip } from '@/features/marketing/components/shared/chips';
import { cn } from '@/shared/lib/cn';
import { formatInt, formatRoas } from '@/features/marketing/lib/format';

/** Best / weakest campaign callout. `kind` is 'good' or 'bad'. */
export function HighlightCard({ data, kind, title, currency, children }) {
  if (!data) return null;

  const hasResult = data.result_amount != null;
  const resultText = hasResult ? ` · ${data.result_label_ar || ''} ${formatInt(data.result_amount)} ${currency}`.trimEnd() : '';

  return (
    <div className={cn('rounded-lg border p-4', kind === 'good' ? 'border-success bg-success-soft' : 'border-danger bg-danger-soft')}>
      <div className="text-xs font-bold text-muted-foreground">{title}</div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-foreground">
        {data.label_ar && <ColorChip label={data.label_ar} color={data.color} />}
        {data.campaign}
      </div>
      <div className="mt-1 text-lg font-extrabold text-foreground">
        {formatRoas(data.roas)}
        {resultText}
      </div>
      {children}
    </div>
  );
}
