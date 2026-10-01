import { stripHtml } from '@/shared/lib/html';

export const PUBLISH_MODES = { now: 'now', schedule: 'schedule', draft: 'draft' };

export const PUBLISH_MODE_OPTIONS = [
  { value: PUBLISH_MODES.now, label: 'نشر فوري', description: 'نشر المقال الآن' },
  { value: PUBLISH_MODES.schedule, label: 'جدولة', description: 'تحديد وقت النشر' },
  { value: PUBLISH_MODES.draft, label: 'مسودة', description: 'حفظ بدون نشر' },
];

export const BLOG_STATUS = {
  published: { label: 'منشور', tone: 'success' },
  draft: { label: 'مسودة', tone: 'warning' },
};

const pad = (value) => String(value).padStart(2, '0');

/** "2026-03-01 14:05:00" — the format the API expects for `publish_at`. */
export function formatApiDateTime(date) {
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/** "2026-03-01T14:05" — the format `<input type="datetime-local">` uses. */
export function toDateTimeLocalValue(date) {
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export const isBlogActive = (blog) => [1, true].includes(blog?.is_active ?? blog?.isActive);

export const EMPTY_BLOG_FORM = {
  title: '',
  description: '',
  meta_title: '',
  meta_description: '',
  is_active: true,
  publishMode: PUBLISH_MODES.draft,
  publish_at: '',
  image: null,
};

/** Blog from the API -> form values. A published blog with a date counts as "scheduled". */
export function blogToFormValues(blog) {
  const publishAt = blog.publish_at || blog.timePublish;
  let publishMode = PUBLISH_MODES.draft;
  let publishAtInput = '';

  if (blog.status === 'published') {
    publishMode = publishAt ? PUBLISH_MODES.schedule : PUBLISH_MODES.now;
    if (publishAt) publishAtInput = toDateTimeLocalValue(new Date(publishAt));
  }

  return {
    title: blog.title || '',
    description: blog.description || '',
    meta_title: blog.meta_title || blog.metaTitle || '',
    meta_description: blog.meta_description || blog.metaDescription || '',
    is_active: isBlogActive(blog),
    publishMode,
    publish_at: publishAtInput,
    image: null,
  };
}

function resolvePublication(values, now) {
  if (values.publishMode === PUBLISH_MODES.now) return { status: 'published', publishAt: formatApiDateTime(now) };
  if (values.publishMode === PUBLISH_MODES.schedule && values.publish_at) {
    return { status: 'published', publishAt: formatApiDateTime(new Date(values.publish_at)) };
  }
  return { status: 'draft', publishAt: '' };
}

/** Form values -> multipart body (the blog may carry an image file). */
export function buildBlogFormData(values, now = new Date()) {
  const formData = new FormData();
  const { status, publishAt } = resolvePublication(values, now);

  formData.append('title', values.title);
  formData.append('description', values.description);
  formData.append('meta_title', values.meta_title || '');
  formData.append('meta_description', values.meta_description || '');
  formData.append('is_active', values.is_active ? '1' : '0');
  formData.append('status', status);
  if (publishAt) formData.append('publish_at', publishAt);
  if (values.image instanceof File) formData.append('image', values.image);

  return formData;
}

export const isBlogContentEmpty = (html) => stripHtml(html) === '';
