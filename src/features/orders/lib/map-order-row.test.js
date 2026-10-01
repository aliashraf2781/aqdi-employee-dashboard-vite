import { describe, expect, it } from 'vitest';
import { getContractTypeKey, getWaitingMinutes, mapTableOrderRow } from './map-order-row';

describe('getContractTypeKey', () => {
  it('prefers the explicit key', () => {
    expect(getContractTypeKey({ contract_type_key: 'residential' })).toBe('housing');
  });

  it('reads the Arabic label', () => {
    expect(getContractTypeKey({ contract_type: 'عقد سكني' })).toBe('housing');
    expect(getContractTypeKey({ contract_type: 'عقد تجاري' })).toBe('commercial');
    expect(getContractTypeKey({})).toBe('');
  });
});

describe('getWaitingMinutes', () => {
  it('uses waiting_minutes when present', () => {
    expect(getWaitingMinutes({ waiting_minutes: '12' })).toBe(12);
  });

  it('derives minutes from created_at', () => {
    const now = new Date('2026-01-01T10:30:00Z').getTime();
    expect(getWaitingMinutes({ created_at: '2026-01-01T10:00:00Z' }, now)).toBe(30);
  });
});

describe('mapTableOrderRow', () => {
  it('flattens status and user fields', () => {
    const row = mapTableOrderRow({ status: { id: 3, name: 'جديد', color: 'x' }, user: { mobile: '0500000000' } });
    expect(row.status_id).toBe(3);
    expect(row.status_name).toBe('جديد');
    expect(row.user_mobile).toBe('0500000000');
  });
});
