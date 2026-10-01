/** Endpoints of the public-site content pages edited from the admin. */
export const CONTENT_PAGE_ENDPOINTS = {
  home: '/admin/content-pages/home',
  about: '/admin/content-pages/about',
  /** Blogs index: page-level SEO only. */
  blogs: '/admin/content-pages/blogs',
  /** Services index: page-level SEO only. */
  services: '/admin/content-pages/services',
  /** FAQs index: page-level SEO only. */
  faqs: '/admin/content-pages/faqs',
};

export const CONTENT_PAGE_QUERY_KEY = 'content-page';

const META_FIELDS = ['meta_title', 'meta_description'];

export function getStringValue(value, fallback = '') {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return fallback;
}

/** Client-side id for a freshly added card. The server merges cards by `id`. */
export function newLocalId() {
  return `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function extractContentSections(responseData) {
  const payload = responseData?.data ?? responseData;
  return payload?.sections ?? payload ?? {};
}

/**
 * Page-level SEO meta from a content-page payload. Accepts top-level fields or a nested
 * `meta` / `seo` object, and the legacy `*_ar` names.
 */
export function extractPageMeta(responseData) {
  const payload = responseData?.data ?? responseData ?? {};
  const nested = [payload.meta, payload.seo].find((value) => value && typeof value === 'object');
  const meta = nested ?? payload;

  return {
    meta_title: getStringValue(meta.meta_title ?? meta.meta_title_ar),
    meta_description: getStringValue(meta.meta_description ?? meta.meta_description_ar),
  };
}

/** Multipart body for saving page-level SEO (top-level keys, no section prefix). */
export function buildPageMetaFormData(fields = {}) {
  const formData = new FormData();
  META_FIELDS.forEach((key) => formData.append(key, String(fields[key] ?? '').trim()));
  return formData;
}

/**
 * `{ [fieldKey]: file }` when a new file was picked, otherwise a `keep_<keepKey>` flag
 * (`keepKey` differs from `fieldKey` e.g. "license_file" / "license").
 */
export function assetFormValue(file, isRemoved, fieldKey = 'image', keepKey = fieldKey) {
  if (file instanceof File) return { [fieldKey]: file };
  return { [`keep_${keepKey}`]: isRemoved ? '0' : '1' };
}

function appendFormFields(formData, prefix, fields) {
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const fieldKey = `${prefix}[${key}]`;

    if (value instanceof File) {
      formData.append(fieldKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => appendFormFields(formData, `${fieldKey}[${index}]`, item));
    } else if (typeof value === 'object') {
      appendFormFields(formData, fieldKey, value);
    } else {
      formData.append(fieldKey, String(value).trim());
    }
  });
}

/**
 * Multipart payload for a content section, e.g.
 * buildSectionFormData('app', { badge_text: 'x', cards: [{ title: 'y' }] })
 * produces `app[badge_text]` and `app[cards][0][title]`.
 */
export function buildSectionFormData(prefix, fields) {
  const formData = new FormData();
  appendFormFields(formData, prefix, fields);
  return formData;
}
