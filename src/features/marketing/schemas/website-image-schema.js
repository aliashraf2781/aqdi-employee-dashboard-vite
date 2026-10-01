import { z } from 'zod';

export const websiteImageSchema = z
  .object({
    static_path: z.string(),
    sort_order: z.string().refine((value) => value.trim() === '' || /^\d+$/.test(value.trim()), 'الترتيب يجب أن يكون رقمًا'),
    is_active: z.boolean(),
  })
  // The bilingual text fields (label_ar, alt_en ...) need no rules, they are optional.
  .passthrough();
