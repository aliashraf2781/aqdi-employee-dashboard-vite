import { Clock, Copy } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/modal';
import { copyToClipboard } from '@/shared/lib/clipboard';
import whatsappIcon from '@/assets/orders/whatsapp.svg';
import { normalizeWhatsAppPhone } from '../../lib/order-contact';
import { RETURN_WHATSAPP_MESSAGE } from '../../schemas/return-request-schema';

const MESSAGE_LINES = ['اسم البنك :', 'اسم صاحب الحساب :', 'رقم الحساب او الآيبان :'];

/** Step 2: the text to send to the customer so they can give their bank details. */
export function ReturnRequestWhatsappDialog({ open, onOpenChange, order, onContinue }) {
  const copyMessage = () => copyToClipboard(RETURN_WHATSAPP_MESSAGE, 'تم نسخ الرسالة');
  const phone = normalizeWhatsAppPhone(order?.user_mobile);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="تم رفع طلب الاسترجاع بنجاح ✅"
      description="الرجاء نسخ الكلام وإرسالها للعميل :"
      footer={<Button onClick={onContinue}>تم</Button>}
    >
      <div className="space-y-2 rounded-xl border border-border bg-muted p-4 text-center text-sm leading-relaxed">
        <p className="font-bold">عميلنا العزيز،</p>
        <p>الرجاء تعبئة البيانات لإتمام طلب الاسترجاع :</p>
        {MESSAGE_LINES.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p className="text-danger">يشترط ان يكون رقم الحساب هو نفس وفي حالة تغييره سيتم رفض الطلب</p>
        <p className="flex items-center justify-center gap-2 text-muted-foreground">
          <Clock className="size-4" />
          سيتم استرجاع المبلغ خلال يوم إلى 3 أيام عمل
        </p>
        <p>شكراً لتفهمكم.</p>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={copyMessage}>
          <Copy className="size-4" />
          نسخ الرسالة
        </Button>
        {phone && (
          <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" aria-label="فتح واتساب" className="flex items-center gap-2">
            <img src={whatsappIcon} alt="" className="size-6" />
            <span dir="ltr" className="font-bold">
              {order?.user_mobile}
            </span>
          </a>
        )}
      </div>
    </Modal>
  );
}
