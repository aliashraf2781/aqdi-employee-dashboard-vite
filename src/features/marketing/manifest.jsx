import { TrendingUp } from 'lucide-react';
import { SECTION_GROUPS } from '@/features/permissions';
import { lazyRoute } from '@/shared/lib/lazy-route';

/** Marketing & content: ROI dashboards, SEO, reports, ad tracking and the public-site content editors. */
export const marketingFeature = {
  id: 'marketing',
  path: 'marketing-and-content',
  label: 'التسويق والمحتوى',
  icon: TrendingUp,
  section: SECTION_GROUPS.marketing,
  navGroup: 'main',
  routes: [
    { index: true, ...lazyRoute(() => import('./pages/marketing-page'), 'MarketingPage') },
    { path: 'website-details', ...lazyRoute(() => import('./pages/website-details-page'), 'WebsiteDetailsPage') },
  ],
};
