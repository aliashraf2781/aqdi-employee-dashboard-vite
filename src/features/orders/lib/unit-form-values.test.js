import { describe, expect, it } from 'vitest';
import { getUnitFormValues, getUnitFormVersion, getUnitFullPayload, isSelectedUnit } from './unit-form-values';

const unit = { id: 3, unit_number: '12', unit_area: 80, furnished: 1, kitchen_tank: null, unit_usage_id: 2, unit_usage_name: 'سكن', Gasmeter: 1, window_ac: '' };

describe('unit form helpers', () => {
  it('builds the full payload without empty values', () => {
    const payload = getUnitFullPayload(unit);
    expect(payload).toMatchObject({ unit_number: '12', unit_area: '80', furnished: 1, Gasmeter: 1, unit_usage_id: '2' });
    expect(payload).not.toHaveProperty('window_ac');
    expect(payload).not.toHaveProperty('floor_number');
  });

  it('keeps the readable name of select fields', () => {
    const values = getUnitFormValues(unit);
    expect(values).toMatchObject({ unit_number: '12', unit_usage_id: '2', unit_usage_name: 'سكن', kitchen_tank: 0 });
  });

  it('changes version only when shown values change', () => {
    expect(getUnitFormVersion(unit)).toBe(getUnitFormVersion({ ...unit, ignored: 'x' }));
    expect(getUnitFormVersion(unit)).not.toBe(getUnitFormVersion({ ...unit, unit_area: 90 }));
  });

  it('finds the selected unit', () => {
    expect(isSelectedUnit(unit, { real_units_id: '3' })).toBe(true);
    expect(isSelectedUnit(unit, { contract_summary: { real_units_id: 4 } })).toBe(false);
    expect(isSelectedUnit(unit, {})).toBe(false);
  });
});
