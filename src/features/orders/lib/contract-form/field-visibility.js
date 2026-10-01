const isYes = (value) => value === true || value === 1 || value === '1';
const isNo = (value) => value === false || value === 0 || value === '0';

export function isFieldEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function matchesExpected(actual, expected) {
  if (Array.isArray(expected)) return expected.includes(actual);
  if (actual === expected) return true;
  return (isYes(expected) && isYes(actual)) || (isNo(expected) && isNo(actual));
}

/**
 * Whether a field shows for the current form values:
 * `entity` limits it to persons or institutions, `showWhen` to other fields having given values.
 */
export function isFieldVisible(field, formValues) {
  if (!field) return false;

  const entity = formValues?.tenant_entity;
  if (field.entity === 'institution' && entity !== 'institution') return false;
  if (field.entity === 'person' && entity === 'institution') return false;

  if (field.showWhen && typeof field.showWhen === 'object') {
    return Object.entries(field.showWhen).every(([key, expected]) => matchesExpected(formValues?.[key], expected));
  }
  return true;
}
