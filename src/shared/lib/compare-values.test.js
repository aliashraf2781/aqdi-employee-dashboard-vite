import { describe, expect, it } from 'vitest';
import { compareValues } from './compare-values';

describe('compareValues', () => {
  it('compares numbers in both directions', () => {
    expect(compareValues(1, 2, 'asc')).toBeLessThan(0);
    expect(compareValues(1, 2, 'desc')).toBeGreaterThan(0);
  });

  it('puts missing values first', () => {
    expect(compareValues(null, 5)).toBeLessThan(0);
    expect(compareValues(5, undefined)).toBeGreaterThan(0);
    expect(compareValues(null, '')).toBe(0);
  });

  it('compares strings', () => {
    expect(compareValues('أ', 'ب')).toBeLessThan(0);
  });
});
