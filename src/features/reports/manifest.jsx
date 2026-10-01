import { BarChart3 } from 'lucide-react';
import { ComingSoonPage } from '@/shared/components/coming-soon-page';
import { PERMISSION_SECTIONS } from '@/features/permissions';

/**
 * Everything the app needs to know about this feature: where it lives, how it
 * appears in the sidebar, who may open it and which pages it has.
 * Replace the placeholder route with the real (lazy) pages.
 */
export const reportsFeature = {
  id: 'reports',
  path: 'reports',
  label: 'التقارير',
  icon: BarChart3,
  section: PERMISSION_SECTIONS.analytics,
  navGroup: 'main',
  routes: [{ index: true, element: <ComingSoonPage title="التقارير" /> }],
};
