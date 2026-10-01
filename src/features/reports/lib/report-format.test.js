import { describe, expect, it } from 'vitest';
import {
  formatDuration,
  formatHoursAndMinutes,
  formatMoney,
  pick,
  toArabicDigits,
  toChartItems,
} from './report-format';

describe('report format', () => {
  it('formats money', () => {
    expect(formatMoney(1500)).toBe('1,500 ريال');
    expect(formatMoney(undefined)).toBe('0 ريال');
  });

  it('formats durations', () => {
    expect(formatDuration(30)).toBe('30 ثانية');
    expect(formatDuration(600)).toBe('10 دقيقة');
    expect(formatDuration(3900)).toBe('1 ساعة و5 د');
  });

  it('formats hours and minutes', () => {
    expect(formatHoursAndMinutes(135)).toBe('2 س و 15 د');
  });

  it('converts digits', () => {
    expect(toArabicDigits('2026')).toBe('٢٠٢٦');
  });

  it('picks the first present key', () => {
    expect(pick({ b: 0, c: 2 }, 'a', 'b', 'c')).toBe(0);
    expect(pick(undefined, 'a')).toBeUndefined();
  });

  it('maps rows to chart items', () => {
    expect(toChartItems([{ stage: 'x', count: '3' }])[0]).toMatchObject({ label: 'x', value: 3 });
  });
});
