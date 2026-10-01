/** Period keys accepted by the marketing tracking / reports endpoints. */
export const MARKETING_PERIODS = [
  { key: 'today', label_ar: 'اليوم' },
  { key: 'yesterday', label_ar: 'أمس' },
  { key: 'last_7_days', label_ar: 'آخر 7 أيام' },
  { key: 'last_30_days', label_ar: 'آخر 30 يومًا' },
  { key: 'all', label_ar: 'الكل' },
  { key: 'custom', label_ar: 'مخصص' },
];

export const DEFAULT_PERIOD = 'last_30_days';
export const CUSTOM_PERIOD = 'custom';

export const PERIOD_PARAM = 'mkt_period';
export const PERIOD_FROM_PARAM = 'mkt_from';
export const PERIOD_TO_PARAM = 'mkt_to';

const VALID_KEYS = new Set(MARKETING_PERIODS.map((period) => period.key));
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Reads the period filter from raw url values.
 * `isCustom` is the UI intent (the date pickers stay open while only one date is picked);
 * the API query only switches to the custom range once both dates are valid.
 */
export function resolvePeriod({ rawPeriod, rawFrom, rawTo }) {
  const dateFrom = ISO_DATE.test(rawFrom || '') ? rawFrom : null;
  const dateTo = ISO_DATE.test(rawTo || '') ? rawTo : null;
  const hasValidRange = Boolean(dateFrom && dateTo && dateFrom <= dateTo);
  const isCustom = rawPeriod === CUSTOM_PERIOD;
  const period = isCustom ? CUSTOM_PERIOD : VALID_KEYS.has(rawPeriod) ? rawPeriod : DEFAULT_PERIOD;

  let queryParams = { period };
  if (isCustom && hasValidRange) queryParams = { period: CUSTOM_PERIOD, date_from: dateFrom, date_to: dateTo };
  else if (isCustom) queryParams = { period: DEFAULT_PERIOD };

  return { period, dateFrom, dateTo, isCustom, queryParams };
}

/** New url search params for a chosen period (keeps every unrelated param, e.g. `tab`). */
export function buildPeriodSearchParams(current, { period, dateFrom, dateTo }) {
  const params = new URLSearchParams(current);

  if (period === CUSTOM_PERIOD) {
    params.set(PERIOD_PARAM, CUSTOM_PERIOD);
    if (dateFrom) params.set(PERIOD_FROM_PARAM, dateFrom);
    else params.delete(PERIOD_FROM_PARAM);
    if (dateTo) params.set(PERIOD_TO_PARAM, dateTo);
    else params.delete(PERIOD_TO_PARAM);
    return params;
  }

  if (!period || period === DEFAULT_PERIOD) params.delete(PERIOD_PARAM);
  else params.set(PERIOD_PARAM, period);
  params.delete(PERIOD_FROM_PARAM);
  params.delete(PERIOD_TO_PARAM);
  return params;
}
