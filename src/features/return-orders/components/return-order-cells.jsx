import { Copy, MessageSquareText, Phone } from 'lucide-react';
import { useState } from 'react';
import whatsappIcon from '@/assets/return-orders/whatsapp.svg';
import { OrderRowStatusBadge, SendOrderSmsDialog, normalizeWhatsAppPhone } from '@/features/orders';
import { IconButton } from '@/shared/components/icon-button';
import { copyToClipboard } from '@/shared/lib/clipboard';

/** Order number with the contract status color as a dot, and a copy button. */
export function OrderNumberWithStatusDot({ order }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block size-2 shrink-0 rounded-full bg-warning"
        style={order?.status_color ? { backgroundColor: order.status_color } : undefined}
        title={order?.status_name}
      />
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          copyToClipboard(order?.uuid, 'تم نسخ رقم الطلب');
        }}
        className="inline-flex items-center gap-1.5 font-black tabular-nums text-primary"
      >
        #{order?.uuid}
        <Copy className="size-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}

/** Customer mobile: click to copy, plus a WhatsApp link. */
export function CustomerMobileCell({ order }) {
  const mobile = order?.user_mobile;
  if (!mobile) return <span className="text-muted-foreground">—</span>;

  const whatsappPhone = normalizeWhatsAppPhone(mobile);

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        dir="ltr"
        onClick={(event) => {
          event.stopPropagation();
          copyToClipboard(whatsappPhone || mobile, 'تم نسخ رقم الجوال');
        }}
        className="inline-flex items-center gap-1 text-xs font-bold tabular-nums"
      >
        <Phone className="size-3.5 text-muted-foreground" />
        {mobile}
      </button>
      {whatsappPhone && (
        <a
          href={`https://wa.me/${whatsappPhone}`}
          target="_blank"
          rel="noreferrer"
          aria-label="واتساب"
          onClick={(event) => event.stopPropagation()}
          className="flex size-7 items-center justify-center rounded-full bg-success-soft">
          <img src={whatsappIcon} alt="" className="size-3.5" />
        </a>
      )}
    </div>
  );
}

export function ContractTypeCell({ order }) {
  return <span className="font-bold">{order?.contract_type || '---'}</span>;
}

export function InstrumentTypeCell({ order }) {
  return <span className="text-xs font-medium text-muted-foreground">{order?.instrument_type || '—'}</span>;
}

export function OrderStatusCell({ order }) {
  return <OrderRowStatusBadge order={order} />;
}

/** Button that opens the "send SMS to the customer" dialog. */
export function SendSmsButton({ order }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton label="إرسال رسالة SMS" className="size-8 rounded-full" onClick={() => setOpen(true)}>
        <MessageSquareText className="size-4" />
      </IconButton>
      <SendOrderSmsDialog open={open} onOpenChange={setOpen} order={order} />
    </>
  );
}
