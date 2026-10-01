import { Bell, ChevronLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/shared/components/card';
import { formatCount, formatRelativeTime } from '@/features/dashboard/lib/dashboard-format';

function ActivityRow({ item, fallbackHref }) {
  return (
    <li>
      <Link to={item.href || fallbackHref} className="flex items-start gap-3 rounded-2xl px-3 py-3 text-start transition-colors hover:bg-surface-muted">
        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Bell className="size-4" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-foreground">{item.title}</span>
          {item.subtitle && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.subtitle}</span>}
        </span>
        <span className="shrink-0 pt-0.5 text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</span>
      </Link>
    </li>
  );
}

function EmptyActivity() {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <span className="inline-flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Bell className="size-4" strokeWidth={2} />
      </span>
      <p className="text-sm font-semibold text-foreground">لا توجد طلبات جديدة الآن</p>
      <p className="text-xs text-muted-foreground">سيظهر أي طلب جديد هنا فور وصوله</p>
    </div>
  );
}

function ActivityBody({ activity, isLoading, isError, fallbackHref }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }
  if (isError) return <p className="py-10 text-center text-sm text-muted-foreground">تعذّر تحميل النشاطات</p>;
  if (activity.length === 0) return <EmptyActivity />;

  return (
    <ul className="flex flex-col gap-1">
      {activity.map((item) => (
        <ActivityRow key={item.id} item={item} fallbackHref={fallbackHref} />
      ))}
    </ul>
  );
}

export function RecentActivity({ activity, total, isLoading, isError, listHref }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-foreground">آخر النشاطات</h3>
        <Link
          to={listHref}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent/70"
        >
          {total > 0 ? `${formatCount(total)} طلب جديد` : 'عرض الكل'}
          <ChevronLeft className="size-3" strokeWidth={2.5} />
        </Link>
      </div>
      <ActivityBody activity={activity} isLoading={isLoading} isError={isError} fallbackHref={listHref} />
    </Card>
  );
}
