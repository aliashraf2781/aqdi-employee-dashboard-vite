import { describe, expect, it } from 'vitest';
import { toNumberOrNull } from './numbers';

describe('toNumberOrNull', () => {
  it('maps empty to null and text to number', () => {
    expect(toNumberOrNull('')).toBeNull();
    expect(toNumberOrNull('  ')).toBeNull();
    expect(toNumberOrNull(undefined)).toBeNull();
    expect(toNumberOrNull('7')).toBe(7);
    expect(toNumberOrNull('x')).toBeNull();
  });
});
