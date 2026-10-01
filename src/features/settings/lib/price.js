const PRICE_LOCALE = 'ar-SA';
const CURRENCY_SUFFIX = 'ر.س';

/** "150 ر.س" style text; returns '—' when there is no price. */
export function formatPrice(price) {
  if (price === null || price === undefined || price === '') return '—';
  const value = Number(price);
  if (!Number.isFinite(value)) return String(price);
  return `${value.toLocaleString(PRICE_LOCALE)} ${CURRENCY_SUFFIX}`;
}
