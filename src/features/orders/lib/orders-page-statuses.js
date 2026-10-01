/** Status chips shown on order list pages, with the name fragments that identify each one in the API. */
export const ORDERS_PAGE_STATUS_FILTERS = [
  { label: 'جديد', match: ['جديد'] },
  { label: 'استرجاع', match: ['استرجاع', 'مسترج'] },
  { label: 'ملغى', match: ['ملغى', 'ملغي', 'ملغ'] },
  { label: 'معلق', match: ['معلق', 'معلّق'] },
  { label: 'مستلم', match: ['مستلم', 'استلام'] },
  { label: 'تم التوثيق', match: ['تم التوثيق', 'توثيق', 'موثق'] },
];

/** Default chip on order list pages. */
export const DEFAULT_ORDERS_PAGE_STATUS_LABEL = 'جديد';

function normalizeStatusName(value = '') {
  return String(value).trim().replace(/\s+/g, ' ');
}

function matchesStatusName(name, patterns) {
  const normalized = normalizeStatusName(name);
  return patterns.some(
    (pattern) => normalized === pattern || normalized.includes(pattern) || pattern.includes(normalized),
  );
}

/** Keeps only the statuses that have a chip, renamed to the chip label. */
export function filterOrdersPageStatusItems(statusItems = []) {
  return ORDERS_PAGE_STATUS_FILTERS.map(({ label, match }) => {
    const found = statusItems.find((item) => matchesStatusName(item?.name, match));
    return found ? { ...found, name: label } : null;
  }).filter(Boolean);
}

export function findOrdersPageStatusIdByLabel(statusItems = [], label = DEFAULT_ORDERS_PAGE_STATUS_LABEL) {
  const filter = ORDERS_PAGE_STATUS_FILTERS.find((item) => item.label === label);
  const patterns = filter?.match ?? [label];
  const found = statusItems.find((item) => matchesStatusName(item?.name, patterns));
  return found?.id ?? null;
}

export function getDefaultOrdersPageStatusId(statusItems = []) {
  return findOrdersPageStatusIdByLabel(statusItems, DEFAULT_ORDERS_PAGE_STATUS_LABEL);
}
