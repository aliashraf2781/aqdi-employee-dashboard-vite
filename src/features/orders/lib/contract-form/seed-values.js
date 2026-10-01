import { resolveContractDurationMode } from '../contract-fields';
import { getStepFormValues } from '../contract-update';

const FALLBACK_STEPS = ['summary', 'step1', 'step2', 'step3', 'step4', 'step6'];
const isBlank = (value) => value == null || value === '';

/** Calendar type of a field that belongs to another step, found wherever the order stores it. */
function findCalendarType(orderData, key) {
  for (const step of FALLBACK_STEPS) {
    const value = getStepFormValues(orderData, step)[key];
    if (!isBlank(value)) return value;
  }
  return undefined;
}

/** Values of the fields that belong to a different contract step than the editor's own step. */
function valuesFromOtherSteps(orderData, step, fields, base) {
  const extra = {};
  fields.forEach((field) => {
    if (field.step && field.step !== step) {
      const stepValues = getStepFormValues(orderData, field.step);
      extra[field.key] = stepValues[field.key] ?? '';
      if (field.calendarTypeKey) extra[field.calendarTypeKey] = stepValues[field.calendarTypeKey] ?? base[field.calendarTypeKey] ?? '';
    } else if (field.calendarTypeKey && base[field.calendarTypeKey] == null) {
      // Keep linked calendar types available even when the editor does not show them.
      const calendarType = findCalendarType(orderData, field.calendarTypeKey);
      if (calendarType !== undefined) extra[field.calendarTypeKey] = calendarType;
    }
  });
  return extra;
}

/**
 * Initial values of an editor form.
 * `initialValues` override the order's values (e.g. one unit); with `seedFromInitialValuesOnly`
 * they are the only source.
 */
export function buildContractFormSeed({ orderData, step, fields, initialValues = null, seedFromInitialValuesOnly = false }) {
  const overrides = initialValues && typeof initialValues === 'object' ? initialValues : null;
  if (seedFromInitialValuesOnly) return overrides ? { ...overrides } : {};
  if (!orderData) return {};

  const base = getStepFormValues(orderData, step);
  const merged = { ...base, ...valuesFromOtherSteps(orderData, step, fields, base), ...overrides };

  if (fields.some((field) => field.key === 'duration_mode') && !merged.duration_mode) {
    merged.duration_mode = resolveContractDurationMode(merged);
  }
  return merged;
}
