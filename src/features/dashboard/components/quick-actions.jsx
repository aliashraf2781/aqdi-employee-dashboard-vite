import { Link } from 'react-router-dom';
import { Card } from '@/shared/components/card';
import { formatCount } from '@/features/dashboard/lib/dashboard-format';

function QuickActionLink({ action, badgeCount }) {
  const Icon = action.icon;

  return (
    <Link
      to={action.href}
      className="relative flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface-muted p-4 text-start transition-colors hover:border-primary/30 hover:bg-accent"
    >
      {badgeCount > 0 && (
        <span className="absolute end-3 top-3 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground">
          {formatCount(badgeCount)}
        </span>
      )}
      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-surface text-accent-foreground shadow-sm">
        <Icon className="size-4" strokeWidth={2} />
      </span>
      <span className="text-sm font-semibold text-foreground">{action.label}</span>
    </Link>
  );
}

export function QuickActions({ actions, summary }) {
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="mb-4 text-base font-bold text-foreground">اختصارات سريعة</h3>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {actions.map((action) => (
          <QuickActionLink key={action.id} action={action} badgeCount={summary[action.badgeKey]} />
        ))}
      </div>
    </Card>
  );
}
