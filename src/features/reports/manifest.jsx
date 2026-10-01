import { BarChart3 } from 'lucide-react';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { lazyRoute } from '@/shared/lib/lazy-route';

/**
 * Everything the app needs to know about this feature: where it lives, how it
 * appears in the sidebar, who may open it and which pages it has.
 * The analysis panels are tabs of one page (?tab=orders, ?tab=sales, ...).
 */
export const reportsFeature = {
  id: 'reports',
  path: 'reports',
  label: 'التقارير',
  icon: BarChart3,
  section: PERMISSION_SECTIONS.analytics,
  navGroup: 'main',
  routes: [{ index: true, ...lazyRoute(() => import('./pages/reports-page'), 'ReportsPage') }],
};
