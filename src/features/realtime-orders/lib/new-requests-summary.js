import { getWaitingMinutes } from '@/features/orders';
import { CRITICAL_WAIT_MINUTES, WARNING_WAIT_MINUTES } from './waiting-time';

const countWaitingAtLeast = (orders, minutes) => orders.filter((order) => getWaitingMinutes(order) >= minutes).length;

/** Total of new orders: the API summary wins, then the count reported by the list, then what is loaded. */
export function getNewOrdersTotal({ summary, totalCount, orders }) {
  return summary?.total_new_orders ?? totalCount ?? orders.length;
}

/**
 * The three counters of the "new requests" dialog: total, over 15 and over 30 minutes.
 * The API sends its own cards (with labels) when it can; otherwise they are counted from the loaded orders.
 */
export function buildSummaryCards({ summary, orders, total }) {
  if (Array.isArray(summary?.cards) && summary.cards.length > 0) return summary.cards;

  return [
    {
      key: 'total_new_orders',
      label: summary?.total_new_orders_label || 'إجمالي الطلبات الجديدة',
      count: total,
    },
    {
      key: 'exceeded_15_minutes',
      label: summary?.exceeded_15_minutes_label || 'تجاوزت 15 دقيقة',
      count: summary?.exceeded_15_minutes ?? countWaitingAtLeast(orders, WARNING_WAIT_MINUTES),
    },
    {
      key: 'exceeded_30_minutes',
      label: summary?.exceeded_30_minutes_label || 'تجاوزت 30 دقيقة',
      count: summary?.exceeded_30_minutes ?? countWaitingAtLeast(orders, CRITICAL_WAIT_MINUTES),
    },
  ];
}
