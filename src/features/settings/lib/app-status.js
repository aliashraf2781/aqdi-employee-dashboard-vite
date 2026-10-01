import { toBoolean, unwrapSettingsRecord } from '@/shared/lib/settings-record';

export const APP_STATUS_QUERY_KEY = 'app-status';
export const APP_STATUS_PATH = '/admin/settings/app-status';

export const PLATFORMS = [
  { key: 'ios', label: 'إصدار iOS' },
  { key: 'android', label: 'إصدار Android' },
];

/** Version form inputs per platform. Android has no in-app update messages. */
export const PLATFORM_VERSION_FIELDS = {
  ios: [
    { name: 'latest_version', label: 'أحدث إصدار', placeholder: '1.2.0' },
    { name: 'min_version', label: 'أدنى إصدار مدعوم', placeholder: '1.1.0' },
    { name: 'store_url', label: 'رابط المتجر', placeholder: 'https://apps.apple.com/app/aqdi' },
    { name: 'message_ar', label: 'رسالة التحديث (عربي)', placeholder: 'يرجى تحديث التطبيق لمتابعة الاستخدام', type: 'textarea' },
    { name: 'message_en', label: 'رسالة التحديث (إنجليزي)', placeholder: 'Please update the app to continue', type: 'textarea', dir: 'ltr' },
  ],
  android: [
    { name: 'latest_version', label: 'أحدث إصدار', placeholder: '1.2.0' },
    { name: 'min_version', label: 'أدنى إصدار مدعوم', placeholder: '1.1.0' },
    { name: 'store_url', label: 'رابط المتجر', placeholder: 'https://play.google.com/store/apps/details?id=sa.aqdi' },
  ],
};

export const WEBSITE_MESSAGE_FIELDS = [
  { name: 'message_ar', label: 'رسالة الإغلاق (عربي)', placeholder: 'الموقع مغلق حالياً بسبب أعمال التطوير' },
  { name: 'message_en', label: 'رسالة الإغلاق (إنجليزي)', placeholder: 'The website is temporarily closed for maintenance', dir: 'ltr' },
];

export const EMPTY_WEBSITE_FORM = { is_open: true, message_ar: '', message_en: '' };

export const EMPTY_PLATFORM_FORM = {
  ios: { latest_version: '', min_version: '', force_update: false, store_url: '', message_ar: '', message_en: '' },
  android: { latest_version: '', min_version: '', force_update: false, store_url: '' },
};

function extractPlatform(record, platform) {
  const source = record?.[platform] ?? {};
  const base = EMPTY_PLATFORM_FORM[platform];
  return Object.fromEntries(
    Object.keys(base).map((key) => [key, key === 'force_update' ? toBoolean(source[key], base[key]) : (source[key] ?? base[key])]),
  );
}

/** API response -> the three blocks the screen edits. */
export function extractAppStatus(body) {
  const record = unwrapSettingsRecord(body);
  if (!record) {
    return {
      website: { ...EMPTY_WEBSITE_FORM },
      mobile: { is_open: true },
      ios: { ...EMPTY_PLATFORM_FORM.ios },
      android: { ...EMPTY_PLATFORM_FORM.android },
    };
  }

  const website = record.website ?? {};
  return {
    website: {
      is_open: toBoolean(website.is_open, true),
      message_ar: website.message_ar ?? '',
      message_en: website.message_en ?? '',
    },
    mobile: { is_open: toBoolean(record.mobile?.is_open, true) },
    ios: extractPlatform(record, 'ios'),
    android: extractPlatform(record, 'android'),
  };
}

export const buildMobilePayload = (isOpen) => ({ mobile: { is_open: Boolean(isOpen) } });

export function buildWebsitePayload(form) {
  return {
    website: {
      is_open: Boolean(form.is_open),
      message_ar: (form.message_ar ?? '').trim(),
      message_en: (form.message_en ?? '').trim(),
    },
  };
}

export function buildPlatformPayload(platform, form) {
  const payload = { force_update: Boolean(form.force_update) };
  PLATFORM_VERSION_FIELDS[platform].forEach(({ name }) => {
    payload[name] = (form[name] ?? '').trim();
  });
  return { [platform]: payload };
}
