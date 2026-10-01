// Query key roots shared by every order screen. Lists of other screens (realtime,
// returns, ...) use these roots, so one invalidation refreshes them all.
export const ALL_ORDERS_QUERY_KEY = 'all-orders';
export const REALTIME_ORDERS_QUERY_KEY = 'realtime-orders';
export const REALTIME_NEW_ORDERS_QUERY_KEY = 'realtime-new-orders';
export const SINGLE_ORDER_QUERY_KEY = 'single-order';
export const CONTRACT_STATUSES_QUERY_KEY = 'status';
export const CONTRACT_STATUSES_ACTIVE_QUERY_KEY = 'contract-statuses-active';
export const UNRECEIVED_ORDERS_TOTAL_QUERY_KEY = 'unReceivedOrdersTotal';
export const RETURNED_ORDERS_TOTAL_QUERY_KEY = 'returnedOrdersTotal';
export const CONTRACT_PAID_QUERY_KEY = 'contractPaidByEmployees';

/** List roots that go stale after any order mutation. */
const ORDER_LIST_ROOTS = [
  'orders',
  'completedOrders',
  'receivedOrders',
  'canceledOrders',
  'reliableOrders',
  'draftCompletedOrders',
  'returnOrders',
  CONTRACT_PAID_QUERY_KEY,
  'inCompletedOrders',
  'orders-whatsapp-completed',
  'orders-whatsapp-incompleted',
  REALTIME_NEW_ORDERS_QUERY_KEY,
  REALTIME_ORDERS_QUERY_KEY,
  ALL_ORDERS_QUERY_KEY,
];

const COUNT_ROOTS = [
  'orders-all-total',
  'order-status-count',
  'unReceivedOrders',
  UNRECEIVED_ORDERS_TOTAL_QUERY_KEY,
  RETURNED_ORDERS_TOTAL_QUERY_KEY,
  'dashboard-analytics-quick',
];

const REFUND_ROOTS = ['refundContracts', 'refundContractsLookup', 'refundContractsSummary', 'returnOrders'];

function toKey(queryKey) {
  if (!queryKey) return null;
  return Array.isArray(queryKey) ? queryKey : [queryKey];
}

/** Marks matching queries stale and refetches them, inactive ones too, so a page opened later is never a pre-change snapshot. */
function invalidate(queryClient, queryKey) {
  const key = toKey(queryKey);
  if (key) queryClient.invalidateQueries({ queryKey: key, refetchType: 'all' });
}

function invalidateSingleOrder(queryClient, orderId) {
  if (orderId == null || orderId === '') return;
  invalidate(queryClient, [SINGLE_ORDER_QUERY_KEY, orderId]);
  if (String(orderId) !== orderId) invalidate(queryClient, [SINGLE_ORDER_QUERY_KEY, String(orderId)]);
}

/** Refresh order lists, counters and (optionally) one order's detail cache. */
export function invalidateOrdersCaches(queryClient, { queryKey, orderId } = {}) {
  [...ORDER_LIST_ROOTS, ...COUNT_ROOTS].forEach((root) => invalidate(queryClient, [root]));
  invalidateSingleOrder(queryClient, orderId);
  invalidate(queryClient, queryKey);
}

/** Refund / return flows plus the underlying order caches. */
export function invalidateRefundCaches(queryClient, { queryKey, orderId } = {}) {
  invalidateOrdersCaches(queryClient, { queryKey, orderId });
  [...REFUND_ROOTS, CONTRACT_STATUSES_QUERY_KEY].forEach((root) => invalidate(queryClient, [root]));
}

/** After creating/editing contract status definitions: labels and colors show on lists and counters. */
export function invalidateContractStatusCaches(queryClient) {
  invalidate(queryClient, [CONTRACT_STATUSES_QUERY_KEY]);
  invalidate(queryClient, [CONTRACT_STATUSES_ACTIVE_QUERY_KEY]);
  invalidateOrdersCaches(queryClient);
}
