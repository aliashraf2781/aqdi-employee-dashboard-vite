import { PERMISSION_SECTIONS } from '@/features/permissions';

/**
 * Single-record settings screens (one GET, one POST, a handful of fields).
 * Each config feeds the generic RecordSettingsPanel.
 *
 * { id, title, description, queryKey, endpoint, fields, columns, messages, saveLabel, editSection? }
 * `editSection`: when set, saving also needs `<section>.edit`.
 */

export const smsSettingsConfig = {
  id: 'sms-settings',
  title: 'إعدادات رسائل SMS',
  description: 'قوالب رسائل SMS عامة لكل المشروع (مرة واحدة). ليست مرتبطة بنوع صك أو عقد.',
  queryKey: 'sms-settings',
  endpoint: '/admin/sms-settings',
  columns: 1,
  saveLabel: 'حفظ الإعدادات',
  messages: { saved: 'تم حفظ إعدادات رسائل SMS بنجاح', saveFailed: 'تعذر حفظ إعدادات رسائل SMS', loadFailed: 'تعذر تحميل إعدادات رسائل SMS' },
  fields: [
    { name: 'sms_user', label: 'رسالة للمستخدم', description: 'رسالة SMS عامة للمستخدم على مستوى المشروع', type: 'textarea' },
    { name: 'sms_owner', label: 'رسالة للمالك', description: 'رسالة SMS عامة للمالك على مستوى المشروع', type: 'textarea' },
    { name: 'sms_employee', label: 'رسالة للموظف', description: 'رسالة SMS عامة للموظف على مستوى المشروع', type: 'textarea' },
  ],
};

export const meterFeeSettingsConfig = {
  id: 'meter-fees',
  title: 'رسوم العدادات',
  description: '4 رسوم ثابتة على مستوى المشروع للمستأجر السكني والتجاري. الحقول اختيارية، والحد الأدنى 0.',
  queryKey: 'meter-fee-settings',
  endpoint: '/admin/meter-fee-settings',
  columns: 2,
  saveLabel: 'حفظ الرسوم',
  messages: { saved: 'تم حفظ رسوم العدادات بنجاح', saveFailed: 'تعذر حفظ رسوم العدادات', loadFailed: 'تعذر تحميل رسوم العدادات' },
  fields: [
    { name: 'electricity_meter_fee_commercial_tenant', label: 'رسوم العداد الكهربائي تجاري للمستأجر', type: 'number' },
    { name: 'electricity_meter_fee_housing_tenant', label: 'رسوم العداد الكهربائي منزلي للمستأجر', type: 'number' },
    { name: 'water_meter_fee_commercial_tenant', label: 'رسوم عداد المياه تجاري للمستأجر', type: 'number' },
    { name: 'water_meter_fee_housing_tenant', label: 'رسوم عداد المياه منزلي للمستأجر', type: 'number' },
  ],
};

export const taxFeeSettingsConfig = {
  id: 'tax-fees',
  title: 'الضريبة ورسوم التطبيق',
  description:
    'قيم تُستخدم في الخطوة الأخيرة من مالية العقد: الضريبة حسب نوع العقد (سكني/تجاري)، ورسوم التطبيق كمبلغ ثابت بالريال. الحقول اختيارية والحد الأدنى 0.',
  queryKey: 'admin-settings-tax-fees',
  endpoint: '/admin/settings',
  columns: 1,
  saveLabel: 'حفظ الإعدادات',
  editSection: PERMISSION_SECTIONS.settings,
  messages: {
    saved: 'تم حفظ الضريبة ورسوم التطبيق بنجاح',
    saveFailed: 'تعذر حفظ الضريبة ورسوم التطبيق',
    loadFailed: 'تعذر تحميل الضريبة ورسوم التطبيق',
  },
  // Only these keys are sent: the endpoint also holds unrelated settings.
  fields: [
    { name: 'housing_tax', label: 'ضريبة العقد السكني (%)', description: 'نسبة الضريبة المستخدمة في مالية العقود السكنية', type: 'number' },
    { name: 'commercial_tax', label: 'ضريبة العقد التجاري (%)', description: 'نسبة ضريبة القيمة المضافة / العقود التجارية', type: 'number' },
    { name: 'application_fees', label: 'رسوم التطبيق (ر.س)', description: 'رسوم ثابتة تُضاف في الخطوة الأخيرة من مالية العقد', type: 'number' },
  ],
};
