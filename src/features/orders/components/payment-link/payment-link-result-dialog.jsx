import { Check, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/modal';
import { copyToClipboard } from '@/shared/lib/clipboard';

function DetailRow({ label, value, dir }) {
  if (value == null || value === '') return null;
  return (
    <div className="space-y-1 text-start">
      <p className="text-xs font-bold text-success">{label}</p>
      <p dir={dir} className="break-all rounded-xl bg-surface px-3 py-2.5 text-sm font-medium text-success">
        {value}
      </p>
    </div>
  );
}

function buildCopyText({ alreadyPaid, paidMessage, paymentUrl, amount, notes, payment }) {
  const lines = [];
  if (alreadyPaid) {
    lines.push(paidMessage);
    if (amount) lines.push(`المبلغ: ${amount} ر.س`);
    if (payment?.payment_method) lines.push(`طريقة الدفع: ${payment.payment_method}`);
    if (payment?.payment_date) lines.push(`تاريخ الدفع: ${payment.payment_date}`);
  } else {
    if (paymentUrl) lines.push(`رابط الدفع: ${paymentUrl}`);
    if (amount) lines.push(`المبلغ: ${amount} ر.س`);
    if (notes) lines.push(`الملاحظات: ${notes}`);
  }
  return lines.join('\n');
}

/**
 * Shows a created payment link (copy / open) or, for an already paid contract,
 * the payment details. `link` is the object returned by the create-link hooks.
 */
export function PaymentLinkResultDialog({ open, onOpenChange, link }) {
  const { paymentUrl, cartAmount, notes, alreadyPaid, message, payment } = link;
  const hasCartAmount = cartAmount != null && cartAmount !== '';
  const cartAmountText = hasCartAmount ? String(cartAmount) : '';
  const notesText = notes?.trim() || '';
  const paidMessage = message?.trim() || 'تم دفع هذا العقد بالفعل';
  const hasPaymentAmount = payment?.amount != null && payment.amount !== '';
  const amount = hasPaymentAmount ? String(payment.amount) : cartAmountText;

  const title = alreadyPaid ? paidMessage : 'تم إنشاء رابط الدفع بنجاح';
  const description = alreadyPaid
    ? 'هذا العقد مدفوع مسبقاً ولا يتوفر رابط دفع جديد'
    : 'يمكنك نسخ الرابط والمبلغ والملاحظات بزر واحد، أو فتح صفحة الدفع';

  const copyAll = () =>
    copyToClipboard(
      buildCopyText({ alreadyPaid, paidMessage, paymentUrl, amount: alreadyPaid ? amount : cartAmountText, notes: notesText, payment }),
      alreadyPaid ? 'تم نسخ تفاصيل الدفع' : 'تم نسخ رابط الدفع والمبلغ والملاحظات',
    );

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="flex flex-col items-center gap-4 rounded-card bg-success-soft p-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-success text-primary-foreground">
          <Check className="size-7" />
        </span>

        <div className="w-full space-y-3 rounded-2xl border border-border bg-surface p-4">
          {alreadyPaid ? (
            <>
              <DetailRow label="المبلغ" value={amount ? `${amount} ر.س` : null} />
              <DetailRow label="طريقة الدفع" value={payment?.payment_method} />
              <DetailRow label="تاريخ الدفع" value={payment?.payment_date} dir="ltr" />
              <DetailRow label="حالة الدفع" value={payment?.status} />
            </>
          ) : (
            <>
              <DetailRow label="رابط الدفع" value={paymentUrl} dir="ltr" />
              <DetailRow label="المبلغ" value={cartAmountText ? `${cartAmountText} ر.س` : null} />
              <DetailRow label="الملاحظات" value={notesText || null} />
            </>
          )}
        </div>

        <div className="flex w-full gap-3">
          <Button className="flex-1" onClick={copyAll}>
            <Copy className="size-4" />
            {alreadyPaid ? 'نسخ التفاصيل' : 'نسخ الكل'}
          </Button>
          {!alreadyPaid && (
            <Button
              variant="outline"
              className="flex-1"
              disabled={!paymentUrl}
              onClick={() => window.open(paymentUrl, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="size-4" />
              فتح
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
