import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { LoginPage, ProtectedRoute } from '@/features/auth';
import { RequirePermission } from '@/features/permissions';
import { features } from '@/app/features';
import { AppShell } from '@/app/layout/app-shell';
import { lazyRoute } from '@/shared/lib/lazy-route';

/** /home/<feature-path>/* guarded by the feature's permission section. */
const toFeatureRoute = (feature) => ({
  path: feature.path,
  element: (
    <RequirePermission section={feature.section}>
      <Outlet />
    </RequirePermission>
  ),
  children: feature.routes,
});

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/home',
        element: <AppShell />,
        children: [
          { index: true, ...lazyRoute(() => import('@/features/dashboard/pages/dashboard-page'), 'DashboardPage') },
          ...features.map(toFeatureRoute),
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/home" replace /> },
]);
