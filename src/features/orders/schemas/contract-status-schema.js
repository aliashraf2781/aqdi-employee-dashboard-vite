import { z } from 'zod';

export const contractStatusSchema = z.object({
  name: z.string().trim().min(1, 'اسم الحالة مطلوب'),
  client_explanation: z.string().optional(),
  color: z.string().min(1, 'لون الخلفية مطلوب'),
  color_text: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean(),
});
