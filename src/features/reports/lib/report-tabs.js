export const REPORT_TABS = [
  { id: 'orders', label: 'الطلبات' },
  { id: 'sales', label: 'المبيعات والإيرادات', badge: 'مالي' },
  { id: 'profits', label: 'الأرباح والتكاليف', badge: 'مالي' },
  { id: 'operating-expenses', label: 'المصروفات التشغيلية', badge: 'مالي' },
  { id: 'employees', label: 'الموظفون' },
  { id: 'customers', label: 'العملاء' },
  { id: 'marketing', label: 'المصادر والتسويق' },
  { id: 'performance', label: 'لوحة الأداء' },
];

export const DEFAULT_REPORT_TAB = 'orders';

/** Old links used other tab names; they now point at the tab that replaced them. */
const TAB_ALIASES = {
  overview: 'orders',
  financial: 'sales',
  expenses: 'operating-expenses',
  staff: 'employees',
  users: 'customers',
  properties: 'orders',
  units: 'orders',
  returns: 'orders',
};

export function resolveReportTab(rawTab) {
  const tabId = TAB_ALIASES[rawTab] ?? rawTab;
  return REPORT_TABS.some((tab) => tab.id === tabId) ? tabId : DEFAULT_REPORT_TAB;
}
