import { describe, expect, it } from 'vitest';
import { buildTenantRolePayload, tenantRoleToFormValues } from './tenant-role';

const values = {
  text_of_reason: ' غرامة ',
  service_definition: '<p>نص</p>',
  hasUserInput: true,
  input_field_label: ' المبلغ ',
  input_field_type: 'number',
};

describe('tenant role helpers', () => {
  it('builds the payload with an input field', () => {
    expect(buildTenantRolePayload(values)).toEqual({
      text_of_reason: 'غرامة',
      service_definition: '<p>نص</p>',
      input_field_label: 'المبلغ',
      input_field_type: 'number',
    });
  });

  it('drops the input field when the switch is off and empty definitions become null', () => {
    const payload = buildTenantRolePayload({ ...values, hasUserInput: false, service_definition: '<p></p>' });
    expect(payload).toMatchObject({ service_definition: null, input_field_label: null, input_field_type: null });
  });

  it('detects an input field when loading a row', () => {
    expect(tenantRoleToFormValues({ text_of_reason: 'أ', input_field_label: 'ب' }).hasUserInput).toBe(true);
    expect(tenantRoleToFormValues({ name: 'أ' })).toMatchObject({ text_of_reason: 'أ', hasUserInput: false });
  });
});
