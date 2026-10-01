import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';

export function KpiCard({ label, value, icon: Icon, iconClassName, href }) {
  return (
    <Link
      to={href}
      className="block rounded-2xl border border-border bg-surface px-4 py-3.5 text-start transition-colors hover:border-primary/30 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={cn('inline-flex size-7 items-center justify-center rounded-lg', iconClassName)}>
          <Icon className="size-3.5" strokeWidth={2} />
        </span>
      </div>
      <p className="text-xl font-bold tabular-nums text-foreground">{value}</p>
    </Link>
  );
}
