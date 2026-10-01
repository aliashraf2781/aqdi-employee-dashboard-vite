import { ALL_UNIT_FIELDS, HIDDEN_UNIT_PAYLOAD_KEYS } from './contract-fields';
import { normalizeFieldValue } from './contract-update';

const isEmptyValue = (value) => value === '' || value == null;

/**
 * The unit endpoint replaces the whole record, so saving one section has to resend every field
 * it does not edit; otherwise rooms and services would be wiped.
 */
export function getUnitFullPayload(unit) {
  const payload = {};
  [...ALL_UNIT_FIELDS.map((field) => field.key), ...HIDDEN_UNIT_PAYLOAD_KEYS].forEach((key) => {
    const value = normalizeFieldValue(unit?.[key], key);
    if (!isEmptyValue(value)) payload[key] = value;
  });
  return payload;
}

/** Form values of a unit: each field's value, plus the readable name of select fields (displayKey). */
export function getUnitFormValues(unit) {
  const values = {};
  ALL_UNIT_FIELDS.forEach((field) => {
    values[field.key] = normalizeFieldValue(unit?.[field.key], field.key);
    if (field.displayKey && unit?.[field.displayKey] != null) values[field.displayKey] = unit[field.displayKey];
  });
  return values;
}

/** Changes whenever a value the unit form shows changes, so the form is re-seeded only then. */
export function getUnitFormVersion(unit) {
  const keys = [...ALL_UNIT_FIELDS.map((field) => field.key), ...HIDDEN_UNIT_PAYLOAD_KEYS, 'id', 'updated_at'];
  return JSON.stringify(keys.map((key) => unit?.[key]));
}

/** Whether this unit is the one the contract itself points to. */
export function isSelectedUnit(unit, order) {
  const selectedId = order?.real_units_id ?? order?.contract_summary?.real_units_id;
  if (selectedId == null || unit?.id == null) return false;
  return Number(unit.id) === Number(selectedId);
}
