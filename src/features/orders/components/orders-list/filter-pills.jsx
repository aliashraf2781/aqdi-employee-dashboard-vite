import { cn } from '@/shared/lib/cn';

const ACTIVE_TONE_CLASS = {
  success: 'border-success bg-success text-primary-foreground',
  danger: 'border-danger bg-danger text-primary-foreground',
  refunded: 'border-refunded bg-refunded text-primary-foreground',
  warning: 'border-warning bg-warning text-primary-foreground',
};

/** Quick filter buttons (موثق / ملغي / مسترجع / غير مكتمل). */
export function FilterPills({ pills, activeFilters, onToggle }) {
  return pills.map(({ id, label, Icon, tone }) => {
    const isActive = activeFilters.includes(id);
    return (
      <button
        key={id}
        type="button"
        onClick={() => onToggle(id)}
        className={cn(
          'flex h-10 items-center gap-1.5 whitespace-nowrap rounded-xl border px-3 text-xs font-extrabold transition-colors',
          isActive ? ACTIVE_TONE_CLASS[tone] : 'border-border bg-surface hover:bg-accent',
        )}
      >
        <Icon className="size-3.5" />
        {label}
      </button>
    );
  });
}
