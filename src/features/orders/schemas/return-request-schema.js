import { z } from 'zod';

export const returnRequestSchema = z.object({
  refund_amount: z
    .string()
    .trim()
    .min(1, 'يرجى إدخال قيمة المبلغ المسترجع')
    .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, 'يرجى إدخال قيمة مبلغ مسترجع صحيحة'),
  notes: z.string().optional(),
  contract_file: z.any().nullable(),
});

export const returnRequestDefaults = { refund_amount: '', notes: '', contract_file: null };

/** Text the employee copies and sends to the customer to collect bank details. */
export const RETURN_WHATSAPP_MESSAGE = `عميلنا العزيز،

الرجاء تعبئة البيانات لإتمام طلب الاسترجاع :
أسم البنك :
أسم صاحب الحساب :
رقم الحساب او الآيبان :
🔴 يشترط ان يكون رقم الحساب هو نفس وفي حالة تغييره سيتم رفض الطلب
⏱️ سيتم استرجاع المبلغ خلال يوم إلى 3 أيام عمل

شكراً لتفهمكم.`;
