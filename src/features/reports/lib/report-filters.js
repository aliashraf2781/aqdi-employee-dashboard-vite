export const DEFAULT_FILTER_VALUE = 'all';

export const REPORT_PERIODS = [
  { id: 'all', label: 'الكل' },
  { id: 'last_30_days', label: 'هذا الشهر' },
  { id: 'last_7_days', label: 'آخر ٧ أيام' },
  { id: 'today', label: 'اليوم' },
  { id: 'custom', label: 'مدة محددة' },
];

export const CONTRACT_TYPE_OPTIONS = [
  { id: 'all', label: 'كل الأنواع' },
  { id: 'housing', label: 'سكني' },
  { id: 'commercial', label: 'تجاري' },
];

export const PERIOD_LABELS = Object.fromEntries(REPORT_PERIODS.map((period) => [period.id, period.label]));

const KNOWN_PERIOD_IDS = new Set([...REPORT_PERIODS.map((period) => period.id), 'yesterday']);

/** Unknown or missing periods fall back to "all", like the API default. */
export function toApiPeriod(period) {
  return KNOWN_PERIOD_IDS.has(period) ? period : DEFAULT_FILTER_VALUE;
}

/** A custom period needs both dates, in order. Other periods are always valid. */
export function hasValidDateRange({ period, dateFrom, dateTo }) {
  if (period !== 'custom') return true;
  return Boolean(dateFrom && dateTo && dateFrom <= dateTo);
}

/** Query string params for the `/admin/reports/*` endpoints. */
export function buildReportParams({ period, dateFrom, dateTo, contractType, employee }) {
  const params = { period: toApiPeriod(period) };
  if (dateFrom && dateTo) {
    params.date_from = dateFrom;
    params.date_to = dateTo;
  }
  if (contractType && contractType !== DEFAULT_FILTER_VALUE) params.contract_type = contractType;
  if (employee && employee !== DEFAULT_FILTER_VALUE) params.employee_id = employee;
  return params;
}

/** Query string params for the employee KPI endpoint (period + dates only). */
export function buildPeriodParams({ period, dateFrom, dateTo }) {
  const params = { period: toApiPeriod(period) };
  if (dateFrom && dateTo) {
    params.date_from = dateFrom;
    params.date_to = dateTo;
  }
  return params;
}

/** A stale URL value (removed employee, typo) falls back to "all". */
export function resolveFilterValue(value, options) {
  if (!value) return DEFAULT_FILTER_VALUE;
  return options.some((option) => option.id === value) ? value : DEFAULT_FILTER_VALUE;
}

export function buildEmployeeOptions(employees = []) {
  const options = [{ id: DEFAULT_FILTER_VALUE, label: 'كل الموظفين' }];
  for (const employee of employees) {
    if (employee?.id == null) continue;
    options.push({ id: String(employee.id), label: employee.name?.trim() || `موظف #${employee.id}` });
  }
  return options;
}

/** The list endpoint answers in several shapes; this returns the array of items. */
export function extractListItems(body) {
  const root = body?.data ?? body;
  if (Array.isArray(root?.items)) return root.items;
  if (Array.isArray(root?.data?.items)) return root.data.items;
  if (Array.isArray(root?.data)) return root.data;
  if (Array.isArray(root)) return root;
  return [];
}
