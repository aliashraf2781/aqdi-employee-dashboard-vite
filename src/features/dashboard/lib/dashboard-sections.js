import { PERMISSION_SECTIONS, SECTION_GROUPS } from '@/features/permissions';

/**
 * Which permission section (or ANY-of group) lets a user open each area the
 * dashboard links to. `null` means every signed-in user. Mirrors the route rules
 * of the source app.
 */
export const DASHBOARD_ROUTE_SECTIONS = {
  orders: SECTION_GROUPS.orders,
  realtimeOrders: SECTION_GROUPS.realtimeOrders,
  returnOrders: PERMISSION_SECTIONS.returned_request,
  clients: null,
  reports: PERMISSION_SECTIONS.analytics,
  invoices: null,
};
