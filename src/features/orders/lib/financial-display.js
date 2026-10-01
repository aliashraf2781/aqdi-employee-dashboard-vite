import { getOrderFinancialStep } from './order-detail-steps';

const PAYMENT_METHOD_LABELS = {
  creditcard: 'بطاقة ائتمان',
  mada: 'مدى',
  applepay: 'Apple Pay',
  stcpay: 'STC Pay',
};

export function paymentMethodLabel(value) {
  if (!value) return null;
  return PAYMENT_METHOD_LABELS[String(value).toLowerCase()] || value;
}

export function paymentStatusLabel(status) {
  if (status === 'success' || status === 'paid') return 'ناجح';
  if (status === 'pending') return 'قيد الانتظار';
  if (status === 'failed') return 'فشل';
  return status || null;
}

/** Normalizes the label of a tenant permission's input ("غرامه يوميه" variants become one text). */
export function roleInputLabel(label) {
  const text = String(label ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  const compact = text.replace(/[أإآا]/g, 'ا').replace(/ة/g, 'ه');
  return compact.includes('غرامه') && compact.includes('يومي') ? 'مبلغ الغرامة اليومية' : text;
}

/** Empty, non-numeric and zero amounts are not worth a row. */
export function isHiddenAmount(value) {
  if (value == null || value === '') return true;
  const amount = Number(typeof value === 'string' ? value.replace(/,/g, '').trim() : value);
  return !Number.isFinite(amount) || amount === 0;
}

/** Price quote the backend computed for the order (inside the financial step), or null. */
export function getServiceQuote(orderData) {
  if (!orderData) return null;
  const quote = getOrderFinancialStep(orderData)?.financial;
  return quote && typeof quote === 'object' && !Array.isArray(quote) ? quote : null;
}

export function isQuotePaid(quote) {
  return quote.is_paid === true || quote.is_paid === 1 || quote.is_paid === '1' || quote.payment_status === 'paid';
}

/** Quote lines that carry an amount. */
export function getQuoteDetails(quote) {
  if (!Array.isArray(quote?.details)) return [];
  return quote.details.filter((item) => item && !isHiddenAmount(item.amount));
}
