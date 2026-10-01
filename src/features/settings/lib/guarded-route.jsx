import { RequirePermission } from '@/features/permissions';

/**
 * A lazy route wrapped in its own permission check. Every settings page has its own
 * permission section, so each child route is guarded individually (the feature itself
 * only requires "any of them").
 *
 *   guardedRoute({ path: 'cities', section: 'cities', importer: () => import('../pages/crud-pages'), exportName: 'CitiesPage' })
 */
export function guardedRoute({ path, index, section, action = 'view', importer, exportName }) {
  return {
    ...(index ? { index: true } : { path }),
    lazy: async () => {
      const Page = (await importer())[exportName];
      function GuardedPage() {
        return (
          <RequirePermission section={section} action={action}>
            <Page />
          </RequirePermission>
        );
      }
      return { Component: GuardedPage };
    },
  };
}
