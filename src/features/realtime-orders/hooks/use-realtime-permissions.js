import { PERMISSION_SECTIONS } from '@/features/permissions';
import { useOrdersPermissions } from '@/features/orders';

/** What the current user may do on the realtime screen. Admins may do everything. */
export function useRealtimePermissions() {
  const orders = useOrdersPermissions();
  const { can, isAdmin } = orders;
  const S = PERMISSION_SECTIONS;
  const allowed = (section, action) => isAdmin || can(section, action);

  return {
    ...orders,
    canViewReceivedQueue: allowed(S.all_requests, 'view') || allowed(S.completed_request, 'view'),
    canViewNewRequests: allowed(S.all_requests, 'view'),
    canReceive:
      allowed(S.all_requests, 'edit') || allowed(S.all_requests, 'retrieve') || allowed(S.completed_request, 'edit'),
    canManageStatuses: orders.canAddStatus || orders.canEditStatus,
  };
}
