import { Check, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/shared/components/badge';
import { PagedTableSection } from '@/features/employees/components/paged-table-section';
import { formatNumber } from '@/features/employees/lib/employee-display';

const NO_VALUE = '---';

function CopyableValue({ value, copiedMessage, dir }) {
  if (value === NO_VALUE) return <span>{value}</span>;

  function copy() {
    navigator.clipboard.writeText(String(value));
    toast.success(copiedMessage);
  }

  return (
    <span className="flex items-center gap-2">
      <span dir={dir}>{value}</span>
      <button type="button" onClick={copy} aria-label="نسخ" className="text-muted-foreground hover:text-foreground">
        <Copy className="size-3.5" />
      </button>
    </span>
  );
}

function ContractNumberCell({ item }) {
  const contractId = item.contract_id || item.id || NO_VALUE;
  const linkId = item.contract?.id ?? item.contract_id ?? item.id ?? null;

  return (
    <span className="flex items-center gap-3">
      <CopyableValue value={contractId} copiedMessage="تم نسخ رقم العقد" />
      {linkId != null && (
        <Link to={`/home/orders/${linkId}`} className="text-xs text-primary hover:underline">
          عرض
        </Link>
      )}
    </span>
  );
}

function ContractAmountCell({ item }) {
  const amount = item.refund_amount || item.contract?.amount;
  return (
    <span className="flex items-center gap-1.5 font-bold text-success">
      {amount ? formatNumber(amount) : NO_VALUE}
      {item.admin_confirmed && <Check className="size-3.5" />}
    </span>
  );
}

const COLUMNS = [
  { key: 'number', header: 'رقم العقد', cell: (item) => <ContractNumberCell item={item} /> },
  {
    key: 'phone',
    header: 'جوال العميل',
    cell: (item) => (
      <CopyableValue value={item.contract?.user?.phone || item.user?.phone || NO_VALUE} copiedMessage="تم نسخ رقم الجوال" dir="ltr" />
    ),
  },
  {
    key: 'type',
    header: 'نوع العقد',
    cell: (item) => (
      <Badge tone={item.kind === 'refundable' ? 'warning' : 'neutral'}>{item.kind === 'refundable' ? 'استرجاع طلب' : 'توثيق عقد'}</Badge>
    ),
  },
  { key: 'amount', header: 'الدفع / المبلغ', cell: (item) => <ContractAmountCell item={item} /> },
  {
    key: 'status',
    header: 'الحالة',
    cell: (item) => (
      <Badge tone={item.admin_confirmed ? 'success' : 'neutral'}>{item.admin_confirmed ? 'تم التوكيد' : 'قيد المعالجة'}</Badge>
    ),
  },
];

/** Contracts the employee received plus the ones that were refunded. */
export function EmployeeContractsTable({ receivedContracts, refundableContracts }) {
  const allContracts = [
    ...(receivedContracts ?? []).map((contract) => ({ ...contract, kind: 'received' })),
    ...(refundableContracts ?? []).map((contract) => ({ ...contract, kind: 'refundable' })),
  ];

  return (
    <PagedTableSection
      title="العقود التي وثّقها الموظف"
      rows={allContracts}
      columns={COLUMNS}
      emptyMessage="لا عقود مرتبطة بهذا الموظف حاليًا."
      getRowKey={(item) => `${item.kind}-${item.id ?? item.contract_id}`}
    />
  );
}
