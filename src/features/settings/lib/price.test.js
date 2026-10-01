import { describe, expect, it } from 'vitest';
import { formatPrice } from './price';

describe('formatPrice', () => {
  it('adds the currency suffix', () => {
    expect(formatPrice(150)).toContain('ر.س');
  });

  it('returns a dash for missing prices', () => {
    expect(formatPrice(null)).toBe('—');
    expect(formatPrice('')).toBe('—');
  });

  it('keeps non numeric text as is', () => {
    expect(formatPrice('abc')).toBe('abc');
  });
});
