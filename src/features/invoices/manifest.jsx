import { ReceiptText } from 'lucide-react';
import { ComingSoonPage } from '@/shared/components/coming-soon-page';

/**
 * Everything the app needs to know about this feature: where it lives, how it
 * appears in the sidebar, who may open it and which pages it has.
 * Replace the placeholder route with the real (lazy) pages.
 */
export const invoicesFeature = {
  id: 'invoices',
  path: 'invoices',
  label: 'الفواتير',
  icon: ReceiptText,
  section: null,
  navGroup: 'secondary',
  routes: [{ index: true, element: <ComingSoonPage title="الفواتير" /> }],
};
