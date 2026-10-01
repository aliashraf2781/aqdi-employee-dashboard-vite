import { booleanField, METER_OWNERSHIP_OPTIONS, textField } from './field-helpers';

const FURNISHED_TYPE_OPTIONS = [
  { value: '1', label: 'جديد' },
  { value: '0', label: 'مستعمل' },
];

const UNIT_CORE_FIELDS = [
  { key: 'unit_usage_id', label: 'استخدام الوحدة', type: 'select', optionsSource: 'unit-usages', displayKey: 'unit_usage_name' },
  textField('unit_number', 'رقم الوحدة'),
  textField('floor_number', 'رقم الطابق'),
  textField('unit_area', 'مساحة الوحدة'),
];

const UNIT_ROOM_FIELDS = [
  textField('tootal_rooms', 'إجمالي الغرف'),
  textField('The_number_of_kitchens', 'عدد المطابخ'),
  textField('The_number_of_toilets', 'عدد دورات المياه'),
  textField('window_ac', 'مكيف شباك'),
  textField('split_ac', 'مكيف سبليت'),
];

const UNIT_SERVICE_FIELDS = [
  booleanField('kitchen_tank', 'مطبخ راكب'),
  booleanField('furnished', 'مؤثثة'),
  { key: 'type_furnished', label: 'نوع التأثيث', type: 'select', options: FURNISHED_TYPE_OPTIONS },
  booleanField('electricity_meter', 'عداد كهرباء'),
  textField('electricity_meter_number', 'رقم عداد الكهرباء'),
  { key: 'electricity_meter_ownership', label: 'ملكية عداد الكهرباء', type: 'select', options: METER_OWNERSHIP_OPTIONS },
  booleanField('water_meter', 'عداد مياه'),
  textField('water_meter_number', 'رقم عداد المياه'),
  { key: 'water_meter_ownership', label: 'ملكية عداد المياه', type: 'select', options: METER_OWNERSHIP_OPTIONS },
];

export const UNIT_FIELD_GROUPS = [
  { title: 'بيانات الوحدة', fields: UNIT_CORE_FIELDS },
  { title: 'تفاصيل الغرف', fields: UNIT_ROOM_FIELDS },
  { title: 'الخدمات', fields: UNIT_SERVICE_FIELDS },
];

export const ALL_UNIT_FIELDS = UNIT_FIELD_GROUPS.flatMap((group) => group.fields);

/** Unit keys that are not editable here but must be sent back, because saving a unit replaces the whole record. */
export const HIDDEN_UNIT_PAYLOAD_KEYS = [
  'unit_type_id',
  'The_number_of_halls',
  'number_of_councils',
  'Gasmeter',
  'Number_parking_spaces',
  'number_of_unit_air_conditioners',
];
