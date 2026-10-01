import { z } from 'zod';

export const blockEmployeeSchema = z.object({
  reason_of_block: z.string().trim().min(1, 'الرجاء إدخال سبب الحظر'),
  blocked_until: z.string().optional(),
});
