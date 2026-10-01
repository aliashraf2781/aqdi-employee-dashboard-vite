import { Settings } from 'lucide-react';
import { PERMISSION_SECTIONS } from '@/features/permissions';
import { guardedRoute } from '@/features/settings/lib/guarded-route';

const S = PERMISSION_SECTIONS;

const crudPages = () => import('./pages/crud-pages');
const contentPages = () => import('./pages/content-pages');
const blogPages = () => import('./pages/blog-pages');

/**
 * System settings: a hub (`/home/settings`) plus one page per settings area.
 * Each child route has its own permission section (see ROUTE_SECTION_RULES in the old app),
 * so the feature as a whole is reachable with ANY of them and every route checks its own.
 */
export const settingsFeature = {
  id: 'settings',
  path: 'settings',
  label: 'إعدادات النظام',
  icon: Settings,
  section: [
    S.settings,
    S.property_reference,
    S.regions,
    S.cities,
    S.message_alerts,
    S.app_content,
    S.contract_periods,
    S.services_pricing,
    S.coupons,
    S.blogs,
    S.faqs,
    S.notifications,
    S.payments,
    S.tenant_roles,
    S.paperworks,
  ],
  navGroup: 'main',
  routes: [
    guardedRoute({ index: true, section: S.settings, importer: () => import('./pages/settings-hub-page'), exportName: 'SettingsHubPage' }),
    guardedRoute({ path: 'app-status', section: S.settings, importer: () => import('./pages/app-status-page'), exportName: 'AppStatusPage' }),

    guardedRoute({ path: 'unit-types', section: S.property_reference, importer: crudPages, exportName: 'UnitTypesPage' }),
    guardedRoute({ path: 'unit-usage', section: S.property_reference, importer: crudPages, exportName: 'UnitUsagePage' }),
    guardedRoute({ path: 'property-types', section: S.property_reference, importer: crudPages, exportName: 'PropertyTypesPage' }),
    guardedRoute({ path: 'property-usage', section: S.property_reference, importer: crudPages, exportName: 'PropertyUsagePage' }),
    guardedRoute({ path: 'regions', section: S.regions, importer: crudPages, exportName: 'RegionsPage' }),
    guardedRoute({ path: 'cities', section: S.cities, importer: crudPages, exportName: 'CitiesPage' }),

    guardedRoute({ path: 'message-sections', section: S.message_alerts, importer: crudPages, exportName: 'MessageSectionsPage' }),
    guardedRoute({ path: 'message-section-items', section: S.message_alerts, importer: crudPages, exportName: 'MessageSectionItemsPage' }),
    guardedRoute({ path: 'message-for-employee', section: S.message_alerts, importer: crudPages, exportName: 'MessageForEmployeePage' }),
    guardedRoute({ path: 'message-for-property', section: S.message_alerts, importer: crudPages, exportName: 'MessageForPropertyPage' }),
    guardedRoute({ path: 'customer-app-messages', section: S.app_content, importer: crudPages, exportName: 'CustomerAppMessagesPage' }),
    guardedRoute({ path: 'payment-types', section: S.app_content, importer: crudPages, exportName: 'PaymentTypesPage' }),
    guardedRoute({ path: 'terms', section: S.app_content, importer: contentPages, exportName: 'TermsPage' }),
    guardedRoute({ path: 'privacy', section: S.app_content, importer: contentPages, exportName: 'PrivacyPage' }),

    guardedRoute({ path: 'contract-periods', section: S.contract_periods, importer: crudPages, exportName: 'ContractPeriodsPage' }),
    guardedRoute({ path: 'services-pricing', section: S.services_pricing, importer: crudPages, exportName: 'ServicesPricingPage' }),
    guardedRoute({ path: 'coupons', section: S.coupons, importer: crudPages, exportName: 'CouponsPage' }),
    guardedRoute({ path: 'faqs', section: S.faqs, importer: crudPages, exportName: 'FaqsPage' }),
    guardedRoute({ path: 'tenant-roles', section: S.tenant_roles, importer: crudPages, exportName: 'TenantRolesPage' }),
    guardedRoute({ path: 'paperworks', section: S.paperworks, importer: crudPages, exportName: 'PaperworksPage' }),

    guardedRoute({ path: 'notifications', section: S.notifications, importer: () => import('./pages/notifications-page'), exportName: 'NotificationsPage' }),
    guardedRoute({ path: 'payments', section: S.payments, importer: () => import('./pages/payments-page'), exportName: 'PaymentsPage' }),

    guardedRoute({ path: 'blogs', section: S.blogs, importer: () => import('./pages/blogs-page'), exportName: 'BlogsPage' }),
    // Specific paths first: `create` must not be read as a blog id.
    guardedRoute({ path: 'blogs/create', section: S.blogs, action: 'create', importer: blogPages, exportName: 'BlogCreatePage' }),
    guardedRoute({ path: 'blogs/:id', section: S.blogs, importer: blogPages, exportName: 'BlogDetailsPage' }),
    guardedRoute({ path: 'blogs/:id/edit', section: S.blogs, action: 'edit', importer: blogPages, exportName: 'BlogEditPage' }),
  ],
};
