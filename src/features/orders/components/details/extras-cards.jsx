import { BadgeCheck, FileText, Receipt, Undo2 } from 'lucide-react';
import { AccentCard } from './detail-primitives';
import { DownloadLink, Field, Money } from './detail-fields';

const hasValue = (value) => value != null && value !== '';

function AmountRow({ label, value }) {
  if (!hasValue(value)) return null;
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="font-medium text-muted-foreground">{label}</span>
      <Money value={value} />
    </div>
  );
}

export function EjarCard({ extras }) {
  const statusCase = extras.status_case;

  return (
    <AccentCard tone="success" icon={BadgeCheck} title="التوثيق وحالة المستند">
      <div className="space-y-2">
        <Field label="رقم عقد إيجار" value={extras.ejar_contract_number} />
        <Field label="رقم مسودة إيجار" value={extras.ejar_contract_draft_number} />
        <Field label="أُرسلت على الرقم" value={extras.draft_contact_number} />
        <Field label="وضع رقم التواصل" value={extras.draft_contact_number_mode} />
        <Field label="ملاحظات إيجار" value={extras.ejar_status_notes} />
        <Field label="نوع الصك" value={extras.deed_type} />
        <Field label="طريقة إضافة الصك" value={extras.deed_addition_method} />
        <Field label="رقم الصك (حالة)" value={extras.deed_number} />
        {statusCase && (
          <>
            <Field label="وضع رقم التواصل" value={statusCase.contact_number_mode} />
            <Field label="رقم التواصل" value={statusCase.contact_number} />
            <DownloadLink label="مرفق الحالة" url={statusCase.attachment} name="عرض المرفق" />
          </>
        )}
      </div>
    </AccentCard>
  );
}

export function DraftCard({ extras }) {
  return (
    <AccentCard tone="warning" icon={FileText} title="المسودة والملاحظات">
      <div className="space-y-2">
        <Field label="حالة المسودة" value={extras.draft_contract_status} />
        <Field label="رقم المسودة" value={extras.draft_contract_number} />
        <Field label="تاريخ الانتهاء" value={extras.expiry_date} />
        <Field label="التقييم" value={extras.rating} />
        <Field label="ملاحظة التقييم" value={extras.rating_note} />
        <Field label="قيد المراجعة" value={extras.is_review} />
        <Field label="ملاحظات التعديل" value={extras.notes_edits} />
        <DownloadLink label="مسودة قبل الدفع" url={extras.draft_before_paid_url} name={extras.draft_before_paid_name} />
        <DownloadLink label="مسودة بعد الدفع" url={extras.draft_after_paid_url} name={extras.draft_after_paid_name} />
        <DownloadLink label="صورة الحجة القوية" url={extras.strong_argument_url} name={extras.strong_argument_name} />
      </div>
    </AccentCard>
  );
}

export function AccountInvoiceCard({ account, invoice, showAccount, showInvoice }) {
  return (
    <AccentCard tone="info" icon={Receipt} title="الحساب والفاتورة">
      <div className="space-y-2">
        {showAccount && (
          <>
            <Field label="اسم صاحب الحساب" value={account.holder_name} />
            <Field label="البنك" value={account.bank_name} />
            <Field label="رقم الحساب" value={account.account_number} />
            <Field label="آيبان" value={account.iban} />
          </>
        )}
        {showInvoice && (
          <>
            <Field label="رقم الفاتورة" value={invoice.number} />
            <AmountRow label="مبلغ الفاتورة" value={invoice.amount} />
            <Field label="حالة الفاتورة" value={invoice.status} />
            <Field label="تاريخ الفاتورة" value={invoice.date} />
            <Field label="المرجع" value={invoice.reference} />
          </>
        )}
      </div>
    </AccentCard>
  );
}

export function RefundCard({ refund }) {
  return (
    <AccentCard tone="refunded" icon={Undo2} title="الاسترجاع">
      <div className="space-y-2">
        <Field label="حالة الاسترجاع" value={refund.return_status} />
        <AmountRow label="مبلغ الاسترجاع" value={refund.refund_amount} />
        <Field label="رقم الاسترجاع" value={refund.refund_id} />
        <Field label="الرقم المرجعي" value={refund.reference_number} />
        <Field label="ملاحظات الاسترجاع" value={refund.refund_notes} />
        <Field label="قبول الاسترجاع" value={refund.accept_return} />
        <Field label="موظف قبول الاسترجاع" value={refund.accept_return_employee} />
      </div>
    </AccentCard>
  );
}
