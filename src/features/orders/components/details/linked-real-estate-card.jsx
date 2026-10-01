import { Building2 } from 'lucide-react';
import { AccentCard } from './detail-primitives';
import { Field } from './detail-fields';

const ESTATE_FIELDS = [
  ['رقم العقار', 'id'],
  ['اسم العقار', 'name'],
  ['نوع المستند', 'instrument_type'],
  ['رقم الصك', 'instrument_number'],
  ['رقم السجل العقاري', 'registry_number'],
  ['نوع العقار', 'property_type'],
  ['استخدام العقار', 'property_usage'],
  ['المنطقة', 'region'],
  ['المدينة', 'city'],
  ['الحي', 'district'],
  ['الشارع', 'street'],
  ['رقم المبنى', 'building_number'],
  ['هوية المالك', 'owner_id'],
  ['جوال المالك', 'owner_phone'],
  ['عمر العقار', 'age'],
  ['عدد الطوابق', 'floors'],
  ['عدد الوحدات', 'units_count'],
  ['تاريخ أول تسجيل', 'date_first_registration'],
];

/** The saved real estate this order is linked to, when there is one. */
export function LinkedRealEstateCard({ estate }) {
  if (!estate) return null;
  const hasDetails = ESTATE_FIELDS.some(([, key]) => estate[key] != null && estate[key] !== '');

  return (
    <AccentCard tone="brand" icon={Building2} title="العقار المرتبط">
      {!estate.linked && !hasDetails ? (
        <p className="text-xs font-medium text-muted-foreground">غير مرتبط بعقار محفوظ</p>
      ) : (
        <div className="space-y-2">
          {ESTATE_FIELDS.map(([label, key]) => (
            <Field key={key} label={label} value={estate[key]} />
          ))}
        </div>
      )}
    </AccentCard>
  );
}
