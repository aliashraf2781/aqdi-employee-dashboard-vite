import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح.'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.'),
  remember: z.boolean().default(false),
});
