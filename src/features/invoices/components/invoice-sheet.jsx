import { forwardRef } from 'react';
import { CONTRACT_TYPE_META, getInvoiceItemDescription, getStatusMeta } from '../lib/invoice-meta';
import { RiyalIcon } from './riyal-icon';

function InfoBox({ label, children }) {
  return (
    <div className="rounded-lg bg-surface-muted px-3 py-2.5">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{children}</p>
    </div>
  );
}

/** The printable invoice. The preview dialog shows it and printElement() prints this exact node. */
export const InvoiceSheet = forwardRef(function InvoiceSheet({ invoice, customerName }, ref) {
  const isPaid = invoice.status === 'success';
  const customerLine = customerName ? `${customerName} (${invoice.mobile})` : invoice.mobile;

  return (
    <div ref={ref} dir="rtl" className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black leading-none text-primary">عقدي</h2>
          <p className="mt-1.5 text-xs font-semibold text-muted-foreground">منصة توثيق عقود الإيجار</p>
        </div>
        <dl className="text-start text-xs leading-7 text-muted-foreground">
          <div>
            رقم الفاتورة <b className="tabular-nums text-foreground">{invoice.invoiceNo}</b>
          </div>
          <div>
            التاريخ <b className="tabular-nums text-foreground">{invoice.date}</b>
          </div>
          <div>
            الرقم المرجعي <b className="tabular-nums text-foreground">{invoice.referenceNo}</b>
          </div>
        </dl>
      </div>

      <div className="my-4 h-0.5 rounded-full bg-primary" />

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <InfoBox label="العميل">{customerLine}</InfoBox>
        <InfoBox label="رقم الطلب">#{invoice.orderNo}</InfoBox>
        <InfoBox label="نوع العقد">{CONTRACT_TYPE_META[invoice.contractType]?.label ?? '—'}</InfoBox>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-surface-muted text-muted-foreground">
              <th className="w-12 px-3 py-2.5 text-start text-xs font-bold">#</th>
              <th className="px-3 py-2.5 text-start text-xs font-bold">الوصف</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-3 font-bold">1</td>
              <td className="px-3 py-3 font-medium">{getInvoiceItemDescription(invoice.contractType)}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex items-center justify-between bg-accent px-3.5 py-3 text-sm font-extrabold text-accent-foreground">
          <span>الإجمالي المستحق</span>
          <span className="tabular-nums">
            {Number(invoice.amount).toLocaleString('en-US')} <RiyalIcon />
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <span
          className={`inline-flex h-8 items-center rounded-full border px-4 text-xs font-bold ${
            isPaid ? 'border-success text-success' : 'border-danger text-danger'
          }`}
        >
          {getStatusMeta(invoice.status).label}
          {isPaid ? ' ✓' : ''}
        </span>
      </div>
    </div>
  );
});
