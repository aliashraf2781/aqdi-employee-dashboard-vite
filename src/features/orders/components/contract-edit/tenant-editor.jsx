import { Eye, FileText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { TENANT_FIELDS } from '../../lib/contract-fields';
import { absolutizeMediaUrl, isPdfMediaUrl } from '../../lib/media-url';
import { getOrderTenantStep } from '../../lib/order-detail-steps';
import { pick } from '../../lib/pick';
import { MediaPreview } from '../details/media-preview';
import { useSectionEditor } from '../details/section-editor-context';
import { ContractStepForm } from './contract-step-form';

function AttachmentPreviewRow({ label, url, emptyText, previewTitle }) {
  const [open, setOpen] = useState(false);
  const isPdf = isPdfMediaUrl(url);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-bold">{url ? (isPdf ? 'ملف PDF مرفق' : 'صورة مرفقة') : emptyText}</p>
      </div>
      {url && (
        <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
          {isPdf ? <FileText className="size-3.5 text-danger" /> : <Eye className="size-3.5" />}
          معاينة
        </Button>
      )}
      <MediaPreview open={open} onOpenChange={setOpen} url={url} title={previewTitle} />
    </div>
  );
}

/** Editor of the tenant section, with previews of the saved owner record and agency documents. */
export function TenantEditor({ order }) {
  const sectionEditor = useSectionEditor();
  const tenant = getOrderTenantStep(order);
  const read = (key, altKey) => pick(tenant[key], order?.[key], tenant[altKey], order?.[altKey]);

  const isAgentAuthorization =
    read('tenant_entity') === 'institution' && read('authorization_type') === 'agent_or_authorized_by_registry_owner';
  const agencyUrl = absolutizeMediaUrl(read('copy_of_the_authorization_or_agency', 'copy_of_the_authorization_or_agency_path'));
  const ownerRecordUrl = absolutizeMediaUrl(read('copy_of_the_owner_record', 'copy_of_the_owner_record_path'));

  return (
    <div className="space-y-6">
      <ContractStepForm step="step4" fields={TENANT_FIELDS} onCancel={sectionEditor?.onClose} />

      {ownerRecordUrl && (
        <AttachmentPreviewRow label="صورة سجل المالك" url={ownerRecordUrl} previewTitle={isPdfMediaUrl(ownerRecordUrl) ? 'سجل المالك PDF' : 'صورة سجل المالك'} />
      )}
      {isAgentAuthorization && (
        <AttachmentPreviewRow
          label="صورة التفويض / الوكالة"
          url={agencyUrl}
          emptyText="لا يوجد ملف مرفق"
          previewTitle={isPdfMediaUrl(agencyUrl) ? 'وكالة PDF' : 'صورة الوكالة'}
        />
      )}
    </div>
  );
}
