import { describe, expect, it } from 'vitest';
import { DEFAULT_CONTRACT_TAB, resolveContractTab } from './contract-settings-tabs';

describe('resolveContractTab', () => {
  it('keeps known tab ids', () => {
    expect(resolveContractTab('tax-fees')).toBe('tax-fees');
  });

  it('maps old aliases', () => {
    expect(resolveContractTab('sms')).toBe('sms-settings');
    expect(resolveContractTab('guidance')).toBe('popup-contracts');
  });

  it('falls back for unknown or missing ids', () => {
    expect(resolveContractTab('nope')).toBe(DEFAULT_CONTRACT_TAB);
    expect(resolveContractTab(null, 'meter-fees')).toBe('meter-fees');
  });
});
