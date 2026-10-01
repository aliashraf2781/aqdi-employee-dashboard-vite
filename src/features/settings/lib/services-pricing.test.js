import { describe, expect, it } from 'vitest';
import { buildServicesPricingPayload } from './services-pricing';

describe('buildServicesPricingPayload', () => {
  it('trims names and converts the price', () => {
    expect(
      buildServicesPricingPayload({ name_ar: ' خدمة ', name_en: ' Service ', price: '150', contract_type: 'housing' }),
    ).toEqual({ name_ar: 'خدمة', name_en: 'Service', price: 150, contract_type: 'housing' });
  });

  it('skips an empty English name', () => {
    const payload = buildServicesPricingPayload({ name_ar: 'خ', name_en: '  ', price: '1', contract_type: 'commercial' });
    expect(payload).not.toHaveProperty('name_en');
  });
});
