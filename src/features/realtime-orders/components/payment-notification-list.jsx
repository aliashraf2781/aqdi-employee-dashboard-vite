import { CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/shared/components/badge';
import { Card } from '@/shared/components/card';
import { EmptyState } from '@/shared/components/empty-state';
import { Pagination } from '@/shared/components/pagination';
import { PageLoader } from '@/shared/components/page-loader';
import { cn } from '@/shared/lib/cn';
import { useTodayPayments } from '../hooks/use-today-payments';

const STATUS_LABELS = { success: 'ناجحة', failed: 'فشلت', pending: 'قيد الانتظار' };
const STATUS_TONES = { success: 'success', failed: 'danger' };

function PaymentItem({ payment }) {
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{payment.name || payment.name_payment || 'عملية دفع'}</p>
          <p className="text-xs tabular-nums text-muted-foreground" dir="ltr">
            {payment.user_mobile || payment.contract_uuid || '—'}
          </p>
        </div>
        <Badge tone={STATUS_TONES[payment.status] ?? 'neutral'} className="shrink-0">
          {STATUS_LABELS[payment.status] || payment.status || '—'}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-sm font-bold">
        <span className="tabular-nums text-primary">
          {payment.amount} {payment.tran_currency || 'ريال'}
        </span>
        <span className="font-medium text-muted-foreground">{payment.payment_hour || payment.payment_date || ''}</span>
      </div>
    </div>
  );
}

/** Today's payments: a counter card (with a link to the invoices) and the list of payments. */
export function PaymentNotificationList({ onNavigate }) {
  const [page, setPage] = useState(1);
  const { payments, pagination, total, isLoading, isFetching } = useTodayPayments(page);

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <p className="font-bold">مدفوعات اليوم</p>
          <CreditCard className="size-5 text-primary" />
        </div>
        <p className="text-3xl font-black tabular-nums">{total}</p>
        <Link to="/home/invoices" onClick={onNavigate} className="w-fit text-xs font-bold text-primary hover:underline">
          عرض كل الفواتير
        </Link>
      </Card>

      <div className={cn('flex flex-col gap-2.5', isFetching && 'pointer-events-none opacity-60')}>
        {payments.length === 0 ? (
          <EmptyState message="لا توجد مدفوعات اليوم" />
        ) : (
          payments.map((payment) => <PaymentItem key={payment.id} payment={payment} />)
        )}
      </div>

      <Pagination page={page} lastPage={pagination?.last_page} onPageChange={setPage} />
    </div>
  );
}
