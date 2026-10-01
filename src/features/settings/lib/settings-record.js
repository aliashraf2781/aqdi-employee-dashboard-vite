/**
 * Several settings endpoints return one record, wrapped differently
 * (`{data}`, `{data: {items: [record]}}`, `{data: {settings: record}}`). Unwrap to the record.
 */
export function unwrapSettingsRecord(body) {
  const data = body?.data ?? body;
  if (!data || typeof data !== 'object') return null;
  if (Array.isArray(data.items)) return data.items[0] ?? null;
  if (data.settings && typeof data.settings === 'object') return data.settings;
  return data;
}

/** Interprets the many ways the API spells a boolean (true, 1, "1", "yes"...). */
export function toBoolean(value, fallback = false) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['false', '0', 'no', ''].includes(normalized)) return false;
    if (['true', '1', 'yes'].includes(normalized)) return true;
  }
  return Boolean(value);
}
