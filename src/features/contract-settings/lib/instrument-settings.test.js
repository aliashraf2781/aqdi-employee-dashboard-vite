import { describe, expect, it } from 'vitest';
import { buildInstrumentSettingPayload, mergeInstrumentSettings } from './instrument-settings';
import { SETTING_INSTRUMENT_TYPES } from './instrument-types';

describe('mergeInstrumentSettings', () => {
  it('always returns the full fixed list', () => {
    expect(mergeInstrumentSettings([])).toHaveLength(SETTING_INSTRUMENT_TYPES.length);
  });

  it('starts unsaved types switched off with their default label', () => {
    const [first] = mergeInstrumentSettings([]);
    expect(first).toMatchObject({ id: null, realestate: false, contract: false, label: first.type_name });
  });

  it('overlays saved visibility and label', () => {
    const merged = mergeInstrumentSettings([{ id: 9, instrument_type: 'sale_agreement', contract: 1, label: 'مبايعة' }]);
    expect(merged.find((item) => item.instrument_type === 'sale_agreement')).toMatchObject({
      id: 9,
      contract: true,
      label: 'مبايعة',
      type_name: 'ورقة مبايعة',
    });
  });
});

describe('buildInstrumentSettingPayload', () => {
  it('falls back to the type name for an empty label', () => {
    const payload = buildInstrumentSettingPayload({ instrument_type: 'sale_agreement', label: '  ', contract: true });
    expect(payload).toMatchObject({ label: 'ورقة مبايعة', contract: true, realestate: false });
  });
});
