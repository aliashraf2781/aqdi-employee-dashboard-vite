import { Users } from 'lucide-react';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { lazyRoute } from '@/shared/lib/lazy-route';

/**
 * User (customer account) pages. They are reached from reports and the clients list,
 * so the feature has no sidebar entry (`navGroup: null`).
 */
export const usersFeature = {
  id: 'users',
  path: 'users',
  label: 'المستخدمون',
  icon: Users,
  section: PERMISSION_SECTIONS.users,
  navGroup: null,
  routes: [
    { path: ':userId', ...lazyRoute(() => import('./pages/user-details-page'), 'UserDetailsPage') },
    { path: ':userId/properties', ...lazyRoute(() => import('./pages/client-properties-page'), 'ClientPropertiesPage') },
    { path: ':userId/discount', ...lazyRoute(() => import('./pages/client-discount-page'), 'ClientDiscountPage') },
  ],
};
