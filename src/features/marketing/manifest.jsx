import { TrendingUp } from 'lucide-react';
import { ComingSoonPage } from '@/shared/components/coming-soon-page';
import { SECTION_GROUPS } from '@/features/permissions';

/**
 * Everything the app needs to know about this feature: where it lives, how it
 * appears in the sidebar, who may open it and which pages it has.
 * Replace the placeholder route with the real (lazy) pages.
 */
export const marketingFeature = {
  id: 'marketing',
  path: 'marketing-and-content',
  label: 'التسويق والمحتوى',
  icon: TrendingUp,
  section: SECTION_GROUPS.marketing,
  navGroup: 'main',
  routes: [{ index: true, element: <ComingSoonPage title="التسويق والمحتوى" /> }],
};
