import { CalendarDays, ChevronRight, Copy, FileText, MessageSquarePlus, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import { copyToClipboard } from '@/shared/lib/clipboard';
import whatsappIcon from '@/assets/orders/whatsapp.svg';
import { formatStamp } from '../../../lib/format-date-time';

const CHIP_CLASS = 'inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-bold';
const OUTLINE_CHIP_CLASS = `${CHIP_CLASS} border border-border`;

export function BackLink({ href, label }) {
  return (
    <Link to={href} className="inline-flex h-7 items-center gap-1.5 rounded-xl border border-border bg-muted px-2 text-xs font-bold hover:text-primary">
      <ChevronRight className="size-3.5" />
      {label}
    </Link>
  );
}

export function OrderNumberButton({ uuid }) {
  return (
    <button type="button" onClick={() => copyToClipboard(String(uuid ?? ''), 'تم نسخ رقم الطلب')} title="نسخ رقم الطلب" className="inline-flex items-center gap-1.5">
      <span className="text-base font-black tabular-nums text-primary">#{uuid}</span>
      <Copy className="size-3.5 text-muted-foreground" />
    </button>
  );
}

export function ContractTypeChip({ view }) {
  return (
    <span className={cn(CHIP_CLASS, 'border border-primary text-primary')}>
      <FileText className="size-3.5" />
      عقد {view.contract_type} - {view.instrument_type}
    </span>
  );
}

export function ReceiverChip({ employeeName }) {
  return <span className={cn(CHIP_CLASS, 'bg-violet-soft text-violet')}>المستلم: {employeeName || '—'}</span>;
}

export function PhoneChips({ mobile }) {
  const digits = mobile ? String(mobile).replace(/\D/g, '') : '';
  if (!mobile) return null;

  return (
    <>
      <a href={`tel:${digits}`} dir="ltr" className={cn(OUTLINE_CHIP_CLASS, 'tabular-nums')}>
        <Phone className="size-3.5 text-muted-foreground" />
        {mobile}
      </a>
      {digits && (
        <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" aria-label="واتساب" className="flex size-9 items-center justify-center rounded-full bg-whatsapp/15 hover:bg-whatsapp/25">
          <img src={whatsappIcon} alt="" className="size-4" />
        </a>
      )}
    </>
  );
}

export function ContractTypeBadge({ contractType }) {
  return (
    <span className={cn(CHIP_CLASS, 'border-2 border-info text-info')}>
      <CalendarDays className="size-3.5" />
      {contractType}
    </span>
  );
}

export function PaidBadge({ isPaid }) {
  return (
    <span className={cn(CHIP_CLASS, 'border-2 font-black', isPaid ? 'border-success text-success' : 'border-orange text-orange')}>
      {isPaid ? 'مدفوع' : 'غير مدفوع'}
    </span>
  );
}

export function DateChip({ value }) {
  return (
    <span className={cn(OUTLINE_CHIP_CLASS, 'text-muted-foreground')}>
      <CalendarDays className="size-3.5" />
      {formatStamp(value)}
    </span>
  );
}

export function DocumentationDeadlineChip({ value }) {
  if (!value) return null;
  return (
    <span className={cn(CHIP_CLASS, 'border border-warning text-warning')}>
      <CalendarDays className="size-3.5" />
      موعد التوثيق: {formatStamp(value)}
    </span>
  );
}

export function SourceChip({ source }) {
  if (!source) return null;
  return <span className={cn(CHIP_CLASS, 'bg-info-soft text-info')}>المصدر: {source}</span>;
}

export function AddNoteButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} className={cn(OUTLINE_CHIP_CLASS, 'hover:border-primary')}>
      <MessageSquarePlus className="size-3.5" />
      إضافة ملاحظة
    </button>
  );
}
