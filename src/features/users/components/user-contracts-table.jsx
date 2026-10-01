import { Copy, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/shared/components/badge';
import { DataTable } from '@/shared/components/data-table';
import { formatDate } from '@/shared/lib/format';
import { isDraftOrderRow } from '@/features/users/lib/draft-order';

const NO_VALUE = '—';

function OrderNumberCell({ contract }) {
  function copyNumber() {
    navigator.clipboard.writeText(String(contract.uuid));
    toast.success('تم نسخ رقم الطلب');
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-center gap-2">
        <span className="font-bold">{contract.uuid || NO_VALUE}</span>
        {contract.uuid && (
          <button type="button" onClick={copyNumber} aria-label="نسخ رقم الطلب" className="text-muted-foreground hover:text-primary">
            <Copy className="size-3.5" />
          </button>
        )}
      </div>
      {isDraftOrderRow(contract) && <Badge tone="warning">مسودة</Badge>}
    </div>
  );
}

/** The API sends each status with its own display color, so this one color is data-driven. */
function ContractStatusBadge({ status }) {
  if (!status?.color) return <Badge tone="neutral">{status?.name || NO_VALUE}</Badge>;

  return (
    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: `${status.color}33`, color: status.color }}>
      {status.name || NO_VALUE}
    </span>
  );
}

const COLUMNS = [
  { key: 'uuid', header: 'رقم الطلب', cell: (contract) => <OrderNumberCell contract={contract} /> },
  { key: 'type', header: 'نوع العقد', cell: (contract) => contract.contract_type || NO_VALUE },
  {
    key: 'amount',
    header: 'المبلغ',
    cell: (contract) => <span className="font-bold text-success">{parseFloat(contract.amount_payment || 0).toLocaleString('ar-EG')}</span>,
  },
  {
    key: 'payment',
    header: 'حالة الدفع',
    cell: (contract) => <Badge tone={contract.is_paid ? 'success' : 'warning'}>{contract.payment_label_ar || NO_VALUE}</Badge>,
  },
  { key: 'created_at', header: 'تاريخ الإنشاء', className: 'whitespace-nowrap', cell: (contract) => formatDate(contract.created_at) },
  { key: 'status', header: 'الحالة', cell: (contract) => <ContractStatusBadge status={contract.status} /> },
  { key: 'employee', header: 'الاستلام', cell: (contract) => contract.employee_name || NO_VALUE },
  {
    key: 'actions',
    header: 'الإجراءات',
    cell: (contract) => (
      <Link to={`/home/orders/${contract.id}`} aria-label="عرض الطلب" className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground">
        <Eye className="size-4" />
      </Link>
    ),
  },
];

export function UserContractsTable({ contracts }) {
  return (
    <section className="mt-6">
      <h2 className="mb-4 text-lg font-bold">طلبات المستخدم :</h2>
      <DataTable columns={COLUMNS} rows={contracts} emptyMessage="لا يوجد طلبات مرتبطة بهذا المستخدم حالياً." />
    </section>
  );
}
