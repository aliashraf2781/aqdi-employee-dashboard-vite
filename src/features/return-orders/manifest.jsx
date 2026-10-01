import { RotateCcw } from 'lucide-react';
import { useReturnedOrdersCount } from '@/features/orders';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { lazyRoute } from '@/shared/lib/lazy-route';

/**
 * Everything the app needs to know about this feature: where it lives, how it
 * appears in the sidebar, who may open it and which pages it has.
 * Order details are opened in the orders feature (/home/orders/:id).
 */
export const returnOrdersFeature = {
  id: 'return-orders',
  path: 'return-orders',
  label: 'طلبات الاسترجاع',
  icon: RotateCcw,
  section: PERMISSION_SECTIONS.returned_request,
  navGroup: 'main',
  useBadgeCount: useReturnedOrdersCount,
  routes: [{ index: true, ...lazyRoute(() => import('./pages/return-orders-page'), 'ReturnOrdersPage') }],
};
