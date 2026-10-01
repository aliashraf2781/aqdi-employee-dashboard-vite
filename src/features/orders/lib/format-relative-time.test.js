import { describe, expect, it } from 'vitest';
import { formatRelativeShort, formatRelativeTimeAr } from './format-relative-time';

const NOW = new Date('2026-01-10T12:00:00Z').getTime();

describe('formatRelativeShort', () => {
  it('handles minutes, hours and days', () => {
    expect(formatRelativeShort('2026-01-10T11:59:50Z', NOW)).toBe('الآن');
    expect(formatRelativeShort('2026-01-10T11:30:00Z', NOW)).toBe('30 دقيقة');
    expect(formatRelativeShort('2026-01-10T09:00:00Z', NOW)).toBe('3 ساعة');
    expect(formatRelativeShort('2026-01-08T12:00:00Z', NOW)).toBe('2 يوم');
  });

  it('returns null for missing or invalid dates', () => {
    expect(formatRelativeShort(null, NOW)).toBeNull();
    expect(formatRelativeShort('nope', NOW)).toBeNull();
  });
});

describe('formatRelativeTimeAr', () => {
  it('adds the remaining hours after full days', () => {
    expect(formatRelativeTimeAr('2026-01-08T09:00:00Z', NOW)).toBe('منذ 2 يوم و 3 س');
    expect(formatRelativeTimeAr('2026-01-08T12:00:00Z', NOW)).toBe('منذ 2 يوم');
    expect(formatRelativeTimeAr(null, NOW)).toBe('—');
  });
});
