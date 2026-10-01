import { cva } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const valueVariants = cva('text-xl font-extrabold', {
  variants: {
    tone: {
      default: 'text-foreground',
      primary: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-danger',
    },
  },
  defaultVariants: { tone: 'default' },
});

/**
 * One KPI tile: big value, small label, optional change line.
 * `trend` = { direction: 'up' | 'down', value: '9%' }.
 */
export function StatCard({ value, label, tone, trend, className }) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface px-4 py-3 text-center', className)}>
      <div className={valueVariants({ tone })}>{value}</div>
      <div className="mt-1 text-xs font-medium text-muted-foreground">{label}</div>
      {trend && (
        <div className={cn('mt-1 text-xs font-bold', trend.direction === 'up' ? 'text-success' : 'text-danger')}>
          {trend.direction === 'up' ? '▲' : '▼'} {trend.value}
        </div>
      )}
    </div>
  );
}

/** Responsive grid of StatCards: `items` are StatCard props. */
export function StatCardRow({ items, className }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6', className)}>
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}
