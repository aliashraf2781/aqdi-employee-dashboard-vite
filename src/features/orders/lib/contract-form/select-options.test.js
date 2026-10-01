import { describe, expect, it } from 'vitest';
import { getCurrentOptionLabel, getOptionsSource, withCurrentOption } from './select-options';

describe('getOptionsSource', () => {
  it('uses the explicit source or the one implied by the key', () => {
    expect(getOptionsSource({ key: 'x', optionsSource: 'regions' })).toBe('regions');
    expect(getOptionsSource({ key: 'payment_type_id' })).toBe('payment-types');
    expect(getOptionsSource({ key: 'unit_usage_id' })).toBe('unit-usages');
    expect(getOptionsSource({ key: 'street' })).toBeNull();
  });

  it('ignores fields with fixed options', () => {
    expect(getOptionsSource({ key: 'property_city_id', options: [{ value: 1, label: 'a' }] })).toBeNull();
  });
});

describe('getCurrentOptionLabel', () => {
  it('reads the saved name of region and property type', () => {
    const order = { relation_labels: { property_region: 'الرياض', property_type: 'شقة' } };
    expect(getCurrentOptionLabel({ key: 'property_place_id' }, order, {})).toBe('الرياض');
    expect(getCurrentOptionLabel({ key: 'property_type_id' }, order, {})).toBe('شقة');
    expect(getCurrentOptionLabel({ key: 'property_type_id' }, order, { property_type_name: 'فيلا' })).toBe('فيلا');
  });

  it('falls back to the display key', () => {
    expect(getCurrentOptionLabel({ key: 'other', displayKey: 'other_name' }, {}, { other_name: 'x' })).toBe('x');
    expect(getCurrentOptionLabel({ key: 'other' }, {}, {})).toBeNull();
  });
});

describe('withCurrentOption', () => {
  const options = [{ value: '1', label: 'a' }];

  it('keeps the options when the value is present or empty', () => {
    expect(withCurrentOption(options, '1', null)).toBe(options);
    expect(withCurrentOption(options, '', null)).toBe(options);
  });

  it('adds the saved value as an option', () => {
    expect(withCurrentOption(options, '9', 'قديم')).toEqual([...options, { value: '9', label: 'قديم' }]);
    expect(withCurrentOption(options, '9', null)[1].label).toBe('الخيار الحالي (9)');
  });
});
