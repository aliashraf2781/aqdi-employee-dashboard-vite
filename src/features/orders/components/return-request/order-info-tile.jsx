import { cn } from '@/shared/lib/cn';

/** Small label/value card used to summarise an order inside a dialog. */
export function OrderInfoTile({ label, value, className }) {
  return (
    <div className={cn('rounded-xl border border-border bg-muted px-4 py-3', className)}>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-bold">{value ?? '—'}</p>
    </div>
  );
}
