import { ClipboardList } from 'lucide-react';
import { SECTION_GROUPS } from '@/features/permissions';
import { lazyRoute } from '@/shared/lib/lazy-route';

/**
 * Everything the app needs to know about this feature: where it lives, how it
 * appears in the sidebar, who may open it and which pages it has.
 */
export const ordersFeature = {
  id: 'orders',
  path: 'orders',
  label: 'جميع الطلبات',
  icon: ClipboardList,
  section: SECTION_GROUPS.orders,
  navGroup: 'secondary',
  routes: [
    { index: true, ...lazyRoute(() => import('./pages/orders-page'), 'OrdersPage') },
    { path: ':id', ...lazyRoute(() => import('./pages/order-details-page'), 'OrderDetailsPage') },
  ],
};
