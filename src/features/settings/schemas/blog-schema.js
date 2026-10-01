import { z } from 'zod';
import { PUBLISH_MODES, isBlogContentEmpty } from '@/features/settings/lib/blog';

export const blogSchema = z
  .object({
    title: z.string().trim().min(2, 'عنوان المقال مطلوب'),
    description: z.string().refine((html) => !isBlogContentEmpty(html), 'محتوى المقال مطلوب'),
    meta_title: z.string(),
    meta_description: z.string(),
    is_active: z.boolean(),
    publishMode: z.enum([PUBLISH_MODES.now, PUBLISH_MODES.schedule, PUBLISH_MODES.draft]),
    publish_at: z.string(),
    image: z.any().nullable(),
  })
  .superRefine((values, context) => {
    if (values.publishMode === PUBLISH_MODES.schedule && !values.publish_at) {
      context.addIssue({ code: 'custom', path: ['publish_at'], message: 'تاريخ ووقت النشر مطلوب عند الجدولة' });
    }
  });
