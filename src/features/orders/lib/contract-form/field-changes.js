import { resolveCalendarType, CALENDAR_TYPE_TO_DATE_KEYS, convertDateBetweenCalendars } from './calendar';

/** Date fields that also keep separate day/month/year fields in the API. */
const DATE_PARTS_FIELDS = {
  tenant_dob: 'tenant_dob',
  dob_of_property_tenant_agent: 'dob_of_property_tenant_agent',
  instrument_history: 'instrument_history',
  date_first_registration: 'date_first_registration',
};

function splitDateParts(next, baseKey, dateString) {
  const parts = String(dateString).split('-');
  if (parts.length !== 3) return;
  [next[`${baseKey}_day`], next[`${baseKey}_month`], next[`${baseKey}_year`]] = parts;
}

/**
 * Listed period and custom years/months are two ways to set the same length. The inactive
 * values are parked, so switching back before saving restores them, and the active copies
 * are cleared so only the chosen mode is submitted.
 */
function switchDurationMode(previous, next, mode) {
  if (mode === 'custom') {
    next.__listed_term = previous.contract_term_in_years ?? '';
    next.contract_term_in_years = '';
    if (previous.__custom_years !== undefined) next.duration_years = previous.__custom_years;
    if (previous.__custom_months !== undefined) next.duration_months = previous.__custom_months;
    return;
  }
  next.__custom_years = previous.duration_years ?? '';
  next.__custom_months = previous.duration_months ?? '';
  next.duration_years = '';
  next.duration_months = '';
  if (previous.__listed_term !== undefined) next.contract_term_in_years = previous.__listed_term;
}

/** Switching Hijri/Gregorian converts the dates the type describes. */
function convertLinkedDates(previous, next, field, value) {
  const dateKeys = CALENDAR_TYPE_TO_DATE_KEYS[field.key];
  if (!dateKeys) return;

  const fromType = resolveCalendarType(previous[field.key], previous[dateKeys[0]]);
  const toType = resolveCalendarType(value, previous[dateKeys[0]]);

  dateKeys.forEach((dateKey) => {
    if (!previous[dateKey]) return;
    next[dateKey] = convertDateBetweenCalendars(previous[dateKey], fromType, toType);
    if (DATE_PARTS_FIELDS[dateKey] && next[dateKey]) splitDateParts(next, DATE_PARTS_FIELDS[dateKey], next[dateKey]);
  });
}

/**
 * New form values after the user changed `field` to `value`, including the fields that depend on it:
 * duration mode, region -> city reset, calendar type -> converted dates, date -> day/month/year parts.
 */
export function applyFieldChange(previous, field, value) {
  const next = { ...previous, [field.key]: value };

  if (field.key === 'duration_mode' && value !== previous.duration_mode) switchDurationMode(previous, next, value);

  if (field.key === 'property_place_id' && String(previous.property_place_id ?? '') !== String(value ?? '')) {
    next.property_city_id = '';
  }

  convertLinkedDates(previous, next, field, value);

  if (field.type === 'date' && typeof value === 'string' && DATE_PARTS_FIELDS[field.key]) {
    splitDateParts(next, DATE_PARTS_FIELDS[field.key], value);
  }

  return next;
}
