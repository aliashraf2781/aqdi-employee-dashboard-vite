export const PERIOD_FILTERS = [
  { value: 'today', label: 'اليوم' },
  { value: 'month', label: 'الشهر' },
  { value: 'year', label: 'السنة' },
];

export const STATUS_FILTERS = [
  { value: '', label: 'الكل' },
  { value: 'success', label: 'ناجحة' },
  { value: 'failed', label: 'فشلت' },
];

export const PAYMENT_STATUS = {
  success: { label: 'ناجحة', tone: 'success' },
  failed: { label: 'فشلت', tone: 'danger' },
};

/** The API cannot filter by status, so it is applied on the loaded page. */
export function filterByStatus(payments, status) {
  return status ? payments.filter((payment) => payment.status === status) : payments;
}
