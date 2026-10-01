/*
 * Website-images catalog: alt / meta title / meta description (Arabic + English)
 * for the images of the public site. Permission section: `website_images`.
 */
export const WEBSITE_IMAGES_ENDPOINT = '/admin/website-images';
export const WEBSITE_IMAGES_QUERY_KEY = 'website-images';

/** Public site origin: its static `/website/...` files are not served by the API host. */
export const PUBLIC_WEBSITE_ORIGIN = import.meta.env?.VITE_WEBSITE_ORIGIN || 'https://aqdi.sa';

export const WEBSITE_IMAGE_SUMMARY_CARDS = [
  { key: 'total', label: 'إجمالي الصور' },
  { key: 'active', label: 'المفعّلة' },
  { key: 'with_alt', label: 'لديها نص بديل' },
  { key: 'with_meta', label: 'لديها ميتا' },
];

/** Bilingual (ar/en) text fields of the edit dialog; `label` is the admin-only name. */
export const WEBSITE_IMAGE_TEXT_FIELDS = [
  { key: 'label', label: 'التسمية الإدارية', hint: 'اسم يظهر في هذه الشاشة فقط للتعرّف على الصورة.', multiline: false },
  {
    key: 'alt',
    label: 'النص البديل (alt)',
    hint: 'يصف الصورة لقارئات الشاشة ومحركات البحث. اتركه فارغًا للرجوع للنص الافتراضي.',
    multiline: false,
  },
  { key: 'meta_title', label: 'عنوان الميتا', hint: 'عنوان SEO المرتبط بالصورة (اختياري).', multiline: false },
  {
    key: 'meta_description',
    label: 'وصف الميتا',
    hint: 'وصف SEO مختصر يظهر في نتائج البحث (اختياري).',
    multiline: true,
  },
];

const TEXT_FORM_KEYS = WEBSITE_IMAGE_TEXT_FIELDS.flatMap(({ key }) => [`${key}_ar`, `${key}_en`]);

function toText(value) {
  return value == null ? '' : String(value);
}

/** Normalizes the list payload into `{ summary, items }`. */
export function extractWebsiteImages(responseData) {
  const payload = responseData?.data ?? responseData ?? {};
  const items = [payload.items, payload.data].find(Array.isArray) ?? [];
  return { summary: payload.summary ?? {}, items };
}

/**
 * Best-effort image url for a row. The API often returns `<api-host>/website/...` which 404s;
 * those static assets live on the public site, so they are re-pointed there.
 */
export function resolveImageUrl(item = {}) {
  const raw = (item.url || item.path || item.static_path || '').trim();
  if (!raw) return '';

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      return parsed.pathname.startsWith('/website/') ? `${PUBLIC_WEBSITE_ORIGIN}${parsed.pathname}${parsed.search}` : raw;
    } catch {
      return raw;
    }
  }

  return `${PUBLIC_WEBSITE_ORIGIN}${raw.startsWith('/') ? raw : `/${raw}`}`;
}

export const EMPTY_WEBSITE_IMAGE_FORM = {
  ...Object.fromEntries(TEXT_FORM_KEYS.map((key) => [key, ''])),
  static_path: '',
  sort_order: '',
  is_active: true,
};

export function websiteImageToForm(item) {
  if (!item) return { ...EMPTY_WEBSITE_IMAGE_FORM };
  return {
    ...Object.fromEntries(TEXT_FORM_KEYS.map((key) => [key, toText(item[key])])),
    static_path: toText(item.static_path),
    sort_order: toText(item.sort_order),
    is_active: item.is_active !== false,
  };
}

/** Multipart body for create/update. `key` is only sent on create. */
export function buildWebsiteImageFormData(form, { imageFile, key } = {}) {
  const body = new FormData();
  if (key) body.append('key', key);

  TEXT_FORM_KEYS.forEach((field) => body.append(field, (form[field] ?? '').trim()));

  const staticPath = (form.static_path ?? '').trim();
  if (staticPath) body.append('static_path', staticPath);

  const sortOrder = String(form.sort_order ?? '').trim();
  if (sortOrder !== '') body.append('sort_order', sortOrder);

  body.append('is_active', form.is_active ? '1' : '0');
  if (imageFile instanceof File) body.append('image', imageFile);
  return body;
}
