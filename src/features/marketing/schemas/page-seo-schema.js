import { z } from 'zod';

export const META_TITLE_MAX = 255;
export const META_DESCRIPTION_MAX = 500;

export const pageSeoSchema = z.object({
  meta_title: z.string().trim().max(META_TITLE_MAX, `الحد الأقصى ${META_TITLE_MAX} حرفًا`),
  meta_description: z.string().trim().max(META_DESCRIPTION_MAX, `الحد الأقصى ${META_DESCRIPTION_MAX} حرفًا`),
});
