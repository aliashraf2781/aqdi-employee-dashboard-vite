import { describe, expect, it } from 'vitest';
import {
  CUSTOM_PERIOD,
  buildContractPeriodPayload,
  contractPeriodToFormValues,
  getKnownPeriodMonths,
  resolvePeriod,
} from './contract-period';

const baseValues = {
  periodChoice: 'سنوي',
  customPeriod: '',
  note_ar: ' سنة واحدة ',
  note_en: '',
  contract_type: 'housing',
  price: '',
};

describe('contract period helpers', () => {
  it('knows the months of standard periods', () => {
    expect(getKnownPeriodMonths('سنوي')).toBe(12);
    expect(getKnownPeriodMonths('مخصص')).toBeNull();
  });

  it('resolves the custom period text', () => {
    expect(resolvePeriod({ periodChoice: CUSTOM_PERIOD, customPeriod: ' 18 شهر ' })).toBe('18 شهر');
    expect(resolvePeriod(baseValues)).toBe('سنوي');
  });

  it('opens an unknown period as custom', () => {
    expect(contractPeriodToFormValues({ period: '18 شهر', price: 5 })).toMatchObject({
      periodChoice: CUSTOM_PERIOD,
      customPeriod: '18 شهر',
      price: '5',
    });
  });

  it('omits empty optional fields when creating', () => {
    expect(buildContractPeriodPayload(baseValues, { isEdit: false })).toEqual({
      period: 'سنوي',
      note_ar: 'سنة واحدة',
      contract_type: 'housing',
    });
  });

  it('clears empty optional fields when editing', () => {
    expect(buildContractPeriodPayload(baseValues, { isEdit: true })).toMatchObject({ note_en: '', price: null });
  });

  it('sends the price as a number', () => {
    expect(buildContractPeriodPayload({ ...baseValues, price: '99.5' }, { isEdit: false }).price).toBe(99.5);
  });
});
