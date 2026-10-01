const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function formatNumber(value) {
  return Number(value ?? 0).toLocaleString('en-US');
}

export function formatMoney(value) {
  return `${formatNumber(value)} ريال`;
}

/** Money for table cells; "—" when the API sent nothing. */
export function formatMoneyOrDash(value) {
  return value != null ? `${formatNumber(value)} ر.س` : '—';
}

export function toArabicDigits(value) {
  return String(value).replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)]);
}

export function formatDuration(seconds) {
  const totalSeconds = Math.round(Number(seconds) || 0);
  if (totalSeconds < SECONDS_PER_MINUTE) return `${totalSeconds} ثانية`;

  const totalMinutes = Math.round(totalSeconds / SECONDS_PER_MINUTE);
  if (totalMinutes < MINUTES_PER_HOUR) return `${totalMinutes} دقيقة`;

  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  return `${hours} ساعة${minutes ? ` و${minutes} د` : ''}`;
}

export function formatHoursAndMinutes(totalMinutes) {
  const minutes = Number(totalMinutes) || 0;
  return `${Math.floor(minutes / MINUTES_PER_HOUR)} س و ${minutes % MINUTES_PER_HOUR} د`;
}

/** First non-null value found under any of `keys` (the API renamed some fields over time). */
export function pick(source, ...keys) {
  for (const key of keys) {
    if (source?.[key] != null) return source[key];
  }
  return undefined;
}

/** Normalises API rows into chart items: { label, value, detail, suffix }. */
export function toChartItems(rows = []) {
  return rows.map((row) => ({
    ...row,
    label: row.label ?? row.name ?? row.stage,
    value: Number(row.value ?? row.count ?? 0),
    detail: row.detail ?? row.sublabel,
  }));
}
