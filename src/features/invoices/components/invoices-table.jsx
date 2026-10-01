import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/shared/components/badge';
import { DataTable } from '@/shared/components/data-table';
import { Button } from '@/shared/components/ui/button';
import { CONTRACT_TYPE_META, getStatusMeta } from '../lib/invoice-meta';
import { RiyalIcon } from './riyal-icon';

async function copyInvoiceNumber(invoiceNo) {
  try {
    await navigator.clipboard.writeText(invoiceNo);
    toast.success('تم نسخ رقم الفاتورة');
  } catch {
    toast.error('تعذر نسخ رقم الفاتورة');
  }
}

function TypeBadge({ contractType }) {
  const meta = CONTRACT_TYPE_META[contractType];
  return meta ? <Badge tone={meta.tone}>{meta.label}</Badge> : <span className="text-muted-foreground">—</span>;
}

function StatusBadge({ status }) {
  const meta = getStatusMeta(status);
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function InvoicesTable({ invoices, isLoading, onSelectInvoice }) {
  const columns = [
    {
      key: 'invoiceNo',
      header: 'رقم الفاتورة',
      cell: (invoice) => (
        <div className="flex items-center gap-1.5">
          <span className="font-bold tabular-nums text-primary">{invoice.invoiceNo}</span>
          <Button
            variant="ghost"
            size="sm"
            aria-label="نسخ رقم الفاتورة"
            onClick={() => copyInvoiceNumber(invoice.invoiceNo)}
          >
            <Copy className="size-3.5" />
          </Button>
        </div>
      ),
    },
    { key: 'orderNo', header: 'رقم العقد', cell: (invoice) => <span dir="ltr">#{invoice.orderNo}</span> },
    { key: 'mobile', header: 'جوال العميل', cell: (invoice) => <span dir="ltr">{invoice.mobile}</span> },
    { key: 'type', header: 'نوع العقد', cell: (invoice) => <TypeBadge contractType={invoice.contractType} /> },
    {
      key: 'amount',
      header: 'المبلغ',
      cell: (invoice) => (
        <span className="font-bold tabular-nums">
          {invoice.amount.toLocaleString('en-US')} <RiyalIcon />
        </span>
      ),
    },
    { key: 'source', header: 'المصدر', cell: (invoice) => invoice.source },
    { key: 'status', header: 'الحالة', cell: (invoice) => <StatusBadge status={invoice.status} /> },
    { key: 'date', header: 'التاريخ', cell: (invoice) => <span className="tabular-nums">{invoice.date}</span> },
    {
      key: 'actions',
      header: 'الإجراءات',
      cell: (invoice) => (
        <Button variant="outline" size="sm" onClick={() => onSelectInvoice(invoice)}>
          عرض
        </Button>
      ),
    },
  ];

  return (
    <DataTable columns={columns} rows={invoices} isLoading={isLoading} emptyMessage="لا توجد فواتير مطابقة لبحثك" />
  );
}
