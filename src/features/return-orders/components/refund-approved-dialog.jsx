import { Check, Copy } from 'lucide-react';
import whatsappIcon from '@/assets/return-orders/whatsapp.svg';
import { Modal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { buildRefundApprovedCustomerMessage } from '../lib/refund-messages';

const MISSING = '—';

/** Shown after the admin approved a refund: the message to send to the customer. */
export function RefundApprovedDialog({ open, onOpenChange, refund }) {
  const message = buildRefundApprovedCustomerMessage(refund);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="تمت موافقة الإدارة بنجاح"
      description="برجاء نسخ الطلب وإرسالها للعميل"
      size="sm"
      footer={<Button onClick={() => onOpenChange(false)}>تم</Button>}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-success text-primary-foreground">
          <Check className="size-7" />
        </span>

        <div className="w-full rounded-xl border border-dashed border-primary bg-muted p-4 text-sm leading-relaxed">
          <p className="mb-2 font-bold">عميلنا العزيز،</p>
          <p>نود إبلاغكم بأنه تم استرجاع المبلغ بنجاح</p>
          <p>المبلغ: {refund?.refundAmount ?? MISSING}</p>
          <p>الرقم المرجعي: {refund?.referenceNumber ?? MISSING}</p>
          <p>رقم الطلب: {refund?.orderUuid ?? MISSING}</p>
          <p className="mt-2">شكراً لتفهمكم.</p>
        </div>

        {refund?.userMobile && (
          <div className="flex items-center gap-3">
            <a href={`https://wa.me/${refund.userMobile}`} target="_blank" rel="noreferrer" aria-label="فتح واتساب">
              <img src={whatsappIcon} alt="" className="size-6" />
            </a>
            <button type="button" aria-label="نسخ الرسالة" onClick={() => copyToClipboard(message, 'تم نسخ الرسالة')}>
              <Copy className="size-4 text-muted-foreground" />
            </button>
            <span className="font-bold" dir="ltr">
              {refund.userMobile}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}
