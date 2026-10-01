import { describe, expect, it } from 'vitest';
import { buildNotificationRequest } from './notification-targets';

const base = { title: ' عنوان ', body: ' نص ', userId: '', employeeId: '' };

describe('buildNotificationRequest', () => {
  it('builds a broadcast request without recipient ids', () => {
    expect(buildNotificationRequest({ ...base, target: 'all-users' })).toEqual({
      endpoint: '/admin/notifications/all-users',
      payload: { title: 'عنوان', body: 'نص' },
    });
  });

  it('adds the user id as a number', () => {
    const { payload } = buildNotificationRequest({ ...base, target: 'user', userId: '12' });
    expect(payload.user_id).toBe(12);
  });

  it('adds the employee id', () => {
    const { payload } = buildNotificationRequest({ ...base, target: 'employee', employeeId: '5' });
    expect(payload.employee_id).toBe(5);
  });

  it('rejects unknown targets', () => {
    expect(() => buildNotificationRequest({ ...base, target: 'nobody' })).toThrow();
  });
});
