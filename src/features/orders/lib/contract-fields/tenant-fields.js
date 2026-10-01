import { booleanField, calendarTypeField, fileField, textField } from './field-helpers';

const HAS_REPRESENTATIVE = { is_there_a_legal_representative_of_the_tenant: 1 };
const PERSON = { entity: 'person' };
const INSTITUTION = { entity: 'institution' };

const AUTHORIZATION_TYPE_OPTIONS = [
  { value: 'owner_and_representative_of_record', label: 'أنا مالك السجل وممثله' },
  { value: 'agent_or_authorized_by_registry_owner', label: 'أنا وكيل أو مفوض عن مالك السجل' },
];

const PERSON_FIELDS = [
  textField('tenant_id_num', 'رقم هوية المستأجر', { ...PERSON, inputKind: 'national_id' }),
  textField('tenant_mobile', 'رقم جوال المستأجر', { ...PERSON, inputKind: 'phone' }),
  calendarTypeField('type_tenant_dob', 'نوع تاريخ الميلاد', PERSON),
  { key: 'tenant_dob', label: 'تاريخ ميلاد المستأجر', type: 'date', calendarTypeKey: 'type_tenant_dob', ...PERSON },
  booleanField('is_there_a_legal_representative_of_the_tenant', 'هل يوجد ممثل نظامي للمستأجر؟'),
  textField('id_num_of_property_tenant_agent', 'رقم هوية الوكيل', { ...PERSON, inputKind: 'national_id', showWhen: HAS_REPRESENTATIVE }),
  textField('mobile_of_property_tenant_agent', 'جوال الوكيل', { ...PERSON, inputKind: 'phone', showWhen: HAS_REPRESENTATIVE }),
  calendarTypeField('type_dob_tenant_agent', 'نوع تاريخ ميلاد الوكيل', { ...PERSON, showWhen: HAS_REPRESENTATIVE }),
  {
    key: 'dob_of_property_tenant_agent',
    label: 'تاريخ ميلاد الوكيل',
    type: 'date',
    calendarTypeKey: 'type_dob_tenant_agent',
    ...PERSON,
    showWhen: HAS_REPRESENTATIVE,
  },
  fileField('copy_of_the_authorization_or_agency', 'صورة الوكالة', { ...PERSON, showWhen: HAS_REPRESENTATIVE }),
  fileField('copy_of_the_owner_record', 'صورة سجل المالك'),
];

const INSTITUTION_FIELDS = [
  { key: 'authorization_type', label: 'نوع التفويض أو الوكالة', type: 'select', options: AUTHORIZATION_TYPE_OPTIONS, ...INSTITUTION },
  textField('tenant_entity_unified_registry_number', 'رقم السجل الموحد', { ...INSTITUTION, hint: '10 أرقام ويبدأ بالرقم 7' }),
  textField('id_num_of_property_tenant_agent', 'رقم هوية مالك السجل', { ...INSTITUTION, inputKind: 'national_id' }),
  textField('mobile_of_property_tenant_agent', 'رقم جوال مالك السجل', { ...INSTITUTION, inputKind: 'phone' }),
  calendarTypeField('type_dob_tenant_agent', 'نوع تاريخ ميلاد مالك السجل', INSTITUTION),
  { key: 'dob_of_property_tenant_agent', label: 'تاريخ ميلاد مالك السجل', type: 'date', calendarTypeKey: 'type_dob_tenant_agent', ...INSTITUTION },
  fileField('copy_of_the_authorization_or_agency', 'صورة التفويض / الوكالة', {
    ...INSTITUTION,
    hint: 'مطلوبة عند اختيار وكيل أو مفوض عن مالك السجل',
    showWhen: { authorization_type: 'agent_or_authorized_by_registry_owner' },
  }),
];

/**
 * Tenant section (contract step 4). Person and institution fields share keys, so the same
 * key can appear twice with different `entity`; only the fields of the current entity are shown.
 */
export const TENANT_FIELDS = [
  {
    key: 'tenant_entity',
    label: 'صفة المستأجر',
    type: 'select',
    options: [
      { value: 'person', label: 'فرد' },
      { value: 'institution', label: 'مؤسسة أو شركة' },
    ],
  },
  ...PERSON_FIELDS,
  ...INSTITUTION_FIELDS,
];
