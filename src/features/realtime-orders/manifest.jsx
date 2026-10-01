import { Radio } from 'lucide-react';
import { useUnreceivedOrdersCount } from '@/features/orders';
import { SECTION_GROUPS } from '@/features/permissions';
import { lazyRoute } from '@/shared/lib/lazy-route';

/**
 * Everything the app needs to know about this feature: where it lives, how it
 * appears in the sidebar, who may open it and which pages it has.
 * The details page is not duplicated: `:id` forwards to the orders feature.
 */
export const realtimeOrdersFeature = {
  id: 'realtime-orders',
  path: 'realtime-orders',
  label: 'الطلبات مباشر',
  icon: Radio,
  section: SECTION_GROUPS.realtimeOrders,
  navGroup: 'main',
  useBadgeCount: useUnreceivedOrdersCount,
  routes: [
    { index: true, ...lazyRoute(() => import('./pages/realtime-orders-page'), 'RealtimeOrdersPage') },
    { path: ':id', ...lazyRoute(() => import('./pages/realtime-order-redirect-page'), 'RealtimeOrderRedirectPage') },
  ],
};
