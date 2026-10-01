import { RotateCcw } from 'lucide-react';
import { ComingSoonPage } from '@/shared/components/coming-soon-page';
import { PERMISSION_SECTIONS } from '@/features/permissions';

/**
 * Everything the app needs to know about this feature: where it lives, how it
 * appears in the sidebar, who may open it and which pages it has.
 * Replace the placeholder route with the real (lazy) pages.
 */
export const returnOrdersFeature = {
  id: 'return-orders',
  path: 'return-orders',
  label: 'طلبات الاسترجاع',
  icon: RotateCcw,
  section: PERMISSION_SECTIONS.returned_request,
  navGroup: 'main',
  routes: [{ index: true, element: <ComingSoonPage title="طلبات الاسترجاع" /> }],
};
