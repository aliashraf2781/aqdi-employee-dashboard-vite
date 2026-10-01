/** API sends `joined_at` as `YYYY-MM-DD HH:mm` (no timezone). */
export function splitJoinedDateTime(value) {
  if (!value) return { time: '—', date: '—' };
  const match = String(value).trim().match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/);
  if (match) return { date: match[1], time: match[2] };

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { time: '—', date: String(value) };
  return {
    time: parsed.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
    date: parsed.toLocaleDateString('en-CA'),
  };
}

export function formatJoinedLabel(value) {
  const { date, time } = splitJoinedDateTime(value);
  if (date === '—' && time === '—') return '—';
  if (time === '—') return date;
  return `${date} · ${time}`;
}

export function formatJoinedShort(value) {
  return splitJoinedDateTime(value).date;
}

/** Sortable string for a joined date, or '' when there is none. */
export function joinedSortKey(value) {
  const { date, time } = splitJoinedDateTime(value);
  if (date === '—') return '';
  return time === '—' ? date : `${date} ${time}`;
}

/** Newest/oldest first by joined date; rows without a date always go last. */
export function sortByJoinedDate(rows, direction) {
  const sign = direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const aKey = joinedSortKey(a?.joinedAt);
    const bKey = joinedSortKey(b?.joinedAt);
    if (!aKey && !bKey) return 0;
    if (!aKey) return 1;
    if (!bKey) return -1;
    if (aKey === bKey) return 0;
    return aKey < bKey ? -sign : sign;
  });
}

const SAUDI_COUNTRY_CODE = '966';

/** wa.me link for a Saudi mobile number, or null when there are no digits. */
export function whatsappHref(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith(SAUDI_COUNTRY_CODE)) return `https://wa.me/${digits}`;
  const national = digits.startsWith('0') ? digits.slice(1) : digits;
  return `https://wa.me/${SAUDI_COUNTRY_CODE}${national}`;
}

export function formatMoney(value) {
  return (Number(value) || 0).toLocaleString('en-US');
}

export function formatMoneyWithDecimals(value) {
  return (Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
