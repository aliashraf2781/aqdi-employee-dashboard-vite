import { Copy, CreditCard, FileText, MapPin, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { ChoiceCards } from '@/shared/components/ui/choice-cards';
import { Modal } from '@/shared/components/modal';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { buildWhatsAppUrl } from '../../lib/order-contact';

const ERROR_TYPES = [
  { value: 'national_address', label: 'العنوان الوطني غير صحيح', icon: MapPin },
  { value: 'deed_data', label: 'بيانات الصك غير صحيحة', icon: FileText },
  { value: 'tenant', label: 'المستأجر خطأ', icon: UserRound },
  { value: 'owner_id', label: 'هوية المالك خطأ', icon: CreditCard },
];

function buildCorrectionMessage(order, labels) {
  return `عميلنا العزيز،

نأسف لإبلاغكم بوجود خطأ في البيانات التالية ضمن طلبكم رقم #${order?.uuid ?? '—'}:
${labels.map((label) => `- ${label}`).join('\n')}

يرجى التواصل معنا لتصحيح البيانات في أقرب وقت لإتمام إجراءات طلبكم.

شكراً لتفهمكم.`;
}

function CorrectionForm({ order, onClose }) {
  const [selected, setSelected] = useState([]);
  const labels = ERROR_TYPES.filter((type) => selected.includes(type.value)).map((type) => type.label);
  const message = labels.length > 0 ? buildCorrectionMessage(order, labels) : '';
  const whatsappUrl = order?.user_mobile ? buildWhatsAppUrl(order.user_mobile, '') : null;

  return (
    <div className="flex flex-col gap-4">
      <ChoiceCards label="اختر نوع الخطأ (أو أكثر) في بيانات العميل:" options={ERROR_TYPES} value={selected} onChange={setSelected} multiple columns={2} />
      <p className="text-xs leading-relaxed text-muted-foreground">اختر خطأً واحداً أو أكثر لتظهر رسالة التصحيح متضمنة البيانات المدخلة.</p>

      {message && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted p-4">
          <p className="whitespace-pre-line text-sm leading-relaxed">{message}</p>
          <div className="flex items-center gap-3 border-t border-border pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => copyToClipboard(message, 'تم نسخ الرسالة')}>
              <Copy className="size-3.5" />
              نسخ الرسالة
            </Button>
            {whatsappUrl && (
              <Button variant="ghost" size="sm" asChild>
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  إرسال عبر واتساب
                </a>
              </Button>
            )}
          </div>
        </div>
      )}

      <Button type="button" variant="outline" onClick={onClose}>
        إغلاق
      </Button>
    </div>
  );
}

/** "طلب تصحيح بيانات من العميل": builds a message listing the wrong data for the employee to send. */
export function CorrectionRequestDialog({ open, onOpenChange, order }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="طلب تصحيح بيانات من العميل">
      {/* Mounted only while open, so the selection starts empty every time. */}
      {open && <CorrectionForm order={order} onClose={() => onOpenChange(false)} />}
    </Modal>
  );
}
