const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;

/** A new order waiting this long (minutes) is shown as a warning, then as critical. */
export const WARNING_WAIT_MINUTES = 15;
export const CRITICAL_WAIT_MINUTES = 30;

/** "ok" | "warning" | "critical" for how long a new order has been waiting. */
export function getWaitingSeverity(minutes) {
  if (minutes >= CRITICAL_WAIT_MINUTES) return 'critical';
  if (minutes >= WARNING_WAIT_MINUTES) return 'warning';
  return 'ok';
}

function pluralize(count, one, few) {
  return count === 1 ? one : `${count} ${few}`;
}

/** "2 أيام و 3 ساعات و 5 دقيقة" for a number of minutes. */
export function formatWaiting(minutes) {
  if (minutes < 1) return 'الآن';

  const days = Math.floor(minutes / MINUTES_PER_DAY);
  const hours = Math.floor((minutes % MINUTES_PER_DAY) / MINUTES_PER_HOUR);
  const mins = minutes % MINUTES_PER_HOUR;

  const parts = [];
  if (days > 0) parts.push(pluralize(days, '1 يوم', 'أيام'));
  if (hours > 0) parts.push(pluralize(hours, '1 ساعة', 'ساعات'));
  if (mins > 0) parts.push(pluralize(mins, 'دقيقة واحدة', 'دقيقة'));
  return parts.join(' و ');
}

const HOURS_WARN = 3;
const HOURS_CRITICAL = 24;
const MS_PER_HOUR = 3_600_000;

/** How old a received order is, for coloring the "received since" badge. */
export function getReceivedUrgency(dateString, now = Date.now()) {
  const hours = (now - new Date(dateString).getTime()) / MS_PER_HOUR;
  if (hours >= HOURS_CRITICAL) return 'critical';
  if (hours >= HOURS_WARN) return 'warning';
  return 'ok';
}
