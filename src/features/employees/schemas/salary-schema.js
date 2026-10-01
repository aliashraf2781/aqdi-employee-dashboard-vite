import { z } from 'zod';

export const salarySchema = z.object({
  addition_date: z.string().min(1, 'تاريخ الإضافة مطلوب'),
  due_date: z.string().min(1, 'تاريخ الاستحقاق مطلوب'),
  basic_salary: z.string().min(1, 'الراتب الأساسي مطلوب'),
  deduction: z.string().optional(),
  bonus: z.string().optional(),
  total: z.string().min(1, 'المجموع مطلوب'),
});
