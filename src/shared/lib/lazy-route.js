/**
 * Code-split route helper:
 *   { path: ':id', ...lazyRoute(() => import('./pages/client-page'), 'ClientPage') }
 * The page file stays a normal named export.
 */
export function lazyRoute(importer, exportName) {
  return { lazy: async () => ({ Component: (await importer())[exportName] }) };
}
