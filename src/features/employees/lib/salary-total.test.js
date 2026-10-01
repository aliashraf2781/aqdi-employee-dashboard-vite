import { describe, expect, it } from 'vitest';
import { calculateSalaryTotal } from './salary-total';

describe('calculateSalaryTotal', () => {
  it('adds bonus and subtracts deduction', () => {
    expect(calculateSalaryTotal({ basic_salary: '5000', deduction: '200', bonus: '300' })).toBe('5100');
  });

  it('treats empty fields as zero', () => {
    expect(calculateSalaryTotal({ basic_salary: '1000', deduction: '', bonus: undefined })).toBe('1000');
  });
});
