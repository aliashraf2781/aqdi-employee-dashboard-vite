import { z } from 'zod';

const REQUIRED_MESSAGE = 'هذا الحقل مطلوب';

/**
 * Extra inputs of a status come from the API (status_case.fields), each like
 * { name, type: 'text'|'select'|'file'|..., label_ar, required, required_if: [otherField, expectedValue], options }.
 */
export function getFieldLabel(field) {
  return field?.label_ar || field?.label_en || field?.name || '';
}

export function getOptionLabel(option) {
  return option?.label_ar || option?.label_en || option?.value || '';
}

function isEmpty(value) {
  return value == null || value === '';
}

/** `required_if: [other, expected]` makes a field required (and visible) only when `other` equals `expected`. */
function matchesRequiredIf(field, values) {
  const condition = field?.required_if;
  if (!Array.isArray(condition) || condition.length < 2) return null;
  const [otherName, expected] = condition;
  return String(values?.[otherName] ?? '') === String(expected);
}

export function isFieldRequired(field, values) {
  if (field?.required) return true;
  return matchesRequiredIf(field, values) === true;
}

export function isFieldVisible(field, values) {
  const matches = matchesRequiredIf(field, values);
  return matches === null ? true : matches;
}

/** Initial form values: empty text, no file. */
export function buildEmptyStatusValues(fields) {
  return Object.fromEntries(fields.map((field) => [field.name, field.type === 'file' ? null : '']));
}

/** Zod schema that requires every visible required field. */
export function buildStatusFieldsSchema(fields) {
  return z.record(z.any()).superRefine((values, context) => {
    fields.forEach((field) => {
      const mustFill = isFieldVisible(field, values) && isFieldRequired(field, values);
      if (mustFill && isEmpty(values[field.name])) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: [field.name], message: REQUIRED_MESSAGE });
      }
    });
  });
}
