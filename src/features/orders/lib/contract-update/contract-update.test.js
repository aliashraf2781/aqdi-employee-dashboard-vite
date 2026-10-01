import { describe, expect, it } from 'vitest';
import {
  buildContractUpdatePayload,
  filterTenantRoleValuesForIds,
  getStepFormValues,
  mapApiValidationErrors,
  normalizeFieldValue,
  parseTenantRoleIds,
  sanitizeOtherConditionsList,
  tenantRoleIdsEqual,
  validateOtherConditionsList,
  validateTenantRoleSelection,
} from './index';

describe('tenant roles', () => {
  it('parses ids from arrays and comma strings', () => {
    expect(parseTenantRoleIds(['1', 2, 'x'])).toEqual([1, 2]);
    expect(parseTenantRoleIds('3,4،5')).toEqual([3, 4, 5]);
    expect(parseTenantRoleIds(null)).toEqual([]);
  });

  it('compares ids regardless of order', () => {
    expect(tenantRoleIdsEqual([2, 1], ['1', '2'])).toBe(true);
    expect(tenantRoleIdsEqual([1], [1, 2])).toBe(false);
  });

  it('keeps only filled values of selected roles', () => {
    expect(filterTenantRoleValuesForIds({ 1: ' 50 ', 2: 'x', 3: '' }, [1, 3])).toEqual({ 1: '50' });
  });

  it('requires input for roles that ask for it', () => {
    const roles = [{ id: 1, has_user_input: true, input_field_label: 'المبلغ', input_field_type: 'number' }];
    expect(validateTenantRoleSelection([1], {}, roles)).toEqual({ 'tenant_role_values.1': 'المبلغ: مطلوب' });
    expect(validateTenantRoleSelection([1], { 1: 'abc' }, roles)['tenant_role_values.1']).toContain('رقماً');
    expect(validateTenantRoleSelection([1], { 1: '5' }, roles)).toEqual({});
  });
});

describe('other conditions', () => {
  it('trims and drops empty conditions', () => {
    expect(sanitizeOtherConditionsList([' a ', '', 'b'])).toEqual(['a', 'b']);
  });

  it('validates the list only when enabled', () => {
    expect(validateOtherConditionsList(0, [])).toEqual({});
    expect(validateOtherConditionsList(1, [])).toEqual({ other_conditions_list: 'أضف شرطاً واحداً على الأقل' });
    expect(validateOtherConditionsList(1, [''])).toEqual({ other_conditions_list: 'أدخل نص الشرط قبل الحفظ' });
    expect(validateOtherConditionsList(1, ['a', ' '])).toMatchObject({ 'other_conditions_list.1': 'نص الشرط مطلوب' });
    expect(validateOtherConditionsList(1, ['a'])).toEqual({});
  });
});

describe('normalizeFieldValue', () => {
  it('normalizes booleans, ids and files', () => {
    expect(normalizeFieldValue('1', 'furnished')).toBe(1);
    expect(normalizeFieldValue(null, 'furnished')).toBe(0);
    expect(normalizeFieldValue({ id: 4 }, 'payment_type_id')).toBe('4');
    expect(normalizeFieldValue({ url: 'a.png' }, 'image_instrument')).toBe('a.png');
    expect(normalizeFieldValue(null, 'street')).toBe('');
    expect(normalizeFieldValue(12, 'street')).toBe('12');
  });
});

describe('getStepFormValues', () => {
  const order = {
    step4: { tenant_entity: 'person', id_num_of_property_tenant_agent: '1000000000', tenant_id_num: '2000000000' },
    step5: { units: [{ unit_number: '5', floor_number: 2, unit_area: 80 }] },
    step6: { payment_type: { id: 7 }, tenant_role_ids: [1, 2], conditions: 0 },
    step2: { latitude: 24.7136, longitude: 46.6753, street: 'x' },
  };

  it('marks a legal representative when agent details exist', () => {
    expect(getStepFormValues(order, 'step4').is_there_a_legal_representative_of_the_tenant).toBe(1);
  });

  it('reads the first unit for step5', () => {
    expect(getStepFormValues(order, 'step5')).toMatchObject({ unit_number: '5', floor_number: '2', unit_area: '80' });
  });

  it('reads financial values', () => {
    expect(getStepFormValues(order, 'step6')).toMatchObject({ payment_type_id: '7', tenant_role_ids: [1, 2], conditions: 0 });
  });

  it('drops the placeholder map pin', () => {
    const values = getStepFormValues(order, 'step2');
    expect(values.latitude).toBe('');
    expect(values.street).toBe('x');
  });
});

describe('buildContractUpdatePayload', () => {
  it('sends only changed, allowed keys', () => {
    const initial = { street: 'a', neighborhood: 'b', not_a_key: 'x' };
    const form = { street: 'new', neighborhood: 'b', not_a_key: 'changed' };
    expect(buildContractUpdatePayload('step2', form, initial)).toEqual({ street: 'new' });
  });

  it('never sends an existing file url, only new files', () => {
    const file = new File(['x'], 'x.png');
    expect(buildContractUpdatePayload('step2', { image_address: 'old.png' }, { image_address: '' })).toEqual({});
    expect(buildContractUpdatePayload('step2', { image_address: file }, { image_address: '' })).toEqual({ image_address: file });
  });

  it('keeps tenant role flag and values in sync', () => {
    const payload = buildContractUpdatePayload(
      'step6',
      { tenant_role_ids: [1], tenant_role_values: { 1: '5', 2: '9' }, tenant_roles: 0 },
      { tenant_role_ids: [], tenant_role_values: {} },
    );
    expect(payload).toMatchObject({ tenant_role_ids: [1], tenant_roles: 1, tenant_role_values: { 1: '5' } });
  });

  it('empties the conditions list when disabled', () => {
    const payload = buildContractUpdatePayload(
      'step6',
      { conditions: 0, other_conditions_list: ['a'] },
      { conditions: 1, other_conditions_list: ['a'] },
    );
    expect(payload).toMatchObject({ conditions: 0, other_conditions_list: [] });
  });
});

describe('mapApiValidationErrors', () => {
  it('takes the first message of each field', () => {
    expect(mapApiValidationErrors({ street: ['required', 'other'], 'a.1': 'x' })).toEqual({ street: 'required', 'a.1': 'x' });
    expect(mapApiValidationErrors(null)).toEqual({});
  });
});
