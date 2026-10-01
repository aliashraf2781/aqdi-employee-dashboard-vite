import { fileNameFromUrl, resolveImageUrl } from '../national-address';

export function mapTotalPrice(totalPrice) {
  if (!totalPrice || typeof totalPrice !== 'object') return null;
  const items = Array.isArray(totalPrice.items)
    ? totalPrice.items.map((item) => ({
        key: item.key,
        label: item.label,
        amount: item.amount,
        percent: item.percent ?? null,
      }))
    : [];
  return {
    items,
    subtotal: totalPrice.subtotal ?? null,
    tax_percent: totalPrice.tax_percent ?? null,
    total: totalPrice.total_price ?? null,
  };
}

export function mapContractPayments(payments) {
  if (!Array.isArray(payments)) return [];
  return payments.map((payment, index) => ({
    id: payment.id ?? index,
    name: payment.name,
    amount: payment.amount,
    status: payment.status,
    payment_date: payment.payment_date,
    payment_method: payment.payment_method,
  }));
}

export function mapStatusTimeline(timeline) {
  if (!Array.isArray(timeline)) return [];
  return timeline.map((entry, index) => ({
    id: entry.id ?? index,
    label: entry.status_label ?? entry.status,
    color: entry.status_color,
    description: entry.status_description,
    created_at: entry.created_at,
    state: entry.state,
  }));
}

export function mapDeedAttachment(url, label) {
  const fileUrl = resolveImageUrl(url);
  if (!fileUrl) return null;
  return {
    label,
    file_url: fileUrl,
    file_name: fileNameFromUrl(fileUrl),
  };
}
