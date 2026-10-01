import { WORK_PERIODS } from '@/features/employees/lib/work-periods';

const ROLE_BADGE_TONES = ['success', 'warning', 'neutral', 'danger'];
const MIN_PARTS_FOR_TWO_INITIALS = 2;

/** Cycles through badge tones so neighbouring roles look different. */
export function getRoleBadgeTone(index = 0) {
  return ROLE_BADGE_TONES[index % ROLE_BADGE_TONES.length];
}

export function getInitials(name) {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length >= MIN_PARTS_FOR_TWO_INITIALS) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

/** The API stores one `name`; the form edits first and last name separately. */
export function splitFullName(fullName) {
  const parts = String(fullName ?? '').trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
}

export function getWorkPeriodLabel(workPeriod) {
  return WORK_PERIODS.find((period) => period.value === workPeriod)?.label ?? 'غير محدد';
}

/** "12,500" for a salary, or null when there is no usable number. */
export function formatSalary(value) {
  if (value == null || value === '') return null;
  const number = parseFloat(value);
  if (Number.isNaN(number)) return null;
  return number.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/** YYYY-MM-DD, the format the original tables used. */
export function formatShortDate(value) {
  if (!value) return '---';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-CA');
}

export function formatNumber(value) {
  return parseFloat(value || 0).toLocaleString('ar-EG');
}
