import { z } from 'zod';

export const adSpendSchema = z.object({
  spent_on: z.string().min(1, 'التاريخ مطلوب'),
  platform: z.string().min(1, 'المنصة مطلوبة'),
  campaign_name: z.string(),
  spend: z
    .string()
    .min(1, 'الصرف مطلوب')
    .refine((value) => Number(value) > 0, 'الصرف يجب أن يكون أكبر من صفر'),
  impressions: z.string(),
  clicks: z.string(),
});

export const EMPTY_AD_SPEND = { spent_on: '', platform: 'google', campaign_name: '', spend: '', impressions: '', clicks: '' };
