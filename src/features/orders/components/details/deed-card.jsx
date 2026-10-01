import { FileText } from 'lucide-react';
import { useState } from 'react';
import { AccentCard, Field, FileRow } from './detail-primitives';
import { MediaPreview } from './media-preview';

const dobWithType = (dob, type) => (dob ? (type ? `${dob} (${type})` : dob) : null);

function DeedFileRows({ deed, onPreview }) {
  return (
    <div className="space-y-2">
      {deed.file_url && (
        <FileRow
          label={deed.file_label || 'صورة الصك'}
          fileName={deed.file_name}
          fileUrl={deed.file_url}
          onPreview={() => onPreview({ url: deed.file_url, title: 'معاينة الصك', subtitle: deed.file_name })}
        />
      )}
      {(deed.attachments ?? []).map((attachment) => (
        <FileRow
          key={attachment.label}
          label={attachment.label}
          fileName={attachment.file_name}
          fileUrl={attachment.file_url}
          onPreview={() => onPreview({ url: attachment.file_url, title: attachment.label, subtitle: attachment.file_name })}
        />
      ))}
    </div>
  );
}

/** Deed and owner data plus the property description and the deed files. */
export function DeedCard({ deed = {}, onEdit }) {
  const [preview, setPreview] = useState(null);

  return (
    <AccentCard tone="brand" icon={FileText} title="الصك والملاك" onEdit={onEdit}>
      <div className="flex items-center gap-2 rounded-xl bg-accent px-3 py-2">
        <FileText className="size-3.5 shrink-0 text-primary" />
        <span className="text-xs font-bold text-primary">{deed.type_label}</span>
      </div>

      <div className="space-y-2">
        <Field label="رقم الصك" value={deed.number} />
        <Field label="اسم المالك" value={deed.owner_name} />
        <Field label="هوية المالك" value={deed.owner_id} />
        <Field label="جوال المالك" value={deed.owner_phone} />
        <Field label="آيبان المالك" value={deed.owner_iban} />
        <Field label="تاريخ ميلاد المالك" value={dobWithType(deed.owner_dob, deed.owner_dob_type)} />
        <Field label="تاريخ الصك" value={deed.instrument_history} />
        <Field label="نوع تاريخ الصك" value={deed.instrument_history_type} />
        <Field label="تاريخ أول تسجيل" value={deed.date_first_registration} />
        <Field label="نوع تاريخ أول تسجيل" value={deed.date_first_registration_type} />
        <Field label="رقم السجل العقاري" value={deed.registry_number} />
      </div>

      <div className="space-y-2 border-t border-border pt-2">
        <Field label="اسم العقار" value={deed.property_name} />
        <Field label="نوع العقار" value={deed.property_type} />
        <Field label="استخدام العقار" value={deed.property_usage} />
        <Field label="ملكية العقد" value={deed.contract_ownership} />
        <Field label="رقم الوحدة في العقار" value={deed.unit_number_of_real} />
        <Field label="عمر العقار" value={deed.age_of_the_property} />
        <Field label="عدد الطوابق" value={deed.number_of_floors} />
        <Field label="وحدات كل طابق" value={deed.number_of_units_per_floor} />
        <Field label="إجمالي وحدات العقار" value={deed.number_of_units_in_realestate} />
      </div>

      <DeedFileRows deed={deed} onPreview={setPreview} />

      <MediaPreview
        open={Boolean(preview?.url)}
        onOpenChange={(open) => !open && setPreview(null)}
        url={preview?.url}
        title={preview?.title}
        subtitle={preview?.subtitle}
      />
    </AccentCard>
  );
}
