import { z } from 'zod';
import { isSaudiMobile, SAUDI_PHONE_MESSAGE } from '@/features/employees/lib/saudi-phone';

const baseFields = {
  firstName: z.string().min(2, 'الإسم يجب أن يكون على الأقل حرفين'),
  lastName: z.string().min(2, 'الاسم الأخير يجب أن يكون على الأقل حرفين'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(1, 'رقم الجوال مطلوب').refine(isSaudiMobile, { message: SAUDI_PHONE_MESSAGE }),
  base_salary: z.string().min(1, 'الراتب الأساسي مطلوب'),
  role_id: z.string().min(1, 'الدور الوظيفي مطلوب'),
  is_active: z.enum(['1', '0']),
  work_period: z.enum(['morning', 'evening'], { required_error: 'فترة العمل مطلوبة' }),
};

/** Creating needs a password and a photo; editing may leave both untouched. */
export const createEmployeeSchema = z.object({
  ...baseFields,
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  image: z.any().refine((files) => files?.length > 0, 'الرجاء اختيار صورة'),
});

export const editEmployeeSchema = z.object({
  ...baseFields,
  password: z.string().optional(),
  image: z.any().optional(),
});
