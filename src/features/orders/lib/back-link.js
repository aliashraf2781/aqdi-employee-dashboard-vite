/** Where the "back" link of the order details page goes, from the `?from=` the list that opened it passed. */
export function resolveBackLink(from) {
  if (from?.startsWith('/home/realtime-orders')) return { href: '/home/realtime-orders', label: 'الطلبات مباشر' };
  if (from?.startsWith('/home/clients') || from?.startsWith('/home/users')) return { href: from, label: 'العملاء' };
  if (from?.startsWith('/home/')) return { href: from, label: 'رجوع' };
  return { href: '/home/orders', label: 'جميع الطلبات' };
}

/** True when the order is a lease renewal (renewal of an existing contract). */
export function isLeaseRenewalOrder(orderData) {
  return [orderData?.contract_summary, orderData?.step1, orderData].some((source) => source?.instrument_type_key === 'lease_renewal');
}
