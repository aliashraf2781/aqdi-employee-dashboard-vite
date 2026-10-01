import { describe, expect, it } from 'vitest';
import { toBoolean, unwrapSettingsRecord } from './settings-record';

describe('unwrapSettingsRecord', () => {
  it('unwraps the supported envelopes', () => {
    expect(unwrapSettingsRecord({ data: { a: 1 } })).toEqual({ a: 1 });
    expect(unwrapSettingsRecord({ data: { items: [{ a: 2 }] } })).toEqual({ a: 2 });
    expect(unwrapSettingsRecord({ data: { settings: { a: 3 } } })).toEqual({ a: 3 });
  });

  it('returns null for empty input', () => {
    expect(unwrapSettingsRecord(undefined)).toBeNull();
    expect(unwrapSettingsRecord({ data: 'x' })).toBeNull();
  });
});

describe('toBoolean', () => {
  it('understands common spellings', () => {
    expect(toBoolean(1)).toBe(true);
    expect(toBoolean('0')).toBe(false);
    expect(toBoolean('Yes')).toBe(true);
    expect(toBoolean(undefined, true)).toBe(true);
  });
});
