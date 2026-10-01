import { calendarTypeField } from './field-helpers';

const rangeOptions = (count) => Array.from({ length: count }, (_, index) => ({ value: String(index), label: String(index) }));

const FINANCIAL_FIELDS = [
  { key: 'payment_type_id', label: 'نوع الدفع', type: 'select', optionsSource: 'payment-types' },
  {
    key: 'duration_mode',
    label: 'نوع المدة',
    type: 'segmented',
    options: [
      { value: 'listed', label: 'من القائمة' },
      { value: 'custom', label: 'مخصصة' },
    ],
  },
  { key: 'contract_term_in_years', label: 'مدة العقد', type: 'select', optionsSource: 'contract-periods', showWhen: { duration_mode: 'listed' } },
  { key: 'duration_years', label: 'مدة (سنوات)', type: 'select', options: rangeOptions(31), showWhen: { duration_mode: 'custom' } },
  { key: 'duration_months', label: 'مدة (أشهر)', type: 'select', options: rangeOptions(12), showWhen: { duration_mode: 'custom' } },
  { key: 'notes_edits', label: 'ملاحظات التعديل', type: 'textarea', colSpan: 2 },
];

const CONTRACT_DATE_FIELDS = [
  { key: 'contract_starting_date', label: 'تاريخ بداية العقد', type: 'date', calendarTypeKey: 'type_contract_starting_date' },
  calendarTypeField('type_contract_starting_date', 'نوع التاريخ'),
];

const OTHER_CONDITIONS_FIELDS = [
  { key: 'conditions', label: 'هل توجد شروط أخرى؟', type: 'hidden' },
  { key: 'other_conditions_list', label: 'قائمة الشروط', type: 'other-conditions', colSpan: 3 },
];

const TENANT_ROLES_FIELDS = [
  { key: 'tenant_role_ids', label: 'صلاحيات المستأجر', type: 'tenant-roles', colSpan: 3 },
  { key: 'tenant_role_values', label: 'قيم صلاحيات المستأجر', type: 'hidden' },
  { key: 'tenant_roles', label: 'تفعيل صلاحيات المستأجر', type: 'hidden' },
];

export const FINANCIAL_FIELD_GROUPS = [
  { title: 'البيانات المالية', fields: FINANCIAL_FIELDS },
  { title: 'مدة وتاريخ العقد', fields: CONTRACT_DATE_FIELDS },
  { title: 'شروط أخرى', fields: OTHER_CONDITIONS_FIELDS },
  { title: 'صلاحيات المستأجر', fields: TENANT_ROLES_FIELDS },
];

/** Lease renewal: the client's requested terms and the "please note" box. */
export const LEASE_RENEWAL_TERMS_FIELDS = [
  { key: 'text_additional_terms', label: 'الشروط والمتغيرات', type: 'textarea', colSpan: 3 },
];

export const LEASE_RENEWAL_NOTES_FIELDS = [{ key: 'notes_edits', label: 'ملاحظات الانتباه', type: 'textarea', colSpan: 3 }];

function isSet(value) {
  if (value == null || value === '') return false;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? String(value).trim() !== '' : numeric !== 0;
}

/**
 * A contract length is either a listed period or custom years/months, never both.
 * Returns which one the saved values use ('listed' unless only custom values are set).
 */
export function resolveContractDurationMode(values = {}) {
  const listed = values.contract_term_in_years != null && String(values.contract_term_in_years).trim() !== '';
  const custom = isSet(values.duration_years) || isSet(values.duration_months);
  return custom && !listed ? 'custom' : 'listed';
}
