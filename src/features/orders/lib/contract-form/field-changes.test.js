import { describe, expect, it } from 'vitest';
import { applyFieldChange } from './field-changes';

describe('applyFieldChange', () => {
  it('sets the changed field', () => {
    expect(applyFieldChange({ street: 'a' }, { key: 'street' }, 'b')).toEqual({ street: 'b' });
  });

  it('resets the city when the region changes', () => {
    const next = applyFieldChange({ property_place_id: 1, property_city_id: 5 }, { key: 'property_place_id' }, 2);
    expect(next.property_city_id).toBe('');
    expect(applyFieldChange({ property_place_id: 1, property_city_id: 5 }, { key: 'property_place_id' }, '1').property_city_id).toBe(5);
  });

  it('parks listed and custom durations when switching mode', () => {
    const listed = { duration_mode: 'listed', contract_term_in_years: '3', duration_years: '', duration_months: '' };
    const custom = applyFieldChange(listed, { key: 'duration_mode' }, 'custom');
    expect(custom).toMatchObject({ contract_term_in_years: '', __listed_term: '3' });

    const withCustomValues = { ...custom, duration_years: '2', duration_months: '4' };
    const back = applyFieldChange(withCustomValues, { key: 'duration_mode' }, 'listed');
    expect(back).toMatchObject({ contract_term_in_years: '3', duration_years: '', duration_months: '', __custom_years: '2', __custom_months: '4' });
  });

  it('splits a changed date into day, month and year', () => {
    const next = applyFieldChange({}, { key: 'tenant_dob', type: 'date' }, '05-06-1990');
    expect(next).toMatchObject({ tenant_dob: '05-06-1990', tenant_dob_day: '05', tenant_dob_month: '06', tenant_dob_year: '1990' });
  });

  it('converts the linked date when the calendar type changes', () => {
    const next = applyFieldChange(
      { type_tenant_dob: 'gregorian', tenant_dob: '19-07-2023' },
      { key: 'type_tenant_dob' },
      'hijri',
    );
    expect(next.tenant_dob).toMatch(/-144[45]$/);
    expect(next.tenant_dob_year).toMatch(/^144[45]$/);
  });
});
