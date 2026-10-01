import { z } from 'zod';
import { APPLIES_TO_OPTIONS, DISCOUNT_TYPES } from '@/features/clients/lib/client-discount';

export const DEFAULT_DISCOUNT_VALUES = {
  type: DISCOUNT_TYPES.PERCENTAGE,
  value: '',
  appliesTo: 'all',
  expiresAt: '',
  reason: '',
  notifyOnLogin: false,
  notificationMessage: '',
};

const appliesToValues = APPLIES_TO_OPTIONS.map((option) => option.value);

export const discountSchema = z
  .object({
    type: z.enum([DISCOUNT_TYPES.PERCENTAGE, DISCOUNT_TYPES.FIXED]),
    value: z
      .string()
      .min(1, 'القيمة مطلوبة')
      .refine((value) => Number(value) > 0, 'القيمة يجب أن تكون أكبر من صفر'),
    appliesTo: z.enum(appliesToValues),
    expiresAt: z.string().optional(),
    reason: z.string().trim().min(2, 'السبب مطلوب'),
    notifyOnLogin: z.boolean(),
    notificationMessage: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (data.notifyOnLogin && !data.notificationMessage?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'نص الرسالة مطلوب عند تفعيل إشعار العميل',
        path: ['notificationMessage'],
      });
    }
  });
