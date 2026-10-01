import { z } from 'zod';

export const smsSchema = z.object({ message: z.string().trim().min(1, 'يرجى كتابة نص الرسالة') });

/** One SMS holds 70 characters when the text is Arabic (Unicode); longer texts are split into several. */
export const SMS_SEGMENT_LENGTH = 70;

export function countSmsSegments(text) {
  return Math.max(1, Math.ceil(text.length / SMS_SEGMENT_LENGTH));
}
