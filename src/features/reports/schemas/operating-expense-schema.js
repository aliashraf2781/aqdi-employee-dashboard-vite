import { z } from 'zod';

export const operatingExpenseSchema = z.object({
  expense: z.string().trim().min(1, 'اسم المصروف مطلوب'),
  amount: z.coerce.number({ invalid_type_error: 'المبلغ يجب أن يكون رقما' }).min(0, 'المبلغ لا يمكن أن يكون سالبا'),
});

export const EMPTY_EXPENSE = { expense: '', amount: '' };
