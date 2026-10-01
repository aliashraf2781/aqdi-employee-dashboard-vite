export const DEFAULT_KPI_PERIOD = 'today';
export const CUSTOM_PERIOD = 'custom';

/** Used until the API sends its own `periods` list. */
export const FALLBACK_KPI_PERIODS = [
  { key: 'today', label_ar: 'اليوم' },
  { key: 'yesterday', label_ar: 'أمس' },
  { key: 'last_7_days', label_ar: 'آخر 7 أيام' },
  { key: 'last_30_days', label_ar: 'آخر 30 يومًا' },
  { key: 'all', label_ar: 'كل الفترات' },
  { key: CUSTOM_PERIOD, label_ar: 'مدة محددة' },
];

export function hasValidDateRange(dateFrom, dateTo) {
  return Boolean(dateFrom && dateTo && dateFrom <= dateTo);
}

/** A custom period needs both dates before the API can be asked. */
export function needsDateRange(period, dateFrom, dateTo) {
  return period === CUSTOM_PERIOD && !hasValidDateRange(dateFrom, dateTo);
}

export function buildKpiParams(period, dateFrom, dateTo) {
  const params = { period };
  if (period === CUSTOM_PERIOD && hasValidDateRange(dateFrom, dateTo)) {
    params.date_from = dateFrom;
    params.date_to = dateTo;
  }
  return params;
}
