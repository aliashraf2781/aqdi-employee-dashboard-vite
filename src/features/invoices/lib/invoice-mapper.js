const PAYMENT_METHOD_LABELS = {
  creditcard: 'بطاقة ائتمان',
  moyasar: 'ميسر',
};

/** "2026-03-15" becomes "15/03/2026". */
export function formatPaymentDate(value) {
  if (!value) return '—';
  const [year, month, day] = String(value).split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

/** Maps one `/admin/payments` record to the shape the invoices table uses. */
export function mapPaymentToInvoice(payment = {}) {
  const user = payment.user ?? null;

  return {
    id: payment.id,
    invoiceNo: `INV-${payment.id}`,
    orderNo: payment.contract_uuid || '—',
    customerName: user?.name?.trim() || null,
    mobile: payment.user_mobile || user?.mobile || '—',
    contractType: payment.contract_type || null,
    amount: Number(payment.amount) || 0,
    source: PAYMENT_METHOD_LABELS[payment.payment_method] || payment.payment_method || '—',
    status: payment.status || 'unknown',
    date: formatPaymentDate(payment.payment_date),
    referenceNo: payment.contract_uuid || String(payment.id),
  };
}

/** The payments endpoint answers `{ data: { items, pagination } }`. */
export function extractPayments(responseBody) {
  const payload = responseBody?.data ?? responseBody;
  return Array.isArray(payload?.items) ? payload.items : [];
}
