import { describe, expect, it } from 'vitest';
import { formatClock, formatRelativeTime, getFirstName, getGreeting } from './dashboard-format';
import { mapOrderToActivity } from './map-order-to-activity';

describe('dashboard formatting', () => {
  it('formats relative time buckets', () => {
    const now = new Date('2026-01-02T12:00:00Z');
    expect(formatRelativeTime('2026-01-02T11:59:30Z', now)).toBe('الآن');
    expect(formatRelativeTime('2026-01-02T11:30:00Z', now)).toBe('منذ 30 د');
    expect(formatRelativeTime('2026-01-02T09:00:00Z', now)).toBe('منذ 3 س');
    expect(formatRelativeTime('2025-12-30T12:00:00Z', now)).toBe('منذ 3 ي');
    expect(formatRelativeTime(null, now)).toBe('');
  });

  it('formats the clock in 12h Arabic', () => {
    expect(formatClock(new Date(2026, 0, 1, 0, 5))).toBe('12:05 صباحاً');
    expect(formatClock(new Date(2026, 0, 1, 15, 30))).toBe('3:30 مساءً');
  });

  it('picks the greeting by hour', () => {
    expect(getGreeting(new Date(2026, 0, 1, 9))).toBe('صباح الخير');
    expect(getGreeting(new Date(2026, 0, 1, 18))).toBe('مساء الخير');
  });

  it('takes the first name', () => {
    expect(getFirstName('  أحمد علي ')).toBe('أحمد');
    expect(getFirstName(undefined)).toBe('');
  });
});

describe('mapOrderToActivity', () => {
  it('builds title, subtitle and link', () => {
    const row = mapOrderToActivity({ id: 5, uuid: 'A1', contract_type: 'إيجار' }, '/home/orders');
    expect(row).toMatchObject({ id: 5, title: 'طلب إيجار جديد', subtitle: '#A1 · بانتظار الاستلام', href: '/home/orders/5' });
  });

  it('falls back when fields are missing', () => {
    const row = mapOrderToActivity({}, '/home/orders');
    expect(row.title).toBe('طلب جديد بانتظار الاستلام');
    expect(row.href).toBeNull();
  });
});
