import { UserRound } from 'lucide-react';
import { AccentCard, CardBadge, DownloadLink, Field } from './detail-primitives';

/** Tenant data: person or company, contact details and the legal representative. */
export function TenantCard({ tenant = {}, onEdit }) {
  return (
    <AccentCard
      tone="brand"
      icon={UserRound}
      title="المستأجر"
      onEdit={onEdit}
      badge={
        <CardBadge tone="success">
          <UserRound className="size-3" />
          {tenant.type_label}
        </CardBadge>
      }
    >
      <div className="space-y-2">
        <Field label="هوية المستأجر" value={tenant.id_num} />
        <Field label="تاريخ الميلاد" value={tenant.dob_display} />
        <Field label="جوال المستأجر" value={tenant.phone} />
        <Field label="البريد الإلكتروني" value={tenant.email} />
        <Field label="منطقة المنشأة" value={tenant.entity_region} />
        <Field label="مدينة المنشأة" value={tenant.entity_city} />
        <Field label="منطقة الممثل النظامي" value={tenant.entity_legal_region} />
        <Field label="مدينة الممثل النظامي" value={tenant.entity_legal_city} />
        <Field label="ممثل نظامي للمستأجر" value={tenant.has_legal_representative} />
        <Field label="رقم هوية الوكيل" value={tenant.legal_agent_id} />
        <Field label="جوال الوكيل" value={tenant.legal_agent_phone} />
        <Field label="نوع تاريخ ميلاد الوكيل" value={tenant.legal_agent_dob_type} />
        <Field label="تاريخ ميلاد الوكيل" value={tenant.legal_agent_dob} />
        <DownloadLink label="صورة سجل المالك" url={tenant.owner_record_url} name={tenant.owner_record_name} />
      </div>
    </AccentCard>
  );
}
