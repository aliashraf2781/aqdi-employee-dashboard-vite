import { stripHtml } from '@/shared/lib/html';

export const INPUT_FIELD_TYPES = [
  { value: 'text', label: 'نص (text)' },
  { value: 'number', label: 'رقم (number)' },
];

export function tenantRoleToFormValues(role) {
  return {
    text_of_reason: role.text_of_reason || role.name || '',
    service_definition: role.service_definition || '',
    hasUserInput: Boolean(role.has_user_input || role.input_field_label || role.input_field_type),
    input_field_label: role.input_field_label || '',
    input_field_type: role.input_field_type || 'text',
  };
}

/** Form values -> request body. The input-field settings only count when the switch is on. */
export function buildTenantRolePayload(values) {
  const definitionHtml = String(values.service_definition || '').trim();
  const hasDefinition = stripHtml(definitionHtml) !== '';

  return {
    text_of_reason: values.text_of_reason.trim(),
    service_definition: hasDefinition ? definitionHtml : null,
    input_field_label: values.hasUserInput ? values.input_field_label.trim() || null : null,
    input_field_type: values.hasUserInput ? values.input_field_type || null : null,
  };
}
