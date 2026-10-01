const ORDERS_ROUTE = '/home/orders';
const REALTIME_ROUTE = '/home/realtime-orders';

/**
 * Where `/home/realtime-orders/:id` goes: the order details page of the orders feature.
 * `?from=` is kept when present so the "back" link there returns to the screen that opened it.
 */
export function buildOrderRedirectPath(orderId, searchParams) {
  const params = new URLSearchParams(searchParams);
  if (!params.get('from')) params.set('from', REALTIME_ROUTE);
  return `${ORDERS_ROUTE}/${orderId}?${params.toString()}`;
}
