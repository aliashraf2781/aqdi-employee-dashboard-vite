import { Users2 } from 'lucide-react';
import { ComingSoonPage } from '@/shared/components/coming-soon-page';

/**
 * Everything the app needs to know about this feature: where it lives, how it
 * appears in the sidebar, who may open it and which pages it has.
 * Replace the placeholder route with the real (lazy) pages.
 */
export const clientsFeature = {
  id: 'clients',
  path: 'clients',
  label: 'العملاء',
  icon: Users2,
  section: null,
  navGroup: 'main',
  routes: [{ index: true, element: <ComingSoonPage title="العملاء" /> }],
};
