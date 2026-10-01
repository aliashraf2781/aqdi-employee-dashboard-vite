/**
 * Public API of the orders feature. Other features (realtime-orders, return-orders, ...)
 * import order building blocks from here only.
 */

// --- Sidebar badge counters -------------------------------------------------
/** Number of orders still in the "new" status (sidebar badge of realtime-orders). */
export { useUnreceivedOrdersCount, useReturnedOrdersCount } from './hooks/use-order-badge-counts';
