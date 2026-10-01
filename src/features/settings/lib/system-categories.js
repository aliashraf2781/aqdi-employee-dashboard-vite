import { PERMISSION_SECTIONS } from '@/features/permissions';

const S = PERMISSION_SECTIONS;
const SETTINGS_BASE = '/home/settings';

/**
 * The cards on the system settings hub. Each one links to a settings page and is shown
 * only if the user may view its permission `section`.
 * `countLabel` cards also show how many rows the list holds; `subtitle` cards show fixed text.
 */
export const SYSTEM_CATEGORIES = [
  { id: 'app-status', label: 'حالة التطبيق والإصدارات', subtitle: 'تشغيل/إيقاف · إصدارات الجوال', section: S.settings },
  { id: 'unit-types', label: 'أنواع الوحدات', countLabel: 'قائمة بقيم', section: S.property_reference },
  { id: 'unit-usage', label: 'استخدام الوحدة', countLabel: 'قائمة بقيم', section: S.property_reference },
  { id: 'regions', label: 'المناطق', countLabel: 'قائمة', section: S.regions },
  { id: 'cities', label: 'المدن', countLabel: 'قائمة بقيم', section: S.cities },
  { id: 'property-types', label: 'أنواع العقار', countLabel: 'قائمة بقيم', section: S.property_reference },
  { id: 'property-usage', label: 'استخدام العقار', countLabel: 'قائمة بقيم', section: S.property_reference },
  { id: 'message-sections', label: 'أقسام الرسائل', countLabel: 'سجلات', section: S.message_alerts },
  { id: 'message-section-items', label: 'بنود أقسام الرسائل', countLabel: 'قائمة بقيم', section: S.message_alerts },
  { id: 'customer-app-messages', label: 'الرسائل التطبيقية للعميل', countLabel: 'رسائل موجّهة', section: S.app_content },
  { id: 'message-for-employee', label: 'رسائل توضيحية للموظفين', countLabel: 'رسائل موجّهة', section: S.message_alerts },
  { id: 'message-for-property', label: 'رسائل توضيحية للعقار', countLabel: 'رسائل موجّهة', section: S.message_alerts },
  { id: 'coupons', label: 'الخصومات (الكوبونات)', countLabel: 'كوبونات', section: S.coupons },
  { id: 'blogs', label: 'المدونة', subtitle: 'رابط', section: S.blogs },
  { id: 'faqs', label: 'الأسئلة الشائعة', countLabel: 'أسئلة وأجوبة', section: S.faqs },
  { id: 'terms', label: 'الشروط والأحكام', subtitle: 'محتوى نصّي', section: S.app_content },
  { id: 'privacy', label: 'سياسة الخصوصية', subtitle: 'محتوى نصّي', section: S.app_content },
  { id: 'notifications', label: 'الإشعارات', subtitle: 'إرسال إشعار', section: S.notifications },
  { id: 'payments', label: 'المدفوعات', subtitle: 'سجل المدفوعات', section: S.payments },
  { id: 'payment-types', label: 'طرق الدفع', countLabel: 'سجلات', section: S.app_content },
  { id: 'contract-periods', label: 'مدة العقد', subtitle: 'مدد السكني والتجاري', section: S.contract_periods },
  { id: 'services-pricing', label: 'أسعار الخدمات', subtitle: 'أسعار السكني والتجاري', section: S.services_pricing },
  { id: 'tenant-roles', label: 'صلاحيات المستأجر', countLabel: 'سجلات', section: S.tenant_roles },
  { id: 'paperworks', label: 'أوراق العمل', countLabel: 'سجلات', section: S.paperworks },
].map((category) => ({ ...category, href: `${SETTINGS_BASE}/${category.id}` }));

/** Second line of a category card: "label · N عنصر" while/after counting, or the fixed subtitle. */
export function categorySubtitle(category, count) {
  if (!category.countLabel) return category.subtitle ?? '';
  if (typeof count === 'number') return `${category.countLabel} · ${count} عنصر`;
  if (count === null) return `${category.countLabel} · …`;
  return category.countLabel;
}
