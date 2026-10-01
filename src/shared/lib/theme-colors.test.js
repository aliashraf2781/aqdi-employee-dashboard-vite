import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { tokenToHex, tokenToRgb } from './theme-colors';

describe('theme-colors', () => {
  beforeEach(() => document.documentElement.style.setProperty('--color-probe', '12 96 85'));
  afterEach(() => document.documentElement.style.removeProperty('--color-probe'));

  it('converts a token to rgb() and hex', () => {
    expect(tokenToRgb('probe')).toBe('rgb(12, 96, 85)');
    expect(tokenToHex('probe')).toBe('#0c6055');
  });

  it('returns an empty string for an unknown token', () => {
    expect(tokenToRgb('missing')).toBe('');
    expect(tokenToHex('missing')).toBe('');
  });
});
