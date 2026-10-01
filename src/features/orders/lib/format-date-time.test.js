import { describe, expect, it } from 'vitest';
import { formatDateTimeShort, formatStamp } from './format-date-time';

describe('date formatting', () => {
  it('shows a dash for empty or invalid dates', () => {
    expect(formatDateTimeShort(null)).toBe('—');
    expect(formatDateTimeShort('nope')).toBe('—');
    expect(formatStamp('nope')).toBeNull();
  });

  it('formats day/month/year with time', () => {
    expect(formatDateTimeShort(new Date(2026, 1, 3, 14, 5))).toBe('14:05 · 03/02/2026');
    expect(formatStamp(new Date(2026, 1, 3, 14, 5))).toBe('03/02/2026 - 14:05');
  });
});
