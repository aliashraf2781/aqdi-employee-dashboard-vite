import { Badge } from '@/shared/components/badge';
import { DataTable } from '@/shared/components/data-table';
import { PAYMENT_STATUS } from '@/features/settings/lib/payment-filters';

const dash = (value) => value || '—';

const COLUMNS = [
  { key: 'name', header: 'الاسم', cell: (payment) => dash(payment.name || payment.name_payment) },
  { key: 'mobile', header: 'رقم الجوال', cell: (payment) => <span dir="ltr">{dash(payment.user_mobile)}</span> },
  {
    key: 'amount',
    header: 'المبلغ',
    className: 'font-bold',
    cell: (payment) => `${payment.amount} ${payment.tran_currency || ''}`,
  },
  { key: 'date', header: 'تاريخ الدفع', cell: (payment) => dash(payment.payment_date) },
  { key: 'hour', header: 'الساعة', cell: (payment) => dash(payment.payment_hour) },
  { key: 'contract', header: 'رقم العقد', cell: (payment) => <span dir="ltr">{dash(payment.contract_uuid)}</span> },
  { key: 'method', header: 'طريقة الدفع', cell: (payment) => dash(payment.payment_method) },
  { key: 'currency', header: 'العملة', cell: (payment) => dash(payment.tran_currency) },
  {
    key: 'status',
    header: 'الحالة',
    cell: (payment) => {
      const status = PAYMENT_STATUS[payment.status];
      return <Badge tone={status?.tone}>{status?.label || dash(payment.status)}</Badge>;
    },
  },
];

export function PaymentsTable({ payments, isLoading }) {
  return <DataTable columns={COLUMNS} rows={payments} isLoading={isLoading} emptyMessage="لا توجد مدفوعات للفلاتر المحددة." />;
}
