import { Building2 } from 'lucide-react';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { lazyRoute } from '@/shared/lib/lazy-route';

/**
 * Real estates only has a detail page (opened from the properties report),
 * so it is not shown in the sidebar (`navGroup: null`).
 */
export const realEstatesFeature = {
  id: 'real-estates',
  path: 'real-estates',
  label: 'العقارات',
  icon: Building2,
  section: PERMISSION_SECTIONS.real_estates,
  navGroup: null,
  routes: [
    { path: ':id', ...lazyRoute(() => import('./pages/real-estate-details-page'), 'RealEstateDetailsPage') },
  ],
};
