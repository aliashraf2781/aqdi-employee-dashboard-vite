import { z } from 'zod';

const REQUIRED_MESSAGE = 'يرجى إدخال السؤال والجواب';

export const faqSchema = z.object({
  title_ar: z.string().trim().min(1, REQUIRED_MESSAGE),
  answer_ar: z.string().trim().min(1, REQUIRED_MESSAGE),
});

export const EMPTY_FAQ = { title_ar: '', answer_ar: '' };

export const faqToForm = (faq) => ({ title_ar: faq?.title_ar ?? '', answer_ar: faq?.answer_ar ?? '' });
