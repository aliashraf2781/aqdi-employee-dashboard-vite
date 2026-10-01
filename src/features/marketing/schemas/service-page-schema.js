import { z } from 'zod';

export const SERVICE_PAGE_STATUS_OPTIONS = [
  { value: 'published', label: 'منشور' },
  { value: 'draft', label: 'مسودة' },
  { value: 'archived', label: 'مؤرشف' },
];

export const servicePageSchema = z.object({
  title: z.string().trim().min(1, 'العنوان مطلوب'),
  path: z.string().trim().min(1, 'الرابط مطلوب'),
  target_keyword: z.string().trim(),
  meta_title: z.string().trim(),
  meta_description: z.string().trim(),
  status: z.enum(['published', 'draft', 'archived']),
});

export const EMPTY_SERVICE_PAGE = {
  title: '',
  path: '',
  target_keyword: '',
  meta_title: '',
  meta_description: '',
  status: 'draft',
};

export const servicePageToForm = (page) => ({
  title: page.title || '',
  path: page.path || '',
  target_keyword: page.target_keyword || '',
  meta_title: page.meta_title || '',
  meta_description: page.meta_description || '',
  status: page.status || 'draft',
});
