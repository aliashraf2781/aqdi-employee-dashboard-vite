const TWO_DIGITS = '2-digit';

/** "14:05 · 03/02/2026" or "—" for a missing/invalid date. */
export function formatDateTimeShort(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';

  const time = date.toLocaleTimeString('en-GB', { hour: TWO_DIGITS, minute: TWO_DIGITS, hour12: false });
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${time} · ${day}/${month}/${date.getFullYear()}`;
}

/** "03/02/2026 - 14:05" (day first, 24h) or null when there is no date. */
export function formatStamp(dateString) {
  const date = dateString ? new Date(dateString) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  return date
    .toLocaleString('en-GB', { day: TWO_DIGITS, month: TWO_DIGITS, year: 'numeric', hour: TWO_DIGITS, minute: TWO_DIGITS, hour12: false })
    .replace(',', ' -');
}
