const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

/** "5 دقيقة" / "3 ساعة" / "2 يوم" since `dateString`, or null when the date is missing or invalid. */
export function formatRelativeShort(dateString, now = Date.now()) {
  if (!dateString) return null;
  const diffMs = now - new Date(dateString).getTime();
  if (!Number.isFinite(diffMs)) return null;

  const minutes = Math.floor(diffMs / MS_PER_MINUTE);
  if (minutes < 1) return 'الآن';
  if (minutes < MINUTES_PER_HOUR) return `${minutes} دقيقة`;

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  if (hours < HOURS_PER_DAY) return `${hours} ساعة`;
  return `${Math.floor(hours / HOURS_PER_DAY)} يوم`;
}

/** "منذ 5د" / "منذ 2 يوم و 3 س" style used on the realtime new-requests cards. */
export function formatRelativeTimeAr(dateString, now = Date.now()) {
  if (!dateString) return '—';
  const minutes = Math.floor((now - new Date(dateString).getTime()) / MS_PER_MINUTE);
  if (minutes < 1) return 'الآن';
  if (minutes < MINUTES_PER_HOUR) return `منذ ${minutes}د`;

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  if (hours < HOURS_PER_DAY) return `منذ ${hours} س`;

  const days = Math.floor(hours / HOURS_PER_DAY);
  const remainingHours = hours % HOURS_PER_DAY;
  return remainingHours > 0 ? `منذ ${days} يوم و ${remainingHours} س` : `منذ ${days} يوم`;
}
