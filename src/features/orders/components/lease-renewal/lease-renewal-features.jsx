import { AlertTriangle, Copy, RefreshCw } from 'lucide-react';
import { LEASE_RENEWAL_NOTES_FIELDS, LEASE_RENEWAL_TERMS_FIELDS } from '../../lib/contract-fields';
import { getOrderFinancialStep } from '../../lib/order-detail-steps';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { AccentCard, GroupSection } from '../details/detail-primitives';
import { DraftTransfer } from './draft-transfer';
import { InlineStepEditor } from './inline-step-editor';

const EMPTY_ADDITIONAL_TERMS = 'لا توجد شروط أو متغيرات إضافية من العميل';
const EMPTY_NOTES = 'لا توجد ملاحظات';

function RequestedTerms({ terms }) {
  const lines = terms ? terms.split(/\n+/).map((line) => line.trim()).filter(Boolean) : [];

  return (
    <div className="relative min-h-32 rounded-xl bg-muted p-3">
      <button
        type="button"
        disabled={!terms}
        onClick={() => copyToClipboard(terms, 'تم النسخ')}
        aria-label="نسخ الشروط"
        className="absolute bottom-3 start-3 flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent disabled:opacity-40"
      >
        <Copy className="size-3.5" />
      </button>
      {!terms && <p className="text-xs text-muted-foreground">{EMPTY_ADDITIONAL_TERMS}</p>}
      {terms && lines.length > 1 && (
        <ol className="list-inside list-decimal space-y-2 pe-8 text-xs leading-relaxed text-muted-foreground">
          {lines.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ol>
      )}
      {terms && lines.length <= 1 && <p className="whitespace-pre-wrap pe-8 text-xs leading-relaxed text-muted-foreground">{terms}</p>}
    </div>
  );
}

/** Extra tools of a lease renewal order: draft transfer, the client's requested terms and the "please note" box. */
export function LeaseRenewalFeatures({ orderData }) {
  const financial = getOrderFinancialStep(orderData);
  const additionalTerms = financial.text_additional_terms?.trim() || null;
  const notes = financial.notes_edits?.trim() || null;

  return (
    <GroupSection
      title={
        <span className="inline-flex items-center gap-2">
          <RefreshCw className="size-3.5" />
          ميزات تجديد عقد الإيجار
        </span>
      }
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <AccentCard tone="brand" title="تحويل الطلب / المسودة">
          <DraftTransfer orderId={orderData?.id} orderData={orderData} />
        </AccentCard>

        <AccentCard tone="violet" title="الشروط والمتغيرات">
          <InlineStepEditor title="الشروط والمتغيرات التي طلبها العميل :" step="step6" fields={LEASE_RENEWAL_TERMS_FIELDS}>
            <RequestedTerms terms={additionalTerms} />
          </InlineStepEditor>
        </AccentCard>

        <AccentCard tone="danger" title="يرجى الانتباه">
          <InlineStepEditor title="يرجى الانتباه :" step="step6" fields={LEASE_RENEWAL_NOTES_FIELDS}>
            <div className="flex items-start gap-2 rounded-xl bg-danger-soft p-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" />
              <p className="flex-1 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">{notes ?? EMPTY_NOTES}</p>
            </div>
          </InlineStepEditor>
        </AccentCard>
      </div>
    </GroupSection>
  );
}
