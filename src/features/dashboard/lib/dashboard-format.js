const COUNT_LOCALE = 'ar-EG';
const MINUTE_MS = 60_000;
const NO_VALUE = '—';

export function formatCount(value) {
  return value == null ? NO_VALUE : value.toLocaleString(COUNT_LOCALE);
}

export function formatRevenue(value, currency = 'SAR') {
  if (value == null) return NO_VALUE;
  const formatted = value.toLocaleString(COUNT_LOCALE, { maximumFractionDigits: 0 });
  return currency === 'SAR' ? `${formatted} ر.س` : `${formatted} ${currency}`;
}

/** Arabic "x minutes/hours/days ago" label; empty when the date is missing or invalid. */
export function formatRelativeTime(iso, now = new Date()) {
  if (!iso) return '';
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '';

  const minutes = Math.floor((now.getTime() - then.getTime()) / MINUTE_MS);
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} د`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} س`;
  return `منذ ${Math.floor(hours / 24)} ي`;
}

export function formatClock(date) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const hour12 = hours % 12 || 12;
  const period = hours < 12 ? 'صباحاً' : 'مساءً';
  return `${hour12}:${minutes} ${period}`;
}

export function formatDay(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day} / ${month} / ${date.getFullYear()}`;
}

const NOON_HOUR = 12;

export function getGreeting(date) {
  return date.getHours() < NOON_HOUR ? 'صباح الخير' : 'مساء الخير';
}

export function getFirstName(fullName) {
  if (!fullName) return '';
  return fullName.trim().split(/\s+/)[0];
}
