import DateObject from 'react-date-object';
import arabic from 'react-date-object/calendars/arabic';
import gregorian from 'react-date-object/calendars/gregorian';
import arabicLocale from 'react-date-object/locales/arabic_ar';
import gregorianLocale from 'react-date-object/locales/gregorian_ar';

export const DATE_FORMAT = 'DD-MM-YYYY';
const ISO_DATE_FORMAT = 'YYYY-MM-DD';
const LATIN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const EASTERN_DIGITS = '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹';
/** Gregorian years are above this value, Hijri years below it. */
const LAST_HIJRI_YEAR = 1700;

/** Arabic month names with Latin digits, so years are not stored or shown as Eastern digits. */
export const gregorianCalendarLocale = { ...gregorianLocale, digits: LATIN_DIGITS };
export const hijriCalendarLocale = { ...arabicLocale, digits: LATIN_DIGITS };

/** Calendar type field -> the date fields it describes. Changing the type converts those dates. */
export const CALENDAR_TYPE_TO_DATE_KEYS = {
  type_dob_property_owner: ['property_owner_dob'],
  type_dob_property_owner_agent: ['dob_of_property_owner_agent'],
  type_tenant_dob: ['tenant_dob'],
  type_dob_tenant_agent: ['dob_of_property_tenant_agent'],
  type_contract_starting_date: ['contract_starting_date'],
  type_instrument_history: ['instrument_history'],
  type_date_first_registration: ['date_first_registration'],
};

export function toLatinDigits(value) {
  return String(value ?? '').replace(/[٠-٩۰-۹]/g, (char) => {
    const index = EASTERN_DIGITS.indexOf(char) % 10;
    return index >= 0 ? String(index) : char;
  });
}

/** Date part only, Latin digits, hyphen separators. */
export function normalizeDateInput(value) {
  const text = toLatinDigits(value).trim();
  if (!text) return '';
  return text.split(/[T ]/)[0].replace(/[/.]/g, '-');
}

/** API dates are YYYY-MM-DD; the picker also produces DD-MM-YYYY. */
export function storedDateFormat(value) {
  return /^\d{4}-\d{1,2}-\d{1,2}$/.test(normalizeDateInput(value)) ? ISO_DATE_FORMAT : DATE_FORMAT;
}

export function normalizeCalendarType(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'hijri' || raw === 'هجري' || raw.includes('hijri')) return 'hijri';
  if (raw === 'gregorian' || raw === 'ميلادي' || raw.includes('gregorian')) return 'gregorian';
  return null;
}

/** Guess the calendar of a date without a type: Hijri years are below 1700. */
export function inferCalendarTypeFromDate(dateString) {
  const normalized = normalizeDateInput(dateString);
  if (!normalized) return 'gregorian';

  const parts = normalized.split('-').map(Number);
  const year = storedDateFormat(normalized) === ISO_DATE_FORMAT ? parts[0] : parts[parts.length - 1];
  if (!Number.isFinite(year)) return 'gregorian';
  return year > LAST_HIJRI_YEAR ? 'gregorian' : 'hijri';
}

export function resolveCalendarType(typeValue, dateValue) {
  return normalizeCalendarType(typeValue) || inferCalendarTypeFromDate(dateValue);
}

export function calendarParts(calendarType) {
  if (calendarType === 'hijri') return { calendar: arabic, locale: hijriCalendarLocale };
  return { calendar: gregorian, locale: gregorianCalendarLocale };
}

function tryParse(date, format, { calendar, locale }) {
  try {
    const parsed = new DateObject({ date, format, calendar, locale });
    return parsed.isValid ? parsed : null;
  } catch {
    return null;
  }
}

/** A DateObject for the stored string in the given calendar, or null when it cannot be read. */
export function parseContractDate(value, calendarType) {
  const normalized = normalizeDateInput(value);
  if (!normalized) return null;

  const format = storedDateFormat(normalized);
  const primary = calendarParts(calendarType);
  const parsed = tryParse(normalized, format, primary);
  if (parsed) return parsed;

  // A leading 4-digit year is already a full year; retrying as DD-MM-YYYY would invent one.
  if (format === ISO_DATE_FORMAT) return null;

  const swapped = tryParse(normalized, format, calendarParts(calendarType === 'hijri' ? 'gregorian' : 'hijri'));
  return swapped ? swapped.convert(primary.calendar, primary.locale) : null;
}

export function formatContractDate(date) {
  return date?.format ? toLatinDigits(date.format(DATE_FORMAT)) : '';
}

export function convertDateBetweenCalendars(dateString, fromType, toType) {
  if (!dateString || fromType === toType) return dateString;
  try {
    const parsed = parseContractDate(dateString, fromType);
    if (!parsed) return dateString;
    const target = calendarParts(toType);
    return formatContractDate(parsed.convert(target.calendar, target.locale));
  } catch {
    return dateString;
  }
}
