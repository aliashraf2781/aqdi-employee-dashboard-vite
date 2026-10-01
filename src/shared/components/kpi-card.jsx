import { cva } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const iconVariants = cva('flex size-10 shrink-0 items-center justify-center rounded-lg', {
  variants: {
    tone: {
      default: 'bg-accent text-accent-foreground',
      success: 'bg-success-soft text-success',
      warning: 'bg-warning-soft text-warning',
      danger: 'bg-danger-soft text-danger',
      muted: 'bg-neutral-soft text-neutral',
    },
  },
  defaultVariants: { tone: 'default' },
});

/** One headline number with an icon. `value` is displayed as given (format it before passing). */
export function KpiCard({ label, value, icon: Icon, tone, className }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface p-4', className)}>
      {Icon && (
        <div className={iconVariants({ tone })}>
          <Icon className="size-5" aria-hidden />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xl font-bold leading-tight text-foreground">{value}</p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/** Responsive grid of KpiCards. `items`: [{ key, label, value, icon, tone }]. */
export function KpiGrid({ items, className }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6', className)}>
      {items.map(({ key, ...item }) => (
        <KpiCard key={key ?? item.label} {...item} />
      ))}
    </div>
  );
}
