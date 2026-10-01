import { describe, expect, it } from 'vitest';
import { getSaudiMobileError, isSaudiMobile, sanitizeSaudiMobileInput } from './saudi-mobile';

describe('isSaudiMobile', () => {
  it('accepts the common formats', () => {
    expect(isSaudiMobile('0512345678')).toBe(true);
    expect(isSaudiMobile('512345678')).toBe(true);
    expect(isSaudiMobile('966512345678')).toBe(true);
    expect(isSaudiMobile('٠٥١٢٣٤٥٦٧٨')).toBe(true);
  });

  it('rejects wrong numbers', () => {
    expect(isSaudiMobile('0412345678')).toBe(false);
    expect(isSaudiMobile('05123')).toBe(false);
  });
});

describe('getSaudiMobileError', () => {
  it('reports required, letters and bad format', () => {
    expect(getSaudiMobileError('')).toBe('رقم الجوال مطلوب');
    expect(getSaudiMobileError('05a')).toBe('رقم الجوال يقبل أرقام فقط');
    expect(getSaudiMobileError('0412345678')).toBe('رقم الجوال يجب أن يكون 10 أرقام ويبدأ بـ 05');
    expect(getSaudiMobileError('0512345678')).toBeNull();
  });
});

describe('sanitizeSaudiMobileInput', () => {
  it('normalizes while typing', () => {
    expect(sanitizeSaudiMobileInput('5123')).toBe('05123');
    expect(sanitizeSaudiMobileInput('966512345678')).toBe('0512345678');
    expect(sanitizeSaudiMobileInput('05123456789999')).toBe('0512345678');
  });
});
