import { pick } from '../pick';

/** Small label/format helpers shared by the order detail view mappers. */

export function isPaidValue(value) {
  return value === true || value === 1 || value === '1' || value === 'paid';
}

export function tenantEntityLabel(value) {
  if (value === 'person') return 'فرد';
  if (value === 'institution') return 'مؤسسة أو شركة';
  return value || 'مستأجر';
}

export function durationLabel(financial = {}) {
  const years = pick(financial.duration_years, financial.contract_term_in_years?.years);
  const months = financial.duration_months;
  if (years && months) return `${years} سنة / ${months} شهر`;
  if (years) return `${years} سنة`;
  if (months) return `${months} شهر`;
  if (typeof financial.contract_term_in_years === 'string') {
    return financial.contract_term_in_years;
  }
  if (financial.contract_term_in_years && typeof financial.contract_term_in_years === 'object') {
    return pick(
      financial.contract_term_in_years.period,
      financial.contract_term_in_years.name,
      financial.contract_term_in_years.note_trans,
      financial.contract_term_in_years.note_ar
    );
  }
  return pick(financial.contract_term_name, financial.duration_preset);
}

export const STATUS_LABELS = {
  pending: 'قيد المراجعة',
  approved: 'تمت الموافقة',
  rejected: 'مرفوض',
  refunded: 'تم الاسترجاع',
  processing: 'قيد المعالجة',
  paid: 'مدفوع',
  unpaid: 'غير مدفوع',
  cancelled: 'ملغى',
  canceled: 'ملغى',
};

export function translateStatus(value) {
  if (value == null || value === '') return null;
  const key = String(value).trim().toLowerCase();
  return STATUS_LABELS[key] || String(value);
}

export function yesNoLabel(value) {
  if (value === true || value === 1 || value === '1') return 'نعم';
  if (value === false || value === 0 || value === '0') return 'لا';
  return value == null || value === '' ? null : String(value);
}

export function meterOwnershipLabel(value) {
  if (value === 'owner') return 'المالك';
  if (value === 'tenant') return 'المستأجر';
  return value == null || value === '' ? null : String(value);
}

export function calendarTypeLabel(value) {
  if (value === 'hijri') return 'هجري';
  if (value === 'gregorian') return 'ميلادي';
  return value || null;
}

export function appOrWebLabel(value) {
  if (value === 'app') return 'تطبيق';
  if (value === 'web') return 'موقع';
  return value || null;
}

export function composeTenantDob(tenant) {
  const composed = [
    tenant.tenant_dob_day,
    tenant.tenant_dob_month,
    tenant.tenant_dob_year,
  ]
    .filter((part) => part != null && part !== '')
    .join('-');
  return pick(tenant.tenant_dob, composed || null);
}

export function composePartsDob(bucket, baseKey) {
  if (!bucket) return null;
  const full = bucket[baseKey];
  const composed = [bucket[`${baseKey}_day`], bucket[`${baseKey}_month`], bucket[`${baseKey}_year`]]
    .filter((part) => part != null && part !== '')
    .join('-');
  return pick(full, composed || null);
}

export function relationName(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    return pick(value.name_trans, value.name_ar, value.name, value.name_en);
  }
  return null;
}

export function draftContactModeLabel(mode) {
  if (mode === 'same') return 'نفس الرقم المسجّل';
  if (mode === 'another') return 'رقم آخر';
  return mode || null;
}
