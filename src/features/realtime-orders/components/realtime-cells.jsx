import { Clock } from 'lucide-react';
import { buildWhatsAppUrl, formatRelativeShort } from '@/features/orders';
import whatsappIcon from '@/assets/orders/whatsapp.svg';
import { Badge } from '@/shared/components/badge';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { getReceivedUrgency } from '../lib/waiting-time';

const URGENCY_TONE = { critical: 'danger', warning: 'warning', ok: 'neutral' };

export function DraftBadge() {
  return <Badge tone="warning">طلب مسودة</Badge>;
}

/** Customer phone: click to copy, plus a WhatsApp shortcut. */
export function CustomerPhoneCell({ order }) {
  const phone = order?.user_mobile || order?.phone || '';
  if (!phone) return <span className="text-muted-foreground">—</span>;

  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap" dir="ltr">
      <button
        type="button"
        title="نسخ الجوال"
        onClick={() => copyToClipboard(String(phone).replace(/^0/, ''), 'تم نسخ رقم الجوال')}
        className="rounded-md px-1.5 py-0.5 text-xs font-extrabold tabular-nums transition-colors hover:bg-accent"
      >
        {phone}
      </button>
      <a
        href={buildWhatsAppUrl(phone)}
        target="_blank"
        rel="noopener noreferrer"
        title="تواصل واتساب"
        className="inline-flex size-7 items-center justify-center rounded-full border border-success bg-success-soft transition-colors hover:bg-accent"
      >
        <img src={whatsappIcon} alt="واتساب" className="size-4" />
      </a>
    </div>
  );
}

export function DocumentTypeCell({ order }) {
  return <span className="text-sm font-semibold text-muted-foreground">{order?.instrument_type || '—'}</span>;
}

/** "Received since" pill: the older the order, the louder the color. */
export function ReceivedSinceBadge({ order }) {
  const label = order?.received_since || formatRelativeShort(order?.received_at) || '---';
  const urgency = getReceivedUrgency(order?.received_at);

  return (
    <Badge tone={URGENCY_TONE[urgency]} className="gap-1 whitespace-nowrap">
      <Clock className="size-3" />
      {label}
    </Badge>
  );
}

/** Status names are shown in a neutral pill on purpose: the status column stays calm. */
export function OrderStatusCell({ order }) {
  return (
    <Badge tone="neutral" className="gap-1.5 whitespace-nowrap px-2.5 py-1">
      <span className="size-1.5 shrink-0 rounded-full bg-neutral" />
      {order?.status_name || '---'}
    </Badge>
  );
}
