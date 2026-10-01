import { LabeledValue } from '@/features/clients/components/labeled-value';

function Section({ title, children }) {
  return (
    <div className="border-b border-border py-4 first:pt-1 last:border-0 last:pb-1">
      <h4 className="mb-3 text-sm font-bold text-foreground">{title}</h4>
      {children}
    </div>
  );
}

/** The expanded "عرض العقار" body: name, deed, national address and owner. */
export function PropertyDetails({ property }) {
  return (
    <div className="rounded-lg border border-border px-4 py-2">
      <Section title="اسم العقار">
        <LabeledValue label="اسم العقار" value={property.propertyName} />
      </Section>

      <Section title="وثيقة الملكية">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <LabeledValue label="نوع المستند" value={property.documentType} />
          <LabeledValue label="رقم الصك" value={property.deedNumber} />
        </div>
      </Section>

      <Section title="العنوان الوطني للعقار">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <LabeledValue label="المنطقة" value={property.region} />
          <LabeledValue label="المدينة" value={property.city} />
          <LabeledValue label="الحي" value={property.district} />
          <LabeledValue label="رقم المبنى" value={property.buildingNumber} />
        </div>
      </Section>

      <Section title="بيانات المالك">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <LabeledValue label="رقم الهوية" value={property.ownerId} />
          <LabeledValue label="رقم الجوال" value={property.ownerMobile} />
        </div>
      </Section>
    </div>
  );
}
