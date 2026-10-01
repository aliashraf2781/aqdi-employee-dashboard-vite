export const RETURN_ORDERS_PATH = '/home/return-orders';

/** The order details page lives in the orders feature; `from` lets its back link return here. */
export function orderDetailsPath(order) {
  const id = order?.id ?? order?.uuid;
  return `/home/orders/${id}?from=${encodeURIComponent(RETURN_ORDERS_PATH)}`;
}
