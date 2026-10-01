import { ReceiptText } from 'lucide-react';
import { lazyRoute } from '@/shared/lib/lazy-route';

/**
 * Everything the app needs to know about this feature: where it lives, how it
 * appears in the sidebar, who may open it and which pages it has.
 * Invoices have no permission section in the source app, so every signed-in user may open it.
 */
export const invoicesFeature = {
  id: 'invoices',
  path: 'invoices',
  label: 'الفواتير',
  icon: ReceiptText,
  section: null,
  navGroup: 'secondary',
  routes: [{ index: true, ...lazyRoute(() => import('./pages/invoices-page'), 'InvoicesPage') }],
};
