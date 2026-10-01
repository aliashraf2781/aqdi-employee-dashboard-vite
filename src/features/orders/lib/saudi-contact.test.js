import { describe, expect, it } from 'vitest';
import {
  digitsOnly,
  getSaudiMobileError,
  getSaudiNationalIdError,
  isSaudiMobile,
  isSaudiNationalId,
  sanitizeSaudiContactInput,
} from './saudi-contact';

describe('saudi contact helpers', () => {
  it('converts arabic digits', () => {
    expect(digitsOnly('٠٥٠١٢')).toBe('05012');
  });

  it('validates mobiles in all accepted forms', () => {
    expect(isSaudiMobile('0512345678')).toBe(true);
    expect(isSaudiMobile('512345678')).toBe(true);
    expect(isSaudiMobile('966512345678')).toBe(true);
    expect(isSaudiMobile('0412345678')).toBe(false);
  });

  it('validates national ids', () => {
    expect(isSaudiNationalId('1012345678')).toBe(true);
    expect(isSaudiNationalId('3012345678')).toBe(false);
  });

  it('gives an error message only when invalid', () => {
    expect(getSaudiMobileError('', { required: true })).toBe('رقم الجوال مطلوب');
    expect(getSaudiMobileError('0512345678')).toBeNull();
    expect(getSaudiNationalIdError('12')).toBe('رقم الهوية يجب أن يكون 10 أرقام');
  });

  it('sanitizes typed phone input', () => {
    expect(sanitizeSaudiContactInput('phone', '512345678')).toBe('0512345678');
    expect(sanitizeSaudiContactInput('national_id', '10123456789')).toBe('1012345678');
  });
});
