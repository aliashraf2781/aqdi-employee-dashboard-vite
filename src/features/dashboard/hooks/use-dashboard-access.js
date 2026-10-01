import { usePermissions } from '@/features/permissions';
import { DASHBOARD_ROUTE_SECTIONS } from '@/features/dashboard/lib/dashboard-sections';
import { QUICK_ACTIONS } from '@/features/dashboard/lib/dashboard-content';

const FALLBACK_HREF = '/home';

/** Which dashboard areas the signed-in user may open. */
export function useDashboardAccess() {
  const { can, isReady } = usePermissions();

  const canOpen = (sectionKey) => isReady && can(DASHBOARD_ROUTE_SECTIONS[sectionKey], 'view');

  const canOrders = canOpen('orders');
  const canRealtime = canOpen('realtimeOrders');
  const visibleQuickActions = QUICK_ACTIONS.filter((action) => canOpen(action.section));

  return {
    canOrders,
    canRealtime,
    canReturns: canOpen('returnOrders'),
    canClients: canOpen('clients'),
    canAnalytics: canOpen('reports'),
    canSeeUnreceived: canOrders || canRealtime,
    visibleQuickActions,
    firstAllowedHref: visibleQuickActions[0]?.href ?? FALLBACK_HREF,
  };
}
