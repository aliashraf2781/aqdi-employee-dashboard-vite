import { z } from 'zod';
import { NOTIFICATION_TARGETS } from '@/features/settings/lib/notification-targets';

export const notificationSchema = z
  .object({
    target: z.string(),
    userId: z.string(),
    employeeId: z.string(),
    title: z.string().trim().min(1, 'يرجى إدخال العنوان ونص الرسالة'),
    body: z.string().trim().min(1, 'يرجى إدخال العنوان ونص الرسالة'),
  })
  .superRefine((values, context) => {
    const target = NOTIFICATION_TARGETS[values.target];
    if (target?.needsUser && !values.userId) {
      context.addIssue({ code: 'custom', path: ['userId'], message: 'يرجى اختيار المستخدم' });
    }
    if (target?.needsEmployee && !values.employeeId) {
      context.addIssue({ code: 'custom', path: ['employeeId'], message: 'يرجى اختيار الموظف' });
    }
  });

export const EMPTY_NOTIFICATION = { target: 'all-users', userId: '', employeeId: '', title: '', body: '' };
