import { toBoolean, unwrapSettingsRecord } from '@/shared/lib/settings-record';

export const GENERAL_SETTINGS_QUERY_KEY = 'general-settings';
export const GENERAL_SETTINGS_PATH = '/admin/settings/general';

export const GENERAL_SETTINGS_FIELDS = [
  { key: 'apple_store', label: 'متجر Apple' },
  { key: 'android_store', label: 'متجر Android' },
  { key: 'website_status', label: 'حالة الموقع' },
  { key: 'thank_you_card', label: 'بطاقة الشكر' },
];

const DEFAULT_GENERAL_SETTINGS = {
  apple_store: false,
  android_store: true,
  website_status: true,
  thank_you_card: true,
};

/** An entry is either a plain boolean-ish value or `{ key, label, enabled }`. */
function readEnabled(entry, fallback) {
  const isObject = entry && typeof entry === 'object' && !Array.isArray(entry);
  return toBoolean(isObject && 'enabled' in entry ? entry.enabled : entry, fallback);
}

/** API response -> `{ apple_store: true, ... }` with defaults for anything missing. */
export function extractGeneralSettings(body) {
  const record = unwrapSettingsRecord(body);
  return Object.fromEntries(
    GENERAL_SETTINGS_FIELDS.map(({ key }) => [key, record ? readEnabled(record[key], DEFAULT_GENERAL_SETTINGS[key]) : DEFAULT_GENERAL_SETTINGS[key]]),
  );
}
