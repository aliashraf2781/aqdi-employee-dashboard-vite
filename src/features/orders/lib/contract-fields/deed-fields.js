import { booleanField, calendarTypeField, fileField, textField } from './field-helpers';

export const OWNER_AGENT_SHOW_WHEN = { add_legal_agent_of_owner: 1 };

/** Owner section of the deed editor. */
export const OWNER_FIELDS = [
  textField('property_owner_id_num', 'رقم الهوية', { inputKind: 'national_id' }),
  { key: 'property_owner_dob', label: 'تاريخ الميلاد', type: 'date', calendarTypeKey: 'type_dob_property_owner' },
  calendarTypeField('type_dob_property_owner', 'نوع تاريخ الميلاد'),
  textField('property_owner_mobile', 'رقم الجوال', { inputKind: 'phone' }),
  booleanField('add_legal_agent_of_owner', 'إضافة وكيل للمالك'),
];

const AGENT_FIELDS = [
  textField('id_num_of_property_owner_agent', 'رقم هوية الوكيل', { inputKind: 'national_id' }),
  { key: 'dob_of_property_owner_agent', label: 'تاريخ ميلاد الوكيل', type: 'date', calendarTypeKey: 'type_dob_property_owner_agent' },
  calendarTypeField('type_dob_property_owner_agent', 'نوع تاريخ ميلاد الوكيل'),
  textField('mobile_of_property_owner_agent', 'جوال الوكيل', { inputKind: 'phone' }),
  fileField('copy_of_the_authorization_or_agency', 'صورة التفويض / الوكالة'),
];

const AGENCY_EXTRA_FIELDS = [
  textField('agency_number_in_instrument_of_property_owner', 'رقم الوكالة في الصك'),
  {
    key: 'agency_instrument_date_of_property_owner',
    label: 'تاريخ الوكالة',
    type: 'date',
    calendarTypeKey: 'type_agency_instrument_date_of_property_owner',
  },
  calendarTypeField('type_agency_instrument_date_of_property_owner', 'نوع تاريخ الوكالة'),
  textField('agent_iban_of_property_owner', 'آيبان الوكيل'),
  textField('id_num_of_property_owner_agent_record', 'هوية سجل الوكيل', { inputKind: 'national_id' }),
  textField('dob_hijri_of_property_owner_agent', 'تاريخ ميلاد الوكيل (هجري)'),
  fileField('copy_power_of_attorney_from_heirs_to_agent', 'توكيل الورثة للوكيل'),
  fileField('Image_inheritance_certificate', 'شهادة حصر الإرث'),
];

/** Agent fields only show while "add legal agent" is on. */
export const LEGAL_AGENT_FIELDS = [...AGENT_FIELDS, ...AGENCY_EXTRA_FIELDS].map((field) => ({
  ...field,
  showWhen: OWNER_AGENT_SHOW_WHEN,
}));

export const ENDOWMENT_FIELDS = [
  fileField('copy_of_the_endowment_registration_certificate', 'شهادة تسجيل الوقف'),
  fileField('copy_of_the_trusteeship_deed', 'صك النظارة'),
  booleanField('is_multiple_trusteeship_deed_copy', 'أكثر من صك نظارة'),
  fileField('copy_of_guardians_power_of_attorney_for_agent', 'توكيل الأولياء للوكيل'),
];

const STEP1 = { step: 'step1' };

export const PROPERTY_FIELDS = [
  textField('name_real_estate', 'اسم العقار', STEP1),
  { key: 'property_type_id', label: 'نوع العقار', type: 'select', optionsSource: 'property-types', displayKey: 'property_type_name', ...STEP1 },
  { key: 'property_usages_id', label: 'استخدام العقار', type: 'select', optionsSource: 'property-usages', displayKey: 'property_usages_name', ...STEP1 },
  textField('real_estate_registry_number', 'رقم السجل العقاري', STEP1),
  textField('unit_number_of_real', 'رقم الوحدة في العقار', STEP1),
  { key: 'instrument_history', label: 'تاريخ الصك', type: 'date', calendarTypeKey: 'type_instrument_history', ...STEP1 },
  calendarTypeField('type_instrument_history', 'نوع تاريخ الصك', STEP1),
  { key: 'date_first_registration', label: 'تاريخ أول تسجيل', type: 'date', calendarTypeKey: 'type_date_first_registration', ...STEP1 },
  calendarTypeField('type_date_first_registration', 'نوع تاريخ أول تسجيل', STEP1),
  textField('number_of_floors', 'عدد الطوابق', STEP1),
  textField('number_of_units_per_floor', 'عدد الوحدات في كل طابق', STEP1),
  textField('number_of_units_in_realestate', 'إجمالي وحدات العقار', STEP1),
];

export const INSTRUMENT_IMAGE_FIELDS = [
  fileField('image_instrument', 'صورة الصك'),
  fileField('image_instrument_from_the_front', 'صورة الصك (من الأمام)'),
  fileField('image_instrument_from_the_back', 'صورة الصك (من الخلف)'),
  fileField('Image_inheritance_certificate', 'شهادة حصر الإرث'),
  fileField('copy_power_of_attorney_from_heirs_to_agent', 'توكيل الورثة للوكيل'),
  fileField('copy_of_the_endowment_registration_certificate', 'شهادة تسجيل الوقف'),
  fileField('copy_of_the_trusteeship_deed', 'صك النظارة'),
  fileField('copy_of_guardians_power_of_attorney_for_agent', 'توكيل الأولياء للوكيل'),
];

/** Groups of the deed/owner editor. `instrumentTypeLabel` fills the locked "document type" field. */
export function buildDeedFieldGroups({ instrumentTypeLabel, showNazir }) {
  const groups = [
    {
      title: 'بيانات المستند',
      fields: [
        { key: '__deed_type_display', label: 'نوع المستند', type: 'text', locked: true, displayValue: instrumentTypeLabel },
        textField('instrument_number', 'رقم الصك', STEP1),
      ],
    },
    { title: 'بيانات المالك', fields: OWNER_FIELDS },
    { title: 'الوكيل / المالك بوكالة', fields: LEGAL_AGENT_FIELDS },
  ];
  if (showNazir) groups.push({ title: 'ناظر الوقف', fields: ENDOWMENT_FIELDS });
  groups.push({ title: 'بيانات العقار', fields: PROPERTY_FIELDS });
  groups.push({ title: 'مرفقات الصك', fields: INSTRUMENT_IMAGE_FIELDS });
  return groups;
}
