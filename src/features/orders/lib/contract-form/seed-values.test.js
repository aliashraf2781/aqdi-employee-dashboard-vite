import { describe, expect, it } from 'vitest';
import { buildContractFormSeed } from './seed-values';

const order = {
  step1: { name_real_estate: 'برج', type_instrument_history: 'hijri' },
  step2: { street: 'الملك فهد' },
  step6: { duration_years: 2, contract_term_in_years: '' },
};

describe('buildContractFormSeed', () => {
  it('is empty without an order', () => {
    expect(buildContractFormSeed({ orderData: null, step: 'step2', fields: [] })).toEqual({});
  });

  it('reads the editor step', () => {
    const seed = buildContractFormSeed({ orderData: order, step: 'step2', fields: [{ key: 'street' }] });
    expect(seed.street).toBe('الملك فهد');
  });

  it('reads fields of another step', () => {
    const fields = [{ key: 'street' }, { key: 'name_real_estate', step: 'step1', calendarTypeKey: 'type_instrument_history' }];
    const seed = buildContractFormSeed({ orderData: order, step: 'step2', fields });
    expect(seed.name_real_estate).toBe('برج');
    expect(seed.type_instrument_history).toBe('hijri');
  });

  it('lets initial values win', () => {
    const seed = buildContractFormSeed({ orderData: order, step: 'step2', fields: [], initialValues: { street: 'override' } });
    expect(seed.street).toBe('override');
  });

  it('uses only initial values when asked', () => {
    expect(buildContractFormSeed({ orderData: order, step: 'step5', fields: [], initialValues: { a: 1 }, seedFromInitialValuesOnly: true })).toEqual({ a: 1 });
    expect(buildContractFormSeed({ orderData: order, step: 'step5', fields: [], seedFromInitialValuesOnly: true })).toEqual({});
  });

  it('picks the duration mode from saved values', () => {
    const seed = buildContractFormSeed({ orderData: order, step: 'step6', fields: [{ key: 'duration_mode' }] });
    expect(seed.duration_mode).toBe('custom');
  });
});
