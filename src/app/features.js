import { clientsFeature } from '@/features/clients/manifest';
import { contractSettingsFeature } from '@/features/contract-settings/manifest';
import { employeesFeature } from '@/features/employees/manifest';
import { invoicesFeature } from '@/features/invoices/manifest';
import { contentRedirectFeature, marketingFeature } from '@/features/marketing';
import { ordersFeature } from '@/features/orders/manifest';
import { realEstatesFeature } from '@/features/real-estates/manifest';
import { realtimeOrdersFeature } from '@/features/realtime-orders/manifest';
import { reportsFeature } from '@/features/reports/manifest';
import { returnOrdersFeature } from '@/features/return-orders/manifest';
import { settingsFeature } from '@/features/settings/manifest';
import { usersFeature } from '@/features/users/manifest';

/**
 * The registry. Sidebar order = array order. To add a feature: create its
 * manifest and add one line here. Nothing else in `app/` needs to change.
 */
export const features = [
  realtimeOrdersFeature,
  clientsFeature,
  returnOrdersFeature,
  employeesFeature,
  marketingFeature,
  contentRedirectFeature,
  reportsFeature,
  settingsFeature,
  contractSettingsFeature,
  ordersFeature,
  invoicesFeature,
  usersFeature,
  realEstatesFeature,
];
