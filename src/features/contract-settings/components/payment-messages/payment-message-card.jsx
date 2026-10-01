import { CheckCircle2, CircleAlert, ExternalLink } from 'lucide-react';
import { Badge } from '@/shared/components/badge';
import { Button } from '@/shared/components/ui/button';
import { PAYMENT_MESSAGE_META, PAYMENT_MESSAGE_TYPES } from '@/features/contract-settings/lib/payment-messages';

function ButtonPreview({ label, text, link }) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted p-3">
      <p className="mb-1 text-xs font-bold text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{text || '—'}</p>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" dir="ltr" className="mt-1 inline-flex items-center gap-1 break-all text-xs text-primary hover:underline">
          <ExternalLink className="size-3 shrink-0" />
          {link}
        </a>
      ) : (
        <span className="mt-1 block text-xs text-muted-foreground">—</span>
      )}
    </div>
  );
}

/** One fixed payment message (success or failed): preview when it exists, "add" prompt otherwise. */
export function PaymentMessageCard({ item, type, canEdit, onEdit }) {
  const meta = PAYMENT_MESSAGE_META[type];
  const Icon = type === PAYMENT_MESSAGE_TYPES.success ? CheckCircle2 : CircleAlert;
  const exists = Boolean(item?.id);

  return (
    <section className="flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card">
      <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-start gap-3">
          <Icon className="mt-1 size-5 text-muted-foreground" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-foreground">{meta.label}</h3>
              <Badge tone={meta.tone}>{exists ? 'مفعّلة' : 'غير مضافة'}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{meta.description}</p>
          </div>
        </div>
        {exists && canEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            تعديل
          </Button>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {exists ? (
          <>
            <div className="rounded-lg border border-border p-4">
              <p className="mb-2 text-xs font-bold text-muted-foreground">نص الرسالة</p>
              <p className="text-sm font-bold leading-7 text-foreground">{item.message || '—'}</p>
            </div>
            <div className="mt-auto grid gap-3 sm:grid-cols-2">
              <ButtonPreview label="الزر الأول" text={item.button_text} link={item.button_link} />
              <ButtonPreview label="الزر الثاني" text={item.button_text_2} link={item.button_link_2} />
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-6 text-center">
            <p className="font-bold text-foreground">لا توجد رسالة مضافة بعد</p>
            <p className="max-w-xs text-xs leading-6 text-muted-foreground">
              أضف رسالة واحدة من نوع {meta.label}، ثم عدّلها لاحقاً بدون حذف.
            </p>
            {canEdit && <Button onClick={onEdit}>إضافة</Button>}
          </div>
        )}
      </div>
    </section>
  );
}
