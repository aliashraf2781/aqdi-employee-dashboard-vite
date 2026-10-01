import { Check, Wallet } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { getServiceQuote, isHiddenAmount, isQuotePaid } from '../../lib/financial-display';
import { AccentCard, Field, Money } from './detail-primitives';
import { QuoteBreakdown, TotalPriceBreakdown } from './price-breakdown';
import { SavedTerms } from './saved-terms';

function PaymentStateBadge({ isPaid, label }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
        isPaid ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
      )}
    >
      {isPaid && <Check className="size-3" />}
      {label}
    </span>
  );
}

/** Rent, payment state, price breakdown and the saved terms of the contract. */
export function FinancialCard({ order, orderData, onEdit }) {
  const financial = order.financial ?? {};
  const quote = getServiceQuote(orderData);
  const isPaid = quote ? isQuotePaid(quote) : Boolean(financial.paid);
  const paymentLabel = quote?.payment_label_ar || (financial.paid ? 'مدفوع' : 'غير مدفوع');

  return (
    <AccentCard
      tone={financial.missing_count ? 'danger' : 'brand'}
      icon={Wallet}
      title="البيانات المالية"
      missingCount={financial.missing_count}
      onEdit={onEdit}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {financial.payment_method && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{financial.payment_method}</span>
        )}
        <PaymentStateBadge isPaid={isPaid} label={paymentLabel} />
      </div>

      <div className="space-y-2">
        <Field label="بداية العقد" value={financial.start_date} />
        <Field label="المدة" value={financial.duration} />
        <Field label="الدفعات" value={financial.frequency} />
        {!isHiddenAmount(financial.rent) && (
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-muted-foreground">إجمالي الإيجار</span>
            <Money value={financial.rent} className="text-sm" />
          </div>
        )}
        <Field label="تأخير فرعي" value={financial.sub_delay} />
        <Field label="التأمين" value={financial.deposit} />
        <Field label="عضوية مميزة مجاناً" value={financial.premium_membership_for_free} />
        <Field label="اسم صاحب الحساب" value={financial.client_account_holder_name} />
        <Field label="رقم الحساب البنكي" value={financial.bank_account_number} />
        <Field label="ملاحظات التعديل" value={financial.notes_edits} />
      </div>

      {quote ? <QuoteBreakdown quote={quote} /> : <TotalPriceBreakdown totalPrice={financial.total_price} />}

      <SavedTerms order={order} orderData={orderData} />

      {!quote && (
        <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
          <span className="text-xs font-medium text-muted-foreground">المبلغ المدفوع</span>
          <span className="inline-flex items-center gap-1.5">
            {financial.fees_paid && <Check className="size-3.5 text-success" />}
            <Money value={financial.fees} />
          </span>
        </div>
      )}
    </AccentCard>
  );
}
