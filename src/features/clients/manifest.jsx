import { Users2 } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { PERMISSION_SECTIONS, RequirePermission } from '@/features/permissions';
import { lazyRoute } from '@/shared/lib/lazy-route';

/**
 * The list is open to any signed-in user. A client's file, properties and discount
 * were `/home/users/:id` in the old app, guarded by the `users` permission, so those
 * routes sit under a layout route that keeps that guard.
 */
const clientFileRoutes = {
  element: (
    <RequirePermission section={PERMISSION_SECTIONS.users}>
      <Outlet />
    </RequirePermission>
  ),
  children: [
    { path: ':clientId', ...lazyRoute(() => import('./pages/client-details-page'), 'ClientDetailsPage') },
    {
      path: ':clientId/properties',
      ...lazyRoute(() => import('./pages/client-properties-page'), 'ClientPropertiesPage'),
    },
    { path: ':clientId/discount', ...lazyRoute(() => import('./pages/client-discount-page'), 'ClientDiscountPage') },
  ],
};

export const clientsFeature = {
  id: 'clients',
  path: 'clients',
  label: 'العملاء',
  icon: Users2,
  section: null,
  navGroup: 'main',
  routes: [{ index: true, ...lazyRoute(() => import('./pages/clients-page'), 'ClientsPage') }, clientFileRoutes],
};
