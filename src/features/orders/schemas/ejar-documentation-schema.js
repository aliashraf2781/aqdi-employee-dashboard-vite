import { z } from 'zod';

export const ejarDocumentationSchema = z.object({
  ejar_number: z.string().trim().min(1, 'رقم العقد في إيجار مطلوب'),
  notes: z.string().optional(),
});
