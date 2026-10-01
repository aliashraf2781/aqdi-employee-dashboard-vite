import { describe, expect, it } from 'vitest';
import { DASH, decodeUriText, formatInt, formatMoney, formatPercent, formatRoas, formatSignedMoney } from './format';

describe('number formatting', () => {
  it('shows a dash for missing values', () => {
    [formatInt, formatMoney, formatSignedMoney, formatRoas, formatPercent].forEach((fn) => {
      expect(fn(null)).toBe(DASH);
      expect(fn('')).toBe(DASH);
      expect(fn('abc')).toBe(DASH);
    });
  });

  it('groups digits and adds the currency', () => {
    expect(formatInt(1234567)).toBe('1,234,567');
    expect(formatMoney(1500)).toBe('1,500 ﷼');
    expect(formatMoney(5, 'SAR')).toBe('5 SAR');
  });

  it('prefixes positive signed amounts only', () => {
    expect(formatSignedMoney(100)).toBe('+100 ﷼');
    expect(formatSignedMoney(-100)).toBe('-100 ﷼');
    expect(formatSignedMoney(0)).toBe('0 ﷼');
  });

  it('formats roas and percent', () => {
    expect(formatRoas(2.28)).toBe('x2.28');
    expect(formatRoas(0)).toBe('x0');
    expect(formatPercent(12.5)).toBe('12.5%');
  });
});

describe('decodeUriText', () => {
  it('decodes arabic slugs', () => {
    expect(decodeUriText('/%D8%B9%D9%82%D8%AF')).toBe('/عقد');
  });

  it('leaves plain and broken text alone', () => {
    expect(decodeUriText('/abc')).toBe('/abc');
    expect(decodeUriText('%E0%A4%A')).toBe('%E0%A4%A');
    expect(decodeUriText(null)).toBeNull();
  });
});
