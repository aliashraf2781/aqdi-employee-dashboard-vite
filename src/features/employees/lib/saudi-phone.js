export const SAUDI_PHONE_MESSAGE = 'رقم الجوال يجب أن يكون 10 أرقام ويبدأ بـ 05';
const PHONE_MAX_DIGITS = 10;
const ARABIC_INDIC_ZERO = 0x0660;
const EASTERN_ARABIC_ZERO = 0x06f0;

function toWesternDigit(char) {
  const code = char.codePointAt(0);
  if (code >= ARABIC_INDIC_ZERO && code <= ARABIC_INDIC_ZERO + 9) return String(code - ARABIC_INDIC_ZERO);
  if (code >= EASTERN_ARABIC_ZERO && code <= EASTERN_ARABIC_ZERO + 9) return String(code - EASTERN_ARABIC_ZERO);
  return /[0-9]/.test(char) ? char : '';
}

/** Keeps digits only and converts Arabic-Indic digits to western ones. */
export function digitsOnly(value) {
  return Array.from(String(value ?? ''), toWesternDigit).join('');
}

/** Accepts 05xxxxxxxx, 5xxxxxxxx and 9665xxxxxxxx. */
export function isSaudiMobile(value) {
  let digits = digitsOnly(value);
  if (digits.startsWith('966') && digits.length >= 12) digits = `0${digits.slice(3)}`;
  if (/^5\d{8}$/.test(digits)) digits = `0${digits}`;
  return /^05\d{8}$/.test(digits);
}

/** Cleans what the user types in a phone input: digits only, normalized prefix, max 10. */
export function sanitizePhoneInput(value) {
  let digits = digitsOnly(value);
  if (digits.startsWith('966')) digits = `0${digits.slice(3)}`;
  else if (/^5\d{0,8}$/.test(digits)) digits = `0${digits}`;
  return digits.slice(0, PHONE_MAX_DIGITS);
}
