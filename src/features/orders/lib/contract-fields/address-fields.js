import { fileField, textField } from './field-helpers';

/** National address of the property (contract step 2). */
export const ADDRESS_FIELDS = [
  { key: 'property_place_id', label: 'المنطقة', type: 'select', optionsSource: 'regions' },
  { key: 'property_city_id', label: 'المدينة', type: 'select', optionsSource: 'cities' },
  textField('neighborhood', 'الحي'),
  textField('street', 'الشارع'),
  textField('building_number', 'رقم المبنى'),
  textField('postal_code', 'الرمز البريدي'),
  textField('extra_figure', 'الرقم الإضافي'),
  textField('latitude', 'خط العرض'),
  textField('longitude', 'خط الطول'),
  textField('address_url', 'رابط العنوان'),
  fileField('image_address', 'صورة العنوان', { accept: 'image/*' }),
];
