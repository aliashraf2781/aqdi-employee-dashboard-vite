import { CreditCard } from 'lucide-react';
import { paymentMethodLabel, paymentStatusLabel } from '../../lib/financial-display';
import { AccentCard, Money } from './detail-primitives';

/** Payment history of the contract (each payment with method, status and date). */
export function PaymentsCard({ payments }) {
  if (!payments?.length) return null;

  return (
    <AccentCard tone="info" icon={CreditCard} title="سجل المدفوعات">
      <div className="space-y-2.5">
        {payments.map((payment) => (
          <div key={payment.id} className="space-y-1.5 rounded-xl bg-info-soft px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-bold">{payment.name || `دفعة #${payment.id}`}</span>
              <Money value={payment.amount} />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {payment.payment_method && (
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-bold text-info">{paymentMethodLabel(payment.payment_method)}</span>
              )}
              {payment.status && (
                <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-bold text-success">{paymentStatusLabel(payment.status)}</span>
              )}
              {payment.payment_date && <span className="text-xs font-medium tabular-nums text-muted-foreground">{payment.payment_date}</span>}
            </div>
          </div>
        ))}
      </div>
    </AccentCard>
  );
}
