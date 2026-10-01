import { describe, expect, it } from 'vitest';
import { optionalNonNegativeNumber, requiredText, toNumberOrNull } from './common-schemas';

describe('requiredText', () => {
  it('rejects blank text', () => {
    expect(requiredText().safeParse('   ').success).toBe(false);
    expect(requiredText().safeParse('مرحبا').success).toBe(true);
  });
});

describe('optionalNonNegativeNumber', () => {
  const schema = optionalNonNegativeNumber('خطأ');

  it('accepts empty and non-negative numbers', () => {
    expect(schema.safeParse('').success).toBe(true);
    expect(schema.safeParse('12.5').success).toBe(true);
  });

  it('rejects negatives and text', () => {
    expect(schema.safeParse('-1').success).toBe(false);
    expect(schema.safeParse('abc').success).toBe(false);
  });
});

describe('toNumberOrNull', () => {
  it('maps empty to null and text to number', () => {
    expect(toNumberOrNull('')).toBeNull();
    expect(toNumberOrNull('7')).toBe(7);
    expect(toNumberOrNull('x')).toBeNull();
  });
});
