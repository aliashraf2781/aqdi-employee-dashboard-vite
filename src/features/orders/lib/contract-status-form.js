import { tokenToHex } from '@/shared/lib/theme-colors';

// The API and the native color picker want "#rrggbb", so defaults are read from the
// theme tokens when the form opens instead of being written here as raw colors.
export function createEmptyContractStatusForm() {
  return {
    name: '',
    color: tokenToHex('success'),
    color_text: tokenToHex('primary-foreground'),
    client_explanation: '',
    description: '',
    is_active: true,
  };
}

function isActiveFlag(value) {
  return value !== false && value !== 0 && value !== '0';
}

/** Body for POST /admin/contract-statuses and POST /admin/contract-statuses/:id */
export function buildContractStatusPayload(form) {
  const explanation = form.client_explanation?.trim?.() ?? form.client_explanation;
  return {
    name: String(form.name ?? '').trim(),
    color: form.color || tokenToHex('foreground'),
    client_explanation: explanation || null,
    is_active: isActiveFlag(form.is_active),
    ...(form.color_text ? { color_text: form.color_text } : {}),
    ...(form.description != null ? { description: String(form.description).trim() || null } : {}),
  };
}

/** Form values for editing an existing status. */
export function contractStatusToForm(status) {
  const defaults = createEmptyContractStatusForm();
  return {
    name: status.name ?? '',
    color: status.color || defaults.color,
    color_text: status.color_text || defaults.color_text,
    client_explanation: status.client_explanation ?? '',
    description: status.description ?? '',
    is_active: isActiveFlag(status.is_active),
  };
}
