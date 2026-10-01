import { FileSliders } from 'lucide-react';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { lazyRoute } from '@/shared/lib/lazy-route';

/** Not in the sidebar (navGroup null): reached from the system settings hub and by URL. */
export const contractSettingsFeature = {
  id: 'contract-settings',
  path: 'contract-settings',
  label: 'إعدادات العقود',
  icon: FileSliders,
  section: PERMISSION_SECTIONS.settings,
  navGroup: null,
  routes: [
    {
      index: true,
      ...lazyRoute(() => import('./pages/contract-settings-page'), 'ContractSettingsPage'),
    },
  ],
};
