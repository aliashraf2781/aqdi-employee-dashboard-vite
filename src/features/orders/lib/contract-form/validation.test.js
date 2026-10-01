import { describe, expect, it } from 'vitest';
import {
  buildContractFormSchema,
  describeValidationFailure,
  mapServerErrorsToFields,
  toErrorKey,
  validateContractForm,
} from './validation';

describe('validateContractForm', () => {
  it('requires visible required fields only', () => {
    const fields = [{ key: 'a', required: true }, { key: 'b', required: true, showWhen: { a: 'x' } }];
    expect(validateContractForm({ fields, form: { a: '', b: '' } })).toEqual({ a: 'هذا الحقل مطلوب' });
    expect(validateContractForm({ fields, form: { a: 'y', b: '' } })).toEqual({});
  });

  it('checks saudi ids and phones when filled', () => {
    const fields = [{ key: 'tenant_mobile', inputKind: 'phone' }, { key: 'tenant_id_num', inputKind: 'national_id' }];
    const errors = validateContractForm({ fields, form: { tenant_mobile: '123', tenant_id_num: '' } });
    expect(Object.keys(errors)).toEqual(['tenant_mobile']);
    expect(validateContractForm({ fields, form: { tenant_mobile: '0512345678', tenant_id_num: '1012345678' } })).toEqual({});
  });

  it('requires a positive unit area', () => {
    const fields = [{ key: 'unit_area' }];
    expect(validateContractForm({ fields, form: { unit_area: '0' } })).toEqual({ unit_area: 'يجب أن تكون المساحة أكبر من صفر' });
    expect(validateContractForm({ fields, form: { unit_area: '55' } })).toEqual({});
  });

  it('validates tenant role inputs with flat keys', () => {
    const roles = [{ id: 4, has_user_input: true, input_field_label: 'مبلغ' }];
    const errors = validateContractForm({ fields: [{ key: 'tenant_role_ids' }], form: { tenant_role_ids: [4], tenant_role_values: {} }, tenantRoles: roles });
    expect(errors).toEqual({ 'tenant_role_values:4': 'مبلغ: مطلوب' });
  });

  it('validates the conditions list', () => {
    const errors = validateContractForm({ fields: [{ key: 'other_conditions_list' }], form: { conditions: 1, other_conditions_list: ['a', ''] } });
    expect(errors['other_conditions_list:1']).toBe('نص الشرط مطلوب');
  });
});

describe('contract form schema', () => {
  it('turns errors into zod issues', () => {
    const schema = buildContractFormSchema([{ key: 'a', required: true }]);
    const result = schema.safeParse({ a: '' });
    expect(result.success).toBe(false);
    expect(result.error.issues[0]).toMatchObject({ path: ['a'], message: 'هذا الحقل مطلوب' });
    expect(schema.safeParse({ a: 'x' }).success).toBe(true);
  });
});

describe('error helpers', () => {
  it('converts list item keys', () => {
    expect(toErrorKey('tenant_role_values.3')).toBe('tenant_role_values:3');
    expect(toErrorKey('street')).toBe('street');
  });

  it('describes a failure', () => {
    expect(describeValidationFailure({ a: 'هذا الحقل مطلوب', b: 'x' })).toBe('يرجى تعبئة الحقول المطلوبة');
    expect(describeValidationFailure({ b: 'خطأ' })).toBe('خطأ');
  });

  it('maps server errors to this form', () => {
    const fields = [{ key: 'street' }, { key: 'unit_area' }];
    const mapped = mapServerErrorsToFields({ 'units.0.street': 'bad', unit_area: 'هذا الحقل مطلوب', other: 'x' }, fields, { unit_area: '0' });
    expect(mapped).toEqual({ street: 'bad', unit_area: 'يجب أن تكون المساحة أكبر من صفر' });
  });
});
