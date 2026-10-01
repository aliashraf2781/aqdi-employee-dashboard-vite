export const INVOICE_STATUS_META = {
  success: { label: 'ناجحة', tone: 'success' },
  failed: { label: 'فشلت', tone: 'danger' },
  refunded: { label: 'مسترجعة', tone: 'warning' },
  unknown: { label: 'غير معروفة', tone: 'neutral' },
};

export const CONTRACT_TYPE_META = {
  housing: { label: 'سكني', tone: 'success' },
  commercial: { label: 'تجاري', tone: 'warning' },
};

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'كل الحالات' },
  { value: 'success', label: 'ناجحة' },
  { value: 'failed', label: 'فشلت' },
];

export const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'كل الأنواع' },
  { value: 'housing', label: 'سكني' },
  { value: 'commercial', label: 'تجاري' },
];

export function getStatusMeta(status) {
  return INVOICE_STATUS_META[status] ?? INVOICE_STATUS_META.unknown;
}

export function getInvoiceItemDescription(contractType) {
  const kind = contractType === 'commercial' ? 'تجاري' : 'سكني';
  return `رسوم توثيق عقد ${kind} – صك إلكتروني – وزارة العدل`;
}
