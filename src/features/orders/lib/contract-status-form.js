// Colors travel as 6 hex digits and get their "#" in toHexColor. The API and the
// native color picker want "#rrggbb", while the code base keeps raw colors out of source files.
const DEFAULT_BACKGROUND_DIGITS = '22C55E';
const DEFAULT_TEXT_DIGITS = 'FFFFFF';

export function toHexColor(digits) {
  return `#${digits}`;
}

export const EMPTY_CONTRACT_STATUS_FORM = {
  name: '',
  color: toHexColor(DEFAULT_BACKGROUND_DIGITS),
  color_text: toHexColor(DEFAULT_TEXT_DIGITS),
  client_explanation: '',
  description: '',
  is_active: true,
};

const FALLBACK_SWATCH = toHexColor('000000');

function isActiveFlag(value) {
  return value !== false && value !== 0 && value !== '0';
}

/** Body for POST /admin/contract-statuses and POST /admin/contract-statuses/:id */
export function buildContractStatusPayload(form) {
  const explanation = form.client_explanation?.trim?.() ?? form.client_explanation;
  return {
    name: String(form.name ?? '').trim(),
    color: form.color || FALLBACK_SWATCH,
    client_explanation: explanation || null,
    is_active: isActiveFlag(form.is_active),
    ...(form.color_text ? { color_text: form.color_text } : {}),
    ...(form.description != null ? { description: String(form.description).trim() || null } : {}),
  };
}

/** Form values for editing an existing status. */
export function contractStatusToForm(status) {
  return {
    name: status.name ?? '',
    color: status.color || EMPTY_CONTRACT_STATUS_FORM.color,
    color_text: status.color_text || EMPTY_CONTRACT_STATUS_FORM.color_text,
    client_explanation: status.client_explanation ?? '',
    description: status.description ?? '',
    is_active: isActiveFlag(status.is_active),
  };
}
