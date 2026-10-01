import { useAuthStore } from '@/features/auth';
import { HeroSection } from '@/features/dashboard/components/hero-section';
import { KpiGrid } from '@/features/dashboard/components/kpi-grid';
import { QuickActions } from '@/features/dashboard/components/quick-actions';
import { RecentActivity } from '@/features/dashboard/components/recent-activity';
import { useDashboardAccess } from '@/features/dashboard/hooks/use-dashboard-access';
import { useDashboardSummary } from '@/features/dashboard/hooks/use-dashboard-summary';
import { useRecentActivity } from '@/features/dashboard/hooks/use-recent-activity';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const access = useDashboardAccess();
  const { summary } = useDashboardSummary(access);

  const ordersHref = access.canOrders ? '/home/orders' : '/home/realtime-orders';
  const recent = useRecentActivity({ enabled: access.canSeeUnreceived, hrefBase: ordersHref });

  const hasQuickActions = access.visibleQuickActions.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <HeroSection user={user} startHref={access.firstAllowedHref} />
      <KpiGrid summary={summary} access={access} />

      {(hasQuickActions || access.canSeeUnreceived) && (
        <div className="grid gap-5 lg:grid-cols-2">
          {hasQuickActions && <QuickActions actions={access.visibleQuickActions} summary={summary} />}
          {access.canSeeUnreceived && <RecentActivity {...recent} listHref={ordersHref} />}
        </div>
      )}
    </div>
  );
}
