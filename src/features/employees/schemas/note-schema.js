import { z } from 'zod';

export const noteSchema = z.object({
  addition_date: z.string().min(1, 'تاريخ الإضافة مطلوب'),
  note: z.string().min(1, 'الملاحظة مطلوبة'),
});
