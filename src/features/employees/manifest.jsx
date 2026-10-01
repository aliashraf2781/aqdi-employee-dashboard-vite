import { lazy, Suspense } from 'react';
import { UserRound } from 'lucide-react';
import { PageLoader } from '@/shared/components/page-loader';
import { lazyRoute } from '@/shared/lib/lazy-route';
import { PERMISSION_SECTIONS, RequirePermission, SECTION_GROUPS } from '@/features/permissions';

const RoleAddPage = lazy(() => import('./pages/role-add-page').then((module) => ({ default: module.RoleAddPage })));
const RoleEditPage = lazy(() => import('./pages/role-edit-page').then((module) => ({ default: module.RoleEditPage })));

/**
 * Role pages need a stricter permission than the feature's any-of guard
 * (`roles.create` / `roles.edit`), so they carry their own RequirePermission.
 */
function GuardedRolePage({ action, children }) {
  return (
    <RequirePermission section={PERMISSION_SECTIONS.roles} action={action}>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </RequirePermission>
  );
}

/** Employees, roles, salaries and KPIs under /home/roles-and-employees. */
export const employeesFeature = {
  id: 'employees',
  path: 'roles-and-employees',
  label: 'الموظفون والأدوار',
  icon: UserRound,
  section: SECTION_GROUPS.rolesAndEmployees,
  navGroup: 'main',
  routes: [
    { index: true, ...lazyRoute(() => import('./pages/employees-page'), 'EmployeesPage') },
    { path: 'employees/:id', ...lazyRoute(() => import('./pages/employee-details-page'), 'EmployeeDetailsPage') },
    { path: 'employees/:id/kpis', ...lazyRoute(() => import('./pages/employee-kpis-page'), 'EmployeeKpisPage') },
    { path: 'roles/add', element: <GuardedRolePage action="create"><RoleAddPage /></GuardedRolePage> },
    { path: 'roles/edit', element: <GuardedRolePage action="edit"><RoleEditPage /></GuardedRolePage> },
  ],
};
