import { describe, expect, it } from 'vitest';
import {
  getOrderAddressStep,
  getOrderDeedStep,
  getOrderFinancialStep,
  getOrderUnits,
  hasLegalAgent,
  normalizeContractTypeKey,
  resolveOrderContractTypeKey,
  usesGroupedAdminSteps,
} from './order-detail-steps';

describe('order detail steps', () => {
  const grouped = { step1: { image_instrument: 'a' }, step2: { street: 's' }, step6: { payment_type_name: 'p' } };
  const legacy = { step1: { street: 's' }, step4: { payment_type_name: 'p' }, contract_summary: { x: 1 } };

  it('detects the grouped step shape', () => {
    expect(usesGroupedAdminSteps(grouped)).toBe(true);
    expect(usesGroupedAdminSteps(legacy)).toBe(false);
  });

  it('reads buckets for both shapes', () => {
    expect(getOrderDeedStep(grouped)).toEqual({ image_instrument: 'a' });
    expect(getOrderAddressStep(legacy)).toEqual({ street: 's' });
    expect(getOrderFinancialStep(legacy)).toEqual({ payment_type_name: 'p' });
  });

  it('prefers root units', () => {
    expect(getOrderUnits({ units: [{ id: 1 }], step5: { units: [{ id: 2 }] } })).toEqual([{ id: 1 }]);
    expect(getOrderUnits({ step5: { units: [{ id: 2 }] } })).toEqual([{ id: 2 }]);
  });

  it('normalizes contract types', () => {
    expect(normalizeContractTypeKey('سكني')).toBe('housing');
    expect(normalizeContractTypeKey('residential')).toBe('housing');
    expect(resolveOrderContractTypeKey({ contract_type: 'commercial' })).toBe('commercial');
  });

  it('finds a legal agent from the flag or fields', () => {
    expect(hasLegalAgent({ legal_agent: { id_num_of_property_owner_agent: '1' } })).toBe(true);
    expect(hasLegalAgent({})).toBe(false);
  });
});
