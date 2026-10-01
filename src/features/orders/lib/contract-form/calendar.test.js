import { describe, expect, it } from 'vitest';
import {
  convertDateBetweenCalendars,
  formatContractDate,
  inferCalendarTypeFromDate,
  normalizeCalendarType,
  normalizeDateInput,
  parseContractDate,
  resolveCalendarType,
  toLatinDigits,
} from './calendar';

describe('contract calendar helpers', () => {
  it('normalizes digits and separators', () => {
    expect(toLatinDigits('١٢٣')).toBe('123');
    expect(normalizeDateInput('٠١/٠٢/٢٠٢٤ 10:00')).toBe('01-02-2024');
    expect(normalizeDateInput('2024-02-01T10:00:00Z')).toBe('2024-02-01');
  });

  it('recognizes calendar names', () => {
    expect(normalizeCalendarType('هجري')).toBe('hijri');
    expect(normalizeCalendarType('Gregorian')).toBe('gregorian');
    expect(normalizeCalendarType('x')).toBeNull();
  });

  it('infers the calendar from the year', () => {
    expect(inferCalendarTypeFromDate('01-01-1445')).toBe('hijri');
    expect(inferCalendarTypeFromDate('2024-02-01')).toBe('gregorian');
    expect(inferCalendarTypeFromDate('')).toBe('gregorian');
    expect(resolveCalendarType('hijri', '2024-01-01')).toBe('hijri');
  });

  it('round trips a date through the picker format', () => {
    const parsed = parseContractDate('15-03-2024', 'gregorian');
    expect(formatContractDate(parsed)).toBe('15-03-2024');
    expect(parseContractDate('', 'gregorian')).toBeNull();
  });

  it('converts between calendars', () => {
    const hijri = convertDateBetweenCalendars('19-07-2023', 'gregorian', 'hijri');
    expect(hijri).toMatch(/^\d{2}-\d{2}-144[45]$/);
    expect(convertDateBetweenCalendars(hijri, 'hijri', 'gregorian')).toBe('19-07-2023');
    expect(convertDateBetweenCalendars('19-07-2023', 'gregorian', 'gregorian')).toBe('19-07-2023');
  });
});
