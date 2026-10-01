/*
 * The marketing API returns numbers already computed (ROAS, CAC, funnel rates).
 * These helpers only add digit grouping, the currency label and the "—" convention.
 */
export const DASH = '—';
export const DEFAULT_CURRENCY_LABEL = '﷼';

function isMissing(value) {
  return value == null || value === '' || Number.isNaN(Number(value));
}

export function formatInt(value) {
  return isMissing(value) ? DASH : Number(value).toLocaleString('en-US');
}

export function formatMoney(value, currencyLabel = DEFAULT_CURRENCY_LABEL) {
  return isMissing(value) ? DASH : `${Number(value).toLocaleString('en-US')} ${currencyLabel}`;
}

/** Profit / loss: a "+" is added in front of positive amounts. */
export function formatSignedMoney(value, currencyLabel = DEFAULT_CURRENCY_LABEL) {
  if (isMissing(value)) return DASH;
  const sign = Number(value) > 0 ? '+' : '';
  return `${sign}${Number(value).toLocaleString('en-US')} ${currencyLabel}`;
}

/** ROAS text: `x2.28`, or a dash when there is no spend. */
export function formatRoas(value) {
  return isMissing(value) ? DASH : `x${Number(value)}`;
}

export function formatPercent(value) {
  return isMissing(value) ? DASH : `${Number(value)}%`;
}

/** Percent-encoded paths (Arabic slugs) made readable; leaves bad sequences untouched. */
export function decodeUriText(value) {
  if (value == null) return value;
  const text = String(value);
  if (!/%[0-9A-Fa-f]{2}/.test(text)) return text;

  try {
    return decodeURIComponent(text);
  } catch {
    return text.replace(/(?:%[0-9A-Fa-f]{2})+/g, (sequence) => {
      try {
        return decodeURIComponent(sequence);
      } catch {
        return sequence;
      }
    });
  }
}
