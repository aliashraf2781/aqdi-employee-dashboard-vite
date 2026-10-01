import { FileText } from 'lucide-react';
import { SECTION_GROUPS } from '@/features/permissions';
import { lazyRoute } from '@/shared/lib/lazy-route';

/**
 * Legacy `/home/content`: it only redirects into the marketing content tab,
 * so it has no sidebar entry (`navGroup: null`).
 */
export const contentRedirectFeature = {
  id: 'content',
  path: 'content',
  label: 'المحتوى',
  icon: FileText,
  section: SECTION_GROUPS.content,
  navGroup: null,
  routes: [{ index: true, ...lazyRoute(() => import('./pages/legacy-content-redirect'), 'LegacyContentRedirect') }],
};
