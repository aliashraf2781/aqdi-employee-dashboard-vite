import { Copy, MessageCircle } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/modal';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { buildWhatsAppUrl, getOrderPhoneForContext, getWhatsAppRecipientLabel } from '../../lib/order-contact';
import { composeSendErrorMessage, getSendErrorTitle } from '../../lib/send-error-message';

/** Shows the message that asks the client to fix one section of the order and sends it through WhatsApp. */
export function SectionErrorDialog({ open, onOpenChange, orderData, context }) {
  const message = useMemo(() => composeSendErrorMessage(orderData, context), [orderData, context]);
  const phone = getOrderPhoneForContext(orderData, context);
  const recipient = getWhatsAppRecipientLabel(context);

  const sendWhatsApp = () => {
    const url = buildWhatsAppUrl(phone, message);
    if (!url) {
      toast.error(phone ? 'رقم الجوال غير صالح' : `لا يوجد رقم جوال لـ${recipient}`);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={getSendErrorTitle(context)}
      footer={
        <>
          <Button variant="ghost" onClick={() => copyToClipboard(message, 'تم نسخ الرسالة')}>
            <Copy className="size-4" />
            نسخ الرسالة
          </Button>
          <Button onClick={sendWhatsApp} disabled={!phone || !message.trim()}>
            <MessageCircle className="size-4" />
            موافق
          </Button>
        </>
      }
    >
      <div className="max-h-80 overflow-y-auto rounded-2xl bg-muted p-5">
        <p className="whitespace-pre-wrap text-sm leading-loose">{message || '—'}</p>
      </div>

      {phone ? (
        <div className="mt-4 flex items-center justify-center gap-3 rounded-full bg-muted px-4 py-2.5">
          <button type="button" onClick={sendWhatsApp} aria-label={`إرسال واتساب لـ${recipient}`} className="text-whatsapp">
            <MessageCircle className="size-5" />
          </button>
          <button type="button" onClick={() => copyToClipboard(phone, 'تم نسخ رقم الجوال')} aria-label="نسخ رقم الجوال" className="text-muted-foreground">
            <Copy className="size-4" />
          </button>
          <span dir="ltr" className="font-semibold">
            {phone}
          </span>
        </div>
      ) : (
        <p className="mt-4 text-center text-sm text-danger">
          {context === 'agent' ? 'لا يوجد رقم جوال مسجل للوكيل' : 'لا يوجد رقم جوال مسجل للعميل'}
        </p>
      )}
    </Modal>
  );
}
