export const SAUDI_PHONE_MESSAGE = 'رقم الجوال يجب أن يكون 10 أرقام ويبدأ بـ 05';
export const SAUDI_PHONE_DIGITS_ONLY_MESSAGE = 'رقم الجوال يقبل أرقام فقط';

const ARABIC_INDIC_ZERO = 0x0660;
const EASTERN_ARABIC_ZERO = 0x06f0;
const MOBILE_LENGTH = 10;

function digitFromCode(code, zero) {
  return code >= zero && code <= zero + 9 ? String(code - zero) : null;
}

/** Keeps digits only and converts Arabic-Indic / Eastern Arabic digits to 0-9. */
export function digitsOnly(value) {
  return Array.from(String(value ?? ''), (char) => {
    const code = char.codePointAt(0);
    return digitFromCode(code, 48) ?? digitFromCode(code, ARABIC_INDIC_ZERO) ?? digitFromCode(code, EASTERN_ARABIC_ZERO) ?? '';
  }).join('');
}

function normalizeMobile(value) {
  let digits = digitsOnly(value);
  if (digits.startsWith('966') && digits.length >= 12) digits = `0${digits.slice(3)}`;
  if (/^5\d{8}$/.test(digits)) digits = `0${digits}`;
  return digits;
}

/** Saudi mobile: 05xxxxxxxx. Also accepts 5xxxxxxxx and 9665xxxxxxxx. */
export function isSaudiMobile(value) {
  return /^05\d{8}$/.test(normalizeMobile(value));
}

/** Error text for a mobile field, or null when valid. */
export function getSaudiMobileError(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return 'رقم الجوال مطلوب';
  if (/[^\d\s+\-٠-٩۰-۹]/.test(raw)) return SAUDI_PHONE_DIGITS_ONLY_MESSAGE;
  return isSaudiMobile(raw) ? null : SAUDI_PHONE_MESSAGE;
}

/** Cleans what the user types: digits only, 05 prefix, max 10 digits. */
export function sanitizeSaudiMobileInput(value) {
  let digits = digitsOnly(value);
  if (digits.startsWith('966')) digits = `0${digits.slice(3)}`;
  else if (/^5\d{0,8}$/.test(digits)) digits = `0${digits}`;
  return digits.slice(0, MOBILE_LENGTH);
}
