import { downloadCsv } from '@/shared/lib/csv';
import { CONTRACT_TYPE_META, getStatusMeta } from './invoice-meta';

export const INVOICE_CSV_HEADERS = [
  'رقم الفاتورة',
  'رقم العقد',
  'جوال العميل',
  'نوع العقد',
  'المبلغ',
  'المصدر',
  'الحالة',
  'التاريخ',
];

export function buildInvoiceCsvRows(invoices) {
  const rows = invoices.map((invoice) => [
    invoice.invoiceNo,
    invoice.orderNo,
    invoice.mobile,
    CONTRACT_TYPE_META[invoice.contractType]?.label ?? '—',
    invoice.amount,
    invoice.source,
    getStatusMeta(invoice.status).label,
    invoice.date,
  ]);
  return [INVOICE_CSV_HEADERS, ...rows];
}

export function exportInvoicesCsv(invoices) {
  downloadCsv(buildInvoiceCsvRows(invoices), 'invoices');
}
