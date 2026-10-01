const LOCALE = 'ar-SA';

export function formatCurrency(value, currency = 'SAR') {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat(LOCALE, { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(value));
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium' }).format(date);
}
