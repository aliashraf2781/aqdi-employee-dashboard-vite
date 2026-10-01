import { describe, expect, it } from 'vitest';
import { buildEditorSavePayload } from './save-payload';

const fields = [{ key: 'street' }, { key: 'neighborhood' }, { key: 'name_real_estate', step: 'step1' }];

describe('buildEditorSavePayload', () => {
  it('collects changes of every step the fields belong to', () => {
    const result = buildEditorSavePayload({
      fields,
      step: 'step2',
      form: { street: 'new', neighborhood: 'same', name_real_estate: 'برج', other: 'ignored' },
      initial: { street: 'old', neighborhood: 'same', name_real_estate: '' },
    });
    expect(result).toEqual({ payload: { street: 'new', name_real_estate: 'برج' }, hasChanges: true });
  });

  it('reports no changes', () => {
    const result = buildEditorSavePayload({ fields, step: 'step2', form: { street: 'a' }, initial: { street: 'a' } });
    expect(result.hasChanges).toBe(false);
    expect(result.payload).toEqual({});
  });

  it('does not count extras as a change but still sends them', () => {
    const result = buildEditorSavePayload({
      fields,
      step: 'step2',
      form: { street: 'a' },
      initial: { street: 'a' },
      payloadExtras: { real_units_id: 9 },
    });
    expect(result).toEqual({ payload: { real_units_id: 9 }, hasChanges: false });
  });

  it('diffs plain keys for a custom save', () => {
    const result = buildEditorSavePayload({
      fields: [{ key: 'unit_number' }, { key: 'floor_number' }],
      step: 'step5',
      form: { unit_number: '5', floor_number: '' },
      initial: { unit_number: '4', floor_number: '' },
      customSave: true,
    });
    expect(result.payload).toEqual({ unit_number: '5' });
  });
});
