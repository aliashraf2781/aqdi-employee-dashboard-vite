import { describe, expect, it } from 'vitest';
import { isSaudiMobile, sanitizePhoneInput } from './saudi-phone';

describe('isSaudiMobile', () => {
  it.each(['0512345678', '512345678', '966512345678', '٠٥١٢٣٤٥٦٧٨'])('accepts %s', (value) => {
    expect(isSaudiMobile(value)).toBe(true);
  });

  it.each(['', '0412345678', '05123', 'abc'])('rejects %s', (value) => {
    expect(isSaudiMobile(value)).toBe(false);
  });
});

describe('sanitizePhoneInput', () => {
  it('strips letters and caps the length', () => {
    expect(sanitizePhoneInput('05a1234567890')).toBe('0512345678');
  });

  it('adds the leading zero', () => {
    expect(sanitizePhoneInput('5123')).toBe('05123');
  });
});
