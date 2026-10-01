import { describe, expect, it } from 'vitest';
import { formatSalary, getInitials, getRoleBadgeTone, getWorkPeriodLabel, splitFullName } from './employee-display';

describe('employee display helpers', () => {
  it('builds initials', () => {
    expect(getInitials('Ahmed Ali')).toBe('AA');
    expect(getInitials('Ahmed')).toBe('A');
    expect(getInitials('  ')).toBe('?');
  });

  it('splits the full name', () => {
    expect(splitFullName('Ahmed bin Ali')).toEqual({ firstName: 'Ahmed', lastName: 'bin Ali' });
    expect(splitFullName(null)).toEqual({ firstName: '', lastName: '' });
  });

  it('labels work periods', () => {
    expect(getWorkPeriodLabel('evening')).toBe('وردية المساء');
    expect(getWorkPeriodLabel('x')).toBe('غير محدد');
  });

  it('formats salaries', () => {
    expect(formatSalary('12500.5')).toBe('12,500.5');
    expect(formatSalary('')).toBeNull();
    expect(formatSalary('abc')).toBeNull();
  });

  it('cycles role tones', () => {
    expect(getRoleBadgeTone(0)).toBe(getRoleBadgeTone(4));
  });
});
